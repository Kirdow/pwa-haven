/* eslint-env browser */
import { SubtitleParser, SubtitleStream } from 'matroska-subtitles'
import SubtitlesOctopus from '../lib/subtitles-octopus.js'
import { toTS, videoRx, subRx } from '../../../shared/util.js'

const defaultHeader = `[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default, Roboto Medium,26,&H00FFFFFF,&H000000FF,&H00020713,&H00000000,0,0,0,0,100,100,0,0,1,1.3,0,2,20,20,23,1
[Events]

`
const stylesRx = /^Style:[^,]*/gm
export default class Subtitles {
  constructor (video, files, selected, onHeader) {
    this.video = video
    this.selected = selected || null
    this.files = files || []
    this.headers = []
    this.tracks = []
    this._tracksString = []
    this._stylesMap = {
      Default: 0
    }
    this.fonts = ['Roboto.ttf']
    this.renderer = null
    this.parsed = false
    this.stream = null
    this.parser = null
    this.current = 0
    this.onHeader = onHeader
    this.videoFiles = files.filter(file => videoRx.test(file.name))
    this.subtitleFiles = []
    this.timeout = null

    if (this.selected.name.endsWith('.mkv') && this.selected.createReadStream) {
      this.parseFonts(this.selected)
      this.selected.onStream = ({ stream, req }, cb) => {
        if (req.destination === 'video' && !this.parsed) {
          this.stream = new SubtitleStream(this.stream)
          this.handleSubtitleParser(this.stream, true)
          stream.pipe(this.stream)
          cb(this.stream)
        }
      }
    }
    this.findSubtitleFiles(this.selected)
  }

  async findSubtitleFiles (targetFile) {
    const videoName = targetFile.name.substring(0, targetFile.name.lastIndexOf('.')) || targetFile.name
    // array of subtitle files that match video name, or all subtitle files when only 1 vid file
    const subfiles = this.files.filter(file => {
      return !this.subtitleFiles.some(sub => { // exclude already existing files
        return sub.lastModified === file.lastModified && sub.name === file.name && sub.size === file.size
      }) && subRx.test(file.name) && (this.videoFiles.length === 1 ? true : file.name.includes(videoName))
    })
    if (subfiles.length) {
      this.parsed = true
      const length = this.headers.length
      for (const [i, file] of subfiles.entries()) {
        const index = i + length
        this.subtitleFiles[index] = file
        const type = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
        const subname = file.name.slice(0, file.name.lastIndexOf('.'))
        // sub name could contain video name with or without extension, possibly followed by lang, or not.
        const name = subname.includes(targetFile.name)
          ? subname.replace(targetFile.name, '')
          : subname.replace(targetFile.name.slice(0, targetFile.name.lastIndexOf('.')), '')
        this.headers[index] = {
          header: defaultHeader,
          language: name.replace(/[,._-]/g, ' ').trim() || 'Track ' + index,
          number: index,
          type
        }
        this.onHeader()
        this.tracks[index] = []
        const subtitles = await Subtitles.convertSubFile(file, type)
        if (type === 'ass') {
          this.headers[index].header = subtitles
        } else {
          this.headers[index].header += subtitles.join('\n')
        }
      }
      if (!this.current) {
        this.current = 0
        if (!this.renderer) this.initSubtitleRenderer()
        this.selectCaptions(this.current)
        this.onHeader()
      }
    }
  }

  async initSubtitleRenderer () {
    if (!this.renderer) {
      this.renderer = new SubtitlesOctopus({
        video: this.video,
        subContent: this.headers[this.current].header.slice(0, -1),
        fonts: this.fonts,
        workerUrl: 'lib/subtitles-octopus-worker.js'
      })
      this.selectCaptions(this.current)
    }
  }

