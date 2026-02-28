"use client";

import React from "react";
import {
    Github,
    Star,
    GitFork,
    Eye,
    AlertCircle,
    Calendar,
    Code2,
    Globe,
    ExternalLink,
    X,
} from "lucide-react";

interface GitHubProjectCardProps {
    project: {
        name: string;
        fullName: string;
        description: string;
        owner: {
            login: string;
            avatarUrl: string;
        };
        stars: number;
        forks: number;
        watchers: number;
        openIssues: number;
        language: string;
        languages: string[];
        topics: string[];
        homepage: string | null;
        updatedAt: string;
        license: string | null;
        htmlUrl: string;
    };
    onRemove?: () => void;
}

export function GitHubProjectCard({ project, onRemove }: GitHubProjectCardProps) {
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "k";
        }
        return num.toString();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300 relative group">
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-red-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Remove project"
                >
                    <X className="w-4 h-4 text-gray-600 hover:text-red-600" />
                </button>
            )}

            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
                <img
                    src={project.owner.avatarUrl}
                    alt={project.owner.login}
                    className="w-12 h-12 rounded-xl border border-gray-200"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Github className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-500">
                            {project.owner.login}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        {project.name}
                    </h3>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                {project.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Stars
                        </span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                        {formatNumber(project.stars)}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <GitFork className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Forks
                        </span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                        {formatNumber(project.forks)}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Watchers
                        </span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                        {formatNumber(project.watchers)}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Issues
                        </span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                        {project.openIssues}
                    </div>
                </div>
            </div>

            {/* Languages/Topics */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Technologies
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {project.languages.slice(0, 5).map((lang) => (
                        <span
                            key={lang}
                            className="text-[9px] font-bold uppercase tracking-wider bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-md"
                        >
                            {lang}
                        </span>
                    ))}
                    {project.topics.slice(0, 3).map((topic) => (
                        <span
                            key={topic}
                            className="text-[9px] font-bold uppercase tracking-wider bg-purple-50 border border-purple-100 text-purple-700 px-2.5 py-1 rounded-md"
                        >
                            {topic}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated {formatDate(project.updatedAt)}</span>
                    {project.license && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{project.license}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
                <a
                    href={project.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-black text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-soft flex items-center justify-center gap-2"
                >
                    <Github className="w-4 h-4" /> View Repository
                </a>
                {project.homepage && (
                    <a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <Globe className="w-4 h-4" /> Live Demo
                    </a>
                )}
            </div>
        </div>
    );
}
