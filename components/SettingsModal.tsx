    "use client";

import React from "react";
import { X, User, Bell, Shield, Key, Mail, Globe, Moon } from "lucide-react";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    if (!isOpen) return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #9ca3af;
                    }
                `
            }} />
            <div 
                className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen w-screen"
                onClick={onClose}
            >
                <div 
                    className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    <div className="p-6 space-y-6">
                    {/* Profile Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-700" />
                            <h3 className="text-lg font-bold text-gray-900">Profile</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Display Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-gray-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Notification Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-gray-700" />
                            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Email Notifications</div>
                                    <div className="text-xs text-gray-500 mt-1">Receive updates via email</div>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                            </label>
                            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Calendar Reminders</div>
                                    <div className="text-xs text-gray-500 mt-1">Get notified about upcoming events</div>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                            </label>
                            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Transaction Alerts</div>
                                    <div className="text-xs text-gray-500 mt-1">Notify on new transactions</div>
                                </div>
                                <input type="checkbox" className="w-5 h-5 rounded" />
                            </label>
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Privacy & Security */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-gray-700" />
                            <h3 className="text-lg font-bold text-gray-900">Privacy & Security</h3>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Change Password</div>
                                    <div className="text-xs text-gray-500 mt-1">Update your password</div>
                                </div>
                                <Key className="w-5 h-5 text-gray-400" />
                            </button>
                            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Two-Factor Authentication</div>
                                    <div className="text-xs text-gray-500 mt-1">Add an extra layer of security</div>
                                </div>
                                <input type="checkbox" className="w-5 h-5 rounded" />
                            </label>
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Appearance */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Moon className="w-5 h-5 text-gray-700" />
                            <h3 className="text-lg font-bold text-gray-900">Appearance</h3>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Dark Mode</div>
                                    <div className="text-xs text-gray-500 mt-1">Switch to dark theme</div>
                                </div>
                                <input type="checkbox" className="w-5 h-5 rounded" />
                            </label>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Language</label>
                                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-gray-400 focus:outline-none bg-white">
                                    <option>English (US)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 pb-2">
                        <button 
                            onClick={onClose}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-black transition-all">
                            Save Changes
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
