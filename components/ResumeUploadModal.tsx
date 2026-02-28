"use client";

import React, { useState, useRef } from "react";
import { X, Upload, FileText, Loader2, Check, AlertCircle } from "lucide-react";
import { resumeAPI, ParsedResumeData } from "@/lib/api";

interface ResumeUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (data: ParsedResumeData) => void;
}

export function ResumeUploadModal({ isOpen, onClose, onApply }: ResumeUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isParsed, setIsParsed] = useState(false);
    const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf' || 
                selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setFile(selectedFile);
                setError(null);
                setIsParsed(false);
                setParsedData(null);
            } else {
                setError('Please upload a PDF or DOCX file');
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const response = await resumeAPI.parseResume(file);
            
            if (response.success && response.data) {
                setParsedData(response.data);
                setIsParsed(true);
            } else {
                setError('Failed to parse resume. Please try again.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while parsing the resume');
            console.error('Resume parse error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleApply = () => {
        if (parsedData) {
            onApply(parsedData);
            onClose();
            // Reset state
            setFile(null);
            setParsedData(null);
            setIsParsed(false);
            setError(null);
        }
    };

    const handleClose = () => {
        setFile(null);
        setParsedData(null);
        setIsParsed(false);
        setError(null);
        onClose();
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    .resume-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .resume-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .resume-scrollbar::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                        border-radius: 10px;
                    }
                    .resume-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #9ca3af;
                    }
                `
            }} />
            <div 
                className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8"
                onClick={handleClose}
            >
                <div 
                    className="bg-white rounded-[32px] shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Upload Resume</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {isParsed ? 'Preview and apply parsed data' : 'Upload your resume to auto-fill your profile'}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto resume-scrollbar bg-white">
                        <div className="p-6 space-y-6">
                            {/* Upload Section */}
                            {!isParsed && (
                                <div className="space-y-4">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                                            file
                                                ? 'border-green-400 bg-green-50'
                                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.docx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        
                                        {file ? (
                                            <div className="space-y-3">
                                                <Check className="w-12 h-12 mx-auto text-green-500" />
                                                <div>
                                                    <p className="text-lg font-bold text-gray-900">{file.name}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {(file.size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                    }}
                                                    className="text-sm text-red-500 hover:text-red-600 font-semibold"
                                                >
                                                    Remove file
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                                                <div>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        Drop your resume here or click to browse
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Supports PDF and DOCX files
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-red-900">Error</p>
                                                <p className="text-sm text-red-600 mt-0.5">{error}</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleUpload}
                                        disabled={!file || isUploading}
                                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Parsing Resume...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-5 h-5" />
                                                Parse Resume
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Preview Section */}
                            {isParsed && parsedData && (
                                <div className="space-y-6">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-green-900">Resume Parsed Successfully!</p>
                                            <p className="text-sm text-green-600 mt-0.5">Review the extracted data below and click Apply to update your profile.</p>
                                        </div>
                                    </div>

                                    {/* Personal Info */}
                                    {(parsedData.name || parsedData.role || parsedData.email || parsedData.phone || parsedData.location) && (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {parsedData.name && (
                                                    <div className="p-3 bg-gray-50 rounded-xl">
                                                        <p className="text-xs text-gray-500 font-semibold">Name</p>
                                                        <p className="text-sm font-bold text-gray-900 mt-1">{parsedData.name}</p>
                                                    </div>
                                                )}
                                                {parsedData.role && (
                                                    <div className="p-3 bg-gray-50 rounded-xl">
                                                        <p className="text-xs text-gray-500 font-semibold">Role</p>
                                                        <p className="text-sm font-bold text-gray-900 mt-1">{parsedData.role}</p>
                                                    </div>
                                                )}
                                                {parsedData.email && (
                                                    <div className="p-3 bg-gray-50 rounded-xl">
                                                        <p className="text-xs text-gray-500 font-semibold">Email</p>
                                                        <p className="text-sm font-bold text-gray-900 mt-1">{parsedData.email}</p>
                                                    </div>
                                                )}
                                                {parsedData.phone && (
                                                    <div className="p-3 bg-gray-50 rounded-xl">
                                                        <p className="text-xs text-gray-500 font-semibold">Phone</p>
                                                        <p className="text-sm font-bold text-gray-900 mt-1">{parsedData.phone}</p>
                                                    </div>
                                                )}
                                                {parsedData.location && (
                                                    <div className="p-3 bg-gray-50 rounded-xl col-span-2">
                                                        <p className="text-xs text-gray-500 font-semibold">Location</p>
                                                        <p className="text-sm font-bold text-gray-900 mt-1">{parsedData.location}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* About Me */}
                                    {parsedData.aboutMe && (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-bold text-gray-900">About Me</h3>
                                            <div className="p-4 bg-gray-50 rounded-xl">
                                                <p className="text-sm text-gray-700 leading-relaxed">{parsedData.aboutMe}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Education */}
                                    {parsedData.education && parsedData.education.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-bold text-gray-900">Education ({parsedData.education.length})</h3>
                                            <div className="space-y-2">
                                                {parsedData.education.map((edu, idx) => (
                                                    <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                                                        <p className="text-sm font-bold text-gray-900">{edu.institution}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{edu.degree}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Experience */}
                                    {parsedData.experience && parsedData.experience.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-bold text-gray-900">Experience ({parsedData.experience.length})</h3>
                                            <div className="space-y-2">
                                                {parsedData.experience.map((exp, idx) => (
                                                    <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                                                        <p className="text-sm font-bold text-gray-900">{exp.title}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {parsedData.skillCategories && parsedData.skillCategories.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-bold text-gray-900">Skills & Tools</h3>
                                            <div className="space-y-3">
                                                {parsedData.skillCategories.map((cat, idx) => (
                                                    <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                                                        <p className="text-xs text-gray-500 font-semibold uppercase mb-2">{cat.category}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cat.skills.map((skill, skillIdx) => (
                                                                <span 
                                                                    key={skillIdx}
                                                                    className="px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => {
                                                setIsParsed(false);
                                                setParsedData(null);
                                                setFile(null);
                                            }}
                                            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                                        >
                                            Upload Different Resume
                                        </button>
                                        <button
                                            onClick={handleApply}
                                            className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all"
                                        >
                                            Apply to Profile
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
