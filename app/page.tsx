import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FeaturesSection } from '@/components/featureSection';
import { HowItWorks } from '@/components/howItWorks';
import { ThreeDHeroCard } from '@/components/heroCard/heroCard';
import createClient from '@/lib/supabase/supabaseServer';
import { User } from '@supabase/supabase-js';
import { Menu } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { LampContainer, LampDemo } from '@/components/ui/lamp';
import { motion } from 'framer-motion';

const Navbar = ({ user }: { user: User | null }) => (
  <nav className="container mx-auto p-4">
    <div className="flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <Image
          src="/logo.svg"
          alt="ace coding lab logo "
          width={50}
          height={50}
        />
        <Link href="/" className="text-2xl font-bold">
          AceCodingLab
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <Link href="#features" className="hover:text-primary font-bold">
          Features
        </Link>
        <Link href="#about" className="hover:text-primary font-bold">
          About
        </Link>
        <Link
          href="https://blog.acecodinglab.com/"
          className="hover:text-primary font-bold"
        >
          Blog
        </Link>
        {/* <Link href="#pricing" className="hover:text-primary">Pricing</Link> */}

        <Link href="/login" className="hover:text-primary font-bold">
          Login
        </Link>
        {user ? (
          <Link href="/dashboard/practice">
            <Button variant="default">Dashboard</Button>
          </Link>
        ) : (
          <Link href="/signup">
            <Button variant="default">Sign Up</Button>
          </Link>
        )}
      </div>
      <label htmlFor="menu-toggle" className="md:hidden cursor-pointer">
        <Menu className="h-6 w-6" />
      </label>
    </div>
    <input type="checkbox" id="menu-toggle" className="hidden" />
    <div className="hidden mt-4 flex-col space-y-2 md:hidden" id="mobile-menu">
      <Link href="#features" className="hover:text-primary font-bold">
        Features
      </Link>
      <Link href="#about" className="hover:text-primary font-bold">
        About
      </Link>
      <Link
        href="https://blog.acecodinglab.com/"
        className="hover:text-primary font-bold"
      >
        Blog
      </Link>
      <Link href="/login" className="hover:text-primary font-bold">
        Login
      </Link>
      {user ? (
        <Link href="/dashboard/practice">
          <Button variant="default" className="w-full">
            Dashboard
          </Button>
        </Link>
      ) : (
        <Link href="/signup">
          <Button variant="default" className="w-full">
            Sign Up
          </Button>
        </Link>
      )}
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="container mx-auto py-5 sm:py-8 text-center min-h-screen flex items-center justify-center">
    <div className="relative overflow-hidden py-4 sm:py-2 w-full">
      <div className="flex justify-center mb-6">
        <Link href="/signup">
          <HoverBorderGradient
            as="button"
            className="dark:bg-[--foreground] bg-white text-black dark:text-white flex items-center space-x-2"
          >
            Now Available in Public Beta
          </HoverBorderGradient>
        </Link>
      </div>
      <div className="max-w-5xl text-center mx-auto">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-8xl">
          Ace <span className="text-yellow-300">Frontend</span>
          <span className="text-blue-400"> Interview</span> Challenges
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-10">
          Your go-to platform for mastering frontend coding and system design,
          with real-world practice and interview simulations that lead to
          success.
        </p>
        <Link href="/signup">
          <Button
            size="lg"
            className="mr-4 mb-2 font-bold sm:mb-0 hover:bg-green-500 hover:text-white"
          >
            Get Started
          </Button>
        </Link>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
      <div className="mt-2 sm:mt-6 relative mx-auto">
        <ThreeDHeroCard />
        <div className="absolute bottom-12 -start-20 -z-[1] w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-b from-primary-foreground via-primary-foreground to-background p-px rounded-lg">
          <div className="w-full h-full rounded-lg bg-background/10" />
        </div>
        <div className="absolute -top-12 -end-20 -z-[1] w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-t from-primary-foreground via-primary-foreground to-background p-px rounded-full">
          <div className="w-full h-full rounded-full bg-background/10" />
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="container mx-auto py-10 sm:py-20">
    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-12">
      About Us
    </h2>
    <div className="max-w-3xl mx-auto text-center px-4 sm:px-0">
      <p className="mb-4 sm:mb-6 text-sm sm:text-base">
        AceCodingLab was created by experienced frontend developers and hiring
        managers to help candidates master the practical side of frontend
        interviews through practice, assessment, and continuous improvement.
      </p>
      <p className="text-sm sm:text-base">
        At AceCodingLab, our mission is to empower frontend developers by
        providing a comprehensive, real-world coding platform that bridges the
        gap between theory and practice. We aim to streamline the interview
        process for both candidates and employers, fostering skill development,
        confidence, and success in technical interviews. By offering
        cutting-edge tools, automated assessments, and personalized feedback, we
        are committed to transforming how frontend talent is assessed and hired
        globally.
      </p>
    </div>
  </section>
);

const CTASection = () => (
  <section className="bg-background text-foreground py-6 sm:py-8">
    <LampDemo />
  </section>
);

const Footer = () => (
  <footer className="bg-background text-foreground py-6 sm:py-8">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-0">
      <div className="mb-4 sm:mb-0 text-sm sm:text-base">
        <p>&copy; 2024 AceCodingLab. All rights reserved.</p>
      </div>
      <div className="flex flex-wrap justify-center sm:justify-end space-x-4 text-sm sm:text-base">
        <Link href="/terms" className="hover:text-primary mb-2 sm:mb-0">
          Terms of Service
        </Link>
        <Link href="#" className="hover:text-primary mb-2 sm:mb-0">
          Privacy Policy
        </Link>
        <Link href="#" className="hover:text-primary">
          Contact Us
        </Link>
      </div>
    </div>
  </footer>
);

export default async function Page() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar user={user.data.user} />
      <main className="flex-grow">
        <HeroSection />
        <section id="features" className="py-5 sm:py-5">
          <FeaturesSection />
        </section>
        <section className="container mx-auto py-10 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-12">
            How It Works
          </h2>
          <HowItWorks />
        </section>
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
