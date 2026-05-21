export default function Header() {
    return (
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Admin User</span>
                <div className="h-8 w-8 bg-blue-600 rounded-full"></div>
            </div>
        </header>
    );
}