"use client";

import React, { useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import gsap from "gsap";
import { Header } from "./Header";
import { DashboardWaves } from "./DashboardWaves";
import {
    ShoppingBag,
    Package,
    Code2,
    Star,
    Crown,
    CreditCard,
    ArrowRight,
    PenTool,
    LayoutTemplate
} from "lucide-react";

export function MarketplaceClient() {
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

    const products = [
        {
            title: "Advanced Auth Components",
            creator: "Studio UI",
            type: "Components",
            icon: LayoutTemplate,
            price: "$49",
            rating: 4.9,
            sales: 1240,
            imageBg: "bg-gray-100"
        },
        {
            title: "3D CAD Design Model Pack",
            creator: "Emily Wang",
            type: "CAD Assets",
            icon: PenTool,
            price: "$129",
            rating: 4.9,
            sales: 870,
            imageBg: "bg-gray-100"
        },
        {
            title: "Patreon-style Subscription SDK",
            creator: "FinTech Labs",
            type: "SDK & Functions",
            icon: Code2,
            price: "$89",
            rating: 4.8,
            sales: 2101,
            imageBg: "bg-gray-100"
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
                        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] flex items-center justify-between gap-4 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <ShoppingBag className="w-6 h-6 text-gray-900" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Marketplace & Creator Hub</h1>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Buy and sell UI components, templates, and backend functions.</p>
                                </div>
                            </div>
                            <button className="hidden sm:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-soft hover:bg-black transition-colors">
                                <Crown className="w-4 h-4" /> Become a Creator
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Main Content Area */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Featured Creator Subscription (Patreon style) */}
                                <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden group hover:border-gray-200 hover:shadow-soft-lg transition-all">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700 pointer-events-none">
                                        <Crown className="w-48 h-48 text-black" />
                                    </div>
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-gray-800 to-gray-900 shadow-lg flex items-center justify-center shrink-0 border-4 border-white z-10">
                                        <span className="text-3xl sm:text-4xl font-black text-white">SUI</span>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left z-10">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-900 mb-3 border border-gray-200">
                                            Top Rated Creator
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">Studio UI PRO</h2>
                                        <p className="text-sm font-medium text-gray-500 mb-4 max-w-sm mx-auto sm:mx-0 leading-relaxed">
                                            Get access to over 500+ premium React components, weekly updates, and priority support directly from the developers.
                                        </p>
                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <button className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-soft hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                                Subscribe $29/mo
                                            </button>
                                            <button className="w-full sm:w-auto bg-gray-50 text-gray-800 border border-gray-200 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                                                View Catalog
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Grid */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Trending Items</h3>
                                        <div className="text-sm font-bold text-gray-900 hover:text-black transition-colors cursor-pointer uppercase tracking-tight flex items-center gap-1">
                                            View all <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {products.map((item, i) => (
                                            <div key={i} className="bg-white border border-gray-100 shadow-soft rounded-[24px] overflow-hidden hover:shadow-soft-md transition-shadow group flex flex-col justify-between cursor-pointer">
                                                <div className={`h-32 ${item.imageBg} flex items-center justify-center relative`}>
                                                    <item.icon className="w-12 h-12 text-black/50 group-hover:scale-110 transition-transform duration-300" />
                                                    <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white">
                                                        {item.type}
                                                    </div>
                                                </div>
                                                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                                                    <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                                                    <p className="text-xs font-medium text-gray-500 mb-3">{item.creator}</p>
                                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                                                        <span className="text-lg font-black text-gray-900 tracking-tight">{item.price}</span>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                                                                <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                                                                {item.rating}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sales} sold</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Cart & Analytics Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6 flex items-center justify-between">
                                        Your Cart
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">0 items</span>
                                    </h3>

                                    <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 mb-6">
                                        <Package className="w-8 h-8 text-gray-300 mb-2" />
                                        <p className="text-sm font-bold text-gray-400">Cart is empty</p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mb-5 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-500">Subtotal</span>
                                            <span className="font-bold text-gray-900">$0.00</span>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                        <CreditCard className="w-4 h-4" /> Checkout
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
