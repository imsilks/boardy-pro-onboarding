
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFadeIn } from "@/lib/animations";

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
  isValid: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  onSubmit,
  isLoading,
  isValid
}) => {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [formatted, setFormatted] = useState("");
  const fadeInStyle = useFadeIn("up", 100);

  useEffect(() => {
    const digits = phone.replace(/\D/g, "");
    let result = "";
    if (digits.length > 0) {
      result = "+";
      result += digits;
    }
    setFormatted(result);
  }, [phone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const filtered = input.replace(/[^\d+\s()-]/g, "");
    setPhone(filtered);
    setTouched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneValid()) {
      // Send the formatted phone to make matching easier
      console.log("Submitting phone:", formatted);
      onSubmit(formatted);
    }
  };

  const isPhoneValid = () => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4" style={fadeInStyle}>
      <div className="space-y-2">
        <Label htmlFor="phone" className="">Enter Your Phone Number</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Phone size={18} className={focused ? "text-primary" : ""} />
          </div>
          <Input 
            id="phone" 
            type="tel" 
            value={formatted} 
            onChange={handleChange} 
            onFocus={() => setFocused(true)} 
            onBlur={() => setFocused(false)} 
            className={cn(
              "pl-10 pr-10 h-12 transition-all duration-200 text-lg", 
              focused ? "ring-2 ring-primary/20 border-primary/50" : "", 
              isValid && "border-green-500 pr-12"
            )} 
            placeholder="+1 (555) 123-4567" 
            autoComplete="tel" 
          />
          {isValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-fade-in">
              <Check size={18} />
            </div>
          )}
        </div>
        {touched && !isPhoneValid() && !isLoading && (
          <p className="text-sm text-destructive animate-fade-in">
            Please enter a valid international phone number
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        className={cn(
          "w-full h-12 transition-all duration-300 font-medium", 
          isPhoneValid() ? "opacity-100" : "opacity-70"
        )} 
        disabled={!isPhoneValid() || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Verifying...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Continue
            <ArrowRight size={18} />
          </span>
        )}
      </Button>
    </form>
  );
};

export default PhoneInput;
