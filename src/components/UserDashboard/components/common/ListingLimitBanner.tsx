import React, { useEffect, useState } from "react";
import axios from "axios";
import { Coins, TrendingUp } from "lucide-react";
import { useUserAuth } from "../../../context/context";
import { AUTH_API, PAYMENT_API, LAMBDA } from '../../../../lib/apiConfig';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

function getLimit(tokens: number, type: "company" | "professional" | "event") {
  const tiers = {
    company:      [1, 2, 5, Infinity],
    professional: [2, 5, 15, Infinity],
    event:        [2, 3, 10, Infinity],
  };
  const tierIndex = tokens >= 8000 ? 3 : tokens >= 2000 ? 2 : tokens >= 500 ? 1 : 0;
  return tiers[type][tierIndex];
}

function tierName(tokens: number) {
  if (tokens >= 8000) return "Brand";
  if (tokens >= 2000) return "Scale";
  if (tokens >= 500) return "Reach";
  return "Free";
}

interface Props {
  count: number;
  type: "company" | "professional" | "event";
  label: string;
}

const ListingLimitBanner: React.FC<Props> = ({ count, type, label }) => {
  const { user } = useUserAuth();
  const [tokens, setTokens] = useState<number | null>(null);
  const userId = user?.userData?.email || user?.email || "";

  useEffect(() => {
    if (!userId) return;
    // Real token totals live in the payment service's wallet — the auth
    // service's /profile record isn't kept in sync with purchases/spend, so
    // reading it here always looked like the Free tier regardless of the
    // user's actual package.
    if (PAYMENT_API) {
      axios.get(`${PAYMENT_API}/wallet?userId=${userId}`)
        .then(r => setTokens(r.data?.totalTokensEarned ?? r.data?.tokenBalance ?? 0))
        .catch(() => setTokens(0));
      return;
    }
    axios.get(`${PROFILE_API}?userId=${userId}`)
      .then(r => {
        const p = r.data?.profile ?? {};
        // Use totalTokensEarned so tier doesn't drop when tokens are spent
        const earned = p.totalTokensEarned ?? p.tokenBalance ?? 0;
        setTokens(earned);
      })
      .catch(() => setTokens(0));
  }, [userId]);

  if (tokens === null) return null;

  const limit = getLimit(tokens, type);
  const isUnlimited = !isFinite(limit);
  const pct = isUnlimited ? 0 : Math.min((count / limit) * 100, 100);
  const nearLimit = !isUnlimited && count >= limit;
  const tier = tierName(tokens);

  return (
    <div className={`flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl mb-5 text-sm ${nearLimit ? "bg-status-error/10 border border-status-error/25" : "bg-ink-offwhite border border-ink-light"}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Coins size={15} className={nearLimit ? "text-status-error" : "text-brand-gold"} />
        <span className={`font-semibold ${nearLimit ? "text-status-error" : "text-ink-paragraph"}`}>
          {label}: {count} / {isUnlimited ? "∞" : limit}
        </span>
        {!isUnlimited && (
          <div className="flex-1 h-1.5 bg-ink-light rounded-full min-w-[60px] max-w-[120px]">
            <div
              className={`h-1.5 rounded-full transition-all ${nearLimit ? "bg-status-error" : "bg-brand-yellow"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
        <span className="text-xs text-ink-caption flex-shrink-0">{tier} plan</span>
      </div>
      {nearLimit && (
        <a
          href="/user-recharge"
          className="flex items-center gap-1 text-xs font-bold text-white bg-brand-gold px-2.5 py-1 rounded-lg hover:bg-brand-gold transition-colors flex-shrink-0"
        >
          <TrendingUp size={12} />
          Upgrade
        </a>
      )}
    </div>
  );
};

export default ListingLimitBanner;
