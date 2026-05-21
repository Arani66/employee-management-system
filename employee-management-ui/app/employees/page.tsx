"use client";
// app/employees/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { Employee } from "@/types";

const DEPT_LABELS: Record<string, string> = {
    ENG: "Engineering", HR: "Human Resources", FIN: "Finance", MKT: "Marketing",
};
const DEPT_COLORS: Record<string, string> = {
    ENG: "bg-blue-50 text-blue-700",
    HR:  "bg-purple-50 text-purple-700",
    FIN: "bg-emerald-50 text-emerald-700",
    MKT: "bg-amber-50 text-amber-700",
};

export default function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [search, setSearch] = useState("");

    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/employees");
            if (!response.ok) throw new Error("Failed to fetch employees");
            const data = await response.json();
            setEmployees(data);
        } catch {
            setError("Could not load employees. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEmployees(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this employee? This cannot be undone.")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/employees/${id}`, { method: "DELETE" });
            if (res.ok) {
                setSuccessMsg("Employee removed successfully.");
                fetchEmployees();
                setTimeout(() => setSuccessMsg(""), 3500);
            } else throw new Error();
        } catch {
            alert("Error deleting employee.");
        }
    };

    const filtered = employees.filter((e) =>
        `${e.firstName} ${e.lastName} ${e.email} ${e.designation}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-2 border-[#4F6EF7] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#9CA3AF]">Loading employees…</p>
        </div>
    );

    return (
        <div className="space-y-5">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{employees.length} total employees</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter employees..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 pr-4 py-2 text-sm border border-[#E8EAED] rounded-lg bg-white focus:outline-none focus:border-[#4F6EF7] transition w-52 field-input"
                        />
                    </div>
                    <Link
                        href="/employees/add"
                        className="inline-flex items-center gap-2 bg-[#4F6EF7] hover:bg-[#3B5BEB] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150 shadow-sm shadow-[#4F6EF7]/30"
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Employee
                    </Link>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="20 6 9 17 4 12"/></svg>
                    {successMsg}
                </div>
            )}

            {/* Table card */}
            <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-[#E8EAED]">
                            <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-5 py-3.5">Employee</th>
                            <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-5 py-3.5">Email</th>
                            <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-5 py-3.5">Role</th>
                            <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-5 py-3.5">Department</th>
                            <th className="text-right text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-5 py-3.5">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center text-[#9CA3AF] text-sm">
                                    {search ? "No employees match your search." : "No employees found. Add your first one!"}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((emp) => (
                                <tr key={emp.employeeId} className="data-row border-b border-[#F4F5F7] last:border-0">
                                    <td className="px-5 py-3.5">
                                        <Link href={`/employees/${emp.employeeId}`} className="flex items-center gap-3 group">
                                            <div className="w-8 h-8 rounded-full bg-[#4F6EF7]/10 text-[#4F6EF7] text-xs font-bold flex items-center justify-center shrink-0">
                                                {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                            </div>
                                            <span className="font-medium text-[#1A1D23] group-hover:text-[#4F6EF7] transition-colors">
                          {emp.firstName} {emp.lastName}
                        </span>
                                        </Link>
                                    </td>
                                    <td className="px-5 py-3.5 text-[#6B7280]">{emp.email}</td>
                                    <td className="px-5 py-3.5 text-[#6B7280]">{emp.designation}</td>
                                    <td className="px-5 py-3.5">
                      <span className={`badge ${DEPT_COLORS[emp.departmentId] || "bg-gray-100 text-gray-600"}`}>
                        {DEPT_LABELS[emp.departmentId] || emp.departmentId}
                      </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/employees/${emp.employeeId}/edit`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4F6EF7] hover:bg-[#EEF1FE] rounded-md transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(emp.employeeId)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#EF4444] hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
                {filtered.length > 0 && (
                    <div className="px-5 py-3 border-t border-[#F4F5F7] flex items-center justify-between">
                        <p className="text-xs text-[#9CA3AF]">Showing {filtered.length} of {employees.length} employees</p>
                    </div>
                )}
            </div>
        </div>
    );
}