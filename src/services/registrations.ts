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
  submit: async (data: FormData): Promise<any> => {
    const url = `${API_BASE_URL}/api/userregistration/register`;
    console.log('[registrationsApi.submit] POST', url, 'FormData:', Array.from(data.entries()));
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[registrationsApi.submit] Response:', response);
      console.log('[registrationsApi.submit] Returned Data:', response.data);
      return response.data;
    
    } catch (error) {
      console.error('[registrationsApi.submit] Error:', error);
      throw error;
    }
  },

  getStatus: async (id: number): Promise<{ status: string }> => {
    const url = `${API_BASE_URL}/api/StudentRegistrations/${id}/status`;
    console.log('[registrationsApi.getStatus] GET', url);
    try {
      const response = await axios.get<{ status?: string }>(url);
      console.log('[registrationsApi.getStatus] Response:', response);
      return { status: response.data.status ?? "" };
    } catch (error) {
      console.error('[registrationsApi.getStatus] Error:', error);
      throw error;
    }
  },
}; 