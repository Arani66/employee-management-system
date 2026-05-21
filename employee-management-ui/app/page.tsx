"use client";
// app/page.tsx — Dashboard
import { useEffect, useState } from "react";
import Link from "next/link";
import { Employee } from "@/types";

const DEPT_LABELS: Record<string, string> = {
    ENG: "Engineering", HR: "Human Resources", FIN: "Finance", MKT: "Marketing",
};

export default function Dashboard() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/api/employees")
            .then((r) => r.json())
            .then(setEmployees)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const deptCounts = employees.reduce<Record<string, number>>((acc, e) => {
        acc[e.departmentId] = (acc[e.departmentId] || 0) + 1;
        return acc;
    }, {});

    const avgSalary = employees.length
        ? Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length)
        : 0;

    const stats = [
        { label: "Total Employees", value: employees.length, icon: "👥", color: "bg-blue-50 text-blue-600" },
        { label: "Avg. Salary", value: `$${avgSalary.toLocaleString()}`, icon: "💰", color: "bg-emerald-50 text-emerald-600" },
        { label: "Departments", value: Object.keys(deptCounts).length, icon: "🏢", color: "bg-purple-50 text-purple-600" },
    ];

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-[#E8EAED] shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.color}`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#1A1D23]">{loading ? "—" : s.value}</p>
                            <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { href: "/employees", label: "View All Employees", icon: "👁️" },
                    { href: "/employees/add", label: "Add Employee", icon: "➕" },
                ].map((a) => (
                    <Link key={a.href} href={a.href}
                          className="bg-white border border-[#E8EAED] rounded-xl p-4 hover:border-[#4F6EF7] hover:shadow-sm transition-all text-center">
                        <span className="text-2xl">{a.icon}</span>
                        <p className="text-xs font-medium text-[#374151] mt-2">{a.label}</p>
                    </Link>
                ))}
            </div>

            {/* Recent employees */}
            <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F4F5F7] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#1A1D23]">Recent Employees</h3>
                    <Link href="/employees" className="text-xs text-[#4F6EF7] hover:underline">View all →</Link>
                </div>
                {loading ? (
                    <div className="px-5 py-8 text-center text-sm text-[#9CA3AF]">Loading…</div>
                ) : (
                    <div className="divide-y divide-[#F4F5F7]">
                        {employees.slice(0, 5).map((emp) => (
                            <Link key={emp.employeeId} href={`/employees/${emp.employeeId}`}
                                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F9FAFB] transition-colors">
                                <div className="w-8 h-8 rounded-full bg-[#4F6EF7]/10 text-[#4F6EF7] text-xs font-bold flex items-center justify-center shrink-0">
                                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1A1D23]">{emp.firstName} {emp.lastName}</p>
                                    <p className="text-xs text-[#9CA3AF] truncate">{emp.designation}</p>
                                </div>
                                <span className="text-xs text-[#9CA3AF]">{DEPT_LABELS[emp.departmentId] || emp.departmentId}</span>
                            </Link>
                        ))}
                        {employees.length === 0 && (
                            <p className="px-5 py-6 text-sm text-center text-[#9CA3AF]">No employees yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}