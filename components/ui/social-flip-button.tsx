"use client";

import React, { useState } from "react";
import { Github, Linkedin, Twitter, Mail, Globe } from "lucide-react";

interface FlipCardProps {
    icon: React.ReactNode;
    label: string;
    backLabel: string;
    href?: string;
    className?: string;
    backClassName?: string;
}

function FlipCard({ icon, label, backLabel, href = "#", className = "", backClassName = "" }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            style={{ perspective: "600px" }}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div
                className="relative w-full transition-transform duration-500 ease-out"
                style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
                }}
            >
                {/* Front */}
                <div
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm border shadow-soft transition-shadow hover:shadow-soft-lg ${className}`}
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {icon}
                    <span>{label}</span>
                </div>

                {/* Back */}
                <div
                    className={`absolute inset-0 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm shadow-soft ${backClassName}`}
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateX(180deg)",
                    }}
                >
                    {icon}
                    <span>{backLabel}</span>
                </div>
            </div>
        </a>
    );
}

export default function SocialFlipButton() {
    return (
        <div className="flex flex-wrap gap-3">
            <FlipCard
                icon={<Github className="w-4 h-4" />}
                label="GitHub"
                backLabel="Follow me"
                href="https://github.com"
                className="bg-white text-gray-900 border-gray-200"
                backClassName="bg-gray-900 text-white border-gray-900"
            />
            <FlipCard
                icon={<Linkedin className="w-4 h-4" />}
                label="LinkedIn"
                backLabel="Connect"
                href="https://linkedin.com"
                className="bg-white text-gray-900 border-gray-200"
                backClassName="bg-gray-700 text-white border-gray-700"
            />
            <FlipCard
                icon={<Twitter className="w-4 h-4" />}
                label="Twitter"
                backLabel="Follow"
                href="https://twitter.com"
                className="bg-white text-gray-900 border-gray-200"
                backClassName="bg-gray-800 text-white border-gray-800"
            />
            <FlipCard
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                backLabel="Say Hello"
                href="mailto:hello@example.com"
                className="bg-white text-gray-900 border-gray-200"
                backClassName="bg-black text-white border-black"
            />
            <FlipCard
                icon={<Globe className="w-4 h-4" />}
                label="Website"
                backLabel="Visit"
                href="https://example.com"
                className="bg-white text-gray-900 border-gray-200"
                backClassName="bg-gray-600 text-white border-gray-600"
            />
        </div>
    );
}
