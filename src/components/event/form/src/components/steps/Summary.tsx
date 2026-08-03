// // // import { useForm } from "../../context/FormContext";

// // // export const Summary = () => {
// // //   const { data } = useForm();
// // //   console.log("summary payload data", data);

// // //   return (
// // //     <div className="space-y-10">
// // //       {/* Title */}
// // //       <h2 className="text-3xl font-bold text-brand-gold border-b-4 border-brand-yellow-soft pb-2">
// // //         Summary
// // //       </h2>

// // //       {/* Basic Info */}
// // //       <div className="bg-gradient-to-r from-surface-main to-white border border-brand-yellow-soft rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-brand-gold mb-4">Basic Info</h3>
// // //         <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
// // //           {Object.entries(data.basicInfo || {}).map(([key, value]) => (
// // //             <div key={key} className="flex flex-col">
// // //               <span className="text-sm font-medium text-ink-caption capitalize">
// // //                 {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
// // //               </span>
// // //               <span className="text-base">{value || "—"}</span>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Address Information */}
// // //       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-status-info mb-4">Address Information</h3>
// // //         {data.addressInformation && Object.keys(data.addressInformation).length > 0 ? (
// // //           <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
// // //             {Object.entries(data.addressInformation).map(([key, value]) => (
// // //               <div key={key} className="flex flex-col">
// // //                 <span className="text-sm font-medium text-ink-caption capitalize">
// // //                   {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
// // //                 </span>
// // //                 <span className="text-base">{value || "—"}</span>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption">No address information provided</p>
// // //         )}
// // //       </div>

// // //       {/* Alternate Contact */}
// // //       <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-status-success mb-4">Alternate Contact</h3>
// // //         {data.alternateContact && Object.keys(data.alternateContact).length > 0 ? (
// // //           <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
// // //             {Object.entries(data.alternateContact).map(([key, value]) => (
// // //               <div key={key} className="flex flex-col">
// // //                 <span className="text-sm font-medium text-ink-caption capitalize">
// // //                   {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
// // //                 </span>
// // //                 <span className="text-base">{value || "—"}</span>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption">No alternate contact provided</p>
// // //         )}
// // //       </div>

// // //       {/* Social Media Links */}
// // //       <div className="bg-gradient-to-r from-brand-gold/10 to-white border border-brand-gold/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-brand-gold mb-4">Social Media Links</h3>
// // //         {data.socialMediaLinks && Object.keys(data.socialMediaLinks).length > 0 ? (
// // //           <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
// // //             {Object.entries(data.socialMediaLinks).map(([key, value]) => (
// // //               <div key={key} className="flex flex-col">
// // //                 <span className="text-sm font-medium text-ink-caption capitalize">
// // //                   {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
// // //                 </span>
// // //                 {value && value.toString().startsWith('http') ? (
// // //                   <a 
// // //                     href={value.toString()} 
// // //                     target="_blank" 
// // //                     rel="noopener noreferrer"
// // //                     className="text-status-info underline hover:text-status-info"
// // //                   >
// // //                     {value}
// // //                   </a>
// // //                 ) : (
// // //                   <span className="text-base">{value || "—"}</span>
// // //                 )}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption">No social media links provided</p>
// // //         )}
// // //       </div>

// // //       {/* Categories */}
// // //       <div className="bg-gradient-to-r from-status-warning/10 to-white border border-status-warning/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-status-warning mb-4">Categories</h3>
// // //         {data.categories?.length ? (
// // //           <div className="flex flex-wrap gap-2">
// // //             {data.categories.map((cat: string, i: number) => (
// // //               <span
// // //                 key={i}
// // //                 className="px-3 py-1 rounded-full text-sm bg-status-warning/15 text-status-warning border border-status-warning/25"
// // //               >
// // //                 {cat}
// // //               </span>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption">No categories selected</p>
// // //         )}
// // //       </div>

// // //       {/* Subcategories */}
// // //       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-status-info mb-4">Subcategories</h3>
// // //         {data.subcategories?.length ? (
// // //           <div className="flex flex-wrap gap-2">
// // //             {data.subcategories.map((sub: any, i: number) => (
// // //               <span
// // //                 key={i}
// // //                 className="px-3 py-1 rounded-full text-sm bg-status-info/15 text-status-info border border-status-info/25"
// // //               >
// // //                 {sub.parent} › {sub.name}
// // //               </span>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption">No subcategories selected</p>
// // //         )}
// // //       </div>

// // //       {/* Skills */}
// // //       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-status-info mb-4">Skills</h3>
// // //         {data.skills?.length ? (
// // //           <div className="flex flex-wrap gap-2">
// // //             {data.skills.map((skill: string, i: number) => (
// // //               <span
// // //                 key={i}
// // //                 className="px-3 py-1 rounded-full text-sm bg-status-info/15 text-status-info border border-status-info/25"
// // //               >
// // //                 {skill}
// // //               </span>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption">No skills selected</p>
// // //         )}
// // //       </div>

// // //       {/* Freeform Skills */}
// // //       <div className="bg-gradient-to-r from-status-error/10 to-white border border-status-error/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-status-error mb-4">Freeform Skills</h3>
// // //         {data.freeformSkills?.length ? (
// // //           <div className="flex flex-wrap gap-2">
// // //             {data.freeformSkills.map((skill: string, i: number) => (
// // //               <span
// // //                 key={i}
// // //                 className="px-3 py-1 rounded-full text-sm bg-status-error/15 text-status-error border border-status-error/25"
// // //               >
// // //                 {skill}
// // //               </span>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption">No freeform skills added</p>
// // //         )}
// // //       </div>

// // //       {/* Projects */}
// // //       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-status-info mb-4">Projects</h3>
// // //         {data.projects?.length ? (
// // //           <div className="flex flex-col gap-4">
// // //             {data.projects.map((proj: any, i: number) => (
// // //               <div
// // //                 key={i}
// // //                 className="p-4 bg-surface-card border border-status-info/15 rounded-lg shadow-sm w-full"
// // //               >
// // //                 {Object.entries(proj).map(([field, value]) => {
// // //                   const strValue = String(value);
// // //                   return (
// // //                     <div key={field} className="mb-2">
// // //                       <span className="font-medium text-ink-paragraph capitalize">
// // //                         {field.replace(/_/g, " ")}:
// // //                       </span>{" "}
// // //                       {strValue.startsWith("http") ? (
// // //                         <a
// // //                           href={strValue}
// // //                           target="_blank"
// // //                           rel="noopener noreferrer"
// // //                           className="text-status-info underline ml-1"
// // //                         >
// // //                           {strValue}
// // //                         </a>
// // //                       ) : (
// // //                         <span className="text-ink-paragraph ml-1">{strValue}</span>
// // //                       )}
// // //                     </div>
// // //                   );
// // //                 })}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption text-center py-4">No projects added</p>
// // //         )}
// // //       </div>

// // //       {/* Services */}
// // //       <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-status-success mb-4">Services</h3>
// // //         {data.services?.length ? (
// // //           <div className="flex flex-col gap-4">
// // //             {data.services.map((srv: any, i: number) => (
// // //               <div
// // //                 key={i}
// // //                 className="p-4 bg-surface-card border border-status-success/15 rounded-lg shadow-sm w-full"
// // //               >
// // //                 {Object.entries(srv).map(([field, value]) => {
// // //                   const strValue = String(value);
// // //                   return (
// // //                     <div key={field} className="mb-2">
// // //                       <span className="font-medium text-ink-paragraph capitalize">
// // //                         {field.replace(/_/g, " ")}:
// // //                       </span>{" "}
// // //                       {strValue.startsWith("http") ? (
// // //                         <a
// // //                           href={strValue}
// // //                           target="_blank"
// // //                           rel="noopener noreferrer"
// // //                           className="text-status-info underline ml-1"
// // //                         >
// // //                           {strValue}
// // //                         </a>
// // //                       ) : (
// // //                         <span className="text-ink-paragraph ml-1">{strValue}</span>
// // //                       )}
// // //                     </div>
// // //                   );
// // //                 })}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption text-center py-4">No services added</p>
// // //         )}
// // //       </div>

