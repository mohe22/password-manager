import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface PasswordSettings {
    length?: number;
    include_uppercase?: boolean;
    include_lowercase?: boolean;
    include_digits?: boolean;
    include_special?: boolean;
  }

const useGeneratePassword = () => {
  return useMutation({
    mutationFn: async (settings: PasswordSettings ={}) => {
        const defaultSettings = {
            length: 16,
            include_uppercase: true,
            include_lowercase: true,
            include_digits: true,
            include_special: true,
        };
        const mergedSettings = { ...defaultSettings, ...settings };

      const response = await axios.post(
        "http://localhost:8000/api/v1/encryption/generate-secure-password",
        mergedSettings
      );
      return response.data;
    },
    onError: () => {
      toast.error("Failed to generate password.");
    },
  });
};

export default useGeneratePassword;