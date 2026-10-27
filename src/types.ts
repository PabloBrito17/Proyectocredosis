export type WorkMode = 'Remoto' | 'Híbrido' | 'Presencial';
export type OpportunityType = 'Pasantía' | 'Tiempo completo' | 'Medio tiempo';
export type ExperienceLevel = 'Sin experiencia' | 'Junior' | 'Intermedio';

export interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  mode: WorkMode;
  type: OpportunityType;
  experience: ExperienceLevel;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHave: string[];
  whatToShow: string[];
  date: string;
}

export interface CandidateProfile {
  fullName: string;
  education: string;
  field: string;
  skills: string[];
  portfolioUrl: string;
  experience: string;
  intro: string;
  preferredMode: WorkMode;
}

export interface ApplicationFormState {
  name: string;
  email: string;
  message: string;
  portfolioUrl: string;
}

export interface EmployerFormState {
  organization: string;
  contactName: string;
  workEmail: string;
  opportunityType: OpportunityType;
}
