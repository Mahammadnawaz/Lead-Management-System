import React from 'react';
import { 
  Users, 
  Sparkles, 
  PhoneCall, 
  Award, 
  CheckCircle, 
  XCircle, 
  TrendingUp 
} from 'lucide-react';

const MetricsGrid = ({ metrics, loading }) => {
  const items = [
    {
      title: 'Total Leads',
      value: metrics?.totalLeads ?? 0,
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'New',
      value: metrics?.newLeads ?? 0,
      icon: Sparkles,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Contacted',
      value: metrics?.contactedLeads ?? 0,
      icon: PhoneCall,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
    },
    {
      title: 'Qualified',
      value: metrics?.qualifiedLeads ?? 0,
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-100',
    },
    {
      title: 'Converted',
      value: metrics?.convertedLeads ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Lost',
      value: metrics?.lostLeads ?? 0,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-100',
    },
    {
      title: 'Conversion Rate',
      value: metrics?.conversionRate ?? '0.0%',
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
      {items.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md bg-white ${item.bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {item.title}
              </span>
              <IconComponent className={`w-4 h-4 ${item.color}`} />
            </div>
            {loading ? (
              <div className="h-7 w-16 bg-slate-200 animate-pulse rounded-md" />
            ) : (
              <p className="text-2xl font-bold text-slate-800">{item.value}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
