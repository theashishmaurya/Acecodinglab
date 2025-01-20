import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSection() {
  return (
    <div className=" bg-background py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Choose Your Plan
        </h1>
        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <PlanCard
            title="Free"
            price="$0"
            description="Get started with our free plan"
            features={[
              'Top 15 interview challenges',
              'Unlimited time for practicing',
              'Unlimited Test Runs',
            ]}
            ctaText="Start for Free"
            ctaButton={true}
          />
          <PlanCard
            title="Paid"
            price="$50"
            description="Lifetime access to all features"
            classname="bg-yellow-300 text-black"
            features={[
              'Everything in Free plan',
              'All interview challenges',
              'All Design Patterns Tracks',
              //   'Frontend System Design Tracks',
              //   'Customized tracks',
              //   'AI assistance',
              'And more',
            ]}
            ctaText="Get Lifetime Access"
            highlighted={true}
            ctaButton={true}
          />
        </div>
      </div>
    </div>
  );
}

interface PlanCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
  classname?: string;
  ctaButton?: boolean;
}

function PlanCard({
  title,
  price,
  description,
  features,
  ctaText,
  highlighted = false,
  classname,
  ctaButton,
}: PlanCardProps) {
  return (
    <Card
      className={`flex flex-col w-full max-w-md ${classname} ${highlighted ? 'border-primary shadow-lg' : ''}`}
    >
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-4xl font-bold mb-4">{price}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {ctaButton && (
          <Link href="/signup" className="w-full">
            <Button
              className={`w-full ${highlighted ? 'bg-primary hover:bg-primary-dark' : ''}`}
            >
              {ctaText}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
