import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ServerCrash,
  Gift,
  Tag,
  X
} from 'lucide-react';
import type { RegistrationFormData, RegistrationErrors, RegistrationResult } from '../types';
import { registrationService } from '../services';

interface RegistrationFormProps {
  onSuccess: (result: RegistrationResult) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [searchParams] = useSearchParams();
  const urlRefCode = searchParams.get('ref') || searchParams.get('referralCode') || '';

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    collegeName: '',
    graduationYear: '2027', // Target year preset for engineering students
    referredBy: urlRefCode.trim().toUpperCase(),
  });

  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isNetworkUnavailable, setIsNetworkUnavailable] = useState(false);

  // Referral status state
  const [referralValidation, setReferralValidation] = useState<{
    status: 'idle' | 'validating' | 'valid' | 'invalid';
    referrerName?: string;
    message?: string;
  }>({
    status: 'idle',
  });

  // Validate referral code from URL or input
  useEffect(() => {
    const code = formData.referredBy?.trim().toUpperCase();
    if (!code) {
      setReferralValidation({ status: 'idle' });
      return;
    }

    let isMounted = true;
    setReferralValidation({ status: 'validating' });

    registrationService.validateReferralCode(code).then((res) => {
      if (!isMounted) return;
      if (res.valid) {
        setReferralValidation({
          status: 'valid',
          referrerName: res.referrerName,
        });
      } else {
        setReferralValidation({
          status: 'invalid',
          message: res.message || 'Invalid referral code',
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [formData.referredBy]);

  const validate = (): boolean => {
    const newErrors: RegistrationErrors = {};

    // 1. Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }

    // 2. Email validation
    const emailTrimmed = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@college.edu).';
    }

    // 3. College name validation
    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required.';
    } else if (formData.collegeName.trim().length < 2) {
      newErrors.collegeName = 'Please enter a valid college or university name.';
    }

    // 4. Graduation year validation
    if (!formData.graduationYear) {
      newErrors.graduationYear = 'Graduation year is required.';
    }

    // 5. Referral validation check
    if (formData.referredBy && referralValidation.status === 'invalid') {
      newErrors.referredBy = 'The entered referral code is invalid. Please remove or correct it.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-level error dynamically upon typing
    if (errors[name as keyof RegistrationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
    if (isNetworkUnavailable) {
      setIsNetworkUnavailable(false);
    }
  };

  const handleClearReferral = () => {
    setFormData((prev) => ({ ...prev, referredBy: '' }));
    setReferralValidation({ status: 'idle' });
    setErrors((prev) => ({ ...prev, referredBy: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent accidental duplicate submissions
    if (isSubmitting) {
      return;
    }

    setGeneralError(null);
    setIsNetworkUnavailable(false);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registrationService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        collegeName: formData.collegeName.trim(),
        graduationYear: formData.graduationYear,
        referredBy: formData.referredBy?.trim().toUpperCase() || undefined,
      });

      if (result.success) {
        onSuccess(result);
      } else {
        // Handle backend unavailable error
        if (result.isNetworkError) {
          setIsNetworkUnavailable(true);
          setGeneralError('Registration service is temporarily unavailable. Please try again shortly.');
        } else {
          setGeneralError(result.message || 'Registration failed. Please check your inputs.');
          // Map backend field errors if provided
          if (result.errors) {
            setErrors((prev) => ({
              ...prev,
              fullName: result.errors?.name || result.errors?.fullName,
              email: result.errors?.email,
              collegeName: result.errors?.collegeName,
              graduationYear: result.errors?.graduationYear,
              referredBy: result.errors?.referredBy,
            }));
          }
        }
      }
    } catch {
      setIsNetworkUnavailable(true);
      setGeneralError('An unexpected network error occurred while communicating with the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Referral Banner if invited */}
      {formData.referredBy && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
          referralValidation.status === 'valid'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
            : referralValidation.status === 'invalid'
            ? 'bg-amber-50/80 border-amber-200 text-amber-800'
            : 'bg-blue-50/80 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            <Gift className={`h-4 w-4 shrink-0 ${
              referralValidation.status === 'valid'
                ? 'text-emerald-600'
                : referralValidation.status === 'invalid'
                ? 'text-amber-600'
                : 'text-blue-600'
            }`} />
            <div>
              {referralValidation.status === 'valid' && (
                <span>
                  <strong>Referral applied:</strong> Invited by <strong>{referralValidation.referrerName}</strong> ({formData.referredBy})
                </span>
              )}
              {referralValidation.status === 'invalid' && (
                <span>
                  <strong>Invalid referral code ({formData.referredBy}):</strong> You can still register directly.
                </span>
              )}
              {referralValidation.status === 'validating' && (
                <span>Verifying referral code {formData.referredBy}...</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearReferral}
            title="Remove referral code"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/60 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Target Audience Highlight */}
      <div className="flex items-center gap-2 p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-800">
        <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
        <span>
          <strong>Target Cohort:</strong> 2027 Engineering Batch (All engineering students welcome)
        </span>
      </div>

      {/* General / Server Error Alert */}
      {generalError && (
        <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
          isNetworkUnavailable 
            ? 'bg-amber-50 border-amber-200 text-amber-800' 
            : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          {isNetworkUnavailable ? (
            <ServerCrash className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-semibold">{isNetworkUnavailable ? 'Server Unavailable' : 'Registration Error'}</p>
            <p className="text-xs leading-relaxed">{generalError}</p>
          </div>
        </div>
      )}

      {/* Field 1: Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="h-4.5 w-4.5" />
          </div>
          <input
            id="fullName"
            name="fullName"
            type="text"
            disabled={isSubmitting}
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Alex Sharma"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-colors focus:outline-none focus:ring-2 ${
              errors.fullName
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 hover:border-slate-300'
            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>
        {errors.fullName && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.fullName}</span>
          </p>
        )}
      </div>

      {/* Field 2: Email Address */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Email Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="h-4.5 w-4.5" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            disabled={isSubmitting}
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. alex@college.edu"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-colors focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 hover:border-slate-300'
            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>
        {errors.email ? (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.email}</span>
          </p>
        ) : (
          <p className="mt-1 text-xs text-slate-500">Workshop link & starter kit will be sent to this email.</p>
        )}
      </div>

      {/* Field 3: College Name */}
      <div>
        <label htmlFor="collegeName" className="block text-sm font-semibold text-slate-800 mb-1.5">
          College / University Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <input
            id="collegeName"
            name="collegeName"
            type="text"
            disabled={isSubmitting}
            value={formData.collegeName}
            onChange={handleChange}
            placeholder="e.g. National Institute of Technology"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-colors focus:outline-none focus:ring-2 ${
              errors.collegeName
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 hover:border-slate-300'
            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>
        {errors.collegeName && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.collegeName}</span>
          </p>
        )}
      </div>

      {/* Field 4: Graduation Year (Target Year: 2027) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="graduationYear" className="block text-sm font-semibold text-slate-800">
            Graduation Year <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200/80">
            Target Batch: 2027
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Calendar className="h-4.5 w-4.5" />
          </div>
          <select
            id="graduationYear"
            name="graduationYear"
            disabled={isSubmitting}
            value={formData.graduationYear}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-slate-900 bg-white transition-colors focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
              errors.graduationYear
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 hover:border-slate-300'
            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <option value="">Select your graduation year</option>
            <option value="2027">2027 (Target Batch — Recommended)</option>
            <option value="2028">2028 (Undergraduate Batch)</option>
            <option value="2026">2026 (Undergraduate Batch)</option>
            <option value="2025">2025 (Graduating Batch)</option>
            <option value="Other">Other Academic Year</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.graduationYear && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.graduationYear}</span>
          </p>
        )}
      </div>

      {/* Field 5 (Optional): Referral Code */}
      <div>
        <label htmlFor="referredBy" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Referral Code <span className="text-xs font-normal text-slate-400">(Optional)</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Tag className="h-4.5 w-4.5" />
          </div>
          <input
            id="referredBy"
            name="referredBy"
            type="text"
            disabled={isSubmitting}
            value={formData.referredBy || ''}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, referredBy: e.target.value.toUpperCase() }));
              if (errors.referredBy) setErrors((prev) => ({ ...prev, referredBy: undefined }));
            }}
            placeholder="e.g. SZ104"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white uppercase transition-colors focus:outline-none focus:ring-2 ${
              errors.referredBy
                ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 hover:border-slate-300'
            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>
        {errors.referredBy && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errors.referredBy}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Saving Registration...</span>
            </>
          ) : (
            <>
              <span>Complete Free Registration</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </div>

      {/* Security & Workshop Guarantee */}
      <div className="pt-2 text-center space-y-1">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          100% Free • Verified online registration • Instant referral code
        </p>
      </div>
    </form>
  );
};
