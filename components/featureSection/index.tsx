'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Youtube } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'Practice Frontend Coding Questions with Ease',
      description:
        'Access a curated collection of frontend coding challenges, designed to enhance your problem-solving abilities and help you prepare for any interview.',
      skeleton: <SkeletonOne />,
      className:
        'col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-500',
    },
    {
      title: 'Automated Code Evaluation',
      description:
        'Receive immediate, automated feedback on code quality, performance, and efficiency to improve with every practice session.',
      skeleton: <SkeletonTwo />,
      className: 'border-b col-span-1 lg:col-span-2 dark:border-neutral-500',
    },
    {
      title: 'Watch A Practice Session on Youtube',
      description:
        'Whether its you or Tyler Durden, you can get to know about our product on YouTube',
      skeleton: <SkeletonThree />,
      className:
        'col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-500',
    },
    {
      title: 'Empowering Developers Globally',
      description:
        'Each dot marks a developer advancing their frontend skills with AceCodingLab—your go-to platform for mastering coding interviews through curated challenges, instant feedback, and progress tracking.',
      skeleton: <SkeletonFour />,
      className: 'col-span-1 lg:col-span-3 border-b lg:border-none',
    },
  ];

  /** 
   * COPY
   * 
   * # Level Up Your Coding Skills: Practice and Interview Like a Pro

Are you ready to ace your next technical interview and supercharge your coding skills? Look no further! Our cutting-edge platform offers a realistic coding environment that simulates real-world scenarios, complete with instant feedback. Here's why you need to start practicing with us today:

## 🚀 Accelerate Your Learning
- Dive into a vast array of coding challenges, from easy warm-ups to brain-bending algorithms
- Receive immediate feedback on your code – catch errors instantly and learn on the fly
- Watch your skills improve with each solved problem

## 💼 Nail Your Next Tech Interview
- Experience mock interviews that feel just like the real thing
- Practice under timed conditions to build your speed and confidence
- Get comfortable with popular IDE features used in actual coding interviews

## 🔍 Master the Art of Problem-Solving
- Tackle diverse problem sets that cover all the hot topics in tech interviews
- Learn to optimize your solutions with our advanced code analysis tools
- Understand the "why" behind each problem with detailed explanations and tips

## 👥 Join a Community of Coders
- Share your solutions and learn from peers around the globe
- Engage in friendly competitions to stay motivated
- Collaborate on projects and build your professional network

## 📊 Track Your Progress
- Monitor your improvement with detailed performance metrics
- Identify your strengths and areas for growth
- Set personal goals and watch yourself crush them

## 🏆 Stand Out from the Crowd
- Gain the skills and confidence to outshine other candidates
- Be fully prepared for any coding challenge that comes your way
- Showcase your problem-solving prowess to potential employers

Don't let another day go by without honing your coding skills. Whether you're a coding newbie or a seasoned pro, our platform has something for everyone. Start your journey to coding excellence today and transform the way you practice, learn, and interview.

Ready to code smarter, faster, and better? Sign up now and take the first step towards your dream tech career!

#CodeLikeAPro #TechInterviewPrep #InstantFeedback #CodingExcellence
   */
  return (
    <div className="relative z-20 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Level Up Your <span className="text-yellow-300">Coding Skills</span>:
          Practice and Interview Like a Pro
        </h4>

        <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          Are you ready to ace your next frontend technical interview? Our
          platform offers realistic coding challenges that mimic real-world
          scenarios, with instant feedback to sharpen your skills.
        </p>
      </div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-600">
          {features.map(feature => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        'text-sm md:text-base  max-w-4xl text-left mx-auto',
        'text-neutral-500 text-center font-normal dark:text-neutral-300',
        'text-left max-w-sm mx-0 md:text-sm my-2',
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full  p-5  mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
          <Image
            src="/assets/hero.webp"
            alt="header"
            width={800}
            height={800}
            className="aspect-video object-cover object-right-top rounded-sm"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <Link
      href="https://www.youtube.com/watch?v=al6VRGWSHVA"
      target="__blank"
      className="relative flex gap-10  h-full group/image"
    >
      <div className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
          {/* TODO */}
          <Youtube className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto " />
          <Image
            src="/assets/youtube.png"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-video object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
          />
        </div>
      </div>
    </Link>
  );
};
const images = [
  '/assets/automated-test/2.png',
  '/assets/automated-test/1.png',
  '/assets/automated-test/4.png',
  '/assets/automated-test/3.png',
];

const imageVariants = {
  whileHover: {
    scale: 1.1,
    rotate: 0,
    zIndex: 100,
  },
  whileTap: {
    scale: 1.1,
    rotate: 0,
    zIndex: 100,
  },
};

export const SkeletonTwo = () => {
  const [rotations, setRotations] = useState<number[]>([]);

  useEffect(() => {
    // Generate random rotations after the component mounts
    setRotations(images.map(() => Math.random() * 20 - 10));
  }, []);
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      {/* TODO */}
      <div className="flex flex-row -ml-20">
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={'images-first' + idx}
            style={{
              rotate: rotations[idx] || 0, // Apply rotation from state
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={'images-second' + idx}
            style={{
              rotate: rotations[idx] || 0, // Apply rotation from state
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [20.5937, 78.9629], size: 0.44 }, // India
        { location: [37.0902, -95.7129], size: 0.16 }, // USA
        { location: [36.2048, 138.2529], size: 0.04 }, // Japan
        { location: [-14.235, -51.9253], size: 0.04 }, // Brazil
        { location: [12.8797, 121.774], size: 0.04 }, // Philippines
        { location: [46.6034, 1.8883], size: 0.03 }, // France
        { location: [53.9006, 27.559], size: 0.02 }, // Belarus
        { location: [56.1304, -106.3468], size: 0.02 }, // Canada
        { location: [48.3794, 31.1656], size: 0.02 }, // Ukraine
        { location: [49.8175, 15.473], size: 0.01 }, // Czech Republic
        { location: [55.3781, -3.436], size: 0.01 }, // United Kingdom
        { location: [31.0461, 34.8516], size: 0.01 }, // Israel
        { location: [28.3949, 84.124], size: 0.01 }, // Nepal
        { location: [51.9194, 19.1451], size: 0.01 }, // Poland
        { location: [45.9432, 24.9668], size: 0.01 }, // Romania
        { location: [61.524, 105.3188], size: 0.01 }, // Russia
        { location: [41.1533, 20.1683], size: 0.01 }, // Albania
        { location: [23.685, 90.3563], size: 0.01 }, // Bangladesh
        { location: [-35.6751, -71.543], size: 0.01 }, // Chile
        { location: [35.8617, 104.1954], size: 0.01 }, // China
        { location: [4.5709, -74.2973], size: 0.01 }, // Colombia
        { location: [51.1657, 10.4515], size: 0.01 }, // Germany
        { location: [45.1, 15.2], size: 0.01 }, // Croatia
        { location: [47.1625, 19.5033], size: 0.01 }, // Hungary
        { location: [32.4279, 53.688], size: 0.01 }, // Iran
        { location: [35.9078, 127.7669], size: 0.01 }, // South Korea
        { location: [26.3351, 17.2283], size: 0.01 }, // Libya
        { location: [31.7917, -7.0926], size: 0.01 }, // Morocco
        { location: [47.4116, 28.3699], size: 0.01 }, // Moldova
        { location: [9.081999, 8.6753], size: 0.01 }, // Nigeria
        { location: [-40.9006, 174.886], size: 0.01 }, // New Zealand
        { location: [30.3753, 69.3451], size: 0.01 }, // Pakistan
        { location: [46.1512, 14.9955], size: 0.01 }, // Slovenia
        { location: [33.8869, 9.5375], size: 0.01 }, // Tunisia
        { location: [-32.5228, -55.7658], size: 0.01 }, // Uruguay
        { location: [41.3775, 64.5853], size: 0.01 }, // Uzbekistan
        { location: [14.0583, 108.2772], size: 0.01 }, // Vietnam
      ],
      onRender: state => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: '100%', aspectRatio: 1 }}
      className={className}
    />
  );
};