// // //       {/* Media */}
// // //       <div className="bg-gradient-to-r from-status-error/10 to-white border border-status-error/25 rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-status-error mb-4">Media</h3>
// // //         {data.media?.length ? (
// // //           <div className="flex flex-wrap gap-4">
// // //             {data.media.map((m: any, i: number) => (
// // //               <div
// // //                 key={i}
// // //                 className="w-40 p-2 bg-surface-card border border-status-error/15 rounded-lg shadow-sm flex flex-col items-center"
// // //               >
// // //                 {m.fileUrl?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
// // //                   <img
// // //                     src={m.fileUrl}
// // //                     alt={m.fieldName}
// // //                     className="w-32 h-32 object-cover rounded mb-2"
// // //                   />
// // //                 ) : (
// // //                   <div className="text-ink-caption text-sm mb-2">{m.fieldName}</div>
// // //                 )}
// // //                 <a
// // //                   href={m.fileUrl}
// // //                   target="_blank"
// // //                   className="text-status-info text-sm underline"
// // //                 >
// // //                   View
// // //                 </a>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption text-center py-4">No media uploaded</p>
// // //         )}
// // //       </div>

// // //       {/* Resume */}
// // //       <div className="bg-gradient-to-r from-ink-offwhite to-white border border-ink-light rounded-xl p-6 shadow-sm">
// // //         <h3 className="text-xl font-semibold text-ink-charcoal mb-4">Resume</h3>
// // //         {data.resume ? (
// // //           <div className="flex flex-col gap-3">
// // //             <div className="whitespace-pre-wrap text-ink-paragraph text-sm bg-surface-card p-4 rounded-lg border border-ink-light shadow-inner">
// // //               <div>
// // //                 {data.resume.length === 0 ? (
// // //                   <p>No resume uploaded</p>
// // //                 ) : (
// // //                   data.resume.map((doc) => (
// // //                     <div key={doc.id} className="mb-4 border p-3 rounded bg-ink-offwhite">
// // //                       <p><strong>Name:</strong> {doc.name}</p>
// // //                       <p><strong>Type:</strong> {doc.type}</p>
// // //                       <p><strong>Size:</strong> {doc.size} bytes</p>
// // //                       <p><strong>Uploaded:</strong> {new Date(doc.uploadDate).toLocaleDateString()}</p>
// // //                       <pre className="text-sm">{doc.extractedText.slice(0, 200)}...</pre>
// // //                     </div>
// // //                   ))
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           <p className="text-ink-caption text-center py-4">No resume added</p>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };


// // import { useForm } from "../../context/FormContext";

// // export const Summary = () => {
// //   const { data } = useForm();
// //   console.log("Event summary payload data", data);

// //   return (
// //     <div className="space-y-10">
// //       {/* Title */}
// //       <h2 className="text-3xl font-bold text-brand-gold border-b-4 border-brand-yellow-soft pb-2">
// //         Event Summary
// //       </h2>

// //       {/* Step 1: Basic Event Information */}
// //       <div className="bg-gradient-to-r from-surface-main to-white border border-brand-yellow-soft rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-brand-gold mb-4">Basic Event Information</h3>
// //         <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
// //           {/* Event Details */}
// //           <div className="md:col-span-2">
// //             <h4 className="text-lg font-medium text-ink-charcoal mb-3">Event Details</h4>
// //             <div className="grid md:grid-cols-2 gap-4">
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">Event Title</span>
// //                 <span className="text-base font-semibold">{data.eventTitle || "—"}</span>
// //               </div>
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">Event Tagline</span>
// //                 <span className="text-base">{data.eventTagline || "—"}</span>
// //               </div>
// //               <div className="md:col-span-2 flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">Event Description</span>
// //                 <span className="text-base">{data.eventDescription || "—"}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Date & Time */}
// //           <div className="md:col-span-2">
// //             <h4 className="text-lg font-medium text-ink-charcoal mb-3">Date & Time</h4>
// //             <div className="grid md:grid-cols-2 gap-4">
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">Start Date</span>
// //                 <span className="text-base">{data.startDate || "—"}</span>
// //               </div>
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">End Date</span>
// //                 <span className="text-base">{data.endDate || "—"}</span>
// //               </div>
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">Start Time</span>
// //                 <span className="text-base">{data.timeStart || "—"}</span>
// //               </div>
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">End Time</span>
// //                 <span className="text-base">{data.timeEnd || "—"}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Venue Information */}
// //           <div className="md:col-span-2">
// //             <h4 className="text-lg font-medium text-ink-charcoal mb-3">Venue Information</h4>
// //             <div className="grid md:grid-cols-2 gap-4">
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">Venue Name</span>
// //                 <span className="text-base">{data.venueName || "—"}</span>
// //               </div>
// //               <div className="md:col-span-2 flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">Venue Address</span>
// //                 <span className="text-base">{data.venueAddress || "—"}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Organizer */}
// //           <div className="flex flex-col">
// //             <span className="text-sm font-medium text-ink-caption">Organizer</span>
// //             <span className="text-base">{data.organizer || "—"}</span>
// //           </div>

// //           {/* Countdown Settings */}
// //           <div className="md:col-span-2">
// //             <h4 className="text-lg font-medium text-ink-charcoal mb-3">Countdown Settings</h4>
// //             <div className="grid md:grid-cols-2 gap-4">
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-medium text-ink-caption">Countdown Enabled</span>
// //                 <span className="text-base">{data.countdownEnabled ? "Yes" : "No"}</span>
// //               </div>
// //               {data.countdownEnabled && (
// //                 <div className="flex flex-col">
// //                   <span className="text-sm font-medium text-ink-caption">Countdown Target</span>
// //                   <span className="text-base">{data.countdownTargetDate || "—"}</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Step 2: Highlights */}
// //       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-info mb-4">Event Highlights</h3>
// //         {data.highlights?.length ? (
// //           <div className="flex flex-wrap gap-2">
// //             {data.highlights.map((highlight: any, index: number) => (
// //               <span
// //                 key={index}
// //                 className="px-3 py-2 rounded-lg text-sm bg-status-info/15 text-status-info border border-status-info/25"
// //               >
// //                 {highlight.highlightText || "Untitled highlight"}
// //               </span>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No highlights added</p>
// //         )}
// //       </div>

// //       {/* Step 2: CTA Buttons */}
// //       <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-success mb-4">Call-to-Action Buttons</h3>
// //         {data.ctaButtons?.length ? (
// //           <div className="space-y-4">
// //             {data.ctaButtons.map((cta: any, index: number) => (
// //               <div key={index} className="p-4 bg-surface-card border border-status-success/15 rounded-lg">
// //                 <div className="flex flex-col md:flex-row md:items-center gap-2">
// //                   <span className="font-medium text-ink-paragraph">Label:</span>
// //                   <span className="text-base">{cta.label || "—"}</span>
// //                   <span className="hidden md:block text-ink-caption mx-2">•</span>
// //                   <span className="font-medium text-ink-paragraph">Link:</span>
// //                   {cta.link ? (
// //                     <a 
// //                       href={cta.link} 
// //                       target="_blank" 
// //                       rel="noopener noreferrer"
// //                       className="text-status-info underline hover:text-status-info"
// //                     >
// //                       {cta.link}
// //                     </a>
// //                   ) : (
// //                     <span className="text-base">—</span>
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No CTA buttons added</p>
// //         )}
// //       </div>

// //       {/* Step 3: Sections */}
// //       <div className="bg-gradient-to-r from-brand-gold/10 to-white border border-brand-gold/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-brand-gold mb-4">Event Sections</h3>
// //         {data.sections?.length ? (
// //           <div className="space-y-4">
// //             {data.sections.map((section: any, index: number) => (
// //               <div key={index} className="p-4 bg-surface-card border border-brand-gold/15 rounded-lg">
// //                 <h4 className="font-semibold text-lg text-brand-gold mb-2">
// //                   {section.title || "Untitled Section"}
// //                 </h4>
// //                 {section.description && (
// //                   <p className="text-ink-paragraph">{section.description}</p>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No sections added</p>
// //         )}
// //       </div>

// //       {/* Step 3: Specialized Zones */}
// //       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-info mb-4">Specialized Zones</h3>
// //         {data.zones?.length ? (
// //           <div className="space-y-4">
// //             {data.zones.map((zone: any, index: number) => (
// //               <div key={index} className="p-4 bg-surface-card border border-status-info/15 rounded-lg">
// //                 <h4 className="font-semibold text-lg text-status-info mb-2">
// //                   {zone.zoneTitle || "Untitled Zone"}
// //                 </h4>
// //                 {zone.description && (
// //                   <p className="text-ink-paragraph">{zone.description}</p>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No zones added</p>
// //         )}
// //       </div>

