import React, { useState, useEffect } from 'react';
import { Users, Mail, Briefcase, TrendingUp, Calendar, Eye, Download, Filter } from 'lucide-react';
import { contactService, projectService, jobService, type ContactSubmission, type ProjectSubmission, type JobApplication } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [projectSubmissions, setProjectSubmissions] = useState<ProjectSubmission[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalProjects: 0,
    totalApplications: 0,
    thisWeekContacts: 0
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const [contacts, projects, applications] = await Promise.all([
        contactService.getAllContactSubmissions(),
        projectService.getAllProjectSubmissions(),
        jobService.getAllApplications().catch(() => []) // Graceful fallback if not implemented
      ]);

      setContactSubmissions(contacts);
      setProjectSubmissions(projects);
      setJobApplications(applications);

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const thisWeekContacts = contacts.filter(contact => 
        new Date(contact.created_at!) > weekAgo
      ).length;

      setStats({
        totalContacts: contacts.length,
        totalProjects: projects.length,
        totalApplications: applications.length,
        thisWeekContacts
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (Array.isArray(value)) return `"${value.join('; ')}"`;
          if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
          return value || '';
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage all form submissions and applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-2xl border border-blue-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Contacts</p>
                <p className="text-3xl font-bold text-white">{stats.totalContacts}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-2xl border border-purple-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Project Requests</p>
                <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-2xl border border-green-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Job Applications</p>
                <p className="text-3xl font-bold text-white">{stats.totalApplications}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 rounded-2xl border border-orange-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold text-white">{stats.thisWeekContacts}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'contacts', label: 'Contact Forms', icon: Mail },
              { id: 'projects', label: 'Project Requests', icon: Briefcase },
              { id: 'applications', label: 'Job Applications', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 p-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[...contactSubmissions, ...projectSubmissions]
                      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              {'name' in item ? `Contact from ${item.name}` : `Project request: ${item.project_type}`}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {new Date(item.created_at!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => exportToCSV(contactSubmissions, 'contact-submissions')}
                      className="w-full flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export Contact Forms</span>
                    </button>
                    <button
                      onClick={() => exportToCSV(projectSubmissions, 'project-submissions')}
                      className="w-full flex items-center space-x-3 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export Project Requests</span>
                    </button>
                    <button
                      onClick={loadAllData}
                      className="w-full flex items-center space-x-3 p-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Refresh Data</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Contact Form Submissions</h2>
                <button
                  onClick={() => exportToCSV(contactSubmissions, 'contact-submissions')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-gray-300 font-semibold">Name</th>
                      <th className="pb-3 text-gray-300 font-semibold">Email</th>
                      <th className="pb-3 text-gray-300 font-semibold">Company</th>
                      <th className="pb-3 text-gray-300 font-semibold">Service</th>
                      <th className="pb-3 text-gray-300 font-semibold">Date</th>
                      <th className="pb-3 text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactSubmissions.map((contact) => (
                      <tr key={contact.id} className="border-b border-gray-800">
                        <td className="py-3 text-white">{contact.name}</td>
                        <td className="py-3 text-blue-400">{contact.email}</td>
                        <td className="py-3 text-gray-300">{contact.company || 'N/A'}</td>
                        <td className="py-3 text-gray-300">{contact.service || 'General'}</td>
                        <td className="py-3 text-gray-400">{new Date(contact.created_at!).toLocaleDateString()}</td>
                        <td className="py-3">
                          <button
                            onClick={() => window.open(`mailto:${contact.email}?subject=Re: Your inquiry&body=Hi ${contact.name},%0D%0A%0D%0AThank you for contacting Nexariza AI...`)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Project Builder Submissions</h2>
                <button
                  onClick={() => exportToCSV(projectSubmissions, 'project-submissions')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {projectSubmissions.map((project) => (
                  <div key={project.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {project.project_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Project
                        </h3>
                        <p className="text-blue-400 font-medium">{project.contact_name} - {project.contact_company || 'Individual'}</p>
                        <p className="text-gray-400 text-sm">{project.contact_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">{project.budget}</p>
                        <p className="text-gray-400 text-sm">{project.timeline}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Industry</p>
                        <p className="text-white">{project.industry}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Features</p>
                        <p className="text-white">{project.features.length > 0 ? project.features.join(', ') : 'Standard'}</p>
                      </div>
                    </div>
                    
                    {project.description && (
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-2">Description</p>
                        <p className="text-gray-300 text-sm bg-gray-800/30 p-3 rounded-lg">{project.description}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">
                        Submitted: {new Date(project.created_at!).toLocaleString()}
                      </p>
                      <button
                        onClick={() => window.open(`mailto:${project.contact_email}?subject=Re: Your ${project.project_type} Project Request&body=Hi ${project.contact_name},%0D%0A%0D%0AThank you for your ${project.project_type} project request...`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Job Applications</h2>
                <button
                  onClick={() => exportToCSV(jobApplications, 'job-applications')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {jobApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Applications Yet</h3>
                    <p className="text-gray-400">Job applications will appear here when candidates apply.</p>
                  </div>
                ) : (
                  jobApplications.map((application) => (
                    <div key={application.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{application.full_name}</h3>
                          <p className="text-blue-400 font-medium">{application.email}</p>
                          {application.phone && <p className="text-gray-400 text-sm">{application.phone}</p>}
                        </div>
                        <div className="text-right">
                          {application.experience_years && (
                            <p className="text-green-400 font-semibold">{application.experience_years}+ years exp</p>
                          )}
                          <p className="text-gray-400 text-sm">
                            {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'Pending'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {application.linkedin_url && (
                          <div>
                            <p className="text-gray-400 text-sm">LinkedIn</p>
                            <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                              View Profile
                            </a>
                          </div>
                        )}
                        {application.portfolio_url && (
                          <div>
                            <p className="text-gray-400 text-sm">Portfolio</p>
                            <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                              View Portfolio
                            </a>
                          </div>
                        )}
                        {application.availability && (
                          <div>
                            <p className="text-gray-400 text-sm">Availability</p>
                            <p className="text-white text-sm">{application.availability}</p>
                          </div>
                        )}
                        {application.salary_expectation && (
                          <div>
                            <p className="text-gray-400 text-sm">Salary Expectation</p>
                            <p className="text-white text-sm">{application.salary_expectation}</p>
                          </div>
                        )}
                      </div>

                      {application.skills && application.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-gray-400 text-sm mb-2">Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {application.skills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {application.cover_letter && (
                        <div className="mb-4">
                          <p className="text-gray-400 text-sm mb-2">Cover Letter</p>
                          <p className="text-gray-300 text-sm bg-gray-800/30 p-3 rounded-lg line-clamp-4">
                            {application.cover_letter}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-sm">
                          Applied: {application.created_at ? new Date(application.created_at).toLocaleString() : 'Unknown'}
                        </p>
                        <div className="flex space-x-2">
                          {application.resume_url && (
                            <a
                              href={application.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-sm"
                            >
                              <Download className="h-3 w-3" />
                              <span>Resume</span>
                            </a>
                          )}
                          <button
                            onClick={() => window.open(`mailto:${application.email}?subject=Re: Your Application&body=Hi ${application.full_name},%0D%0A%0D%0AThank you for your application...`)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
                          >
                            <Mail className="h-3 w-3" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;