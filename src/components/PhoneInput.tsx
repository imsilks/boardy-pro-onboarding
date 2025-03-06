
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, Check, AlertCircle, PlugZap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
  isValid: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  onSubmit,
  isLoading,
  isValid,
}) => {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [formatted, setFormatted] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"untested" | "success" | "error">("untested");
  
  const fadeInStyle = useFadeIn("up", 100);

  // Format phone number as user types
  useEffect(() => {
    const digits = phone.replace(/\D/g, "");
    let result = "";
    
    // Always start with "+" for international format
    if (digits.length > 0) {
      result = "+";
      
      // Add the rest of the digits with appropriate formatting
      // This is a simplified approach that works for many international formats
      result += digits;
    }
    
    setFormatted(result);
  }, [phone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only allow digits, plus, parentheses, dashes and spaces
    const filtered = input.replace(/[^\d+\s()-]/g, "");
    setPhone(filtered);
    setTouched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneValid()) {
      onSubmit(phone.replace(/\D/g, ""));
    }
  };

  const isPhoneValid = () => {
    const digits = phone.replace(/\D/g, "");
    // Be more lenient with international numbers - just require minimum digits
    return digits.length >= 7 && digits.length <= 15;
  };

  const testSupabaseConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus("untested");
    
    try {
      // Use the existing fetch API and URL from api.ts
      const response = await fetch("https://zprsisdofgrlsgcmtlgj-rr-us-east-1-jkjqy.supabase.co/rest/v1/Contact?limit=1", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcnNpc2RvZmdybHNnY210bGdqLXJyLXVzLWVhc3QtMS1qa2pxeSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE5MTEzNDQ2LCJleHAiOjIwMzQ2ODk0NDZ9.Xa2Zd-qxMX_T34u_AuYWgbB61R1-qx8TkAVb2aJDY0E',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcnNpc2RvZmdybHNnY210bGdqLXJyLXVzLWVhc3QtMS1qa2pxeSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE5MTEzNDQ2LCJleHAiOjIwMzQ2ODk0NDZ9.Xa2Zd-qxMX_T34u_AuYWgbB61R1-qx8TkAVb2aJDY0E`,
        },
      });
      
      console.log('Supabase connection test response:', response.status);
      
      if (response.ok) {
        setConnectionStatus("success");
        toast.success("Supabase connection successful!");
      } else {
        setConnectionStatus("error");
        toast.error(`Supabase connection failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error testing Supabase connection:', error);
      setConnectionStatus("error");
      toast.error("Failed to connect to Supabase. Check console for details.");
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full space-y-4"
      style={fadeInStyle}
    >
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className={cn(
            "text-sm font-medium transition-all duration-200",
            focused ? "text-primary" : "text-muted-foreground"
          )}
        >
          Phone Number
        </Label>
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
      
      {/* Supabase connection test button */}
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full text-xs h-8 border-dashed"
          onClick={testSupabaseConnection}
          disabled={testingConnection}
        >
          {testingConnection ? (
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Testing Connection...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <PlugZap size={14} />
              Test Supabase Connection
              {connectionStatus === "success" && <Check size={14} className="text-green-500" />}
              {connectionStatus === "error" && <AlertCircle size={14} className="text-red-500" />}
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PhoneInput;
