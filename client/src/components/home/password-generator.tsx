import { useEffect, useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import useGeneratePassword from "@/hooks/use-generate-password";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { mutate: generatePassword, isPending: isLoading } = useGeneratePassword();

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;

    // Length contribution
    strength += Math.min(pass.length * 4, 40);

    // Character variety contribution
    if (/[A-Z]/.test(pass)) strength += 10;
    if (/[a-z]/.test(pass)) strength += 10;
    if (/[0-9]/.test(pass)) strength += 10;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 15;

    // Penalize repetitive patterns
    const repetitions = pass.length - new Set(pass).size;
    strength -= repetitions * 2;

    setPasswordStrength(Math.max(0, Math.min(100, strength)));
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGeneratePassword = () => {
    generatePassword(
      {
        length: passwordLength,
        include_uppercase: includeUppercase,
        include_lowercase: includeLowercase,
        include_digits: includeNumbers,
        include_special: includeSymbols,
      },
      {
        onSuccess: (data:any) => {
          setPassword(data.password);
          calculatePasswordStrength(data.password);
        },
      }
    );
  };

  // Generate a password on component mount
  useEffect(() => {
    handleGeneratePassword();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <Input
            value={password}
            readOnly
            className="pr-20 font-mono text-base"
            placeholder="Generated password"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-8 top-0 h-full"
            onClick={copyToClipboard}
            disabled={!password || isLoading}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy password</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={handleGeneratePassword}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Generate new password</span>
          </Button>
        </div>
        {password && (
          <div className="pt-1">
            <PasswordStrengthIndicator strength={passwordStrength} />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Password Length: {passwordLength}</Label>
          </div>
          <Slider
            value={[passwordLength]}
            min={8}
            max={32}
            step={1}
            onValueChange={(value) => setPasswordLength(value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>Character Types</Label>
          <Card className="p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={(checked) => setIncludeUppercase(!!checked)}
                />
                <Label htmlFor="uppercase" className="text-sm font-normal">
                  Uppercase (A-Z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={(checked) => setIncludeLowercase(!!checked)}
                />
                <Label htmlFor="lowercase" className="text-sm font-normal">
                  Lowercase (a-z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={(checked) => setIncludeNumbers(!!checked)}
                />
                <Label htmlFor="numbers" className="text-sm font-normal">
                  Numbers (0-9)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={(checked) => setIncludeSymbols(!!checked)}
                />
                <Label htmlFor="symbols" className="text-sm font-normal">
                  Symbols (!@#$%^&*)
                </Label>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Button
        onClick={handleGeneratePassword}
        className="w-full"
        disabled={isLoading}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        {isLoading ? "Generating..." : "Generate New Password"}
      </Button>
    </div>
  );
}

interface PasswordStrengthIndicatorProps {
  strength: number;
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  const getStrengthLabel = (strength: number) => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    if (strength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{getStrengthLabel(strength)}</span>
        <span>{strength}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", getStrengthColor(strength))}
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
}