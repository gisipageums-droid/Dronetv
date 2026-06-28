import React, { useEffect, useState } from "react";
import axios from "axios";
import { Coins, TrendingUp } from "lucide-react";
import { useUserAuth } from "../../../context/context";
import { AUTH_API, LAMBDA } from '../../../../lib/apiConfig';

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
    <div className={`flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl mb-5 text-sm ${nearLimit ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Coins size={15} className={nearLimit ? "text-red-500" : "text-yellow-500"} />
        <span className={`font-semibold ${nearLimit ? "text-red-700" : "text-gray-700"}`}>
          {label}: {count} / {isUnlimited ? "∞" : limit}
        </span>
        {!isUnlimited && (
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full min-w-[60px] max-w-[120px]">
            <div
              className={`h-1.5 rounded-full transition-all ${nearLimit ? "bg-red-500" : "bg-yellow-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
        <span className="text-xs text-gray-400 flex-shrink-0">{tier} plan</span>
      </div>
      {nearLimit && (
        <a
          href="/user-recharge"
          className="flex items-center gap-1 text-xs font-bold text-white bg-yellow-500 px-2.5 py-1 rounded-lg hover:bg-yellow-600 transition-colors flex-shrink-0"
        >
          <TrendingUp size={12} />
          Upgrade
        </a>
      )}
    </div>
  );
};

export default ListingLimitBanner;
