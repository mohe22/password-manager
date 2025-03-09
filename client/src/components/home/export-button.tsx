import { Button } from "@/components/ui/button";
import useExportPasswords from "@/hooks/use-export-passwords";
import { Loader2 } from "lucide-react";
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";

const ExportButton = ({ user_id }: { user_id: string }) => {
  const [passphrase, setPassphrase] = useState("");
  const { mutate: exportPasswords, isPending } = useExportPasswords();

  const handleExport = () => {
    exportPasswords({ user_id, passphrase });
  };

  return (
    <Dialog>
      <DialogTrigger>
      <Button size={"sm"} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <div className="flex flex-row items-center gap-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="m12 5l-.354-.354l.354-.353l.354.353zm.5 9a.5.5 0 0 1-1 0zM6.646 9.646l5-5l.708.708l-5 5zm5.708-5l5 5l-.708.708l-5-5zM12.5 5v9h-1V5z"></path><path stroke="currentColor" d="M5 16v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"></path></g></svg>
            <span className="hidden lg:flex">Export</span>
          </div>
        )}
      </Button>
      </DialogTrigger>
      <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Passwords</DialogTitle>
            <DialogDescription>
              Enter a passphrase to encrypt your passwords. You will need this passphrase to decrypt the file later.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="Enter passphrase"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />
          <DialogFooter>
            <Button  variant="outline">
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                "Export"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  );
};

export default ExportButton;