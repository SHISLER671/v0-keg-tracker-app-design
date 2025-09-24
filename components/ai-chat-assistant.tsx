"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      role: user?.role || "admin",
    },
    onError: (error) => {
      toast({
        title: "Chat Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    },
  })

  const exampleQuestions = [
    "Status of KEG-1001 as Brewer?",
    "How to mint NFT?",
    "Transfer keg ownership process?",
    "Verify keg authenticity steps?",
  ]

  if (!user) return null

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[600px] sm:h-[700px] flex flex-col p-0 m-4 sm:m-8">
          <DialogHeader className="p-4 sm:p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                    KegTracker AI Assistant
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">Role-based guidance for {user.role}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            </div>
          </DialogHeader>

          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 sm:p-6">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground mb-6">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                    <p className="text-lg font-medium">Welcome to KegTracker AI!</p>
                    <p className="text-sm">
                      Ask me anything about keg management, blockchain operations, or supply chain tracking.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
                    <div className="grid gap-2">
                      {exampleQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto p-3 whitespace-normal bg-transparent text-xs sm:text-sm"
                          onClick={() => {
                            handleInputChange({ target: { value: question } } as any)
                          }}
                        >
                          "{question}"
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      </div>

                      {message.role === "user" && (
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 sm:p-6 pt-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={`Ask about keg management, blockchain operations...`}
                  disabled={isLoading}
                  className="flex-1 h-11 text-base"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} className="h-11 px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                AI responses are personalized for your {user.role} role
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
