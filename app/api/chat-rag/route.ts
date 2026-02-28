import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
    try {
        const { message, model } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Call FastAPI backend
        const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                model: model || "llama-3.3-70b-versatile",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                {
                    error:
                        errorData.detail ||
                        "Failed to get response from chatbot",
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            response: data.response,
            model: data.model,
        });
    } catch (error) {
        console.error("Chat RAG API error:", error);
        return NextResponse.json(
            {
                error:
                    "Failed to process chat message. Make sure the backend is running.",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Check Groq API status
        const response = await fetch(`${BACKEND_URL}/api/chat/status`, {
            method: "GET",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to check chatbot status" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Chat status API error:", error);
        return NextResponse.json(
            { error: "Failed to check status" },
            { status: 500 }
        );
    }
}
