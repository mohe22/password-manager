import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import axios from "axios";

interface PayLoad {
  sub: string;
  email: string;
  username: string;
  exp: string;
}

interface UserContextType {
  user: PayLoad | null;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  setUser: (user: PayLoad | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  setIsLoading: () => {},
  setUser: () => {},
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<PayLoad | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { mutate: logout } = useMutation({
    mutationFn: () => {
      return axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      setUser(null); 
      window.location.href = "/login"
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return (
    <UserContext.Provider value={{ user, setUser, setIsLoading, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};