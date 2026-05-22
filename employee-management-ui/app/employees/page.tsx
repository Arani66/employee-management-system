"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Employee } from "@/types";
import {API_BASE} from "@/lib/api";

const DEPT_LABELS: Record<string, string> = {
    ENG: "Engineering", HR: "Human Resources", FIN: "Finance", MKT: "Marketing",
};
const DEPT_COLORS: Record<string, string> = {
    ENG: "bg-blue-50 text-blue-700",
    HR:  "bg-purple-50 text-purple-700",
    FIN: "bg-emerald-50 text-emerald-700",
    MKT: "bg-amber-50 text-amber-700",
};

interface PagedResponse {
    content: Employee[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export default function EmployeeList() {
    const [data, setData] = useState<PagedResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({
                page: String(page),
                size: String(pageSize),
                search,
            });
            const res = await fetch(`${API_BASE}/api/employees?${params}`);
            if (!res.ok) throw new Error("Failed to fetch employees");
            setData(await res.json());
        } catch {
            setError("Could not load employees. Is the backend running?");
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

    // Debounce search — only fires 400ms after the user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0);
            setSearch(searchInput);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this employee? This cannot be undone.")) return;
        try {
            const res = await fetch(`${API_BASE}/api/employees/${id}`, { method: "DELETE" });
            if (res.ok) {
                setSuccessMsg("Employee removed successfully.");
                fetchEmployees();
                setTimeout(() => setSuccessMsg(""), 3500);
            } else throw new Error();
        } catch {
            alert("Error deleting employee.");
        }
    };

    const employees = data?.content ?? [];

    return (
        <div className="space-y-5">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-[#9CA3AF]">
                    {data ? `${data.totalElements} total employees` : ""}
                </p>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-8 pr-4 py-2 text-sm border border-[#E8EAED] rounded-lg bg-white focus:outline-none focus:border-[#4F6EF7] transition w-56 field-input"
                        />
                    </div>
                    <Link
                        href="/employees/add"
                        className="inline-flex items-center gap-2 bg-[#4F6EF7] hover:bg-[#3B5BEB] text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm shadow-[#4F6EF7]/30"
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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

            {/* Table */}
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
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-6 h-6 border-2 border-[#4F6EF7] border-t-transparent rounded-full animate-spin"/>
                                        <span className="text-sm text-[#9CA3AF]">Loading…</span>
                                    </div>
                                </td>
                            </tr>
                        ) : employees.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center text-[#9CA3AF] text-sm">
                                    {search ? `No employees found matching "${search}".` : "No employees yet."}
                                </td>
                            </tr>
                        ) : (
                            employees.map((emp) => (
                                <tr key={emp.employeeId} className="data-row border-b border-[#F4F5F7] last:border-0">
                                    <td className="px-5 py-3.5">
                                        <Link href={`/employees/${emp.employeeId}`} className="flex items-center gap-3 group">
                                            <div className="w-8 h-8 rounded-full bg-[#4F6EF7]/10 text-[#4F6EF7] text-xs font-bold flex items-center justify-center shrink-0 overflow-hidden">
                                                {emp.profileImage ? (
                                                    <img src={emp.profileImage} alt={emp.firstName} className="w-full h-full object-cover"/>
                                                ) : (
                                                    <span>{emp.firstName.charAt(0)}{emp.lastName.charAt(0)}</span>
                                                )}
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
                                            <Link href={`/employees/${emp.employeeId}/edit`}
                                                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#4F6EF7] hover:bg-[#EEF1FE] rounded-md transition-colors">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(emp.employeeId)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#EF4444] hover:bg-red-50 rounded-md transition-colors">
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

                {/* Pagination footer */}
                {data && data.totalPages > 1 && (
                    <div className="px-5 py-3 border-t border-[#F4F5F7] flex items-center justify-between">
                        <p className="text-xs text-[#9CA3AF]">
                            Page {data.number + 1} of {data.totalPages} · {data.totalElements} employees
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={data.number === 0}
                                className="px-3 py-1.5 text-xs font-medium border border-[#E8EAED] rounded-lg text-[#6B7280] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Prev
                            </button>

                            {/* Page number buttons */}
                            {Array.from({ length: data.totalPages }, (_, i) => i)
                                .filter((i) => Math.abs(i - data.number) <= 2)
                                .map((i) => (
                                    <button key={i} onClick={() => setPage(i)}
                                            className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                                                i === data.number
                                                    ? "bg-[#4F6EF7] text-white"
                                                    : "border border-[#E8EAED] text-[#6B7280] hover:bg-gray-50"
                                            }`}>
                                        {i + 1}
                                    </button>
                                ))}

                            <button
                                onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
                                disabled={data.number === data.totalPages - 1}
                                className="px-3 py-1.5 text-xs font-medium border border-[#E8EAED] rounded-lg text-[#6B7280] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}