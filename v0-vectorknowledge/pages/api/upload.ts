import type { NextApiRequest, NextApiResponse } from "next"
import { google } from "googleapis"
import { Configuration, OpenAIApi } from "openai"
import { PineconeClient } from "@pinecone-database/pinecone"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const pinecone = new PineconeClient()
pinecone.init({
  environment: process.env.PINECONE_ENVIRONMENT!,
  apiKey: process.env.PINECONE_API_KEY!,
})

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
})

const drive = google.drive({ version: "v3", auth })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, mimeType, content } = req.body

      // Upload file to Google Drive
      const fileMetadata = {
        name: name,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Specify the folder ID where you want to upload
      }
      const media = {
        mimeType: mimeType,
        body: content,
      }
      const file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      })

      // Generate embedding for the document
      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: content,
      })
      const [{ embedding }] = embeddingResponse.data.data

      // Store in Pinecone
      const index = pinecone.Index("ai-knowledge-base")
      await index.upsert([
        {
          id: file.data.id!,
          values: embedding,
          metadata: { text: content },
        },
      ])

      res.status(200).json({ message: "File uploaded and indexed successfully", fileId: file.data.id })
    } catch (error) {
      res.status(500).json({ error: "An error occurred while processing your request." })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

