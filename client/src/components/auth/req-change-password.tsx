import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
import Icon from "./icon";
import { StepType } from "@/pages/login";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email().min(2, {
    message: "email is required",
  }),
});

export default function RequestChangePasswordComponent({
  setStep,
}: {
  setStep: (val: StepType) => void;
}) {
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post("http://localhost:8000/auth/forgot-password", values);
    },
    onSettled() {
      setShowSuccessMsg(true);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className="text-black">
      <div className="relative mx-4 max-w-[340px] w-fit sm:w-[340px]">
        <Icon title={"Forgot Password"} />
      </div>
      <AnimatePresence mode="wait">
        {showSuccessMsg ? (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-4 rounded-lg bg-emerald-100 px-7 py-4 text-center text-emerald-700 "
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-emerald-700"
              >
                <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                <path d="M3 7l9 6l9 -6"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold">Check your inbox!</h3>
              <p className="text-sm">
                We've just sent you an email to reset your password.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-4 text-center text-sm text-zinc-600">
              Please enter your email address. We will send you an email to reset your password.
            </p>

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
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="h-[42px] bg-[#10b981] rounded-[6px] text-sm flex items-center justify-center font-medium text-white cursor-pointer"
                >
                  {isPending && (
                    <Loader2Icon className="size-4 mx-1 animate-spin" />
                  )}
                  <span>send email</span>
                </Button>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex text-sm flex-col-reverse justify-between text-center sm:flex-row">
        <div className="py-2" onClick={() => setStep({ type: "Login" })}>
          <button className="text-center cursor-pointer text-zinc-600 underline">
            back to login
          </button>
        </div>
      </div>
    </div>
  );
}