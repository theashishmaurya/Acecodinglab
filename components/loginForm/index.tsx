'use client';
import { login, signInWith } from '@/app/login/action';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useActionState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import Image from 'next/image';

const initialState = {
  message: '',
};
const LoginForm = () => {
  const [state, formAction, pending] = useActionState(login, initialState);

  const handleGithubLogin = async () => {
    try {
      const response = await signInWith('github');
      if (response?.message) {
        alert(response.message); // Handle error messages from GitHub login
      }
    } catch (error) {
      console.error('GitHub login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWith('google');
      if (response?.message) {
        alert(response.message); // Handle error messages from GitHub login
      }
    } catch (error) {
      console.error('google login failed:', error);
    }
  };

  return (
    <form className="grid gap-4" action={formAction}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link>
        </div>
        <Input id="password" type="password" required name="password" />
      </div>
      <p aria-live="polite" className="text-red-500">
        {state?.message}
      </p>

      <Button className="w-full" type="submit">
        {pending && <Loader2 className="animate-spin mx-4" />}
        Login
      </Button>
      <Separator />
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        type="button" // Ensure it doesn't trigger form submission
      >
        <Image
          src="/google.svg"
          alt="google logo"
          width={24}
          height={24}
          className="mx-4"
        />
        Login with Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGithubLogin}
        type="button" // Ensure it doesn't trigger form submission
      >
        <Github className="mx-4" />
        Login with GitHub
      </Button>
    </form>
  );
};

export default LoginForm;
