import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const envVars = [
    "OPENAI_API_KEY",
    "PINECONE_ENVIRONMENT",
    "PINECONE_API_KEY",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "GOOGLE_DRIVE_FOLDER_ID",
  ]

  const results = envVars.map((varName) => ({
    name: varName,
    set: !!process.env[varName],
  }))

  res.status(200).json(results)
}

