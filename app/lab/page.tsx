"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileQuestion } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function Lab() {
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();


    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/dashboard/practice');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const handleProceed = () => {
        router.push('/dashboard/practice');
    };

    return (
        <div className="min-h-screen  flex flex-col justify-center items-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <FileQuestion size={64} className="mx-auto mb-6 text-blue-400" />
                <h1 className="text-4xl font-bold mb-4">Opss! You haven&apos;t Selected A Question </h1>
                <Card className=" p-6  mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Next Steps:</h2>
                    <ul className="text-left list-disc list-inside space-y-2">
                        <li>Browse available coding challenges</li>
                        <li>Select a question that interests you</li>
                        <li>Read the problem statement carefully</li>
                        <li>Start coding your solution</li>
                    </ul>
                </Card>
                <p className="text-lg mb-4">
                    Remember, practice makes perfect. Take your time and enjoy the process!
                </p>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <Button size="lg" onClick={handleProceed} >
                        Proceed to Question Selection
                        <ArrowRight className="ml-2" />
                    </Button>
                </motion.div>
            </motion.div>
            <div className="mt-8 text-gray-400">
                Redirecting to question selection in {countdown} seconds...
            </div>
        </div>
    );
}