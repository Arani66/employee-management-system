"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
    {
        label: "Main",
        items: [
            { href: "/", icon: GridIcon, label: "Dashboard" },
            { href: "/employees", icon: UsersIcon, label: "Employees" },
            { href: "/employees/add", icon: PlusCircleIcon, label: "Add Employee" },
        ],
    },
];

export default function Sidebar() {
    const path = usePathname();

    return (
        <aside
            className="hidden lg:flex flex-col w-[240px] shrink-0 h-screen overflow-y-auto"
            style={{ background: "var(--sidebar-bg)" }}
        >
            {/* Logo */}
            <div className="px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#4F6EF7] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <span className="text-white font-semibold text-[15px] tracking-tight">PeopleOS</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-6">
                {nav.map((group) => (
                    <div key={group.label}>
                        <p className="px-3 mb-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                            {group.label}
                        </p>
                        {group.items.map(({ href, icon: Icon, label }) => {
                            const active = path === href || (href !== "/" && path.startsWith(href));
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 ${
                                        active
                                            ? "bg-[#4F6EF7] text-white"
                                            : "text-white/60 hover:text-white hover:bg-white/8"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Bottom */}
            <div className="px-4 py-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4F6EF7]/20 flex items-center justify-center text-[#4F6EF7] text-xs font-bold">
                        A
                    </div>
                    <div>
                        <p className="text-white/80 text-xs font-medium">Admin</p>
                        <p className="text-white/30 text-[10px]">admin@company.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

// Inline SVG icons
function GridIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
    );
}
function UsersIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
function PlusCircleIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    );
}