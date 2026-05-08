"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, Image as ImageIcon, Sparkles, HelpCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { GhostOrb } from "@/components/ui/ghost-orb";
import { MasteryProgress } from "@/components/ui/mastery-progress";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
    initialImage?: File | null;
    onBack?: () => void;
}

// Helper to convert File to base64 data URL
async function fileToDataUrl(file: File): Promise<{ url: string; mediaType: string }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
            url: reader.result as string,
            mediaType: file.type || "image/jpeg"
        });
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function ChatInterface({ initialImage, onBack }: ChatInterfaceProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [localInput, setLocalInput] = useState("");
    const [pendingImageData, setPendingImageData] = useState<{ url: string; mediaType: string } | null>(null);
    const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasSentInitialImage, setHasSentInitialImage] = useState(false);

    // Configure useChat with transport for AI SDK v6
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
        }),
    });

    const isLoading = status === "streaming" || status === "submitted";

    // Convert initial image to data URL when provided
    useEffect(() => {
        if (initialImage && !pendingImageData && !hasSentInitialImage) {
            fileToDataUrl(initialImage).then(data => {
                setPendingImageData(data);
                setPendingImageFile(initialImage);
            });
        }
    }, [initialImage, pendingImageData, hasSentInitialImage]);

    // Send initial image message automatically when ready
    useEffect(() => {
        if (pendingImageData && initialImage && !hasSentInitialImage && messages.length === 0) {
            setHasSentInitialImage(true);
            sendMessage({
                role: "user",
                parts: [
                    { type: "text", text: "I've uploaded a homework problem. Please analyze it and start guiding me through solving it using the Socratic method. Ask me one question at a time." },
                    { type: "file", url: pendingImageData.url, mediaType: pendingImageData.mediaType }
                ]
            });
            setPendingImageData(null);
            setPendingImageFile(null);
        }
    }, [pendingImageData, initialImage, hasSentInitialImage, messages.length, sendMessage]);

    const handleHunch = async () => {
        if (isLoading) return;
        await sendMessage({
            role: "user",
            parts: [{ type: "text", text: "Give me a subtle hint, a hunch, but do not solve it. Guide me gently." }]
        });
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const data = await fileToDataUrl(file);
            setPendingImageData(data);
            setPendingImageFile(file);
        }
    };

    const clearPendingImage = () => {
        setPendingImageData(null);
        setPendingImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCustomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!localInput.trim() && !pendingImageData) || isLoading) return;

        const message = localInput;
        setLocalInput("");

        // Build message parts
        type MessagePart = { type: "text"; text: string } | { type: "file"; url: string; mediaType: string };
        const parts: MessagePart[] = [];

        if (message.trim()) {
            parts.push({ type: "text", text: message });
        }

        if (pendingImageData) {
            parts.push({ type: "file", url: pendingImageData.url, mediaType: pendingImageData.mediaType });
            clearPendingImage();
        }

        if (parts.length > 0) {
            await sendMessage({
                role: "user",
                parts
            });
        }
    };

    // Calculate generic mastery based on interaction depth
    const mastery = Math.min(messages.filter((m: any) => m.role === "assistant").length * 10, 100);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Extract text content from message parts
    const getMessageContent = (message: any): string => {
        if (typeof message.content === "string") {
            return message.content;
        }
        if (message.parts) {
            return message.parts
                .filter((p: any) => p.type === "text")
                .map((p: any) => p.text)
                .join("");
        }
        return "";
    };

    // Check if message has file/image
    const getImageUrl = (message: any): string | null => {
        if (message.parts) {
            const filePart = message.parts.find((p: any) => p.type === "file" && p.mediaType?.startsWith("image/"));
            return filePart?.url || null;
        }
        return null;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto md:border-x md:border-border/40 bg-background/50 backdrop-blur-sm relative" suppressHydrationWarning>
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
            />

            {/* Header / Ghost Presence */}
            <div className="flex flex-col items-center justify-center p-4 border-b border-border/40 bg-background/80 backdrop-blur-md z-10 sticky top-0">
                <div className="transform scale-50 -my-6">
                    <GhostOrb state={isLoading ? "thinking" : "idle"} />
                </div>
                <h2 className="font-serif text-xl tracking-wide text-foreground mt-2">Socratic Ghost</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    {isLoading ? "Analyzing..." : "Waiting for your thoughts"}
                </p>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 relative">
                <div className="space-y-6 pb-4">
                    {messages.length === 0 && !initialImage && (
                        <div className="text-center py-20 opacity-50">
                            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                            <p className="font-serif text-xl">"True wisdom comes to each of us when we realize how little we understand."</p>
                        </div>
                    )}

                    {messages.length === 0 && initialImage && (
                        <div className="text-center py-10 opacity-70">
                            <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary/50 animate-pulse" />
                            <p className="font-serif text-lg">Analyzing your problem...</p>
                        </div>
                    )}

                    {messages.map((m: any) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={m.id}
                            className={cn(
                                "flex gap-3 max-w-[90%]",
                                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <Avatar className={cn("w-8 h-8 border border-border", m.role === "user" ? "bg-primary" : "bg-card")}>
                                <AvatarFallback className={m.role === "user" ? "bg-primary text-primary-foreground" : "bg-zinc-900 text-purple-400"}>
                                    {m.role === "user" ? "U" : "G"}
                                </AvatarFallback>
                            </Avatar>

                            <Card className={cn(
                                "p-4 text-sm leading-relaxed shadow-sm",
                                m.role === "user"
                                    ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none"
                                    : "bg-card text-card-foreground border-border/50 rounded-tl-none font-serif"
                            )}>
                                {/* Show image if present */}
                                {getImageUrl(m) && (
                                    <div className="mb-3 rounded overflow-hidden max-w-[200px]">
                                        <img src={getImageUrl(m)!} alt="Uploaded" className="w-full h-auto" />
                                    </div>
                                )}
                                <div className="prose prose-invert prose-sm text-inherit max-w-none">
                                    <ReactMarkdown components={{
                                        p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />
                                    }}>
                                        {getMessageContent(m)}
                                    </ReactMarkdown>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/40 sticky bottom-0 z-10">
                {/* Pending image preview */}
                {pendingImageFile && (
                    <div className="mb-3 flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                        <img
                            src={URL.createObjectURL(pendingImageFile)}
                            alt="To upload"
                            className="w-12 h-12 object-cover rounded"
                        />
                        <span className="text-xs text-muted-foreground flex-1 truncate">{pendingImageFile.name}</span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={clearPendingImage}
                        >
                            <X size={14} />
                        </Button>
                    </div>
                )}

                <form onSubmit={handleCustomSubmit} className="flex gap-2 items-end">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground shrink-0"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon size={20} />
                    </Button>

                    <Input
                        value={localInput}
                        onChange={(e) => setLocalInput(e.target.value)}
                        placeholder="Type your answer..."
                        className="bg-secondary/50 border-border/50 focus-visible:ring-primary/50 min-h-[3rem] py-3"
                    />

                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || (!localInput.trim() && !pendingImageData)}
                        className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_-3px_rgba(168,85,247,0.5)]"
                    >
                        <Send size={18} />
                    </Button>
                </form>
                <div className="flex justify-between items-center mt-3 px-1 gap-4">
                    <button
                        onClick={handleHunch}
                        disabled={isLoading}
                        className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        <HelpCircle size={10} /> Give me a hunch
                    </button>
                    <div className="flex flex-1 items-center gap-2 max-w-[200px]">
                        <MasteryProgress value={mastery} />
                    </div>
                </div>
            </div>
        </div>
    );
}
