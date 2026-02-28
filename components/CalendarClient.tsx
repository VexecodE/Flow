"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import gsap from "gsap";
import { Header } from "./Header";
import { DashboardWaves } from "./DashboardWaves";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Clock,
    MapPin,
    ArrowRight,
    MoreHorizontal,
    X,
    Bell
} from "lucide-react";

export function CalendarClient() {
    const viewRef = useRef<HTMLDivElement>(null);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 28)); // Feb 28, 2026 as per context
    const [expandedDate, setExpandedDate] = useState<number | null>(null);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventTime, setNewEventTime] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    const [events, setEvents] = useState([
        { day: 5, title: "Product Sync", time: "10:00 AM", type: "meeting" },
        { day: 12, title: "Q1 Review", time: "2:00 PM", type: "important" },
        { day: 15, title: "Design Offsite", time: "All Day", type: "event" },
        { day: 22, title: "Team Lunch", time: "1:00 PM", type: "personal" },
        { day: 28, title: "Client Demo", time: "11:00 AM", type: "meeting" },
        { day: 28, title: "Engineering Sync", time: "4:00 PM", type: "meeting" }
    ]);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    useEffect(() => {
        if (viewRef.current) {
            gsap.fromTo(
                viewRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [currentDate]);

    // Show demo notification after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotification(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Auto-hide notification after 8 seconds
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    // Calendar logic
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null); // Empty slots before 1st day
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthName = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    const handleAddEvent = (e: React.FormEvent, day: number) => {
        e.preventDefault();
        if (newEventTitle.trim()) {
            setEvents([...events, { day, title: newEventTitle, time: newEventTime || "TBD", type: "event" }]);
            setNewEventTitle("");
            setNewEventTime("");
        }
    };

    const upcomingEvents = events.filter(e => e.day >= 28).sort((a, b) => a.day - b.day);

    const getEventColor = (type: string) => {
        switch (type) {
            case 'meeting': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'important': return 'bg-red-50 text-red-700 border-red-100';
            case 'event': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'personal': return 'bg-green-50 text-green-700 border-green-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="flex bg-transparent h-screen overflow-hidden relative">
            <DashboardWaves />
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                <Header />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pt-8 pb-32 lg:pb-20 custom-scrollbar z-0 w-full relative">
                    <div ref={viewRef} className="max-w-7xl mx-auto space-y-6">

                        {/* Page Header */}
                        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Calendar</h1>
                                <p className="text-sm font-medium text-gray-500 mt-1">Manage your schedule and upcoming events.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="bg-gray-50 text-gray-600 border border-gray-100 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm">
                                    Today
                                </button>
                                <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-soft flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Event
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                            {/* Main Calendar Area */}
                            <div className="xl:col-span-3 bg-white border border-gray-100 shadow-soft rounded-[32px] flex flex-col overflow-hidden">

                                {/* Calendar Header */}
                                <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                                        {currentMonthName} {currentYear}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <button onClick={prevMonth} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm">
                                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button onClick={nextMonth} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm">
                                            <ChevronRight className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Calendar Grid */}
                                <div className="flex-1 p-6">
                                    <div className="grid grid-cols-7 mb-4">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 sm:gap-3 auto-rows-[100px] sm:auto-rows-[120px]">
                                        {days.map((day, idx) => {
                                            if (day === null) {
                                                return <div key={`empty-${idx}`} className="rounded-2xl bg-gray-50/50 border border-transparent"></div>;
                                            }

                                            const dayEvents = events.filter(e => e.day === day);
                                            const isToday = day === 28; // Hardcoded for demo state

                                            return (
                                                <div
                                                    key={day}
                                                    onClick={() => setExpandedDate(day)}
                                                    className={`rounded-2xl border p-2 flex flex-col transition-all duration-200 hover:border-gray-300 hover:shadow-soft-sm cursor-pointer ${isToday ? 'border-gray-900 bg-gray-50/30 shadow-sm' : 'border-gray-100 bg-white'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-black text-white' : 'text-gray-500'}`}>
                                                            {day}
                                                        </span>
                                                        {dayEvents.length > 0 && <MoreHorizontal className="w-4 h-4 text-gray-300" />}
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-1.5 pt-1">
                                                        {dayEvents.map((evt, eIdx) => (
                                                            <div key={eIdx} className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg border leading-tight ${getEventColor(evt.type)}`}>
                                                                <div className="truncate">{evt.title}</div>
                                                                <div className="font-normal opacity-80 mt-0.5 truncate">{evt.time}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <style dangerouslySetInnerHTML={{
                                                        __html: `
                                                        .hide-scrollbar::-webkit-scrollbar { display: none; }
                                                        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                                                    `}} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Upcoming Area */}
                            <div className="bg-white border border-gray-100 shadow-soft rounded-[32px] p-6 lg:p-8 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Today's Focus</h3>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 bg-black rounded-bl-[100px] w-24 h-24"></div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{currentMonthName} 28, {currentYear}</div>
                                    <div className="text-2xl font-black text-gray-900 leading-none">Friday</div>
                                </div>

                                <h4 className="text-sm font-semibold text-gray-500 mb-4 tracking-tight">Upcoming Events</h4>

                                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                                    {upcomingEvents.map((evt, i) => (
                                        <div key={i} className={`p-4 rounded-xl border flex flex-col gap-2 ${getEventColor(evt.type)} transition-transform hover:scale-[1.02] cursor-pointer shadow-sm`}>
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-sm font-bold tracking-tight">{evt.title}</h5>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold opacity-80 mt-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {evt.time}
                                            </div>
                                            {(evt.type === 'meeting' || evt.type === 'event') && (
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-tight opacity-70 uppercase mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    Remote Setup
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {upcomingEvents.length === 0 && (
                                        <div className="py-10 text-center">
                                            <p className="text-xs font-semibold text-gray-400">No events left today!</p>
                                        </div>
                                    )}
                                </div>

                                <button className="mt-6 w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-600 transition-colors flex items-center justify-center gap-2">
                                    View Full Schedule <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                        </div>
                    </div>
                </main>
            </div>

            {/* Expanded Date Modal Overlay */}
            {expandedDate && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
                    onClick={() => setExpandedDate(null)}
                >
                    <div
                        className="bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-6 sm:p-8 w-full max-w-[450px] flex flex-col gap-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {currentMonthName} {expandedDate}, {currentYear}
                            </h3>
                            <button
                                onClick={() => setExpandedDate(null)}
                                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[250px] flex flex-col gap-3 custom-scrollbar pr-2">
                            {events.filter(e => e.day === expandedDate).length > 0 ? (
                                events.filter(e => e.day === expandedDate).map((evt, eIdx) => (
                                    <div key={eIdx} className={`px-4 py-3 rounded-2xl border flex flex-col gap-1 ${getEventColor(evt.type)}`}>
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-sm tracking-tight">{evt.title}</span>
                                            <span className="opacity-70 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap bg-white/50 px-2 py-0.5 rounded-md">{evt.time}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 font-medium italic text-center py-6">No events scheduled.</p>
                            )}
                        </div>

                        <form onSubmit={(e) => handleAddEvent(e, expandedDate)} className="mt-2 flex flex-col gap-3 border-t border-gray-100 pt-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Add New Event</h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Event title..."
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                    className="flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-xl px-3 sm:px-4 py-3 text-sm font-medium outline-none focus:border-gray-300 focus:bg-white transition-all shadow-inner"
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    placeholder="Time (e.g. 2 PM)"
                                    value={newEventTime}
                                    onChange={(e) => setNewEventTime(e.target.value)}
                                    className="w-24 sm:w-28 min-w-0 bg-gray-50 border border-gray-100 rounded-xl px-3 sm:px-4 py-3 text-sm font-medium outline-none focus:border-gray-300 focus:bg-white transition-all shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!newEventTitle.trim()}
                                    className="bg-black text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notification Popup */}
            {showNotification && (
                <div className="fixed top-20 right-4 z-[150] max-w-sm animate-in slide-in-from-right duration-500">
                    <div className="bg-blue-50 border-2 border-blue-500 rounded-2xl shadow-2xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                <Bell className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-gray-900 leading-tight">Upcoming Event</h4>
                                    <button
                                        onClick={() => setShowNotification(false)}
                                        className="w-6 h-6 rounded-lg bg-white/50 hover:bg-white flex items-center justify-center transition-colors shrink-0"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <p className="text-base font-bold text-gray-900 mb-2">Client Demo</p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                    <Clock className="w-3.5 h-3.5" />
                                    Starting at 11:00 AM
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
