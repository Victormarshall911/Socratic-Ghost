"use client";

import { motion } from "framer-motion";

interface GhostOrbProps {
    state?: "idle" | "thinking" | "speaking";
}

export function GhostOrb({ state = "idle" }: GhostOrbProps) {
    const variants = {
        idle: {
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7],
            boxShadow: [
                "0 0 20px 5px rgba(168, 85, 247, 0.4)",
                "0 0 30px 10px rgba(168, 85, 247, 0.6)",
                "0 0 20px 5px rgba(168, 85, 247, 0.4)",
            ],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
        thinking: {
            scale: [1, 1.2, 0.9, 1.1, 1],
            rotate: [0, 180, 360],
            boxShadow: [
                "0 0 30px 10px rgba(168, 85, 247, 0.6)",
                "0 0 50px 20px rgba(168, 85, 247, 0.8)",
                "0 0 30px 10px rgba(168, 85, 247, 0.6)",
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="flex items-center justify-center p-10" suppressHydrationWarning>
            <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-purple-500 to-indigo-900 border border-white/10 backdrop-blur-3xl"
                variants={variants as any}
                animate={state}
            />
        </div>
    );
}
