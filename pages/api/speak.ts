import type { NextApiRequest, NextApiResponse } from 'next'
import textToSpeech from '@google-cloud/text-to-speech'
import { Voice } from '@features/speaker/Voice'

// const createSSML = (text: string) => {
//   let ssml = '<speak>'
//   ssml += text
//   ssml += '</speak>'
//   return ssml
// }

const endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  let privateKey
  if (process.env.NODE_ENV === 'development') {
    privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY
  } else {
    privateKey = JSON.parse(process.env.GOOGLE_CLOUD_PRIVATE_KEY!).privateKey
  }
  const client = new textToSpeech.v1beta1.TextToSpeechClient({
    credentials: {
      private_key: privateKey,
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    },
  })

  async function getSpeechData(text: string, voice: Voice, rate: number) {
    // const ssml = createSSML(text)
    const request = {
      input: {
        // ssml,
        text,
      },
      voice: {
        languageCode: voice.language,
        name: voice.name,
      },
      audioConfig: {
        audioEncoding: <const>'MP3',
        pitch: 0,
        speakingRate: rate,
      },
      enableTimePointing: [0],
    }

    const [response] = await client.synthesizeSpeech(request)
    return response
  }
  const { text, voice, rate } = JSON.parse(req.body)
  const response = await getSpeechData(text, voice, rate)
  res.status(200).send(response)
}

export default endpoint
