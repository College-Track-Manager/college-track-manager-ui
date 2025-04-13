import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export interface Track {
  id: number;
  title: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  duration: string | null;
  careerOutlook: string | null;
  image: string | null;
  requirements: string[] | null;
  courses: Course[] | null;
}

export interface Course {
  id: number;
  courseCode: string | null;
  title: string | null;
  description: string | null;
  credits: number;
}

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

export const api = {
  // Get all tracks
  getTracks: async (): Promise<Track[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/Tracks`);
    return response.data;
  },

  // Submit student registration
  submitRegistration: async (data: FormData): Promise<void> => {
    await axios.post(`${API_BASE_URL}/api/StudentRegistrations`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}; 