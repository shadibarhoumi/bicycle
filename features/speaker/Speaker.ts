import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import toast from 'react-hot-toast'
import {
  VoiceName,
  VoiceProvider,
  Voices,
  Voice,
} from '@features/speaker/Voice'

const escape = (text: string) =>
  text.replaceAll('&', 'n').replaceAll('<', ' ').replaceAll('>', ' ')

const BENJAMIN_REGULAR = 'en-US-BenjaminRUS'
const VOICE = BENJAMIN_REGULAR
const RATE = '+50.00%'
const ssmlHead = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${VOICE}"><prosody rate="${RATE}">`

const ssmlTail = '</prosody></voice></speak>'

const toSSML = (text: string) => `${ssmlHead}${text}${ssmlTail}`

export const HEAD_LENGTH = ssmlHead.length
const WINDOW_SIZE = 300

interface Chunk {
  blob: Blob
  offset: number
  length: number
}
export class Speaker {
  playing = false
  text = ''
  speechOffset
  donePlaying = true
  wordBoundaries: any[] = []
  // speech synthesis
  speechConfig
  audioConfig!: sdk.AudioConfig
  player!: sdk.SpeakerAudioDestination
  synthesizer!: sdk.SpeechSynthesizer
  // setters from TextEditor state
  setPlaying: (playing: boolean) => void
  onSynthesize: (numChars: number) => void
  // google TTS
  // audio element in TextEditor
  googleAudioRef: React.RefObject<HTMLAudioElement>
  voice: Voice = Voices.enGoogleJStandard
  rate = 1.5
  googleEndedListenerAdded = false
  setSpeechOffset: (offset: number) => void
  setSpeechLength: (length: number) => void
  queue: Chunk[] = []
  currentChunk: Chunk | null = null

  constructor(
    setPlaying: (playing: boolean) => void,
    onSynthesize: (numChars: number) => void,
    googleAudioRef: React.RefObject<HTMLAudioElement>,
    setSpeechOffset: (offset: number) => void,
    setSpeechLength: (length: number) => void,
  ) {
    this.speechOffset = 0
    this.onSynthesize = onSynthesize
    this.googleAudioRef = googleAudioRef
    this.setSpeechOffset = setSpeechOffset
    this.setSpeechLength = setSpeechLength

    this.setPlaying = (playing: boolean) => {
      this.playing = playing
      setPlaying(playing)
    }

    // initialize api
    if (typeof window !== 'undefined') {
      speechSynthesis.getVoices()
      this.speechConfig = sdk.SpeechConfig.fromSubscription(
        '1cda9a0880d142829774794f19ded197',
        'westus',
      )
    }
  }

  setVoiceFromName = (voiceName: VoiceName) => {
    this.voice = Voices[voiceName]
  }

  pause = () => {
    if (this.voice.provider === VoiceProvider.Azure) {
      this.player?.pause()
    } else if (this.voice.provider === VoiceProvider.Google) {
      this.googleAudioRef.current?.pause()
    }
    this.setPlaying(false)
  }

  playFromOffset = (speechOffset: number) => {
    this.setPlaying(true)
    this.speechOffset = speechOffset
    this.setSpeechOffset(speechOffset)
    if (this.voice.provider === VoiceProvider.Azure) {
      this.speakAzure()
    } else if (this.voice.provider === VoiceProvider.Google) {
      // empty queue
      this.queue = []
      this.speakGoogle()
    }
  }

  play = () => {
    this.setPlaying(true)

    if (this.voice.provider === VoiceProvider.Azure) {
      if (this.donePlaying) {
        this.speakAzure()
      } else {
        this.player?.resume()
      }
    } else if (this.voice.provider === VoiceProvider.Google) {
      if (this.donePlaying) {
        this.playFromOffset(this.speechOffset)
      } else {
        this.googleAudioRef.current?.play()
      }
    }
  }

