import React, { useState } from 'react';
import { BarChart3, Users, Zap, Crown, ChevronDown, ChevronUp, PieChart, TrendingUp } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const mockStats = {
  totalUsers: 156,
  dailyAnalyses: 423,
  activeSubscriptions: 45,
};

const mockRecentLogs = [
  // Hoje
  {
    id: '1',
    userId: 'user1',
    timestamp: new Date().toISOString(),
    foodName: 'Café da manhã: Pão integral com ovo',
    calories: 280,
    macros: { carbs: 28, protein: 15, fats: 12 },
  },
  {
    id: '2',
    userId: 'user1',
    timestamp: new Date().toISOString(),
    foodName: 'Almoço: Frango grelhado com salada',
    calories: 420,
    macros: { carbs: 15, protein: 45, fats: 18 },
  },
  // Ontem
  {
    id: '3',
    userId: 'user1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    foodName: 'Café da manhã: Iogurte com granola',
    calories: 310,
    macros: { carbs: 45, protein: 12, fats: 8 },
  },
  {
    id: '4',
    userId: 'user1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    foodName: 'Almoço: Salmão com legumes',
    calories: 450,
    macros: { carbs: 20, protein: 38, fats: 22 },
  },
  {
    id: '5',
    userId: 'user1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    foodName: 'Jantar: Sopa de legumes',
    calories: 180,
    macros: { carbs: 25, protein: 8, fats: 5 },
  },
];

interface DashboardProps {
  user: User;
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface DailySummary {
  date: string;
  totalCalories: number;
  totalMacros: {
    carbs: number;
    protein: number;
    fats: number;
  };
  logs: typeof mockRecentLogs;
}

function groupLogsByDay(logs: typeof mockRecentLogs): DailySummary[] {
  const grouped = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    if (!acc[date]) {
      acc[date] = {
        date,
        totalCalories: 0,
        totalMacros: { carbs: 0, protein: 0, fats: 0 },
        logs: [],
      };
    }
    acc[date].totalCalories += log.calories;
    acc[date].totalMacros.carbs += log.macros.carbs;
    acc[date].totalMacros.protein += log.macros.protein;
    acc[date].totalMacros.fats += log.macros.fats;
    acc[date].logs.push(log);
    return acc;
  }, {} as Record<string, DailySummary>);

  return Object.values(grouped).sort((a, b) => 
    new Date(b.logs[0].timestamp).getTime() - new Date(a.logs[0].timestamp).getTime()
  );
}

function DailyLogSection({ summary }: { summary: DailySummary }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <button
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">{summary.date}</h3>
            <p className="text-sm text-gray-600">
              Total: {summary.totalCalories} kcal
              <span className="ml-2 text-gray-400">|</span>
              <span className="ml-2">
                {summary.totalMacros.carbs}g C | {summary.totalMacros.protein}g P | {summary.totalMacros.fats}g F
              </span>
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refeição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calorias</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Macros</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary.logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.foodName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.calories} kcal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {`${log.macros.carbs}g C | ${log.macros.protein}g P | ${log.macros.fats}g F`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function WeeklyTrendsReport({ dailySummaries }: { dailySummaries: DailySummary[] }) {
  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendências Semanais</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Média de Calorias Diárias</span>
          <span className="text-sm font-semibold text-gray-900">
            {Math.round(dailySummaries.reduce((acc, day) => acc + day.totalCalories, 0) / dailySummaries.length)} kcal
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Dia com Mais Calorias</span>
          <span className="text-sm font-semibold text-gray-900">
            {dailySummaries.reduce((max, day) => day.totalCalories > max.totalCalories ? day : max).date.split(',')[0]}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Total de Refeições</span>
          <span className="text-sm font-semibold text-gray-900">
            {dailySummaries.reduce((acc, day) => acc + day.logs.length, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

function MacroDistributionReport({ dailySummaries }: { dailySummaries: DailySummary[] }) {
  const totalMacros = dailySummaries.reduce(
    (acc, day) => ({
      carbs: acc.carbs + day.totalMacros.carbs,
      protein: acc.protein + day.totalMacros.protein,
      fats: acc.fats + day.totalMacros.fats,
    }),
    { carbs: 0, protein: 0, fats: 0 }
  );

  const total = totalMacros.carbs + totalMacros.protein + totalMacros.fats;
  const percentages = {
    carbs: Math.round((totalMacros.carbs / total) * 100),
    protein: Math.round((totalMacros.protein / total) * 100),
    fats: Math.round((totalMacros.fats / total) * 100),
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Macronutrientes</h3>
      <div className="space-y-4">
        <div className="relative pt-1">
          <div className="flex h-2 mb-4 overflow-hidden rounded-full bg-gray-100">
            <div style={{ width: `${percentages.carbs}%` }} className="bg-blue-500"></div>
            <div style={{ width: `${percentages.protein}%` }} className="bg-green-500"></div>
            <div style={{ width: `${percentages.fats}%` }} className="bg-yellow-500"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 rounded-full bg-blue-500"></div>
              <span>Carboidratos ({percentages.carbs}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 rounded-full bg-green-500"></div>
              <span>Proteínas ({percentages.protein}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 rounded-full bg-yellow-500"></div>
              <span>Gorduras ({percentages.fats}%)</span>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Carboidratos Totais:</span>
            <span className="font-semibold">{totalMacros.carbs}g</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Proteínas Totais:</span>
            <span className="font-semibold">{totalMacros.protein}g</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Gorduras Totais:</span>
            <span className="font-semibold">{totalMacros.fats}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user }: DashboardProps) {
  const [activeReport, setActiveReport] = useState<'weekly' | 'macros' | null>(null);
  const dailySummaries = groupLogsByDay(mockRecentLogs);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">NutriTrack</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Users} label="Total Users" value={mockStats.totalUsers} />
          <StatCard icon={BarChart3} label="Daily Analyses" value={mockStats.dailyAnalyses} />
          <StatCard icon={Crown} label="Pro Subscriptions" value={mockStats.activeSubscriptions} />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveReport(activeReport === 'weekly' ? null : 'weekly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeReport === 'weekly'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Tendências Semanais</span>
          </button>
          <button
            onClick={() => setActiveReport(activeReport === 'macros' ? null : 'macros')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeReport === 'macros'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span>Distribuição de Macros</span>
          </button>
        </div>

        {activeReport === 'weekly' && (
          <div className="mb-8">
            <WeeklyTrendsReport dailySummaries={dailySummaries} />
          </div>
        )}

        {activeReport === 'macros' && (
          <div className="mb-8">
            <MacroDistributionReport dailySummaries={dailySummaries} />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo Nutricional</h2>
          <div className="space-y-4">
            {dailySummaries.map((summary) => (
              <DailyLogSection key={summary.date} summary={summary} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;