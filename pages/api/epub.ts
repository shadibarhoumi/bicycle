import { NextApiRequest, NextApiResponse } from 'next'
import * as fs from 'fs'

const endpoint = async (_: NextApiRequest, res: NextApiResponse) => {
  fs.writeFileSync('./test.txt', 'This is test data.')
  const text = fs.readFileSync('./test.txt', 'utf8')
  res.status(200).json({ text })
}

export default endpoint