// //       {/* Step 4: Speakers */}
// //       <div className="bg-gradient-to-r from-status-warning/10 to-white border border-status-warning/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-warning mb-4">Speakers</h3>
// //         {data.speakers?.length ? (
// //           <div className="grid md:grid-cols-2 gap-4">
// //             {data.speakers.map((speaker: any, index: number) => (
// //               <div key={index} className="p-4 bg-surface-card border border-status-warning/15 rounded-lg">
// //                 <h4 className="font-semibold text-lg text-status-warning mb-2">
// //                   {speaker.name || "Unnamed Speaker"}
// //                 </h4>
// //                 <div className="space-y-1 text-sm text-ink-paragraph">
// //                   {speaker.designation && <div>Designation: {speaker.designation}</div>}
// //                   {speaker.organization && <div>Organization: {speaker.organization}</div>}
// //                   {speaker.day && <div>Day: {speaker.day}</div>}
// //                   {speaker.sequence && <div>Sequence: {speaker.sequence}</div>}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No speakers added</p>
// //         )}
// //       </div>

// //       {/* Step 4: Themes */}
// //       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-info mb-4">Event Themes</h3>
// //         {data.themes?.length ? (
// //           <div className="space-y-4">
// //             {data.themes.map((theme: any, index: number) => (
// //               <div key={index} className="p-4 bg-surface-card border border-status-info/15 rounded-lg">
// //                 <h4 className="font-semibold text-lg text-status-info mb-2">
// //                   {theme.themeTitle || "Untitled Theme"}
// //                 </h4>
// //                 <div className="space-y-1 text-sm text-ink-paragraph">
// //                   {theme.day && <div>Day: {theme.day}</div>}
// //                   {theme.details && <div>Details: {theme.details}</div>}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No themes added</p>
// //         )}
// //       </div>

// //       {/* Step 4: Partners */}
// //       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-info mb-4">Partners & Sponsors</h3>
// //         {data.partners?.length ? (
// //           <div className="flex flex-wrap gap-2">
// //             {data.partners.map((partner: any, index: number) => (
// //               <span
// //                 key={index}
// //                 className="px-3 py-2 rounded-lg text-sm bg-status-info/15 text-status-info border border-status-info/25"
// //               >
// //                 {partner.partnerName || "Unnamed Partner"}
// //               </span>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No partners added</p>
// //         )}
// //       </div>

// //       {/* Step 5: Exhibitor Interviews */}
// //       <div className="bg-gradient-to-r from-status-error/10 to-white border border-status-error/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-error mb-4">Exhibitor Interviews</h3>
// //         {data.exhibitorInterviews?.length ? (
// //           <div className="space-y-4">
// //             {data.exhibitorInterviews.map((interview: any, index: number) => (
// //               <div key={index} className="p-4 bg-surface-card border border-status-error/15 rounded-lg">
// //                 <h4 className="font-semibold text-lg text-status-error mb-2">
// //                   {interview.videoTitle || "Untitled Interview"}
// //                 </h4>
// //                 {interview.videoUrl && (
// //                   <a 
// //                     href={interview.videoUrl} 
// //                     target="_blank" 
// //                     rel="noopener noreferrer"
// //                     className="text-status-info underline hover:text-status-info"
// //                   >
// //                     {interview.videoUrl}
// //                   </a>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No exhibitor interviews added</p>
// //         )}
// //       </div>

// //       {/* Step 5: Media Gallery */}
// //       <div className="bg-gradient-to-r from-status-error/10 to-white border border-status-error/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-error mb-4">Media Gallery</h3>
// //         {data.mediaGallery?.length ? (
// //           <div className="space-y-4">
// //             {data.mediaGallery.map((media: any, index: number) => (
// //               <div key={index} className="p-4 bg-surface-card border border-status-error/15 rounded-lg">
// //                 <div className="flex flex-col md:flex-row md:items-center gap-2">
// //                   <span className="font-medium text-ink-paragraph">Type:</span>
// //                   <span className="text-base capitalize">{media.mediaType || "Unknown"}</span>
// //                   <span className="hidden md:block text-ink-caption mx-2">•</span>
// //                   <span className="font-medium text-ink-paragraph">URL:</span>
// //                   {media.mediaUrl ? (
// //                     <a 
// //                       href={media.mediaUrl} 
// //                       target="_blank" 
// //                       rel="noopener noreferrer"
// //                       className="text-status-info underline hover:text-status-info truncate"
// //                     >
// //                       {media.mediaUrl}
// //                     </a>
// //                   ) : (
// //                     <span className="text-base">—</span>
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No media gallery items added</p>
// //         )}
// //       </div>

// //       {/* Step 5: Contact Information */}
// //       <div className="bg-gradient-to-r from-ink-offwhite to-white border border-ink-light rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-ink-charcoal mb-4">Contact Information</h3>
// //         <div className="grid md:grid-cols-2 gap-6">
// //           {/* Phone Numbers */}
// //           <div>
// //             <h4 className="font-medium text-ink-paragraph mb-2">Phone Numbers</h4>
// //             {data.contactInfo?.phone?.length ? (
// //               <div className="space-y-1">
// //                 {data.contactInfo.phone.map((phone: any, index: number) => (
// //                   <div key={index} className="text-ink-paragraph">
// //                     {phone.phoneNumber || "—"}
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-ink-caption">No phone numbers added</p>
// //             )}
// //           </div>

// //           {/* Email & Address */}
// //           <div className="space-y-4">
// //             <div>
// //               <h4 className="font-medium text-ink-paragraph mb-2">Email</h4>
// //               <div className="text-ink-paragraph">{data.contactInfo?.email || "—"}</div>
// //             </div>
// //             <div>
// //               <h4 className="font-medium text-ink-paragraph mb-2">Address</h4>
// //               <div className="text-ink-paragraph">{data.contactInfo?.address || "—"}</div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Step 5: International Contacts */}
// //       <div className="bg-gradient-to-r from-surface-main to-white border border-brand-yellow-soft rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-brand-gold mb-4">International Contacts</h3>
// //         {data.internationalContacts?.length ? (
// //           <div className="grid md:grid-cols-2 gap-4">
// //             {data.internationalContacts.map((contact: any, index: number) => (
// //               <div key={index} className="p-4 bg-surface-card border border-brand-yellow-soft rounded-lg">
// //                 <h4 className="font-semibold text-brand-gold mb-2">
// //                   {contact.name || "Unnamed Contact"}
// //                 </h4>
// //                 <div className="space-y-1 text-sm text-ink-paragraph">
// //                   {contact.organization && <div>Organization: {contact.organization}</div>}
// //                   {contact.phone && <div>Phone: {contact.phone}</div>}
// //                   {contact.email && <div>Email: {contact.email}</div>}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No international contacts added</p>
// //         )}
// //       </div>

// //       {/* Step 5: Social Links */}
// //       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-info mb-4">Social Media Links</h3>
// //         <div className="grid md:grid-cols-3 gap-4">
// //           {data.socialLinks?.facebook && (
// //             <div className="flex flex-col">
// //               <span className="text-sm font-medium text-ink-caption">Facebook</span>
// //               <a 
// //                 href={data.socialLinks.facebook} 
// //                 target="_blank" 
// //                 rel="noopener noreferrer"
// //                 className="text-status-info underline hover:text-status-info"
// //               >
// //                 {data.socialLinks.facebook}
// //               </a>
// //             </div>
// //           )}
// //           {data.socialLinks?.linkedin && (
// //             <div className="flex flex-col">
// //               <span className="text-sm font-medium text-ink-caption">LinkedIn</span>
// //               <a 
// //                 href={data.socialLinks.linkedin} 
// //                 target="_blank" 
// //                 rel="noopener noreferrer"
// //                 className="text-status-info underline hover:text-status-info"
// //               >
// //                 {data.socialLinks.linkedin}
// //               </a>
// //             </div>
// //           )}
// //           {data.socialLinks?.instagram && (
// //             <div className="flex flex-col">
// //               <span className="text-sm font-medium text-ink-caption">Instagram</span>
// //               <a 
// //                 href={data.socialLinks.instagram} 
// //                 target="_blank" 
// //                 rel="noopener noreferrer"
// //                 className="text-status-info underline hover:text-status-info"
// //               >
// //                 {data.socialLinks.instagram}
// //               </a>
// //             </div>
// //           )}
// //           {!data.socialLinks?.facebook && !data.socialLinks?.linkedin && !data.socialLinks?.instagram && (
// //             <p className="text-ink-caption md:col-span-3">No social media links added</p>
// //           )}
// //         </div>
// //       </div>

