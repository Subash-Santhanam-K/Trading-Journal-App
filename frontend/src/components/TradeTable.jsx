import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import clsx from 'clsx';

const TradeTable = ({ trades, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="trading-card overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-trading-border rounded w-full"></div>
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-trading-dark rounded border border-trading-border w-full"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (!trades?.length) {
    return (
      <div className="trading-card p-12 flex flex-col items-center justify-center text-trading-textMuted border-dashed">
        <div className="w-16 h-16 rounded-full border border-trading-border flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 opacity-50" />
        </div>
        <p className="text-lg">No trades logged yet</p>
        <p className="text-sm mt-1">Record your first execution above!</p>
      </div>
    );
  }

  return (
    <div className="trading-card overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-trading-dark/50 border-b border-trading-border text-trading-textMuted text-xs uppercase tracking-wider">
            <th className="py-4 px-6 font-medium">Date</th>
            <th className="py-4 px-6 font-medium">Asset/Title</th>
            <th className="py-4 px-6 font-medium">Action</th>
            <th className="py-4 px-6 font-medium text-right">PnL</th>
            <th className="py-4 px-6 font-medium text-center">Manage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-trading-border">
          {trades.map((trade) => (
            <tr key={trade.id} className="hover:bg-trading-dark/40 transition-colors">
              <td className="py-4 px-6 whitespace-nowrap text-sm">
                {format(new Date(trade.tradeDate), 'MMM dd, yyyy HH:mm')}
              </td>
              <td className="py-4 px-6">
                <p className="font-semibold text-white">{trade.title}</p>
                {trade.description && <p className="text-xs text-trading-textMuted mt-0.5 truncate max-w-xs">{trade.description}</p>}
              </td>
              <td className="py-4 px-6 whitespace-nowrap">
                <span className={trade.tradeType === 'buy' ? 'badge-profit' : 'badge-loss'}>
                  {trade.tradeType.toUpperCase()}
                </span>
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-right">
                <div className={clsx(
                  "font-bold flex items-center justify-end space-x-1",
                  trade.profitLoss >= 0 ? "text-trading-green" : "text-trading-red"
                )}>
                  {trade.profitLoss >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>${Math.abs(trade.profitLoss).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </td>
              <td className="py-4 px-6 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-3">
                  <button onClick={() => onEdit(trade)} className="text-trading-textMuted hover:text-trading-primary transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(trade.id)} className="text-trading-textMuted hover:text-trading-red transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TradeTable;
