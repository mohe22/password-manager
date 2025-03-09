import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Input } from "../ui/input";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PasswordChecker from "../shared/password-checker";
import useGeneratePassword from "@/hooks/use-generate-password";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  url: z.string().url({ message: "Invalid URL" }).optional(),
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  notes: z.string().optional(),
});

export default function AddPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: GeneratPassword, isPending: Generating } = useGeneratePassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      username: "",
      password: "",
      notes: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post(
        "http://localhost:8000/api/v1/create-password",
        values,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      toast.success("Password created successfully!");
      queryClient.invalidateQueries({ queryKey: ['passwordItems'] })
      form.reset();
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      const errorMessage =
        error.response?.data?.detail || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });

  const handlePasswordChange = (password: string) => {
    form.setValue("password", password);
  };

  const handleGeneratePassword = () => {
    GeneratPassword(undefined, {
      onSuccess: (data) => {
        form.setValue("password", data.password);
        handlePasswordChange(data.password);
      },
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="lg:space-x-1.5" size={"sm"} variant={"outline"}>
          <Plus className="size-5" />
          <span className="lg:flex hidden">Add Password</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Password</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new password entry.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter URL (optional)" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>

                      <button
                        type="button"
                        aria-description="generate password"
                        className="absolute right-9 hover:bg-primary/60 hover:text-white transition-colors p-1 rounded-sm cursor-pointer top-1/2 -translate-y-1/2"
                        onClick={handleGeneratePassword}
                      >
                        {Generating ? (
                          <Loader2 className="size-4 animate-spin text-white" />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <g
                              fill="none"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                            >
                              <path d="M17 8c.788 1 1 2 1 3v1m-9-1c0-1.578 1.343-3 3-3s3 1.422 3 3v2m-3-2v2"></path>
                              <path d="M6 12v-1.397c-.006-1.999 1.136-3.849 2.993-4.85A6.39 6.39 0 0 1 15 5.748M12 17v4m-2-1l4-2m-4 0l4 2m-9-3v4m-2-1l4-2m-4 0l4 2m12-3v4m-2-1l4-2m-4 0l4 2"></path>
                            </g>
                          </svg>
                        )}
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <PasswordChecker password={form.watch("password")} />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter notes (optional)" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || Generating}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}