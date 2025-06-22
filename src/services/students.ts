import axios from 'axios';
import { getToken } from './login';

export interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  trackDegree: number;
  trackType: number;
  studyType: number;
  education: string;
  statement: string;
  registrationDate: string;
  track: {
    id: number;
    title: string;
    shortDescription: string;
    duration: string;
  };
  courses: {
    courseCode: string;
    title: string;
    description: string;
    credits: number;
  }[];
}

export async function fetchStudentProfile(): Promise<StudentProfile | null> {
  const token = getToken();
  try {
    const response = await axios.get('http://localhost:5050/api/StudentRegistrations/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = response.data as Partial<StudentProfile>;
    
    // If there's no track or track has no ID, return null to indicate no registration
    if (!data.track || !data.track.id) {
      return null;
    }
    return {
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      trackDegree: data.trackDegree ?? 0,
      trackType: data.trackType ?? 0,
      studyType: data.studyType ?? 0,
      education: data.education || "",
      statement: data.statement || "",
      registrationDate: data.registrationDate || "",
      track: data.track || { id: 0, title: "", shortDescription: "", duration: "" },
      courses: Array.isArray(data.courses) ? data.courses : [],
    };
  } catch (error: unknown) {
    // Type guard to check if it's an Axios error with response
    if (error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 
        'status' in error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
}
