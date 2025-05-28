// src/components/dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Loader2, TrendingUp, Wallet, Activity, Users } from 'lucide-react';
import { getDashboardData } from '../../lib/api/dash';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useUserTag } from '../../pages/Layout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MarketTrend {
  token: string;
  price: string;
  volume: string;
  liquidity_pool: string;
  volatility: string;
  sentiment: string;
}

interface DashboardData {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    naira_balance: string;
    user_tag: string;
  };
  portfolio: {
    token: string;
    amount: string;
    value: string;
  }[];
  marketTrends: MarketTrend[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { copyUserTag } = useUserTag();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const response = await getDashboardData(token);
        if (response.status) {
          setData(response as unknown as DashboardData);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-destructive">Error: {error || 'No data available'}</p>
      </div>
    );
  }

  const marketPriceData = {
    labels: data.marketTrends.map(trend => trend.token),
    datasets: [{
      label: 'Token Price (₦)',
      data: data.marketTrends.map(trend => parseFloat(trend.price)),
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const volumeData = {
    labels: data.marketTrends.map(trend => trend.token),
    datasets: [{
      label: 'Trading Volume',
      data: data.marketTrends.map(trend => parseFloat(trend.volume)),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto p-6 space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                <h2 className="text-2xl font-semibold">{data.user.first_name} {data.user.last_name}</h2>
                <button 
                  onClick={() => copyUserTag(data.user.user_tag)}
                  className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1 rounded-full text-sm md:text-base cursor-pointer group"
                  title="Click to copy"
                >
                  <span>{data.user.user_tag}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Here's your financial overview
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Balance"
              value={`₦${parseFloat(data.user.naira_balance).toLocaleString()}`}
              icon={<Wallet className="h-6 w-6" />}
              description="Available Balance"
            />
            <StatsCard
              title="Portfolio"
              value={data.portfolio.length.toString()}
              icon={<Users className="h-6 w-6" />}
              description="Active Investments"
            />
            <StatsCard
              title="Market Tokens"
              value={data.marketTrends.length.toString()}
              icon={<Activity className="h-6 w-6" />}
              description="Available for Trading"
            />
            <StatsCard
              title="Top Performer"
              value={data.marketTrends.reduce((prev, current) =>
                parseFloat(prev.price) > parseFloat(current.price) ? prev : current
              ).token}
              icon={<TrendingUp className="h-6 w-6" />}
              description="Best Performing Token"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Price Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={marketPriceData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={volumeData} options={chartOptions} />
              </CardContent>
            </Card>
          </div>

          {/* Market Trends Table */}
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Token</th>
                      <th className="text-right py-3 px-4">Price (₦)</th>
                      <th className="text-right py-3 px-4">Volume</th>
                      <th className="text-right py-3 px-4">Liquidity Pool</th>
                      <th className="text-center py-3 px-4">Sentiment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.marketTrends.map((trend) => (
                      <tr key={trend.token} className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        <td className="py-3 px-4">{trend.token}</td>
                        <td className="text-right py-3 px-4">
                          {parseFloat(trend.price).toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4">
                          {parseFloat(trend.volume).toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4">
                          {parseFloat(trend.liquidity_pool).toLocaleString()}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                          ${trend.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                              trend.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                            {trend.sentiment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>
        </div>
        <div className="text-primary">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
