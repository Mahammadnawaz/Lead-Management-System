import React from 'react';
import Modal from '../common/Modal';
import { Mail, Phone, Building, Calendar, Tag, FileText, User } from 'lucide-react';

const statusBadges = {
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  Qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  Converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lost: 'bg-rose-50 text-rose-700 border-rose-200',
};

const LeadDetailsModal = ({ isOpen, onClose, lead }) => {
  if (!lead) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'None scheduled';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Profile" maxWidth="max-w-xl">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{lead.name}</h3>
            <p className="text-sm text-slate-500">{lead.company || 'Private Individual'}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              statusBadges[lead.status] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {lead.status}
          </span>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 text-slate-700">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Email</p>
              <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">
                {lead.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <Phone className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Phone</p>
              <a href={`tel:${lead.phone}`} className="text-slate-800">
                {lead.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <Tag className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Service</p>
              <p className="font-medium text-slate-800">{lead.serviceInterested}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Follow-Up Date</p>
              <p className="text-slate-800">{formatDate(lead.followUpDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Created By</p>
              <p className="text-slate-800">{lead.createdBy?.name || 'System Admin'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Registered</p>
              <p className="text-slate-800">{formatDate(lead.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-700">
            <FileText className="w-4 h-4 text-slate-400" />
            <h5 className="text-xs font-semibold uppercase text-slate-600">Lead Notes & History</h5>
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">
            {lead.notes || 'No supplementary notes recorded for this lead.'}
          </p>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeadDetailsModal;