// //       {/* Step 5: Tags */}
// //       <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-status-success mb-4">Event Tags</h3>
// //         {data.tags?.length ? (
// //           <div className="flex flex-wrap gap-2">
// //             {data.tags.map((tag: string, index: number) => (
// //               <span
// //                 key={index}
// //                 className="px-3 py-1 rounded-full text-sm bg-status-success/15 text-status-success border border-status-success/25"
// //               >
// //                 {tag}
// //               </span>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-ink-caption">No tags added</p>
// //         )}
// //       </div>

// //       {/* Step 5: Publishing Settings */}
// //       <div className="bg-gradient-to-r from-brand-gold/10 to-white border border-brand-gold/25 rounded-xl p-6 shadow-sm">
// //         <h3 className="text-xl font-semibold text-brand-gold mb-4">Publishing Settings</h3>
// //         <div className="grid md:grid-cols-2 gap-4">
// //           <div className="flex flex-col">
// //             <span className="text-sm font-medium text-ink-caption">Published Status</span>
// //             <span className={`text-base font-semibold ${
// //               data.published ? 'text-status-success' : 'text-ink-paragraph'
// //             }`}>
// //               {data.published ? 'Published' : 'Draft'}
// //             </span>
// //           </div>
// //           {data.lastModified && (
// //             <div className="flex flex-col">
// //               <span className="text-sm font-medium text-ink-caption">Last Modified</span>
// //               <span className="text-base">{new Date(data.lastModified).toLocaleString()}</span>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// import { useForm } from "../../context/FormContext";
// import { useState } from "react";
// import { Eye, X, RefreshCw, FileText, Image as ImageIcon } from "lucide-react";

// export const Summary = () => {
//   const { data } = useForm();
//   console.log("Event summary payload data", data);

//   // State for full view modal
//   const [fullViewUrl, setFullViewUrl] = useState<string | null>(null);
//   const [fullViewType, setFullViewType] = useState<string | null>(null);
//   const [fullViewFileName, setFullViewFileName] = useState<string | null>(null);

//   // File type detection function
//   const getFileType = (url: string, fileName?: string, mediaType?: string): string => {
//     if (mediaType) return mediaType;
    
//     const lower = url.toLowerCase();
//     const lowerFileName = fileName?.toLowerCase() || '';
    
//     // Check for image file extensions
//     if (lower.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)($|\?)/) || 
//         lowerFileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/) ||
//         lower.startsWith('data:image/')) {
//       return 'image';
//     } else if (lower.endsWith(".pdf") || lowerFileName.endsWith(".pdf")) {
//       return 'pdf';
//     } else if (lower.match(/\.(doc|docx)($|\?)/) || lowerFileName.match(/\.(doc|docx)$/)) {
//       return 'word';
//     } else if (lower.match(/\.(xls|xlsx)($|\?)/) || lowerFileName.match(/\.(xls|xlsx)$/)) {
//       return 'excel';
//     } else if (lower.match(/\.(ppt|pptx)($|\?)/) || lowerFileName.match(/\.(ppt|pptx)$/)) {
//       return 'powerpoint';
//     } else if (lower.endsWith(".txt") || lowerFileName.endsWith(".txt")) {
//       return 'text';
//     } else {
//       return 'document';
//     }
//   };

//   // Get appropriate icon for file type
//   const getFileIcon = (fileType: string) => {
//     switch (fileType) {
//       case 'image':
//         return <ImageIcon className="w-6 h-6 text-status-info" />;
//       case 'pdf':
//         return <FileText className="w-6 h-6 text-status-error" />;
//       case 'word':
//         return <FileText className="w-6 h-6 text-status-info" />;
//       case 'excel':
//         return <FileText className="w-6 h-6 text-status-success" />;
//       case 'powerpoint':
//         return <FileText className="w-6 h-6 text-status-warning" />;
//       case 'text':
//         return <FileText className="w-6 h-6 text-ink-paragraph" />;
//       default:
//         return <FileText className="w-6 h-6 text-ink-caption" />;
//     }
//   };

//   // Get display name for file type
//   const getFileTypeDisplayName = (fileType: string) => {
//     switch (fileType) {
//       case 'image':
//         return 'Image';
//       case 'pdf':
//         return 'PDF Document';
//       case 'word':
//         return 'Word Document';
//       case 'excel':
//         return 'Excel Spreadsheet';
//       case 'powerpoint':
//         return 'PowerPoint Presentation';
//       case 'text':
//         return 'Text File';
//       default:
//         return 'Document';
//     }
//   };

//   // Function to open full view
//   const openFullView = (url: string, fileName: string, mediaType?: string) => {
//     let fileType = mediaType || getFileType(url);
//     setFullViewUrl(url);
//     setFullViewType(fileType);
//     setFullViewFileName(fileName);
//   };

//   // Function to close full view
//   const closeFullView = () => {
//     setFullViewUrl(null);
//     setFullViewType(null);
//     setFullViewFileName(null);
//   };

//   // Render full view modal
//   const renderFullViewModal = () => {
//     if (!fullViewUrl || !fullViewType) return null;

//     return (
//       <div className="fixed inset-0 bg-ink bg-opacity-75 flex items-center justify-center z-50 p-4">
//         <div className="bg-surface-card rounded-xl shadow-2xl max-w-4xl max-h-[80vh] w-full flex flex-col mt-12">
//           {/* Header */}
//           <div className="flex justify-between items-center p-4 border-b">
//             <h3 className="text-lg font-semibold text-ink-charcoal truncate">
//               {fullViewFileName}
//             </h3>
//             <button
//               onClick={closeFullView}
//               className="p-2 hover:bg-ink-light rounded-full transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-auto p-4">
//             {fullViewType === 'image' ? (
//               <div className="flex justify-center">
//                 <img
//                   src={fullViewUrl}
//                   alt="Full view"
//                   className="max-w-full max-h-[70vh] object-contain"
//                 />
//               </div>
//             ) : fullViewType === 'pdf' ? (
//               <div className="w-full h-[70vh]">
//                 <iframe
//                   src={fullViewUrl}
//                   className="w-full h-full border-0"
//                   title="PDF Document"
//                 />
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-64">
//                 <div className="text-center p-6">
//                   {getFileIcon(fullViewType)}
//                   <p className="text-lg font-medium text-ink-paragraph mb-2 mt-4">
//                     {getFileTypeDisplayName(fullViewType)}
//                   </p>
//                   <p className="text-ink-caption mb-4">
//                     This document type cannot be previewed in the browser.
//                   </p>
//                   <a
//                     href={fullViewUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 px-4 py-2 bg-status-info text-white rounded-lg hover:bg-status-info transition-colors"
//                     onClick={closeFullView}
//                   >
//                     <RefreshCw className="w-4 h-4" />
//                     Download & Open
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="flex justify-between items-center p-4 border-t bg-ink-offwhite rounded-b-xl">
//             <span className="text-sm text-ink-paragraph capitalize">
//               {getFileTypeDisplayName(fullViewType)}
//             </span>
//             <div className="flex gap-2">
//               <a
//                 href={fullViewUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="px-4 py-2 bg-ink-light text-ink-paragraph rounded-lg hover:bg-ink-light transition-colors"
//                 onClick={closeFullView}
//               >
//                 Open in New Tab
//               </a>
//               <a
//                 href={fullViewUrl}
//                 download={fullViewFileName}
//                 className="px-4 py-2 bg-status-success text-white rounded-lg hover:bg-status-success transition-colors"
//                 onClick={closeFullView}
//               >
//                 Download
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Split media gallery into images and documents
//   const imageGallery = data.mediaGallery?.slice(0, 3) || [];
//   const documentGallery = data.mediaGallery?.slice(3, 6) || [];

//   return (
//     <div className="space-y-10">
//       {/* Full View Modal */}
//       {renderFullViewModal()}

//       {/* Title */}
//       <h2 className="text-3xl font-bold text-brand-gold border-b-4 border-brand-yellow-soft pb-2">
//         Event Summary
//       </h2>

