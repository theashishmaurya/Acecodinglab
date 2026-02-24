import { Metadata } from 'next';
import { CreateInterviewClient } from './client';

export const metadata: Metadata = {
  title: 'Create Interview | AceCodingLab',
  description: 'Create a new coding interview session',
};

export default function NewInterviewPage() {
  return <CreateInterviewClient />;
}