  togglePlay = (name: VoiceName, rate: number) => {
    this.voice = Voices[name]
    this.rate = rate
    if (this.playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  fetchGoogleAudio = async (text: string) => {
    const res = await fetch('/api/speak', {
      method: 'POST',
      body: JSON.stringify({
        text: text,
        voice: this.voice,
        rate: this.rate,
      }),
    })
    const response = await res.json()
    const buffer = Buffer.from(response.audioContent.data)
    const blob = new Blob([buffer])
    return blob
  }

  getChunkText = (offset: number) => {
    if (this.text.length - offset <= WINDOW_SIZE) {
      return this.text.substr(offset)
    }

    let chunkText = ''
    let factor = 1
    while (!chunkText.length) {
      const splitText = this.text
        .substr(offset, WINDOW_SIZE * factor)
        .split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/)
      // if we got more than one chunk, first element is guaranteed to be a full sentence
      if (splitText.length >= 1) {
        if (factor === 1) {
          // if we haven't had to enlarge window to get a single sentence,
          // then choose all elements except last
          chunkText = splitText.slice(0, -1).join(' ')
        } else {
          // if we had to enlarge window to get a full sentence, then we know that
          // first element is a long sentence
          chunkText = splitText[0]
          // sanity check: if sentence is way too long, just cut it down to WINDOW_SIZE
          if (chunkText.length > WINDOW_SIZE * 5) {
            chunkText = this.text.substr(offset, WINDOW_SIZE)
          }
        }
      }
      factor++
    }
    return chunkText
  }

  fetchChunk = async (offset: number): Promise<Chunk> => {
    const chunkText = this.getChunkText(offset)
    const { length } = chunkText
    const blob = await this.fetchGoogleAudio(chunkText)
    return {
      blob,
      offset,
      length,
    }
  }

  enqueueChunk = async (offset: number) => {
    const chunk = await this.fetchChunk(offset)
    this.queue.push(chunk)
  }

  speakGoogle = async () => {
    if (this.queue.length) {
      // if we have a chunk queued for us
      this.currentChunk = this.queue.shift() as Chunk
    } else {
      this.currentChunk = await this.fetchChunk(this.speechOffset)
    }

    if (this.googleAudioRef.current && this.currentChunk) {
      const audio = this.googleAudioRef.current
      audio.src = URL.createObjectURL(this.currentChunk.blob)
      this.donePlaying = false
      audio.play()

      // update offset and length so currently spoken text gets highlighted
      this.speechOffset = this.currentChunk.offset
      this.setSpeechOffset(this.currentChunk.offset)
      this.setSpeechLength(this.currentChunk.length)

      // enqueue next chunk
      const nextOffset = this.currentChunk.offset + this.currentChunk.length
      this.enqueueChunk(nextOffset)

      // this check ensures that the listener gets added only once
      if (!this.googleEndedListenerAdded) {
        this.googleAudioRef.current.addEventListener('ended', () => {
          if (this.playing) {
            // check if we have reached end
            if (
              this.currentChunk &&
              this.currentChunk.offset + this.currentChunk.length >=
                this.text.length
            ) {
              this.googleAudioRef.current?.pause()
              this.donePlaying = true
              this.setPlaying(false)
              this.queue = []
              this.currentChunk = null
            } else {
              // continue playing if we have not reached end
              this.speakGoogle()
            }
          } else {
            // stop playing
            this.donePlaying = true
            this.setPlaying(false)
          }
        })
        this.googleEndedListenerAdded = true
      }
    }
  }

  speakAzure = () => {
    this.wordBoundaries = []
    // cancel previous playing
    if (this.player) {
      this.player?.pause()
      this.player?.close()
    }
    if (this.audioConfig) {
      this.audioConfig.close()
    }
    this.player = new sdk.SpeakerAudioDestination()
    this.audioConfig = sdk.AudioConfig.fromSpeakerOutput(this.player)

    this.player.onAudioEnd = () => {
      // if there's still more text to play
      if (this.speechOffset + WINDOW_SIZE < this.text.length) {
        this.playFromOffset(this.speechOffset + WINDOW_SIZE)
      } else {
        this.donePlaying = true
        this.setPlaying(false)
      }
    }

    this.synthesizer = new sdk.SpeechSynthesizer(
      this.speechConfig!,
      this.audioConfig,
    )
    this.synthesizer.wordBoundary = (_, e: any) => {
      e.privTextOffset = e.privTextOffset + this.speechOffset
      this.wordBoundaries.push(e)
    }
    this.synthesizer.synthesisCompleted = function () {
      // console.log('Speech synthesis complete.')
    }
    this.donePlaying = false

    const text = escape(
      this.text.substring(this.speechOffset, this.speechOffset + WINDOW_SIZE),
    )

    this.synthesizer.speakSsmlAsync(
      toSSML(text),
      (result: any) => {
        if (result) {
          if (result.privErrorDetails) {
            toast.error(result.privErrorDetails)
            this.donePlaying = true
            this.setPlaying(false)
          } else {
            // write to firebase hook
            this.onSynthesize(text.length)
          }
          this.synthesizer.close()
          return result.audioData
        }
      },
      (error: any) => {
        console.log(error)
        this.synthesizer.close()
      },
    )
  }
}
