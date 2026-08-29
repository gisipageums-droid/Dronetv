import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserAuth } from "../../../context/context";
import { getMyCompany, getPortalProfile, savePortalProfileSection } from "../../api";
import { PageHeader, EmptyState } from "../../ui";
import OverviewTab from "./OverviewTab";
import ServicesProductsTab from "./ServicesProductsTab";
import FleetTab from "./FleetTab";
import TeamTab from "./TeamTab";
import ProjectsTab from "./ProjectsTab";
import SkillsTab from "./SkillsTab";
import CertificationsTab from "./CertificationsTab";
import ServiceAreasTab from "./ServiceAreasTab";
import GalleryTab from "./GalleryTab";
import ProfileSettingsTab from "./ProfileSettingsTab";

const TABS = [
  { id: "overview", label: "Company Overview" },
  { id: "services", label: "Services & Products" },
  { id: "fleet", label: "Drone Fleet" },
  { id: "team", label: "Team & Staff" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills & Resources" },
  { id: "certs", label: "Certifications" },
  { id: "areas", label: "Service Areas" },
  { id: "gallery", label: "Gallery" },
  { id: "settings", label: "Settings" },
];

export default function CompanyProfilePage() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [activeTab, setActiveTab] = useState("overview");
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string>("");
  const [templateSelection, setTemplateSelection] = useState<string>("template-1");
  const [companyName, setCompanyName] = useState<string>("");
  const [profile, setProfile] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const company = await getMyCompany(userId);
        if (!company?.publishedId) {
          setError("No published company found for this account yet.");
          setLoading(false);
          return;
        }
        setPublishedId(company.publishedId);
        setDraftId(company.draftId || "");
        setTemplateSelection(company.templateSelection || "template-1");
        setCompanyName(company.companyName || "");
        const data = await getPortalProfile(company.publishedId);
        setProfile(data);
      } catch (err) {
        setError("Failed to load company profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const save = async (section: string, data: any) => {
    if (!publishedId) return;
    try {
      await savePortalProfileSection(publishedId, section, data);
      setProfile(prev => ({ ...prev, [section]: data }));
      toast.success("Saved successfully");
    } catch {
      toast.error("Failed to save - please try again");
    }
  };

  if (loading) return <div className="py-16 text-center text-sm text-white/40">Loading profile...</div>;
  if (error || !publishedId) return <EmptyState text={error || "No company found"} />;

  const tabProps = { publishedId, userId, draftId, templateSelection, profile, save };

  return (
    <div>
      <PageHeader title="Company Profile" sub={`Manage ${companyName || "your company"}'s full profile shown to buyers on DroneTv.in`} />

      <div className="flex gap-1 border-b border-white/10 mb-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-3 text-[12.5px] whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.id ? "text-brand-gold border-brand-yellow font-semibold" : "text-white/40 border-transparent hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab {...tabProps} />}
      {activeTab === "services" && <ServicesProductsTab {...tabProps} />}
      {activeTab === "fleet" && <FleetTab {...tabProps} />}
      {activeTab === "team" && <TeamTab {...tabProps} />}
      {activeTab === "projects" && <ProjectsTab {...tabProps} />}
      {activeTab === "skills" && <SkillsTab {...tabProps} />}
      {activeTab === "certs" && <CertificationsTab {...tabProps} />}
      {activeTab === "areas" && <ServiceAreasTab {...tabProps} />}
      {activeTab === "gallery" && <GalleryTab {...tabProps} />}
      {activeTab === "settings" && <ProfileSettingsTab {...tabProps} />}
    </div>
  );
}

export interface TabProps {
  publishedId: string;
  userId: string;
  draftId: string;
  templateSelection: string;
  profile: Record<string, any>;
  save: (section: string, data: any) => Promise<void>;
}
