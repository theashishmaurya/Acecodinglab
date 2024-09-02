import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Cpu, Users, Zap } from "lucide-react"
import { FeaturesSection } from '@/components/featureSection'
import { HowItWorks } from '@/components/howItWorks'
import { ThreeDHeroCard } from '@/components/heroCard/heroCard'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">FrontendPro</Link>
        <div className="flex items-center space-x-4">
          <Link href="#features" className="hover:text-primary">Features</Link>
          <Link href="#about" className="hover:text-primary">About</Link>
          <Link href="#pricing" className="hover:text-primary">Pricing</Link>
          <Button variant="outline">Sign Up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center min-h-screen items-center">
      <div className="relative overflow-hidden py-24 lg:py-32">
        <div className="container">
          <div className="max-w-2xl text-center mx-auto">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Master Frontend Interviews
            </h1>
            <p className="mt-3 text-xl text-muted-foreground mb-10">
            The ultimate platform for frontend developers to practice, interview, and excel in system design and machine coding rounds.            </p>
          </div>

        <Link href={"/dashboard"}>
          <Button size="lg" className="mr-4">Get Started</Button>
          </Link>
          <Button size="lg" variant="outline">Learn More</Button>

          
          <div className="mt-20 relative max-w-5xl mx-auto">
            {/* <img
              src="assets/heroArea.svg"
              className="rounded-xl"
              alt="Image Description"
            /> */}
            <ThreeDHeroCard/>
            <div className="absolute bottom-12 -start-20 -z-[1] w-48 h-48 bg-gradient-to-b from-primary-foreground via-primary-foreground to-background p-px rounded-lg">
              <div className="w-48 h-48 rounded-lg bg-background/10" />
            </div>
            <div className="absolute -top-12 -end-20 -z-[1] w-48 h-48 bg-gradient-to-t from-primary-foreground via-primary-foreground to-background p-px rounded-full">
              <div className="w-48 h-48 rounded-full bg-background/10" />
            </div>
          </div>
        </div>
      </div>
      </section>

      

      {/* Features Section */}
      <section id="features" className=" py-20">
      <FeaturesSection />
        {/* <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Cpu className="w-10 h-10 mb-2" />
                <CardTitle>Real-time Coding Environment</CardTitle>
              </CardHeader>
              <CardContent>
                Practice and interview in a realistic coding environment with instant feedback.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Code className="w-10 h-10 mb-2" />
                <CardTitle>Automated Test Cases</CardTitle>
              </CardHeader>
              <CardContent>
                Evaluate your solutions against predefined test cases for accurate assessment.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="w-10 h-10 mb-2" />
                <CardTitle>HR-friendly Interface</CardTitle>
              </CardHeader>
              <CardContent>
                Easy-to-use platform for HR professionals to conduct and evaluate interviews.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 mb-2" />
                <CardTitle>Extensive Problem Library</CardTitle>
              </CardHeader>
              <CardContent>
                Access a wide range of frontend system design and machine coding problems.
              </CardContent>
            </Card>
          </div>
        </div> */}
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <HowItWorks />
      </section>

      {/* Pricing Section */}
      {/* <section id="pricing" className="bg-secondary py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For individual practice</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold mb-4">$0</p>
                <ul className="list-disc list-inside">
                  <li>Access to basic problems</li>
                  <li>Limited practice sessions</li>
                  <li>Community support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For serious candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold mb-4">$19/mo</p>
                <ul className="list-disc list-inside">
                  <li>Access to all problems</li>
                  <li>Unlimited practice sessions</li>
                  <li>Performance analytics</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Subscribe</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For companies and teams</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold mb-4">Custom</p>
                <ul className="list-disc list-inside">
                  <li>Custom problem sets</li>
                  <li>Interview scheduling</li>
                  <li>Dedicated support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section> */}

      {/* About Us Section */}
      <section id="about" className="container mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="mb-6">
            FrontendPro is the brainchild of experienced frontend developers and hiring managers who recognized the need for a specialized platform to assess and improve frontend skills.
          </p>
          <p>
            Our mission is to bridge the gap between theoretical knowledge and practical application, helping both candidates and companies find the perfect match in the world of frontend development.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to elevate your frontend skills?</h2>
          <p className="text-xl mb-8">Join FrontendPro today and take your career to the next level.</p>
          <Button size="lg" variant="secondary">Sign Up Now</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background text-foreground py-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2023 FrontendPro. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}