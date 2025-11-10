// import { useForm } from "../../context/FormContext";

// export const Summary = () => {
//   const { data } = useForm();
//   console.log("summary payload data", data);

//   return (
//     <div className="space-y-10">
//       {/* Title */}
//       <h2 className="text-3xl font-bold text-yellow-700 border-b-4 border-yellow-300 pb-2">
//         Summary
//       </h2>

//       {/* Basic Info */}
//       <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-yellow-800 mb-4">Basic Info</h3>
//         <div className="grid md:grid-cols-2 gap-4 text-gray-700">
//           {Object.entries(data.basicInfo || {}).map(([key, value]) => (
//             <div key={key} className="flex flex-col">
//               <span className="text-sm font-medium text-gray-500 capitalize">
//                 {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//               </span>
//               <span className="text-base">{value || "—"}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Address Information */}
//       <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-blue-800 mb-4">Address Information</h3>
//         {data.addressInformation && Object.keys(data.addressInformation).length > 0 ? (
//           <div className="grid md:grid-cols-2 gap-4 text-gray-700">
//             {Object.entries(data.addressInformation).map(([key, value]) => (
//               <div key={key} className="flex flex-col">
//                 <span className="text-sm font-medium text-gray-500 capitalize">
//                   {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                 </span>
//                 <span className="text-base">{value || "—"}</span>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No address information provided</p>
//         )}
//       </div>

//       {/* Alternate Contact */}
//       <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-green-800 mb-4">Alternate Contact</h3>
//         {data.alternateContact && Object.keys(data.alternateContact).length > 0 ? (
//           <div className="grid md:grid-cols-2 gap-4 text-gray-700">
//             {Object.entries(data.alternateContact).map(([key, value]) => (
//               <div key={key} className="flex flex-col">
//                 <span className="text-sm font-medium text-gray-500 capitalize">
//                   {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                 </span>
//                 <span className="text-base">{value || "—"}</span>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No alternate contact provided</p>
//         )}
//       </div>

//       {/* Social Media Links */}
//       <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-purple-800 mb-4">Social Media Links</h3>
//         {data.socialMediaLinks && Object.keys(data.socialMediaLinks).length > 0 ? (
//           <div className="grid md:grid-cols-2 gap-4 text-gray-700">
//             {Object.entries(data.socialMediaLinks).map(([key, value]) => (
//               <div key={key} className="flex flex-col">
//                 <span className="text-sm font-medium text-gray-500 capitalize">
//                   {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                 </span>
//                 {value && value.toString().startsWith('http') ? (
//                   <a 
//                     href={value.toString()} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline hover:text-blue-800"
//                   >
//                     {value}
//                   </a>
//                 ) : (
//                   <span className="text-base">{value || "—"}</span>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No social media links provided</p>
//         )}
//       </div>

//       {/* Categories */}
//       <div className="bg-gradient-to-r from-orange-50 to-white border border-orange-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-orange-800 mb-4">Categories</h3>
//         {data.categories?.length ? (
//           <div className="flex flex-wrap gap-2">
//             {data.categories.map((cat: string, i: number) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 border border-orange-200"
//               >
//                 {cat}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No categories selected</p>
//         )}
//       </div>

//       {/* Subcategories */}
//       <div className="bg-gradient-to-r from-teal-50 to-white border border-teal-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-teal-800 mb-4">Subcategories</h3>
//         {data.subcategories?.length ? (
//           <div className="flex flex-wrap gap-2">
//             {data.subcategories.map((sub: any, i: number) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-700 border border-teal-200"
//               >
//                 {sub.parent} › {sub.name}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No subcategories selected</p>
//         )}
//       </div>

//       {/* Skills */}
//       <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-indigo-800 mb-4">Skills</h3>
//         {data.skills?.length ? (
//           <div className="flex flex-wrap gap-2">
//             {data.skills.map((skill: string, i: number) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700 border border-indigo-200"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No skills selected</p>
//         )}
//       </div>

//       {/* Freeform Skills */}
//       <div className="bg-gradient-to-r from-pink-50 to-white border border-pink-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-pink-800 mb-4">Freeform Skills</h3>
//         {data.freeformSkills?.length ? (
//           <div className="flex flex-wrap gap-2">
//             {data.freeformSkills.map((skill: string, i: number) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-700 border border-pink-200"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No freeform skills added</p>
//         )}
//       </div>

