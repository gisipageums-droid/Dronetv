import React from "react";
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
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import PartnerPage from "./components/PartnerPage";
import ContactPage from "./components/ContactPage";
import SearchPage from "./components/SearchPage";
import ProductDetailPage from "./components/ProductDetailPage";
import ProfessionalsPage from "./components/ProfessionalsPage";
import ServicesPage from "./components/ServicesPage";
import ServiceDetailPage from "./components/ServiceDetailPage";
import ScrollingFooter from "./components/ScrollingFooter";
import GalleryPage from "./components/GalleryPage";
import GalleryGlimpse from "./components/GalleryGlimpse";
import SubApp from "./components/webbuilder/src/App";
import OurPartners from "./components/Ourpartners";
import Select from "./components/buildWeb/src/components/select-template/Select";
import Template2 from "./components/buildWeb/src/components/template/t2/src/main";
import Form from "./components/buildWeb/src/components/form/src/main";
import EditTemp2 from "./components/buildWeb/src/components/template/t2/edit/src/main";
import EditTemp1 from "./components/buildWeb/src/components/template/t1/edit/src/main";
import Template1 from "./components/buildWeb/src/components/template/t1/src/main";
import DashboardPreview1 from "./components/buildWeb/src/components/template/t1/final/preview/src/main"
import DashboardPreview2 from "./components/buildWeb/src/components/template/t2/final/preview/src/main"
import DashboardEdit1 from "./components/buildWeb/src/components/template/t1/final/edit/src/main"
import DashboardEdit2 from "./components/buildWeb/src/components/template/t2/final/edit/src/main"
import { CombinedProviders } from "./components/context/context";
import CompanyDirectory from "./components/CompanyDirectory";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Logout from "./components/Logout";
import ResetPassword from "./components/ResetPassword";
// import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/Admin/CompaniesDashboard/AdminDashboard";
import MainCompPreviewT1 from "./components/mainCompanyPreview/t1/src/App";
import MainCompPreviewT2 from "./components/mainCompanyPreview/t2/src/App";
import { useLanguage } from './components/LanguageContext';

const translations: any = {
  English: {
    hero: {
      title1: "Explore the Future",
      title2: "of Drone Technology",
      watchNow: "Watch Now",
      browseCategories: "Browse Categories"
    },
    popularVideos: {
      sectionTitle: "Popular Videos"
    },
    upcomingEvents: {
      sectionTitle: "Upcoming Events",
      sectionDesc: "Connect, learn, and network at industry-leading events"
    },
    browseByTopic: {
      sectionTitle: "Browse by Topic"
    },
    featuredCompanies: {
      sectionTitle: "Featured Companies"
    },
    ourPartners: {
      sectionTitle: "Our Partners"
    },
    galleryGlimpse: {
      sectionTitle: "Gallery Glimpse"
    },
    newsletter: {
      sectionTitle: "Stay Updated with Drone TV!",
      sectionDesc: "Get exclusive access to the latest news, cutting-edge videos, and industry insights delivered straight to your inbox."
    }
  },
  Hindi: {
    hero: {
      title1: "भविष्य का अन्वेषण करें",
      title2: "ड्रोन तकनीक का",
      watchNow: "अभी देखें",
      browseCategories: "श्रेणियाँ ब्राउज़ करें"
    },
    popularVideos: {
      sectionTitle: "लोकप्रिय वीडियो"
    },
    upcomingEvents: {
      sectionTitle: "आगामी कार्यक्रम",
      sectionDesc: "उद्योग-अग्रणी कार्यक्रमों में जुड़ें, सीखें और नेटवर्क करें"
    },
    browseByTopic: {
      sectionTitle: "विषय अनुसार ब्राउज़ करें"
    },
    featuredCompanies: {
      sectionTitle: "विशेष कंपनियाँ"
    },
    ourPartners: {
      sectionTitle: "हमारे साझेदार"
    },
    galleryGlimpse: {
      sectionTitle: "गैलरी झलक"
    },
    newsletter: {
      sectionTitle: "Drone TV के साथ अपडेट रहें!",
      sectionDesc: "नवीनतम समाचार, वीडियो और उद्योग अंतर्दृष्टि सीधे अपने इनबॉक्स में प्राप्त करें।"
    }
  },
  Telugu: {
    hero: {
      title1: "భవిష్యత్తును అన్వేషించండి",
      title2: "డ్రోన్ సాంకేతికత",
      watchNow: "ఇప్పుడు చూడండి",
      browseCategories: "వర్గాలను బ్రౌజ్ చేయండి"
    },
    popularVideos: {
      sectionTitle: "ప్రాచుర్యం పొందిన వీడియోలు"
    },
    upcomingEvents: {
      sectionTitle: "రాబోయే ఈవెంట్స్",
      sectionDesc: "ప్రముఖ ఈవెంట్స్‌లో కలవండి, నేర్చుకోండి, నెట్‌వర్క్ చేయండి"
    },
    browseByTopic: {
      sectionTitle: "విషయాల ద్వారా బ్రౌజ్ చేయండి"
    },
    featuredCompanies: {
      sectionTitle: "ప్రధాన కంపెనీలు"
    },
    ourPartners: {
      sectionTitle: "మన భాగస్వాములు"
    },
    galleryGlimpse: {
      sectionTitle: "గ్యాలరీ గ్లింప్స్"
    },
    newsletter: {
      sectionTitle: "Drone TV తో తాజా సమాచారం పొందండి!",
      sectionDesc: "తాజా వార్తలు, వీడియోలు మరియు పరిశ్రమ సమాచారం మీ ఇన్బాక్స్‌లోకి పంపబడుతుంది."
    }
  }
};

