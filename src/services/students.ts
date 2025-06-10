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

export async function fetchStudentProfile(): Promise<StudentProfile> {
  const token = getToken();
  const response = await axios.get('http://localhost:5050/api/StudentRegistrations/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = (response.data as Partial<StudentProfile>) || {};
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

}
