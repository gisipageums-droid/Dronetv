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
      color: 'from-brand-yellow to-brand-gold',
      bgColor: 'from-brand-yellow/20 to-brand-yellow/20'
    },
    {
      label: 'Total Tokens',
      value: totalTokens.toLocaleString(),
      icon: Coins,
      color: 'from-brand-yellow to-status-warning',
      bgColor: 'from-brand-yellow/20 to-status-warning/20'
    },
    {
      label: 'Avg Plan Price',
      value: `₹${avgPrice.toFixed(0)}`,
      icon: TrendingUp,
      color: 'from-brand-gold to-brand-gold',
      bgColor: 'from-brand-yellow/20 to-brand-gold/20'
    },
    {
      label: 'Token Price',
      value: `₹${tokenPriceINR}`,
      icon: Users,
      color: 'from-status-warning to-status-error',
      bgColor: 'from-status-warning/20 to-status-error/20'
    }
  ];

  const plansByType = {
    'one-time': plans.filter(p => p.type === 'one-time').length,
    'monthly': plans.filter(p => p.type === 'monthly').length,
    'Quarterly': plans.filter(p => p.type === 'Quarterly').length,
    'yearly': plans.filter(p => p.type === 'yearly').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-brand-gold uppercase mb-1">Admin</p>
        <h1 className="text-xl font-extrabold text-ink mb-1">Dashboard Overview</h1>
        <p className="text-sm text-ink-caption">Monitor your token plans and pricing at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-surface-card border border-ink-light rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center">
                  <Icon className="w-5 h-5 text-ink" />
                </div>
              </div>
              <p className="text-xs text-ink-caption font-semibold uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="text-xl font-extrabold text-ink">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Plans Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-surface-card border border-ink-light rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-ink mb-4">Plans by Type</h3>
          <div className="space-y-3">
            {Object.entries(plansByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-ink-paragraph capitalize w-24">{type}</span>
                <div className="flex items-center gap-3 flex-1 mx-3">
                  <div className="flex-1 h-2 bg-ink-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-yellow rounded-full transition-all"
                      style={{ width: `${totalPlans > 0 ? (count / totalPlans) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-ink min-w-[2rem] text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-card border border-ink-light rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-ink mb-4">Recent Plans</h3>
          <div className="space-y-2">
            {plans.slice(0, 4).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-3 bg-ink-offwhite rounded-lg">
                <div>
                  <p className="text-sm font-bold text-ink">{plan.name}</p>
                  <p className="text-xs text-ink-caption capitalize">{plan.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">₹{plan.price}</p>
                  <p className="text-xs text-ink-caption">{plan.tokens} tokens</p>
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <p className="text-center text-ink-caption text-sm py-8">No plans created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
