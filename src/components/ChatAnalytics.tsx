import React, { useState, useEffect } from 'react';
import { useChatLogger } from '../hooks/useChatLogger';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, Users, Clock, TrendingUp, Calendar, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatAnalyticsProps {
  className?: string;
  showRealTime?: boolean;
}

interface AnalyticsData {
  date: string;
  role: string;
  message_count: number;
  avg_message_length: number;
  unique_sessions: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function ChatAnalytics({ className, showRealTime = false }: ChatAnalyticsProps) {
  const { getAnalytics, conversationHistory, recentConversations } = useChatLogger({
    autoLoadHistory: true
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Calculate summary statistics
  const totalMessages = conversationHistory.length;
  const userMessages = conversationHistory.filter(msg => msg.role === 'user').length;
  const botMessages = conversationHistory.filter(msg => msg.role === 'bot').length;
  const uniqueSessions = new Set(conversationHistory.map(msg => msg.session_id)).size;
  const avgMessageLength = totalMessages > 0 
    ? Math.round(conversationHistory.reduce((sum, msg) => sum + msg.content.length, 0) / totalMessages)
    : 0;

  // Load analytics data
  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAnalytics();
      setAnalyticsData(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // Auto-refresh if real-time is enabled
  useEffect(() => {
    if (showRealTime) {
      const interval = setInterval(loadAnalytics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [showRealTime]);

  // Prepare chart data
  const chartData = analyticsData
    .filter(item => {
      const itemDate = new Date(item.date);
      const now = new Date();
      const diffDays = Math.ceil((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (timeRange) {
        case '7d': return diffDays <= 7;
        case '30d': return diffDays <= 30;
        case '90d': return diffDays <= 90;
        default: return true;
      }
    })
    .map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      user: item.role === 'user' ? item.message_count : 0,
      bot: item.role === 'bot' ? item.message_count : 0,
      total: item.message_count,
      avgLength: Math.round(item.avg_message_length),
      sessions: item.unique_sessions
    }));

  const pieData = [
    { name: 'User Messages', value: userMessages, color: '#8884d8' },
    { name: 'Bot Messages', value: botMessages, color: '#82ca9d' }
  ];

  if (error) {
    return (
      <div className={cn("p-4 border border-red-200 bg-red-50 rounded-lg", className)}>
        <div className="flex items-center gap-2 text-red-600">
          <TrendingUp size={16} />
          <span className="text-sm">Error loading analytics: {error}</span>
        </div>
        <button
          onClick={loadAnalytics}
          className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-purple-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Chat Analytics</h3>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={loadAnalytics}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title="Refresh analytics"
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMessages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-green-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unique Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Message Length</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgMessageLength}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recent Conversations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentConversations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Message Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Message Trends Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Message Trends</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="user" stroke="#8884d8" name="User Messages" />
              <Line type="monotone" dataKey="bot" stroke="#82ca9d" name="Bot Messages" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Message Volume Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Daily Message Volume</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="user" fill="#8884d8" name="User Messages" />
            <Bar dataKey="bot" fill="#82ca9d" name="Bot Messages" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h4>
        <div className="space-y-2">
          {recentConversations.slice(0, 5).map((conversation) => (
            <div key={conversation.session_id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Session {conversation.session_id.slice(0, 8)}...
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {conversation.message_count} messages • {new Date(conversation.last_message_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(conversation.last_message_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 