"use client";

import React, { useRef, useEffect, useState } from "react";
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
    LayoutTemplate,
    Zap,
    Database,
    Smartphone,
    Palette,
    Shield,
    Globe,
    Terminal,
    Box,
    X,
    Trash2
} from "lucide-react";

interface CartItem {
    title: string;
    creator: string;
    type: string;
    price: string;
    priceValue: number;
}

export function MarketplaceClient() {
    const viewRef = useRef<HTMLDivElement>(null);
    const [showAllItems, setShowAllItems] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);

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
            priceValue: 49,
            rating: 4.9,
            sales: 1240,
            imageBg: "bg-blue-50"
        },
        {
            title: "3D CAD Design Model Pack",
            creator: "Emily Wang",
            type: "CAD Assets",
            icon: PenTool,
            price: "$129",
            priceValue: 129,
            rating: 4.9,
            sales: 870,
            imageBg: "bg-purple-50"
        },
        {
            title: "Patreon-style Subscription SDK",
            creator: "FinTech Labs",
            type: "SDK & Functions",
            icon: Code2,
            price: "$89",
            priceValue: 89,
            rating: 4.8,
            sales: 2101,
            imageBg: "bg-green-50"
        },
        {
            title: "Real-time Analytics Dashboard",
            creator: "DataViz Pro",
            type: "Dashboard",
            icon: Zap,
            price: "$79",
            priceValue: 79,
            rating: 4.7,
            sales: 1543,
            imageBg: "bg-yellow-50"
        },
        {
            title: "PostgreSQL Schema Builder",
            creator: "DevTools Inc",
            type: "Database Tools",
            icon: Database,
            price: "$39",
            priceValue: 39,
            rating: 4.8,
            sales: 987,
            imageBg: "bg-indigo-50"
        },
        {
            title: "Mobile UI Kit - iOS & Android",
            creator: "MobileFirst",
            type: "UI Kit",
            icon: Smartphone,
            price: "$149",
            priceValue: 149,
            rating: 4.9,
            sales: 2340,
            imageBg: "bg-pink-50"
        },
        {
            title: "Design System Template",
            creator: "DesignCo",
            type: "Design",
            icon: Palette,
            price: "$99",
            priceValue: 99,
            rating: 4.6,
            sales: 756,
            imageBg: "bg-orange-50"
        },
        {
            title: "Auth0 Integration Kit",
            creator: "SecureApps",
            type: "Security",
            icon: Shield,
            price: "$59",
            priceValue: 59,
            rating: 4.8,
            sales: 1234,
            imageBg: "bg-red-50"
        },
        {
            title: "Landing Page Templates",
            creator: "WebCraft",
            type: "Templates",
            icon: Globe,
            price: "$69",
            priceValue: 69,
            rating: 4.7,
            sales: 1890,
            imageBg: "bg-teal-50"
        },
        {
            title: "CLI Tool Generator",
            creator: "DevForge",
            type: "Tools",
            icon: Terminal,
            price: "$45",
            priceValue: 45,
            rating: 4.5,
            sales: 543,
            imageBg: "bg-cyan-50"
        },
        {
            title: "3D Component Library",
            creator: "ThreeJS Masters",
            type: "3D Assets",
            icon: Box,
            price: "$199",
            priceValue: 199,
            rating: 4.9,
            sales: 432,
            imageBg: "bg-violet-50"
        },
        {
            title: "Payment Gateway Integration",
            creator: "FinTech Labs",
            type: "Backend",
            icon: CreditCard,
            price: "$89",
            priceValue: 89,
            rating: 4.8,
            sales: 1123,
            imageBg: "bg-emerald-50"
        }
    ];

    const displayedProducts = showAllItems ? products : products.slice(0, 3);

    const addToCart = (product: typeof products[0]) => {
        const cartItem: CartItem = {
            title: product.title,
            creator: product.creator,
            type: product.type,
            price: product.price,
            priceValue: product.priceValue
        };
        setCart([...cart, cartItem]);
    };

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + item.priceValue, 0);
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
                                        <button 
                                            onClick={() => setShowAllItems(!showAllItems)}
                                            className="text-sm font-bold text-gray-900 hover:text-black transition-colors cursor-pointer uppercase tracking-tight flex items-center gap-1"
                                        >
                                            {showAllItems ? 'Show Less' : 'View all'} <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {displayedProducts.map((item, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => addToCart(item)}
                                                className="bg-white border border-gray-100 shadow-soft rounded-[24px] overflow-hidden hover:shadow-soft-md hover:border-gray-300 transition-all group flex flex-col justify-between cursor-pointer"
                                            >
                                                <div className={`h-32 ${item.imageBg} flex items-center justify-center relative`}>
                                                    <item.icon className="w-12 h-12 text-black/50 group-hover:scale-110 transition-transform duration-300" />
                                                    <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white">
                                                        {item.type}
                                                    </div>
                                                    <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Add to Cart
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
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">{cart.length} items</span>
                                    </h3>

                                    {cart.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 mb-6">
                                            <Package className="w-8 h-8 text-gray-300 mb-2" />
                                            <p className="text-sm font-bold text-gray-400">Cart is empty</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                                            {cart.map((item, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all group">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div className="flex-1">
                                                            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                                                            <p className="text-[10px] text-gray-500 font-medium">{item.creator}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(index)}
                                                            className="w-6 h-6 bg-white hover:bg-red-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200"
                                                        >
                                                            <Trash2 className="w-3 h-3 text-gray-600 hover:text-red-600" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                                            {item.type}
                                                        </span>
                                                        <span className="text-sm font-black text-gray-900">{item.price}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="border-t border-gray-100 pt-4 mb-5 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-500">Subtotal</span>
                                            <span className="font-bold text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button 
                                        disabled={cart.length === 0}
                                        className={`w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                            cart.length > 0 
                                                ? 'bg-gray-900 text-white hover:bg-black cursor-pointer shadow-soft' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
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
