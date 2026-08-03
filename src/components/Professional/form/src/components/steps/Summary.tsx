import { useForm } from "../../context/FormContext";

export const Summary = () => {
  const { data } = useForm();

  return (
    <div className="space-y-10">
      {/* Title */}
      <h2 className="text-3xl font-bold text-brand-gold border-b-4 border-brand-yellow-soft pb-2">
        Summary
      </h2>

      {/* Basic Info */}
      <div className="bg-gradient-to-r from-surface-main to-white border border-brand-yellow-soft rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-brand-gold mb-4">Basic Info</h3>
        <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
          {Object.entries(data.basicInfo || {}).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-sm font-medium text-ink-caption capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="text-base">{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Address Information</h3>
        {data.addressInformation && Object.keys(data.addressInformation).length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
            {Object.entries(data.addressInformation).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-base">{value || "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No address information provided</p>
        )}
      </div>

      {/* Alternate Contact */}
      <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-success mb-4">Alternate Contact</h3>
        {data.alternateContact && Object.keys(data.alternateContact).length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
            {Object.entries(data.alternateContact).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-base">{value || "—"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No alternate contact provided</p>
        )}
      </div>

      {/* Social Media Links */}
      <div className="bg-gradient-to-r from-brand-gold/10 to-white border border-brand-gold/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-brand-gold mb-4">Social Media Links</h3>
        {data.socialMediaLinks && Object.keys(data.socialMediaLinks).length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
            {Object.entries(data.socialMediaLinks).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                {value && value.toString().startsWith('http') ? (
                  <a 
                    href={value.toString()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-status-info underline hover:text-status-info"
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
          <p className="text-ink-caption">No social media links provided</p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-gradient-to-r from-status-warning/10 to-white border border-status-warning/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-warning mb-4">Categories</h3>
        {data.categories?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.categories.map((cat: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-status-warning/15 text-status-warning border border-status-warning/25"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No categories selected</p>
        )}
      </div>

      {/* Subcategories */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Subcategories</h3>
        {data.subcategories?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.subcategories.map((sub: any, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-status-info/15 text-status-info border border-status-info/25"
              >
                {sub.parent} › {sub.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No subcategories selected</p>
        )}
      </div>

      {/* Skills */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Skills</h3>
        {data.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-status-info/15 text-status-info border border-status-info/25"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No skills selected</p>
        )}
      </div>

      {/* Freeform Skills */}
      <div className="bg-gradient-to-r from-status-error/10 to-white border border-status-error/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-error mb-4">Freeform Skills</h3>
        {data.freeformSkills?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.freeformSkills.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-status-error/15 text-status-error border border-status-error/25"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No freeform skills added</p>
        )}
      </div>

      {/* Projects */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Projects</h3>
        {data.projects?.length ? (
          <div className="flex flex-col gap-4">
            {data.projects.map((proj: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-surface-card border border-status-info/15 rounded-lg shadow-sm w-full"
              >
                {Object.entries(proj).map(([field, value]) => {
                  const strValue = String(value);
                  return (
                    <div key={field} className="mb-2">
                      <span className="font-medium text-ink-paragraph capitalize">
                        {field.replace(/_/g, " ")}:
                      </span>{" "}
                      {strValue.startsWith("http") ? (
                        <a
                          href={strValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-status-info underline ml-1"
                        >
                          {strValue}
                        </a>
                      ) : (
                        <span className="text-ink-paragraph ml-1">{strValue}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption text-center py-4">No projects added</p>
        )}
      </div>

      {/* Services */}
      <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-success mb-4">Services</h3>
        {data.services?.length ? (
          <div className="flex flex-col gap-4">
            {data.services.map((srv: any, i: number) => (
              <div
                key={i}
                className="p-4 bg-surface-card border border-status-success/15 rounded-lg shadow-sm w-full"
              >
                {Object.entries(srv).map(([field, value]) => {
                  const strValue = String(value);
                  return (
                    <div key={field} className="mb-2">
                      <span className="font-medium text-ink-paragraph capitalize">
                        {field.replace(/_/g, " ")}:
                      </span>{" "}
                      {strValue.startsWith("http") ? (
                        <a
                          href={strValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-status-info underline ml-1"
                        >
                          {strValue}
                        </a>
                      ) : (
                        <span className="text-ink-paragraph ml-1">{strValue}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption text-center py-4">No services added</p>
        )}
      </div>

      {/* Media */}
      <div className="bg-gradient-to-r from-status-error/10 to-white border border-status-error/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-error mb-4">Media</h3>
        {data.media?.length ? (
          <div className="flex flex-wrap gap-4">
            {data.media.map((m: any, i: number) => (
              <div
                key={i}
                className="w-40 p-2 bg-surface-card border border-status-error/15 rounded-lg shadow-sm flex flex-col items-center"
              >
                {m.fileUrl?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={m.fileUrl}
                    alt={m.fieldName}
                    className="w-32 h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="text-ink-caption text-sm mb-2">{m.fieldName}</div>
                )}
                <a
                  href={m.fileUrl}
                  target="_blank"
                  className="text-status-info text-sm underline"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption text-center py-4">No media uploaded</p>
        )}
      </div>

      {/* Resume */}
      <div className="bg-gradient-to-r from-ink-offwhite to-white border border-ink-light rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-ink-charcoal mb-4">Resume</h3>
        {data.resume ? (
          <div className="flex flex-col gap-3">
            <div className="whitespace-pre-wrap text-ink-paragraph text-sm bg-surface-card p-4 rounded-lg border border-ink-light shadow-inner">
              <div>
                {data.resume.length === 0 ? (
                  <p>No resume uploaded</p>
                ) : (
                  data.resume.map((doc) => (
                    <div key={doc.id} className="mb-4 border p-3 rounded bg-ink-offwhite">
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
          <p className="text-ink-caption text-center py-4">No resume added</p>
        )}
      </div>
    </div>
  );
};