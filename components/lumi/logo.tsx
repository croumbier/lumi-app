
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function LumiLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <Image
        src="/lumi-logo.png"
        alt="Logo de Lumi"
        width={42}
        height={42}
        className="object-contain"
        priority
      />
      <span className="font-display text-3xl font-semibold tracking-tight text-foreground">
        lumi<span className="text-blush-foreground">.</span>
      </span>
    </span>
  )
}
