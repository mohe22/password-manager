import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
import Icon from "./icon";
import { StepType } from "@/pages/login";
import { toast } from "sonner";
import { Input } from "../ui/input";

const formSchema = z.object({
  email: z.string().email().min(2, {
    message: "email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 12 characters.",
  }),
});

export default function LoginComponent({
  setStep,
  email
}: {
  setStep: (val: StepType) => void;
  email?:string
}) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email:email || "",
      password:"",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post("http://localhost:8000/auth/login", values);
    },
    onSuccess: (_, data) => {
      setStep({ type: "otp", data: data.email });
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      if (error.response) {
        const errorMessage = error.response.data?.detail || "An error occurred";
        toast.error(errorMessage);
      } else {
        console.error("Login failed:", error.message);

        toast.error("An unexpected error occurred");
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className="text-black">
      <div className="relative mx-4 max-w-[340px] w-fit sm:w-[340px]">
        <Icon title={"Login in to CipherSafe"} />
      </div>
   
      <div className="my-8 h-[2px] w-full bg-zinc-100"></div>

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
                  <Input
                    {...field}
                    id="email"
                    placeholder="Email"
                    autoComplete="true"
                    className="h-[42px] w-full rounded-sm border bg-white px-4 transition placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 ring-blue-300 border-zinc-300"
                    type="email"
                    name="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-zinc-400">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      placeholder="Password"
                      className="h-[42px] w-full rounded-sm border bg-white px-4 transition placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 ring-blue-300 border-zinc-300"
                      type={showPassword ? "text" : "password"} // Toggle between text and password
                      name="password"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ">
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
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <button
            type="submit"
            className="h-[42px] bg-[#10b981] rounded-[6px] text-sm flex items-center justify-center font-medium text-white cursor-pointer"
          >
            {isPending && <Loader2Icon className="size-4 mx-1 animate-spin" />}
            <span>Log In</span>
          </button>
        </form>
      </Form>

      <div className="mt-4 flex text-sm  flex-col-reverse justify-between text-center sm:flex-row">
        <button className="block py-2 cursor-pointer text-zinc-600 underline" onClick={()=>setStep({type:"forgot-password"})}>
          Forgot your password?
        </button>
        <div className="py-2" onClick={() => setStep({ type: "Sign-up" })}>
          <button className="text-center cursor-pointer text-zinc-600 underline">
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
