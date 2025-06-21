import axios from 'axios';
import { API_BASE_URL } from './config.ts';
import { useQuery } from '@tanstack/react-query';

export type TrackType = 'academic' | 'professional';

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

const trackTypeMap: Record<TrackType, number> = {
  academic: 0,
  professional: 1,
};

const fetchTracksByType = async (type: TrackType): Promise<Track[]> => {
  const trackTypeValue = trackTypeMap[type];
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