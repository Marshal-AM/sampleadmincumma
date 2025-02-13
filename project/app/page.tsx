import Sidebar from '@/components/Sidebar';
import ManageFacilities from '@/components/ManageFacilities';

export default function Home() {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <ManageFacilities />
      </main>
    </>
  );
}