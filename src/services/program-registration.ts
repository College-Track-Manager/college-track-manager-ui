import axios from 'axios';
import { API_BASE_URL } from './config';

export interface ProgramRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  trackType: string | number;
  trackDegree: string;
  studyType: string;
  track: string;
  education: string;
  statement: string;
  resume: File;
  transcript: File;
  idCard: File;
}

export const programRegistrationApi = {
  submit: async (data: ProgramRegistrationData) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('trackType', String(data.trackType));
    formData.append('trackDegree', data.trackDegree);
    formData.append('studyType', data.studyType);
    formData.append('track', data.track);
    formData.append('education', data.education);
    formData.append('statement', data.statement);
    formData.append('resume', data.resume);
    formData.append('transcript', data.transcript);
    formData.append('idCard', data.idCard);

    const url = `${API_BASE_URL}/api/StudentRegistrations`;
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
