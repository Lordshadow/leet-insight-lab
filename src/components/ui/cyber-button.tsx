import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cyberButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium font-orbitron transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(190_95%_50%/0.6)] hover:scale-105",
        cyber: "bg-gradient-cyber text-primary-foreground neon-border hover:shadow-[0_0_30px_hsl(190_95%_50%/0.8)] hover:scale-105",
        ghost: "text-primary hover:bg-primary/10 hover:text-primary border border-primary/30 hover:border-primary",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(190_95%_50%/0.5)]",
        gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-[0_0_25px_hsl(190_95%_50%/0.6),0_0_25px_hsl(270_80%_60%/0.4)] hover:scale-105",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberButtonVariants> {
  asChild?: boolean;
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(cyberButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
CyberButton.displayName = "CyberButton";

export { CyberButton, cyberButtonVariants };
