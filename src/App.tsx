import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import PopularVideos from "./components/PopularVideos";
import BrowseByTopic from "./components/BrowseByTopic";
import FeaturedCompanies from "./components/FeaturedCompanies";
import UpcomingEvents from "./components/UpcomingEvents";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import VideosPage from "./components/VideosPage";
import CompaniesPage from "./components/CompaniesPage";
import ProductsPage from "./components/ProductsPage";
import EventsPage from "./components/EventsPage";
import NewsPage from "./components/NewsPage";
import AboutPage from "./components/AboutPage";
import PartnerPage from "./components/PartnerPage";
import ContactPage from "./components/ContactPage";
import SearchPage from "./components/SearchPage";
import TermsAndConditionsPage from "./components/TermsAndConditionsPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import ProductDetailPage from "./components/ProductDetailPage";
import ProfessionalsPage from "./components/ProfessionalsPage";
import ServicesPage from "./components/ServicesPage";
import ServiceDetailPage from "./components/ServiceDetailPage";
import ScrollingFooter from "./components/ScrollingFooter";
import GalleryPage from "./components/GalleryPage";
import GalleryGlimpse from "./components/GalleryGlimpse";
import SubApp from "./components/webbuilder/src/App";
import OurPartners from "./components/Ourpartners";
import Select from "./components/company/src/components/select-template/Select";
import Template2 from "./components/company/src/components/template/t2/src/main";
import Form from "./components/company/src/components/form/src/main";
import EditTemp2 from "./components/company/src/components/template/t2/edit/src/main";
import EditTemp1 from "./components/company/src/components/template/t1/edit/src/main";
import Template1 from "./components/company/src/components/template/t1/src/main";
import DashboardPreview1 from "./components/company/src/components/template/t1/final/preview/src/main";
import DashboardPreview2 from "./components/company/src/components/template/t2/final/preview/src/main";
import DashboardEdit1 from "./components/company/src/components/template/t1/final/edit/src/main";
import DashboardEdit2 from "./components/company/src/components/template/t2/final/edit/src/main";
import { CombinedProviders } from "./components/context/context";
// import CompanyDirectory from "./components/CompanyDirectory";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Logout from "./components/Logout";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/adminProtectedRoute";
import AiProtectedRoute from "./components/AiProtectedRoute";
import AdminDashboard from "./components/Admin/CompaniesDashboard/AdminDashboard";
import MainCompPreviewT1 from "./components/mainCompanyPreview/t1/src/App";
import MainCompPreviewT2 from "./components/mainCompanyPreview/t2/src/App";
import ProfessionalForm from "./components/Professional/form/src/App";
import EventsForm from "./components/event/form/src/App";
import ProfessionalTemplateSelector from "./components/Professional/Select-Template/select";
import ProTemp2 from "./components/Professional/Template/T-2/src/App";
import ProTemp1 from "./components/Professional/Template/T-1/preview/src/App";
// import SignupConfirmation from "./components/Professional/form/form/greeting/greeting";
import EditTemp_2 from "./components/Professional/Template/T-2/edit/src/App";
import EditTemp_1 from "./components/Professional/Template/T-1/edit/src/main";
import NotFound from "./components/company/src/components/form/src/Notfound";
import EventAdminDashboard from "./components/Admin/eventAdmin/EventAdminDashboard";
import UserEvent from "./components/UserEvent";
import AdminProfessional from "./components/Admin/professionalAdmin/AdminProfessionalDashboard";
import UserProfessional from "./components/profissionalDirectory";

import ExcelDataProcessor from "./components/excelextraction/excel";
import DocumentTextExtractor from "./components/excelextraction/extracttext";
// import FinaleProfessionalTemp1 from "./components/Professional/Template/T-1/"
import FinaleProfessionalTemp2 from "./components/Professional/Template/T-2/final/preview/src/App";
import FinalEditTemp_2 from "./components/Professional/Template/T-2/final/edit/src/App";
import MainProTemp2 from "./components/mainProfessionalPreview/t2/src/App";

import FinaleProfessionalTemp1 from "./components/Professional/Template/T-1/final/preview/src/App";
import FinaleProfessionalTemp1Edit from "./components/Professional/Template/T-1/final/edit/src/App";
// import MainProTemp1 from "./components/mainProfessinalPreview/T-1/preview/src/App";



