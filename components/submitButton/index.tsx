'use client';

import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { RefAttributes } from 'react';

export function SubmitButton(
  props: ButtonProps & RefAttributes<HTMLButtonElement>,
) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" {...props}>
      {pending && <Loader2 className="animate-spin mx-4" />}
      {props.children}
    </Button>
  );
}
