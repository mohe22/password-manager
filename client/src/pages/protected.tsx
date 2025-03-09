import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/user";
import { IconSvg } from "@/components/auth/icon";
import { AuroraText } from "@/components/ui/AuroraText";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { TableSkeleton } from "@/components/home/password-table";

interface Props {
  redirectPath?: string;
  children: React.ReactNode;
}

const ProtectedRoute = ({ redirectPath = "/login", children }: Props) => {
  const [isAllowed, setIsAllowed] = useState(false);
  const { setUser, setIsLoading, isLoading, logout } = useUser();

  const { mutate: verifyToken } = useMutation({
    mutationFn: () => {
      return axios.post(
        "http://localhost:8000/auth/verify-token",
        {},
        { withCredentials: true }
      );
    },
    onSuccess: (response) => {
      setIsAllowed(true);
      setUser(response.data.payload);
    },
    onError: () => {
      setIsAllowed(false);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  if (isLoading) {
    return (
      <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20 bg-background">
        <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
          <div className="flex flex-row items-center w-full h-full justify-between">
            <div className="flex items-center">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="ml-2 flex flex-col space-y-1">
                <Skeleton className="h-4 w-20" /> 
                <Skeleton className="h-4 w-24" /> 
              </div>
            </div>

            <div>
              <Skeleton className="h-8 w-24" /> 
            </div>
          </div>
        </nav>
        <div className="mt-12 flex items-center justify-between">
          <div className="mb-1.5 lg:text-3xl text-base font-bold tracking-tight font-sans">
            <Skeleton className="h-9 w-62 mb-2" />
            <Skeleton className="h-4 w-82" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="mt-12">
          <div className="mt-4">
            <TableSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  const colors = [
    "#006400",
    "#228B22",
    "#2E8B57",
    "#3CB371",
    "#20B2AA",
    "#008080",
  ];

  return (
    <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20 bg-background">
      <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
        <div className="flex flex-row items-center w-full h-full justify-between">
          <a href="/" className="flex items-center">
            <IconSvg height={"1.5rem"} />
            <span className="text-xl text-center tracking-tighter font-bold">
              Cipher
              <AuroraText colors={colors} className="mt-0.5">
                Safe
              </AuroraText>
            </span>
          </a>

          <div>
            <Button onClick={logout} variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:flex ml-1.5">Log out</span>
            </Button>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default ProtectedRoute;
