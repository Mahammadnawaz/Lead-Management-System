import React from 'react';
import { Eye, Edit2, Trash2, Mail, Phone, Calendar, Building, Sparkles } from 'lucide-react';

const statusBadges = {
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  Qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  Converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lost: 'bg-rose-50 text-rose-700 border-rose-200',
};

const LeadTable = ({ leads = [], loading, onView, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-semibold text-slate-800 mb-1">No Leads Found</h4>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          There are no leads matching your selected criteria. Try adjusting your search term or filters.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Lead</th>
              <th className="py-4 px-6">Company & Service</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Follow-up</th>
              <th className="py-4 px-6">Created</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50/60 transition group">
                {/* Lead Name & Contact */}
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-900">{lead.name}</div>
                  <div className="flex flex-col gap-0.5 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {lead.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {lead.phone}
                    </span>
                  </div>
                </td>

                {/* Company & Service */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {lead.company || 'Individual / Unknown'}
                  </div>
                  <div className="text-xs text-indigo-600 font-medium mt-1">
                    {lead.serviceInterested}
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      statusBadges[lead.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>

                {/* Follow Up Date */}
                <td className="py-4 px-6 text-slate-600 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(lead.followUpDate)}
                  </span>
                </td>

                {/* Created Date */}
                <td className="py-4 px-6 text-slate-500 text-xs">
                  {formatDate(lead.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(lead)}
                      title="View Details"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(lead)}
                      title="Edit Lead"
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lead)}
                      title="Delete Lead"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
