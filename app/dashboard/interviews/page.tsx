import { Metadata } from 'next';
import { InterviewListClient } from './client';

export const metadata: Metadata = {
  title: 'Interviews | AceCodingLab',
  description: 'Manage your coding interviews',
};

export default function InterviewsPage() {
  return <InterviewListClient />;
}