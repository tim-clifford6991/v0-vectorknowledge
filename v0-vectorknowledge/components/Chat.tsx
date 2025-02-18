"use client"

import { useState } from "react"
import { ChatContainer, MessageList, Message, MessageInput } from "@chatscope/chat-ui-kit-react"
import { Button } from "@/components/ui/button"

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    }

    const newMessages = [...messages, newMessage]
    setMessages(newMessages)

    // Process message with AI and get response
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })

    const data = await response.json()

    setMessages([
      ...newMessages,
      {
        message: data.message,
        direction: "incoming",
        sender: "AI",
      },
    ])
  }

  return (
    <div className="h-[600px] w-full max-w-md mx-auto">
      <ChatContainer>
        <MessageList>
          {messages.map((message, i) => (
            <Message key={i} model={message} />
          ))}
        </MessageList>
        <MessageInput
          placeholder="Type message here"
          value={inputMessage}
          onChange={(val) => setInputMessage(val)}
          onSend={() => handleSend(inputMessage)}
        />
      </ChatContainer>
      <div className="mt-4">
        <Button onClick={() => document.getElementById("fileInput").click()}>Upload Document</Button>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={(e) => {
            // Handle file upload logic here
            console.log(e.target.files[0])
          }}
        />
      </div>
    </div>
  )
}

