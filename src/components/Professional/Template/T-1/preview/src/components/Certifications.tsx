import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Save, Trash2 } from "lucide-react";

type Certification = {
  id: number;
  title: string;
  provider: string;
  year: string;
  description: string;
  isEditing: boolean;
};

const Certifications: React.FC = () => {
  const [certs, setCerts] = useState<Certification[]>([
    {
      id: 1,
      title: "Full-Stack Web Development",
      provider: "FreeCodeCamp",
      year: "2024",
      description: "Completed a comprehensive program covering MERN stack.",
      isEditing: false,
    },
    {
      id: 2,
      title: "AWS Cloud Practitioner",
      provider: "Amazon Web Services",
      year: "2023",
      description: "Certified in fundamental AWS cloud concepts.",
      isEditing: false,
    },
  ]);

  const [globalEdit, setGlobalEdit] = useState(false);

  const handleAddCert = () => {
    const newCert: Certification = {
      id: Date.now(),
      title: "New Certification",
      provider: "Provider",
      year: "Year",
      description: "Certification details here...",
      isEditing: true,
    };
    setCerts([...certs, newCert]);
    setGlobalEdit(true);
  };

  const handleRemoveCert = (id: number) => {
    setCerts(certs.filter((c) => c.id !== id));
  };

  const toggleEdit = (id: number) => {
    setCerts(
      certs.map((c) => (c.id === id ? { ...c, isEditing: !c.isEditing } : c))
    );
  };

  const handleSaveAll = () => {
    setCerts(certs.map((c) => ({ ...c, isEditing: false })));
    setGlobalEdit(false);
  };

  return (
    <section className="relative py-20 bg-gray-900">
      {/* Section Header */}
      <motion.div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          My{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            Certifications
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Professional certifications that validate my expertise and commitment
          to continuous learning.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {/* Add Certification */}
          <motion.button
            onClick={handleAddCert}
            className="inline-flex items-center px-6 py-3 rounded-full shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-yellow-400 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Certification
          </motion.button>

          {/* Global Edit Button */}
          <motion.button
            onClick={() => (globalEdit ? handleSaveAll() : setGlobalEdit(true))}
            className={`inline-flex items-center px-6 py-3 rounded-full shadow-sm text-base font-medium transition-all duration-300 ${
              globalEdit
                ? "bg-green-600 text-white hover:bg-green-500"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {globalEdit ? (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save All
              </>
            ) : (
              <>
                <Edit className="w-5 h-5 mr-2" />
                Edit All
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Certification Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-6 md:px-12">
        {certs.map((cert) => (
          <motion.div
            key={cert.id}
            className="relative p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 hover:border-yellow-400 transition-all"
          >
            {/* Per-Card Edit/Delete (only when global edit is on) */}
            {globalEdit && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleRemoveCert(cert.id)}
                  className="p-3 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  title="Remove Certification"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleEdit(cert.id)}
                  className={`p-3 rounded-full transition-colors ${
                    cert.isEditing
                      ? "bg-green-600 text-white hover:bg-green-500"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                  title={cert.isEditing ? "Save" : "Edit"}
                >
                  {cert.isEditing ? (
                    <Save className="w-5 h-5" />
                  ) : (
                    <Edit className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {/* Card Content */}
            {cert.isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={cert.title}
                  onChange={(e) =>
                    setCerts(
                      certs.map((c) =>
                        c.id === cert.id ? { ...c, title: e.target.value } : c
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                />
                <input
                  type="text"
                  value={cert.provider}
                  onChange={(e) =>
                    setCerts(
                      certs.map((c) =>
                        c.id === cert.id
                          ? { ...c, provider: e.target.value }
                          : c
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                />
                <input
                  type="text"
                  value={cert.year}
                  onChange={(e) =>
                    setCerts(
                      certs.map((c) =>
                        c.id === cert.id ? { ...c, year: e.target.value } : c
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                />
                <textarea
                  value={cert.description}
                  onChange={(e) =>
                    setCerts(
                      certs.map((c) =>
                        c.id === cert.id
                          ? { ...c, description: e.target.value }
                          : c
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                <p className="text-sm text-gray-400">
                  {cert.provider} • {cert.year}
                </p>
                <p className="mt-2 text-gray-300">{cert.description}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
