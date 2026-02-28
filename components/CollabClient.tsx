"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import gsap from "gsap";
import { Header } from "./Header";
import { DashboardWaves } from "./DashboardWaves";
import {
    Users,
    Search,
    Code2,
    Star,
    MessageSquare,
    Link as LinkIcon,
    ArrowRight,
    Briefcase
} from "lucide-react";

export function CollabClient() {
    const viewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewRef.current) {
            gsap.fromTo(
                viewRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, []);

    const developers = [
        {
            name: "Alex Rivera",
            role: "Senior Full-Stack Engineer",
            skills: ["React", "Node.js", "GraphQL"],
            availability: "Available Next Week",
            rating: 4.9,
            credibilityScore: 785,
            split: "50/50 Revenue Split",
            avatar: "AR"
        },
        {
            name: "Sarah Chen",
            role: "UI/UX Designer & Dev",
            skills: ["Figma", "TailwindCSS", "Next.js"],
            availability: "Accepting Offers",
            rating: 5.0,
            credibilityScore: 812,
            split: "Hourly or Equity",
            avatar: "SC"
        },
        {
            name: "Jordan Smith",
            role: "Smart Contract Developer",
            skills: ["Solidity", "Hardhat", "Rust"],
            availability: "Busy until May",
            rating: 4.7,
            credibilityScore: 745,
            split: "Milestone Based",
            avatar: "JS"
        },
        {
            name: "Emily Wang",
            role: "CAD Designer",
            skills: ["AutoCAD", "SolidWorks", "Fusion 360", "3D Modeling"],
            availability: "Available Now",
            rating: 4.9,
            credibilityScore: 795,
            split: "Hourly",
            avatar: "EW"
        },
        {
            name: "Marcus Johnson",
            role: "Senior CAD Designer",
            skills: ["Revit", "Rhino", "SketchUp"],
            availability: "Part-time only",
            rating: 4.8,
            credibilityScore: 760,
            split: "Project Based",
            avatar: "MJ"
        }
    ];

    const [searchQuery, setSearchQuery] = useState("");

    const filteredDevelopers = developers.filter(dev =>
        dev.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dev.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex bg-transparent h-screen overflow-hidden relative">
            <DashboardWaves />
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                <Header />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pt-8 pb-32 lg:pb-20 custom-scrollbar z-0 w-full relative">
                    <div ref={viewRef} className="max-w-6xl mx-auto space-y-6">

                        {/* Page Title */}
                        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] flex items-center justify-between gap-4 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Collaboration Hub</h1>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Find partners to build, share revenue, and innovate together.</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-soft transition-colors focus-within:ring-2 focus-within:ring-white/20">
                                <Search className="w-4 h-4 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Find Clients"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-white placeholder:text-gray-400 w-48 font-semibold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Main Content Area */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Featured Opportunity */}
                                <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 border border-indigo-700 shadow-soft p-6 sm:p-8 rounded-[32px] flex flex-col relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                                        <Code2 className="w-32 h-32 text-white" />
                                    </div>
                                    <div className="relative z-10 flex items-center gap-3 mb-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            Active Co-founder Search
                                        </span>
                                    </div>

                                    <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                                        SaaS AI Analytics Platform
                                    </h2>

                                    <p className="relative z-10 text-indigo-100 text-sm leading-relaxed max-w-lg mb-6">
                                        Looking for a backend architect to partner on a high-growth AI analytics tool. MVP is complete, beta customers are signed up. Offering a 50/50 revenue split and co-founder equity.
                                    </p>

                                    <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                            <div className="text-[10px] uppercase font-bold text-indigo-300 mb-1">Required Skills</div>
                                            <div className="text-sm font-bold text-white">Python, AWS, Postgres</div>
                                        </div>
                                        <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                            <div className="text-[10px] uppercase font-bold text-indigo-300 mb-1">Compensation</div>
                                            <div className="text-sm font-bold text-white">50% Rev Split + Equity</div>
                                        </div>
                                    </div>

                                    <button className="relative z-10 mt-auto bg-white text-indigo-900 py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors w-max shadow-lg">
                                        <MessageSquare className="w-4 h-4" /> Message Creator
                                    </button>
                                </div>

                                {/* List of Devs */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center justify-between">
                                        Available Talent
                                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase gap-1 flex items-center">
                                            View Map <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </h3>
                                    {filteredDevelopers.map((dev, i) => (
                                        <div key={i} className="bg-white border border-gray-100 shadow-soft p-5 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:shadow-soft-md transition-shadow cursor-pointer group">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-50 to-blue-50 border-2 border-white shadow-sm flex items-center justify-center text-lg font-black text-indigo-700 shrink-0 group-hover:scale-105 transition-transform">
                                                {dev.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <h4 className="text-base font-bold text-gray-900 truncate">{dev.name}</h4>
                                                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1 shrink-0">
                                                            Score: {dev.credibilityScore}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 w-max shrink-0">
                                                        {dev.availability}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-500 mb-2">{dev.role}</p>
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {dev.skills.map(skill => (
                                                        <span key={skill} className="text-[10px] uppercase font-bold tracking-wider bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 shrink-0 sm:w-32 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-5 w-full">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <span className="text-sm font-bold text-gray-900">{dev.rating}</span>
                                                </div>
                                                <div className="text-[10px] font-bold uppercase text-gray-400 text-right">
                                                    {dev.split}
                                                </div>
                                                <button className="mt-1 w-full sm:w-auto bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                                                    Connect
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar / Filters */}
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Post an Opportunity</h3>
                                    <p className="text-sm text-gray-500 font-medium mb-5 leading-relaxed">
                                        Looking for a co-creator? Describe your project, the skills you need, and how you want to share the revenue or equity.
                                    </p>
                                    <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-soft transition-colors flex items-center justify-center gap-2">
                                        <Briefcase className="w-4 h-4" /> Create Listing
                                    </button>
                                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                                        <a href="#" className="text-xs font-bold text-indigo-600 hover:underline">Learn about our Smart Contracts for Rev-Split</a>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Your Network</h3>

                                    <div className="space-y-3">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-gray-900">Collaboration #{i + 1}</div>
                                                    <div className="text-xs font-medium text-gray-500">Last active 2h ago</div>
                                                </div>
                                                <LinkIcon className="w-4 h-4 text-gray-300" />
                                            </div>
                                        ))}
                                    </div>

                                    <button className="mt-5 w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-colors">
                                        View All Connections
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
