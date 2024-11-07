'use client'

import { getAllFiles } from "@/api/TextFile";
import FileUpload from "@/components/FileUpload/FileUpload";
import {UploadedFiles} from "@/components/UploadedFiles/UploadedFiles";
import { useEffect, useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
      // Fetch file names from the backend
      const fetchFileNames = async () => {
        const data = await getAllFiles();
        setFiles(data.files);
      };

      fetchFileNames();
  }, []);

  const onFileAdded = (id: string, name: string) => {
    setFiles(prevIds => [...prevIds, {id, name}]);
};
  return (
    <div>
      <FileUpload onFileAdded={onFileAdded}/>
      <UploadedFiles files={files}/>
    </div>
  );
}
