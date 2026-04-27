// import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import PortfolioTemplate1 from './pages/portfolio-template-1/PortfolioTemplate1';
import PortfolioTemplate2 from './pages/portfolio-template-2/PortfolioTemplate2';
import CompanyTemplate1 from './pages/company-template-1/CompanyTemplate1';
import CompanyTemplate2 from './pages/company-template-2/CompanyTemplate2';
import CreatePortfolio from './pages/create-portfolio/CreatePortfolio';
// import ProfessionalTemplates from './pages/create-portfolio/ProfessionalTemplates';
import ProfessionalForm from './pages/create-portfolio/ProfessionalForm';
import PreviewTemplate from './pages/create-portfolio/PreviewTemplate';
import CreateCompany from './pages/create-company/CreateCompany';
import CompanyPreview from './pages/create-company/CompanyPreview';
import EventTemplate1 from './pages/event-template-1/EventTemplate1';
import EventTemplate2 from './pages/event-template-2/EventTemplate2';
import CreateEvent from './pages/create-event/CreateEvent';
import EventPreview from './pages/create-event/EventPreview';
  
function SubApp() {
  return (
    <Routes>
      <Route path="/" element={<CreatePortfolio/>} />
      <Route path="/create-company" element={<CreateCompany />} />

      <Route path="/portfolio/template-${template.id}/258964443767" element={<PortfolioTemplate1 />} />
      <Route path="/portfolio/template-${template.id}/258964443767" element={<PortfolioTemplate2 />} />
      
      <Route path="/:companySlug" element={<CompanyTemplate1 />} />
      <Route path="/company-template-2" element={<CompanyTemplate2 />} />




      <Route path="/create-portfolio" element={<CreatePortfolio />} />
      {/* <Route path="/create-portfolio/professional" element={<ProfessionalTemplates />} /> */}
      <Route path="/create-portfolio/professional" element={<ProfessionalForm />} />

<Route path="/portfolio/template-1/:id" element={<PortfolioTemplate1 />} />
  <Route path="/portfolio/template-2/:id" element={<PortfolioTemplate2 />} />

      <Route path="/preview/portfolio-template-:templateId" element={<PreviewTemplate />} />





      <Route path="/create-company" element={<CreateCompany />} />
      <Route path="/preview/company-template-:templateId" element={<CompanyPreview />} />
      <Route path="/droneexpo" element={<EventTemplate1 />} />
      <Route path="/event-template-2" element={<EventTemplate2 />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/preview/event-template-:templateId" element={<EventPreview />} />
    </Routes>
  );
}

export default SubApp;