//       {/* Projects */}
//       <div className="bg-gradient-to-r from-cyan-50 to-white border border-cyan-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-cyan-800 mb-4">Projects</h3>
//         {data.projects?.length ? (
//           <div className="flex flex-col gap-4">
//             {data.projects.map((proj: any, i: number) => (
//               <div
//                 key={i}
//                 className="p-4 bg-white border border-cyan-100 rounded-lg shadow-sm w-full"
//               >
//                 {Object.entries(proj).map(([field, value]) => {
//                   const strValue = String(value);
//                   return (
//                     <div key={field} className="mb-2">
//                       <span className="font-medium text-gray-700 capitalize">
//                         {field.replace(/_/g, " ")}:
//                       </span>{" "}
//                       {strValue.startsWith("http") ? (
//                         <a
//                           href={strValue}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 underline ml-1"
//                         >
//                           {strValue}
//                         </a>
//                       ) : (
//                         <span className="text-gray-600 ml-1">{strValue}</span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No projects added</p>
//         )}
//       </div>

//       {/* Services */}
//       <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-emerald-800 mb-4">Services</h3>
//         {data.services?.length ? (
//           <div className="flex flex-col gap-4">
//             {data.services.map((srv: any, i: number) => (
//               <div
//                 key={i}
//                 className="p-4 bg-white border border-emerald-100 rounded-lg shadow-sm w-full"
//               >
//                 {Object.entries(srv).map(([field, value]) => {
//                   const strValue = String(value);
//                   return (
//                     <div key={field} className="mb-2">
//                       <span className="font-medium text-gray-700 capitalize">
//                         {field.replace(/_/g, " ")}:
//                       </span>{" "}
//                       {strValue.startsWith("http") ? (
//                         <a
//                           href={strValue}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 underline ml-1"
//                         >
//                           {strValue}
//                         </a>
//                       ) : (
//                         <span className="text-gray-600 ml-1">{strValue}</span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No services added</p>
//         )}
//       </div>

//       {/* Media */}
//       <div className="bg-gradient-to-r from-rose-50 to-white border border-rose-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-rose-800 mb-4">Media</h3>
//         {data.media?.length ? (
//           <div className="flex flex-wrap gap-4">
//             {data.media.map((m: any, i: number) => (
//               <div
//                 key={i}
//                 className="w-40 p-2 bg-white border border-rose-100 rounded-lg shadow-sm flex flex-col items-center"
//               >
//                 {m.fileUrl?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
//                   <img
//                     src={m.fileUrl}
//                     alt={m.fieldName}
//                     className="w-32 h-32 object-cover rounded mb-2"
//                   />
//                 ) : (
//                   <div className="text-gray-500 text-sm mb-2">{m.fieldName}</div>
//                 )}
//                 <a
//                   href={m.fileUrl}
//                   target="_blank"
//                   className="text-blue-500 text-sm underline"
//                 >
//                   View
//                 </a>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No media uploaded</p>
//         )}
//       </div>

//       {/* Resume */}
//       <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-sm">
//         <h3 className="text-xl font-semibold text-gray-800 mb-4">Resume</h3>
//         {data.resume ? (
//           <div className="flex flex-col gap-3">
//             <div className="whitespace-pre-wrap text-gray-700 text-sm bg-white p-4 rounded-lg border border-gray-100 shadow-inner">
//               <div>
//                 {data.resume.length === 0 ? (
//                   <p>No resume uploaded</p>
//                 ) : (
//                   data.resume.map((doc) => (
//                     <div key={doc.id} className="mb-4 border p-3 rounded bg-gray-50">
//                       <p><strong>Name:</strong> {doc.name}</p>
//                       <p><strong>Type:</strong> {doc.type}</p>
//                       <p><strong>Size:</strong> {doc.size} bytes</p>
//                       <p><strong>Uploaded:</strong> {new Date(doc.uploadDate).toLocaleDateString()}</p>
//                       <pre className="text-sm">{doc.extractedText.slice(0, 200)}...</pre>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No resume added</p>
//         )}
//       </div>
//     </div>
//   );
// };


import { useForm } from "../../context/FormContext";

