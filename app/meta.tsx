import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AceCodingLab - Ace Frontend Challenges',
  description: 'Your go-to platform for mastering frontend coding and system design, with real-world practice and interview simulations that lead to success.',
  openGraph: {
    title: 'AceCodingLab - Ace Frontend Challenges',
    description: 'Your go-to platform for mastering frontend coding and system design, with real-world practice and interview simulations that lead to success.',
    url: 'https://acecodinglab.com',
    siteName: 'AceCodingLab',
    images: [
      {
        url: 'https://acecodinglab.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AceCodingLab - Frontend Mastery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AceCodingLab - Ace Frontend Challenges',
    description: 'Your go-to platform for mastering frontend coding and system design, with real-world practice and interview simulations that lead to success.',
    images: ['https://acecodinglab.com/og-image.png'],
  },
};