"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {API_BASE} from "@/lib/api";

const DEPARTMENTS = [
    { value: "ENG", label: "Engineering" },
    { value: "HR",  label: "Human Resources" },
    { value: "FIN", label: "Finance" },
    { value: "MKT", label: "Marketing" },
];

export default function EditEmployee() {
    const router = useRouter();
    const { id } = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "",
        nic: "", designation: "", departmentId: "ENG", salary: "",
    });
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/employees/${id}`);
                if (!res.ok) throw new Error("Employee not found.");
                const data = await res.json();
                setFormData({
                    firstName: data.firstName, lastName: data.lastName, email: data.email,
                    nic: data.nic, designation: data.designation, departmentId: data.departmentId,
                    salary: data.salary.toString(),
                });
                // Load existing image if there is one
                if (data.profileImage) setProfileImage(data.profileImage);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setInitialLoading(false);
            }
        };
        if (id) fetchEmployee();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            setError("Image must be smaller than 2MB."); return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        setError("");
        const { firstName, lastName, email, nic, designation, salary } = formData;
        if (!firstName || !lastName || !email || !nic || !designation || !salary) {
            setError("All fields are required."); return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address."); return false;
        }
        if (Number(salary) <= 0) {
            setError("Salary must be greater than zero."); return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/employees/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    salary: Number(formData.salary),
                    profileImage: profileImage
                }),
            });
            if (!res.ok) throw new Error("Failed to update employee.");
            router.push(`/employees/${id}`);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (initialLoading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-2 border-[#4F6EF7] border-t-transparent rounded-full animate-spin"/>
            <p className="text-sm text-[#9CA3AF]">Loading employee data…</p>
        </div>
    );

    return (
        <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-5">
                <Link href="/employees" className="hover:text-[#4F6EF7] transition-colors">Employees</Link>
                <span>/</span>
                <Link href={`/employees/${id}`} className="hover:text-[#4F6EF7] transition-colors">Profile</Link>
                <span>/</span>
                <span className="text-[#1A1D23]">Edit</span>
            </nav>

            <div className="bg-white rounded-xl border border-[#E8EAED] shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E8EAED] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-[#1A1D23]">Edit Employee</h2>
                            <p className="text-xs text-[#9CA3AF]">Update employee information</p>
                        </div>
                    </div>
                    <Link href="/employees" className="text-xs text-[#9CA3AF] hover:text-[#1A1D23] transition-colors">Cancel</Link>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                    {error && (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            <svg width="16" height="16" className="shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {error}
                        </div>
                    )}

                    {/* Image upload */}
                    <div className="flex items-center gap-5">
                        <div onClick={() => fileInputRef.current?.click()}
                             className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#E8EAED] flex items-center justify-center cursor-pointer hover:border-[#4F6EF7] transition-colors overflow-hidden bg-[#F9FAFB] shrink-0">
                            {profileImage ? (
                                <img src={profileImage} alt="Preview" className="w-full h-full object-cover"/>
                            ) : (
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={1.5}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[#1A1D23]">Profile Photo</p>
                            <p className="text-xs text-[#9CA3AF] mt-0.5">PNG or JPG, max 2MB</p>
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                    className="mt-2 text-xs text-[#4F6EF7] hover:underline">
                                {profileImage ? "Change photo" : "Upload photo"}
                            </button>
                            {profileImage && (
                                <button type="button" onClick={() => setProfileImage(null)}
                                        className="mt-2 ml-3 text-xs text-red-400 hover:underline">
                                    Remove
                                </button>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg"
                               onChange={handleImageChange} className="hidden"/>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="First Name">
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                   className="field-input w-full border border-[#E8EAED] rounded-lg px-3 py-2.5 text-sm text-[#1A1D23] bg-[#F9FAFB] hover:bg-white transition-colors"/>
                        </FieldGroup>
                        <FieldGroup label="Last Name">
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                   className="field-input w-full border border-[#E8EAED] rounded-lg px-3 py-2.5 text-sm text-[#1A1D23] bg-[#F9FAFB] hover:bg-white transition-colors"/>
                        </FieldGroup>
                    </div>

                    <FieldGroup label="Email Address">
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                               className="field-input w-full border border-[#E8EAED] rounded-lg px-3 py-2.5 text-sm text-[#1A1D23] bg-[#F9FAFB] hover:bg-white transition-colors"/>
                    </FieldGroup>

                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="NIC Number">
                            <input type="text" name="nic" value={formData.nic} onChange={handleChange}
                                   className="field-input w-full border border-[#E8EAED] rounded-lg px-3 py-2.5 text-sm text-[#1A1D23] bg-[#F9FAFB] hover:bg-white transition-colors"/>
                        </FieldGroup>
                        <FieldGroup label="Base Salary ">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm">Rs</span>
                                <input type="number" name="salary" value={formData.salary} onChange={handleChange}
                                       className="field-input w-full border border-[#E8EAED] rounded-lg pl-7 pr-3 py-2.5 text-sm text-[#1A1D23] bg-[#F9FAFB] hover:bg-white transition-colors"/>
                            </div>
                        </FieldGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="Designation">
                            <input type="text" name="designation" value={formData.designation} onChange={handleChange}
                                   className="field-input w-full border border-[#E8EAED] rounded-lg px-3 py-2.5 text-sm text-[#1A1D23] bg-[#F9FAFB] hover:bg-white transition-colors"/>
                        </FieldGroup>
                        <FieldGroup label="Department">
                            <select name="departmentId" value={formData.departmentId} onChange={handleChange}
                                    className="field-input w-full border border-[#E8EAED] rounded-lg px-3 py-2.5 text-sm text-[#1A1D23] bg-[#F9FAFB] hover:bg-white transition-colors appearance-none">
                                {DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                            </select>
                        </FieldGroup>
                    </div>

                    <div className="border-t border-[#E8EAED] pt-4 flex gap-3">
                        <Link href={`/employees/${id}`}
                              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] border border-[#E8EAED] hover:bg-gray-50 text-center transition-colors">
                            Discard
                        </Link>
                        <button type="submit" disabled={saving}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all ${
                                    saving ? "bg-amber-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 shadow-sm shadow-amber-300"
                                }`}>
                            {saving ? (
                                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                  Updating…
                </span>
                            ) : "Update Employee"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}