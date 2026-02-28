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
    Briefcase,
    X,
    Github,
    ExternalLink,
    Award,
    Calendar,
    MapPin,
    Mail,
    Linkedin
} from "lucide-react";

interface Developer {
    name: string;
    role: string;
    skills: string[];
    availability: string;
    rating: number;
    credibilityScore?: number;
    split: string;
    avatar: string;
    bio: string;
    location: string;
    email: string;
    github?: string;
    linkedin?: string;
    experience: string;
    projects: {
        title: string;
        description: string;
        tech: string[];
        link?: string;
        image: string;
    }[];
    achievements: string[];
}

interface PastCollaboration {
    id: string;
    projectName: string;
    teamMembers: {
        name: string;
        role: string;
        avatar: string;
    }[];
    description: string;
    status: 'completed' | 'active' | 'paused';
    duration: string;
    outcome: string;
    revenue?: string;
    tech: string[];
    lastActive: string;
}

export function CollabClient() {
    const viewRef = useRef<HTMLDivElement>(null);
    const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);

    useEffect(() => {
        if (viewRef.current) {
            gsap.fromTo(
                viewRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, []);

    const developers: Developer[] = [
        {
            name: "Alex Rivera",
            role: "Senior Full-Stack Engineer",
            skills: ["React", "Node.js", "GraphQL", "TypeScript", "PostgreSQL", "AWS"],
            availability: "Available Next Week",
            rating: 4.9,
            credibilityScore: 785,
            split: "50/50 Revenue Split",
            avatar: "AR",
            bio: "Passionate full-stack developer with 8+ years of experience building scalable web applications. Love working with startups and turning ideas into reality. Specialized in React ecosystems and cloud architecture.",
            location: "San Francisco, CA",
            email: "alex.rivera@email.com",
            github: "alexrivera",
            linkedin: "alexrivera",
            experience: "8+ years",
            projects: [
                {
                    title: "TaskFlow SaaS",
                    description: "Project management tool with AI-powered task prioritization. Scaled to 50K+ users.",
                    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis"],
                    link: "https://taskflow.demo",
                    image: "🚀"
                },
                {
                    title: "E-commerce Platform",
                    description: "Headless commerce solution with real-time inventory sync. $2M+ in transactions.",
                    tech: ["React", "GraphQL", "Stripe", "AWS"],
                    link: "https://shop.demo",
                    image: "🛒"
                },
                {
                    title: "Analytics Dashboard",
                    description: "Real-time data visualization platform for marketing teams.",
                    tech: ["React", "D3.js", "WebSocket"],
                    image: "📊"
                }
            ],
            achievements: [
                "🏆 Built 3 profitable SaaS products",
                "💰 Generated $5M+ in revenue for clients",
                "👥 Mentored 20+ junior developers",
                "⭐ 4.9 average rating from collaborators"
            ]
        },
        {
            name: "Sarah Chen",
            role: "UI/UX Designer & Dev",
            skills: ["Figma", "TailwindCSS", "Next.js", "Framer", "Typography", "Branding"],
            availability: "Accepting Offers",
            rating: 5.0,
            credibilityScore: 812,
            split: "Hourly or Equity",
            avatar: "SC",
            bio: "Award-winning designer who codes. I bridge the gap between beautiful design and functional development. Specialized in design systems, micro-interactions, and user-centric product development.",
            location: "Austin, TX",
            email: "sarah.chen@email.com",
            github: "sarahchen",
            linkedin: "sarahchen",
            experience: "6 years",
            projects: [
                {
                    title: "Wellness App Redesign",
                    description: "Complete rebrand and UI overhaul. Increased user retention by 85%.",
                    tech: ["Figma", "React Native", "Tailwind"],
                    link: "https://wellness.demo",
                    image: "💚"
                },
                {
                    title: "Banking Dashboard",
                    description: "Modern fintech interface with complex data visualization.",
                    tech: ["Figma", "Next.js", "Chart.js"],
                    image: "🏦"
                },
                {
                    title: "Design System",
                    description: "Comprehensive component library used by 15+ development teams.",
                    tech: ["Figma", "Storybook", "React"],
                    link: "https://ds.demo",
                    image: "🎨"
                }
            ],
            achievements: [
                "🎨 Awwwards Site of the Day winner",
                "📱 3 apps featured on App Store",
                "🎯 85% avg. user retention improvement",
                "✨ 1M+ Figma community downloads"
            ]
        },
        {
            name: "Jordan Smith",
            role: "Smart Contract Developer",
            skills: ["Solidity", "Hardhat", "Rust", "Web3.js", "DeFi", "Security"],
            availability: "Busy until May",
            rating: 4.7,
            credibilityScore: 745,
            split: "Milestone Based",
            avatar: "JS",
            bio: "Blockchain architect specializing in DeFi protocols and NFT platforms. Security-first mindset with extensive smart contract auditing experience. Built protocols managing $50M+ in TVL.",
            location: "Remote (Global)",
            email: "jordan.smith@email.com",
            github: "jordansmith",
            linkedin: "jordansmith",
            experience: "5 years",
            projects: [
                {
                    title: "DeFi Yield Aggregator",
                    description: "Automated yield farming protocol. $50M+ TVL at peak.",
                    tech: ["Solidity", "Hardhat", "React", "Ethers.js"],
                    link: "https://defi.demo",
                    image: "⚡"
                },
                {
                    title: "NFT Marketplace",
                    description: "Gas-optimized marketplace with lazy minting. 100K+ NFTs traded.",
                    tech: ["Solidity", "IPFS", "Next.js"],
                    image: "🖼️"
                },
                {
                    title: "DAO Governance",
                    description: "On-chain voting system with delegation and time-locks.",
                    tech: ["Solidity", "OpenZeppelin", "Snapshot"],
                    link: "https://dao.demo",
                    image: "🗳️"
                }
            ],
            achievements: [
                "🔒 Audited 25+ smart contracts",
                "💎 $50M+ in protocols deployed",
                "🛡️ Zero security breaches",
                "📚 Contributed to OpenZeppelin"
            ]
        },
        {
            name: "Emily Wang",
            role: "CAD Designer",
            skills: ["AutoCAD", "SolidWorks", "Fusion 360", "3D Modeling"],
            availability: "Available Now",
            rating: 4.9,
            credibilityScore: 795,
            split: "Hourly",
            avatar: "EW",
            bio: "Industrial designer turning concepts into production-ready CAD models. I specialize in consumer electronics and ergonomic design structures.",
            location: "Austin, TX",
            email: "emily.wang@email.com",
            experience: "6 years",
            projects: [
                {
                    title: "Smart Ergonomic Chair",
                    description: "Full CAD model for a health-focused office chair.",
                    tech: ["SolidWorks", "Keyshot"],
                    image: "🪑"
                }
            ],
            achievements: [
                "🏭 10+ designs in mass-production",
                "🏆 Red Dot Design conceptual winner"
            ]
        },
        {
            name: "Marcus Johnson",
            role: "Senior CAD Designer",
            skills: ["Revit", "Rhino", "SketchUp"],
            availability: "Part-time only",
            rating: 4.8,
            credibilityScore: 760,
            split: "Project Based",
            avatar: "MJ",
            bio: "Architectural CAD specialist with a focus on modern commercial spaces and sustainable environmental design systems.",
            location: "London, UK",
            email: "mj.designs@email.com",
            experience: "9 years",
            projects: [
                {
                    title: "Eco-Friendly Hub",
                    description: "Architectural schematics for a carbon-neutral shopping center.",
                    tech: ["Revit", "AutoCAD Architecture"],
                    image: "🏢"
                }
            ],
            achievements: [
                "LEED Certified Professional",
                "Detailed 50+ commercial projects"
            ]
        }
    ];

    const [searchQuery, setSearchQuery] = useState("");

    const filteredDevelopers = developers.filter(dev =>
        dev.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        dev.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pastCollaborations: PastCollaboration[] = [
        {
            id: "collab-1",
            projectName: "FinTrack Pro",
            teamMembers: [
                { name: "Emma Wilson", role: "Backend Dev", avatar: "EW" },
                { name: "Mike Chen", role: "Designer", avatar: "MC" }
            ],
            description: "B2B expense tracking SaaS with automated receipt scanning",
            status: "completed",
            duration: "6 months",
            outcome: "Successfully launched, 1.2K paid users",
            revenue: "$45K MRR",
            tech: ["React", "Node.js", "PostgreSQL", "ML"],
            lastActive: "2 weeks ago"
        },
        {
            id: "collab-2",
            projectName: "CodeReview AI",
            teamMembers: [
                { name: "James Park", role: "ML Engineer", avatar: "JP" },
                { name: "Lisa Kumar", role: "Full-Stack", avatar: "LK" }
            ],
            description: "AI-powered code review tool for GitHub repositories",
            status: "active",
            duration: "4 months (ongoing)",
            outcome: "Beta with 500+ developers, seeking Series A",
            revenue: "$12K MRR",
            tech: ["Python", "GPT-4", "React", "Docker"],
            lastActive: "3 hours ago"
        },
        {
            id: "collab-3",
            projectName: "FitPlan Mobile",
            teamMembers: [
                { name: "Nina Rodriguez", role: "iOS Dev", avatar: "NR" },
                { name: "Tom Anderson", role: "Backend", avatar: "TA" }
            ],
            description: "Personalized workout and nutrition planning app",
            status: "completed",
            duration: "8 months",
            outcome: "Acquired by FitnessCo for $850K",
            revenue: "Exited successfully",
            tech: ["Swift", "Firebase", "Node.js"],
            lastActive: "4 months ago"
        },
        {
            id: "collab-4",
            projectName: "CryptoAlert",
            teamMembers: [
                { name: "David Kim", role: "Blockchain Dev", avatar: "DK" }
            ],
            description: "Real-time crypto portfolio tracker with price alerts",
            status: "paused",
            duration: "3 months",
            outcome: "Pivoting to DeFi analytics",
            tech: ["React Native", "Web3", "Redis"],
            lastActive: "1 month ago"
        }
    ];

    const openDeveloperProfile = (dev: Developer) => {
        setSelectedDeveloper(dev);
        document.body.style.overflow = 'hidden';
    };

    const closeDeveloperProfile = () => {
        setSelectedDeveloper(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="flex bg-transparent h-screen overflow-hidden relative">
            <DashboardWaves />
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                <Header />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pt-8 pb-32 lg:pb-20 custom-scrollbar z-0 w-full relative">
                    <div ref={viewRef} className="max-w-6xl mx-auto space-y-6">

                        {/* Page Title */}
                        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
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
                                        <div
                                            key={i}
                                            onClick={() => openDeveloperProfile(dev)}
                                            className="bg-white border border-gray-100 shadow-soft p-5 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:shadow-soft-md hover:border-indigo-200 transition-all cursor-pointer group"
                                        >
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
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeveloperProfile(dev);
                                                    }}
                                                    className="mt-1 w-full sm:w-auto bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    View Profile
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
                                        {pastCollaborations.slice(0, 3).map((collab) => {
                                            const statusColors = {
                                                completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                                active: 'bg-blue-50 text-blue-700 border-blue-200',
                                                paused: 'bg-gray-50 text-gray-600 border-gray-200'
                                            };

                                            return (
                                                <div key={collab.id} className="p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-gray-200 group">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="flex -space-x-2">
                                                            {collab.teamMembers.map((member, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white"
                                                                    title={member.name}
                                                                >
                                                                    {member.avatar}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                                <h4 className="text-sm font-bold text-gray-900 truncate">{collab.projectName}</h4>
                                                                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusColors[collab.status]} whitespace-nowrap`}>
                                                                    {collab.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mb-2 line-clamp-1">{collab.description}</p>
                                                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {collab.duration}
                                                                </span>
                                                                {collab.revenue && (
                                                                    <span className="text-emerald-600 font-bold">• {collab.revenue}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                        <div className="flex flex-wrap gap-1">
                                                            {collab.tech.slice(0, 3).map(tech => (
                                                                <span key={tech} className="text-[9px] uppercase font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                            {collab.tech.length > 3 && (
                                                                <span className="text-[9px] font-bold text-gray-400">+{collab.tech.length - 3}</span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400">{collab.lastActive}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <button className="mt-5 w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                                        <Users className="w-4 h-4" />
                                        View All Collaborations ({pastCollaborations.length})
                                    </button>
                                </div>

                                {/* Developer Profile Modal */}
                                {
                                    selectedDeveloper && (
                                        <div
                                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                                            onClick={() => setSelectedDeveloper(null)}
                                        >
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in zoom-in-95 duration-300"
                                            >
                                                {/* Header */}
                                                <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 p-6 flex items-start justify-between z-10">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black text-white shrink-0">
                                                            {selectedDeveloper.avatar}
                                                        </div>
                                                        <div>
                                                            <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedDeveloper.name}</h2>
                                                            <p className="text-sm font-semibold text-gray-500 mb-3">{selectedDeveloper.role}</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                                    <MapPin className="w-4 h-4" />
                                                                    {selectedDeveloper.location}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {selectedDeveloper.experience} experience
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600">
                                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                                    {selectedDeveloper.rating} rating
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={closeDeveloperProfile}
                                                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
                                                    >
                                                        <X className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 space-y-6">
                                                    {/* Bio */}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                                                        <p className="text-sm text-gray-600 leading-relaxed">{selectedDeveloper.bio}</p>
                                                    </div>

                                                    {/* Skills */}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Skills & Technologies</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedDeveloper.skills.map(skill => (
                                                                <span key={skill} className="text-xs uppercase font-bold tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-2 rounded-lg">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Achievements */}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                            <Award className="w-5 h-5 text-indigo-600" />
                                                            Achievements
                                                        </h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {selectedDeveloper.achievements.map((achievement, i) => (
                                                                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                                    <p className="text-sm font-semibold text-gray-700">{achievement}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Projects Portfolio */}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                            <Code2 className="w-5 h-5 text-indigo-600" />
                                                            Featured Projects
                                                        </h3>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {selectedDeveloper.projects.map((project, i) => (
                                                                <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                                                    <div className="flex items-start gap-4">
                                                                        <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl shrink-0">
                                                                            {project.image}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                                <h4 className="text-base font-bold text-gray-900">{project.title}</h4>
                                                                                {project.link && (
                                                                                    <a
                                                                                        href={project.link}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-indigo-600 hover:text-indigo-700 transition-colors"
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                    >
                                                                                        <ExternalLink className="w-4 h-4" />
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{project.description}</p>
                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                {project.tech.map(tech => (
                                                                                    <span key={tech} className="text-[10px] uppercase font-bold bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded">
                                                                                        {tech}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Contact & Actions */}
                                                    <div className="border-t border-gray-200 pt-6 space-y-4">
                                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Get in Touch</h3>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                                <div className="text-xs font-bold uppercase text-gray-400 mb-1">Availability</div>
                                                                <div className="text-sm font-bold text-emerald-600">{selectedDeveloper.availability}</div>
                                                            </div>
                                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                                <div className="text-xs font-bold uppercase text-gray-400 mb-1">Compensation</div>
                                                                <div className="text-sm font-bold text-gray-900">{selectedDeveloper.split}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-3">
                                                            <button className="flex-1 min-w-[200px] bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg">
                                                                <MessageSquare className="w-4 h-4" />
                                                                Send Message
                                                            </button>
                                                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-6 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                                                <Mail className="w-4 h-4" />
                                                                Email
                                                            </button>
                                                            {selectedDeveloper.github && (
                                                                <a
                                                                    href={`https://github.com/${selectedDeveloper.github}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-gray-900 hover:bg-black text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Github className="w-4 h-4" />
                                                                    GitHub
                                                                </a>
                                                            )}
                                                            {selectedDeveloper.linkedin && (
                                                                <a
                                                                    href={`https://linkedin.com/in/${selectedDeveloper.linkedin}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Linkedin className="w-4 h-4" />
                                                                    LinkedIn
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