//       {/* Step 1: Basic Event Information */}
//       <div className="bg-gradient-to-r from-surface-main to-white border border-brand-yellow-soft rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-brand-gold mb-4">Basic Event Information</h3>
//         <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
//           {/* Event Details */}
//           <div className="md:col-span-2">
//             <h4 className="text-lg font-medium text-ink-charcoal mb-3">Event Details</h4>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">Event Title</span>
//                 <span className="text-base font-semibold">{data.eventTitle || "—"}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">Event Tagline</span>
//                 <span className="text-base">{data.eventTagline || "—"}</span>
//               </div>
//               <div className="md:col-span-2 flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">Event Description</span>
//                 <span className="text-base">{data.eventDescription || "—"}</span>
//               </div>
//             </div>
//           </div>

//           {/* Date & Time */}
//           <div className="md:col-span-2">
//             <h4 className="text-lg font-medium text-ink-charcoal mb-3">Date & Time</h4>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">Start Date</span>
//                 <span className="text-base">{data.startDate || "—"}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">End Date</span>
//                 <span className="text-base">{data.endDate || "—"}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">Start Time</span>
//                 <span className="text-base">{data.timeStart || "—"}</span>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">End Time</span>
//                 <span className="text-base">{data.timeEnd || "—"}</span>
//               </div>
//             </div>
//           </div>

//           {/* Venue Information */}
//           <div className="md:col-span-2">
//             <h4 className="text-lg font-medium text-ink-charcoal mb-3">Venue Information</h4>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">Venue Name</span>
//                 <span className="text-base">{data.venueName || "—"}</span>
//               </div>
//               <div className="md:col-span-2 flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">Venue Address</span>
//                 <span className="text-base">{data.venueAddress || "—"}</span>
//               </div>
//             </div>
//           </div>

//           {/* Organizer */}
//           <div className="flex flex-col">
//             <span className="text-sm font-medium text-ink-caption">Organizer</span>
//             <span className="text-base">{data.organizer || "—"}</span>
//           </div>

//           {/* Countdown Settings */}
//           <div className="md:col-span-2">
//             <h4 className="text-lg font-medium text-ink-charcoal mb-3">Countdown Settings</h4>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <span className="text-sm font-medium text-ink-caption">Countdown Enabled</span>
//                 <span className="text-base">{data.countdownEnabled ? "Yes" : "No"}</span>
//               </div>
//               {data.countdownEnabled && (
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-ink-caption">Countdown Target</span>
//                   <span className="text-base">{data.countdownTargetDate || "—"}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Step 2: Highlights */}
//       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-info mb-4">Event Highlights</h3>
//         {data.highlights?.length ? (
//           <div className="flex flex-wrap gap-2">
//             {data.highlights.map((highlight: any, index: number) => (
//               <span
//                 key={index}
//                 className="px-3 py-2 rounded-lg text-sm bg-status-info/15 text-status-info border border-status-info/25"
//               >
//                 {highlight.highlightText || "Untitled highlight"}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No highlights added</p>
//         )}
//       </div>

//       {/* Step 2: CTA Buttons */}
//       <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-success mb-4">Call-to-Action Buttons</h3>
//         {data.ctaButtons?.length ? (
//           <div className="space-y-4">
//             {data.ctaButtons.map((cta: any, index: number) => (
//               <div key={index} className="p-4 bg-surface-card border border-status-success/15 rounded-lg">
//                 <div className="flex flex-col md:flex-row md:items-center gap-2">
//                   <span className="font-medium text-ink-paragraph">Label:</span>
//                   <span className="text-base">{cta.label || "—"}</span>
//                   <span className="hidden md:block text-ink-caption mx-2">•</span>
//                   <span className="font-medium text-ink-paragraph">Link:</span>
//                   {cta.link ? (
//                     <a 
//                       href={cta.link} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="text-status-info underline hover:text-status-info"
//                     >
//                       {cta.link}
//                     </a>
//                   ) : (
//                     <span className="text-base">—</span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No CTA buttons added</p>
//         )}
//       </div>

//       {/* Step 3: Sections */}
//       <div className="bg-gradient-to-r from-brand-gold/10 to-white border border-brand-gold/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-brand-gold mb-4">Event Sections</h3>
//         {data.sections?.length ? (
//           <div className="space-y-4">
//             {data.sections.map((section: any, index: number) => (
//               <div key={index} className="p-4 bg-surface-card border border-brand-gold/15 rounded-lg">
//                 <h4 className="font-semibold text-lg text-brand-gold mb-2">
//                   {section.title || "Untitled Section"}
//                 </h4>
//                 {section.description && (
//                   <p className="text-ink-paragraph">{section.description}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No sections added</p>
//         )}
//       </div>

//       {/* Step 3: Specialized Zones */}
//       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-info mb-4">Specialized Zones</h3>
//         {data.zones?.length ? (
//           <div className="space-y-4">
//             {data.zones.map((zone: any, index: number) => (
//               <div key={index} className="p-4 bg-surface-card border border-status-info/15 rounded-lg">
//                 <h4 className="font-semibold text-lg text-status-info mb-2">
//                   {zone.zoneTitle || "Untitled Zone"}
//                 </h4>
//                 {zone.description && (
//                   <p className="text-ink-paragraph">{zone.description}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No zones added</p>
//         )}
//       </div>

//       {/* Step 4: Speakers */}
//       <div className="bg-gradient-to-r from-status-warning/10 to-white border border-status-warning/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-warning mb-4">Speakers</h3>
//         {data.speakers?.length ? (
//           <div className="grid md:grid-cols-2 gap-4">
//             {data.speakers.map((speaker: any, index: number) => (
//               <div key={index} className="p-4 bg-surface-card border border-status-warning/15 rounded-lg">
//                 <h4 className="font-semibold text-lg text-status-warning mb-2">
//                   {speaker.name || "Unnamed Speaker"}
//                 </h4>
//                 <div className="space-y-1 text-sm text-ink-paragraph">
//                   {speaker.designation && <div>Designation: {speaker.designation}</div>}
//                   {speaker.organization && <div>Organization: {speaker.organization}</div>}
//                   {speaker.day && <div>Day: {speaker.day}</div>}
//                   {speaker.sequence && <div>Sequence: {speaker.sequence}</div>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No speakers added</p>
//         )}
//       </div>

//       {/* Step 4: Themes */}
//       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-info mb-4">Event Themes</h3>
//         {data.themes?.length ? (
//           <div className="space-y-4">
//             {data.themes.map((theme: any, index: number) => (
//               <div key={index} className="p-4 bg-surface-card border border-status-info/15 rounded-lg">
//                 <h4 className="font-semibold text-lg text-status-info mb-2">
//                   {theme.themeTitle || "Untitled Theme"}
//                 </h4>
//                 <div className="space-y-1 text-sm text-ink-paragraph">
//                   {theme.day && <div>Day: {theme.day}</div>}
//                   {theme.details && <div>Details: {theme.details}</div>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No themes added</p>
//         )}
//       </div>

//       {/* Step 4: Partners */}
//       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-info mb-4">Partners & Sponsors</h3>
//         {data.partners?.length ? (
//           <div className="flex flex-wrap gap-2">
//             {data.partners.map((partner: any, index: number) => (
//               <span
//                 key={index}
//                 className="px-3 py-2 rounded-lg text-sm bg-status-info/15 text-status-info border border-status-info/25"
//               >
//                 {partner.partnerName || "Unnamed Partner"}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No partners added</p>
//         )}
//       </div>

//       {/* Step 5: Exhibitor Interviews */}
//       <div className="bg-gradient-to-r from-status-error/10 to-white border border-status-error/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-error mb-4">Exhibitor Interviews</h3>
//         {data.exhibitorInterviews?.length ? (
//           <div className="space-y-4">
//             {data.exhibitorInterviews.map((interview: any, index: number) => (
//               <div key={index} className="p-4 bg-surface-card border border-status-error/15 rounded-lg">
//                 <h4 className="font-semibold text-lg text-status-error mb-2">
//                   {interview.videoTitle || "Untitled Interview"}
//                 </h4>
//                 {interview.videoUrl && (
//                   <a 
//                     href={interview.videoUrl} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-status-info underline hover:text-status-info"
//                   >
//                     {interview.videoUrl}
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No exhibitor interviews added</p>
//         )}
//       </div>

