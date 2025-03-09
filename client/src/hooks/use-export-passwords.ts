import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "sonner";

const useExportPasswords = () => {
  return useMutation({
    mutationFn: async ({ user_id, passphrase }: { user_id: string; passphrase: string }) => {
      const response = await axios.get(`http://localhost:8000/api/v1/encryption/export-passwords?user_id=${user_id}&passphrase=${passphrase}`, {
        responseType: "blob",
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      saveAs(data, "passwords_export.json");
      toast.success("Passwords exported successfully.");
    },
    onError: (error) => {
      toast.error("Failed to export passwords.");
      console.error("Export error:", error);
    },
  });
};

export default useExportPasswords;