"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, ImageIcon, FileText, Download, Eye } from "lucide-react"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: Date
  type: "text" | "image" | "file" | "system"
  fileUrl?: string
  fileName?: string
  fileSize?: number
}

interface TradeChatProps {
  messages: ChatMessage[]
  currentUserId: string
  onSendMessage: (message: string) => void
  onFileUpload: (file: File) => void
  isTyping?: boolean
  typingUser?: string
}

export function TradeChat({
  messages,
  currentUserId,
  onSendMessage,
  onFileUpload,
  isTyping,
  typingUser,
}: TradeChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      onFileUpload(file)
      setTimeout(() => setIsUploading(false), 2000) // Simulate upload
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const renderMessage = (message: ChatMessage) => {
    const isOwn = message.senderId === currentUserId
    const isSystem = message.type === "system"

    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <Badge variant="secondary" className="text-xs">
            {message.message}
          </Badge>
        </div>
      )
    }

    return (
      <div key={message.id} className={`flex gap-3 mb-4 ${isOwn ? "flex-row-reverse" : ""}`}>
        <Avatar className="w-8 h-8">
          <AvatarImage src={`/abstract-geometric-shapes.png?key=e2o2j&height=32&width=32&query=${message.senderName}`} />
          <AvatarFallback className="text-xs">{message.senderName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className={`flex-1 max-w-[70%] ${isOwn ? "text-right" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium">{message.senderName}</span>
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
          </div>

          <div className={`rounded-lg p-3 ${isOwn ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"}`}>
            {message.type === "text" && <p className="text-sm whitespace-pre-wrap">{message.message}</p>}

            {message.type === "image" && (
              <div className="space-y-2">
                <ImageIcon
                  src={message.fileUrl || "/placeholder.svg"}
                  alt="Shared image"
                  className="max-w-full h-auto rounded-md cursor-pointer"
                  onClick={() => window.open(message.fileUrl, "_blank")}
                />
                {message.message && <p className="text-sm">{message.message}</p>}
              </div>
            )}

            {message.type === "file" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-background/10 rounded-md">
                  <FileText className="w-4 h-4" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{message.fileName}</p>
                    <p className="text-xs opacity-70">{formatFileSize(message.fileSize || 0)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {message.message && <p className="text-sm">{message.message}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Trade Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1">
            {messages.map(renderMessage)}

            {/* Typing Indicator */}
            {isTyping && typingUser && (
              <div className="flex gap-3 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">{typingUser.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-transparent"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
          />
        </div>
      </CardContent>
    </Card>
  )
}
