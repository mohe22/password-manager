import { Lock, Search, Settings, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LandingPage() {
  return (
    <div className=" relative overflow-x-hidden">
      <main className="flex-1">
        <section className="h-full mx-auto w-full mt-32 max-w-screen-xl px-2.5 md:px-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Secure Password Management
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Store, generate, and manage your passwords securely with
                    advanced encryption. Never worry about forgetting a password
                    again.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a href="/login">
                    <Button size="lg" className="w-full">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[400px] aspect-square overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-full w-full flex-col rounded-md border shadow-sm">
                    <div className="flex h-12 items-center justify-end gap-2 border-b px-4">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="grid gap-2">
                        <Skeleton className="h-8 w-full rounded-md  bg-primary/20" />
                        <Skeleton className="h-8 w-3/4 rounded-md bg-primary/20" />
                        <Skeleton className="h-8 w-5/6 rounded-md bg-primary/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="mt-10 py-12 md:py-24 lg:py-32 bg-secondary/50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to manage your passwords securely
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Lock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Secure Storage</CardTitle>
                  <CardDescription>
                    Your passwords are encrypted with AES-GCM, one of the most
                    secure encryption algorithms.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    All encryption happens on your device. Your actual passwords
                    never leave your computer.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Search className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Easy Access</CardTitle>
                  <CardDescription>
                    Quickly find and use your passwords with powerful search
                    functionality.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Search by website, username, or tags to instantly find the
                    credentials you need.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Settings className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Password Generator</CardTitle>
                  <CardDescription>
                    Create strong, unique passwords with our customizable
                    generator tool.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Set length, complexity, and character types to generate
                    passwords that meet specific requirements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 SecureVault. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </a>
          <a href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </a>
        </nav>
      </footer>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,255,163,0.13)_0,rgba(0,255,163,0)_50%,rgba(0,255,163,0)_100%)]"></div>
    </div>
  );
}
