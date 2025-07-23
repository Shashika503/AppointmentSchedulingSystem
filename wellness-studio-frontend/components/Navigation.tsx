'use client';

import { logout } from '@/lib/auth';  // Assuming logout removes token from localStorage
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

interface NavigationProps {
  title: string;
  role: 'Admin' | 'Client';
}

export default function Navigation({ title, role }: NavigationProps) {
  // Get user information from localStorage
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
              userRole === 'Admin' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {userRole}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{username}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
