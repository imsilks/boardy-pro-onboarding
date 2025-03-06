
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg";
  intensity?: "light" | "medium" | "heavy";
  border?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  blur = "md",
  intensity = "medium",
  border = true,
  ...props
}) => {
  // Configure blur amount
  const blurMap = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  // Configure background opacity/intensity
  const intensityMap = {
    light: "bg-white/20",
    medium: "bg-white/40",
    heavy: "bg-white/60",
  };

  // Border style
  const borderStyle = border ? "border border-white/20" : "";

  return (
    <div
      className={cn(
        "rounded-2xl shadow-lg",
        blurMap[blur],
        intensityMap[intensity],
        borderStyle,
        "transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
