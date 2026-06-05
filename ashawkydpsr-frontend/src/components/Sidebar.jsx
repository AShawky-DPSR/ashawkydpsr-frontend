import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  ClipboardList,
  Activity,
  Eye,
  FileText,
  BarChart,
  History,
  Settings,
  LogOut
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard/daily', icon: CalendarDays, label: 'Daily Entry', roles: ['Admin', 'Planner', 'Engineer'] },
  { path: '/dashboard/progress', icon: Activity, label: 'Progress Monitor', roles: ['Admin', 'Planner', 'Engineer'] },
  { path: '/dashboard/activities', icon: ClipboardList, label: 'Activities', roles: ['Admin', 'Planner', 'Engineer'] },
  { path: '/dashboard/lookahead', icon: Eye, label: 'Lookahead', roles: ['Admin', 'Planner', 'Engineer'] },
  { path: '/dashboard/reports', icon: FileText, label: 'Reports', roles: ['Admin', 'Planner', 'Engineer'] },
  { path: '/dashboard/analytics', icon: BarChart, label: 'Analytics', roles: ['Admin', 'Planner', 'Engineer'] },
  { path: '/dashboard/audit', icon: History, label: 'Audit Log', roles: ['Admin'] },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings', roles: ['Admin'] },
];

function Sidebar({ userRole, onLogout }) {
  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-primary text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-blue-800">
        <h1 className="text-xl font-bold">AShawkyDPSR</h1>
        <p className="text-xs text-blue-300">RFC Planning System</p>
      </div>
      <nav className="mt-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm transition-colors ${
                isActive ? 'bg-accent text-white' : 'text-blue-200 hover:bg-blue-800'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-blue-800">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
