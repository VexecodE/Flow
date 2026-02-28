"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatbotModal } from "./ChatbotModal";

export function FloatingChatButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-gray-900 to-black text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110 border-2 border-gray-800"
                aria-label="Open chat"
            >
                {isOpen ? (
                    <X className="w-6 h-6 transition-transform duration-300" />
                ) : (
                    <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                )}
                {/* Pulse animation */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-gray-900 animate-ping opacity-20"></span>
                )}
            </button>

            {/* Chat Modal */}
            <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
