"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    onImageSelect: (file: File) => void;
    className?: string;
}

export function ImageUpload({ onImageSelect, className }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
                onImageSelect(file);
            }
        },
        [onImageSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
        multiple: false,
    });

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
    };

    return (
        <div className={cn("w-full max-w-md mx-auto", className)} suppressHydrationWarning>
            <div
                {...getRootProps()}
                className={cn(
                    "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-300 backdrop-blur-sm",
                    isDragActive
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-border hover:border-primary/50 hover:bg-white/5",
                    preview ? "border-solid border-primary/50" : ""
                )}
            >
                <input {...getInputProps()} />
                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full h-full p-2"
                        >
                            <img
                                src={preview}
                                alt="Uploaded preview"
                                className="w-full h-full object-contain rounded-2xl"
                            />
                            <button
                                onClick={clearImage}
                                className="absolute top-4 right-4 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-4 text-muted-foreground group-hover:text-foreground transition-colors"
                        >
                            <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/20 transition-colors">
                                <Upload className="w-8 h-8 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="text-center">
                                <p className="font-serif text-lg text-foreground">
                                    Show me the problem
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Drop an image or click to browse
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
            </div>
        </div>
    );
}
