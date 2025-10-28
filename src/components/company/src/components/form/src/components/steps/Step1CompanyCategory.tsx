import React, { useState } from "react";
import { StepProps } from "../../types/form";
import { Building2, User, Phone, Globe, X, Mail, AlertCircle } from "lucide-react";
import { FormInput, Select } from "../FormInput";
import { countries, indianStates } from "../../data/countries";
import { FormStep } from "../FormStep";
import { useUserAuth } from "../../../../../../../context/context";
import axios from "axios";

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

  // State for email verification modal
  const { isLogin, setAccountEmail } = useUserAuth();
  const [showEmailModal, setShowEmailModal] = useState(!isLogin); // Show modal if not logged in
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState<{
    exists: boolean;
    message: string;
  } | null>(null);
  const [tempDirectorEmail, setTempDirectorEmail] = useState(formData.directorEmail || "");
  const [emailFieldTouched, setEmailFieldTouched] = useState(false);

  const handleCategoryChange = (selected: string[]) => {
    updateFormData({ companyCategory: selected });
  };

  // Function to check if email exists
  const checkEmailExists = async (email: string) => {
    if (!email) return;

    setCheckingEmail(true);
    setEmailCheckResult(null);

    try {
      const response = await axios.post(
        "https://eqzkmjhfbc.execute-api.ap-south-1.amazonaws.com/dev1/",
        { email }
      );

      const emailExists = response.data.exists;
      // console.log("Email check response:", emailExists, response.data);
      
      setEmailCheckResult({
        exists: emailExists,
        message: response.data.message,
      });

      if (emailExists) {
        // Email exists - store in context and close modal
        setAccountEmail(email);
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailCheckResult(null);
        }, 1500);
      }
      // If email doesn't exist, don't close modal automatically - let user decide
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailCheckResult({
        exists: false,
        message: "Error checking email. Please try again.",
      });
    } finally {
      setCheckingEmail(false);
    }
  };

  // Function to handle director email change in main form
  const handleDirectorEmailChange = (value: string) => {
    updateFormData({ directorEmail: value });
    setTempDirectorEmail(value);
  };

  // Function to handle focus on director email field
  const handleDirectorEmailFocus = () => {
    if (!isLogin && !emailFieldTouched) {
      setTempDirectorEmail(formData.directorEmail || "");
      setShowEmailModal(true);
      setEmailFieldTouched(true);
    }
  };

  // Function to handle modal submission
  const handleModalSubmit = () => {
    if (tempDirectorEmail) {
      checkEmailExists(tempDirectorEmail);
    }
  };

  // Function to close modal when email doesn't exist (user wants to create new account)
  const handleModalClose = () => {
    setShowEmailModal(false);
    setEmailCheckResult(null);
    // Don't clear the field - let user proceed with new email
  };

  // Function to handle modal input change
  const handleModalEmailChange = (value: string) => {
    setTempDirectorEmail(value);
    // Also update the form data in real-time so field stays in sync
    updateFormData({ directorEmail: value });
  };

  return (
    <>
      <FormStep
        title="Company Information"
        description="Select your company category and provide basic details"
        onNext={onNext}
        onPrev={onPrev}
        isValid={isValid}
        isFirstStep={true}
        currentStep={1}
        totalSteps={6}
      >
        <div className="space-y-6">
          {/* Company Category */}
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-900">
              Company Category
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Select your company's main business category (you can select
              multiple)
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              <div className="py-4 text-center">
                <p className="text-gray-500">
                  Please select at least one category to continue
                </p>
              </div>
            )}
          </div>

          {/* Company Basic Details */}
          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-900">
              Company Basic Details
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Tell us about your company's basic information
            </p>

            <div className="space-y-4">
              {/* Director Information */}
              <div className="p-3 bg-yellow-100 border rounded-lg border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <User className="w-5 h-5 mr-2" />
                  Director/MD Information
                </h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                      onChange={handleDirectorEmailChange}
                      onFocus={handleDirectorEmailFocus}
                      required
                      placeholder="director@company.com"
                    />
                    {!isLogin && (
                      <p className="mt-1 text-xs text-blue-600">
                        Note: We'll verify this email to ensure it's not already registered
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Rest of your form sections remain the same */}
              {/* Company Information */}
              <div className="p-3 border rounded-lg bg-yellow-50 border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <Building2 className="w-5 h-5 mr-2" />
                  Company Information
                </h3>
                <div className="relative grid grid-cols-1 gap-2 md:grid-cols-2">
                  <FormInput
                    label="Company Name"
                    value={formData.companyName}
                    onChange={(value) => {
                      updateFormData({ companyName: value });
                      checkCompanyName(value);
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
                    <div className="text-xs absolute left-[6.3rem] text-blue-600 mt-1">
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
                    <div className="text-xs absolute left-2 top-[3.9rem] text-green-700">
                      {companyNameStatus.message}
                    </div>
                  )}
                  <FormInput
                    label="Date of Incorporation "
                    type="date"
                    value={formData.yearEstablished}
                    onChange={(value) =>
                      updateFormData({ yearEstablished: value })
                    }
                    placeholder="Select incorporation date"
                  />
                  <FormInput
                    label="Website URL "
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
                    placeholder="Enter promotional code"
                  />
                </div>
              </div>

              {/* Legal Information */}
              <div className="p-3 border rounded-lg bg-amber-50 border-amber-200">
                <h3 className="mb-2 text-sm font-bold text-amber-900">
                  Trade Information (Optional)
                </h3>
                <div className="space-y-2">
                  <FormInput
                    label="Brand Name"
                    value={formData.legalName || ""}
                    onChange={(value) => updateFormData({ legalName: value })}
                    placeholder="If different from brand name"
                  />

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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

              {/* Alternative Contact */}
              <div className="p-3 border rounded-lg bg-amber-100 border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <Phone className="w-5 h-5 mr-2" />
                  Alternative Contact
                </h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
              <div className="p-3 bg-yellow-200 border rounded-lg border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
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
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
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
              <div className="p-3 border rounded-lg bg-amber-200 border-amber-200">
                <h3 className="flex items-center mb-2 text-sm font-bold text-amber-900">
                  <Globe className="w-5 h-5 mr-2" />
                  Social Media Links (Optional)
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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

      {/* Email Verification Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Mail className="w-6 h-6 mr-2 text-blue-600" />
                <h3 className="text-lg font-bold capitalize text-slate-900">
                  Verify user Email
                </h3>
              </div>
              <button
                onClick={handleModalClose}
                className="transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-4 text-sm text-slate-600">
                We need to verify if this email is already associated with an existing account. 
                Please enter the User email to continue.
              </p>

              <FormInput
                label="User Email"
                type="email"
                value={tempDirectorEmail}
                onChange={handleModalEmailChange}
                required
                placeholder="user@company.com"
                disabled={checkingEmail}
              />

              {emailCheckResult && (
                <div
                  className={`mt-3 p-3 rounded-lg flex items-start ${
                    emailCheckResult.exists
                      ? "bg-green-50 border border-green-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <AlertCircle
                    className={`w-4 h-4 mt-0.5 mr-2 ${
                      emailCheckResult.exists ? "text-green-600" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        emailCheckResult.exists ? "text-green-800" : "text-blue-800"
                      }`}
                    >
                      {emailCheckResult.message}
                    </p>
                    {emailCheckResult.exists && (
                      <p className="mt-1 text-xs text-green-600">
                        Email verified! This will be used for your existing account.
                      </p>
                    )}
                    {!emailCheckResult.exists && (
                      <p className="mt-1 text-xs text-blue-600">
                        This email is not registered. Click Cancel to use this email for a new account.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 font-medium transition-colors text-slate-600 hover:text-slate-800"
                disabled={checkingEmail}
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                disabled={!tempDirectorEmail || checkingEmail}
                className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {checkingEmail ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Checking...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step1CompanyCategory;
