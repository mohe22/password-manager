import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const useImportPasswords = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, file, passphrase }: { user_id: string; file: File; passphrase: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("passphrase", passphrase); 

      const response = await axios.post(
        `http://localhost:8000/api/v1/encryption/import-passwords?user_id=${user_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Passwords imported successfully.");
      queryClient.invalidateQueries({ queryKey: ["passwordItems"] }); // Invalidate the cache
    },
    onError: (error) => {
      toast.error("Failed to import passwords.");
      console.error("Import error:", error);
    },
  });
};

export default useImportPasswords;