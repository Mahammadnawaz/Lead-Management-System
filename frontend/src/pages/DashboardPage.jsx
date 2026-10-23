import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/common/Navbar';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import StatusChart from '../components/dashboard/StatusChart';
import LeadFilters from '../components/leads/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import Pagination from '../components/leads/Pagination';
import LeadFormModal from '../components/leads/LeadFormModal';
import LeadDetailsModal from '../components/leads/LeadDetailsModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { leadApi } from '../api/leadApi';
import { analyticsApi } from '../api/analyticsApi';
import { useToast } from '../context/ToastContext';

const DashboardPage = () => {
  const { showToast } = useToast();

  // State: Leads & Pagination
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // State: Analytics
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // State: Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // State: Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Dashboard Analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const res = await analyticsApi.getMetrics();
      setAnalytics(res.data);
    } catch (err) {
      showToast('Failed to load metrics data', 'error');
    } finally {
      setLoadingAnalytics(false);
    }
  }, [showToast]);

  // Fetch Leads List
  const fetchLeads = useCallback(async () => {
    try {
      setLoadingLeads(true);
      const params = {
        page,
        limit: 8,
        search: debouncedSearch,
        status,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      };
      const res = await leadApi.getLeads(params);
      setLeads(res.data.leads);
      setPagination(res.data.pagination);
    } catch (err) {
      showToast('Failed to retrieve leads', 'error');
    } finally {
      setLoadingLeads(false);
    }
  }, [page, debouncedSearch, status, startDate, endDate, showToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  // Create / Update Lead Handler
  const handleSaveLead = async (formData) => {
    try {
      if (editingLead) {
        await leadApi.updateLead(editingLead._id, formData);
        showToast('Lead updated successfully', 'success');
      } else {
        await leadApi.createLead(formData);
        showToast('Lead created successfully', 'success');
      }
      fetchLeads();
      fetchAnalytics();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save lead record';
      showToast(msg, 'error');
      throw err;
    }
  };

  // Delete Lead Handler
  const handleDeleteLead = async () => {
    if (!deletingLead) return;
    try {
      await leadApi.deleteLead(deletingLead._id);
      showToast('Lead deleted successfully', 'success');
      fetchLeads();
      fetchAnalytics();
    } catch (err) {
      showToast('Failed to delete lead', 'error');
    } finally {
      setDeletingLead(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Pipeline Performance</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status metrics and centralized lead management
          </p>
        </div>

        {/* Aggregated Metrics */}
        <MetricsGrid metrics={analytics?.summary} loading={loadingAnalytics} />

        {/* Analytics Visual Charts */}
        <StatusChart
          distribution={analytics?.statusDistribution}
          loading={loadingAnalytics}
        />

        {/* Filters & Actions Bar */}
        <LeadFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={(val) => {
            setStatus(val);
            setPage(1);
          }}
          startDate={startDate}
          setStartDate={(val) => {
            setStartDate(val);
            setPage(1);
          }}
          endDate={endDate}
          setEndDate={(val) => {
            setEndDate(val);
            setPage(1);
          }}
          onReset={handleResetFilters}
          onAddNew={() => {
            setEditingLead(null);
            setIsFormOpen(true);
          }}
        />

        {/* Leads Table */}
        <LeadTable
          leads={leads}
          loading={loadingLeads}
          onView={(lead) => setViewingLead(lead)}
          onEdit={(lead) => {
            setEditingLead(lead);
            setIsFormOpen(true);
          }}
          onDelete={(lead) => setDeletingLead(lead)}
        />

        {/* Pagination Controls */}
        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
      </main>

      {/* Modals */}
      <LeadFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleSaveLead}
        initialData={editingLead}
      />

      <LeadDetailsModal
        isOpen={!!viewingLead}
        onClose={() => setViewingLead(null)}
        lead={viewingLead}
      />

      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDeleteLead}
        title="Delete Lead"
        message={`Are you sure you want to permanently delete lead record for "${deletingLead?.name}"? This action cannot be undone.`}
        confirmText="Delete Lead"
      />
    </div>
  );
};

export default DashboardPage;
