// import React, { useState } from 'react';
// import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

// const GallerySection: React.FC = () => {
//   const [selectedMedia, setSelectedMedia] = useState<any>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const galleryItems = [
//     {
//       type: 'image',
//       src: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800',
//       title: 'Drone Racing Action',
//       category: 'Competition'
//     },
//     {
//       type: 'video',
//       src: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
//       title: 'Innovation Showcase',
//       category: 'Technology'
//     },
//     {
//       type: 'image',
//       src: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
//       title: 'Expert Presentations',
//       category: 'Speakers'
//     },
//     {
//       type: 'image',
//       src: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
//       title: 'Networking Sessions',
//       category: 'Networking'
//     },
//     {
//       type: 'video',
//       src: 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=800',
//       title: 'Live Demonstrations',
//       category: 'Demo'
//     },
//     {
//       type: 'image',
//       src: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
//       title: 'Exhibition Floor',
//       category: 'Exhibitors'
//     },
//     {
//       type: 'image',
//       src: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800',
//       title: 'Awards Ceremony',
//       category: 'Awards'
//     },
//     {
//       type: 'video',
//       src: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
//       title: 'Highlights Reel',
//       category: 'Highlights'
//     }
//   ];

//   const openLightbox = (item: any, index: number) => {
//     setSelectedMedia(item);
//     setCurrentIndex(index);
//   };

//   const closeLightbox = () => {
//     setSelectedMedia(null);
//   };

//   const navigateMedia = (direction: 'prev' | 'next') => {
//     const newIndex = direction === 'prev' 
//       ? (currentIndex - 1 + galleryItems.length) % galleryItems.length
//       : (currentIndex + 1) % galleryItems.length;
    
//     setCurrentIndex(newIndex);
//     setSelectedMedia(galleryItems[newIndex]);
//   };

//   return (
//     <section id="gallery" className="py-20 bg-black">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 data-aos="fade-up" className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-4">
//             Event <span className="text-white">Gallery</span>
//           </h2>
//           <div data-aos="fade-up" data-aos-delay="200" className="w-32 h-1 bg-[#FFD400] mx-auto mb-6"></div>
//           <p data-aos="fade-up" data-aos-delay="400" className="text-gray-300 text-lg max-w-3xl mx-auto">
//             Experience the excitement from previous events and get a preview of what awaits you at this year's expo.
//           </p>
//         </div>

//         {/* Masonry Grid */}
//         <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
//           {galleryItems.map((item, index) => (
//             <div 
//               key={index}
//               data-aos="fade-up" 
//               data-aos-delay={index * 100}
//               className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer break-inside-avoid"
//               onClick={() => openLightbox(item, index)}
//             >
//               <img 
//                 src={item.src} 
//                 alt={item.title}
//                 className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
//               />
              
//               {/* Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 <div className="absolute bottom-0 left-0 right-0 p-6">
//                   <div className="mb-2">
//                     <span className="bg-[#FF0000] text-white px-2 py-1 rounded-full text-xs font-semibold">
//                       {item.category}
//                     </span>
//                   </div>
//                   <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
//                   {item.type === 'video' && (
//                     <div className="flex items-center gap-2 text-[#FFD400]">
//                       <Play size={16} />
//                       <span className="text-sm">Watch Video</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Video Play Button */}
//               {item.type === 'video' && (
//                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <button className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center text-white hover:bg-[#FF0000]/90 transition-colors transform hover:scale-110">
//                     <Play size={24} />
//                   </button>
//                 </div>
//               )}

//               {/* Type Badge */}
//               <div className="absolute top-4 right-4">
//                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                   item.type === 'video' 
//                     ? 'bg-[#FF0000] text-white' 
//                     : 'bg-[#FFD400] text-black'
//                 }`}>
//                   {item.type === 'video' ? 'Video' : 'Photo'}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* View More Button */}
//         <div data-aos="fade-up" data-aos-delay="800" className="text-center mt-16">
//           <button className="bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//             View Complete Gallery
//           </button>
//         </div>
//       </div>

//       {/* Lightbox Modal */}
//       {selectedMedia && (
//         <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
//           <div className="relative max-w-4xl w-full">
//             {/* Close Button */}
//             <button 
//               onClick={closeLightbox}
//               className="absolute -top-12 right-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
//             >
//               <X size={20} />
//             </button>

//             {/* Navigation Buttons */}
//             <button 
//               onClick={() => navigateMedia('prev')}
//               className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
//             >
//               <ChevronLeft size={24} />
//             </button>
            
//             <button 
//               onClick={() => navigateMedia('next')}
//               className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
//             >
//               <ChevronRight size={24} />
//             </button>

//             {/* Media Content */}
//             <div className="bg-black rounded-lg overflow-hidden">
//               <img 
//                 src={selectedMedia.src} 
//                 alt={selectedMedia.title}
//                 className="w-full h-auto max-h-[80vh] object-contain"
//               />
              
//               {/* Media Info */}
//               <div className="p-6 bg-gray-900">
//                 <div className="flex items-center gap-3 mb-2">
//                   <span className="bg-[#FF0000] text-white px-2 py-1 rounded-full text-xs font-semibold">
//                     {selectedMedia.category}
//                   </span>
//                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                     selectedMedia.type === 'video' 
//                       ? 'bg-[#FF0000] text-white' 
//                       : 'bg-[#FFD400] text-black'
//                   }`}>
//                     {selectedMedia.type === 'video' ? 'Video' : 'Photo'}
//                   </span>
//                 </div>
//                 <h3 className="text-white font-bold text-xl">{selectedMedia.title}</h3>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default GallerySection;




import React, { useState } from "react";
import { Play, X, ChevronLeft, ChevronRight, Edit2, Trash2, Upload } from "lucide-react";

