import type { NextApiRequest, NextApiResponse } from "next"
import { PineconeClient } from "@pinecone-database/pinecone"

const pinecone = new PineconeClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT!,
        apiKey: process.env.PINECONE_API_KEY!,
      })

      const indexName = "ai-knowledge-base"
      const existingIndexes = await pinecone.listIndexes()

      if (!existingIndexes.includes(indexName)) {
        await pinecone.createIndex({
          createRequest: {
            name: indexName,
            dimension: 1536, // Dimension for OpenAI's ada-002 model
            metric: "cosine",
          },
        })
        res.status(200).json({ message: `Index ${indexName} created successfully` })
      } else {
        res.status(200).json({ message: `Index ${indexName} already exists` })
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred while initializing Pinecone" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

