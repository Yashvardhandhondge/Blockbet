
import React from 'react';
import { miningPools } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale
);

interface MiningPoolStatsProps {
  className?: string;
}

export function MiningPoolStats({ className }: MiningPoolStatsProps) {
  // Sort pools by hash rate percentage (descending)
  const sortedPools = [...miningPools].sort((a, b) => b.hashRatePercent - a.hashRatePercent);
  
  // Take top 6 pools for the chart, combine the rest as "Others"
  const topPools = sortedPools.slice(0, 6);
  const otherPools = sortedPools.slice(6);
  
  const otherPoolsTotal = otherPools.reduce((acc, pool) => acc + pool.hashRatePercent, 0);
  
  const chartData = {
    labels: [...topPools.map(p => p.name), 'Others'],
    datasets: [
      {
        data: [...topPools.map(p => p.hashRatePercent), otherPoolsTotal],
        backgroundColor: [
          '#F97316', // orange-500
          '#DC2626', // red-600
          '#3B82F6', // blue-500
          '#EAB308', // yellow-500
          '#16A34A', // green-600
          '#0891B2', // cyan-600
          '#4B5563', // gray-600 (for Others)
        ],
        borderColor: 'transparent',
        hoverOffset: 4
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className={cn("bg-black/20 backdrop-blur-sm rounded-xl p-4", className)}>
      <h2 className="text-xl font-bold mb-4">Mining Pool Distribution</h2>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        {/* Chart */}
        <div className="w-full md:w-1/2 max-w-[250px] md:max-w-none relative">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{topPools[0].hashRatePercent}%</div>
              <div className="text-sm text-gray-400">Top Pool</div>
            </div>
          </div>
        </div>
        
        {/* List of pools */}
        <div className="w-full md:w-1/2">
          <div className="space-y-2">
            {sortedPools.slice(0, 8).map((pool) => (
              <div key={pool.id} className="flex items-center bg-black/40 rounded-xl p-2">
                <div className="w-8 h-8 relative mr-2">
                  <img
                    src={pool.logoUrl}
                    alt={pool.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to default logo if the logo fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = '/pool-logos/default.svg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">{pool.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm">{pool.hashRatePercent}%</span>
                  <span className="text-xs text-gray-400 block">{pool.hashRate.toFixed(1)} EH/s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
