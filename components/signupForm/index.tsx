'use client';
import { signUp } from '@/app/signup/action';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useActionState } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const initialState = {
  message: '',
};

const SignUpForm = () => {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form className="mx-auto grid w-[350px] gap-6" action={formAction}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            required
            name="fullName"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required name="password" />
        </div>
        <div className="grid gap-2">
          {/* <Label htmlFor="role">Role</Label> */}
          {/* <Select name="role">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="hr">HR Professional</SelectItem>
                </SelectContent>
              </Select> */}
        </div>
        <p aria-live="polite" className="text-red-500">
          {state?.message}
        </p>
        <Button className="w-full" type="submit">
          {pending && <Loader2 className="animate-spin mx-4" />}
          Singup
        </Button>
        {/* <Button variant="outline" className="w-full">
              Sign Up with Google
            </Button> */}
      </div>
    </form>
  );
};

export default SignUpForm;
