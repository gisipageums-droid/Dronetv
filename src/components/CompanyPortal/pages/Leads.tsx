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

  if (loading) {
    return (
      <div>
        <PageHeader title="B2B Leads" sub="Buyer inquiries submitted to your company profile" />
        <Card className="text-center py-16 text-ink-caption">Loading...</Card>
      </div>
    );
  }

  if (!company) {
    return (
      <div>
        <PageHeader title="B2B Leads" sub="Buyer inquiries submitted to your company profile" />
        <Card><EmptyState text="No published company found. Publish your profile to start receiving leads." /></Card>
      </div>
    );
  }

  // CompanyLeads renders its own full header/search/table chrome and
  // padding (min-h-screen p-4 md:p-6) - it's designed as a standalone page,
  // not an embeddable widget. Negating the portal's own <main> padding here
  // avoids a duplicated header and doubled-up spacing around it.
  return (
    <div className="-m-4 sm:-m-6">
      <CompanyLeads overrideCompanyName={company.companyName} overridePublishedId={company.publishedId} />
    </div>
  );
}
