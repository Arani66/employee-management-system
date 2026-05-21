export default function Footer() {
    return (
        <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Employee Management System. All rights reserved.
        </footer>
    );
}