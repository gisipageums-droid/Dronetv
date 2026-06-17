import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoldRule = () => (
  <div className="h-1 bg-gradient-to-r from-yellow-400 to-red-600" />
);

const SectionNum = ({ n, color = 'text-yellow-400' }: { n: string; color?: string }) => (
  <div className={`text-4xl sm:text-5xl font-extrabold leading-none min-w-[44px] ${color}`}>{n}</div>
);

const Eyebrow = ({ label, color = 'text-gray-400' }: { label: string; color?: string }) => (
  <div className={`text-[10px] font-bold tracking-[0.16em] uppercase mb-1 ${color}`}>{label}</div>
);

const SectionHead = ({
  num, eyebrow, title, desc,
  numColor = 'text-yellow-400',
  eyebrowColor = 'text-gray-400',
  titleColor = 'text-gray-900',
  descColor = 'text-gray-500',
}: {
  num: string; eyebrow: string; title: React.ReactNode; desc?: string;
  numColor?: string; eyebrowColor?: string; titleColor?: string; descColor?: string;
}) => (
  <div className="flex items-start gap-4 mb-8">
    <SectionNum n={num} color={numColor} />
    <div>
      <Eyebrow label={eyebrow} color={eyebrowColor} />
      <h2 className={`text-xl sm:text-2xl font-bold leading-tight tracking-tight ${titleColor}`}>{title}</h2>
      {desc && <p className={`text-sm mt-2 max-w-2xl leading-relaxed ${descColor}`}>{desc}</p>}
    </div>
  </div>
);

type CardItem = { icon?: string; badge?: React.ReactNode; title: string; desc: string; bullets: string[]; bulletColor?: string };

const FeatCard = ({ icon, badge, title, desc, bullets, bulletColor = 'bg-yellow-400' }: CardItem) => (
  <div className="bg-white p-5">
    {icon && <span className="text-2xl block mb-2">{icon}</span>}
    {badge && <div className="mb-2">{badge}</div>}
    <h4 className="text-[13px] font-bold text-gray-900 mb-1.5 leading-snug">{title}</h4>
    <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{desc}</p>
    <ul className="border-t border-gray-100 pt-2 space-y-1.5">
      {bullets.map((b, i) => (
        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-700 leading-snug">
          <span className={`w-1.5 h-1.5 rounded-full ${bulletColor} mt-1 flex-shrink-0`} />
          {b}
        </li>
      ))}
    </ul>
  </div>
);

const FeatGrid = ({ children, bg = 'bg-gray-200' }: { children: React.ReactNode; bg?: string }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border-2 border-gray-200 rounded overflow-hidden ${bg}`}>
    {children}
  </div>
);

const Chip = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-block text-[9px] font-bold tracking-[0.06em] px-2.5 py-1 rounded-full mb-2 ${color}`}>{label}</span>
);

