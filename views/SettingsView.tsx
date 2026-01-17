import React from 'react';
import { Turf, View, Owner } from '../types';
import { User, ChevronRight, MapPin, CreditCard, FileText, Trash2, Users, Store, Smartphone } from 'lucide-react';

interface SettingsViewProps {
  owner?: Owner;
  turf: Turf;
  onLogout: () => void;
  onNavigate: (view: View) => void;
  onDeleteAccount: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ owner, turf, onLogout, onNavigate, onDeleteAccount }) => {
  const sections = [
    {
      title: 'Business & CRM',
      items: [
        { icon: MapPin, label: 'Turf Profile', detail: 'Edit name, price, timings', view: View.EDIT_TURF },
        { icon: Users, label: 'Customers & History', detail: 'View repeat clients', view: View.CUSTOMERS },
        { icon: CreditCard, label: 'Subscription & Billing', detail: 'Manage your plan', view: View.SUBSCRIPTION },
      ]
    },
    {
      title: 'Company',
      items: [
        { icon: FileText, label: 'Legal & Privacy', detail: 'Terms, data safety', view: View.LEGAL },
        { icon: User, label: 'Help & Support', detail: 'Contact us', view: View.SUPPORT },
      ]
    }
  ];

  return (
    <div className="py-4 space-y-8 animate-in fade-in duration-500">
      {/* Active Business Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em] px-3">Active Business</h3>
        <button 
          onClick={() => onNavigate(View.EDIT_PROFILE)}
          className="w-full bg-white border border-neutral-100 rounded-[32px] p-6 shadow-sm flex items-center justify-between hover:bg-neutral-50 active:bg-neutral-100 transition-all focus:outline-none"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-neutral-900 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-neutral-900/10">
              {owner?.businessName.charAt(0) || turf?.name.charAt(0)}
            </div>
            <div className="text-left space-y-1">
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">{owner?.businessName || turf.name}</h2>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{owner?.name || 'Authorized Owner'}</p>
                </div>
                <div className="flex items-center gap-2 ml-3.5">
                  <p className="text-[10px] text-neutral-400 font-bold tracking-widest">+91 {owner?.mobile || '9XXXXXXXXX'}</p>
                </div>
              </div>
            </div>
          </div>
          <ChevronRight size={20} className="text-neutral-300" />
        </button>
      </div>

      {/* Settings Menu */}
      <div className="space-y-8">
        {sections.map(section => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em] px-3">{section.title}</h3>
            <div className="bg-white rounded-[28px] border border-neutral-100 shadow-sm overflow-hidden divide-y divide-neutral-50">
              {section.items.map(item => (
                <button 
                  key={item.label} 
                  onClick={() => onNavigate(item.view)}
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-all active:bg-neutral-100 focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center border border-neutral-100">
                      <item.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-neutral-900">{item.label}</p>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">{item.detail}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-neutral-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3 pt-4">
          <button 
            onClick={onLogout}
            className="w-full h-14 bg-white text-neutral-900 font-bold rounded-2xl border border-neutral-100 flex items-center justify-center gap-2 active:bg-neutral-50 transition-colors shadow-sm focus:outline-none"
          >
            Logout Session
          </button>
          
          <button 
            onClick={onDeleteAccount}
            className="w-full h-14 bg-white text-red-600 font-bold rounded-2xl border border-neutral-100 flex items-center justify-center gap-2 active:bg-red-50 transition-colors shadow-sm focus:outline-none"
          >
            <Trash2 size={18} />
            Delete Account
          </button>
          
          <p className="text-center text-[10px] font-bold text-neutral-300 uppercase tracking-[0.3em] pt-6 pb-2">TurfFlow Pro • v2.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;