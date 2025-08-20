import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="relative">
        <Image
          src="/wasopay-logo-icon.png"
          alt="WasoPay"
          width={32}
          height={32}
          className={cn(sizeClasses[size], "w-auto")}
          priority
        />
      </div>
      <span className={cn("font-bold text-foreground", textSizeClasses[size])}>Wasopay</span>
    </div>
  )
}
