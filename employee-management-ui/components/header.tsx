"use client";
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
                <button className="w-8 h-8 rounded-full bg-[#4F6EF7]/10 text-[#4F6EF7] text-xs font-bold flex items-center justify-center">
                    A
                </button>
            </div>
        </header>
    );
}