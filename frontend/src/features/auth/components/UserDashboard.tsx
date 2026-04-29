import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Users, Newspaper, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';

export const UserDashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="user-dashboard py-10">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.fullName}!</h1>
            <p className="text-slate-600">Explore the alumni network and stay updated with upcoming events.</p>
          </div>
          <Link to="/alumni" className="btn btn-primary flex items-center gap-2 self-start">
            <Users size={18} />
            <span>Find Alumni</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6 border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600">
                  {user?.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{user?.fullName}</h2>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-600">
                    <ShieldCheck size={18} className="text-green-600" />
                    <span>Account Status</span>
                  </div>
                  <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Verified</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User size={18} className="text-indigo-600" />
                    <span>Member Type</span>
                  </div>
                  <span className="text-sm font-medium text-indigo-700 bg-indigo-100 px-2 py-1 rounded">
                    {user?.roles[0] || 'Alumnus'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/profile/edit" className="btn btn-outline w-full flex items-center justify-center gap-2">
                  <span>Complete Your Profile</span>
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>

            <div className="card p-6 border border-slate-200 bg-slate-900 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Connect & Grow</h3>
                <p className="text-slate-300 text-sm mb-4">Update your professional details to help others find and connect with you.</p>
                <Link to="/alumni" className="text-indigo-400 font-semibold flex items-center gap-1 hover:text-indigo-300 transition-colors">
                  <span>View Directory</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Users size={120} />
              </div>
            </div>
          </div>

          {/* Right Column: Activity & Events */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Calendar size={20} />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">Upcoming Events</h4>
                <p className="text-sm text-slate-500 mb-3">Don't miss out on the latest reunions and workshops.</p>
                <Link to="/events" className="text-sm font-medium text-indigo-600 group-hover:translate-x-1 inline-block transition-transform">Browse Events →</Link>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-violet-300 transition-colors group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 mb-3 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Newspaper size={20} />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">Latest News</h4>
                <p className="text-sm text-slate-500 mb-3">Stay informed about the university and alumni activities.</p>
                <Link to="/news" className="text-sm font-medium text-violet-600 group-hover:translate-x-1 inline-block transition-transform">Read Articles →</Link>
              </div>
            </div>

            {/* Application Status (If pending) */}
            <div className="card p-6 border border-amber-200 bg-amber-50 shadow-sm">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-1">Pending Alumnus Verification</h3>
                  <p className="text-amber-700 text-sm mb-3">
                    Your alumni status is currently under review by our administrators. You can still browse the site, but some directory features might be restricted until verification is complete.
                  </p>
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>Expected verification time: 2-3 business days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Events / News Placeholder */}
            <div className="card border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Featured Opportunities</h3>
                <Link to="/events" className="text-xs font-semibold text-indigo-600 hover:underline">View All</Link>
              </div>
              <div className="p-6 text-center py-12">
                <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                <h4 className="text-slate-900 font-semibold mb-1">No upcoming events yet</h4>
                <p className="text-slate-500 text-sm">Check back later for exciting alumni gatherings!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
