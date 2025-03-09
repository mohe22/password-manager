import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordChecker from "../shared/password-checker";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({

  password: z.string().min(12, {
    message: "Password must be at least 12 characters.",
  }),
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  url: z.string().url({ message: "Invalid URL format" }),

  username: z.string().min(1, {
    message: "Username is required.",
  }),
  notes: z.string().optional(),
  is_deleted: z.boolean(),
  is_Favrout: z.boolean().optional(),
});

export default function UpdatePasswordService({
  serviceID,
  children,
}: {
  serviceID: string;
  children: React.ReactNode;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const { data: serviceData, isLoading: isServiceLoading } = useQuery({
    queryKey: ["service", serviceID],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/api/v1/get-password-entry/${serviceID}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    enabled: !!serviceID,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "******",
      title: serviceData?.title || "",
      url: serviceData?.url || "",
      username: serviceData?.username || "",
      notes: serviceData?.notes || "",
      is_Favrout: serviceData?.is_Favrout || false,
      is_deleted: serviceData?.is_deleted,
    },
  });

  React.useEffect(() => {
    if (serviceData) {
      form.reset({
        password: serviceData.password,
        title: serviceData.title,
        url: serviceData.url,
        username: serviceData.username,
        notes: serviceData.notes,
        is_Favrout: serviceData.is_Favrout,
        is_deleted: serviceData.is_deleted,
      });
    }
  }, [serviceData, serviceID]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.put(
        `http://localhost:8000/api/v1/update-password/${serviceID}`,
        values,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      toast.success("updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["passwordItems"] });
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      const errorMessage =
        error.response?.data?.detail || "An unexpected error occurred.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const errors = form.formState.errors;


    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error.message || "Invalid input.");
      });
      return;
    }

    mutate(values);
  };




  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Password Entry</DialogTitle>
          <DialogDescription>
            Update the details of this password entry.
          </DialogDescription>
        </DialogHeader>
        {isServiceLoading ? (
          <div className="flex flex-col gap-4 mx-1">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>

            <Skeleton className="h-10 w-full bg-gray-200" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 mx-1"
            >
          

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </FormControl>
                    {field.value && (
                      <PasswordChecker
                        password={field.value}
                        className="mt-2"
                      />
                    )}
                 
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Title" />
                    </FormControl>
                    <FormDescription>
                       the service name
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="URL" />
                    </FormControl>
                    <FormDescription>
                       the service url like ("https://google.com")
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Username" />
                    </FormControl>
                    <FormDescription>
                       your username is the service
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Notes</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Notes" />
                    </FormControl>  
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={isPending}
                className="h-[42px] cursor-pointer disabled:opacity-25 bg-[#10b981] rounded-[6px] text-sm flex items-center justify-center font-medium text-white"
              >
                {isPending && (
                  <LoaderCircleIcon className="size-4 mx-2 animate-spin" />
                )}
                <span>Update</span>
              </button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
