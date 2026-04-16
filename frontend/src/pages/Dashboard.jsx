import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

import StatsCards from '../components/StatsCards';
import TradeTable from '../components/TradeTable';
import TradeFormModal from '../components/TradeFormModal';
import TradeChart from '../components/TradeChart';

const Dashboard = () => {
  // Ensure strict safe default state structure preventing downstream access crashes
  const [stats, setStats] = useState({
    totalTrades: 0,
    totalProfit: 0,
    totalLoss: 0,
    netProfit: 0
  });
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch independently (NOT Promise.all)
      const statsRes = await api.get('/trades/stats');
      setStats(statsRes.data?.data || statsRes.data);
    } catch (err) {
      console.error('Stats error:', err);
      // Don't break UI if stats fails
    }

    try {
      const tradesRes = await api.get('/trades', {
        params: {
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          order: 'desc'
        }
      });
      setTrades(tradesRes.data?.data || []);
    } catch (err) {
      console.error('FULL ERROR:', err);
      console.error('RESPONSE:', err.response);
      console.error('DATA:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to load trades');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTrade) {
        await api.put(`/trades/${editingTrade.id}`, formData);
        toast.success('Trade updated successfully!');
      } else {
        await api.post('/trades', formData);
        toast.success('Execution logged successfully!');
      }
      setIsModalOpen(false);
      setEditingTrade(null);
      // Wait to verify fetch finishes before proceeding avoiding rapid state races
      await fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to delete this execution log?')) return;
    try {
      await api.delete(`/trades/${id}`);
      toast.success('Trade deleted');
      await fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete trade');
    }
  };

  const triggerCreate = () => {
    setEditingTrade(null);
    setIsModalOpen(true);
  };

  const triggerEdit = (trade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Performance Matrix</h1>
          <p className="text-trading-textMuted mt-1 text-sm">Analyze your strategies and profitability.</p>
        </div>
        <button onClick={triggerCreate} className="btn-primary w-auto inline-flex items-center space-x-2 px-6">
          <Plus className="w-5 h-5" />
          <span>Log Execution</span>
        </button>
      </div>

      <StatsCards stats={stats} loading={loading} />

      {!loading && trades.length > 0 && <TradeChart trades={trades} />}

      <TradeTable
        trades={trades}
        loading={loading}
        onEdit={triggerEdit}
        onDelete={handleDelete}
      />

      <TradeFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTrade(null); }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTrade}
      />
    </div>
  );
};

export default Dashboard;
