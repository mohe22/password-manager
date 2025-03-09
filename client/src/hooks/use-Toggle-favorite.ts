import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const useToggleFavorite = (serviceID: string) => {

  return useMutation({
    mutationFn: async (isFavrout: boolean) => {
      const response = await axios.put(
        `http://localhost:8000/api/v1/toggle-favorite/${serviceID}`,
        { is_Favrout: isFavrout },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Favorite status updated successfully.");
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      const errorMessage = error.response?.data?.detail || "An unexpected error occurred.";
      toast.error(errorMessage);
    },
  });
};