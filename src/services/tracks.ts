import axios from 'axios';
import { API_BASE_URL } from './config.ts';
import { useQuery } from '@tanstack/react-query';

export type TrackType = 'academic' | 'professional';

export interface Track {
  id: number;
  title: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  duration: string | null;
  careerOutlook: string | null;
  image: string | null;
  type: TrackType;
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

const fetchTracksByType = async (type: TrackType): Promise<Track[]> => {
  const response = await axios.get<Track[]>(`${API_BASE_URL}/api/Tracks?type=${type}`);
  return response.data;
// const id= 3;
// const response = await axios.get<Track>(`${API_BASE_URL}/api/Tracks/${id}`);
// return [response.data];

};

const fetchTrackById = async (id: number): Promise<Track> => {
  const response = await axios.get<Track>(`${API_BASE_URL}/api/Tracks/${id}`);
  return response.data;
};

export const useTracksByType = (type: TrackType) => {
  return useQuery({
    queryKey: ['tracks', type],
    queryFn: () => fetchTracksByType(type),
  });
}; 