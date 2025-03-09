import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
import Icon from "./icon";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { StepType } from "@/pages/login";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

export default function OtpComponent({ email,setStep }: { email: string,setStep:(val:StepType)=>void }) {
  const [countdown, setCountdown] = useState(20);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  const { mutate: verifyOtp, isPending: isVerifying } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post("http://localhost:8000/auth/verify-otp", values, { withCredentials: true });
    },
    onSuccess: () => {
      navigate("/")
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      const errorMessage =error.response?.data?.detail || "An unexpected error occurred";
      if(errorMessage == "OTP not found or expired" || errorMessage =="OTP expired" || errorMessage == "Too many failed attempts. Please request a new OTP."){
        setStep({type:"Login"})
      }   
      toast.error(errorMessage);

    },
  });

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: () => {
      return axios.post("http://localhost:8000/auth/resend-otp", { email });
    },
    onSuccess: () => {
      toast.success("OTP resent successfully!");
      setCountdown(60);
      setIsResendDisabled(true);
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      const status = error.status;

      if (status == 404 || status == 400) {
        setStep({type:"Login"})

      }

      const errorMessage =
        error.response?.data?.detail || "Failed to resend OTP";
      toast.error(errorMessage);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    verifyOtp(values);
  }

  function handleResendOtp() {
    if (!isResendDisabled) {
      resendOtp();
    }
  }

  return (
    <div className="text-black">
      <div className="relative mx-4 max-w-[340px] w-fit sm:w-[340px]">
        <Icon title={"Sign up to CipherSafe"} />
      </div>
      <div className="my-8 h-[2px] w-full bg-zinc-100"></div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-4 mx-1"
        >
          <p className="text-sm break-words text-center truncate">
            A 6-digit OTP has been sent to your email address. <br />
            <span className="mx-1 underline text-[#34D399]">{email}</span>
          </p>

          {/* OTP Input Field */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Resend OTP Button */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResendDisabled || isResending}
            className="text-sm text-[#10b981] hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <Loader2Icon className="size-4 mx-1 animate-spin" />
            ) : (
              `Resend OTP ${isResendDisabled ? `(${countdown}s)` : ""}`
            )}
          </button>

          {/* Verify OTP Button */}
          <button
            type="submit"
            className="h-[42px] bg-[#10b981] rounded-[6px] text-sm flex items-center justify-center font-medium w-full text-white cursor-pointer"
            disabled={isVerifying}
          >
            {isVerifying && (
              <Loader2Icon className="size-4 mx-1 animate-spin" />
            )}
            <span>Verify OTP</span>
          </button>
        </form>
      </Form>
    </div>
  );
}
