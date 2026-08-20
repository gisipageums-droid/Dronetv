import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import PagePlacementSlot from "./components/common/PagePlacementSlot";
import PopularVideos from "./components/PopularVideos";
import BrowseByTopic from "./components/BrowseByTopic";
import FeaturedCompanies from "./components/FeaturedCompanies";
import UpcomingEvents from "./components/UpcomingEvents";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
const VideosPage = lazy(() => import("./components/VideosPage"));
const CompaniesPage = lazy(() => import("./components/CompaniesPage"));
const ProductsPage = lazy(() => import("./components/ProductsPage"));
const EventsPage = lazy(() => import("./components/EventsPage"));
const NewsPage = lazy(() => import("./components/NewsPage"));
const AboutPage = lazy(() => import("./components/AboutPage"));
const PartnerPage = lazy(() => import("./components/PartnerPage"));
const ContactPage = lazy(() => import("./components/ContactPage"));
const SearchPage = lazy(() => import("./components/SearchPage"));
const TermsAndConditionsPage = lazy(() => import("./components/TermsAndConditionsPage"));
const PrivacyPolicyPage = lazy(() => import("./components/PrivacyPolicyPage"));
const ProductDetailPage = lazy(() => import("./components/ProductDetailPage"));
const ProfessionalsPage = lazy(() => import("./components/ProfessionalsPage"));
const ServicesPage = lazy(() => import("./components/ServicesPage"));
const ServiceDetailPage = lazy(() => import("./components/ServiceDetailPage"));
import ScrollingFooter from "./components/ScrollingFooter";
import AdsLoader from "./components/common/AdsLoader";
const GalleryPage = lazy(() => import("./components/GalleryPage"));
import GalleryGlimpse from "./components/GalleryGlimpse";
const SubApp = lazy(() => import("./components/webbuilder/src/App"));
import OurPartners from "./components/Ourpartners";
const Select = lazy(() => import("./components/company/src/components/select-template/Select"));
const Template2 = lazy(() => import("./components/company/src/components/template/t2/src/main"));
const Form = lazy(() => import("./components/company/src/components/form/src/main"));
const EditTemp2 = lazy(() => import("./components/company/src/components/template/t2/edit/src/main"));
const EditTemp1 = lazy(() => import("./components/company/src/components/template/t1/edit/src/main"));
const Template1 = lazy(() => import("./components/company/src/components/template/t1/src/main"));
const DashboardPreview1 = lazy(() => import("./components/company/src/components/template/t1/final/preview/src/main"));
const DashboardPreview2 = lazy(() => import("./components/company/src/components/template/t2/final/preview/src/main"));
const DashboardEdit1 = lazy(() => import("./components/company/src/components/template/t1/final/edit/src/main"));
const DashboardEdit2 = lazy(() => import("./components/company/src/components/template/t2/final/edit/src/main"));
import { CombinedProviders } from "./components/context/context";
// import CompanyDirectory from "./components/CompanyDirectory";
const Login = lazy(() => import("./components/Login"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const Logout = lazy(() => import("./components/Logout"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const CompanyRedirectGuard = lazy(() => import("./components/CompanyRedirectGuard"));
const AdminProtectedRoute = lazy(() => import("./components/adminProtectedRoute"));
import AiProtectedRoute from "./components/AiProtectedRoute";
const RoleGuard = lazy(() => import("./components/RoleGuard"));
const AdminDashboard = lazy(() => import("./components/Admin/CompaniesDashboard/AdminDashboard"));
const MainCompPreviewT1 = lazy(() => import("./components/mainCompanyPreview/t1/src/App"));
const MainCompPreviewT2 = lazy(() => import("./components/mainCompanyPreview/t2/src/App"));
const ProfessionalForm = lazy(() => import("./components/Professional/form/src/App"));
const EventsForm = lazy(() => import("./components/event/form/src/App"));
const ProfessionalTemplateSelector = lazy(() => import("./components/Professional/Select-Template/select"));
const ProTemp2 = lazy(() => import("./components/Professional/Template/T-2/src/App"));
const ProTemp1 = lazy(() => import("./components/Professional/Template/T-1/preview/src/App"));
// import SignupConfirmation from "./components/Professional/form/form/greeting/greeting";
const EditTemp_2 = lazy(() => import("./components/Professional/Template/T-2/edit/src/App"));
const EditTemp_1 = lazy(() => import("./components/Professional/Template/T-1/edit/src/main"));
const NotFound = lazy(() => import("./components/company/src/components/form/src/Notfound"));
const NotFoundPage = lazy(() => import("./components/NotFoundPage"));
const EventAdminDashboard = lazy(() => import("./components/Admin/eventAdmin/EventAdminDashboard"));
const UserEvent = lazy(() => import("./components/UserEvent"));
const AdminProfessional = lazy(() => import("./components/Admin/professionalAdmin/AdminProfessionalDashboard"));
const AdminUsersDashboard = lazy(() => import("./components/Admin/userAdmin/AdminUsersDashboard"));
const StaffManagement = lazy(() => import("./components/Admin/staffAdmin/StaffManagement"));
const CompanyPortalLayout = lazy(() => import("./components/CompanyPortal/CompanyPortalLayout"));
const CompanyPortalDashboard = lazy(() => import("./components/CompanyPortal/pages/Dashboard"));
const CompanyPortalProfile = lazy(() => import("./components/CompanyPortal/pages/profile/CompanyProfilePage"));
const CompanyPortalListings = lazy(() => import("./components/CompanyPortal/pages/Listings"));
const CompanyPortalLeads = lazy(() => import("./components/CompanyPortal/pages/Leads"));
const CompanyPortalContent = lazy(() => import("./components/CompanyPortal/pages/Content"));
const CompanyPortalMagazine = lazy(() => import("./components/CompanyPortal/pages/Magazine"));
const CompanyPortalPress = lazy(() => import("./components/CompanyPortal/pages/Press"));
const CompanyPortalAnalytics = lazy(() => import("./components/CompanyPortal/pages/Analytics"));
const CompanyPortalPackage = lazy(() => import("./components/CompanyPortal/pages/Package"));
const CompanyPortalInvoices = lazy(() => import("./components/CompanyPortal/pages/Invoices"));
const CompanyPortalSettings = lazy(() => import("./components/CompanyPortal/pages/Settings"));
const AdminCompanyEdit = lazy(() => import("./components/Admin/userAdmin/AdminCompanyEdit"));
const UserProfessional = lazy(() => import("./components/profissionalDirectory"));

const ExcelDataProcessor = lazy(() => import("./components/excelextraction/excel"));
const DocumentTextExtractor = lazy(() => import("./components/excelextraction/extracttext"));
// import FinaleProfessionalTemp1 from "./components/Professional/Template/T-1/"
const FinaleProfessionalTemp2 = lazy(() => import("./components/Professional/Template/T-2/final/preview/src/App"));
const FinalEditTemp_2 = lazy(() => import("./components/Professional/Template/T-2/final/edit/src/App"));
const MainProTemp2 = lazy(() => import("./components/mainProfessionalPreview/t2/src/App"));

const FinaleProfessionalTemp1 = lazy(() => import("./components/Professional/Template/T-1/final/preview/src/App"));
const FinaleProfessionalTemp1Edit = lazy(() => import("./components/Professional/Template/T-1/final/edit/src/App"));
// import MainProTemp1 from "./components/mainProfessinalPreview/T-1/preview/src/App";



const UserDashboard = lazy(() => import("./components/UserDashboard/pages/AdminDashboard"));
const UserCompany = lazy(() => import("./components/UserDashboard/pages/Company"));
const CompanyWebsite = lazy(() => import("./components/UserDashboard/pages/CompanyWebsite"));
const AiDashboard = lazy(() => import("./components/UserDashboard/pages/AiDashboard"));
const Professinal = lazy(() => import("./components/UserDashboard/pages/Professinal"));
const Event = lazy(() => import("./components/UserDashboard/pages/Event"));
const ProfilePage = lazy(() => import("./components/UserDashboard/pages/ProfilePage"));
const ContactedPeople = lazy(() => import("./components/UserDashboard/pages/ContactedPeople"));
const CompanyLeads = lazy(() => import("./components/UserDashboard/components/common/CompanyLeads"));
const CompanyLeadsPage = lazy(() => import("./components/UserDashboard/pages/CompanyLeadsPage"));
const UserDashboardLayout = lazy(() => import("./components/UserDashboard/components/layout/Layout"));
const ProfessionalLeads = lazy(() => import("./components/UserDashboard/components/common/ProfessionalLeads"));
const AdminCompanyForm = lazy(() => import("./components/AdminCompanyForm"));
const FinalT1 = lazy(() => import("./components/mainProfessionalPreview/t1/src/App"));
import Event_T1 from "./components/event/template/t1/src/EventTemplate1"
const Event_T2 = lazy(() => import("./components/event/template/t2/src/App"));
const Edit_event_t1 = lazy(() => import("./components/event/template/t1/edit/EventTemplate1"));

const Edit_event_t2 = lazy(() => import("./components/event/template/t2/edit/App"));
const EventSelect = lazy(() => import("./components/event/select-template/Event-select"));
const EventLeads = lazy(() => import("./components/UserDashboard/components/common/EventLeads"));
import MainEvent1 from "./components/mainEventPreview/t1/EventTemplate1"
//main App.tsx
const BuyTokenPage = lazy(() => import("./components/UserDashboard/pages/Buy"));
const TransactionHistory = lazy(() => import("./components/UserDashboard/pages/transaction"));
const RechargePlans = lazy(() => import("./components/UserDashboard/pages/Plans"));
const MediaHub = lazy(() => import("./components/UserDashboard/pages/MediaHub"));
const MyContentManager = lazy(() => import("./components/UserDashboard/pages/MyContentManager"));
const Addons = lazy(() => import("./components/UserDashboard/pages/Addons"));
const UserPosts = lazy(() => import("./components/UserDashboard/pages/UserPosts"));
const BidKeywords = lazy(() => import("./components/UserDashboard/pages/BidKeywords"));
const PagePlacements = lazy(() => import("./components/UserDashboard/pages/PagePlacements"));
const MyPackage = lazy(() => import("./components/UserDashboard/pages/MyPackage"));
const ActiveCampaigns = lazy(() => import("./components/UserDashboard/pages/ActiveCampaigns"));
import AdminTokenPlan from "./components/Admin/AdminTokenPlans/App"
const AdminLogin = lazy(() => import("./components/Admin/adminLogin/AdminLogin"));
const AdminMediaDashboard = lazy(() => import("./components/Admin/mediaAdmin/AdminMediaDashboard"));
const AdminJobBoardDashboard = lazy(() => import("./components/Admin/jobBoardAdmin/AdminJobBoardDashboard"));
const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const AdminTokenEconomy = lazy(() => import("./components/Admin/AdminTokenEconomy"));
const AdminInvoicesPage = lazy(() => import("./pages/admin/AdminInvoicesPage"));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));
const AdminUserContentPage = lazy(() => import("./pages/admin/AdminUserContentPage"));
const EventsExcelDataProcessor = lazy(() => import("./components/eventsExcelExtraction/excel"));
const ProfessionalsDocumentTextExtractor = lazy(() => import("./components/professionalsExcelExtraction/professionalsExcelExtraction/excel"));

// Media Hub pages
const NewsPulsePage = lazy(() => import("./pages/media/NewsPulse"));
const MagazinePage = lazy(() => import("./pages/media/Magazine"));
const VideoSpotlightPage = lazy(() => import("./pages/media/VideoSpotlight"));
const ImpactStoriesPage = lazy(() => import("./pages/media/ImpactStories"));
const MarketIntelligencePage = lazy(() => import("./pages/media/MarketIntelligence"));
const TechTrendsPage = lazy(() => import("./pages/media/TechTrends"));
const PressReleasesPage = lazy(() => import("./pages/media/PressReleases"));
const IndustryReportsPage = lazy(() => import("./pages/media/IndustryReports"));
const MediaHubPage = lazy(() => import("./pages/media/MediaHub"));
const MediaDetailPage = lazy(() => import("./pages/media/MediaDetailPage"));

// Events sub-pages
const EventCalendarPage = lazy(() => import("./pages/events/EventCalendar"));
const ExposPage = lazy(() => import("./pages/events/Expos"));
const ConferencesPage = lazy(() => import("./pages/events/Conferences"));
const WorkshopsPage = lazy(() => import("./pages/events/Workshops"));
const CompetitionsPage = lazy(() => import("./pages/events/Competitions"));
const WebinarsPage = lazy(() => import("./pages/events/Webinars"));
const MeetupsPage = lazy(() => import("./pages/events/Meetups"));

// Professionals sub-pages
const JobBoardPage = lazy(() => import("./pages/professionals/JobBoard"));
const PilotDirectoryPage = lazy(() => import("./pages/professionals/PilotDirectory"));
const CertificationsPage = lazy(() => import("./pages/professionals/Certifications"));
const PortfolioPage = lazy(() => import("./pages/professionals/Portfolio"));
const TrainingPage = lazy(() => import("./pages/professionals/Training"));
const CareerPathPage = lazy(() => import("./pages/professionals/CareerPath"));

// Partnerships pages
const DroneManufacturersPage = lazy(() => import("./pages/partnerships/DroneManufacturers"));
const AITechCompaniesPage = lazy(() => import("./pages/partnerships/AITechCompanies"));
const EventOrganizersPage = lazy(() => import("./pages/partnerships/EventOrganizers"));
const EducationPartnersPage = lazy(() => import("./pages/partnerships/EducationPartners"));
const IndustryPlayersPage = lazy(() => import("./pages/partnerships/IndustryPlayers"));
const PartnerBenefitsPage = lazy(() => import("./pages/partnerships/PartnerBenefits"));
const BecomePartnerPage = lazy(() => import("./pages/partnerships/BecomePartner"));
const PartnershipsHubPage = lazy(() => import("./pages/partnerships/PartnershipsHub"));



const PageLoadingFallback = () => (
  <div className="min-h-[40vh] w-full flex items-center justify-center">
    <div className="h-8 w-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

const HomePage = () => (
  <>
    <Hero />
    {/* "Featured Strip" paid placements (HP-2/HP-3) — booked via User Dashboard > Page Placements */}
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
      <PagePlacementSlot slotId="HP-2" aspect="3/1" minHeight={90} />
      <PagePlacementSlot slotId="HP-3" aspect="3/1" minHeight={90} />
    </div>
    <PopularVideos />
    <UpcomingEvents />
    {/* "Sponsored Article" paid placement (HP-4) — booked via User Dashboard > Page Placements */}
    <div className="max-w-6xl mx-auto px-4 py-2">
      <PagePlacementSlot slotId="HP-4" aspect="4/1" minHeight={90} className="w-full" />
    </div>
    <BrowseByTopic />
    <FeaturedCompanies />
    <OurPartners />
    <GalleryGlimpse />
    <Newsletter />
  </>
);

const AppContent = () => {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/company-portal") ||
    location.pathname.startsWith("/form") ||
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/edit") ||
    location.pathname.startsWith("/professional/") ||
    location.pathname.startsWith("/template") ||
    location.pathname.startsWith("/event/leads");
  const hideNavigation =
    location.pathname.startsWith("/admin/") ||
    location.pathname.startsWith("/user/companies/edit") ||
    location.pathname.startsWith("/user/companies/preview") ||
    location.pathname.startsWith("/user/professionals/edit") ||
    location.pathname.startsWith("/professional/edit") ||
    location.pathname.startsWith("/professional/form") ||
    location.pathname.startsWith("/edit/event") ||
    location.pathname.startsWith("/events/form");

  return (
    <div className="min-h-screen">
      <CombinedProviders>
        {!hideNavigation && <Navigation />}
        <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/videos" element={<VideosPage />} />

          {/* Media Hub routes */}
          <Route path="/media" element={<MediaHubPage />} />
          <Route path="/media/news-pulse" element={<NewsPulsePage />} />
          <Route path="/media/news/:contentId" element={<MediaDetailPage contentType="news" backPath="/media/news-pulse" backLabel="News Pulse" externalLinkLabel="Read Original Source" />} />
          <Route path="/media/magazine" element={<MagazinePage />} />
          <Route path="/media/magazine/:contentId" element={<MediaDetailPage contentType="magazine" backPath="/media/magazine" backLabel="Magazine" externalLinkLabel="View Full Article" />} />
          <Route path="/media/video-spotlight" element={<VideoSpotlightPage />} />
          <Route path="/media/impact-stories" element={<ImpactStoriesPage />} />
          <Route path="/media/impact-stories/:contentId" element={<MediaDetailPage contentType="impact-story" backPath="/media/impact-stories" backLabel="Impact Stories" externalLinkLabel="Read Full Story" />} />
          <Route path="/media/market-intelligence" element={<MarketIntelligencePage />} />
          <Route path="/media/market-intelligence/:contentId" element={<MediaDetailPage contentType="market-intelligence" backPath="/media/market-intelligence" backLabel="Market Intelligence" externalLinkLabel="View Original Source" />} />
          <Route path="/media/tech-trends" element={<TechTrendsPage />} />
          <Route path="/media/press-releases" element={<PressReleasesPage />} />
          <Route path="/media/industry-reports" element={<IndustryReportsPage />} />
          <Route path="/media/gallery" element={<GalleryPage />} />

          {/* Events sub-routes — must be before dynamic /event/:name */}
          <Route path="/events/calendar" element={<EventCalendarPage />} />
          <Route path="/events/expos" element={<ExposPage />} />
          <Route path="/events/conferences" element={<ConferencesPage />} />
          <Route path="/events/workshops" element={<WorkshopsPage />} />
          <Route path="/events/competitions" element={<CompetitionsPage />} />
          <Route path="/events/webinars" element={<WebinarsPage />} />
          <Route path="/events/meetups" element={<MeetupsPage />} />

          {/* Partnerships routes */}
          <Route path="/partnerships" element={<PartnershipsHubPage />} />
          <Route path="/partnerships/drone-manufacturers" element={<DroneManufacturersPage />} />
          <Route path="/partnerships/ai-tech" element={<AITechCompaniesPage />} />
          <Route path="/partnerships/event-organizers" element={<EventOrganizersPage />} />
          <Route path="/partnerships/education-partners" element={<EducationPartnersPage />} />
          <Route path="/partnerships/industry-players" element={<IndustryPlayersPage />} />
          <Route path="/advertising-plans" element={<PartnerBenefitsPage />} />
          <Route path="/partnerships/become-a-partner" element={<BecomePartnerPage />} />

          <Route path="/professionals" element={<ProfessionalsPage />} />
          <Route path="/listed-companies" element={<CompaniesPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="/event/*" element={<SubApp />} />
          <Route
            path="/user/companies/template-selection"
            element={<Select />}
          />
          <Route path="/companies" element={<Select />} />
          <Route path="/template/t1" element={<Template1 />} />
          <Route path="/template/t2" element={<Template2 />} />
          <Route path="/form" element={<Form />} />
          <Route path="/form/:publicId/:userId/:draftId" element={<Form />} />
          {/* AI get not found */}
          <Route path="/form/notfound" element={<NotFound />} />

          <Route path="/edit/template/t1/:draftId/:userId" element={<EditTemp1 />} />
          <Route path="/edit/template/t2/:draftId/:userId" element={<EditTemp2 />} />
          <Route
            path="/user/companies/preview/1/:publishedId/:userId"
            element={<DashboardPreview1 />}
          />
          <Route
            path="/user/companies/preview/2/:publishedId/:userId"
            element={<DashboardPreview2 />}
          />
          <Route
            path="/user/companies/edit/1/:pub/:userId"
            element={<DashboardEdit1 />}
          />
          <Route
            path="/user/companies/edit/2/:pub/:userId"
            element={<DashboardEdit2 />}
          />
          {/* // company form admin route */}
          <Route path="/admin-dashboard/company-form" element={<AdminCompanyForm />} />

          {/* login functionality */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="reset-password/:id" element={<ResetPassword />} />
          {/* admin dashboard */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/plans" element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminTokenPlan />
              </AdminLayout>
            </AdminProtectedRoute>} />
          <Route path="/admin/invoices" element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminInvoicesPage />
              </AdminLayout>
            </AdminProtectedRoute>} />
          <Route path="/admin/settings" element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminSettingsPage />
              </AdminLayout>
            </AdminProtectedRoute>} />
          <Route path="/admin/user-content" element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminUserContentPage />
              </AdminLayout>
            </AdminProtectedRoute>} />
          <Route path="/admin/company/dashboard" element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminProtectedRoute>} />
          <Route
            path="/admin/companies/preview/1/:publishedId/:userId"
            element={<DashboardPreview1 />}
          />
          <Route
            path="/admin/companies/preview/2/:publishedId/:userId"
            element={<DashboardPreview2 />}
          />
          <Route
            path="/admin/companies/edit/1/:pub/:userId"
            element={<DashboardEdit1 />}
          />
          <Route
            path="/admin/companies/edit/2/:pub/:userId"
            element={<DashboardEdit2 />}
          />
          {/* main preview routes */}
          <Route path="/company/:urlSlug" element={<MainCompPreviewT1 />} />
          <Route path="/companies/:urlSlug" element={<MainCompPreviewT2 />} />

          {/* professionals route */}
          <Route path="/professional/form/:userId/:professionalId" element={<ProfessionalForm />} />
          <Route path="/professional/form" element={<ProfessionalForm />} />
          <Route path="/events/form" element={<EventsForm />} />
          <Route
            path="/professional/select"
            element={<ProfessionalTemplateSelector />}
          />
          <Route path="/professional/t2" element={<ProTemp2 />} />
          <Route path="/professional/t1" element={<ProTemp1 />} />
          {/* Professionals sub-routes — must be before dynamic /:urlSlug? */}
          <Route path="/professionals/job-board" element={<JobBoardPage />} />
          <Route path="/professionals/pilot-directory" element={<PilotDirectoryPage />} />
          <Route path="/professionals/certifications" element={<CertificationsPage />} />
          <Route path="/professionals/portfolio" element={<PortfolioPage />} />
          <Route path="/professionals/training" element={<TrainingPage />} />
          <Route path="/professionals/career-path" element={<CareerPathPage />} />
          <Route path="/professionals/:urlSlug?" element={<MainProTemp2 />} />
          <Route path="/professional/:urlSlug?" element={<FinalT1 />} />

          {/* <Route path='/professional/Greeting' element={<SignupConfirmation/>} /> */}
          <Route
            path="/professional/edit/:draftId/:userId/template=2"
            element={<EditTemp_2 />}
          />
          <Route
            path="/professional/edit/:draftId/:userId/template=1"
            element={<EditTemp_1 />}
          />
          <Route path="/user/professional" element={<UserProfessional />} />
          <Route path="/admin/users" element={<AdminProtectedRoute><AdminLayout><AdminUsersDashboard /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/staff" element={<AdminProtectedRoute><AdminLayout><StaffManagement /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/companies/details/:publishedId/:userId" element={<AdminProtectedRoute><AdminCompanyEdit /></AdminProtectedRoute>} />
          <Route path="/admin/professional/dashboard" element={<AdminProtectedRoute><AdminLayout><AdminProfessional /></AdminLayout></AdminProtectedRoute>} />
          <Route
            path="/user/professionals/preview/2/:professionalId/:userId"
            element={<FinaleProfessionalTemp2 />}
          />
          <Route
            path="/user/professionals/edit/2/:professionalId/:userId"
            element={<FinalEditTemp_2 />}
          />
          <Route path="/professionals/:urlSlug" element={<MainProTemp2 />} />

          <Route
            path="/user/professionals/preview/1/:professionalId/:userId"
            element={<FinaleProfessionalTemp1 />}
          />
          <Route
            path="/user/professionals/edit/1/:professionalId/:userId"
            element={<FinaleProfessionalTemp1Edit />}
          />
          {/* <Route path="/professional/:urlSlug" element={<MainProTemp1 />} /> */}

          <Route path="/admin/media/dashboard" element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminMediaDashboard />
              </AdminLayout>
            </AdminProtectedRoute>} />

          <Route path="/admin/jobboard/dashboard" element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminJobBoardDashboard />
              </AdminLayout>
            </AdminProtectedRoute>} />

          {["/admin/tokens/revenue", "/admin/tokens/auctions", "/admin/tokens/ledger", "/admin/tokens/slots", "/admin/tokens/phase-gate"].map(p => (
            <Route key={p} path={p} element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminTokenEconomy />
                </AdminLayout>
              </AdminProtectedRoute>} />
          ))}

          {/* event routes */}
          <Route
            path="/admin/event/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <EventAdminDashboard />
                </AdminLayout>
              </AdminProtectedRoute>}
          />
          <Route path="/user/event" element={<UserEvent />} />

          {/* <Route path='/user/event/preview/1/:eventId/:userId' element={<EventPreview1 />} /> */}
          {/* <Route path="/user/event/edit/1/" element={<EventTemplateEdit1 />} />  */}
          {/* <Route path="/user/event/edit/2/" element={<EventTemplateEdit2 />} />  */}
          <Route path="/preview/event/t1" element={<Event_T1 />} />
          <Route path="/preview/event/t2" element={<Event_T2 />} />
          <Route path="/edit/event/t1/:isAIgen/:draftId/:userId" element={<Edit_event_t1 />} />
          <Route path="/edit/event/t2/:isAIgen/:draftId/:userId" element={<Edit_event_t2 />} />
          <Route path="/event/:eventName" element={<MainEvent1 />} />
          <Route path="/event/select" element={<EventSelect />} />
          <Route path="/event/leads/:eventName/:eventId" element={

            <UserDashboardLayout>
              <EventLeads />
            </UserDashboardLayout>
          } />




          {/* excel extraction route */}
          <Route path="/excel" element={<ExcelDataProcessor />} />
          <Route path="/extract-text" element={<DocumentTextExtractor />} />

          {/* User dashboard routes */}
          <Route
            path="/user-professionals"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal">
                  <UserDashboardLayout>
                    <Professinal />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-events"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal">
                  <UserDashboardLayout>
                    <Event />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-companies"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/profile">
                  <UserDashboardLayout>
                    <UserCompany />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-website"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/profile">
                  <UserDashboardLayout>
                    <CompanyWebsite />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal">
                  <UserDashboardLayout>
                    <UserDashboard />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route path="/company-portal" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalDashboard /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/profile" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalProfile /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/listings" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalListings /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/leads" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalLeads /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/content" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalContent /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/magazine" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalMagazine /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/press" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalPress /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/analytics" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalAnalytics /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/package" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalPackage /></CompanyPortalLayout></ProtectedRoute>} />
          {/* Buy Tokens / Keyword Bidding / Page Placements existed only as
              shared /user-* pages - company accounts got redirected away
              from those into My Package (which has no such features), so
              they lost access entirely. These reuse the exact same
              components, just under CompanyPortalLayout instead. */}
          <Route path="/company-portal/buy-tokens" element={<ProtectedRoute><CompanyPortalLayout><BuyTokenPage /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/keywords" element={<ProtectedRoute><CompanyPortalLayout><BidKeywords /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/placements" element={<ProtectedRoute><CompanyPortalLayout><PagePlacements /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/invoices" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalInvoices /></CompanyPortalLayout></ProtectedRoute>} />
          <Route path="/company-portal/settings" element={<ProtectedRoute><CompanyPortalLayout><CompanyPortalSettings /></CompanyPortalLayout></ProtectedRoute>} />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/settings">
                  <UserDashboardLayout>
                    <ProfilePage />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-recharge"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/package">
                  <UserDashboardLayout>
                    <RechargePlans />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-buy"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/buy-tokens">
                  <UserDashboardLayout>
                    <BuyTokenPage />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-media-hub"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/content">
                  <UserDashboardLayout>
                    <MediaHub />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-content/:type"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/content">
                  <UserDashboardLayout>
                    <MyContentManager />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-addons"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/package">
                  <UserDashboardLayout>
                    <Addons />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-posts"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/content">
                  <UserDashboardLayout>
                    <UserPosts />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-transactions"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/invoices">
                  <UserDashboardLayout>
                    <TransactionHistory />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-bid-keywords"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/keywords">
                  <UserDashboardLayout>
                    <BidKeywords />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-page-placements"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/placements">
                  <UserDashboardLayout>
                    <PagePlacements />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-plans"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/package">
                  <UserDashboardLayout>
                    <MyPackage />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-active-campaigns"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/analytics">
                  <UserDashboardLayout>
                    <ActiveCampaigns />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-company/leads/:companyName"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/leads">
                  <UserDashboardLayout>
                    <CompanyLeads />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-leads"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/leads">
                  <UserDashboardLayout>
                    <CompanyLeadsPage />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-professional/leads/:professionalName/:professionalId"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/leads">
                  <UserDashboardLayout>
                    <ProfessionalLeads />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-contacted"
            element={
              <ProtectedRoute>
                <CompanyRedirectGuard to="/company-portal/leads">
                  <UserDashboardLayout>
                    <ContactedPeople />
                  </UserDashboardLayout>
                </CompanyRedirectGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-ai"
            element={
              <RoleGuard roles={['admin']}>
                <UserDashboardLayout>
                  <AiDashboard />
                </UserDashboardLayout>
              </RoleGuard>
            }
          />
        <Route path="/eventsexcel" element={<EventsExcelDataProcessor />} />
        <Route path="/professionalsexcel" element={<ProfessionalsDocumentTextExtractor />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>

        {!hideFooter && <Footer />}
        {!hideFooter && <ScrollingFooter />}
        <AdsLoader />
      </CombinedProviders>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
