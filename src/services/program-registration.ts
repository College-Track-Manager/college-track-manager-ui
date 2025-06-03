import axios from 'axios';
import { API_BASE_URL } from './config';
import { getToken } from './login';

export interface ProgramRegistrationData {
  email: string;
  trackType: string | number;
  trackDegree: string;
  studyType: string;
  track: string;
  education: string;
  statement: string;
  resume: File;
  transcript: File;
  idCard: File;
  AcademicYear: string;
}

export const programRegistrationApi = {
  submit: async (data: ProgramRegistrationData) => {
    
    const token = getToken();
    if (!token) {
      console.error("❌ No token found. User may not be logged in.");
      throw new Error("Authentication token not found.");
    }
    
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('trackType', String(data.trackType));
    formData.append('trackDegree', data.trackDegree);
    formData.append('studyType', data.studyType);
    formData.append('trackId', data.track);
    formData.append('education', data.education);
    formData.append('statement', data.statement);
    formData.append('resume', data.resume);
    formData.append('transcript', data.transcript);
    formData.append('idCard', data.idCard);
    formData.append('AcademicYear', data.AcademicYear);
    
    console.log('Submitting with token:', token);
    console.log('TrackId:', data.track);

    const url = `${API_BASE_URL}/api/StudentRegistrations`;
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token,
      },
    });
    console.log('Program registration API response:', response);
    return response.data;
  },
};