const HomePage = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations['English'];
  return (
    <>
      <Hero {...t.hero} />
      <PopularVideos sectionTitle={t.popularVideos.sectionTitle} />
      <UpcomingEvents sectionTitle={t.upcomingEvents.sectionTitle} sectionDesc={t.upcomingEvents.sectionDesc} />
      <BrowseByTopic sectionTitle={t.browseByTopic.sectionTitle} />
      <FeaturedCompanies sectionTitle={t.featuredCompanies.sectionTitle} />
      <OurPartners sectionTitle={t.ourPartners.sectionTitle} />
      <GalleryGlimpse sectionTitle={t.galleryGlimpse.sectionTitle} />
      <Newsletter sectionTitle={t.newsletter.sectionTitle} sectionDesc={t.newsletter.sectionDesc} />
    </>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/company");

  return (
    <div className='min-h-screen'>
      <CombinedProviders>
        <Navigation />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/videos' element={<VideosPage />} />
          <Route path='/professionals' element={<ProfessionalsPage />} />
          <Route path='/companies' element={<CompaniesPage />} />
          <Route path='/user/companies' element={<CompanyDirectory />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/services' element={<ServicesPage />} />
          <Route path='/events' element={<EventsPage />} />
          <Route path='/news' element={<NewsPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/partner' element={<PartnerPage />} />
          <Route path='/termsandconditions' element={<TermsAndConditions />} />
          <Route path='/privacypolicy' element={<PrivacyPolicy />} />
          <Route path='/gallery' element={<GalleryPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/service/:id' element={<ServiceDetailPage />} />
          <Route path='/event/*' element={<SubApp />} />
          <Route
            path='/user/companies/template-selection'
            element={<Select />}
          />
          <Route path='/template/t1' element={<Template1 />} />
          <Route path='/template/t2' element={<Template2 />} />
          <Route path='/form' element={<Form />} />
          <Route path='/form/:publicId/:userId/:draftId' element={<Form />} />

          <Route path='/edit/template/t1' element={<EditTemp1 />} />
          <Route path='/edit/template/t2' element={<EditTemp2 />} />
          <Route path='/user/companies/preview/1/:publishedId/:userId' element={<DashboardPreview1 />} />
           <Route path='/user/companies/preview/2/:publishedId/:userId' element={<DashboardPreview2 />} />
          <Route path='/user/companies/edit/1/:pub' element={<DashboardEdit1 />} />
           <Route path='/user/companies/edit/2/:pub' element={<DashboardEdit2 />} />
          {/* login functionality */}
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='reset-password/:id' element={<ResetPassword />} />
          {/* admin dashboard */}
          <Route path='/admin/company/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/companies/preview/1/:publishedId/:userId' element={<DashboardPreview1 />} />
          <Route path='/admin/companies/preview/2/:publishedId/:userId' element={<DashboardPreview2 />} />

          {/* main preview routes */}
          <Route path='/company/:urlSlug' element={<MainCompPreviewT1 />} />
          <Route path='/companies/:urlSlug' element={<MainCompPreviewT2 />} />
        </Routes>
        {!hideFooter && <Footer />}
        <ScrollingFooter />
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
