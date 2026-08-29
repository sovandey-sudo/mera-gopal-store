import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[#8B0000] text-white hover:bg-[#6B0000] focus:ring-[#8B0000]",
      secondary: "bg-[#D4AF37] text-[#2c1810] hover:bg-[#c49b2a] focus:ring-[#D4AF37]",
      outline: "border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white focus:ring-[#8B0000]",
      ghost: "text-[#8B0000] hover:bg-[#8B0000]/10 focus:ring-[#8B0000]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
