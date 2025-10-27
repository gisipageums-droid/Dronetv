import React from "react";
import { StepProps } from "../../types/form";
import { Building2, User, Phone, Globe } from "lucide-react";
import { FormInput, Select } from "../FormInput";
import { countries, indianStates } from "../../data/countries";
import { FormStep } from "../FormStep";

interface Step1CompanyCategoryProps extends StepProps {
  checkCompanyName: (name: string) => void;
  companyNameStatus: {
    available: boolean;
    suggestions?: string[];
    message: string;
  } | null;
  isCheckingName: boolean;
}
const Step1CompanyCategory: React.FC<Step1CompanyCategoryProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
  checkCompanyName,
  companyNameStatus,
  isCheckingName,
}) => {
  const categoryOptions = [
    {
      value: "Drone",
      description: "UAV manufacturing, services, and training",
    },
    {
      value: "AI",
      description: "Artificial intelligence solutions and products",
    },
    {
      value: "GIS",
      description: "Geographic Information Systems and GNSS/GPS/DGPS",
    },
  ];

  const handleCategoryChange = (selected: string[]) => {
    updateFormData({ companyCategory: selected });
  };

  return (
    <FormStep
      title="Company Information"
      description="Select your company category and provide basic details"
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      isFirstStep={true}
      currentStep={1}
      totalSteps={7}
    >
      <div className="space-y-6">
        {/* Company Category */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Company Category
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Select your company's main business category (you can select
            multiple)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryOptions.map(({ value, description }) => (
              <label
                key={value}
                className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  formData.companyCategory.includes(value)
                    ? "border-amber-500 bg-yellow-50 shadow-md"
                    : "border-amber-300 hover:border-amber-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.companyCategory.includes(value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleCategoryChange([
                        ...formData.companyCategory,
                        value,
                      ]);
                    } else {
                      handleCategoryChange(
                        formData.companyCategory.filter((cat) => cat !== value)
                      );
                    }
                  }}
                  className="sr-only"
                />
                <h3
                  className={`text-lg font-bold mb-2 ${
                    formData.companyCategory.includes(value)
                      ? "text-amber-900"
                      : "text-gray-700"
                  }`}
                >
                  {value}
                </h3>
                <p
                  className={`text-xs text-center ${
                    formData.companyCategory.includes(value)
                      ? "text-amber-700"
                      : "text-gray-500"
                  }`}
                >
                  {description}
                </p>
              </label>
            ))}
          </div>

          {formData.companyCategory.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">
                Please select at least one category to continue
              </p>
            </div>
          )}
        </div>

        {/* Company Basic Details */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Company Basic Details
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Tell us about your company's basic information
          </p>

          <div className="space-y-4">
            {/* Company Information */}
            <div className="bg-yellow-50 rounded-lg p-3 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Company Information
              </h3>
              <div className="grid  relative grid-cols-1 md:grid-cols-2 gap-2">
                <FormInput
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(value) => {
                    updateFormData({ companyName: value });
                    checkCompanyName(value); // <-- Call the check function here
                  }}
                  required
                  placeholder="Enter your company name"
                  error={
                    companyNameStatus && !companyNameStatus.available
                      ? companyNameStatus.message
                      : undefined
                  }
                />
                {isCheckingName && (
                  <div className="text-xs absolute left-[6.3rem]  text-blue-600 mt-1">
                    Checking availability...
                  </div>
                )}
                {companyNameStatus &&
                  !companyNameStatus.available &&
                  companyNameStatus.suggestions && (
                    <div className="text-xs absolute left-[9rem] top-[3.6rem] text-yellow-700 mt-1">
                      Suggestions: {companyNameStatus.suggestions.join(", ")}
                    </div>
                  )}
                {companyNameStatus && companyNameStatus.available && (
                  <div className="text-xs absolute left-2 top-[3.9rem] text-green-700 ">
                    {companyNameStatus.message}
                  </div>
                )}
                <FormInput
                  label="Date of Incorporation"
                  type="date"
                  value={formData.yearEstablished}
                  onChange={(value) =>
                    updateFormData({ yearEstablished: value })
                  }
                  required
                  placeholder="Select incorporation date"
                />
                <FormInput
                  label="Website URL"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(value) => updateFormData({ websiteUrl: value })}
                  required
                  placeholder="https://www.yourcompany.com"
                />
                <FormInput
                  label="Promotional Code"
                  value={formData.promoCode}
                  onChange={(value) => updateFormData({ promoCode: value })}
                  required
                  placeholder="Enter promotional code"
                />
              </div>
            </div>

            {/* Legal Information */}
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-900 mb-2">
                Legal Information (Optional)
              </h3>
              <div className="space-y-2">
                <FormInput
                  label="Legal Company Name"
                  value={formData.legalName || ""}
                  onChange={(value) => updateFormData({ legalName: value })}
                  placeholder="If different from brand name"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FormInput
                    label="GSTIN"
                    value={formData.gstin || ""}
                    onChange={(value) => updateFormData({ gstin: value })}
                    placeholder="GST number"
                  />
                  <FormInput
                    label="Operating Hours"
                    value={formData.operatingHours || ""}
                    onChange={(value) =>
                      updateFormData({ operatingHours: value })
                    }
                    placeholder="Mon-Sat 10:00-18:00"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <FormInput
                    label="CIN"
                    value={formData.socialLinks?.cin || ""}
                    onChange={(value) =>
                      updateFormData({
                        socialLinks: { ...formData.socialLinks, cin: value },
                      })
                    }
                    placeholder="Corporate Identity Number"
                  />
                  <FormInput
                    label="UDYAM"
                    value={formData.socialLinks?.udyam || ""}
                    onChange={(value) =>
                      updateFormData({
                        socialLinks: { ...formData.socialLinks, udyam: value },
                      })
                    }
                    placeholder="UDYAM Registration Number"
                  />
                  <FormInput
                    label="PAN"
                    value={formData.socialLinks?.pan || ""}
                    onChange={(value) =>
                      updateFormData({
                        socialLinks: { ...formData.socialLinks, pan: value },
                      })
                    }
                    placeholder="PAN Number"
                  />
                </div>
              </div>
            </div>
            {/* Director Information */}
            <div className="bg-yellow-100 rounded-lg p-3 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Director/MD Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormInput
                  label="Director Name"
                  value={formData.directorName}
                  onChange={(value) => updateFormData({ directorName: value })}
                  required
                  placeholder="Full name"
                />
                <FormInput
                  label="Director Phone"
                  type="tel"
                  value={formData.directorPhone}
                  onChange={(value) => updateFormData({ directorPhone: value })}
                  required
                  placeholder="+91XXXXXXXXXX"
                />
                <div className="md:col-span-2">
                  <FormInput
                    label="Director Email"
                    type="email"
                    value={formData.directorEmail}
                    onChange={(value) =>
                      updateFormData({ directorEmail: value })
                    }
                    required
                    placeholder="director@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Alternative Contact */}
            <div className="bg-amber-100 rounded-lg p-3 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Alternative Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormInput
                  label="Contact Person Name"
                  value={formData.altContactName}
                  onChange={(value) =>
                    updateFormData({ altContactName: value })
                  }
                  required
                  placeholder="Full name"
                />
                <FormInput
                  label="Contact Phone"
                  type="tel"
                  value={formData.altContactPhone}
                  onChange={(value) =>
                    updateFormData({ altContactPhone: value })
                  }
                  required
                  placeholder="+91XXXXXXXXXX"
                />
                <div className="md:col-span-2">
                  <FormInput
                    label="Contact Email"
                    type="email"
                    value={formData.altContactEmail}
                    onChange={(value) =>
                      updateFormData({ altContactEmail: value })
                    }
                    required
                    placeholder="contact@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-yellow-200 rounded-lg p-3 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Address Information
              </h3>
              <div className="space-y-2">
                <FormInput
                  label="Office Address"
                  type="textarea"
                  value={formData.officeAddress}
                  onChange={(value) => updateFormData({ officeAddress: value })}
                  required
                  placeholder="Complete office address"
                  rows={2}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <Select
                    label="Country"
                    options={countries}
                    value={formData.country}
                    onChange={(value) => updateFormData({ country: value })}
                    required
                    placeholder="Select Country"
                  />
                  <Select
                    label="State"
                    options={indianStates}
                    value={formData.state}
                    onChange={(value) => updateFormData({ state: value })}
                    required
                    placeholder="Select State"
                  />
                  <FormInput
                    label="City"
                    value={formData.city}
                    onChange={(value) => updateFormData({ city: value })}
                    required
                    placeholder="City"
                  />
                  <FormInput
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(value) => updateFormData({ postalCode: value })}
                    required
                    placeholder="PIN Code"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-amber-200 rounded-lg p-3 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Social Media Links (Optional)
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FormInput
                    label="LinkedIn Profile"
                    type="url"
                    value={formData.socialLinks?.linkedin || ""}
                    onChange={(value) =>
                      updateFormData({
                        socialLinks: {
                          ...formData.socialLinks,
                          linkedin: value,
                        },
                      })
                    }
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                  <FormInput
                    label="Facebook Page"
                    type="url"
                    value={formData.socialLinks?.facebook || ""}
                    onChange={(value) =>
                      updateFormData({
                        socialLinks: {
                          ...formData.socialLinks,
                          facebook: value,
                        },
                      })
                    }
                    placeholder="https://facebook.com/yourcompany"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FormInput
                    label="Instagram Profile"
                    type="url"
                    value={formData.socialLinks?.instagram || ""}
                    onChange={(value) =>
                      updateFormData({
                        socialLinks: {
                          ...formData.socialLinks,
                          instagram: value,
                        },
                      })
                    }
                    placeholder="https://instagram.com/yourcompany"
                  />
                  <FormInput
                    label="Twitter/X Profile"
                    type="url"
                    value={formData.socialLinks?.twitter || ""}
                    onChange={(value) =>
                      updateFormData({
                        socialLinks: {
                          ...formData.socialLinks,
                          twitter: value,
                        },
                      })
                    }
                    placeholder="https://twitter.com/yourcompany"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FormInput
                    label="YouTube Channel"
                    type="url"
                    value={formData.socialLinks?.youtube || ""}
                    onChange={(value) =>
                      updateFormData({
                        socialLinks: {
                          ...formData.socialLinks,
                          youtube: value,
                        },
                      })
                    }
                    placeholder="https://youtube.com/@yourcompany"
                  />
                  <FormInput
                    label="Support Email"
                    type="email"
                    value={formData.supportEmail || ""}
                    onChange={(value) =>
                      updateFormData({ supportEmail: value })
                    }
                    placeholder="support@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <FormInput
                    label="Support Contact Number"
                    type="tel"
                    value={formData.supportContactNumber || ""}
                    onChange={(value) =>
                      updateFormData({ supportContactNumber: value })
                    }
                    placeholder="+919876543210"
                  />
             
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormStep>
  );
};

export default Step1CompanyCategory;
