'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building, Link as LinkIcon, Mail, Phone, Users, Linkedin, MapPin, Calendar, BookOpen, Factory } from 'lucide-react';

interface Startup {
  _id: string;
  userId: string;
  startupName: string;
  contactName: string;
  contactNumber: string;
  founderName: string;
  founderDesignation: string;
  entityType: string;
  teamSize: number;
  dpiitNumber: string;
  sector: string;
  industry: string;
  stagecompleted: string;
  startupMailId: string;
  website: string;
  linkedinStartupUrl: string;
  linkedinFounderUrl: string;
  lookingFor: string[];
  address: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function ManageStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch('/api/startups');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStartups(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching startups:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch startups');
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const handleStartupClick = (startup: Startup) => {
    setSelectedStartup(startup);
    setDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-lg">Loading startups...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-red-500">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Registered Startups ({startups.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <Card 
            key={startup._id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleStartupClick(startup)}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-4">
                {startup.logoUrl && (
                  <img 
                    src={startup.logoUrl} 
                    alt={startup.startupName} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <span>{startup.startupName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Team Size: {startup.teamSize}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{startup.entityType}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Factory className="w-4 h-4" />
                  <span>{startup.industry}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedStartup && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-4 text-2xl">
                {selectedStartup.logoUrl && (
                  <img 
                    src={selectedStartup.logoUrl} 
                    alt={selectedStartup.startupName} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <span>{selectedStartup.startupName}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>Entity Type: {selectedStartup.entityType}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Team Size: {selectedStartup.teamSize}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Factory className="w-4 h-4" />
                      <span>Industry: {selectedStartup.industry}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>Stage Completed: {selectedStartup.stagecompleted}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedStartup.dpiitNumber && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="font-medium">DPIIT Number:</span>
                        <span>{selectedStartup.dpiitNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-medium">Sector:</span>
                      <span>{selectedStartup.sector}</span>
                    </div>
                    {selectedStartup.website && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <LinkIcon className="w-4 h-4" />
                        <a href={selectedStartup.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                    {selectedStartup.linkedinStartupUrl && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Linkedin className="w-4 h-4" />
                        <a href={selectedStartup.linkedinStartupUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Company LinkedIn
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${selectedStartup.startupMailId}`} className="hover:underline">
                        {selectedStartup.startupMailId}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{selectedStartup.contactNumber}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-medium">Contact Person:</span>
                      <span>{selectedStartup.contactName}</span>
                    </div>
                    {selectedStartup.address && (
                      <div className="flex items-start space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 mt-1" />
                        <span>{selectedStartup.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Founder Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Founder Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-medium">Founder Name:</span>
                      <span>{selectedStartup.founderName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-medium">Designation:</span>
                      <span>{selectedStartup.founderDesignation}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedStartup.linkedinFounderUrl && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Linkedin className="w-4 h-4" />
                        <a href={selectedStartup.linkedinFounderUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Founder LinkedIn
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {selectedStartup.lookingFor && selectedStartup.lookingFor.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Requirements</h3>
                  <div className="space-y-2">
                    <h4 className="font-medium">Looking For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStartup.lookingFor.map((item) => (
                        <span 
                          key={item} 
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(selectedStartup.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Last Updated: {formatDate(selectedStartup.updatedAt)}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}