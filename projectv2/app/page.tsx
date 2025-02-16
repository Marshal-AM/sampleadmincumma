'use client';

import Sidebar from '@/components/Sidebar';
import ManageFacilities from '@/components/ManageFacilities';
import ManageStartups from '@/components/ManageStartups';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('facilities');

  return (
    <div className="flex h-screen">
      <Sidebar onTabChange={setActiveTab} />
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        {activeTab === 'facilities' && <ManageFacilities />}
        {activeTab === 'startups' && <ManageStartups />}
      </main>
    </div>
  );
}