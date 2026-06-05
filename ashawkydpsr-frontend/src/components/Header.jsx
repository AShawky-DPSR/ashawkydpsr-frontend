import React from 'react';

function Header({ user }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">RABIGH FUEL CONVERSION PROJECT</h1>
          <p className="text-sm text-gray-500">Planning & Controls Intelligence System | Web Edition</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">👤 {user?.full_name} | 🔑 {user?.role}</p>
          <p className="text-sm text-gray-500">📅 {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-xs text-gray-400">👨‍💻 Eng. Ahmed Shawky | 📞 +201095214911</p>
        </div>
      </div>
    </header>
  );
}

export default Header;