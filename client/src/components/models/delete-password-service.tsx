import { useState } from "react";
import { useUser } from "@/context/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import {
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  Dialog,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email().min(2, {
    message: "email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 12 characters.",
  }),
  serviceID: z.string().min(1),
});

export default function DeletePasswordService({ serviceID, children }: { serviceID: string, children: React.ReactNode }) {
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      password: "",
      serviceID: serviceID,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.delete("http://localhost:8000/api/v1/delete-password", {
        data: values,
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Service deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['passwordItems'] })

    },
    onError: (error: AxiosError<{ detail: string }>) => {
      const errorMessage = error.response?.data?.detail || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error.message || "Invalid input");
      });
      return;
    }

    mutate(values)
  };

  return (
    <Dialog >
      <DialogTrigger asChild>
        {children} 
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Service</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this service? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mx-1"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Email</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      id="email"
                      disabled={true}
                      placeholder="Email"
                      className="h-[42px] w-full rounded-sm border bg-white px-4 transition placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 ring-blue-300 border-zinc-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300"
                      type="email"
                      name="email"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-zinc-400">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        {...field}
                        id="password"
                        placeholder="Password"
                        className="h-[42px] w-full rounded-sm border bg-white px-4 transition placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 ring-blue-300 border-zinc-300"
                        type={showPassword ? "text" : "password"}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer">
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="tabler-icon tabler-icon-eye-off"
                            >
                              <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
                              <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
                              <path d="M3 3l18 18"></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="tabler-icon tabler-icon-eye"
                            >
                              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                              <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                            </svg>
                          )}
                        </div>
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={isPending}
              className="h-[42px] bg-[#10b981] rounded-[6px] text-sm flex items-center justify-center font-medium text-white cursor-pointer"
            >
              {isPending && <LoaderCircleIcon className="size-4 animate-spin" />}
              <span>Delete</span>
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}