import Link from "next/link";
import './style.css'

type UploadedFilesProps = {
    files: {id: string, name: string}[];
};

export const UploadedFiles: React.FC<UploadedFilesProps> = ({ files }) => {
    return (
        <div className="files-container">
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="file-card">
              <Link href={`/file/${file.id}`}>
                <button className="view-button">{file.name}</button>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-files">No files uploaded yet.</p>
        )}
      </div>
    );
};
