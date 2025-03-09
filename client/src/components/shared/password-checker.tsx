import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
type PasswordStrength = "weak" | "medium" | "strong" | "very strong";

export default function PasswordChecker({ password,className }: { password: string,className?:string }) {
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("weak");
  const checkPasswordStrength = (password: string): PasswordStrength => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );
    const length = password.length;

    let strength = 0;

    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (hasUppercase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;

    if (strength >= 5) return "very strong";
    if (strength >= 4) return "strong";
    if (strength >= 3) return "medium";
    return "weak";
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  return (
    <div className={cn("space-y-2",className)}>
      <div className="flex gap-2">
        {["weak", "medium", "strong", "very strong"].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 transition-colors rounded duration-1000",
              passwordStrength === level
                ? level === "weak"
                  ? "bg-red-400"
                  : level === "medium"
                  ? "bg-yellow-400"
                  : level === "strong"
                  ? "bg-green-400"
                  : "bg-blue-400"
                : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Password strength:{" "}
        <span
          className={cn(
            "font-medium  transition-colors duration-1000",
            passwordStrength === "weak"
              ? "text-red-400"
              : passwordStrength === "medium"
              ? "text-yellow-400"
              : passwordStrength === "strong"
              ? "text-green-400"
              : "text-blue-400"
          )}
        >
          {passwordStrength}
        </span>
      </p>
    </div>
  );
}
