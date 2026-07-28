import { FileText, Download, Play, Award, BookOpen, Briefcase, Palette, Shield } from "lucide-react";

const DOC_LABELS: Record<string, { label: string; icon: React.ReactNode; type: "pdf" | "image" | "video" }> = {
  brochure:         { label: "Company Brochure",        icon: <BookOpen size={20} />,  type: "pdf"   },
  catalogue:        { label: "Product Catalogue",       icon: <Briefcase size={20} />, type: "pdf"   },
  caseStudies:      { label: "Case Studies",            icon: <FileText size={20} />,  type: "pdf"   },
  brandGuidelines:  { label: "Brand Guidelines",        icon: <Palette size={20} />,   type: "pdf"   },
  dgcaCertificate:  { label: "DGCA Type Certificate",   icon: <Shield size={20} />,    type: "image" },
  rptoCertificate:  { label: "RPTO Authorisation",      icon: <Award size={20} />,     type: "image" },
  promoVideo5min:   { label: "Company Video (5 min)",   icon: <Play size={20} />,      type: "video" },
  promoVideo1min:   { label: "Company Video (1 min)",   icon: <Play size={20} />,      type: "video" },
};

export default function Documents({ documents }: { documents?: Record<string, string> }) {
  if (!documents) return null;
  const entries = Object.entries(documents).filter(([, url]) => !!url);
  if (entries.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Documents & Downloads</h2>
          <p className="text-gray-500 mt-2">Certificates, brochures, and company resources</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {entries.map(([key, url]) => {
            const meta = DOC_LABELS[key] || { label: key, icon: <FileText size={20} />, type: "pdf" };
            const isImage = meta.type === "image";
            const isVideo = meta.type === "video";

            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-yellow-400"
              >
                {isImage ? (
                  <div className="h-36 overflow-hidden bg-gray-100">
                    <img src={url} alt={meta.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                  </div>
                ) : isVideo ? (
                  <div className="h-36 bg-gray-900 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Play size={20} className="text-white ml-1" />
                    </div>
                  </div>
                ) : (
                  <div className="h-36 bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
                    <div className="text-yellow-500 opacity-60">{meta.icon}</div>
                    <FileText size={48} className="text-yellow-400 ml-2" />
                  </div>
                )}
                <div className="p-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-800 leading-tight">{meta.label}</span>
                  <Download size={14} className="text-gray-400 group-hover:text-yellow-500 flex-shrink-0 transition-colors" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
