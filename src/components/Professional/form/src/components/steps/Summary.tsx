import { useForm } from "../../context/FormContext";

export const Summary = () => {
  const { data } = useForm();
  console.log("summary payload data", data);

  return (
    <div className="space-y-10">
      {/* Title */}
      <h2 className="text-3xl font-bold text-yellow-700 border-b-4 border-yellow-300 pb-2">
        Summary
      </h2>

      {/* Basic Info */}
      <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Basic Info</h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          {Object.entries(data.basicInfo || {}).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="text-base">{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Address Information</h3>
        {data.addressInformation && Object.keys(data.addressInformation).length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            {Object.entries(data.addressInformation).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-base">{value || "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No address information provided</p>
        )}
      </div>

      {/* Alternate Contact */}
      <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Alternate Contact</h3>
        {data.alternateContact && Object.keys(data.alternateContact).length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            {Object.entries(data.alternateContact).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-base">{value || "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No alternate contact provided</p>
        )}
      </div>

      {/* Social Media Links */}
      <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Social Media Links</h3>
        {data.socialMediaLinks && Object.keys(data.socialMediaLinks).length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            {Object.entries(data.socialMediaLinks).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                {value && value.toString().startsWith('http') ? (
                  <a 
                    href={value.toString()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-base">{value || "—"}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No social media links provided</p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-gradient-to-r from-orange-50 to-white border border-orange-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-orange-800 mb-4">Categories</h3>
        {data.categories?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.categories.map((cat: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 border border-orange-200"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No categories selected</p>
        )}
      </div>

      {/* Subcategories */}
      <div className="bg-gradient-to-r from-teal-50 to-white border border-teal-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-teal-800 mb-4">Subcategories</h3>
        {data.subcategories?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.subcategories.map((sub: any, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-700 border border-teal-200"
              >
                {sub.parent} › {sub.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No subcategories selected</p>
        )}
      </div>

      {/* Skills */}
      <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">Skills</h3>
        {data.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 border border-indigo-200"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills selected</p>
        )}
      </div>

      {/* Freeform Skills */}
      <div className="bg-gradient-to-r from-pink-50 to-white border border-pink-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-pink-800 mb-4">Freeform Skills</h3>
        {data.freeformSkills?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.freeformSkills.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-700 border border-pink-200"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No freeform skills added</p>
        )}
      </div>

      {/* Projects */}
      <div className="bg-gradient-to-r from-cyan-50 to-white border border-cyan-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-cyan-800 mb-4">Projects</h3>
        {data.projects?.length ? (
          <div className="flex flex-col gap-4">
            {data.projects.map((proj: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-white border border-cyan-100 rounded-lg shadow-sm w-full"
              >
                {Object.entries(proj).map(([field, value]) => {
                  const strValue = String(value);
                  return (
                    <div key={field} className="mb-2">
                      <span className="font-medium text-gray-700 capitalize">
                        {field.replace(/_/g, " ")}:
                      </span>{" "}
                      {strValue.startsWith("http") ? (
                        <a
                          href={strValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline ml-1"
                        >
                          {strValue}
                        </a>
                      ) : (
                        <span className="text-gray-600 ml-1">{strValue}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No projects added</p>
        )}
      </div>

      {/* Services */}
      <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-emerald-800 mb-4">Services</h3>
        {data.services?.length ? (
          <div className="flex flex-col gap-4">
            {data.services.map((srv: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-white border border-emerald-100 rounded-lg shadow-sm w-full"
              >
                {Object.entries(srv).map(([field, value]) => {
                  const strValue = String(value);
                  return (
                    <div key={field} className="mb-2">
                      <span className="font-medium text-gray-700 capitalize">
                        {field.replace(/_/g, " ")}:
                      </span>{" "}
                      {strValue.startsWith("http") ? (
                        <a
                          href={strValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline ml-1"
                        >
                          {strValue}
                        </a>
                      ) : (
                        <span className="text-gray-600 ml-1">{strValue}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No services added</p>
        )}
      </div>

      {/* Media */}
      <div className="bg-gradient-to-r from-rose-50 to-white border border-rose-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-rose-800 mb-4">Media</h3>
        {data.media?.length ? (
          <div className="flex flex-wrap gap-4">
            {data.media.map((m: any, i: number) => (
              <div
                key={i}
                className="w-40 p-2 bg-white border border-rose-100 rounded-lg shadow-sm flex flex-col items-center"
              >
                {m.fileUrl?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={m.fileUrl}
                    alt={m.fieldName}
                    className="w-32 h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="text-gray-500 text-sm mb-2">{m.fieldName}</div>
                )}
                <a
                  href={m.fileUrl}
                  target="_blank"
                  className="text-blue-500 text-sm underline"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No media uploaded</p>
        )}
      </div>

      {/* Resume */}
      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Resume</h3>
        {data.resume ? (
          <div className="flex flex-col gap-3">
            <div className="whitespace-pre-wrap text-gray-700 text-sm bg-white p-4 rounded-lg border border-gray-100 shadow-inner">
              <div>
                {data.resume.length === 0 ? (
                  <p>No resume uploaded</p>
                ) : (
                  data.resume.map((doc) => (
                    <div key={doc.id} className="mb-4 border p-3 rounded bg-gray-50">
                      <p><strong>Name:</strong> {doc.name}</p>
                      <p><strong>Type:</strong> {doc.type}</p>
                      <p><strong>Size:</strong> {doc.size} bytes</p>
                      <p><strong>Uploaded:</strong> {new Date(doc.uploadDate).toLocaleDateString()}</p>
                      <pre className="text-sm">{doc.extractedText.slice(0, 200)}...</pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No resume added</p>
        )}
      </div>
    </div>
  );
};