import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Stethoscope, Mail } from "lucide-react";
import CompactHero from "./common/CompactHero";

interface FAQ {
  q: string;
  a: React.ReactNode;
}

interface FAQGroup {
  heading: string;
  items: FAQ[];
}

const FAQ_GROUPS: FAQGroup[] = [
  {
    heading: "About DroneTv.in",
    items: [
      {
        q: "What is DroneTv.in?",
        a: "DroneTv.in is India's drone, GIS and AI industry platform — a directory of verified companies, a marketplace for products and services, an events calendar, and a professionals network, all in one place.",
      },
      {
        q: "Who is the platform for?",
        a: "Drone and GIS manufacturers, solution providers, service companies, certified pilots and other professionals, event organizers, and buyers looking to discover and connect with the industry.",
      },
    ],
  },
  {
    heading: "Listing Your Company",
    items: [
      {
        q: "How do I list my company on DroneTv.in?",
        a: "Sign up and complete your company profile from your company dashboard — business details, products/services, team, and media. Once submitted, it goes through our verification flow before it appears in the public directory.",
      },
      {
        q: "What does the green \"Verified\" badge mean, and how do I get it?",
        a: "Verified means we've confirmed your company's real GST/registration details. After your company passes verification, a ₹499 one-time payment activates the Verified badge on your public listing.",
      },
      {
        q: "What are the Silver, Gold and Platinum badges?",
        a: "These are separate paid brand packages (not part of the ₹499 Verified fee) that increase your listing's visibility — a premium tier ribbon on your card, higher placement in search and category pages, and extra profile features. You can view current plans and pricing on the Advertising Plans page.",
      },
      {
        q: "Can I edit my listing after it's published?",
        a: "Yes — log in to your company portal any time to update your profile, products, services, gallery, and team details. Changes to your public listing reflect immediately.",
      },
    ],
  },
  {
    heading: "Buyers, RFQs & Enquiries",
    items: [
      {
        q: "I'm looking to buy drones/services — how do I contact a company?",
        a: "Every company card has an \"Enquire Now\" button that sends your request straight to that company. You can also browse Products and Services for specific catalog items.",
      },
      {
        q: "Can I request quotes from multiple companies at once?",
        a: "Yes — use Request for Quote (RFQ) to post your requirement once; matching sellers on the platform can respond directly with quotes.",
      },
    ],
  },
  {
    heading: "Professionals & Training",
    items: [
      {
        q: "I'm a certified drone pilot — can I create a profile?",
        a: "Yes — the Professionals section lets certified pilots and industry professionals list themselves in the Pilot Directory, apply through the Job Board, and browse Training and Certification listings.",
      },
      {
        q: "How do I list my RPTO (training organization)?",
        a: "Use the \"list-rpto\" option from the Contact page — send us your RPTO name, DGCA approval number, and location, and our team will follow up to verify your DGCA certificate before listing you under Training.",
      },
    ],
  },
  {
    heading: "Advertising & Partnerships",
    items: [
      {
        q: "How can my company get more visibility on DroneTv.in?",
        a: (
          <>
            Check our{" "}
            <Link to="/advertising-plans" className="text-ink-link font-semibold hover:underline">
              Advertising Plans
            </Link>{" "}
            for brand packages, homepage placements, and sponsored listings.
          </>
        ),
      },
      {
        q: "I want to partner with DroneTv.in — who do I talk to?",
        a: (
          <>
            Head to Partnerships from the main menu to see partnership categories, or reach our business development team directly at{" "}
            <a href="mailto:bd@dronetv.in" className="text-ink-link font-semibold hover:underline">bd@dronetv.in</a>.
          </>
        ),
      },
    ],
  },
  {
    heading: "Support",
    items: [
      {
        q: "Something on the site isn't working — what do I do?",
        a: (
          <>
            Use{" "}
            <Link to="/contact?topic=report-issue" className="text-ink-link font-semibold hover:underline">
              Report an Issue / Feedback
            </Link>{" "}
            from the Contact menu and describe what happened — we look into every report.
          </>
        ),
      },
      {
        q: "I have a drone-related technical question, not a platform bug.",
        a: "That's exactly what Drone Doctor / Help Center is for — troubleshooting help and guidance on real drone issues, separate from platform support.",
      },
    ],
  },
];

const FAQPage = () => {
  const [openKey, setOpenKey] = useState<string | null>("0-0");

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>Frequently Asked <span>Questions</span></>}
        stats={[
          { n: FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0), l: "Questions" },
          { n: FAQ_GROUPS.length, l: "Topics" },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-16">
        {FAQ_GROUPS.map((group, gi) => (
          <div key={group.heading} className="mb-8 last:mb-0">
            <h2 className="text-sm font-bold text-ink-caption uppercase tracking-wide mb-3">{group.heading}</h2>
            <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm divide-y divide-ink-light overflow-hidden">
              {group.items.map((item, ii) => {
                const key = `${gi}-${ii}`;
                const isOpen = openKey === key;
                return (
                  <div key={key}>
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 text-left px-6 py-4 hover:bg-ink/5 transition-colors"
                    >
                      <span className="text-sm font-semibold text-ink">{item.q}</span>
                      <ChevronDown className={`h-4 w-4 text-ink-caption flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-sm text-ink-paragraph leading-relaxed">{item.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <Link
          to="/contact"
          className="group flex items-center gap-4 bg-surface-card rounded-xl border border-ink-light shadow-sm p-6 hover:border-brand-yellow transition-all mt-2"
        >
          <div className="bg-brand-yellow rounded-full p-3 flex-shrink-0">
            <Mail className="h-5 w-5 text-ink" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-ink">Still have a question?</h3>
            <p className="text-sm text-ink-caption mt-0.5">Reach our team directly — we usually respond within 24 hours.</p>
          </div>
        </Link>

        <Link
          to="/media/drone-doctor"
          className="group flex items-center gap-4 bg-surface-card rounded-xl border border-ink-light shadow-sm p-6 hover:border-brand-yellow transition-all mt-4"
        >
          <div className="bg-brand-yellow rounded-full p-3 flex-shrink-0">
            <Stethoscope className="h-5 w-5 text-ink" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-ink">Drone Doctor Help Line</h3>
            <p className="text-sm text-ink-caption mt-0.5">Troubleshooting help and guidance for real drone issues — technical support, compliance, maintenance.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FAQPage;
