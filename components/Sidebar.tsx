"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import {
  Home,
  Settings,
  BarChart2,
  Wallet,
  ReceiptText,
  PieChart,
  User,
  CreditCard,
  Building2,
  ScanFace,
  ShieldCheck,
  Upload,
  Briefcase,
  TrendingUp,
  CalendarDays,
  Users,
  ShoppingBag,
  Target
} from "lucide-react";
import clsx from "clsx";

export function Sidebar() {
  const sidebarRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/", badge: undefined },
    { icon: ReceiptText, label: "Transactions", href: "/ledger", badge: "2 New" },
    { icon: Upload, label: "Resume Upload", href: "/resume" },
    { icon: Briefcase, label: "Projects", href: "/projects" },
    { icon: TrendingUp, label: "Investments", href: "/investments" },
    { icon: CalendarDays, label: "Calendar", href: "/calendar" },
    { icon: Users, label: "Collab", href: "/collab" },
    { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
    { icon: Target, label: "Credit Score", href: "/credit" },
    { icon: Settings, label: "Settings", href: "#" },
    { icon: User, label: "Profile", href: "#" },
  ];

  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        className="hidden lg:flex w-[280px] h-[calc(100vh-32px)] my-4 ml-4 bg-white rounded-[32px] shadow-soft border border-gray-100 flex-col pt-8 pb-6 overflow-y-auto hide-scrollbar shrink-0 z-50 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300"
      >
        <style dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />

        <div className="px-4 mb-10 flex justify-center">
          <Link href="/" className="flex items-center transition-all duration-300 hover:opacity-80">
            <img src="/logo_v2.png" alt="Flo Logo" className="h-24 w-auto object-contain invert" />
          </Link>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3 mt-2">Menu</h3>
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={i}
                href={item.href || "#"}
                className={clsx(
                  "flex items-center justify-between px-4 py-3 rounded-full transition-all duration-200 text-sm font-medium w-full",
                  isActive
                    ? "bg-black shadow-soft text-white"
                    : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-black"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={clsx(
                    "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
                    isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-white shadow-soft-lg rounded-full py-3 px-6 flex items-center justify-between z-50">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href || "#"}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 rounded-xl transition-all",
                isActive ? "text-primary" : "text-gray-400 hover:text-black hover:bg-gray-50 delay-75"
              )}
            >
              <item.icon className={clsx("w-6 h-6", isActive && "drop-shadow-sm")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={clsx("text-[9px] font-bold tracking-tight", isActive ? "opacity-100" : "opacity-0 h-0 transition-opacity")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  );
}
