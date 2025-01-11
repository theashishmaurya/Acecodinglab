import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from './action';
import SignUpForm from '@/components/signupForm';

export const metadata = {
  title: 'SignUp',
  description: 'SignUp to AceCodingLab',
};

function Page() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-balance text-muted-foreground">
            Create an account to get started
          </p>
        </div>
        <SignUpForm />
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/assets/signup.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.7] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default Page;
