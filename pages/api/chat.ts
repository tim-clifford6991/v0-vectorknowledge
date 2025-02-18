import type { NextApiRequest, NextApiResponse } from "next"
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { message } = req.body

    try {
      // Generate embedding for the message
      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: message,
      })
      const [{ embedding }] = embeddingResponse.data.data

      // Query Pinecone
      const index = pinecone.Index("ai-knowledge-base")
      const queryResponse = await index.query({
        vector: embedding,
        topK: 3,
        includeMetadata: true,
      })

      // Generate context from Pinecone results
      const context = queryResponse.matches.map((match) => match.metadata.text).join("\n\n")

      // Generate response using OpenAI
      const completion = await openai.createChatCompletion({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant. Use the following context to answer the user's question: ${context}`,
          },
          { role: "user", content: message },
        ],
      })

      res.status(200).json({ message: completion.data.choices[0].message?.content })
    } catch (error) {
      res.status(500).json({ error: "An error occurred while processing your request." })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

