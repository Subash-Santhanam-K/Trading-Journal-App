import React from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import clsx from 'clsx';

const StatCard = ({ title, value, icon: Icon, colorClass, prefix = '' }) => (
  <div className="trading-card p-6 flex items-center shadow-md">
    <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center bg-opacity-20 mr-4", colorClass.bg, colorClass.text)}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-trading-textMuted text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">
        {prefix}{typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : value}
      </h3>
    </div>
  </div>
);

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="trading-card p-6 animate-pulse flex items-center">
            <div className="w-12 h-12 rounded-full bg-trading-border mr-4"></div>
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-trading-border rounded w-1/2"></div>
              <div className="h-6 bg-trading-border rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { totalTrades = 0, netProfit = 0, totalProfit = 0, totalLoss = 0 } = stats || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Executions" 
        value={totalTrades} 
        icon={Activity} 
        colorClass={{ bg: 'bg-trading-primary', text: 'text-trading-primary' }} 
      />
      <StatCard 
        title="Net PnL" 
        value={netProfit} 
        prefix="$"
        icon={DollarSign} 
        colorClass={{ 
          bg: netProfit >= 0 ? 'bg-trading-green' : 'bg-trading-red', 
          text: netProfit >= 0 ? 'text-trading-green' : 'text-trading-red' 
        }} 
      />
      <StatCard 
        title="Gross Profit" 
        value={totalProfit} 
        prefix="$"
        icon={TrendingUp} 
        colorClass={{ bg: 'bg-trading-green', text: 'text-trading-green' }} 
      />
      <StatCard 
        title="Gross Loss" 
        value={Math.abs(totalLoss)} 
        prefix="-$"
        icon={TrendingDown} 
        colorClass={{ bg: 'bg-trading-red', text: 'text-trading-red' }} 
      />
    </div>
  );
};

export default StatsCards;
