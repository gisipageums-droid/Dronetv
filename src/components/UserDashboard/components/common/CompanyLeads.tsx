import React, { useState } from 'react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  isViewed: boolean;
}

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "Sarah Johnson", email: "sarah.j@example.com", phone: "+1 (555) 123-4567", category: "Enterprise", isViewed: false },
    { id: "2", name: "Michael Chen", email: "m.chen@techcorp.com", phone: "+1 (555) 987-6543", category: "Startup", isViewed: false },
    { id: "3", name: "Emma Rodriguez", email: "e.rodriguez@designco.com", phone: "+1 (555) 456-7890", category: "SMB", isViewed: false },
    { id: "4", name: "David Kim", email: "d.kim@innovate.io", phone: "+1 (555) 234-5678", category: "Enterprise", isViewed: false },
    { id: "5", name: "Olivia Patel", email: "o.patel@healthplus.org", phone: "+1 (555) 876-5432", category: "Non-Profit", isViewed: false },
    { id: "6", name: "James Wilson", email: "j.wilson@retailgroup.com", phone: "+1 (555) 345-6789", category: "SMB", isViewed: false },
  ]);

  const [totalTokens, setTotalTokens] = useState(250);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [viewingLeadId, setViewingLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    
    const matchesCategory = selectedCategory === "All" || lead.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["All", ...new Set(leads.map(lead => lead.category))];

  // Handle view click
  const handleViewClick = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead?.isViewed && totalTokens >= 10) {
      // Deduct tokens and reveal details
      setTotalTokens(prev => prev - 10);
      setLeads(prev => 
        prev.map(lead => 
          lead.id === leadId ? {...lead, isViewed: true} : lead
        )
      );
      setViewingLeadId(leadId);
    } else if (totalTokens < 10) {
      setShowTokenModal(true);
    }
  };

  // Close token modal
  const closeTokenModal = () => {
    setShowTokenModal(false);
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Token Balance */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900">Acme Corporation</h1>
            <h2 className="text-xl font-semibold text-amber-800 mt-1">Leads Management</h2>
          </div>
          <div className="mt-4 sm:mt-0 bg-amber-500  rounded-xl px-6 py-3 shadow-md">
            <div className="flex items-center">
              <i className="fas fa-coins text-white text-xl mr-2"></i>
              <span className="text-white font-bold text-lg">Tokens: {totalTokens}</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64 mb-3 sm:mb-0">
            <input
              type="text"
              placeholder="Search leads..."
              className=" cursor-pointer pl-10 pr-4 py-2.5 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-amber-500"></i>
          </div>
          <select
            className=" cursor-pointer px-4 py-2.5 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-100">
              <thead className="bg-amber-500 ">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-amber-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-amber-900">
                          {lead.isViewed ? lead.name : (
                            <span className="blur-sm select-none">••••••••••</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-amber-800">
                          {lead.isViewed ? lead.email : (
                            <span className="blur-sm select-none">••••••••••••••••</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-amber-800">
                          {lead.isViewed ? lead.phone : (
                            <span className="blur-sm select-none">••••••••••••</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                          {lead.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.isViewed ? (
                          <button className=" cursor-pointer px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all duration-300">
                            Viewed
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleViewClick(lead.id)}
                            className=" cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                          >
                            <i className="fas fa-eye mr-2"></i>
                            View (10 tokens)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="text-amber-800 text-lg font-medium">
                        No leads found
                      </div>
                      <div className="mt-2 text-amber-600">
                        Try adjusting your search or filter criteria
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="px-6 py-4 bg-amber-50 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-amber-700 mb-2 sm:mb-0">
              Showing <span className="font-medium">{filteredLeads.length}</span> of <span className="font-medium">{leads.length}</span> leads
            </div>
            <div className="flex space-x-2">
              <button className=" cursor-pointer px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors">
                Previous
              </button>
              <button className=" cursor-pointer px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Token Insufficient Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-amber-100 rounded-full p-3">
                  <i className="fas fa-exclamation-triangle text-amber-600 text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-amber-900 mb-2">Insufficient Tokens</h3>
              <p className="text-amber-700 text-center mb-6">
                You need at least 10 tokens to view lead details. Current balance: <span className="font-bold">{totalTokens}</span> tokens.
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={closeTokenModal}
                  className=" cursor-pointer flex-1 py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className=" cursor-pointer flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg transition-all duration-300">
                  Buy Tokens
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;