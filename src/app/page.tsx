"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GhostOrb } from "@/components/ui/ghost-orb";
import { ImageUpload } from "@/components/ui/image-upload";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function Home() {
  const [mode, setMode] = useState<"upload" | "chat">("upload");
  const [image, setImage] = useState<File | null>(null);

  const handleImageSelect = (file: File) => {
    setImage(file);
    // Add a small delay for effect before switching
    setTimeout(() => setMode("chat"), 800);
  };

  const handleBack = () => {
    setMode("upload");
    setImage(null);
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden"
      suppressHydrationWarning
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"
        suppressHydrationWarning
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"
        suppressHydrationWarning
      />

      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col relative z-10" suppressHydrationWarning>
        <AnimatePresence mode="wait">
          {mode === "upload" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex-1 flex flex-col items-center justify-center p-6 gap-12"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <GhostOrb state="idle" />
                <div className="space-y-4 max-w-lg">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-serif font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50"
                  >
                    Socratic Ghost
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-lg leading-relaxed"
                  >
                    Show me what you're working on. I won't give you the answer,
                    but I'll guide you to the truth.
                  </motion.p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full"
              >
                <ImageUpload onImageSelect={handleImageSelect} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 h-full"
            >
              <ChatInterface initialImage={image} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
