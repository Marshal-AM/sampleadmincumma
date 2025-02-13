'use client';

import { Building2, Calendar } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('facilities');

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
        <button
          onClick={() => setActiveTab('facilities')}
          className={cn(
            'flex items-center space-x-2 w-full p-2 rounded-lg transition-colors',
            activeTab === 'facilities'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-gray-100 text-gray-600'
          )}
        >
          <Building2 className="h-5 w-5" />
          <span>Manage Facilities</span>
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={cn(
            'flex items-center space-x-2 w-full p-2 rounded-lg transition-colors',
            activeTab === 'bookings'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-gray-100 text-gray-600'
          )}
        >
          <Calendar className="h-5 w-5" />
          <span>All Bookings</span>
        </button>
      </div>
    </div>
  );
}