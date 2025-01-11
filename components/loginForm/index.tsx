'use client';
import { login } from '@/app/login/action';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';

const initialState = {
  message: '',
};
const LoginForm = () => {
  const [state, formAction, pending] = useActionState(login, initialState);

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
      {/* <Button variant="outline" className="w-full">
              Login with Github
            </Button> */}
    </form>
  );
};

export default LoginForm;