import UserDashboard from "./components/UserDashboard/pages/AdminDashboard";
import UserCompany from "./components/UserDashboard/pages/Company";
import CompanyWebsite from "./components/UserDashboard/pages/CompanyWebsite";
import AiDashboard from "./components/UserDashboard/pages/AiDashboard";
import Professinal from "./components/UserDashboard/pages/Professinal";
import Event from "./components/UserDashboard/pages/Event";
import ProfilePage from "./components/UserDashboard/pages/ProfilePage";
import ContactedPeople from "./components/UserDashboard/pages/ContactedPeople";
import CompanyLeads from "./components/UserDashboard/components/common/CompanyLeads";
import CompanyLeadsPage from "./components/UserDashboard/pages/CompanyLeadsPage";
import UserDashboardLayout from "./components/UserDashboard/components/layout/Layout";
import ProfessionalLeads from "./components/UserDashboard/components/common/ProfessionalLeads";
import AdminCompanyForm from "./components/AdminCompanyForm";
import FinalT1 from "./components/mainProfessionalPreview/t1/src/App";
import Event_T1 from "./components/event/template/t1/src/EventTemplate1"
import Event_T2 from "./components/event/template/t2/src/App";
import Edit_event_t1 from "./components/event/template/t1/edit/EventTemplate1";

import Edit_event_t2 from "./components/event/template/t2/edit/App";
import EventSelect from "./components/event/select-template/Event-select";
import EventLeads from "./components/UserDashboard/components/common/EventLeads";
import MainEvent1 from "./components/mainEventPreview/t1/EventTemplate1"
//main App.tsx
import BuyTokenPage from "./components/UserDashboard/pages/Buy";
import TransactionHistory from "./components/UserDashboard/pages/transaction";
import RechargePlans from "./components/UserDashboard/pages/Plans";
import AdminTokenPlan from "./components/Admin/AdminTokenPlans/App"
import AdminLogin from "./components/Admin/adminLogin/AdminLogin";
import AdminMediaDashboard from "./components/Admin/mediaAdmin/AdminMediaDashboard";
import EventsExcelDataProcessor from "./components/eventsExcelExtraction/excel";
import ProfessionalsDocumentTextExtractor from "./components/professionalsExcelExtraction/professionalsExcelExtraction/excel";

// Media Hub pages
import NewsPulsePage from "./pages/media/NewsPulse";
import MagazinePage from "./pages/media/Magazine";
import VideoSpotlightPage from "./pages/media/VideoSpotlight";
import ImpactStoriesPage from "./pages/media/ImpactStories";
import MarketIntelligencePage from "./pages/media/MarketIntelligence";
import TechTrendsPage from "./pages/media/TechTrends";
import PressReleasesPage from "./pages/media/PressReleases";
import IndustryReportsPage from "./pages/media/IndustryReports";
import MediaHubPage from "./pages/media/MediaHub";

// Events sub-pages
import EventCalendarPage from "./pages/events/EventCalendar";
import ExposPage from "./pages/events/Expos";
import ConferencesPage from "./pages/events/Conferences";
import WorkshopsPage from "./pages/events/Workshops";
import CompetitionsPage from "./pages/events/Competitions";
import WebinarsPage from "./pages/events/Webinars";
import MeetupsPage from "./pages/events/Meetups";

// Professionals sub-pages
import JobBoardPage from "./pages/professionals/JobBoard";
import PilotDirectoryPage from "./pages/professionals/PilotDirectory";
import CertificationsPage from "./pages/professionals/Certifications";
import PortfolioPage from "./pages/professionals/Portfolio";
import TrainingPage from "./pages/professionals/Training";
import NetworkingPage from "./pages/professionals/Networking";
import CommunityPage from "./pages/professionals/Community";

// Partnerships pages
import DroneManufacturersPage from "./pages/partnerships/DroneManufacturers";
import AITechCompaniesPage from "./pages/partnerships/AITechCompanies";
import EventOrganizersPage from "./pages/partnerships/EventOrganizers";
import EducationPartnersPage from "./pages/partnerships/EducationPartners";
import IndustryPlayersPage from "./pages/partnerships/IndustryPlayers";
import PartnerBenefitsPage from "./pages/partnerships/PartnerBenefits";
import BecomePartnerPage from "./pages/partnerships/BecomePartner";
import PartnershipsHubPage from "./pages/partnerships/PartnershipsHub";


