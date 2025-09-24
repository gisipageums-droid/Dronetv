import { useForm } from "../../context/FormContext";

export const Summary = () => {
  const { data } = useForm();

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
                {key}
              </span>
              <span className="text-base">{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Categories</h3>
        {data.categories?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.categories.map((cat: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-200"
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
      <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Subcategories</h3>
        {data.subcategories?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.subcategories.map((sub: any, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 border border-green-200"
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
      <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Skills</h3>
        {data.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 border border-purple-200"
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
      {/* <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">Projects</h3>
        {data.projects?.length ? (
          <div className="flex flex-col gap-4">
            {data.projects.map((proj: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-white border border-indigo-100 rounded-lg shadow-sm w-full"
              >
                <h4 className="font-semibold text-indigo-700">{proj.title}</h4>
                <p className="text-gray-600 text-sm mt-1">
                  {proj.description || "No description"}
                </p>
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    className="text-blue-600 text-sm underline mt-2 inline-block"
                  >
                    {proj.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No projects added</p>
        )}
      </div> */}





      <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-xl p-6 shadow-sm">
  <h3 className="text-xl font-semibold text-indigo-800 mb-4">Projects</h3>
  {data.projects?.length ? (
    <div className="flex flex-col gap-4">
      {data.projects.map((proj: any, i: number) => (
        <div
          key={i}
          className="p-4 bg-white border border-indigo-100 rounded-lg shadow-sm w-full"
        >
          {Object.entries(proj).map(([field, value]) => {
            const strValue = String(value); // cast unknown to string
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




      {/* Services
      <div className="bg-gradient-to-r from-teal-50 to-white border border-teal-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-teal-800 mb-4">Services</h3>
        {data.services?.length ? (
          <div className="flex flex-col gap-4">
            {data.services.map((srv: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-white border border-teal-100 rounded-lg shadow-sm w-full"
              >
                <h4 className="font-semibold text-teal-700">{srv.serviceName}</h4>
                <p className="text-gray-600 text-sm mt-1">
                  {srv.serviceDetails || "No details"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No services added</p>
        )}
      </div> */}


{/* Services */}
<div className="bg-gradient-to-r from-teal-50 to-white border border-teal-200 rounded-xl p-6 shadow-sm">
  <h3 className="text-xl font-semibold text-teal-800 mb-4">Services</h3>
  {data.services?.length ? (
    <div className="flex flex-col gap-4">
      {data.services.map((srv: any, i: number) => (
        <div
          key={i}
          className="p-4 bg-white border border-teal-100 rounded-lg shadow-sm w-full"
        >
          {Object.entries(srv).map(([field, value]) => {
            const strValue = String(value); // cast unknown to string
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
      <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-red-800 mb-4">Media</h3>
        {data.media?.length ? (
          <div className="flex flex-wrap gap-4">
            {data.media.map((m: any, i: number) => (
              <div
                key={i}
                className="w-40 p-2 bg-white border border-red-100 rounded-lg shadow-sm flex flex-col items-center"
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
    </div>
  );
};