//       {/* Step 5: Images Gallery */}
//       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-info mb-4">Images Gallery</h3>
//         {imageGallery.filter((media: any) => media.mediaUrl).length ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {imageGallery.map((media: any, index: number) => (
//               media.mediaUrl && (
//                 <div key={index} className="p-4 bg-surface-card border border-status-info/15 rounded-lg">
//                   <div className="flex flex-col items-center text-center">
//                     {/* Image Preview */}
//                     <div className="relative group mb-3">
//                       <div className="w-full h-32 bg-ink-light rounded-lg overflow-hidden flex items-center justify-center">
//                         <img 
//                           src={media.mediaUrl} 
//                           alt={`Image ${index + 1}`}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.style.display = 'none';
//                             const fallback = e.currentTarget.parentElement?.querySelector('.fallback-preview') as HTMLElement;
//                             if (fallback) {
//                               fallback.classList.remove('hidden');
//                             }
//                           }}
//                         />
//                         <div className="fallback-preview hidden w-full h-full flex items-center justify-center">
//                           <div className="text-center">
//                             <ImageIcon className="w-8 h-8 text-status-info mx-auto" />
//                             <p className="text-xs text-ink-paragraph mt-1">Image Preview</p>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => openFullView(media.mediaUrl, media.fileName || `Image ${index + 1}`, 'image')}
//                           className="p-1 bg-ink bg-opacity-50 text-white rounded"
//                           title="View full size"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
                    
//                     {/* File Info */}
//                     <div className="w-full">
//                       <div className="text-sm font-medium text-ink-charcoal truncate">
//                         {media.fileName || `Image ${index + 1}`}
//                       </div>
//                       <div className="text-xs text-ink-caption mt-1">
//                         {getFileTypeDisplayName('image')}
//                       </div>
//                       {media.uploaded !== false && (
//                         <div className="text-xs text-status-success mt-1 font-medium">
//                           ✓ Uploaded to Cloud
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No images uploaded</p>
//         )}
//       </div>

//       {/* Step 5: Documents Gallery */}
//       <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-success mb-4">Documents Gallery</h3>
//         {documentGallery.filter((media: any) => media.mediaUrl).length ? (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {documentGallery.map((media: any, index: number) => (
//               media.mediaUrl && (
//                 <div key={index} className="p-4 bg-surface-card border border-status-success/15 rounded-lg">
//                   <div className="flex flex-col items-center text-center">
//                     {/* Document Preview */}
//                     <div className="mb-3">
//                       <div className="w-full h-32 bg-ink-offwhite rounded-lg border flex items-center justify-center">
//                         <div className="text-center">
//                           {getFileIcon(getFileType(media.mediaUrl, media.fileName, media.mediaType))}
//                           <p className="text-xs text-ink-paragraph mt-1">
//                             {getFileTypeDisplayName(getFileType(media.mediaUrl, media.fileName, media.mediaType))}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* File Info */}
//                     <div className="w-full">
//                       <div className="text-sm font-medium text-ink-charcoal truncate">
//                         {media.fileName || `Document ${index + 1}`}
//                       </div>
//                       <div className="text-xs text-ink-caption mt-1">
//                         {getFileTypeDisplayName(getFileType(media.mediaUrl, media.fileName, media.mediaType))}
//                       </div>
//                       {media.uploaded !== false && (
//                         <div className="text-xs text-status-success mt-1 font-medium">
//                           ✓ Uploaded to Cloud
//                         </div>
//                       )}
//                     </div>

//                     {/* View Button */}
//                     <button
//                       onClick={() => openFullView(
//                         media.mediaUrl, 
//                         media.fileName || `Document ${index + 1}`, 
//                         getFileType(media.mediaUrl, media.fileName, media.mediaType)
//                       )}
//                       className="mt-3 w-full px-3 py-2 bg-status-info text-white text-sm rounded hover:bg-status-info transition-colors flex items-center justify-center gap-1"
//                     >
//                       <Eye className="w-4 h-4" />
//                       View Document
//                     </button>
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No documents uploaded</p>
//         )}
//       </div>

//       {/* Step 5: Contact Information */}
//       <div className="bg-gradient-to-r from-ink-offwhite to-white border border-ink-light rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-ink-charcoal mb-4">Contact Information</h3>
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Phone Numbers */}
//           <div>
//             <h4 className="font-medium text-ink-paragraph mb-2">Phone Numbers</h4>
//             {data.contactInfo?.phone?.length ? (
//               <div className="space-y-1">
//                 {data.contactInfo.phone.map((phone: any, index: number) => (
//                   <div key={index} className="text-ink-paragraph">
//                     {phone.phoneNumber || "—"}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-ink-caption">No phone numbers added</p>
//             )}
//           </div>

//           {/* Email & Address */}
//           <div className="space-y-4">
//             <div>
//               <h4 className="font-medium text-ink-paragraph mb-2">Email</h4>
//               <div className="text-ink-paragraph">{data.contactInfo?.email || "—"}</div>
//             </div>
//             <div>
//               <h4 className="font-medium text-ink-paragraph mb-2">Address</h4>
//               <div className="text-ink-paragraph">{data.contactInfo?.address || "—"}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Step 5: International Contacts */}
//       <div className="bg-gradient-to-r from-surface-main to-white border border-brand-yellow-soft rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-brand-gold mb-4">International Contacts</h3>
//         {data.internationalContacts?.length ? (
//           <div className="grid md:grid-cols-2 gap-4">
//             {data.internationalContacts.map((contact: any, index: number) => (
//               <div key={index} className="p-4 bg-surface-card border border-brand-yellow-soft rounded-lg">
//                 <h4 className="font-semibold text-brand-gold mb-2">
//                   {contact.name || "Unnamed Contact"}
//                 </h4>
//                 <div className="space-y-1 text-sm text-ink-paragraph">
//                   {contact.organization && <div>Organization: {contact.organization}</div>}
//                   {contact.phone && <div>Phone: {contact.phone}</div>}
//                   {contact.email && <div>Email: {contact.email}</div>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No international contacts added</p>
//         )}
//       </div>

//       {/* Step 5: Social Links */}
//       <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-info mb-4">Social Media Links</h3>
//         <div className="grid md:grid-cols-3 gap-4">
//           {data.socialLinks?.facebook && (
//             <div className="flex flex-col">
//               <span className="text-sm font-medium text-ink-caption">Facebook</span>
//               <a 
//                 href={data.socialLinks.facebook} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-status-info underline hover:text-status-info"
//               >
//                 {data.socialLinks.facebook}
//               </a>
//             </div>
//           )}
//           {data.socialLinks?.linkedin && (
//             <div className="flex flex-col">
//               <span className="text-sm font-medium text-ink-caption">LinkedIn</span>
//               <a 
//                 href={data.socialLinks.linkedin} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-status-info underline hover:text-status-info"
//               >
//                 {data.socialLinks.linkedin}
//               </a>
//             </div>
//           )}
//           {data.socialLinks?.instagram && (
//             <div className="flex flex-col">
//               <span className="text-sm font-medium text-ink-caption">Instagram</span>
//               <a 
//                 href={data.socialLinks.instagram} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-status-info underline hover:text-status-info"
//               >
//                 {data.socialLinks.instagram}
//               </a>
//             </div>
//           )}
//           {!data.socialLinks?.facebook && !data.socialLinks?.linkedin && !data.socialLinks?.instagram && (
//             <p className="text-ink-caption md:col-span-3">No social media links added</p>
//           )}
//         </div>
//       </div>

//       {/* Step 5: Tags */}
//       <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-status-success mb-4">Event Tags</h3>
//         {data.tags?.length ? (
//           <div className="flex flex-wrap gap-2">
//             {data.tags.map((tag: string, index: number) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 rounded-full text-sm bg-status-success/15 text-status-success border border-status-success/25"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-ink-caption">No tags added</p>
//         )}
//       </div>

//       {/* Step 5: Publishing Settings */}
//       <div className="bg-gradient-to-r from-brand-gold/10 to-white border border-brand-gold/25 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-brand-gold mb-4">Publishing Settings</h3>
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="flex flex-col">
//             <span className="text-sm font-medium text-ink-caption">Published Status</span>
//             <span className={`text-base font-semibold ${
//               data.published ? 'text-status-success' : 'text-ink-paragraph'
//             }`}>
//               {data.published ? 'Published' : 'Draft'}
//             </span>
//           </div>
//           {data.lastModified && (
//             <div className="flex flex-col">
//               <span className="text-sm font-medium text-ink-caption">Last Modified</span>
//               <span className="text-base">{new Date(data.lastModified).toLocaleString()}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import { useForm } from "../../context/FormContext";
import { useState } from "react";
import { Eye, X, RefreshCw, FileText, Image as ImageIcon } from "lucide-react";