const HomePage = () => (
  <>
    <Hero />
    <PopularVideos />
    <UpcomingEvents />
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
    location.pathname.startsWith("/company") ||
    location.pathname.startsWith("/form") ||
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/edit") ||
    location.pathname.startsWith("/professional") ||
    location.pathname.startsWith("/template");
  const hideNavigation =
    location.pathname.startsWith("/user/companies/edit") ||
    location.pathname.startsWith("/admin/companies/edit") ||
    location.pathname.startsWith("/user/professionals/edit") ||
    location.pathname.startsWith("/admin/professionals/edit") ||
    location.pathname.startsWith("/professional/edit") ||
    location.pathname.startsWith("/professional/form") ||
    location.pathname.startsWith("/edit/event") ||
    location.pathname.startsWith("/events/form");

  return (
    <div className="min-h-screen">
      <CombinedProviders>
        {!hideNavigation && <Navigation />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/videos" element={<VideosPage />} />

          {/* Media Hub routes */}
          <Route path="/media" element={<MediaHubPage />} />
          <Route path="/media/news-pulse" element={<NewsPulsePage />} />
          <Route path="/media/magazine" element={<MagazinePage />} />
          <Route path="/media/video-spotlight" element={<VideoSpotlightPage />} />
          <Route path="/media/impact-stories" element={<ImpactStoriesPage />} />
          <Route path="/media/market-intelligence" element={<MarketIntelligencePage />} />
          <Route path="/media/tech-trends" element={<TechTrendsPage />} />
          <Route path="/media/press-releases" element={<PressReleasesPage />} />
          <Route path="/media/industry-reports" element={<IndustryReportsPage />} />

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
          <Route path="/partnerships/benefits" element={<PartnerBenefitsPage />} />
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
              <AdminTokenPlan />
            </AdminProtectedRoute>} />
          <Route path="/admin/company/dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
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
          <Route path="/professionals/networking" element={<NetworkingPage />} />
          <Route path="/professionals/community" element={<CommunityPage />} />
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
          <Route path="/admin/professional/dashboard" element={<AdminProtectedRoute><AdminProfessional /></AdminProtectedRoute>} />
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
              <AdminMediaDashboard />
            </AdminProtectedRoute>} />

          {/* event routes */}
          <Route
            path="/admin/event/dashboard"
            element={
              <AdminProtectedRoute>
                <EventAdminDashboard />
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
              <UserDashboardLayout>
                <Professinal />
              </UserDashboardLayout>
            }
          />
          <Route
            path="/user-events"
            element={
              <UserDashboardLayout>
                <Event />
              </UserDashboardLayout>
            }
          />
          <Route
            path="/user-companies"
            element={
              <ProtectedRoute>
                <UserDashboardLayout>
                  <UserCompany />
                </UserDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-website"
            element={
              <ProtectedRoute>
                <UserDashboardLayout>
                  <CompanyWebsite />
                </UserDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboardLayout>
                  <UserDashboard />
                </UserDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <UserDashboardLayout>
                <ProfilePage />
              </UserDashboardLayout>
            }
          />

          <Route
            path="/user-recharge"
            element={
              <ProtectedRoute>
                <UserDashboardLayout>
                  <RechargePlans />
                </UserDashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-buy"
            element={
              <ProtectedRoute>
                <UserDashboardLayout>
                  <BuyTokenPage />
                </UserDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-transactions"
            element={
              <ProtectedRoute>
                <UserDashboardLayout>
                  <TransactionHistory />
                </UserDashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-company/leads/:companyName"
            element={
              <UserDashboardLayout>
                <CompanyLeads />
              </UserDashboardLayout>
            }
          />
          <Route path="/user-leads" element={<CompanyLeadsPage />} />
          <Route
            path="/user-professional/leads/:ProfessionalName/:professionalId"
            element={
              <UserDashboardLayout>
                <ProfessionalLeads />
              </UserDashboardLayout>
            }
          />
          <Route
            path="/user-contacted"
            element={
              <UserDashboardLayout>
                <ContactedPeople />
              </UserDashboardLayout>
            }
          />
          <Route
            path="/user-ai"
            element={
              <AiProtectedRoute>
                <UserDashboardLayout>
                  <AiDashboard />
                </UserDashboardLayout>
              </AiProtectedRoute>
            }
          />
        <Route path="/eventsexcel" element={<EventsExcelDataProcessor />} />
        <Route path="/professionalsexcel" element={<ProfessionalsDocumentTextExtractor />} />
        </Routes>

        {!hideFooter && <Footer />}
        {!hideFooter && <ScrollingFooter />}
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
