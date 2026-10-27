import type { CandidateProfile } from '../types';

export const STORAGE_KEYS = {
  savedJobs: 'firststep-sv-saved-jobs',
  profile: 'firststep-sv-profile',
  applications: 'firststep-sv-demo-applications',
  employerInterest: 'firststep-sv-employer-interest'
} as const;

export const loadSavedJobs = (): string[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.savedJobs);
  return raw ? (JSON.parse(raw) as string[]) : [];
};

export const saveSavedJobs = (jobIds: string[]) => {
  localStorage.setItem(STORAGE_KEYS.savedJobs, JSON.stringify(jobIds));
};

export const loadProfile = (): CandidateProfile => {
  const raw = localStorage.getItem(STORAGE_KEYS.profile);
  if (!raw) {
    return {
      fullName: '',
      education: '',
      field: '',
      skills: [],
      portfolioUrl: '',
      experience: '',
      intro: '',
      preferredMode: 'Híbrido'
    };
  }
  return JSON.parse(raw) as CandidateProfile;
};

export const saveProfile = (profile: CandidateProfile) => {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
};

export const loadDemoApplications = (): Record<string, unknown>[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.applications);
  return raw ? (JSON.parse(raw) as Record<string, unknown>[]) : [];
};

export const saveDemoApplications = (applications: Record<string, unknown>[]) => {
  localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
};

export const loadEmployerInterest = (): Record<string, unknown>[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.employerInterest);
  return raw ? (JSON.parse(raw) as Record<string, unknown>[]) : [];
};

export const saveEmployerInterest = (submissions: Record<string, unknown>[]) => {
  localStorage.setItem(STORAGE_KEYS.employerInterest, JSON.stringify(submissions));
};
