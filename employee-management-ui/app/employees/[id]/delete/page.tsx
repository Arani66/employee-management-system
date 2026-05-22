"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Employee } from "../../../../types";
import {API_BASE} from "@/lib/api";

export default function DeleteEmployee() {
    const router = useRouter();
    const { id } = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await fetch(`fetch(\`${API_BASE}/api/employees\`)/api/employees/${id}`);
                if (!res.ok) throw new Error("Employee not found.");
                setEmployee(await res.json());
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchEmployee();
    }, [id]);

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`fetch(\`${API_BASE}/api/employees\`)/api/employees/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete employee.");
            router.push("/employees");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-2 border-[#EF4444] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#9CA3AF]">Loading…</p>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto mt-10 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
            {error}
        </div>
    );

    const initials = employee ? `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}` : "?";

    return (
        <div className="max-w-md mx-auto">
            <nav className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-5">
                <Link href="/employees" className="hover:text-[#4F6EF7] transition-colors">Employees</Link>
                <span>/</span>
                <span className="text-red-600">Delete</span>
            </nav>

            <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm overflow-hidden">
                {/* Red top strip */}
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-400" />

                <div className="px-8 py-8 text-center">
                    {/* Warning icon */}
                    <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                        </svg>
                    </div>

                    <h2 className="text-lg font-bold text-[#1A1D23] mb-1">Delete Employee</h2>
                    <p className="text-sm text-[#6B7280] mb-5">
                        This will permanently remove{" "}
                        <span className="font-semibold text-[#1A1D23]">
              {employee?.firstName} {employee?.lastName}
            </span>{" "}
                        and all their data. This action cannot be undone.
                    </p>

                    {/* Employee mini card */}
                    {employee && (
                        <div className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E8EAED] rounded-lg px-4 py-3 mb-6 text-left">
                            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 text-sm font-bold flex items-center justify-center shrink-0">
                                {initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#1A1D23]">{employee.firstName} {employee.lastName}</p>
                                <p className="text-xs text-[#9CA3AF]">{employee.designation} · {employee.email}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Link href="/employees"
                              className="flex-1 py-2.5 text-sm font-medium text-[#6B7280] border border-[#E8EAED] rounded-lg hover:bg-gray-50 transition-colors text-center">
                            Cancel
                        </Link>
                        <button onClick={confirmDelete} disabled={deleting}
                                className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-lg transition-all ${
                                    deleting ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 shadow-sm shadow-red-300"
                                }`}>
                            {deleting ? (
                                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Deleting…
                </span>
                            ) : "Yes, Delete Employee"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}