export default function PortfolioPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-[104px] min-h-screen bg-white font-sans">

      {/* ── HERO ── */}
      <section className="bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-center">
          <div>
            <div className="text-[10px] font-bold tracking-[0.18em] text-yellow-400 uppercase mb-3">Platform Profile — FY 2026-27</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-2">
              India's Dedicated<br /><span className="text-yellow-400">Drone, GIS &amp; AI</span><br />Industry Platform
            </h1>
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-red-500 mb-5">
              Voice of Drone Technology · GIS · AI Technologies
            </div>
            <p className="text-[13.5px] text-white/65 leading-relaxed max-w-xl mb-8">
              DroneTv.in is a B2B marketplace, media channel, digital magazine, and video interview platform exclusively for the Drone, GIS, and AI technology ecosystem. Every lead, viewer, and reader belongs to one of these three industries.
            </p>
            <div className="flex flex-wrap gap-6 sm:gap-8">
              {[['3','Industries Covered'],['50+','Interviews Published'],['100%','Industry Audience'],['14','Add-On Services']].map(([val, label]) => (
                <div key={label}>
                  <strong className="block text-2xl sm:text-3xl font-extrabold text-yellow-400 leading-none mb-1">{val}</strong>
                  <span className="text-[10px] text-white/50 uppercase tracking-wider font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.04] border border-yellow-400/25 rounded-lg p-5">
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-yellow-400 mb-4 pb-3 border-b border-yellow-400/20">Quick Reference</div>
            {[
              ['Website','www.dronetv.in'],
              ['Entity','Drone Academy Pvt. Ltd.'],
              ['Contact','bd@dronetv.in'],
              ['Phone','+91 7520123555'],
              ['Industries','Drone · GIS · AI'],
              ['Packages','₹25K / ₹75K / ₹1.5L / yr'],
              ['YouTube','@indiadronetv'],
              ['Instagram','@dronetv.in'],
              ['Onboarding','dronetv.in/form'],
            ].map(([label, val]) => (
              <div key={label} className="flex gap-2.5 py-1.5 border-b border-white/5 last:border-0 text-[11.5px]">
                <span className="text-white/40 min-w-[72px] text-[10.5px]">{label}</span>
                <span className="text-white/85 font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── THREE PILLARS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {[
          { bg:'bg-zinc-900', sub:'Industry 01', title:'Drone Industry', icon:'🚁',
            desc:'Manufacturers, service providers, training institutes, operators, distributors, and pilots across all drone application sectors in India.',
            tags:['Agriculture','Survey','Defence','Inspection','Logistics','Training','Manufacturers','Media'] },
          { bg:'bg-[#1A5FA8]', sub:'Industry 02', title:'GIS Industry', icon:'🌐',
            desc:'Geospatial data companies, aerial survey and mapping firms, LiDAR specialists, remote sensing experts, and GIS software providers across India.',
            tags:['Photogrammetry','LiDAR','Remote Sensing','GIS Software','Land Survey','Urban Planning','Satellite Data'] },
          { bg:'bg-[#1A7A3C]', sub:'Industry 03', title:'AI Industry', icon:'🤖',
            desc:'AI analytics companies, computer vision specialists, autonomous systems developers, and machine learning platforms for drone and geospatial applications.',
            tags:['Computer Vision','Analytics','Autonomous Systems','ML / Deep Learning','AI Payloads','Geospatial AI','Inspection AI'] },
        ].map(({ bg, sub, title, icon, desc, tags }) => (
          <div key={title} className={`${bg} text-white p-8 sm:p-9`}>
            <span className="text-4xl block mb-3">{icon}</span>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase opacity-60 mb-1">{sub}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 tracking-tight">{title}</h3>
            <p className="text-xs opacity-80 leading-relaxed mb-4">{desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => (
                <span key={t} className="text-[9.5px] font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <GoldRule />

      {/* ── 01 ABOUT ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHead num="01" eyebrow="About DroneTv.in" title="What is DroneTv.in?"
          desc="India's only platform dedicated to Drone, GIS, and AI technology sectors — combining a B2B marketplace, media production, digital magazine, event coverage, and lead generation in one place. Founded by Dev R to bridge the gap between these industries and the startups and innovators who could not access affordable media channels to reach their audience." />
        <FeatGrid>
          {[
            { icon:'🎬', title:'Media Channel', desc:'Produces and publishes video interviews, reels, and editorial articles for Drone, GIS, and AI companies exclusively.',
              bullets:['5-minute video interviews on YouTube','Short reels across Instagram, Facebook, LinkedIn','Editorial articles on DroneTv.in','Event broadcasting and expo coverage'] },
            { icon:'🛒', title:'B2B Marketplace', desc:'Verified company profiles, product and service listings, and B2B enquiry forms for Drone, GIS, and AI companies.',
              bullets:['Verified, Featured, and Premium profiles','Product and service listing pages','B2B enquiry form on every profile','Category-based search across all sectors'] },
            { icon:'📰', title:'Digital Magazine', desc:'Quarterly print and digital magazine covering Drone, GIS, and AI technology in India — directory, ads, and editorial.',
              bullets:['Quarterly print and digital editions','Full-page and half-page advertisements','Editorial articles across all three sectors','Industry directory in every issue'] },
            { icon:'🏆', title:'Event Media Partner', desc:'Official broadcasting partner for Drone Expo 2025 Mumbai and Drone Expo 2026 Bengaluru — covering all three sectors.',
              bullets:['Live on-ground coverage and broadcasting','Stall interviews for Drone, GIS, and AI exhibitors','Published across all DroneTv platforms','Expo stall branding for Brand tier'] },
            { icon:'🔍', title:'Lead Generation', desc:'Buyer enquiries from Drone, GIS, and AI searches routed to subscribing companies. Full buyer data for Brand tier.',
              bullets:['Email notification on new enquiry','Full lead details on platform login','Monthly analytics for Scale and Brand','Full buyer contact data for Brand tier'] },
            { icon:'🌍', title:'Exclusive Industry Audience', desc:'100% Drone, GIS, and AI industry audience. No generic traffic. Every visitor belongs to one of the three sectors.',
              bullets:['Drone manufacturers and operators','GIS mapping and geospatial professionals','AI and technology companies','Industry buyers and decision-makers'] },
          ].map(c => <FeatCard key={c.title} {...c} />)}
        </FeatGrid>
      </section>
      <GoldRule />

      {/* ── 02 DRONE ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50 -mx-0">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="02" eyebrow="Drone Industry" title="What DroneTv.in Offers Drone Companies"
            desc="The platform was built for the drone industry first. Every feature — marketplace, media, magazine, events, and lead generation — is tailored to how drone companies grow their business and reach buyers." />
          <FeatGrid>
            {[
              { badge:<Chip label="Manufacturers" color="bg-zinc-900 text-yellow-400" />, title:'Drone Manufacturer Profiles', desc:'Dedicated profile pages for OEMs to list fixed-wing, multi-rotor, VTOL, and hybrid UAVs with full specifications and buyer enquiry forms.', bullets:['Product listing with full specifications','B2B buyer enquiry routing','Priority search ranking for Brand tier','Video interviews showcasing products'] },
              { badge:<Chip label="Service Providers" color="bg-zinc-900 text-yellow-400" />, title:'Drone Service Companies', desc:'Agriculture spraying, inspection, survey, logistics, and media service companies list their capabilities and get enquiries from active buyers.', bullets:['Service listing by application sector','Lead notifications from active buyers','Category-wise discovery for buyers','Case study and editorial content'] },
              { badge:<Chip label="Training" color="bg-zinc-900 text-yellow-400" />, title:'DGCA Training Institutes', desc:'DGCA-approved pilot training institutes, simulator labs, and drone academies reach students and career-changers through the platform.', bullets:['Institute profile and course listings','Career and training awareness content','Student enquiry routing','Social media promotion of programs'] },
              { badge:<Chip label="Components" color="bg-zinc-900 text-yellow-400" />, title:'Drone Parts & Technology', desc:'Propulsion systems, frames, batteries, payloads, ground control systems, and ancillary tech suppliers reaching drone manufacturers.', bullets:['Component-level product listings','B2B supplier discovery','Product demo video content','Buyer enquiry management'] },
              { badge:<Chip label="Events" color="bg-zinc-900 text-yellow-400" />, title:'Drone Expo Coverage', desc:'Official media partner for Drone Expo 2025 Mumbai and Drone Expo 2026 Bengaluru. 50+ interviews already produced.', bullets:['50+ interviews from Drone Expo 2025','Drone Expo 2026 Bengaluru: December 2026','Brand: expo stall branding','All tiers: digital event coverage'] },
              { badge:<Chip label="Media" color="bg-zinc-900 text-yellow-400" />, title:'Drone Industry Media', desc:'Video interviews, short reels, editorial articles, press releases, and magazine ads — all produced by DroneTv for drone companies.', bullets:['YouTube interviews on @indiadronetv','Social posts across LinkedIn, Instagram, Facebook','Editorial articles on DroneTv.in','Quarterly magazine advertisements'] },
            ].map(c => <FeatCard key={c.title} {...c} />)}
          </FeatGrid>
        </div>
      </section>
      <GoldRule />

      {/* ── 03 GIS ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="03" eyebrow="GIS Industry" numColor="text-[#1A5FA8]" eyebrowColor="text-[#1A5FA8]"
            title={<span className="text-[#1A5FA8]">What DroneTv.in Offers GIS Companies</span>}
            titleColor="text-[#1A5FA8]" descColor="text-gray-500"
            desc="GIS and geospatial companies have a dedicated audience on DroneTv.in — drone operators, infrastructure developers, agriculture companies, and government bodies actively searching for mapping and survey services. All packages and features apply equally to GIS companies." />
          <FeatGrid>
            {[
              { badge:<Chip label="Mapping & Survey" color="bg-blue-100 text-[#1A5FA8]" />, title:'Aerial Survey & Mapping Firms', desc:'Photogrammetry, LiDAR, topographic survey, and orthophoto service companies receive project enquiries from qualified clients.', bullets:['Service listing by survey type','B2B enquiry from infrastructure and government clients','Project portfolio on profile page','Aerial reel and demo video content'], bulletColor:'bg-[#1A5FA8]' },
              { badge:<Chip label="GIS Software" color="bg-blue-100 text-[#1A5FA8]" />, title:'GIS Software & Platforms', desc:'GIS processing software, point cloud tools, digital twin platforms, and geospatial analytics solutions reach their exact target market.', bullets:['Software product listings with demos','Product demo video production','Editorial articles on platform','Lead generation from active buyers'], bulletColor:'bg-[#1A5FA8]' },
              { badge:<Chip label="Remote Sensing" color="bg-blue-100 text-[#1A5FA8]" />, title:'Remote Sensing & Satellite Data', desc:'Multispectral, hyperspectral, and satellite data companies connect with agriculture, environment, and infrastructure clients.', bullets:['Technology showcase and listing','Use case articles and content','B2B enquiry from application sectors','Interview content on use cases'], bulletColor:'bg-[#1A5FA8]' },
              { badge:<Chip label="Land Survey" color="bg-blue-100 text-[#1A5FA8]" />, title:'Land & Cadastral Survey', desc:'Land survey and cadastral mapping firms reach government bodies, real estate developers, and infrastructure project owners.', bullets:['Service listing for survey categories','Government and B2B enquiry routing','Project case study articles','Magazine advertisement placements'], bulletColor:'bg-[#1A5FA8]' },
              { badge:<Chip label="Urban GIS" color="bg-blue-100 text-[#1A5FA8]" />, title:'Urban Planning & Infrastructure GIS', desc:'GIS consulting firms working on smart city, utility mapping, and infrastructure asset management reach their target clients.', bullets:['Consulting profile and service listing','Government and corporate buyer enquiries','Knowledge content and case studies','Industry professional networking'], bulletColor:'bg-[#1A5FA8]' },
              { badge:<Chip label="GIS Training" color="bg-blue-100 text-[#1A5FA8]" />, title:'GIS Training & Education', desc:'Institutes offering GIS, QGIS, ArcGIS, photogrammetry, and geospatial data certifications reach professionals and students.', bullets:['Institute and course listing','Career awareness content','Student and professional audience','Social media promotion of programs'], bulletColor:'bg-[#1A5FA8]' },
            ].map(c => <FeatCard key={c.title} {...c} />)}
          </FeatGrid>
          <div className="mt-5 bg-white border-l-4 border-[#1A5FA8] px-4 py-3 text-xs text-gray-500 leading-relaxed rounded-r">
            <strong className="text-gray-900">GIS on DroneTv.in:</strong> GIS is one of the platform's three primary sectors. All three packages — Reach, Scale, and Brand — are fully available to GIS companies at the same pricing. All content production, magazine, lead generation, and event coverage features apply to GIS companies without restriction.
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── 04 AI ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="04" eyebrow="AI Industry" numColor="text-[#1A7A3C]" eyebrowColor="text-[#1A7A3C]"
            title={<span className="text-[#155c2d]">What DroneTv.in Offers AI Companies</span>}
            titleColor="text-[#155c2d]" descColor="text-gray-500"
            desc="AI technology companies working on drone analytics, computer vision, autonomous systems, and geospatial intelligence reach an audience of drone operators, manufacturers, and GIS firms on DroneTv.in — the exact buyers and integrators they need." />
          <FeatGrid>
            {[
              { badge:<Chip label="Analytics" color="bg-green-100 text-[#1A7A3C]" />, title:'Drone Data Analytics', desc:'AI companies processing drone data for agriculture, infrastructure, and construction reach operators and manufacturers who need analytics platforms.', bullets:['Product and platform listing','B2B enquiry from drone operators','Product demo video content','Case study articles on DroneTv.in'], bulletColor:'bg-[#1A7A3C]' },
              { badge:<Chip label="Computer Vision" color="bg-green-100 text-[#1A7A3C]" />, title:'Computer Vision & Object Detection', desc:'Object detection, segmentation, and classification companies for drone video and imagery reach manufacturers and service providers.', bullets:['Technology showcase on profile','Editorial articles explaining applications','Interview content for awareness','Lead generation from manufacturers'], bulletColor:'bg-[#1A7A3C]' },
              { badge:<Chip label="Autonomous" color="bg-green-100 text-[#1A7A3C]" />, title:'Autonomous & Intelligent Drone Systems', desc:'AI-based flight planning, obstacle avoidance, and smart mission execution companies reach drone OEMs and enterprise operators.', bullets:['Technology and product listing','Product demo video production','B2B enquiry from drone manufacturers','Magazine editorial for innovation coverage'], bulletColor:'bg-[#1A7A3C]' },
              { badge:<Chip label="AgriTech AI" color="bg-green-100 text-[#1A7A3C]" />, title:'AI for Precision Agriculture', desc:'NDVI, crop health, pest detection, and yield prediction AI companies reach agriculture drone operators and farming companies.', bullets:['AgriTech product listing','Agriculture vertical promotion','Case study video and article content','B2B enquiry from agri-drone operators'], bulletColor:'bg-[#1A7A3C]' },
              { badge:<Chip label="Inspection AI" color="bg-green-100 text-[#1A7A3C]" />, title:'AI-Based Infrastructure Inspection', desc:'Automated damage detection and defect classification companies reach infrastructure owners and inspection service providers.', bullets:['Technology showcase and listing','Government and corporate buyer leads','Interview content on inspection use cases','Press release and news publishing'], bulletColor:'bg-[#1A7A3C]' },
              { badge:<Chip label="Geospatial AI" color="bg-green-100 text-[#1A7A3C]" />, title:'AI for GIS & Geospatial Data', desc:'ML companies processing drone and satellite imagery for land use, change detection, and environmental monitoring reach GIS firms and government buyers.', bullets:['Platform and product listing','Content for GIS professional audience','B2B enquiry from GIS firms','Editorial articles on AI + GIS convergence'], bulletColor:'bg-[#1A7A3C]' },
            ].map(c => <FeatCard key={c.title} {...c} />)}
          </FeatGrid>
          <div className="mt-5 bg-white border-l-4 border-[#1A7A3C] px-4 py-3 text-xs text-gray-500 leading-relaxed rounded-r">
            <strong className="text-gray-900">AI on DroneTv.in:</strong> AI technology companies selling to drone operators, manufacturers, or GIS firms find a ready-made audience on DroneTv.in. AI is one of the platform's three primary sectors. All packages, add-ons, content production, and lead generation features are equally available to AI companies.
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── 05 PLATFORM CAPABILITIES ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="05" eyebrow="Platform Capabilities" title="All Platform Features — Drone, GIS & AI"
            desc="Ten capability areas built into DroneTv.in. Every area applies equally to companies from all three sectors." />
          <FeatGrid>
            {[
              { icon:'🤝', title:'B2B Networking Hub', desc:'Connects Drone, GIS, and AI businesses with professionals, buyers, and technology partners across the ecosystem.', bullets:['Drone-to-GIS supplier connections','AI company to drone manufacturer leads','Cross-sector technology partnerships','Collaborative ecosystem networking'] },
              { icon:'🔭', title:'Industry Discovery Platform', desc:'Buyers explore companies across every Drone, GIS, and AI vertical — Agriculture, Survey, Defence, Analytics, Autonomous Systems, and more.', bullets:['Drone: 8 application verticals','GIS: mapping, LiDAR, software, training','AI: analytics, vision, autonomous, geospatial','Cross-sector discovery and browsing'] },
              { icon:'💻', title:'Product & Technology Showcase', desc:'Drone hardware, GIS platforms, AI software, payloads, and services listed with real-world use case content.', bullets:['Drone hardware and payload listings','GIS software and platform listings','AI product and API listings','Use case and specification content'] },
              { icon:'🎤', title:'Event Coverage & Promotion', desc:'Official media partner for Drone Expo events covering Drone, GIS, and AI exhibitors equally.', bullets:['On-ground interview production','Live event broadcasting','GIS and AI exhibitor coverage','Post-event content publishing'] },
              { icon:'🎥', title:'Video-Based Knowledge Platform', desc:'Expert interviews covering Drone innovations, GIS methodology, and AI applications — educational content for all three sectors.', bullets:['Drone CEO and founder interviews','GIS professional and expert talks','AI technology explainer interviews','Cross-sector use case content'] },
              { icon:'📈', title:'Lead Generation', desc:'Verified buyer enquiries from active searches across all three sectors routed directly to subscribing companies.', bullets:['B2B enquiry form on every profile','Email notification on new lead','Monthly reports for Scale and Brand','Full buyer data for Brand tier'] },
              { icon:'👤', title:'Platform for Industry Professionals', desc:'Drone pilots, GIS surveyors, AI engineers, and technology specialists connect, showcase work, and find opportunities.', bullets:['Professional profile and service listing','Cross-sector professional networking','Career opportunity discovery','Industry connection facilitation'] },
              { icon:'📢', title:'Marketing Support', desc:'Social media, video, articles, press releases, and magazine ads handled by DroneTv for all three sectors — no separate agency needed.', bullets:['Industry-specific post copywriting','Technical article writing for GIS/AI','Product demo video for AI/GIS platforms','Magazine ads across all three sectors'] },
              { icon:'📚', title:'Learning & Awareness', desc:'Drone applications, GIS methodology, and AI use case content — creating an informed audience that understands the products being sold.', bullets:['Drone application explainer content','GIS technology awareness articles','AI use case demonstrations','Regulatory and industry updates'] },
              { icon:'🎓', title:'Career & Training Awareness', desc:'Connects students with DGCA drone training, GIS certification, and AI/ML education programs from institutes on the platform.', bullets:['DGCA drone pilot training promotion','GIS and remote sensing courses','AI/ML certification programs','Internship and career connections'] },
            ].map(c => <FeatCard key={c.title} {...c} />)}
          </FeatGrid>
        </div>
      </section>
      <GoldRule />

      {/* ── 06 MARKETPLACE ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="06" eyebrow="Marketplace & Directory" title="Company Listings Across All Three Sectors"
            desc="Every subscribing company — Drone, GIS, or AI — gets a dedicated profile with listings, B2B form, and search placement based on their package tier." />
          <FeatGrid>
            {[
              { title:'Company Profile Pages', desc:'Each company is categorised under its correct sector and vertical. All three sectors have equal profile depth and features.', bullets:['Drone: categorised by application type','GIS: categorised by service or software type','AI: categorised by technology area','Verified, Featured, or Premium badge per tier'] },
              { title:'Product & Service Listings', desc:'Drone hardware, GIS services, AI platforms, and supporting technologies listed and searchable by category across all sectors.', bullets:['Up to 10 listings (Reach)','Up to 25 listings (Scale)','Unlimited listings (Brand)','Searchable across all three sectors'] },
              { title:'B2B Enquiry System', desc:"Drone buyers, GIS project managers, and AI platform users all submit requirements through the company's dedicated B2B form.", bullets:['Dedicated form per company','Email notification on every submission','Full details on platform login','Full buyer contact data on Brand tier'] },
              { title:'Search & Category Placement', desc:'Featured placement (Scale) and priority search ranking with quarterly homepage feature (Brand) — applies across all three sectors.', bullets:['Featured category placement 3 months (Scale)','Quarterly homepage feature (Brand)','Priority search ranking within sector (Brand)','Industry vertical promotion (Brand)'] },
              { title:'Analytics & Lead Reports', desc:'Monthly lead count, profile views, and listing performance data for Scale and Brand subscribers across Drone, GIS, and AI sectors.', bullets:['Monthly lead summary & views (Scale)','Full analytics dashboard (Brand)','Full buyer name, email, phone (Brand)','Listing performance data (Brand)'] },
              { title:'Industry Vertical Promotion', desc:'Brand subscribers are promoted within their specific vertical in all DroneTv communications — Drone, GIS, or AI.', bullets:['Drone vertical promotion (Brand)','GIS vertical promotion (Brand)','AI vertical promotion (Brand)','Platform Partner designation (Brand)'] },
            ].map(c => <FeatCard key={c.title} {...c} />)}
          </FeatGrid>
        </div>
      </section>
      <GoldRule />

      {/* ── 07 MEDIA ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="07" eyebrow="Media & Video" numColor="text-yellow-400" eyebrowColor="text-white/40"
            title={<span className="text-white">Content Production for Drone, GIS &amp; AI</span>}
            titleColor="text-white" descColor="text-white/55"
            desc="DroneTv produces and publishes all content as part of each subscription package. GIS and AI companies receive exactly the same content production as drone companies — interviews, reels, articles, and magazine placements." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-zinc-800 border-2 border-zinc-800 rounded overflow-hidden">
            {[
              { tag:'Video', tagColor:'bg-red-900/60 text-red-300', title:'Video Interview (5-min)', desc:"CEO, technical lead, or product interviews for Drone, GIS, and AI companies. Published on YouTube and embedded on the company's DroneTv profile.", detail:'Scale: 1 | Brand: 2 | Promoted via social on publish week' },
              { tag:'Video', tagColor:'bg-red-900/60 text-red-300', title:'Short Reel (1-min)', desc:'Product reels, service showcases, or technology demos for all three sectors. Published on Instagram, Facebook, and cross-posted on LinkedIn.', detail:'Scale: 2 reels | Brand: 4 reels | All handles simultaneously' },
              { tag:'Social', tagColor:'bg-blue-900/60 text-blue-300', title:'Promotional Posts', desc:'Company posts published across LinkedIn, Instagram, and Facebook for Drone, GIS, and AI companies. Company tagged, website link included.', detail:'Reach: 2 (one-time) | Scale: 6/yr | Brand: 12/yr' },
              { tag:'Article', tagColor:'bg-green-900/60 text-green-300', title:'Editorial Articles', desc:'600–1000 word articles about the company — Drone technology, GIS methodology, AI solutions — published on DroneTv.in and promoted via social.', detail:'Scale: 1 article | Brand: 3 articles | Promoted on publish day' },
              { tag:'News', tagColor:'bg-green-900/60 text-green-300', title:'DroneTv News Posts', desc:'Short platform news posts for company announcements, product launches, certifications, and milestones — all three sectors.', detail:'Brand: up to 6/year | Company-specific items' },
              { tag:'PR', tagColor:'bg-green-900/60 text-green-300', title:'Press Releases', desc:'Press releases written and published on DroneTv.in for Drone, GIS, and AI company announcements and major news.', detail:'Brand: up to 6/yr | Add-on: ₹3,000 each' },
              { tag:'Social', tagColor:'bg-blue-900/60 text-blue-300', title:'Event Coverage Posts', desc:'Social posts covering product launches, awards, and exhibitions for Brand subscribers across Drone, GIS, and AI sectors.', detail:'Brand package only | Launches, awards, exhibitions' },
              { tag:'Magazine', tagColor:'bg-yellow-900/60 text-yellow-300', title:'Magazine Placements', desc:"Magazine advertisements, editorial articles, and cover page features in DroneTv's quarterly magazine — open to Drone, GIS, and AI companies equally.", detail:'Scale: Half-page x2 | Brand: Full-page x4 + editorial' },
            ].map(({ tag, tagColor, title, desc, detail }) => (
              <div key={title} className="bg-zinc-800 p-5">
                <span className={`inline-block text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded mb-3 ${tagColor}`}>{tag}</span>
                <h4 className="text-[13px] font-bold text-yellow-400 mb-2 leading-snug">{title}</h4>
                <p className="text-[11px] text-white/55 leading-relaxed mb-3">{desc}</p>
                <p className="text-[10.5px] text-white/40 border-t border-white/10 pt-2">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── 08 MAGAZINE ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="08" eyebrow="Magazine" title="DroneTv Magazine — Drone, GIS & AI"
            desc="Quarterly print and digital magazine covering all three sectors. Drone manufacturers, GIS firms, and AI companies all appear in the directory, advertisements, and editorial content." />
          <FeatGrid>
            {[
              { title:'Industry Directory', desc:'Every subscriber appears in the magazine directory categorised as Drone, GIS, or AI — with logo, name, and tagline.', bullets:['Reach: 1 issue — logo, name, category','Scale: all issues — logo and tagline','Brand: all 4 issues — logo and tagline','Drone, GIS, and AI companies represented'] },
              { title:'Magazine Advertisements', desc:'Half-page (Scale) and full-page (Brand) advertisements open to Drone, GIS, and AI companies to reach the full cross-sector readership.', bullets:['Scale: half-page ad in 2 issues','Brand: full-page ad in all 4 issues','Print and digital distribution','Cross-sector Drone, GIS, AI readership'] },
              { title:'Magazine Editorial Article', desc:'A 2–3 page editorial feature about the company — whether a drone OEM, GIS firm, or AI platform — in one selected issue.', bullets:['Brand package only','2–3 pages in one selected issue','Company story, products, and vision','Open to all three sectors'] },
              { title:'Cover Page Feature', desc:'Brand subscribers from any of the three sectors are eligible for the cover page feature, subject to the editorial schedule.', bullets:['Brand package only','Subject to editorial schedule','Drone, GIS, and AI companies eligible','Add-on available: ₹25,000'] },
            ].map(c => <FeatCard key={c.title} {...c} />)}
          </FeatGrid>
        </div>
      </section>
      <GoldRule />

      {/* ── 09 EVENTS ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="09" eyebrow="Events" title="Event Coverage & Media Partnership"
            desc="DroneTv is the official media partner for major Drone, GIS, and AI industry events. All three sectors are covered at events where they exhibit." />
          <FeatGrid>
            {[
              { title:'Drone Expo 2025 Mumbai', desc:'Official media partner. 50+ video interviews produced from Drone, GIS, and AI exhibitor stalls. All content published across DroneTv platforms.', bullets:['50+ stall interviews produced','Drone, GIS, and AI companies covered','Published on YouTube @indiadronetv','Social media coverage across all handles'] },
              { title:'Drone Expo 2026 Bengaluru', desc:'Official media partner (December 2026). Brand subscribers receive expo-specific benefits. All three sectors are covered.', bullets:['Official media partner status','On-ground coverage and stall interviews','Brand: expo stall branding','Brand: Platform Partner designation'] },
              { title:'Coverage by Package Tier', desc:'What each package receives at DroneTv-partnered events. Applies to Drone, GIS, and AI exhibiting companies equally.', bullets:['Reach: digital event media coverage','Scale: digital event media coverage','Brand: stall branding + partner status + media credit','All tiers: content published across all platforms'] },
              { title:'Expo Coverage Add-On', desc:'Any Drone, GIS, or AI company exhibiting at any event can purchase dedicated on-ground DroneTv coverage as an add-on with any package.', bullets:['₹10,000 per event','On-ground interview at stall','Published on YouTube and social media','Available to all package tiers'] },
            ].map(c => <FeatCard key={c.title} {...c} />)}
          </FeatGrid>
        </div>
      </section>
      <GoldRule />

      {/* ── 10 LEADS ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="10" eyebrow="Lead Generation" title="How Lead Notifications Work"
            desc="Every buyer searching for a Drone product, GIS service, or AI platform who submits an enquiry on DroneTv.in is routed to the relevant company. Leads must be viewed by logging into the platform — they are not forwarded directly to email." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border-2 border-gray-200 rounded overflow-hidden mb-8">
            {[
              ['1','Buyer Searches','A buyer visits DroneTv.in and searches within the Drone, GIS, or AI sector categories for a product or service.'],
              ['2','Buyer Submits Enquiry',"The buyer finds the company's profile and submits a requirement through the dedicated B2B enquiry form."],
              ['3','Company Gets Notified','The company receives an email notification that a new enquiry has arrived. Applies to all three sectors equally.'],
              ['4','Company Views Lead','The company logs into DroneTv to view the full enquiry. Brand tier companies see full buyer contact data on the platform.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="bg-white p-5 text-center">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-yellow-400 flex items-center justify-center text-sm font-extrabold mx-auto mb-3">{num}</div>
                <h4 className="text-[12px] font-bold text-gray-900 mb-2">{title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 border-2 border-gray-200 rounded overflow-hidden">
            {[
              { badge:<Chip label="Reach" color="bg-zinc-900 text-yellow-400" />, title:'Notification Only', bullets:['Email notification on new enquiry','Login to platform to view details','Drone, GIS, and AI companies covered'] },
              { badge:<Chip label="Scale" color="bg-zinc-900 text-yellow-400" />, title:'Notification + Monthly Report', bullets:['Email notification on new enquiry','Login to view full details','Monthly enquiry count and profile views','All three sectors covered'] },
              { badge:<Chip label="Brand" color="bg-red-700 text-white" />, title:'Full Buyer Data + Analytics', bullets:['Email notification on new enquiry','Full buyer name, company, email, phone on platform','Monthly analytics across all sectors','Listing performance data'] },
            ].map(c => <FeatCard key={c.title} {...c} desc="" />)}
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── 11 PACKAGES ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="11" eyebrow="Promotional Packages" title="Annual Subscription Plans — Drone, GIS & AI"
            desc="All three packages are fully available to Drone, GIS, and AI companies. All prices are exclusive of GST. 100% advance. 12-month subscription from profile go-live. Non-refundable. 2-week delivery SLA. 2 revision rounds." />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 border-2 border-gray-200 rounded overflow-hidden mb-8">
            {/* Reach */}
            <div className="bg-white p-6">
              <span className="inline-block text-[9px] font-bold tracking-widest uppercase bg-yellow-400 text-black px-2 py-1 rounded mb-3">Starter</span>
              <div className="text-xl font-extrabold text-gray-900 mb-1">Reach</div>
              <div className="text-2xl font-extrabold text-gray-900 mb-0.5">₹25,000</div>
              <div className="text-[10px] text-gray-400 mb-3">per year + GST | Drone · GIS · AI</div>
              <p className="text-[11.5px] text-gray-500 mb-4 pb-3 border-b border-gray-100">For Drone, GIS, or AI companies establishing their first digital presence on the platform.</p>
              <ul className="space-y-2">
                {['Verified company profile (Drone / GIS / AI)','Single-page website (basic)','Up to 10 product / service listings','B2B enquiry form','Lead notification email','2 social media posts (one-time)','Magazine directory listing (1 issue)'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11.5px] text-gray-700 border-b border-gray-50 pb-2">
                    <span className="text-yellow-500 font-bold flex-shrink-0">✓</span>{item}
                  </li>
                ))}
                {['Featured placement','Video interview or reel','Magazine advertisement','Monthly report'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11.5px] text-gray-300 border-b border-gray-50 pb-2">
                    <span className="font-bold flex-shrink-0">✗</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 bg-gray-50 rounded p-3 text-[11px] font-semibold text-gray-700">Market value ~₹54,000 | Save ₹29,000+</div>
            </div>

            {/* Scale — featured */}
            <div className="bg-zinc-900 text-white p-6">
              <span className="inline-block text-[9px] font-bold tracking-widest uppercase bg-red-600 text-white px-2 py-1 rounded mb-3">Best Value</span>
              <div className="text-xl font-extrabold text-yellow-400 mb-1">Scale</div>
              <div className="text-2xl font-extrabold text-white mb-0.5">₹75,000</div>
              <div className="text-[10px] text-white/40 mb-3">per year + GST | Drone · GIS · AI</div>
              <p className="text-[11.5px] text-white/55 mb-4 pb-3 border-b border-white/10">Year-round brand presence with video, social, content, and magazine. Best value for established companies in any of the three sectors.</p>
              <ul className="space-y-2">
                {['Featured profile + Featured Supplier badge','Enhanced website (gallery, services, lead form)','Up to 25 listings','Featured category placement — 3 months','Monthly lead summary report','6 social media posts per year','2 short reels (1-min each)','1 video interview (YouTube + embedded)','1 editorial article on DroneTv.in','Half-page magazine ad x 2 issues'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11.5px] text-white/80 border-b border-white/7 pb-2">
                    <span className="text-yellow-400 font-bold flex-shrink-0">✓</span>{item}
                  </li>
                ))}
                {['Homepage feature / priority ranking','Full buyer contact details'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11.5px] text-white/20 border-b border-white/7 pb-2">
                    <span className="font-bold flex-shrink-0">✗</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 bg-yellow-400/10 rounded p-3 text-[11px] font-semibold text-yellow-400">Market value ~₹1,55,000 | Save ₹80,000+</div>
            </div>

            {/* Brand */}
            <div className="bg-white p-6">
              <span className="inline-block text-[9px] font-bold tracking-widest uppercase bg-red-600 text-white px-2 py-1 rounded mb-3">Premium</span>
              <div className="text-xl font-extrabold text-gray-900 mb-1">Brand</div>
              <div className="text-2xl font-extrabold text-gray-900 mb-0.5">₹1,50,000</div>
              <div className="text-[10px] text-gray-400 mb-3">per year + GST | Drone · GIS · AI</div>
              <p className="text-[11.5px] text-gray-500 mb-4 pb-3 border-b border-gray-100">Complete industry authority for category leaders in Drone, GIS, or AI — marketplace, media, magazine, expo, and full buyer data.</p>
              <ul className="space-y-2">
                {['Premium profile + Industry Partner badge','Full website — premium layout, custom banner','Unlimited listings','Homepage + category feature — quarterly','Priority search ranking in sector','Full buyer contact details on platform','12 posts + 4 reels + 2 interviews','3 articles + 6 news + 6 press releases','Full-page magazine ad x 4 issues','Magazine editorial article (2–3 pages)','Cover page eligibility','Expo stall branding + Platform Partner status','Industry vertical promotion (Drone / GIS / AI)'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[11.5px] text-gray-700 border-b border-gray-50 pb-2">
                    <span className="text-yellow-500 font-bold flex-shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 bg-gray-50 rounded p-3 text-[11px] font-semibold text-gray-700">Market value ~₹4,35,000 | Save ₹2,85,000+</div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mb-2">
            <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-gray-400 mb-1">Full Matrix</div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Package Feature Comparison — All Sectors</h3>
          </div>
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="w-full text-xs border-collapse min-w-[500px]">
              <thead>
                <tr>
                  <th className="bg-zinc-900 text-yellow-400 font-bold py-3 px-3 text-left text-[10.5px] tracking-wider min-w-[180px]">Feature</th>
                  {['Reach','Scale','Brand'].map(h => <th key={h} className="bg-zinc-900 text-yellow-400 font-bold py-3 px-3 text-center text-[10.5px] tracking-wider">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  { cat:'Marketplace & Website — Drone · GIS · AI', rows:[
                    ['Company Profile (all three sectors)','Verified','Featured','Premium'],
                    ['Single Page Website','Basic','Enhanced','Full Premium'],
                    ['Product / Service Listings','Up to 10','Up to 25','Unlimited'],
                    ['B2B Enquiry Form',true,true,true],
                    ['Featured Category Placement',false,'3 Months','Quarterly'],
                    ['Homepage Feature',false,false,true],
                    ['Priority Search Ranking',false,false,true],
                    ['Industry Vertical Promotion',false,false,true],
                  ]},
                  { cat:'Lead Notifications — All Sectors', rows:[
                    ['Lead Notification Email',true,true,true],
                    ['View Leads on Platform',true,true,true],
                    ['Monthly Lead Summary Report',false,true,true],
                    ['Full Buyer Details on Platform',false,false,true],
                    ['Monthly Analytics Report',false,true,true],
                  ]},
                  { cat:'Social Media & Video — All Sectors', rows:[
                    ['Promotional Posts / Year','2 (one-time)','6 Posts','12 Posts'],
                    ['Short Reels (1-min)',false,'2 Reels','4 Reels'],
                    ['Video Interviews (YouTube)',false,'1 Interview','2 Interviews'],
                    ['Event Coverage Posts',false,false,true],
                  ]},
                  { cat:'Content & Magazine — All Sectors', rows:[
                    ['Editorial Articles on Site',false,'1 Article','3 Articles'],
                    ['DroneTv News / Year',false,false,'Up to 6'],
                    ['Press Releases / Year',false,false,'Up to 6'],
                    ['Magazine Advertisement','Dir. Listing','Half-Page x2','Full-Page x4'],
                    ['Magazine Editorial Article',false,false,'1 (2-3 Pages)'],
                    ['Cover Page Eligibility',false,false,true],
                  ]},
                  { cat:'Industry & Expo — All Sectors', rows:[
                    ['Expo Digital Coverage',true,true,true],
                    ['Expo Stall Branding',false,false,true],
                    ['Platform Partner Designation',false,false,true],
                  ]},
                  { cat:'Market Value', rows:[
                    ['Approx. Market Rate (Separately)','~₹54,000','~₹1,55,000','~₹4,35,000'],
                    ['DroneTv Price','₹25,000','₹75,000','₹1,50,000'],
                    ['You Save','₹29,000+','₹80,000+','₹2,85,000+'],
                  ]},
                ].map(({ cat, rows }) => (
                  <React.Fragment key={cat}>
                    <tr><td colSpan={4} className="bg-gray-100 text-gray-500 font-bold text-[10px] tracking-widest uppercase py-2 px-3">{cat}</td></tr>
                    {rows.map(([label, r, s, b], ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-3 text-gray-700 font-medium border-b border-gray-100 text-left">{label}</td>
                        {[r, s, b].map((val, ci) => (
                          <td key={ci} className="py-2 px-3 text-center border-b border-gray-100">
                            {val === true ? <span className="text-green-700 font-bold">Yes</span>
                              : val === false ? <span className="text-gray-200 font-bold">—</span>
                              : <span className="text-gray-900 font-semibold">{val}</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── 12 ADD-ONS ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="12" eyebrow="Add-On Services" title="14 Add-Ons — Available to All Three Sectors"
            desc="All add-ons are available to Drone, GIS, and AI companies with any package at any time. All prices exclusive of GST." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200 border-2 border-gray-200 rounded overflow-hidden">
            {[
              ['Special Interview','₹12,000'],['Factory / Office Video','₹10,000'],['Product Demo Video','₹8,000'],['Aerial Reel','₹12,000'],
              ['Case Study Video','₹15,000'],['Homepage Banner','₹5,000 / mo'],['WhatsApp Campaign','₹4,000'],['Email Campaign','₹3,500'],
              ['Category Sponsor','₹4,500 / mo'],['Cover Page','₹25,000'],['Press Release','₹3,000'],['Case Study Article','₹5,000'],
              ['Expo Coverage','₹10,000'],['Webinar','₹7,000'],
            ].map(([name, price]) => (
              <div key={name} className="bg-white px-4 py-3.5 flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold text-gray-700">{name}</span>
                <span className="text-[11.5px] font-bold text-red-600 whitespace-nowrap">{price}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-gray-50 border-l-4 border-yellow-400 px-4 py-3 text-xs text-gray-500 leading-relaxed rounded-r">
            Custom packages for <strong className="text-gray-900">OEMs, GIS organisations, AI enterprises, and government entities</strong> are available on request. Contact bd@dronetv.in or call +91 7520123555.
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── 13 VERTICALS ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="13" eyebrow="Industry Verticals" title="All Verticals — Drone, GIS & AI"
            desc="Every company is listed under its correct sector and vertical, making discovery accurate for buyers searching within Drone, GIS, or AI categories." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { hBg:'bg-zinc-900', hText:'text-yellow-400', label:'Drone Industry Verticals', items:[
                ['Agriculture','Crop spraying, seeding, monitoring, and field mapping drones'],
                ['Survey & Mapping','Aerial photogrammetry and topographic survey services'],
                ['Defence & Security','Surveillance, border patrol, counter-drone applications'],
                ['Training & Education','DGCA-approved pilot training institutes and labs'],
                ['Inspection','Tower, pipeline, building, and infrastructure inspection'],
                ['Logistics & Delivery','Last-mile logistics and cargo drone companies'],
                ['Manufacturers & OEMs','Fixed-wing, multi-rotor, VTOL, and hybrid UAV makers'],
                ['Media & Filmmaking','Aerial cinematography and creative drone services'],
              ]},
              { hBg:'bg-[#1A5FA8]', hText:'text-white', label:'GIS Industry Verticals', items:[
                ['Photogrammetry','2D orthophoto, 3D model, and point cloud generation'],
                ['LiDAR Services','Aerial scanning, terrain modelling, vegetation analysis'],
                ['Remote Sensing','Satellite imagery, multispectral, hyperspectral data'],
                ['GIS Software','GIS platforms, point cloud tools, processing software'],
                ['Land Survey','Cadastral surveying and boundary delineation'],
                ['Urban & Infrastructure GIS','Smart city, utility mapping, asset management'],
                ['Environmental Monitoring','Forest mapping, wetland, and land-use change analysis'],
                ['GIS Training','QGIS, ArcGIS, photogrammetry certification programs'],
              ]},
              { hBg:'bg-[#1A7A3C]', hText:'text-white', label:'AI Industry Verticals', items:[
                ['Drone Data Analytics','AI processing of drone imagery for agriculture and infrastructure'],
                ['Computer Vision','Object detection, segmentation, and counting for UAV imagery'],
                ['Autonomous Systems','AI flight planning, obstacle avoidance, mission automation'],
                ['Precision Agriculture AI','NDVI, crop health, pest detection, yield prediction'],
                ['Infrastructure Inspection AI','Automated damage detection and defect classification'],
                ['Geospatial AI','ML for land use mapping and satellite image processing'],
                ['AI Payloads','Onboard AI inference and intelligent sensor systems'],
                ['AI Platform Providers','Cloud drone analytics APIs and SaaS data pipelines'],
              ]},
            ].map(({ hBg, hText, label, items }) => (
              <div key={label}>
                <div className={`${hBg} ${hText} text-[11.5px] font-bold tracking-widest uppercase px-4 py-2.5 rounded-t`}>{label}</div>
                <div className="flex flex-col gap-px">
                  {items.map(([title, desc]) => (
                    <div key={title} className="bg-white border border-gray-200 px-4 py-3">
                      <h4 className="text-[12px] font-bold text-gray-900 mb-0.5">{title}</h4>
                      <p className="text-[11px] text-gray-500 leading-snug">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── 14 AUDIENCE ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="14" eyebrow="Target Audience" title="Who DroneTv.in is For"
            desc="DroneTv.in serves every stakeholder in the Drone, GIS, and AI technology ecosystem — from manufacturers and service providers to professionals, students, government bodies, and investors." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200 border-2 border-gray-200 rounded overflow-hidden">
            {[
              { badge:'Drone', badgeColor:'bg-zinc-900 text-yellow-400', title:'Drone Manufacturers', desc:'OEMs showcasing hardware and systems to qualified buyers across India.' },
              { badge:'Drone', badgeColor:'bg-zinc-900 text-yellow-400', title:'Drone Service Providers', desc:'Agriculture, inspection, survey, and logistics companies generating B2B leads.' },
              { badge:'Drone', badgeColor:'bg-zinc-900 text-yellow-400', title:'Training Institutes', desc:'DGCA-approved institutes promoting pilot courses to students.' },
              { badge:'Drone', badgeColor:'bg-zinc-900 text-yellow-400', title:'Parts & Components', desc:'Propulsion, battery, frame, and payload suppliers reaching drone OEMs.' },
              { badge:'GIS', badgeColor:'bg-blue-100 text-[#1A5FA8]', title:'Survey & Mapping Firms', desc:'Photogrammetry, LiDAR, and aerial survey companies reaching infrastructure clients.' },
              { badge:'GIS', badgeColor:'bg-blue-100 text-[#1A5FA8]', title:'GIS Software Companies', desc:'Geospatial platform and processing tool vendors reaching professionals and enterprises.' },
              { badge:'GIS', badgeColor:'bg-blue-100 text-[#1A5FA8]', title:'Remote Sensing Specialists', desc:'Satellite and multispectral data companies reaching agriculture and environment clients.' },
              { badge:'GIS', badgeColor:'bg-blue-100 text-[#1A5FA8]', title:'GIS Consultancies', desc:'Urban planning and infrastructure GIS firms reaching government and developers.' },
              { badge:'AI', badgeColor:'bg-green-100 text-[#1A7A3C]', title:'AI Analytics Companies', desc:'Drone data analytics platforms reaching operators and manufacturers.' },
              { badge:'AI', badgeColor:'bg-green-100 text-[#1A7A3C]', title:'Computer Vision Firms', desc:'Object detection companies reaching drone OEMs and service providers.' },
              { badge:'AI', badgeColor:'bg-green-100 text-[#1A7A3C]', title:'Autonomous Systems', desc:'AI flight and mission automation companies reaching manufacturers.' },
              { badge:'AI', badgeColor:'bg-green-100 text-[#1A7A3C]', title:'Geospatial AI Platforms', desc:'ML companies for satellite and drone imagery reaching GIS firms and government.' },
              { badge:'All Sectors', badgeColor:'bg-gray-100 text-gray-500', title:'Students & Job Seekers', desc:'Students from Drone, GIS, and AI discovering training and career paths.' },
              { badge:'All Sectors', badgeColor:'bg-gray-100 text-gray-500', title:'Government Bodies', desc:'Accessing Drone, GIS, and AI technology and communicating requirements.' },
              { badge:'All Sectors', badgeColor:'bg-gray-100 text-gray-500', title:'Investors & Researchers', desc:'Tracking the Drone, GIS, and AI ecosystem through media and directory.' },
              { badge:'All Sectors', badgeColor:'bg-gray-100 text-gray-500', title:'Startups & Innovators', desc:'Getting cross-sector exposure without high advertising costs.' },
            ].map(({ badge, badgeColor, title, desc }) => (
              <div key={title} className="bg-white p-4">
                <span className={`inline-block text-[9px] font-bold px-2.5 py-1 rounded-full mb-2 tracking-wider ${badgeColor}`}>{badge}</span>
                <h4 className="text-[12.5px] font-bold text-gray-900 mb-1">{title}</h4>
                <p className="text-[11px] text-gray-500 leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── 15 SOCIAL CHANNELS ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHead num="15" eyebrow="Social Channels" title="DroneTv Distribution Network"
            desc="All content — whether for a Drone, GIS, or AI company — is published simultaneously across every major platform. Company tagged and website link included in every post." />
          <div className="flex flex-wrap gap-px bg-gray-200 border-2 border-gray-200 rounded overflow-hidden">
            {[
              ['YouTube','@indiadronetv','Interviews, reels, event coverage for all three sectors. Permanently embedded on company profiles.'],
              ['LinkedIn','dronetv.in','Posts, articles, video cross-posts for Drone, GIS, and AI companies.'],
              ['Instagram','@dronetv.in','Reels and promotional posts across all three sectors.'],
              ['Facebook','@dronetv.in','Reels, posts, event coverage for Drone, GIS, and AI.'],
              ['X (Twitter)','@indiadronetv','News and updates across all three sectors.'],
              ['WhatsApp','+91 7520123555','Direct enquiries from Drone, GIS, and AI companies.'],
            ].map(([platform, handle, note]) => (
              <div key={platform} className="bg-white p-4 sm:p-5 text-center flex-1 min-w-[150px]">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{platform}</div>
                <div className="text-[12.5px] font-bold text-gray-900 mb-1.5">{handle}</div>
                <div className="text-[10.5px] text-gray-500 leading-snug">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <GoldRule />

      {/* ── CTA ── */}
      <section className="bg-yellow-400 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black leading-tight tracking-tight mb-2">
              Reach Buyers in Drone, GIS &amp; AI — All in One Platform
            </h2>
            <p className="text-sm text-black/65">
              A dedicated audience from all three sectors. No generic traffic. Drone manufacturers, GIS firms, AI companies — and the buyers who need them — all in one place. Go live in 2 weeks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <a href="mailto:bd@dronetv.in" className="bg-black text-yellow-400 px-5 py-3 rounded font-semibold text-sm text-center hover:bg-zinc-800 transition whitespace-nowrap">bd@dronetv.in</a>
            <a href="tel:+917520123555" className="bg-black text-yellow-400 px-5 py-3 rounded font-semibold text-sm text-center hover:bg-zinc-800 transition whitespace-nowrap">+91 7520123555</a>
            <button onClick={() => navigate('/form')} className="border-2 border-black text-black px-5 py-3 rounded font-semibold text-sm text-center hover:bg-black/10 transition whitespace-nowrap">Join DroneTv.in →</button>
          </div>
        </div>
      </section>

      {/* ── Footer strip ── */}
      <div className="bg-zinc-950 text-white/45 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
          <div><strong className="text-yellow-400">Drone Academy Private Limited</strong> | 5A/6B White Waters, Timberlake Colony, Shaikpet, Hyderabad — 500008</div>
          <div className="whitespace-nowrap">www.dronetv.in | bd@dronetv.in | +91 7520123555 &nbsp; <strong className="text-yellow-400">© 2024 Drone TV</strong></div>
        </div>
      </div>

    </div>
  );
}
