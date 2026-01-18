"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle } from "lucide-react"
import { useEffect } from "react"

interface ChatInterfaceProps {
  onAddMessageAsNote?: (message: string) => void
  currentProblemId?: string
  currentBehaviorId?: string
  currentResultId?: string
  onNewAssistantMessage?: (message: string) => void
  chatInputId?: string // New prop for unique ID
}

export function ChatInterface({
  onAddMessageAsNote,
  currentProblemId,
  currentBehaviorId,
  currentResultId,
  onNewAssistantMessage,
  chatInputId, // Destructure new prop
}: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat()

  useEffect(() => {
    if (onNewAssistantMessage && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant") {
        onNewAssistantMessage(lastMessage.content)
      }
    }
  }, [messages, onNewAssistantMessage])

  const handleAddNote = (message: string) => {
    if (onAddMessageAsNote) {
      onAddMessageAsNote(message)
    } else {
      alert("Cannot add note. Handler not provided.")
    }
  }

  return (
    <Card className="w-full bg-gray-900 border border-gray-700 text-gray-100 rounded-lg shadow-lg">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="font-barlow text-xl text-neon-blue">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-64 pr-4 mb-4">
          {messages.length > 0 ? (
            messages.map((m) => (
              <div key={m.id} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block p-2 rounded-lg max-w-[80%] ${
                    m.role === "user" ? "bg-neon-blue text-gray-900" : "bg-gray-700 text-gray-100"
                  } font-sansBody`}
                >
                  {m.content}
                </span>
                {m.role === "assistant" && onAddMessageAsNote && (
                  <div className="mt-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddNote(m.content)}
                      className="text-gray-400 hover:text-neon-pink hover:bg-gray-800 text-xs font-sansBody"
                    >
                      <PlusCircle className="w-3 h-3 mr-1" /> Add as Note
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 italic font-sansBody">Start a conversation with your LLM...</div>
          )}
          {isLoading && <div className="text-center text-gray-500 mt-2 font-sansBody">Thinking...</div>}
          {error && <div className="text-center text-red-500 mt-2 font-sansBody">Error: {error.message}</div>}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            id={chatInputId || "chat-input"} // Use the passed ID, or fallback to a default (though it should always be passed now)
            name="message"
            aria-label="Chat input field"
            className="flex-1 bg-gray-800 border border-gray-600 text-gray-100 placeholder:text-gray-500 focus:border-neon-blue focus:ring-neon-blue font-sansBody"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-neon-blue text-gray-900 hover:bg-neon-blue/80 shadow-neon-blue-glow font-sansBody"
            disabled={isLoading}
          >
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
