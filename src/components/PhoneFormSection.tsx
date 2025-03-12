
import React from "react";
import GlassCard from "@/components/GlassCard";
import PhoneInput from "@/components/PhoneInput";
import RedirectStatus from "@/components/RedirectStatus";
import LinkedInUpload from "@/components/LinkedInUpload";

interface PhoneFormSectionProps {
  loading: boolean;
  phoneValid: boolean;
  redirecting: boolean;
  redirectError: boolean;
  contact: { id: string; fullName?: string } | null;
  lookupPhone: string | null;
  fadeInCard: React.CSSProperties;
  handlePhoneSubmit: (phone: string) => void;
  handlePhoneValidation: (isValid: boolean) => void;
  handleRetryRedirect: () => void;
  resetRedirect: () => void;
  showLinkedInUpload?: boolean;
  onLinkedInUploadComplete?: () => void;
  onBackToPhone?: () => void;
}

const PhoneFormSection: React.FC<PhoneFormSectionProps> = ({
  loading,
  phoneValid,
  redirecting,
  redirectError,
  contact,
  lookupPhone,
  fadeInCard,
  handlePhoneSubmit,
  handlePhoneValidation,
  handleRetryRedirect,
  resetRedirect,
  showLinkedInUpload = false,
  onLinkedInUploadComplete,
  onBackToPhone
}) => {
  return (
    <div className="w-full" style={fadeInCard}>
      <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
        {redirecting ? (
          <RedirectStatus 
            redirecting={redirecting}
            redirectError={redirectError}
            contact={contact}
            lookupPhone={lookupPhone}
            onRetry={handleRetryRedirect}
            onReset={resetRedirect}
          />
        ) : showLinkedInUpload && contact ? (
          <LinkedInUpload 
            contactId={contact.id} 
            onComplete={onLinkedInUploadComplete!}
            onBack={onBackToPhone!}
          />
        ) : (
          <PhoneInput 
            onSubmit={handlePhoneSubmit} 
            isLoading={loading} 
            isValid={phoneValid} 
          />
        )}
      </GlassCard>
      
      {!redirecting && !showLinkedInUpload && (
        <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">
          We'll verify your phone number to find your account
        </p>
      )}
      
      {redirectError && (
        <p className="mt-6 text-center text-sm text-amber-500 animate-fade-in">
          Note: Your account was found successfully, but there was an issue connecting to the calendar service.
        </p>
      )}
    </div>
  );
};

export default PhoneFormSection;
