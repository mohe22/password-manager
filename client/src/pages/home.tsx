import { useUser } from "@/context/user";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordTable, TableSkeleton } from "@/components/home/password-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddPassword from "@/components/models/add-password";
import ExportButton from "@/components/home/export-button";
import ImportButton from "@/components/home/import-button";
import { PasswordGenerator } from "@/components/home/password-generator";

const Home = () => {
  const { user } = useUser();
  const { data: passwordItems, isLoading } = useQuery({
    queryKey: ["passwordItems"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8000/api/v1/passwords-list",
        {
          withCredentials: true, 
        }
      );
      return response.data;
    },
  });

  return (
    <div className="mt-12">
      <div className="flex  max-sm:flex-col  max-sm:items-start  flex-row justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-1.5 lg:text-3xl text-base font-bold tracking-tight font-sans"
        >
          Welcome back,{" "}
          <strong className="text-primary animate-pulse">
            {user?.username}
          </strong>
          ! 🎉
          <br />
          <span className="text-muted-foreground text-sm lg:text-base">
            Your passwords are safe and sound. Ready to manage them?
          </span>
        </motion.h1>


        <div className="flex flex-row gap-x-2 max-sm:mt-4">
         <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ImportButton user_id={user?.sub!}/>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ExportButton user_id={user?.sub!}/>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AddPassword />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-12"
      >
        <Tabs defaultValue="password">
          <TabsList>
            <TabsTrigger className=" cursor-pointer" value="password">
              Passwords
            </TabsTrigger>
            <TabsTrigger className=" cursor-pointer" value="Generat">
              Generate Password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="password">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12"
            >
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <PasswordTable data={passwordItems} />
              )}
            </motion.div>
          </TabsContent>
          <TabsContent value="Generat" className="mt-12">
              <PasswordGenerator/>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Home;