export const Summary = () => {
  const { data } = useForm();

  // State for full view modal
  const [fullViewUrl, setFullViewUrl] = useState<string | null>(null);
  const [fullViewType, setFullViewType] = useState<string | null>(null);
  const [fullViewFileName, setFullViewFileName] = useState<string | null>(null);

  // File type detection function
  const getFileType = (url: string, fileName?: string, mediaType?: string): string => {
    if (mediaType) return mediaType;
    
    const lower = url.toLowerCase();
    const lowerFileName = fileName?.toLowerCase() || '';
    
    // Check for image file extensions
    if (lower.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)($|\?)/) || 
        lowerFileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/) ||
        lower.startsWith('data:image/')) {
      return 'image';
    } else if (lower.endsWith(".pdf") || lowerFileName.endsWith(".pdf")) {
      return 'pdf';
    } else if (lower.match(/\.(doc|docx)($|\?)/) || lowerFileName.match(/\.(doc|docx)$/)) {
      return 'word';
    } else if (lower.match(/\.(xls|xlsx)($|\?)/) || lowerFileName.match(/\.(xls|xlsx)$/)) {
      return 'excel';
    } else if (lower.match(/\.(ppt|pptx)($|\?)/) || lowerFileName.match(/\.(ppt|pptx)$/)) {
      return 'powerpoint';
    } else if (lower.endsWith(".txt") || lowerFileName.endsWith(".txt")) {
      return 'text';
    } else {
      return 'document';
    }
  };

  // Get appropriate icon for file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="w-6 h-6 text-status-info" />;
      case 'pdf':
        return <FileText className="w-6 h-6 text-status-error" />;
      case 'word':
        return <FileText className="w-6 h-6 text-status-info" />;
      case 'excel':
        return <FileText className="w-6 h-6 text-status-success" />;
      case 'powerpoint':
        return <FileText className="w-6 h-6 text-status-warning" />;
      case 'text':
        return <FileText className="w-6 h-6 text-ink-paragraph" />;
      default:
        return <FileText className="w-6 h-6 text-ink-caption" />;
    }
  };

  // Get display name for file type
  const getFileTypeDisplayName = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return 'Image';
      case 'pdf':
        return 'PDF Document';
      case 'word':
        return 'Word Document';
      case 'excel':
        return 'Excel Spreadsheet';
      case 'powerpoint':
        return 'PowerPoint Presentation';
      case 'text':
        return 'Text File';
      default:
        return 'Document';
    }
  };

  // Function to open full view
  const openFullView = (url: string, fileName: string, mediaType?: string) => {
    let fileType = mediaType || getFileType(url);
    setFullViewUrl(url);
    setFullViewType(fileType);
    setFullViewFileName(fileName);
  };

  // Function to close full view
  const closeFullView = () => {
    setFullViewUrl(null);
    setFullViewType(null);
    setFullViewFileName(null);
  };

  // Render full view modal
  const renderFullViewModal = () => {
    if (!fullViewUrl || !fullViewType) return null;

    return (
      <div className="fixed inset-0 bg-ink bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-card rounded-xl shadow-2xl max-w-4xl max-h-[80vh] w-full flex flex-col mt-12">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-ink-charcoal truncate">
              {fullViewFileName}
            </h3>
            <button
              onClick={closeFullView}
              className="p-2 hover:bg-ink-light rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {fullViewType === 'image' ? (
              <div className="flex justify-center">
                <img
                  src={fullViewUrl}
                  alt="Full view"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            ) : fullViewType === 'pdf' ? (
              <div className="w-full h-[70vh]">
                <iframe
                  src={fullViewUrl}
                  className="w-full h-full border-0"
                  title="PDF Document"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-center p-6">
                  {getFileIcon(fullViewType)}
                  <p className="text-lg font-medium text-ink-paragraph mb-2 mt-4">
                    {getFileTypeDisplayName(fullViewType)}
                  </p>
                  <p className="text-ink-caption mb-4">
                    This document type cannot be previewed in the browser.
                  </p>
                  <a
                    href={fullViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-status-info text-white rounded-lg hover:bg-status-info transition-colors"
                    onClick={closeFullView}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Download & Open
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-4 border-t bg-ink-offwhite rounded-b-xl">
            <span className="text-sm text-ink-paragraph capitalize">
              {getFileTypeDisplayName(fullViewType)}
            </span>
            <div className="flex gap-2">
              <a
                href={fullViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-ink-light text-ink-paragraph rounded-lg hover:bg-ink-light transition-colors"
                onClick={closeFullView}
              >
                Open in New Tab
              </a>
              <a
                href={fullViewUrl}
                download={fullViewFileName}
                className="px-4 py-2 bg-status-success text-white rounded-lg hover:bg-status-success transition-colors"
                onClick={closeFullView}
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Split media gallery into images only (since documents gallery is removed)
  const imageGallery = data.mediaGallery?.slice(0, 3) || [];

  return (
    <div className="space-y-10">
      {/* Full View Modal */}
      {renderFullViewModal()}

      {/* Title */}
      <h2 className="text-3xl font-bold text-brand-gold border-b-4 border-brand-yellow-soft pb-2">
        Event Summary
      </h2>

      {/* Step 1: Basic Event Information */}
      <div className="bg-gradient-to-r from-surface-main to-white border border-brand-yellow-soft rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-brand-gold mb-4">Basic Event Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-ink-paragraph">
          {/* Event Details */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-ink-charcoal mb-3">Event Details</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption">Event Title</span>
                <span className="text-base font-semibold">{data.eventTitle || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption">Event Tagline</span>
                <span className="text-base">{data.eventTagline || "—"}</span>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <span className="text-sm font-medium text-ink-caption">Event Description</span>
                <span className="text-base">{data.eventDescription || "—"}</span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-ink-charcoal mb-3">Date & Time</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption">Start Date</span>
                <span className="text-base">{data.startDate || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption">End Date</span>
                <span className="text-base">{data.endDate || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption">Start Time</span>
                <span className="text-base">{data.timeStart || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption">End Time</span>
                <span className="text-base">{data.timeEnd || "—"}</span>
              </div>
            </div>
          </div>

          {/* Venue Information */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-ink-charcoal mb-3">Venue Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink-caption">Venue Name</span>
                <span className="text-base">{data.venueName || "—"}</span>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <span className="text-sm font-medium text-ink-caption">Venue Address</span>
                <span className="text-base">{data.venueAddress || "—"}</span>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-ink-caption">Organizer</span>
            <span className="text-base">{data.organizer || "—"}</span>
          </div>
        </div>
      </div>

      {/* Step 2: Highlights */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Event Highlights</h3>
        {data.highlights?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.highlights.map((highlight: any, index: number) => (
              <span
                key={index}
                className="px-3 py-2 rounded-lg text-sm bg-status-info/15 text-status-info border border-status-info/25"
              >
                {highlight.highlightText || "Untitled highlight"}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No highlights added</p>
        )}
      </div>

      {/* Step 2: CTA Buttons */}
      <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-success mb-4">Call-to-Action Buttons</h3>
        {data.ctaButtons?.length ? (
          <div className="space-y-4">
            {data.ctaButtons.map((cta: any, index: number) => (
              <div key={index} className="p-4 bg-surface-card border border-status-success/15 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="font-medium text-ink-paragraph">Label:</span>
                  <span className="text-base">{cta.label || "—"}</span>
                  <span className="hidden md:block text-ink-caption mx-2">•</span>
                  <span className="font-medium text-ink-paragraph">Link:</span>
                  {cta.link ? (
                    <a 
                      href={cta.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-status-info underline hover:text-status-info"
                    >
                      {cta.link}
                    </a>
                  ) : (
                    <span className="text-base">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No CTA buttons added</p>
        )}
      </div>

      {/* Step 3: Sections */}
      <div className="bg-gradient-to-r from-brand-gold/10 to-white border border-brand-gold/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-brand-gold mb-4">Event Sections</h3>
        {data.sections?.length ? (
          <div className="space-y-4">
            {data.sections.map((section: any, index: number) => (
              <div key={index} className="p-4 bg-surface-card border border-brand-gold/15 rounded-lg">
                <h4 className="font-semibold text-lg text-brand-gold mb-2">
                  {section.title || "Untitled Section"}
                </h4>
                {section.description && (
                  <p className="text-ink-paragraph">{section.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No sections added</p>
        )}
      </div>

      {/* Step 3: Specialized Zones */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Specialized Zones</h3>
        {data.zones?.length ? (
          <div className="space-y-4">
            {data.zones.map((zone: any, index: number) => (
              <div key={index} className="p-4 bg-surface-card border border-status-info/15 rounded-lg">
                <h4 className="font-semibold text-lg text-status-info mb-2">
                  {zone.zoneTitle || "Untitled Zone"}
                </h4>
                {zone.description && (
                  <p className="text-ink-paragraph">{zone.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No zones added</p>
        )}
      </div>

      {/* Step 4: Speakers */}
      <div className="bg-gradient-to-r from-status-warning/10 to-white border border-status-warning/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-warning mb-4">Speakers</h3>
        {data.speakers?.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {data.speakers.map((speaker: any, index: number) => (
              <div key={index} className="p-4 bg-surface-card border border-status-warning/15 rounded-lg">
                <h4 className="font-semibold text-lg text-status-warning mb-2">
                  {speaker.name || "Unnamed Speaker"}
                </h4>
                <div className="space-y-1 text-sm text-ink-paragraph">
                  {speaker.designation && <div>Designation: {speaker.designation}</div>}
                  {speaker.organization && <div>Organization: {speaker.organization}</div>}
                  {speaker.day && <div>Day: {speaker.day}</div>}
                  {speaker.sequence && <div>Sequence: {speaker.sequence}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No speakers added</p>
        )}
      </div>

      {/* Step 4: Themes */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Event Themes</h3>
        {data.themes?.length ? (
          <div className="space-y-4">
            {data.themes.map((theme: any, index: number) => (
              <div key={index} className="p-4 bg-surface-card border border-status-info/15 rounded-lg">
                <h4 className="font-semibold text-lg text-status-info mb-2">
                  {theme.themeTitle || "Untitled Theme"}
                </h4>
                <div className="space-y-1 text-sm text-ink-paragraph">
                  {theme.day && <div>Day: {theme.day}</div>}
                  {theme.details && <div>Details: {theme.details}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No themes added</p>
        )}
      </div>

      {/* Step 4: Partners */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Partners & Sponsors</h3>
        {data.partners?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.partners.map((partner: any, index: number) => (
              <span
                key={index}
                className="px-3 py-2 rounded-lg text-sm bg-status-info/15 text-status-info border border-status-info/25"
              >
                {partner.partnerName || "Unnamed Partner"}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No partners added</p>
        )}
      </div>

      {/* Step 5: Exhibitor Interviews */}
      <div className="bg-gradient-to-r from-status-error/10 to-white border border-status-error/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-error mb-4">Exhibitor Interviews</h3>
        {data.exhibitorInterviews?.length ? (
          <div className="space-y-4">
            {data.exhibitorInterviews.map((interview: any, index: number) => (
              <div key={index} className="p-4 bg-surface-card border border-status-error/15 rounded-lg">
                <h4 className="font-semibold text-lg text-status-error mb-2">
                  {interview.videoTitle || "Untitled Interview"}
                </h4>
                {interview.videoUrl && (
                  <a 
                    href={interview.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-status-info underline hover:text-status-info"
                  >
                    {interview.videoUrl}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No exhibitor interviews added</p>
        )}
      </div>

      {/* Step 5: Images Gallery */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Images Gallery</h3>
        {imageGallery.filter((media: any) => media.mediaUrl).length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imageGallery.map((media: any, index: number) => (
              media.mediaUrl && (
                <div key={index} className="p-4 bg-surface-card border border-status-info/15 rounded-lg">
                  <div className="flex flex-col items-center text-center">
                    {/* Image Preview */}
                    <div className="relative group mb-3">
                      <div className="w-full h-32 bg-ink-light rounded-lg overflow-hidden flex items-center justify-center">
                        <img 
                          src={media.mediaUrl} 
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-preview') as HTMLElement;
                            if (fallback) {
                              fallback.classList.remove('hidden');
                            }
                          }}
                        />
                        <div className="fallback-preview hidden w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 text-status-info mx-auto" />
                            <p className="text-xs text-ink-paragraph mt-1">Image Preview</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openFullView(media.mediaUrl, media.fileName || `Image ${index + 1}`, 'image')}
                          className="p-1 bg-ink bg-opacity-50 text-white rounded"
                          title="View full size"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* File Info */}
                    <div className="w-full">
                      <div className="text-sm font-medium text-ink-charcoal truncate">
                        {media.fileName || `Image ${index + 1}`}
                      </div>
                      <div className="text-xs text-ink-caption mt-1">
                        {getFileTypeDisplayName('image')}
                      </div>
                      {media.uploaded !== false && (
                        <div className="text-xs text-status-success mt-1 font-medium">
                          ✓ Uploaded to Cloud
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No images uploaded</p>
        )}
      </div>

      {/* Step 5: Contact Information */}
      <div className="bg-gradient-to-r from-ink-offwhite to-white border border-ink-light rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-ink-charcoal mb-4">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone Numbers */}
          <div>
            <h4 className="font-medium text-ink-paragraph mb-2">Phone Numbers</h4>
            {data.contactInfo?.phone?.length ? (
              <div className="space-y-1">
                {data.contactInfo.phone.map((phone: any, index: number) => (
                  <div key={index} className="text-ink-paragraph">
                    {phone.phoneNumber || "—"}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-ink-caption">No phone numbers added</p>
            )}
          </div>

          {/* Email & Address */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-ink-paragraph mb-2">Email</h4>
              <div className="text-ink-paragraph">{data.contactInfo?.email || "—"}</div>
            </div>
            <div>
              <h4 className="font-medium text-ink-paragraph mb-2">Address</h4>
              <div className="text-ink-paragraph">{data.contactInfo?.address || "—"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 5: International Contacts */}
      <div className="bg-gradient-to-r from-surface-main to-white border border-brand-yellow-soft rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-brand-gold mb-4">International Contacts</h3>
        {data.internationalContacts?.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {data.internationalContacts.map((contact: any, index: number) => (
              <div key={index} className="p-4 bg-surface-card border border-brand-yellow-soft rounded-lg">
                <h4 className="font-semibold text-brand-gold mb-2">
                  {contact.name || "Unnamed Contact"}
                </h4>
                <div className="space-y-1 text-sm text-ink-paragraph">
                  {contact.organization && <div>Organization: {contact.organization}</div>}
                  {contact.phone && <div>Phone: {contact.phone}</div>}
                  {contact.email && <div>Email: {contact.email}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No international contacts added</p>
        )}
      </div>

      {/* Step 5: Social Links */}
      <div className="bg-gradient-to-r from-status-info/10 to-white border border-status-info/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-info mb-4">Social Media Links</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {data.socialLinks?.facebook && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-ink-caption">Facebook</span>
              <a
                href={data.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-status-info underline hover:text-status-info break-all"
              >
                {data.socialLinks.facebook}
              </a>
            </div>
          )}
          {data.socialLinks?.linkedin && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-ink-caption">LinkedIn</span>
              <a
                href={data.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-status-info underline hover:text-status-info break-all"
              >
                {data.socialLinks.linkedin}
              </a>
            </div>
          )}
          {data.socialLinks?.instagram && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-ink-caption">Instagram</span>
              <a
                href={data.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-status-info underline hover:text-status-info break-all"
              >
                {data.socialLinks.instagram}
              </a>
            </div>
          )}
          {!data.socialLinks?.facebook && !data.socialLinks?.linkedin && !data.socialLinks?.instagram && (
            <p className="text-ink-caption md:col-span-3">No social media links added</p>
          )}
        </div>
      </div>

      {/* Step 5: Tags */}
      <div className="bg-gradient-to-r from-status-success/10 to-white border border-status-success/25 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-status-success mb-4">Event Tags</h3>
        {data.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm bg-status-success/15 text-status-success border border-status-success/25"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-ink-caption">No tags added</p>
        )}
      </div>
    </div>
  );
};