  static async convertSubFile (file, type) {
    const srtRx = /(?:\d+\n)?(\S{9,12})\s?-->\s?(\S{9,12})(.*)\n([\s\S]*)$/i
    const srt = text => {
      const subtitles = []
      const replaced = text.replace(/\r/g, '')
      for (const split of replaced.split('\n\n')) {
        const match = split.match(srtRx)
        if (match) {
          // timestamps
          match[1] = match[1].match(/.*[.,]\d{2}/)[0]
          match[2] = match[2].match(/.*[.,]\d{2}/)[0]
          if (match[1].length === 9) {
            match[1] = '0:' + match[1]
          } else {
            if (match[1][0] === '0') {
              match[1] = match[1].substring(1)
            }
          }
          match[1].replace(',', '.')
          if (match[2].length === 9) {
            match[2] = '0:' + match[2]
          } else {
            if (match[2][0] === '0') {
              match[2] = match[2].substring(1)
            }
          }
          match[2].replace(',', '.')
          // create array of all tags
          const matches = match[4].match(/<[^>]+>/g)
          if (matches) {
            matches.forEach(matched => {
              if (/<\//.test(matched)) { // check if its a closing tag
                match[4] = match[4].replace(matched, matched.replace('</', '{\\').replace('>', '0}'))
              } else {
                match[4] = match[4].replace(matched, matched.replace('<', '{\\').replace('>', '1}'))
              }
            })
          }
          subtitles.push('Dialogue: 0,' + match[1].replace(',', '.') + ',' + match[2].replace(',', '.') + ',Default,,0,0,0,,' + match[4].replace(/\n/g, '\\N'))
        }
      }
      return subtitles
    }
    const subRx = /[{[](\d+)[}\]][{[](\d+)[}\]](.+)/i
    const sub = text => {
      const subtitles = []
      const replaced = text.replace(/\r/g, '')
      let frames = 1000 / Number(replaced.match(subRx)[3])
      if (!frames || isNaN(frames)) frames = 41.708
      for (const split of replaced.split('\n')) {
        const match = split.match(subRx)
        if (match) subtitles.push('Dialogue: 0,' + toTS((match[1] * frames) / 1000, 1) + ',' + toTS((match[2] * frames) / 1000, 1) + ',Default,,0,0,0,,' + match[3].replace('|', '\\N'))
      }
      return subtitles
    }
    const text = await file.text()
    const subtitles = type === 'ass' ? text : []
    if (type === 'ass') {
      return subtitles
    } else if (type === 'srt' || type === 'vtt') {
      return srt(text)
    } else if (type === 'sub') {
      return sub(text)
    } else {
      // subbers have a tendency to not set the extensions properly
      if (srtRx.test(text)) return srt(text)
      if (subRx.test(text)) return sub(text)
    }
  }

