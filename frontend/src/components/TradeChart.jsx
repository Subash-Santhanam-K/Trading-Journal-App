import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const TradeChart = ({ trades }) => {
  if (!trades || trades.length === 0) return null;

  // Process trades chronologically to build cumulative PNL
  const sorted = [...trades].sort((a, b) => new Date(a.tradeDate) - new Date(b.tradeDate));

  let accumulator = 0;

  const data = sorted.map(t => {
    accumulator += Number(t.profitLoss) || 0;

    return {
      date: format(new Date(t.tradeDate), 'MMM dd HH:mm'),
      rawDate: t.tradeDate,
      pnl: parseFloat(accumulator.toFixed(2)),
      tradePnl: t.profitLoss
    };
  });

  return (
    <div className="trading-card p-6 h-80 mb-8 flex flex-col">
      <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
        <span>Equity Curve</span>
      </h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2962FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2962FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2E39" vertical={false} />
            <XAxis dataKey="date" stroke="#787B86" tick={{ fill: '#787B86', fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={30} />
            <YAxis stroke="#787B86" tick={{ fill: '#787B86', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#151924', borderColor: '#2A2E39', color: '#D1D4DC', borderRadius: '8px' }}
              itemStyle={{ color: '#00C087' }}
              labelStyle={{ color: '#787B86', marginBottom: '8px' }}
            />
            <Area type="monotone" dataKey="pnl" name="Total Equity" stroke="#2962FF" strokeWidth={3} fillOpacity={1} fill="url(#colorPnl)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradeChart;