export const Summary = () => {
  const { data } = useForm();
  console.log("Event summary payload data", data);

  return (
    <div className="space-y-10">
      {/* Title */}
      <h2 className="text-3xl font-bold text-yellow-700 border-b-4 border-yellow-300 pb-2">
        Event Summary
      </h2>

      {/* Step 1: Basic Event Information */}
      <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Basic Event Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          {/* Event Details */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Event Details</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Event Title</span>
                <span className="text-base font-semibold">{data.eventTitle || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Event Tagline</span>
                <span className="text-base">{data.eventTagline || "—"}</span>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <span className="text-sm font-medium text-gray-500">Event Description</span>
                <span className="text-base">{data.eventDescription || "—"}</span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Date & Time</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Start Date</span>
                <span className="text-base">{data.startDate || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">End Date</span>
                <span className="text-base">{data.endDate || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Start Time</span>
                <span className="text-base">{data.timeStart || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">End Time</span>
                <span className="text-base">{data.timeEnd || "—"}</span>
              </div>
            </div>
          </div>

          {/* Venue Information */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Venue Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Venue Name</span>
                <span className="text-base">{data.venueName || "—"}</span>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <span className="text-sm font-medium text-gray-500">Venue Address</span>
                <span className="text-base">{data.venueAddress || "—"}</span>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Organizer</span>
            <span className="text-base">{data.organizer || "—"}</span>
          </div>

          {/* Countdown Settings */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Countdown Settings</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Countdown Enabled</span>
                <span className="text-base">{data.countdownEnabled ? "Yes" : "No"}</span>
              </div>
              {data.countdownEnabled && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">Countdown Target</span>
                  <span className="text-base">{data.countdownTargetDate || "—"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Highlights */}
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Event Highlights</h3>
        {data.highlights?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.highlights.map((highlight: any, index: number) => (
              <span
                key={index}
                className="px-3 py-2 rounded-lg text-sm bg-blue-100 text-blue-700 border border-blue-200"
              >
                {highlight.highlightText || "Untitled highlight"}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No highlights added</p>
        )}
      </div>

      {/* Step 2: CTA Buttons */}
      <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Call-to-Action Buttons</h3>
        {data.ctaButtons?.length ? (
          <div className="space-y-4">
            {data.ctaButtons.map((cta: any, index: number) => (
              <div key={index} className="p-4 bg-white border border-green-100 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="font-medium text-gray-700">Label:</span>
                  <span className="text-base">{cta.label || "—"}</span>
                  <span className="hidden md:block text-gray-400 mx-2">•</span>
                  <span className="font-medium text-gray-700">Link:</span>
                  {cta.link ? (
                    <a 
                      href={cta.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
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
          <p className="text-gray-500">No CTA buttons added</p>
        )}
      </div>

      {/* Step 3: Sections */}
      <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Event Sections</h3>
        {data.sections?.length ? (
          <div className="space-y-4">
            {data.sections.map((section: any, index: number) => (
              <div key={index} className="p-4 bg-white border border-purple-100 rounded-lg">
                <h4 className="font-semibold text-lg text-purple-700 mb-2">
                  {section.title || "Untitled Section"}
                </h4>
                {section.description && (
                  <p className="text-gray-600">{section.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No sections added</p>
        )}
      </div>

      {/* Step 3: Specialized Zones */}
      <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">Specialized Zones</h3>
        {data.zones?.length ? (
          <div className="space-y-4">
            {data.zones.map((zone: any, index: number) => (
              <div key={index} className="p-4 bg-white border border-indigo-100 rounded-lg">
                <h4 className="font-semibold text-lg text-indigo-700 mb-2">
                  {zone.zoneTitle || "Untitled Zone"}
                </h4>
                {zone.description && (
                  <p className="text-gray-600">{zone.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No zones added</p>
        )}
      </div>

      {/* Step 4: Speakers */}
      <div className="bg-gradient-to-r from-orange-50 to-white border border-orange-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-orange-800 mb-4">Speakers</h3>
        {data.speakers?.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {data.speakers.map((speaker: any, index: number) => (
              <div key={index} className="p-4 bg-white border border-orange-100 rounded-lg">
                <h4 className="font-semibold text-lg text-orange-700 mb-2">
                  {speaker.name || "Unnamed Speaker"}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {speaker.designation && <div>Designation: {speaker.designation}</div>}
                  {speaker.organization && <div>Organization: {speaker.organization}</div>}
                  {speaker.day && <div>Day: {speaker.day}</div>}
                  {speaker.sequence && <div>Sequence: {speaker.sequence}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No speakers added</p>
        )}
      </div>

      {/* Step 4: Themes */}
      <div className="bg-gradient-to-r from-teal-50 to-white border border-teal-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-teal-800 mb-4">Event Themes</h3>
        {data.themes?.length ? (
          <div className="space-y-4">
            {data.themes.map((theme: any, index: number) => (
              <div key={index} className="p-4 bg-white border border-teal-100 rounded-lg">
                <h4 className="font-semibold text-lg text-teal-700 mb-2">
                  {theme.themeTitle || "Untitled Theme"}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {theme.day && <div>Day: {theme.day}</div>}
                  {theme.details && <div>Details: {theme.details}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No themes added</p>
        )}
      </div>

      {/* Step 4: Partners */}
      <div className="bg-gradient-to-r from-cyan-50 to-white border border-cyan-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-cyan-800 mb-4">Partners & Sponsors</h3>
        {data.partners?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.partners.map((partner: any, index: number) => (
              <span
                key={index}
                className="px-3 py-2 rounded-lg text-sm bg-cyan-100 text-cyan-700 border border-cyan-200"
              >
                {partner.partnerName || "Unnamed Partner"}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No partners added</p>
        )}
      </div>

      {/* Step 5: Exhibitor Interviews */}
      <div className="bg-gradient-to-r from-pink-50 to-white border border-pink-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-pink-800 mb-4">Exhibitor Interviews</h3>
        {data.exhibitorInterviews?.length ? (
          <div className="space-y-4">
            {data.exhibitorInterviews.map((interview: any, index: number) => (
              <div key={index} className="p-4 bg-white border border-pink-100 rounded-lg">
                <h4 className="font-semibold text-lg text-pink-700 mb-2">
                  {interview.videoTitle || "Untitled Interview"}
                </h4>
                {interview.videoUrl && (
                  <a 
                    href={interview.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {interview.videoUrl}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No exhibitor interviews added</p>
        )}
      </div>

      {/* Step 5: Media Gallery */}
      <div className="bg-gradient-to-r from-rose-50 to-white border border-rose-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-rose-800 mb-4">Media Gallery</h3>
        {data.mediaGallery?.length ? (
          <div className="space-y-4">
            {data.mediaGallery.map((media: any, index: number) => (
              <div key={index} className="p-4 bg-white border border-rose-100 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="text-base capitalize">{media.mediaType || "Unknown"}</span>
                  <span className="hidden md:block text-gray-400 mx-2">•</span>
                  <span className="font-medium text-gray-700">URL:</span>
                  {media.mediaUrl ? (
                    <a 
                      href={media.mediaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 truncate"
                    >
                      {media.mediaUrl}
                    </a>
                  ) : (
                    <span className="text-base">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No media gallery items added</p>
        )}
      </div>

      {/* Step 5: Contact Information */}
      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone Numbers */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Phone Numbers</h4>
            {data.contactInfo?.phone?.length ? (
              <div className="space-y-1">
                {data.contactInfo.phone.map((phone: any, index: number) => (
                  <div key={index} className="text-gray-600">
                    {phone.phoneNumber || "—"}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No phone numbers added</p>
            )}
          </div>

          {/* Email & Address */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Email</h4>
              <div className="text-gray-600">{data.contactInfo?.email || "—"}</div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Address</h4>
              <div className="text-gray-600">{data.contactInfo?.address || "—"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 5: International Contacts */}
      <div className="bg-gradient-to-r from-amber-50 to-white border border-amber-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-amber-800 mb-4">International Contacts</h3>
        {data.internationalContacts?.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {data.internationalContacts.map((contact: any, index: number) => (
              <div key={index} className="p-4 bg-white border border-amber-100 rounded-lg">
                <h4 className="font-semibold text-amber-700 mb-2">
                  {contact.name || "Unnamed Contact"}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {contact.organization && <div>Organization: {contact.organization}</div>}
                  {contact.phone && <div>Phone: {contact.phone}</div>}
                  {contact.email && <div>Email: {contact.email}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No international contacts added</p>
        )}
      </div>

      {/* Step 5: Social Links */}
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Social Media Links</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {data.socialLinks?.facebook && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Facebook</span>
              <a 
                href={data.socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {data.socialLinks.facebook}
              </a>
            </div>
          )}
          {data.socialLinks?.linkedin && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">LinkedIn</span>
              <a 
                href={data.socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {data.socialLinks.linkedin}
              </a>
            </div>
          )}
          {data.socialLinks?.instagram && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Instagram</span>
              <a 
                href={data.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {data.socialLinks.instagram}
              </a>
            </div>
          )}
          {!data.socialLinks?.facebook && !data.socialLinks?.linkedin && !data.socialLinks?.instagram && (
            <p className="text-gray-500 md:col-span-3">No social media links added</p>
          )}
        </div>
      </div>

      {/* Step 5: Tags */}
      <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Event Tags</h3>
        {data.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 border border-green-200"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tags added</p>
        )}
      </div>

      {/* Step 5: Publishing Settings */}
      <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Publishing Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Published Status</span>
            <span className={`text-base font-semibold ${
              data.published ? 'text-green-600' : 'text-gray-600'
            }`}>
              {data.published ? 'Published' : 'Draft'}
            </span>
          </div>
          {data.lastModified && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Last Modified</span>
              <span className="text-base">{new Date(data.lastModified).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};