
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "circle" | "refresh";
}

const LoadingSpinner = ({ 
  size = "md", 
  className,
  variant = "circle" 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const iconSizes = {
    sm: 16,
    md: 32,
    lg: 44,
  };

  if (variant === "refresh") {
    return (
      <div className="flex items-center justify-center">
        <RefreshCw 
          size={iconSizes[size]} 
          className={cn(
            "animate-spin text-primary",
            className
          )} 
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
