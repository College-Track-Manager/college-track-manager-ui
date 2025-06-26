import axios from 'axios';
import { API_BASE_URL } from './config';
import { ApplicationData } from '@/data/ApplicationData';

export interface StudentRegistration {
  id?: number;
  FirstName: string;
  LastName: string;
  name:string;
  date:string;
  Email: string;
  Phone: string;
  Address: string;
  track: string;
  RegistrationDate : string;
  Education: string;
  Statement: string;
  ResumePath?: string;
  TranscriptPath?: string;
  IdCardPath?: string;
  resume?: File;
  transcript?: File;
  idCard?: File;
  status:number;

}



export const registrationsApi = {
  submit: async (data: any): Promise<any> => {
    const url = `${API_BASE_URL}/api/userregistration/register`;
    console.log('[registrationsApi.submit] POST', url, 'Payload:', data);
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
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

  fetchPendingApplications: async (id: number): Promise<StudentRegistration[]> => {
    const url = `${API_BASE_URL}/api/StudentRegistrations/GetStudentRegistratrions?studentRegistrationType=0`;
    console.log('[registrationsApi.getStatus] GET', url);
    try {
      const response = await axios.get<StudentRegistration[]>(url);
      console.log('[registrationsApi.getStatus] Response:', response);
       const track = response.data;
       return track;
    } catch (error) {
      console.error('[registrationsApi.getStatus] Error:', error);
      throw error;
    }
  },
    fetchProcessedApplications: async (id: number): Promise<StudentRegistration[]> => {
    const url = `${API_BASE_URL}/api/StudentRegistrations/GetStudentRegistratrions?studentRegistrationType=3`; // Processes applicagtions
    console.log('[registrationsApi.getStatus] GET', url);
    try {
      const response = await axios.get<StudentRegistration[]>(url);
      console.log('[registrationsApi.getStatus] Response:', response);
       const track = response.data;
       return track;
    } catch (error) {
      console.error('[registrationsApi.getStatus] Error:', error);
      throw error;
    }
  },

   GetRegistrationById: async (id: string): Promise<ApplicationData> => {
    const url = `${API_BASE_URL}/api/StudentRegistrations/GetRegistrationById?id=${id}`;
    console.log('[registrationsApi.getStatus] GET', url);
    try {
      const response = await axios.get<ApplicationData>(url);
      console.log('[registrationsApi.GetRegistrationById] Response:', response);
       const track = response.data;
       return track;
    } catch (error) {
      console.error('[registrationsApi.GetRegistrationById] Error:', error);
      throw error;
    }
  },

   ApproveRegistration: async (id: string,status: number, comments: string): Promise<boolean> => {
    const url = `${API_BASE_URL}/api/StudentRegistrations/UpdateStudentRegistration?id=${id}&status=${status}&comments=${comments}`;
    console.log('[registrationsApi.getStatus] POST', url);
    try {
      const response = await axios.put<boolean>(url);
      console.log('[registrationsApi.UpdateStudentRegistration] Response:', response);
       const track = response.data;
       return track;
    } catch (error) {
      console.error('[registrationsApi.UpdateStudentRegistration] Error:', error);
      throw error;
    }
  },
}; 

// const fetchPendingApplications = async (id: number): Promise<StudentRegistration[]> => {
//   // If backend supports /api/Tracks/{id}, use this:
//   // const response = await axios.get<Track>(`${API_BASE_URL}/api/Tracks/${id}`);
//   // return response.data;

//   // Otherwise, fetch all tracks and filter client-side (fallback)
//   const response = await axios.get<StudentRegistration[]>(`${API_BASE_URL}/api/StudentRegistrations/GetStudentRegistratrions?studentRegistrationType=0`);
//   const track = response.data;
//   if (!track) throw new Error('Registrations not found');
//   return track;
// };

// export { fetchPendingApplications };
