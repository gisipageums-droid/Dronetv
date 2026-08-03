import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/context";
import CompanyLeads from "../components/common/CompanyLeads";
import { COMPANY_API, LAMBDA } from '../../../lib/apiConfig';

const API = COMPANY_API ? `${COMPANY_API}/dashboard-cards` : `${LAMBDA.company}/dashboard-cards`;

const CompanyLeadsPage: React.FC = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const userId = user?.email || user?.userData?.email || "";
  const [companies, setCompanies] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API}?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        const list: any[] = data?.cards || data?.companies || data?.data || [];
        setCompanies(list);
        if (list.length === 1) setSelected(list[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-caption">
        Loading...
      </div>
    );
  }

  if (!companies.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-ink-caption">
        <p className="text-lg font-medium">No companies found.</p>
        <button
          onClick={() => navigate("/user-companies")}
          className="px-4 py-2 bg-brand-yellow text-ink rounded-lg font-semibold hover:bg-brand-gold transition"
        >
          Go to Companies
        </button>
      </div>
    );
  }

  return (
    <div>
      {companies.length > 1 && (
        <div className="px-6 pt-6 flex flex-wrap gap-2">
          {companies.map((c) => (
            <button
              key={c.publishedId || c.companyName}
              onClick={() => setSelected(c)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                selected?.companyName === c.companyName
                  ? "bg-brand-yellow border-brand-gold text-ink"
                  : "bg-surface-card border-ink-light text-ink-paragraph hover:bg-brand-yellow-soft"
              }`}
            >
              {c.companyName}
            </button>
          ))}
        </div>
      )}
      {selected ? (
        <CompanyLeads
          key={selected.companyName}
          overrideCompanyName={selected.companyName}
          overridePublishedId={selected.publishedId}
        />
      ) : (
        <div className="flex items-center justify-center h-64 text-ink-caption">
          Select a company above to view leads.
        </div>
      )}
    </div>
  );
};

export default CompanyLeadsPage;
