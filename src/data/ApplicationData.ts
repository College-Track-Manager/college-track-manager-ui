export interface ApplicationData {
  id: string;
  name: string;
  email: string;
  trackType: 'academic' | 'professional';
  track: string;
  educationLevel: string;
  studyType: 'online' | 'offline';
  education: string;
  statement?: string;
  resumeUrl?: string; // URL to download resume
  transcriptUrl?: string; // URL to download transcript
  idCardUrl?: string; // URL to download ID card
  submissionDate: string;
  adminComments?:string; // Comments from the admin
}