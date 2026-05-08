"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MasteryProgressProps {
    value: number; // 0 to 100
    className?: string;
}

export function MasteryProgress({ value, className }: MasteryProgressProps) {
    return (
        <div className={cn("w-full h-2 bg-secondary rounded-full overflow-hidden relative", className)}>
            <motion.div
                className="h-full bg-gradient-to-r from-primary/80 via-primary to-purple-400 box-shadow-glow"
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* Shimmer effect */}
            <motion.div
                className="absolute top-0 bottom-0 w-10 bg-white/20 skew-x-12 blur-md"
                animate={{ x: ["-100%", "500%"] }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                    repeatDelay: 3
                }}
            />
        </div>
    );
}
