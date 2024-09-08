import { Loader2 } from "lucide-react"

type LoadingStateProps = {
  size?: 'sm' | 'md' | 'lg'
}

export default function Spinner({ size = 'md' }: LoadingStateProps) {
  const sizeClasses = {
    sm: {
      icon: 'h-4 w-4',
      text: 'text-xs'
    },
    md: {
      icon: 'h-8 w-8',
      text: 'text-sm'
    },
    lg: {
      icon: 'h-12 w-12',
      text: 'text-base'
    }
  }

  const { icon, text } = sizeClasses[size]

  return (
    <div className="flex flex-col items-center justify-center bg-background">
      <div className="text-center" role="status" aria-live="polite">
        <Loader2 className={`animate-spin text-primary mx-auto ${icon}`} aria-hidden="true" />
        <p className={`mt-2 text-muted-foreground ${text}`}>
          {size === 'sm' ? 'Loading' : 'Loading...'}
        </p>
      </div>
    </div>
  )
}