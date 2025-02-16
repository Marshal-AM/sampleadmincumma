'use client';

import { Building2, Calendar, Rocket } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onTabChange: Dispatch<SetStateAction<string>>;
}

export default function Sidebar({ onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
        <button
          onClick={() => onTabChange('facilities')}
          className={cn(
            'flex items-center space-x-2 w-full p-2 rounded-lg transition-colors',
            'hover:bg-gray-100 text-gray-600'
          )}
        >
          <Building2 className="h-5 w-5" />
          <span>Manage Facilities</span>
        </button>
        <button
          onClick={() => onTabChange('bookings')}
          className={cn(
            'flex items-center space-x-2 w-full p-2 rounded-lg transition-colors',
            'hover:bg-gray-100 text-gray-600'
          )}
        >
          <Calendar className="h-5 w-5" />
          <span>All Bookings</span>
        </button>
        <button
          onClick={() => onTabChange('startups')}
          className={cn(
            'flex items-center space-x-2 w-full p-2 rounded-lg transition-colors',
            'hover:bg-gray-100 text-gray-600'
          )}
        >
          <Rocket className="h-5 w-5" />
          <span>Startups</span>
        </button>
      </div>
    </div>
  );
}