"use client";

import React, { useState } from "react";
import { X, Github, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface GitHubUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: (projectData: any) => void;
}

export function GitHubUploadModal({
    isOpen,
    onClose,
    onUploadSuccess,
}: GitHubUploadModalProps) {
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const response = await fetch("/api/github-repo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ repoUrl }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch repository data");
            }

            setSuccess(true);
            setTimeout(() => {
                onUploadSuccess(data);
                handleClose();
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRepoUrl("");
        setError(null);
        setSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                    disabled={loading}
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Header */}
                <div className="mb-8">
                    <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
                        <Github className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
                        Upload GitHub Project
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                        Enter a GitHub repository URL to extract and display project
                        information
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="repo-url"
                            className="block text-sm font-bold text-gray-700 mb-3"
                        >
                            Repository URL
                        </label>
                        <input
                            id="repo-url"
                            type="url"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/username/repository"
                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            disabled={loading}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                            Example: https://github.com/facebook/react
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-red-900 mb-1">
                                    Error
                                </p>
                                <p className="text-xs text-red-700 font-medium">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-green-900 mb-1">
                                    Success!
                                </p>
                                <p className="text-xs text-green-700 font-medium">
                                    Repository data fetched successfully
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !repoUrl}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Fetching...
                                </>
                            ) : (
                                <>
                                    <Github className="w-4 h-4" />
                                    Extract Info
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Info box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-xs text-blue-900 font-medium leading-relaxed">
                        💡 <strong>Tip:</strong> Public repositories are fetched instantly.
                        For private repositories, you may need to configure a GitHub token.
                    </p>
                </div>
            </div>
        </div>
    );
}
