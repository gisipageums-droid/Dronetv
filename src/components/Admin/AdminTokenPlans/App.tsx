import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { TokenPriceSettings } from "./components/TokenPriceSettings";
import { PlanManager } from "./components/PlanManager";
import {
  addUpdatePlan,
  deletePlan as deletePlanApi,
  updateTokenPrice,
  fetchPlans,
} from "./api";
import { TransactionHistory } from "./components/TransactionHistory";

export type PlanType = "one-time" | "monthly" | "Quarterly" | "yearly";

export interface TokenPlan {
  id: string;
  name: string;
  tokens: number;
  price: number;
  discount: number;
  type: PlanType;
  features: string[];
}

function App() {
  const [searchParams] = useSearchParams();
  const [activePage, setActivePage] = useState<string>(searchParams.get("tab") ?? "dashboard");
  const [tokenPriceINR, setTokenPriceINR] = useState<number>(0.5);
  const [plans, setPlans] = useState<TokenPlan[]>([]);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlans();
        if (data && data.data) {
          setPlans(data.data.plans || []);
          if (data.data.tokenPriceINR) {
            setTokenPriceINR(parseFloat(data.data.tokenPriceINR));
          }
        }
      } catch (error) {
        console.error("Failed to load plans", error);
      }
    };
    loadPlans();
  }, []);

  const addPlan = async (plan: Omit<TokenPlan, "id">) => {
    const newPlan = {
      ...plan,
      id: Date.now().toString(),
    };
    try {
      await addUpdatePlan(newPlan);
      setPlans([...plans, newPlan]);
    } catch (error) {
      console.error("Failed to add plan", error);
      // Optionally show error toast
    }
  };

  const updatePlan = async (id: string, updatedPlan: Partial<TokenPlan>) => {
    const planToUpdate = plans.find((p) => p.id === id);
    if (!planToUpdate) return;

    const finalPlan = { ...planToUpdate, ...updatedPlan };
    try {
      await addUpdatePlan(finalPlan);
      setPlans(plans.map((plan) => (plan.id === id ? finalPlan : plan)));
    } catch (error) {
      console.error("Failed to update plan", error);
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await deletePlanApi(id);
      setPlans(plans.filter((plan) => plan.id !== id));
    } catch (error) {
      console.error("Failed to delete plan", error);
    }
  };

  const handleUpdateTokenPrice = async (price: number) => {
    try {
      await updateTokenPrice(price.toString());
      setTokenPriceINR(price);
    } catch (error) {
      console.error("Failed to update token price", error);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard plans={plans} tokenPriceINR={tokenPriceINR} />;
      case "token-price":
        return (
          <TokenPriceSettings
            tokenPriceINR={tokenPriceINR}
            setTokenPriceINR={handleUpdateTokenPrice}
          />
        );
      case "one-time":
        return (
          <PlanManager
            type="one-time"
            plans={plans.filter((p) => p.type === "one-time")}
            addPlan={addPlan}
            updatePlan={updatePlan}
            deletePlan={deletePlan}
            tokenPriceINR={tokenPriceINR}
          />
        );
      case "monthly":
        return (
          <PlanManager
            type="monthly"
            plans={plans.filter((p) => p.type === "monthly")}
            addPlan={addPlan}
            updatePlan={updatePlan}
            deletePlan={deletePlan}
            tokenPriceINR={tokenPriceINR}
          />
        );
      case "Quarterly":
        return (
          <PlanManager
            type="Quarterly"
            plans={plans.filter((p) => p.type === "Quarterly")}
            addPlan={addPlan}
            updatePlan={updatePlan}
            deletePlan={deletePlan}
            tokenPriceINR={tokenPriceINR}
          />
        );
      case "yearly":
        return (
          <PlanManager
            type="yearly"
            plans={plans.filter((p) => p.type === "yearly")}
            addPlan={addPlan}
            updatePlan={updatePlan}
            deletePlan={deletePlan}
            tokenPriceINR={tokenPriceINR}
          />
        );
      case "transaction-history":
        return <TransactionHistory />;
      default:
        return <Dashboard plans={plans} tokenPriceINR={tokenPriceINR} />;
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "token-price", label: "Token Price" },
    { id: "transaction-history", label: "Transactions" },
    { id: "one-time", label: "One-Time Plans" },
    { id: "monthly", label: "Monthly" },
    { id: "Quarterly", label: "Quarterly" },
    { id: "yearly", label: "Yearly" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-gray-900">Packages & Revenue</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage token plans, pricing, and transaction history.</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-0 border-b-2 border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-[3px] -mb-[2px] transition-all ${
              activePage === tab.id
                ? "text-gray-900 border-yellow-400"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{renderPage()}</div>
    </div>
  );
}

export default App;
