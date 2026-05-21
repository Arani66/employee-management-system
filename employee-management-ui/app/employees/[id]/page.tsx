"use client";
// app/employees/[id]/page.tsx
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function EmployeeDetails() {
    const { id } = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/employees/${id}`);
                if (!res.ok) throw new Error("Employee not found or has been removed.");
                setEmployee(await res.json());
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchEmployee();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-2 border-[#4F6EF7] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#9CA3AF]">Loading profile…</p>
        </div>
    );

    if (error) return (
        <div className="max-w-lg mx-auto mt-10 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
            {error}
        </div>
    );

    if (!employee) return null;

    const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;

    return (
        <div className="max-w-2xl space-y-5">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <Link href="/employees" className="hover:text-[#4F6EF7] transition-colors">Employees</Link>
                <span>/</span>
                <span className="text-[#1A1D23]">{employee.firstName} {employee.lastName}</span>
            </nav>

            {/* Profile card */}
            <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm overflow-hidden">
                {/* Hero strip */}
                <div className="h-20 bg-gradient-to-r from-[#4F6EF7] to-[#7C3AED]" />

                {/* Avatar + actions */}
                <div className="px-6 pb-5">
                    <div className="flex items-end justify-between -mt-10 mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-[#4F6EF7] text-2xl font-bold">
                            {initials}
                        </div>
                        <div className="flex items-center gap-2 pb-1">
                            <Link href="/employees" className="px-3 py-1.5 border border-[#E8EAED] text-xs font-medium text-[#6B7280] rounded-lg hover:bg-gray-50 transition-colors">
                                Back
                            </Link>
                            <Link href={`/employees/${id}/edit`} className="px-3 py-1.5 bg-[#4F6EF7] text-white text-xs font-medium rounded-lg hover:bg-[#3B5BEB] transition-colors shadow-sm shadow-[#4F6EF7]/30">
                                Edit Profile
                            </Link>
                            <Link href={`/employees/${id}/delete`} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors">
                                Delete
                            </Link>
                        </div>
                    </div>

                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-[#1A1D23]">
                            {employee.firstName} {employee.lastName}
                        </h2>
                        <p className="text-[#6B7280] text-sm mt-0.5">{employee.designation}</p>
                        <span className={`badge mt-2 ${DEPT_COLORS[employee.departmentId] || "bg-gray-100 text-gray-600"}`}>
              {DEPT_LABELS[employee.departmentId] || employee.departmentId}
            </span>
                    </div>

                    {/* Details grid */}
                    <div className="border-t border-[#F4F5F7] pt-5 grid grid-cols-2 gap-5">
                        <InfoField label="Email Address" value={employee.email} />
                        <InfoField label="NIC" value={employee.nic} mono />
                        <InfoField label="Base Salary" value={`$${employee.salary.toLocaleString()}`} />
                        <InfoField label="Employee ID" value={employee.employeeId} mono />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">{label}</p>
            <p className={`text-sm text-[#1A1D23] ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
        </div>
    );
}