import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import useImportPasswords from "@/hooks/use-Import-passwords";
import { Input } from "@/components/ui/input"; 

const ImportButton = ({ user_id }: { user_id: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: importPasswords, isPending } = useImportPasswords();

  const handleImport = () => {
    if (file && passphrase) {
      importPasswords({ user_id, file, passphrase });
      setIsDialogOpen(false);
    } else {
      toast.error("Please select a file and enter a passphrase.");
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type !== "application/json") {
        toast.error("Only JSON files are allowed.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          <svg className="text-white lg:mr-2" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <g fill="none">
              <path fill="currentColor" d="m12 14l-.354.354l.354.353l.354-.353zm.5-9a.5.5 0 0 0-1 0zM6.646 9.354l5 5l.708-.708l-5-5zm5.708 5l5-5l-.708-.708l-5 5zM12.5 14V5h-1v9z"></path>
              <path stroke="currentColor" d="M5 16v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"></path>
            </g>
          </svg>
          <span className="hidden lg:flex">Import Passwords</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Passwords</DialogTitle>
          <DialogDescription>
            Upload a JSON file and enter the passphrase to import your passwords.
          </DialogDescription>
        </DialogHeader>

        {/* Drag-and-Drop Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed w-full rounded-lg p-6 text-center cursor-pointer ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto size-8 text-gray-500 mb-2" />
          {isDragActive ? (
            <p className="text-gray-700">Drop the file here...</p>
          ) : (
            <p className="text-gray-700">
              Drag and drop a JSON file here, or{" "}
              <span className="text-blue-500 font-medium">click to browse</span>.
            </p>
          )}
          {file && (
            <p className="text-sm text-gray-500 mt-2">Selected file: {file.name}</p>
          )}
        </div>

        {/* Passphrase Input */}
        <div className="mt-4">
          <Input
            type="password"
            placeholder="Enter passphrase"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />
        </div>

        {/* Import Button */}
        <Button
          onClick={handleImport}
          disabled={isPending || !file || !passphrase}
          size={"sm"}
          className="w-full mt-4"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Importing...
            </>
          ) : (
            <div className="flex flex-row items-center gap-x-2">
              <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                <g fill="none">
                  <path fill="currentColor" d="m12 14l-.354.354l.354.353l.354-.353zm.5-9a.5.5 0 0 0-1 0zM6.646 9.354l5 5l.708-.708l-5-5zm5.708 5l5-5l-.708-.708l-5 5zM12.5 14V5h-1v9z"></path>
                  <path stroke="currentColor" d="M5 16v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"></path>
                </g>
              </svg>
              <span>Import Passwords</span>
            </div>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ImportButton;