import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
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
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [tokenPriceINR, setTokenPriceINR] = useState<number>(0.5);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-orange-50 mt-20">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
