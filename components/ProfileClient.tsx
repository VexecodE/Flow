"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import gsap from "gsap";
import { Header } from "./Header";
import { DashboardWaves } from "./DashboardWaves";
import {
    User,
    Mail,
    MapPin,
    Phone,
    Briefcase,
    GraduationCap,
    Code2,
    Edit3,
    Save,
    X,
    Upload,
    FileText,
    Plus,
    Trash2,
    Camera,
    Award,
    Calendar,
    ExternalLink,
    Check
} from "lucide-react";
import SocialFlipButton from "@/components/ui/social-flip-button";
import { StackedLogos } from "@/components/ui/stacked-logos";

interface SkillCategory {
    category: string;
    skills: string[];
}

interface Education {
    institution: string;
    degree: string;
    year: string;
}

interface Experience {
    title: string;
    description: string;
}

interface ProfileData {
    name: string;
    role: string;
    email: string;
    location: string;
    phone: string;
    avatar: string;
    aboutMe: string;
    education: Education[];
    experience: Experience[];
    skillCategories: SkillCategory[];
    resumeFile: string | null;
}

export function ProfileClient() {
    const viewRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [profile, setProfile] = useState<ProfileData>({
        name: "John Wick",
        role: "UI/UX Designer",
        email: "johnwick@gmail.com",
        location: "El Sauzel, Mexico, New York",
        phone: "+555 123 111",
        avatar: "JW",
        aboutMe: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem laudantium et consectetur repellat soluta velit necessitatibus quae, omnis error, beatae corporis? Deleniti necessitatibus minus tenetur facilis quis voluptatum distinctio aspernatur?",
        education: [
            { institution: "Continental University", degree: "Designer Diploma", year: "2023" }
        ],
        experience: [
            { title: "UI/UX Designer", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ea at, enim vitae nihil tempora molestias nobis." },
            { title: "Graphic Designer", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ea at, enim vitae nihil tempora molestias nobis." }
        ],
        skillCategories: [
            { category: "Designing Softwares", skills: ["Adobe Photoshop", "Adobe Illustrator", "Adobe XD", "Figma"] },
            { category: "Languages", skills: ["HTML", "CSS", "JavaScript", "Python", "C#"] },
            { category: "Editing Softwares", skills: ["Filmora", "Adobe Premiere", "Adobe After Effects", "CapCut"] }
        ],
        resumeFile: null
    });

    const [editData, setEditData] = useState<ProfileData>({ ...profile });

    useEffect(() => {
        if (viewRef.current) {
            gsap.fromTo(
                viewRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, []);

    const startEditing = () => {
        setEditData({ ...profile });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setEditData({ ...profile });
        setIsEditing(false);
    };

    const saveProfile = () => {
        setProfile({ ...editData });
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditData(prev => ({ ...prev, resumeFile: file.name }));
            if (!isEditing) {
                setProfile(prev => ({ ...prev, resumeFile: file.name }));
            }
        }
    };

    const removeResume = () => {
        setEditData(prev => ({ ...prev, resumeFile: null }));
        if (!isEditing) {
            setProfile(prev => ({ ...prev, resumeFile: null }));
        }
    };

    const addEducation = () => {
        setEditData(prev => ({
            ...prev,
            education: [...prev.education, { institution: "", degree: "", year: "" }]
        }));
    };

    const removeEducation = (index: number) => {
        setEditData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const addExperience = () => {
        setEditData(prev => ({
            ...prev,
            experience: [...prev.experience, { title: "", description: "" }]
        }));
    };

    const removeExperience = (index: number) => {
        setEditData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const addSkillCategory = () => {
        setEditData(prev => ({
            ...prev,
            skillCategories: [...prev.skillCategories, { category: "", skills: [] }]
        }));
    };

    const addSkill = (catIndex: number) => {
        const newSkill = prompt("Enter skill name:");
        if (newSkill && newSkill.trim()) {
            setEditData(prev => {
                const updated = [...prev.skillCategories];
                updated[catIndex] = {
                    ...updated[catIndex],
                    skills: [...updated[catIndex].skills, newSkill.trim()]
                };
                return { ...prev, skillCategories: updated };
            });
        }
    };

    const removeSkill = (catIndex: number, skillIndex: number) => {
        setEditData(prev => {
            const updated = [...prev.skillCategories];
            updated[catIndex] = {
                ...updated[catIndex],
                skills: updated[catIndex].skills.filter((_, i) => i !== skillIndex)
            };
            return { ...prev, skillCategories: updated };
        });
    };

    const currentData = isEditing ? editData : profile;

    return (
        <div className="flex bg-transparent h-screen overflow-hidden relative">
            <DashboardWaves />
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                <Header />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pt-8 pb-32 lg:pb-20 custom-scrollbar z-0 w-full relative">
                    <div ref={viewRef} className="max-w-5xl mx-auto space-y-6">

                        {/* Save Success Toast */}
                        {saveSuccess && (
                            <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-bold animate-in slide-in-from-right duration-300">
                                <Check className="w-4 h-4" /> Profile saved successfully!
                            </div>
                        )}

                        {/* Profile Header Card — Dark Theme */}
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[32px] overflow-hidden shadow-soft border border-gray-700/50 relative">
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-[0.03]">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                    backgroundSize: '24px 24px'
                                }} />
                            </div>

                            {/* Top accent gradient */}
                            <div className="h-28 bg-gradient-to-r from-gray-800 via-gray-900 to-black relative">
                                <div className="absolute inset-0 bg-black/20" />
                            </div>

                            {/* Avatar + Info */}
                            <div className="relative px-6 sm:px-10 pb-8 -mt-14">
                                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                                    {/* Avatar */}
                                    <div className="relative group">
                                        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-gray-600 via-gray-700 to-gray-900 p-1 shadow-2xl">
                                            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-3xl font-black text-white border-4 border-gray-900">
                                                {currentData.avatar}
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <button className="absolute bottom-1 right-1 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-gray-800 transition-colors">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Name + Role */}
                                    <div className="flex-1 text-center sm:text-left pb-1">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={editData.name}
                                                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-2xl font-bold text-white w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white/50"
                                                />
                                                <input
                                                    type="text"
                                                    value={editData.role}
                                                    onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                                                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm font-semibold text-gray-300 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white/50"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{currentData.name}</h1>
                                                <span className="inline-block mt-2 bg-white/10 text-gray-300 border border-white/20 px-4 py-1.5 rounded-full text-sm font-bold">
                                                    {currentData.role}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Edit / Save Buttons */}
                                    <div className="flex gap-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-white/10"
                                                >
                                                    <X className="w-4 h-4" /> Cancel
                                                </button>
                                                <button
                                                    onClick={saveProfile}
                                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg"
                                                >
                                                    <Save className="w-4 h-4" /> Save
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={startEditing}
                                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-white/10"
                                            >
                                                <Edit3 className="w-4 h-4" /> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Row */}
                                <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                                    {isEditing ? (
                                        <div className="flex flex-wrap gap-3 w-full">
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex-1 min-w-[200px]">
                                                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                                                <input
                                                    type="email"
                                                    value={editData.email}
                                                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                                                    className="bg-transparent text-white text-sm font-medium focus:outline-none w-full"
                                                    placeholder="Email"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex-1 min-w-[200px]">
                                                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                                <input
                                                    type="text"
                                                    value={editData.location}
                                                    onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                                                    className="bg-transparent text-white text-sm font-medium focus:outline-none w-full"
                                                    placeholder="Location"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex-1 min-w-[200px]">
                                                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                                <input
                                                    type="text"
                                                    value={editData.phone}
                                                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="bg-transparent text-white text-sm font-medium focus:outline-none w-full"
                                                    placeholder="Phone"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                {currentData.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                {currentData.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                {currentData.phone}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* LEFT COLUMN */}
                            <div className="space-y-6">

                                {/* About Me */}
                                <div className="bg-white border border-gray-100 shadow-soft rounded-[32px] p-6 sm:p-8 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-gray-900" />
                                        About me
                                    </h2>
                                    {isEditing ? (
                                        <textarea
                                            value={editData.aboutMe}
                                            onChange={(e) => setEditData(prev => ({ ...prev, aboutMe: e.target.value }))}
                                            rows={5}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-900/40 focus:border-transparent resize-none"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600 leading-relaxed">{currentData.aboutMe}</p>
                                    )}
                                </div>

                                {/* Education */}
                                <div className="bg-white border border-gray-100 shadow-soft rounded-[32px] p-6 sm:p-8 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2 justify-between">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-5 h-5 text-gray-900" />
                                            Education
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={addEducation}
                                                className="text-xs font-bold text-gray-900 hover:text-black flex items-center gap-1 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" /> Add
                                            </button>
                                        )}
                                    </h2>
                                    <div className="space-y-4">
                                        {currentData.education.map((edu, i) => (
                                            <div key={i} className="relative pl-5 border-l-2 border-gray-300">
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={editData.education[i]?.institution || ""}
                                                                onChange={(e) => {
                                                                    const updated = [...editData.education];
                                                                    updated[i] = { ...updated[i], institution: e.target.value };
                                                                    setEditData(prev => ({ ...prev, education: updated }));
                                                                }}
                                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/40"
                                                                placeholder="Institution"
                                                            />
                                                            <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-600 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={editData.education[i]?.degree || ""}
                                                                onChange={(e) => {
                                                                    const updated = [...editData.education];
                                                                    updated[i] = { ...updated[i], degree: e.target.value };
                                                                    setEditData(prev => ({ ...prev, education: updated }));
                                                                }}
                                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/40"
                                                                placeholder="Degree"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editData.education[i]?.year || ""}
                                                                onChange={(e) => {
                                                                    const updated = [...editData.education];
                                                                    updated[i] = { ...updated[i], year: e.target.value };
                                                                    setEditData(prev => ({ ...prev, education: updated }));
                                                                }}
                                                                className="w-24 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/40"
                                                                placeholder="Year"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h3 className="text-sm font-bold text-gray-900">{edu.institution}</h3>
                                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-gray-900 inline-block" />
                                                            {edu.degree}, {edu.year}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="bg-white border border-gray-100 shadow-soft rounded-[32px] p-6 sm:p-8 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2 justify-between">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-gray-900" />
                                            Experience
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={addExperience}
                                                className="text-xs font-bold text-gray-900 hover:text-black flex items-center gap-1 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" /> Add
                                            </button>
                                        )}
                                    </h2>
                                    <div className="space-y-5">
                                        {currentData.experience.map((exp, i) => (
                                            <div key={i} className="relative pl-5 border-l-2 border-gray-300">
                                                {isEditing ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={editData.experience[i]?.title || ""}
                                                                onChange={(e) => {
                                                                    const updated = [...editData.experience];
                                                                    updated[i] = { ...updated[i], title: e.target.value };
                                                                    setEditData(prev => ({ ...prev, experience: updated }));
                                                                }}
                                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/40"
                                                                placeholder="Job Title"
                                                            />
                                                            <button onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-600 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <textarea
                                                            value={editData.experience[i]?.description || ""}
                                                            onChange={(e) => {
                                                                const updated = [...editData.experience];
                                                                updated[i] = { ...updated[i], description: e.target.value };
                                                                setEditData(prev => ({ ...prev, experience: updated }));
                                                            }}
                                                            rows={2}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/40 resize-none"
                                                            placeholder="Description"
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h3 className="text-sm font-bold text-gray-900 mb-1">{exp.title}</h3>
                                                        <p className="text-xs text-gray-500 leading-relaxed flex items-start gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-gray-900 inline-block mt-1 shrink-0" />
                                                            {exp.description}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="bg-white border border-gray-100 shadow-soft rounded-[32px] p-6 sm:p-8 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-5 flex items-center gap-2">
                                        <ExternalLink className="w-5 h-5 text-gray-900" />
                                        Social Links
                                    </h2>
                                    <SocialFlipButton />
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-6">

                                {/* Skills & Tools */}
                                <div className="bg-white border border-gray-100 shadow-soft rounded-[32px] p-6 sm:p-8 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-5 flex items-center gap-2 justify-between">
                                        <div className="flex items-center gap-2">
                                            <Code2 className="w-5 h-5 text-gray-900" />
                                            Skills & Tools
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={addSkillCategory}
                                                className="text-xs font-bold text-gray-900 hover:text-black flex items-center gap-1 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" /> Add Category
                                            </button>
                                        )}
                                    </h2>
                                    <div className="space-y-6">
                                        {currentData.skillCategories.map((cat, catIndex) => (
                                            <div key={catIndex}>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.skillCategories[catIndex]?.category || ""}
                                                        onChange={(e) => {
                                                            const updated = [...editData.skillCategories];
                                                            updated[catIndex] = { ...updated[catIndex], category: e.target.value };
                                                            setEditData(prev => ({ ...prev, skillCategories: updated }));
                                                        }}
                                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-900/40 w-full"
                                                        placeholder="Category Name"
                                                    />
                                                ) : (
                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{cat.category}</h3>
                                                )}
                                                <div className="flex flex-wrap gap-2">
                                                    {cat.skills.map((skill, skillIndex) => (
                                                        <span
                                                            key={skillIndex}
                                                            className="relative group px-3.5 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl border border-gray-700 shadow-sm hover:bg-gray-800 transition-colors"
                                                        >
                                                            {skill}
                                                            {isEditing && (
                                                                <button
                                                                    onClick={() => removeSkill(catIndex, skillIndex)}
                                                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="w-2.5 h-2.5" />
                                                                </button>
                                                            )}
                                                        </span>
                                                    ))}
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => addSkill(catIndex)}
                                                            className="px-3.5 py-2 bg-gray-50 text-gray-500 text-xs font-bold rounded-xl border border-dashed border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <Plus className="w-3 h-3" /> Add Skill
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Resume Upload */}
                                <div className="bg-white border border-gray-100 shadow-soft rounded-[32px] p-6 sm:p-8 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-gray-900" />
                                        Resume
                                    </h2>

                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeUpload}
                                        className="hidden"
                                    />

                                    {currentData.resumeFile ? (
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                                    <FileText className="w-6 h-6 text-gray-900" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{currentData.resumeFile}</p>
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Uploaded resume</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => resumeInputRef.current?.click()}
                                                        className="text-xs font-bold text-gray-900 hover:text-black transition-colors px-3 py-1.5 bg-gray-100 rounded-lg"
                                                    >
                                                        Replace
                                                    </button>
                                                    <button
                                                        onClick={removeResume}
                                                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 bg-red-50 rounded-lg"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => resumeInputRef.current?.click()}
                                            className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all group"
                                        >
                                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6 text-gray-900" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-700 mb-1">Upload your resume</p>
                                            <p className="text-xs text-gray-400 font-medium">PDF, DOC, or DOCX — Max 10MB</p>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Stats — Cycling Animation */}
                                <div className="bg-white border border-gray-100 shadow-soft rounded-[32px] p-6 sm:p-8 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-gray-900" />
                                        Quick Stats
                                    </h2>
                                    <StackedLogos
                                        logoGroups={[
                                            [
                                                <div key="projects" className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                                    <div className="text-2xl font-black text-gray-900 tracking-tight">12</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Projects</div>
                                                </div>,
                                                <div key="rating" className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                                    <div className="text-2xl font-black text-gray-900 tracking-tight">4.9</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Rating</div>
                                                </div>,
                                                <div key="credibility" className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                                    <div className="text-2xl font-black text-gray-900 tracking-tight">785</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Credibility</div>
                                                </div>,
                                                <div key="experience" className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                                    <div className="text-2xl font-black text-gray-900 tracking-tight">3yr</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Experience</div>
                                                </div>,
                                            ],
                                            [
                                                <div key="earnings" className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                                    <div className="text-2xl font-black text-gray-900 tracking-tight">₹8.2L</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Earnings</div>
                                                </div>,
                                                <div key="clients" className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                                    <div className="text-2xl font-black text-gray-900 tracking-tight">28</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Clients</div>
                                                </div>,
                                                <div key="streak" className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                                    <div className="text-2xl font-black text-gray-900 tracking-tight">45d</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Streak</div>
                                                </div>,
                                                <div key="rank" className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:bg-gray-100 transition-colors">
                                                    <div className="text-2xl font-black text-gray-900 tracking-tight">Top 5%</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Rank</div>
                                                </div>,
                                            ],
                                        ]}
                                        duration={10}
                                        stagger={2}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
