"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StackedLogosProps {
    /** Array of groups — each group is an array of React nodes */
    logoGroups: React.ReactNode[][];
    /** Full cycle duration in seconds */
    duration?: number;
    /** Stagger delay between items in a group (seconds) */
    stagger?: number;
    /** Optional className for the outer container */
    className?: string;
}

export function StackedLogos({
    logoGroups,
    duration = 20,
    stagger = 2,
    className = "",
}: StackedLogosProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const groupCount = logoGroups.length;
    const interval = (duration / groupCount) * 1000; // ms per group

    const advance = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % groupCount);
    }, [groupCount]);

    useEffect(() => {
        const timer = setInterval(advance, interval);
        return () => clearInterval(timer);
    }, [advance, interval]);

    const currentGroup = logoGroups[activeIndex];

    return (
        <div className={`relative ${className}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grid grid-cols-2 gap-3"
                >
                    {currentGroup.map((node, i) => (
                        <motion.div
                            key={`${activeIndex}-${i}`}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                delay: i * (stagger / 10),
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                        >
                            {node}
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Dot Navigation */}
            <div className="flex items-center justify-center gap-2 mt-4">
                {logoGroups.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex
                                ? "w-6 bg-gray-900"
                                : "w-1.5 bg-gray-300 hover:bg-gray-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
