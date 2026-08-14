import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/context";
import CompanyLeads from "../../UserDashboard/components/common/CompanyLeads";
import { PageHeader, Card, EmptyState } from "../ui";
import { getMyCompany } from "../api";

export default function Leads() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getMyCompany(userId).then(setCompany).finally(() => setLoading(false));
  }, [userId]);

  return (
    <div>
      <PageHeader title="B2B Leads" sub="Buyer inquiries submitted to your company profile" />
      {loading ? (
        <Card className="text-center py-16 text-ink-caption">Loading...</Card>
      ) : !company ? (
        <Card><EmptyState text="No published company found. Publish your profile to start receiving leads." /></Card>
      ) : (
        <CompanyLeads overrideCompanyName={company.companyName} overridePublishedId={company.publishedId} />
      )}
    </div>
  );
}
