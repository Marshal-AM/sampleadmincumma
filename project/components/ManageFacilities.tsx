'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RentalPlan {
  name: string;
  price: number;
  duration: string;
}

interface Equipment {
  labName: string;
  equipmentName: string;
  capacityAndMake: string;
}

interface FacilityDetails {
  name: string;
  description?: string;
  images: string[];
  videoLink?: string;
  rentalPlans: RentalPlan[];
  equipment?: Equipment[];
  [key: string]: any; // Allow for additional dynamic fields
}

interface Facility {
  _id: string;
  facilityType: string;
  details: FacilityDetails;
  createdAt: string;
  status: string;
}

interface ApiError {
  error: string;
}

export default function ManageFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFacility, setExpandedFacility] = useState<string | null>(null);

  const fetchFacilities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/facilities');
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if ('error' in data) {
        throw new Error(data.error);
      }
      
      setFacilities(Array.isArray(data) ? data : []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch facilities';
      console.error('Error fetching facilities:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleStatusUpdate = async (facilityId: string, newStatus: string) => {
    try {
      setError(null);
      const response = await fetch('/api/facilities', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facilityId, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `Failed to update status: ${response.status}`);
      }

      setFacilities((prev) => prev.filter((f) => f._id !== facilityId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update facility status';
      console.error('Error updating facility status:', errorMessage);
      setError(errorMessage);
    }
  };

  const toggleFacilityDetails = (facilityId: string) => {
    setExpandedFacility(expandedFacility === facilityId ? null : facilityId);
  };

  const renderDetailsSection = (details: FacilityDetails) => {
    return (
      <div className="space-y-4 mt-4 pl-24">
        {Object.entries(details).map(([key, value]) => {
          if (key === 'images') return null; // Skip images as they're shown above
          
          if (Array.isArray(value)) {
            return (
              <div key={key} className="space-y-2">
                <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <div className="pl-4 space-y-2">
                  {value.map((item, index) => {
                    if (typeof item === 'object') {
                      return (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          {Object.entries(item).map(([subKey, subValue]) => (
                            <p key={subKey} className="text-sm text-gray-600">
                              <span className="font-medium capitalize">{subKey.replace(/([A-Z])/g, ' $1').trim()}</span>: {subValue}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return <p key={index} className="text-sm text-gray-600">{item}</p>;
                  })}
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="space-y-1">
              <h4 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <p className="text-sm text-gray-600">{value}</p>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading facilities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-center">{error}</p>
          <div className="mt-4 text-center">
            <Button 
              onClick={() => fetchFacilities()}
              className="bg-red-100 text-red-600 hover:bg-red-200"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Facilities</h1>
          <p className="text-gray-600">We are glad to see you again</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          Next
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Facility Title</h2>
          <h2 className="font-semibold text-gray-700">Date Published</h2>
          <h2 className="font-semibold text-gray-700">Action</h2>
        </div>

        {facilities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No pending facilities found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {facilities.map((facility) => (
              <div key={facility._id}>
                <div className="grid grid-cols-3 gap-4 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-20">
                      <Image
                        src={facility.details.images[0]}
                        alt={facility.details.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {facility.details.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Type: {facility.facilityType}
                      </p>
                      <button
                        onClick={() => toggleFacilityDetails(facility._id)}
                        className="text-blue-500 hover:text-blue-600 text-sm flex items-center mt-1"
                      >
                        {expandedFacility === facility._id ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Show Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-600">
                      {format(new Date(facility.createdAt), 'dd.MM.yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => handleStatusUpdate(facility._id, 'active')}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(facility._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
                
                {expandedFacility === facility._id && (
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      {renderDetailsSection(facility.details)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}