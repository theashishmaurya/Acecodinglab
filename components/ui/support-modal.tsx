'use client';

import { LifeBuoy, Mail, Twitter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function SupportModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <LifeBuoy className="w-4 h-4" />
          <span className="ml-2">Support</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get in Touch</DialogTitle>
          <DialogDescription>
            Have questions or need assistance? I&apos;m here to help! Choose
            your preferred way to connect with me.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open('https://x.com/theysaymaurya', '_blank')}
          >
            <Twitter className="w-4 h-4 mr-2" />
            Connect on Twitter/X
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              (window.location.href = 'mailto:ashish.1999vns@gmail.com')
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            Send an Email
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            I typically respond within 24 hours during business days.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
