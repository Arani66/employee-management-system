"use client";
// components/Header.tsx
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
    "/": "Dashboard",
    "/employees": "Employee Directory",
    "/employees/add": "Add New Employee",
};

export default function Header() {
    const path = usePathname();
    const title =
        titles[path] ||
        (path.endsWith("/edit") ? "Edit Employee" : path.includes("/employees/") ? "Employee Profile" : "Employee Management");

    return (
        <header className="h-14 border-b border-[#E8EAED] bg-white flex items-center justify-between px-6 lg:px-8 shrink-0">
            <div className="flex items-center gap-2">
                {/* Mobile menu button placeholder */}
                <button className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 mr-2">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <h1 className="text-[15px] font-semibold text-[#1A1D23]">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-8 pr-4 py-1.5 text-sm border border-[#E8EAED] rounded-lg bg-[#F4F5F7] focus:outline-none focus:border-[#4F6EF7] focus:bg-white transition w-48"
                    />
                </div>
                <button className="w-8 h-8 rounded-full bg-[#4F6EF7]/10 text-[#4F6EF7] text-xs font-bold flex items-center justify-center">
                    A
                </button>
            </div>
        </header>
    );
}