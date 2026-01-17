
import React, { useState } from 'react';
// Fix: Use lib/helpers instead of deprecated utils/helpers
import { formatCurrency } from '../lib/helpers';
import { Shield, Users, CreditCard, Activity, Search, ExternalLink } from 'lucide-react';

interface Owner {
  id: string;
  name: string;
  mobile: string;
  turfs: number;
  status: 'active' | 'suspended';
  subscription: 'paid' | 'expired';
  revenue: number;
}

const MOCK_OWNERS: Owner[] = [
  { id: '1', name: 'Aman Deep', mobile: '9876543210', turfs: 2, status: 'active', subscription: 'paid', revenue: 45000 },
  { id: '2', name: 'Suresh Raina', mobile: '9988776655', turfs: 1, status: 'active', subscription: 'paid', revenue: 12000 },
  { id: '3', name: 'Kabir Khan', mobile: '9123456789', turfs: 3, status: 'suspended', subscription: 'expired', revenue: 89000 },
];

const AdminView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-neutral-100 font-inter p-8 text-neutral-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">System Admin</h1>
              <p className="text-sm text-neutral-500 font-medium tracking-tight">Managing 324 Owners • 512 Turfs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 h-11 rounded-xl border border-neutral-200">
              <Search size={18} className="text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search owners, phone..."
                className="bg-transparent outline-none text-sm font-medium w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="h-11 px-6 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all">
              Export Global Report
            </button>
          </div>
        </header>

        {/* Global Metrics */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Active Subscriptions', val: '412', icon: CreditCard, color: 'text-emerald-600' },
            { label: 'Global Revenue (MTD)', val: '₹14.2L', icon: Activity, color: 'text-blue-600' },
            { label: 'Pending Suspensions', val: '12', icon: Users, color: 'text-red-600' },
            { label: 'System Health', val: '99.9%', icon: Shield, color: 'text-neutral-900' },
          ].map(m => (
            <div key={m.label} className="bg-white p-6 rounded-[24px] border border-neutral-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{m.label}</span>
                <m.icon size={18} className={m.color} />
              </div>
              <p className="text-3xl font-bold tracking-tight">{m.val}</p>
            </div>
          ))}
        </div>

        {/* Owners Table */}
        <div className="bg-white rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-lg font-bold">Registered Owners</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
                <th className="px-8 py-4">Owner Name</th>
                <th className="px-8 py-4">Phone</th>
                <th className="px-8 py-4">Turfs</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Sub Plan</th>
                <th className="px-8 py-4 text-right">Owner Revenue</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {MOCK_OWNERS.map(owner => (
                <tr key={owner.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-neutral-900">{owner.name}</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">ID: {owner.id}</p>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">{owner.mobile}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm font-bold">{owner.turfs} Turfs</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      owner.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {owner.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      owner.subscription === 'paid' ? 'bg-blue-50 text-blue-600' : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      {owner.subscription}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-neutral-900">{formatCurrency(owner.revenue)}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                        <ExternalLink size={18} />
                      </button>
                      <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-neutral-200 rounded-lg hover:border-neutral-900 transition-all">
                        Edit Owner
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
