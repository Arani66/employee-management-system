import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col h-full">
            <div className="p-6 text-2xl font-bold border-b border-gray-800">
                HR Portal
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <Link href="/" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
                    Dashboard
                </Link>
                <Link href="/employees" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
                    Employees
                </Link>
            </nav>
        </aside>
    );
}