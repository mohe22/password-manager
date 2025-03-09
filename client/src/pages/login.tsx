import LoginComponent from "@/components/auth/login-component";
import SignupComponent from "@/components/auth/sign-up-component";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OtpComponent from "@/components/auth/otp-component";
import RequestChangePasswordComponent from "@/components/auth/req-change-password";

type StepType_ = "Login" | "Sign-up" | "forgot-password" | "otp";
export interface StepType{
  type:StepType_,
  data?:string | null
}

export default function Login() {
  const [Step, setStep] = useState<StepType>({type:"Login",data:null});

  return (
    <main className="flex flex-row w-full ">
      <aside
        className="
    bg-[linear-gradient(180deg,#18181B_0%,#27272A_100%)]
    h-screen max-w-[42%] w-full
     items-center justify-center
    select-none overflow-hidden lg:flex hidden
  "
      >
        <div
          className="
      bg-[linear-gradient(142deg,rgba(255,255,255,0.03)_5.7%,rgba(255,255,255,0.01)_86.54%)]
      bg-clip-text text-transparent
      text-center font-bold
      text-[180px] leading-[150px]
      tracking-tighter
    "
        >
          <span className="block">Safe</span>
          <span className="block">Your</span>
          <span className="block">Secrets</span>
        </div>
      </aside>
      <aside className="flex flex-1 flex-col items-center justify-center relative bg-white h-screen  w-full">
        <div className="relative flex h-[100svh] items-center justify-center overflow-hidden">
          {/* Slide. */}
          <div className="relative">
            <div className="h-[600px] max-w-[372px] w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {Step.type === "Login" ? (
                  <motion.div
                    key="login"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  >
                    <LoginComponent setStep={setStep} />
                  </motion.div>
                ) : Step.type =="otp" && Step.data ?(
                  <motion.div
                    key="signup"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  >
                    <OtpComponent setStep={setStep} email={Step.data} />
                  </motion.div> 
                ):Step.type =="forgot-password"?
                   <motion.div
                    key="signup"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  >
                    <RequestChangePasswordComponent setStep={setStep} />
                  </motion.div>
                  : (
                  <motion.div
                    key="signup"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  >
                    <SignupComponent setStep={setStep} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
