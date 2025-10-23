import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../../context/context";
import { useParams } from "react-router-dom";

interface Lead {
  leadId: string;
  company: string;
  category: string;
  subject: string;
  email: string;
  phone: string;
  viewed: boolean;
}

const LeadsPage: React.FC = () => {
  const { user } = useUserAuth();
  const userId = user?.userData.email;
  const companyName = useParams().companyName || "";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); // ✅ start as true
  

  // ✅ Fetch user tokens
  const fetchUserTokens = async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/profile?userId=${userId}`
      );
      const data = await res.json();
      setTotalTokens(data.profile.tokenBalance || 0);
    } catch (error) {
      console.error("Error fetching user tokens:", error);
    }
  };

  // ✅ Fetch leads
  const fetchLeads = async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/leads?userId=${userId}&mode=all&limit=20&offset=0&filter=all`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        const formattedLeads = data.leads.map((lead: any) => ({
          leadId: lead.leadId,
          company: lead.company,
          category: lead.category,
          subject: lead.subject,
          email: lead.email,
          phone: lead.phone,
          viewed: lead.viewed,
        }));
        setLeads(formattedLeads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // ✅ Fetch both in parallel
  useEffect(() => {
    const fetchAll = async () => {
      if (!userId) return;
      setLoading(true);
      await Promise.all([fetchUserTokens(), fetchLeads()]);
      setLoading(false);
    };
    fetchAll();
  }, [userId]);

  // ✅ Handle view button
  const handleViewClick = async (leadId: string) => {
    if (totalTokens < 10) {
      setShowTokenModal(true);
      return;
    }

    try {
      const res = await fetch(
        "https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/leads/view",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, leadId }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.leadId === leadId ? { ...lead, viewed: true } : lead
          )
        );
        // Optional: update tokens count after viewing
        fetchUserTokens();
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error viewing lead:", error);
    }
  };

  const closeTokenModal = () => setShowTokenModal(false);

  // ✅ Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "All" || lead.subject === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(leads.map((lead) => lead.subject))];

  // ✅ Show full-page loader
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent"></div>
        <p className="mt-4 text-amber-800 font-semibold text-lg">
          Loading your data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900">
              {companyName}
            </h1>
            <h2 className="text-xl font-semibold text-amber-800 mt-1">
              Leads Management
            </h2>
          </div>
          <div className="mt-4 sm:mt-0 bg-amber-500 rounded-xl px-6 py-3 shadow-md">
            <div className="flex items-center">
              <i className="fas fa-coins text-white text-xl mr-2"></i>
              <span className="text-white font-bold text-lg">
                Tokens: {totalTokens}
              </span>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64 mb-3 sm:mb-0">
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2.5 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-amber-500"></i>
          </div>

          <select
            className="px-4 py-2.5 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-100">
              <thead className="bg-amber-500">
                <tr>
                  {["Company", "Email", "Phone", "Subject", "Action"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.leadId}
                      className="hover:bg-amber-50 transition-colors"
                    >
                      <td
                        className={`px-6 py-4 text-sm font-medium text-amber-900 ${
                          lead.viewed ? "" : "blur-sm select-none"
                        }`}
                      >
                        {lead.company}
                      </td>

                      <td
                        className={`px-6 py-4 text-sm text-amber-800 ${
                          lead.viewed ? "" : "blur-sm select-none"
                        }`}
                      >
                        {lead.email}
                      </td>

                      <td
                        className={`px-6 py-4 text-sm text-amber-800 ${
                          lead.viewed ? "" : "blur-sm select-none"
                        }`}
                      >
                        {lead.phone}
                      </td>

                      <td className="px-6 py-4 text-sm text-amber-800">
                        {lead.subject}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.viewed ? (
                          <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm">
                            Viewed
                          </button>
                        ) : (
                          <button
                            onClick={() => handleViewClick(lead.leadId)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm flex items-center"
                          >
                            <i className="fas fa-eye mr-2"></i> View (10 tokens)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-amber-700"
                    >
                      No leads found...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 rounded-full p-3">
                <i className="fas fa-exclamation-triangle text-amber-600 text-2xl"></i>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-amber-900 mb-2">
              Insufficient Tokens
            </h3>
            <p className="text-amber-700 text-center mb-6">
              You need at least 10 tokens to view lead details. Current balance:{" "}
              <span className="font-bold">{totalTokens}</span>
            </p>
            <div className="flex space-x-3">
              <button
                onClick={closeTokenModal}
                className="flex-1 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 bg-amber-500 text-white rounded-lg">
                Buy Tokens
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;