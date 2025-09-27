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
import ProfessionalForm from "./components/Professional/form/form/src/App";
import ProfessionalTemplateSelector from "./components/Professional/Select-Template/select";
import ProTemp2 from "./components/Professional/Template/T-2/src/App";
import ProTemp1 from "./components/Professional/Template/T-1/preview/src/App"
// import SignupConfirmation from "./components/Professional/form/form/greeting/greeting";
import EditTemp_2 from "./components/Professional/Template/T-2/edit/src/App";
import EditTemp_1 from "./components/Professional/Template/T-1/edit/src/main"
import NotFound from "./components/buildWeb/src/components/form/src/Notfound"
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
  const hideFooter = location.pathname.startsWith("/company");

  return (
    <div className='min-h-screen'>
      <CombinedProviders>
        <Navigation />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/videos' element={<VideosPage />} />
          <Route path='/professionals' element={<ProfessionalsPage />} />
          <Route path='/listed-companies' element={<CompaniesPage />} />
          <Route path='/user/companies' element={<CompanyDirectory />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/services' element={<ServicesPage />} />
          <Route path='/events' element={<EventsPage />} />
          <Route path='/news' element={<NewsPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/partner' element={<PartnerPage />} />
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
          <Route
            path='/companies'
            element={<Select />}
          />
          <Route path='/template/t1' element={<Template1 />} />
          <Route path='/template/t2' element={<Template2 />} />
          <Route path='/form' element={<Form />} />
          <Route path='/form/:publicId/:userId/:draftId' element={<Form />} />
         {/* AI get not found */}
          <Route path='/form/notfound' element={<NotFound />} />

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

          {/* professionals route */}

<Route path='/professional/form' element={<ProfessionalForm/>} />
          <Route path='/professional/select' element={<ProfessionalTemplateSelector/>} />
          <Route path='/professional/t2' element={<ProTemp2/>} />
          <Route path='/professional/t1' element={<ProTemp1/>} />

          {/* <Route path='/professional/Greeting' element={<SignupConfirmation/>} /> */}
          <Route path='/professional/edit/:draftId/:userId/template=2' element={<EditTemp_2/>} />
          <Route path='/professional/edit/:draftId/:userId/template=1' element={<EditTemp_1/>} />


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