const GallerySection: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [heading, setHeading] = useState("Event");
  const [subHeading, setSubHeading] = useState("Gallery");
  const [description, setDescription] = useState(
    "Experience the excitement from previous events and get a preview of what awaits you at this year's expo."
  );
  const [cta, setCta] = useState("View Complete Gallery");

  const [galleryItems, setGalleryItems] = useState<any[]>([
    { type: "image", src: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Drone Racing Action", category: "Competition" },
    { type: "video", src: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Innovation Showcase", category: "Technology" },
    { type: "image", src: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Expert Presentations", category: "Speakers" },
    { type: "image", src: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Networking Sessions", category: "Networking" },
    { type: "video", src: "https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Live Demonstrations", category: "Demo" },
    { type: "image", src: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Exhibition Floor", category: "Exhibitors" },
    { type: "image", src: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Awards Ceremony", category: "Awards" },
    { type: "video", src: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800", title: "Highlights Reel", category: "Highlights" },
  ]);

  const openLightbox = (item: any, index: number) => {
    setSelectedMedia(item);
    setCurrentIndex(index);
  };

  const closeLightbox = () => setSelectedMedia(null);

  const navigateMedia = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + galleryItems.length) % galleryItems.length
        : (currentIndex + 1) % galleryItems.length;
    setCurrentIndex(newIndex);
    setSelectedMedia(galleryItems[newIndex]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newGallery = [...galleryItems];
      newGallery[index].src = URL.createObjectURL(file);
      setGalleryItems(newGallery);
    }
  };

  const removeItem = (index: number) => {
    const newGallery = [...galleryItems];
    newGallery.splice(index, 1);
    setGalleryItems(newGallery);
  };

  const handleCardChange = (index: number, field: string, value: string) => {
    const newGallery = [...galleryItems];
    newGallery[index][field] = value;
    setGalleryItems(newGallery);
  };

  return (
    <section id="gallery" className="py-20 bg-black relative">
      {/* Edit Button */}
      <button
        onClick={() => setEditing(!editing)}
        className="absolute top-6 right-6 z-20 bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2"
      >
        <Edit2 size={16} />
        {editing ? "Done" : "Edit"}
      </button>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          {editing ? (
            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-2 bg-transparent border-b border-[#FFD400] text-center"
            />
          ) : (
            <h2 className="text-4xl md:text-6xl font-bold text-[#FFD400] mb-2">
              {heading}{" "}
              <span className="text-white">{editing ? (
                <input
                  value={subHeading}
                  onChange={(e) => setSubHeading(e.target.value)}
                  className="text-white bg-transparent border-b border-white"
                />
              ) : subHeading}</span>
            </h2>
          )}
          {editing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-gray-300 text-lg max-w-3xl mx-auto bg-transparent border border-gray-600 p-2 rounded w-full"
            />
          ) : (
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">{description}</p>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer break-inside-avoid"
              onClick={() => !editing && openLightbox(item, index)}
            >
              {/* Media */}
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Editing Controls */}
              {editing && (
                <div className="absolute inset-0 z-10 bg-black/50 flex flex-col justify-between p-2 rounded-2xl">
                  <div className="flex justify-end gap-2">
                    <label className="cursor-pointer bg-[#FFD400] text-black px-2 py-1 rounded flex items-center gap-1 text-xs font-semibold">
                      <Upload size={14} />
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, index)}
                      />
                      Upload
                    </label>
                    <button
                      onClick={() => removeItem(index)}
                      className="bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                  <div className="bg-black/70 p-2 rounded mt-auto flex flex-col gap-1">
                    <input
                      value={item.title}
                      onChange={(e) => handleCardChange(index, "title", e.target.value)}
                      className="text-white text-sm font-bold bg-transparent border-b border-white"
                    />
                    <input
                      value={item.category}
                      onChange={(e) => handleCardChange(index, "category", e.target.value)}
                      className="text-white text-xs bg-transparent border-b border-white"
                    />
                    <select
                      value={item.type}
                      onChange={(e) => handleCardChange(index, "type", e.target.value)}
                      className="bg-black text-white text-xs rounded px-1 py-0.5"
                    >
                      <option value="image">Photo</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Overlay */}
              {!editing && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="mb-2">
                      <span className="bg-[#FF0000] text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                    {item.type === "video" && (
                      <div className="flex items-center gap-2 text-[#FFD400]">
                        <Play size={16} />
                        <span className="text-sm">Watch Video</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Type Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.type === "video" ? "bg-[#FF0000] text-white" : "bg-[#FFD400] text-black"
                  }`}
                >
                  {item.type === "video" ? "Video" : "Photo"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          {editing ? (
            <input
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="bg-transparent border-b border-[#FFD400] text-[#FFD400] px-4 py-2 text-center"
            />
          ) : (
            <button className="bg-[#FFD400] hover:bg-[#FFD400]/90 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              {cta}
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && !editing && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button onClick={closeLightbox} className="absolute -top-12 right-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10">
              <X size={20} />
            </button>
            <button onClick={() => navigateMedia("prev")} className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => navigateMedia("next")} className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10">
              <ChevronRight size={24} />
            </button>

            <div className="bg-black rounded-lg overflow-hidden">
              <img src={selectedMedia.src} alt={selectedMedia.title} className="w-full h-auto max-h-[80vh] object-contain" />
              <div className="p-6 bg-gray-900">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#FF0000] text-white px-2 py-1 rounded-full text-xs font-semibold">{selectedMedia.category}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedMedia.type === "video" ? "bg-[#FF0000] text-white" : "bg-[#FFD400] text-black"}`}>{selectedMedia.type === "video" ? "Video" : "Photo"}</span>
                </div>
                <h3 className="text-white font-bold text-xl">{selectedMedia.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
