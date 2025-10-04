import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Edit2, Save, X, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import BusinessInsider from "../public/images/logos/BusinessInsider.png";
import Forbes from "../public/images/logos/Forbes.png";
import TechCrunch from "../public/images/logos/TechCrunch.png";
import TheNewYorkTimes from "../public/images/logos/TheNewYorkTimes.png";
import USAToday from "../public/images/logos/USAToday.png";

export default function EditableUsedBy({ onStateChange, userId, publishedId, templateSelection }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const scrollerRef = useRef(null);
  const fileInputRefs = useRef({});

  // Pending image files for S3 upload
  const [pendingImageFiles, setPendingImageFiles] = useState({});

  // Default content structure
  const defaultCompanies = [
    { image: BusinessInsider, name: "Business Insider", id: 1 },
    { image: Forbes, name: "Forbes", id: 2 },
    { image: TechCrunch, name: "TechCrunch", id: 3 },
    { image: TheNewYorkTimes, name: "NY Times", id: 4 },
    { image: USAToday, name: "USA Today", id: 5 },
  ];

  const defaultContent = {
    title: "USED BY",
    companies: defaultCompanies,
  };

  // Consolidated state
  const [contentState, setContentState] = useState(defaultContent);
  const [tempContentState, setTempContentState] = useState(defaultContent);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contentState);
    }
  }, [contentState, onStateChange]);

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  const displayContent = isEditing ? tempContentState : contentState;
  // Auto-scroll effect for non-editing mode
  useEffect(() => {
    if (!isEditing && scrollerRef.current && displayContent.companies.length > 0) {
      const scroller = scrollerRef.current;
      const scrollWidth = scroller.scrollWidth;
      const clientWidth = scroller.clientWidth;
      
      if (scrollWidth > clientWidth) {
        let scrollPos = 0;
        const scrollSpeed = 0.2; // pixels per frame
        let direction = 1; // 1 for right, -1 for left
        
        const scroll = () => {
          if (!scrollerRef.current) return;
          
          scrollPos += scrollSpeed * direction;
          
          // Reverse direction when reaching edges
          if (scrollPos >= scrollWidth - clientWidth) {
            direction = -1;
          } else if (scrollPos <= 0) {
            direction = 1;
          }
          
          scrollerRef.current.scrollLeft = scrollPos;
          requestAnimationFrame(scroll);
        };
        
        // Start scrolling
        requestAnimationFrame(scroll);
        
        return () => {
          // Cleanup will happen when ref changes or component unmounts
        };
      }
    }
  }, [isEditing, displayContent.companies.length]);

  // Simulate API call to fetch data from database
  const fetchUsedByData = async () => {
    setIsLoading(true);
    try {
      // Replace this with your actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            title: "USED BY",
            companies: [
              { image: BusinessInsider, name: "Business Insider", id: 1 },
              { image: Forbes, name: "Forbes", id: 2 },
              { image: TechCrunch, name: "TechCrunch", id: 3 },
              { image: TheNewYorkTimes, name: "NY Times", id: 4 },
              { image: USAToday, name: "USA Today", id: 5 },
            ],
          });
        }, 1200); // Simulate network delay
      });

      setContentState(response);
      setTempContentState(response);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching used-by data:", error);
      // Keep default content on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component becomes visible
  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchUsedByData();
    }
  }, [isVisible, dataLoaded, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempContentState(contentState);
    setPendingImageFiles({});
  };
  
  // Updated Save function with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      // Create a copy of tempContentState to update with S3 URLs
      let updatedState = { ...tempContentState };

      // Upload all pending images
      for (const [companyIdStr, file] of Object.entries(pendingImageFiles)) {
        const companyId = parseInt(companyIdStr);
        
        if (!userId || !publishedId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('sectionName', 'usedBy');
        formData.append('imageField', `company-${companyId}`);
        formData.append('templateSelection', templateSelection);

        const uploadResponse = await fetch(`https://o66ziwsye5.execute-api.ap-south-1.amazonaws.com/prod/upload-image/${userId}/${publishedId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Update the company image with S3 URL
          updatedState.companies = updatedState.companies.map(company => 
            company.id === companyId ? { ...company, image: uploadData.imageUrl } : company
          );
          console.log(`Company ${companyId} image uploaded to S3:`, uploadData.imageUrl);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Image upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending files
      setPendingImageFiles({});

      // Save the updated state with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states with the new URLs
      setContentState(updatedState);
      setTempContentState(updatedState);
      
      setIsEditing(false);
      toast.success('Used By section saved with S3 URLs ready for publish');

    } catch (error) {
      console.error('Error saving used by section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempContentState(contentState);
    setPendingImageFiles({});
    setIsEditing(false);
  };

  // Update functions
  const updateTempContent = useCallback((field, value) => {
    setTempContentState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateCompanyName = useCallback((companyId, newName) => {
    setTempContentState((prev) => ({
      ...prev,
      companies: prev.companies.map((company) =>
        company.id === companyId ? { ...company, name: newName } : company
      ),
    }));
  }, []);

  // Image upload handler with validation
  const handleImageUpload = useCallback((companyId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingImageFiles(prev => ({ ...prev, [companyId]: file }));

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempContentState((prev) => ({
        ...prev,
        companies: prev.companies.map((company) =>
          company.id === companyId
            ? { ...company, image: e.target.result }
            : company
        ),
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const addCompany = useCallback(() => {
    setTempContentState((prev) => {
      const newId = Math.max(0, ...prev.companies.map((c) => c.id)) + 1;
      return {
        ...prev,
        companies: [
          ...prev.companies,
          { id: newId, name: "New Company", image: BusinessInsider },
        ],
      };
    });
  }, []);

  const removeCompany = useCallback((companyId) => {
    setTempContentState((prev) => ({
      ...prev,
      companies: prev.companies.filter((company) => company.id !== companyId),
    }));
  }, []);

  // Memoized EditableText component to prevent recreation
  const EditableText = useMemo(() => {
    return ({ value, field, companyId, className = "", placeholder = "" }) => {
      const handleChange = (e) => {
        if (field === "title") {
          updateTempContent("title", e.target.value);
        } else if (field === "companyName" && companyId) {
          updateCompanyName(companyId, e.target.value);
        }
      };

      return (
        <input
          type='text'
          value={value}
          onChange={handleChange}
          className={`w-full bg-white border-2 border-dashed border-blue-300 rounded p-2 focus:border-blue-500 focus:outline-none text-center ${className}`}
          placeholder={placeholder}
        />
      );
    };
  }, [updateTempContent, updateCompanyName]);


  return (
    <section ref={sectionRef} className='py-16 bg-white relative'>
      {/* Loading Overlay */}
      {isLoading && (
        <div className='absolute inset-0 bg-white/80 flex items-center justify-center z-30'>
          <div className='bg-white rounded-lg p-6 shadow-lg flex items-center gap-3 border'>
            <Loader2 className='w-5 h-5 animate-spin text-blue-600' />
            <span className='text-gray-700'>Loading content...</span>
          </div>
        </div>
      )}

      {/* Edit Controls - Always visible when data is loaded */}
      {dataLoaded && (
        <div className='absolute top-4 right-4 z-20'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant='outline'
              size='sm'
              className='bg-white hover:bg-gray-50 shadow-lg border-2 border-gray-200 hover:border-blue-300'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Edit
            </Button>
          ) : (
            <div className='flex gap-2'>
              <Button
                onClick={handleSave}
                size='sm'
                className='bg-green-600 hover:bg-green-700 text-white shadow-lg'
                disabled={isSaving || isUploading}
              >
                {isUploading ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : isSaving ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                variant='outline'
                size='sm'
                className='bg-white hover:bg-gray-50 shadow-lg border-2'
                disabled={isSaving || isUploading}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      <div className='max-w-7xl mx-auto px-4'>
        {/* Title Section */}
        {isEditing ? (
          <div className='mb-8'>
            <label className='block text-sm font-medium text-gray-700 mb-2 text-center'>
              Section Title
            </label>
            <div className='max-w-xs mx-auto'>
              <EditableText
                value={displayContent.title}
                field='title'
                className='text-gray-400 text-lg font-medium'
                placeholder='Section title'
              />
            </div>
          </div>
        ) : (
          <p className='text-center text-gray-400 text-lg mb-8'>
            {displayContent.title}
          </p>
        )}

        {/* Companies Section */}
        {isEditing ? (
          <div className='space-y-6'>
            <div className='text-center'>
              <Button
                onClick={addCompany}
                variant='outline'
                size='sm'
                className='bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Company
              </Button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
              {displayContent.companies.map((company) => (
                <div
                  key={company.id}
                  className='bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300'
                >
                  <div className='space-y-3'>
                    {/* Company Image */}
                    <div className='text-center'>
                      <img
                        src={company.image}
                        alt={company.name}
                        className='h-12 mx-auto opacity-60 grayscale'
                      />
                      <Button
                        onClick={() =>
                          fileInputRefs.current[company.id]?.click()
                        }
                        variant='outline'
                        size='sm'
                        className='mt-2 text-xs'
                      >
                        <Upload className='w-3 h-3 mr-1' />
                        Change
                      </Button>
                      <input
                        ref={(el) => (fileInputRefs.current[company.id] = el)}
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(company.id, e)}
                        className='hidden'
                      />
                      {pendingImageFiles[company.id] && (
                        <p className='text-xs text-orange-600 mt-1'>
                          Image selected: {pendingImageFiles[company.id].name}
                        </p>
                      )}
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className='block text-xs font-medium text-gray-600 mb-1'>
                        Company Name
                      </label>
                      <EditableText
                        value={company.name}
                        field='companyName'
                        companyId={company.id}
                        className='text-sm'
                        placeholder='Company name'
                      />
                    </div>

                    {/* Remove Button */}
                    {displayContent.companies.length > 1 && (
                      <Button
                        onClick={() => removeCompany(company.id)}
                        variant='outline'
                        size='sm'
                        className='w-full bg-red-50 hover:bg-red-100 border-red-300 text-red-700'
                      >
                        <Trash2 className='w-3 h-3 mr-1' />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            {/* Custom CSS to hide scrollbar */}
            <style jsx>{`
              .hide-scrollbar {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
              }
              .hide-scrollbar::-webkit-scrollbar {
                display: none; /* Chrome, Safari and Opera */
              }
            `}</style>
            
            {/* Auto-scrolling container */}
            <div 
              ref={scrollerRef}
              className="flex items-center gap-12 py-4 overflow-x-auto hide-scrollbar"
              style={{ scrollBehavior: 'auto' }}
            >
              {/* Duplicate content for seamless looping */}
              {[...displayContent.companies, ...displayContent.companies].map((company, i) => (
                <motion.div
                  key={`${company.id}-${i}`}
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={company.image}
                    alt={company.name}
                    className='h-8 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300'
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Gradient overlays for better visual effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {/* Editing Instructions */}
      {isEditing && (
        <div className='max-w-7xl mx-auto px-4 mt-8'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <p className='text-sm text-blue-700 text-center'>
              <strong>Edit Mode:</strong> Modify the section title, add/remove
              companies, change company names, and upload new logos. Click Save
              to keep your changes.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}