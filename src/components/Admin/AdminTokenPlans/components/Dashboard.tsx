import { TokenPlan } from '../App';
import { Coins, TrendingUp, ShoppingCart, Users } from 'lucide-react';

interface DashboardProps {
  plans: TokenPlan[];
  tokenPriceINR: number;
}

export function Dashboard({ plans, tokenPriceINR }: DashboardProps) {
  const totalPlans = plans.length;
  const totalTokens = plans.reduce((sum, plan) => sum + plan.tokens, 0);
  const avgPrice = plans.length > 0 ? plans.reduce((sum, plan) => sum + plan.price, 0) / plans.length : 0;
  const totalRevenue = plans.reduce((sum, plan) => sum + plan.price, 0);

  const stats = [
    {
      label: 'Total Plans',
      value: totalPlans,
      icon: ShoppingCart,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-400/20 to-amber-400/20'
    },
    {
      label: 'Total Tokens',
      value: totalTokens.toLocaleString(),
      icon: Coins,
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-400/20 to-orange-400/20'
    },
    {
      label: 'Avg Plan Price',
      value: `₹${avgPrice.toFixed(0)}`,
      icon: TrendingUp,
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'from-yellow-400/20 to-amber-500/20'
    },
    {
      label: 'Token Price',
      value: `₹${tokenPriceINR}`,
      icon: Users,
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-400/20 to-red-400/20'
    }
  ];

  const plansByType = {
    'one-time': plans.filter(p => p.type === 'one-time').length,
    'monthly': plans.filter(p => p.type === 'monthly').length,
    'Quarterly': plans.filter(p => p.type === 'Quarterly').length,
    'yearly': plans.filter(p => p.type === 'yearly').length,
  };

  return (
    <div className="space-y-6 mt-20">
      <div>
        <h1 className="text-yellow-900 mb-2">Dashboard Overview</h1>
        <p className="text-yellow-700/70">Monitor your token plans and pricing at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-xl border border-yellow-200/50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-yellow-900" />
                </div>
              </div>
              <p className="text-yellow-700/70 mb-1">{stat.label}</p>
              <p className="text-yellow-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Plans Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/40 backdrop-blur-xl border border-yellow-200/50 rounded-2xl p-6">
          <h3 className="text-yellow-900 mb-4">Plans by Type</h3>
          <div className="space-y-3">
            {Object.entries(plansByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-yellow-800 capitalize">{type}</span>
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <div className="flex-1 h-2 bg-yellow-200/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${totalPlans > 0 ? (count / totalPlans) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-yellow-900 min-w-[2rem] text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-yellow-200/50 rounded-2xl p-6">
          <h3 className="text-yellow-900 mb-4">Recent Plans</h3>
          <div className="space-y-3">
            {plans.slice(0, 4).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-3 bg-yellow-100/30 rounded-xl">
                <div>
                  <p className="text-yellow-900">{plan.name}</p>
                  <p className="text-xs text-yellow-700/70 capitalize">{plan.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-900">₹{plan.price}</p>
                  <p className="text-xs text-yellow-700/70">{plan.tokens} tokens</p>
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <p className="text-center text-yellow-700/70 py-8">No plans created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
