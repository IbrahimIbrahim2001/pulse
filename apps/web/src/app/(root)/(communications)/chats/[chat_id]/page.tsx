"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Phone, Video, MoreVertical, CheckCheck, Check } from "lucide-react"

interface Message {
    id: string
    text: string
    sender: "user" | "contact"
    timestamp: Date
    status: "sent" | "delivered" | "read"
}

export default function ConversationPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hey! How are you doing?",
            sender: "contact",
            timestamp: new Date(Date.now() - 3600000),
            status: "read",
        },
        {
            id: "2",
            text: "I'm doing great! Just finished work. What about you?",
            sender: "user",
            timestamp: new Date(Date.now() - 3000000),
            status: "read",
        },
        {
            id: "3",
            text: "Same here! Want to grab dinner later?",
            sender: "contact",
            timestamp: new Date(Date.now() - 1800000),
            status: "read",
        },
        {
            id: "4",
            text: "Sounds perfect! What time works for you?",
            sender: "user",
            timestamp: new Date(Date.now() - 900000),
            status: "delivered",
        },
    ])

    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Message = {
                id: Date.now().toString(),
                text: newMessage,
                sender: "user",
                timestamp: new Date(),
                status: "sent",
            }
            setMessages([...messages, message])
            setNewMessage("")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "sent":
                return <Check size="15" />
            case "delivered":
                return < CheckCheck size="15" className="opacity-70" />
            case "read":
                return <CheckCheck size="15" className="text-blue-400" />
            default:
                return ""
        }
    }

    return (
        <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col h-svh md:h-[calc(100vh-64px)] bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-card border-b border-border">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/abstract-profile.png" />
                        <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold text-card-foreground">John Doe</h2>
                        <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-card-foreground">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-card-foreground">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-card-foreground">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === "user"
                                ? "bg-primary/90 dark:bg-primary/75 text-primary-foreground"
                                : "bg-card text-card-foreground border border-border"
                                }`}
                        >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            <div
                                className={`flex items-center gap-1 mt-1 ${message.sender === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                                {message.sender === "user" && (
                                    <div className="text-xs">
                                        {getStatusIcon(message.status)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card ">
                <div className="flex items-center gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-input border-border text-card-foreground placeholder:text-muted-foreground"
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                        disabled={!newMessage.trim()}
                    >
                        <Send className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
