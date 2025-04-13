import axios from 'axios';
import { API_BASE_URL } from './config';

export interface StudentRegistration {
  Id?: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Address: string;
  Track: string;
  Education: string;
  Statement: string;
  ResumePath?: string;
  TranscriptPath?: string;
  IdCardPath?: string;
  resume?: File;
  transcript?: File;
  idCard?: File;
}

export const registrationsApi = {
  submit: async (data: FormData): Promise<void> => {
    await axios.post(`${API_BASE_URL}/api/StudentRegistrations`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getStatus: async (id: number): Promise<{ status: string }> => {
    const response = await axios.get(`${API_BASE_URL}/api/StudentRegistrations/${id}/status`);
    return response.data;
  },
}; 