  constructSub (subtitle, isNotAss, index) {
    if (isNotAss === true) { // converts VTT or other to SSA
      const matches = subtitle.text.match(/<[^>]+>/g) // create array of all tags
      if (matches) {
        matches.forEach(match => {
          if (/<\//.test(match)) { // check if its a closing tag
            subtitle.text = subtitle.text.replace(match, match.replace('</', '{\\').replace('>', '0}'))
          } else {
            subtitle.text = subtitle.text.replace(match, match.replace('<', '{\\').replace('>', '1}'))
          }
        })
      }
      // replace all html special tags with normal ones
      subtitle.text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, '\\h').replace(/\n/g, '\\N')
    }
    return {
      Start: subtitle.time,
      Duration: subtitle.duration,
      Style: this._stylesMap[subtitle.style || 'Default'] || 0,
      Name: subtitle.name || '',
      MarginL: Number(subtitle.marginL) || 0,
      MarginR: Number(subtitle.marginR) || 0,
      MarginV: Number(subtitle.marginV) || 0,
      Effect: subtitle.effect || '',
      Text: subtitle.text || '',
      ReadOrder: 1,
      Layer: Number(subtitle.layer) || 0,
      _index: index
    }
  }

  parseSubtitles () { // parse all existing subtitles for a file
    return new Promise((resolve) => {
      if (this.selected.name.endsWith('.mkv')) {
        let parser = new SubtitleParser()
        this.handleSubtitleParser(parser, true)
        const finish = () => {
          console.log('Sub parsing finished', toTS((performance.now() - t0) / 1000))
          this.parsed = true
          this.stream?.destroy()
          this.parser?.destroy()
          fileStream.destroy()
          this.stream = undefined
          this.parser = undefined
          this.selectCaptions(this.current)
          parser = undefined
          resolve()
        }
        parser.once('tracks', tracks => {
          if (!tracks.length) finish()
        })
        parser.once('finish', finish)
        const t0 = performance.now()
        console.log('Sub parsing started')
        const fileStream = this.selected.createReadStream()
        this.parser = fileStream.pipe(parser)
      } else {
        resolve()
      }
    })
  }

  handleSubtitleParser (parser, skipFile) {
    parser.once('tracks', tracks => {
      if (!tracks.length) {
        this.parsed = true
        parser?.destroy()
      } else {
        for (const track of tracks) {
          if (!this.tracks[track.number]) {
            // overwrite webvtt or other header with custom one
            if (track.type !== 'ass') track.header = defaultHeader
            if (!this.current) {
              this.current = track.number
            }
            this.tracks[track.number] = []
            this._tracksString[track.number] = new Set()
            this.headers[track.number] = track
            const styleMatches = track.header.match(stylesRx)
            for (let i = 0; i < styleMatches.length; ++i) {
              const style = styleMatches[i].replace('Style:', '').trim()
              this._stylesMap[style] = i + 1
            }

            this.onHeader()
          }
        }
      }
    })
    parser.on('subtitle', async (subtitle, trackNumber) => {
      if (!this.parsed) {
        if (!this.renderer) this.initSubtitleRenderer()
        const string = JSON.stringify(subtitle)
        if (!this._tracksString[trackNumber].has(string)) {
          this._tracksString[trackNumber].add(string)
          const assSub = this.constructSub(subtitle, this.headers[trackNumber].type !== 'ass', this.tracks[trackNumber].length)
          this.tracks[trackNumber].push(assSub)
          if (this.current === trackNumber) this.renderer.createEvent(assSub)
        }
      }
    })
    if (!skipFile) {
      parser.on('file', file => {
        if (file.mimetype === 'application/x-truetype-font' || file.mimetype === 'application/font-woff' || file.mimetype === 'application/vnd.ms-opentype') {
          this.fonts.push(URL.createObjectURL(new Blob([file.data], { type: file.mimetype })))
        }
      })
    }
  }

  parseFonts (file) {
    const stream = new SubtitleParser()
    this.handleSubtitleParser(stream)
    stream.once('tracks', tracks => {
      if (!tracks.length) {
        this.parsed = true
        stream.destroy()
        fileStreamStream.destroy()
      }
    })
    stream.once('subtitle', () => {
      fileStreamStream.destroy()
      stream.destroy()
      if (this.selected) {
        this.renderer?.destroy()
        this.renderer = null
        this.initSubtitleRenderer()
        // re-create renderer with fonts
      }
    })
    const fileStreamStream = file.createReadStream()
    fileStreamStream.pipe(stream)
  }

  selectCaptions (trackNumber) {
    if (trackNumber !== undefined) {
      this.current = Number(trackNumber)
      this.onHeader()
      if (this.renderer && this.headers) {
        this.renderer.setTrack(this.current !== -1 ? this.headers[this.current].header.slice(0, -1) : defaultHeader)
        if (this.tracks[this.current]) {
          for (const subtitle of this.tracks[this.current]) this.renderer.createEvent(subtitle)
        }
      }
    }
  }

  destroy () {
    this.stream?.destroy()
    this.parser?.destroy()
    this.renderer?.destroy()
    this.files = null
    this.video = null
    this.selected = null
    this.tracks = null
    this.headers = null
    this.onHeader()
    this.fonts?.forEach(file => URL.revokeObjectURL(file))
  }
}
