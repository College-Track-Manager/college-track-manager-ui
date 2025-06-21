import axios from 'axios';
import { API_BASE_URL } from './config.ts';
import { useQuery } from '@tanstack/react-query';

// TrackType can be either string literals or numbers for compatibility
// 1 or 'academic' = academic
// 2 or 'professional' = professional
export type TrackType = 'academic' | 'professional' | 1 | 2;

export interface Track {
  id: number;
  title: string;
  titleEn: string;
  trackType: number;
  trackDegree: number;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  careerOutlook: string;
  image: string;
  requirements: string[];
  courses: Course[];
}

export interface Course {
  id: number;
  courseCode: string | null;
  title: string | null;
  description: string | null;
  credits: number;
}

// Map both string and number track types to their numeric values
const trackTypeMap = {
  academic: 1,
  professional: 2,
  1: 1,        // numeric key for academic
  2: 2         // numeric key for professional
} as const;

const fetchTracksByType = async (type: TrackType): Promise<Track[]> => {
  // Handle both string and number track types
  const trackTypeValue = trackTypeMap[type as keyof typeof trackTypeMap];
  const response = await axios.get<Track[]>(`${API_BASE_URL}/api/Tracks?tracktype=${trackTypeValue}`);
  return response.data;
};

const fetchTrackById = async (id: number): Promise<Track> => {
  // If backend supports /api/Tracks/{id}, use this:
  // const response = await axios.get<Track>(`${API_BASE_URL}/api/Tracks/${id}`);
  // return response.data;

  // Otherwise, fetch all tracks and filter client-side (fallback)
  const response = await axios.get<Track[]>(`${API_BASE_URL}/api/Tracks`);
  const track = response.data.find(t => t.id === id);
  if (!track) throw new Error('Track not found');
  return track;
};

export { fetchTrackById };

export const useTracksByType = (type: TrackType) => {
  return useQuery({
    queryKey: ['tracks', type],
    queryFn: () => fetchTracksByType(type),
  });
};