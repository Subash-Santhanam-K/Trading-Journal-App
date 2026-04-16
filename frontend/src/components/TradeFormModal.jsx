import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';

const TradeFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', profitLoss: '', tradeType: 'buy', tradeDate: format(new Date(), "yyyy-MM-dd'T'HH:mm")
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        profitLoss: initialData.profitLoss !== undefined ? initialData.profitLoss : '',
        tradeType: initialData.tradeType || 'buy',
        tradeDate: initialData.tradeDate 
          ? format(new Date(initialData.tradeDate), "yyyy-MM-dd'T'HH:mm") 
          : format(new Date(), "yyyy-MM-dd'T'HH:mm")
      });
    } else if (isOpen && !initialData) {
      setFormData({ title: '', description: '', profitLoss: '', tradeType: 'buy', tradeDate: format(new Date(), "yyyy-MM-dd'T'HH:mm") });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      ...formData,
      profitLoss: Number(formData.profitLoss)
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-trading-card rounded-2xl border border-trading-border w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-trading-border">
          <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Execution' : 'Log New Execution'}</h2>
          <button onClick={onClose} className="text-trading-textMuted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-trading-textMuted text-xs font-semibold uppercase mb-1.5">Asset / Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-standard" placeholder="e.g. Long BTC/USDT" />
            </div>

            <div>
              <label className="block text-trading-textMuted text-xs font-semibold uppercase mb-1.5">Action Type</label>
              <select value={formData.tradeType} onChange={e => setFormData({...formData, tradeType: e.target.value})} className="input-standard appearance-none">
                <option value="buy">BUY (Long)</option>
                <option value="sell">SELL (Short)</option>
              </select>
            </div>

            <div>
              <label className="block text-trading-textMuted text-xs font-semibold uppercase mb-1.5">Date & Time</label>
              <input type="datetime-local" required value={formData.tradeDate} onChange={e => setFormData({...formData, tradeDate: e.target.value})} className="input-standard" />
            </div>

            <div className="col-span-2">
              <label className="block text-trading-textMuted text-xs font-semibold uppercase mb-1.5">Realized PNL (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-trading-textMuted">$</span>
                <input type="number" step="0.01" required value={formData.profitLoss} onChange={e => setFormData({...formData, profitLoss: e.target.value})} className="input-standard pl-8" placeholder="Use negative for losses e.g. -150.50" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-trading-textMuted text-xs font-semibold uppercase mb-1.5">Execution Notes (Optional)</label>
              <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-standard resize-none" placeholder="Was my setup respected? Did I FOMO?"></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-trading-border mt-6">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-medium text-trading-text hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-auto px-6 py-2.5 text-sm">
              {isSubmitting ? 'Saving...' : (initialData ? 'Update Journal' : 'Log Trade')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TradeFormModal;
