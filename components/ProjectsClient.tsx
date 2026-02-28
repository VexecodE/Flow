"use client";

import React, { useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import gsap from "gsap";
import { Header } from "./Header";
import { DashboardWaves } from "./DashboardWaves";
import {
    Briefcase,
    Zap,
    CheckCircle2,
    Clock,
    ArrowRight,
    Github,
    Globe,
    Code2,
    Terminal,
    UploadCloud
} from "lucide-react";

export function ProjectsClient() {
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

    const recentProjects = [
        {
            title: "Distributed Logging Pipeline",
            description: "A high-performance Rust-based logging system capable of handling 5M events/sec.",
            status: "Completed",
            tags: ["Rust", "Kafka", "PostgreSQL"],
            icon: Terminal
        },
        {
            title: "Defi Yield Aggregator",
            description: "Smart contracts for optimizing yield farming across Aave and Compound.",
            status: "Completed",
            tags: ["Solidity", "Web3.js", "React"],
            icon: Zap
        },
        {
            title: "Internal Auth Service",
            description: "Unified IAM and SSO service implemented for 10+ internal microservices.",
            status: "Maintenance",
            tags: ["Go", "gRPC", "Redis"],
            icon: CheckCircle2
        }
    ];

    return (
        <div className="flex bg-transparent h-screen overflow-hidden relative">
            <DashboardWaves />
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                <Header />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pt-8 pb-32 lg:pb-20 custom-scrollbar z-0 w-full relative">
                    <div ref={viewRef} className="max-w-6xl mx-auto space-y-6">

                        {/* Page Title */}
                        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Briefcase className="w-6 h-6 text-gray-900" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Project Portfolio</h1>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Manage and track your active developments and past works.</p>
                                </div>
                            </div>
                            <button className="whitespace-nowrap flex items-center gap-2 bg-primary text-white border border-primary px-6 py-3 rounded-xl text-sm font-bold shadow-soft hover:bg-primary/90 transition-all duration-300">
                                <UploadCloud className="w-5 h-5" />
                                Upload Recent Work
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Current Active Project (Detailed) */}
                            <div className="lg:col-span-2 bg-white border border-gray-100 shadow-soft p-6 sm:p-8 md:p-10 rounded-[32px] flex flex-col hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                        Active Development
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sprint 4 / 8</span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                                    E-commerce Scaling & UI Revamp for "EcoStride"
                                </h2>

                                <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed mb-8 max-w-2xl">
                                    A complete architectural migration of a monolithic legacy Shopify application into a modern, fully headless storefront. Built on top of Next.js 14, TailwindCSS, and a custom content layer, this transformation drastically reduces Time to Interactive (TTI) and improves global page load speeds by over 40%. The backend integrates specialized microservices for inventory and shipping optimization using Go.
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                    {[
                                        { label: "Role", value: "Lead Architect" },
                                        { label: "Stack", value: "Next.js, Go" },
                                        { label: "Target", value: "40% faster TTI" },
                                        { label: "Deadline", value: "Q2 2026" }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
                                            <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-3 text-sm font-bold text-gray-900">
                                        <span>Current Progress</span>
                                        <span>38%</span>
                                    </div>
                                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
                                        <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                                        <div className="pointer-events-none absolute inset-0 rounded-full border border-gray-200/50"></div>
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button className="flex-1 bg-black text-white px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-soft flex items-center justify-center gap-2">
                                            <Code2 className="w-4 h-4" /> View Source
                                        </button>
                                        <button className="flex-1 bg-white border border-gray-200 text-gray-900 px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                                            <Globe className="w-4 h-4" /> Live Demo
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Projects List */}
                            <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] flex flex-col hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Recent Works</h3>

                                <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                                    {recentProjects.map((proj, i) => (
                                        <div key={i} className="p-5 border border-gray-100 bg-gray-50/50 rounded-2xl hover:bg-white hover:border-gray-200 transition-all cursor-pointer group">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 group-hover:shadow-sm transition-all">
                                                    <proj.icon className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-gray-900 mb-1">{proj.title}</h4>
                                                    <p className="text-xs text-gray-500 font-medium mb-3 line-clamp-2 leading-relaxed">
                                                        {proj.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {proj.tags.map(tag => (
                                                            <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-md">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="mt-6 w-full py-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 transition-colors flex items-center justify-center gap-2 group">
                                    View All Archive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
