import Link from "next/link";

type UploadedFilesProps = {
    files: {id: string, name: string}[];
};

export const UploadedFiles: React.FC<UploadedFilesProps> = ({ files }) => {
    return (
        <ul>
        {files.map((file, index) => (
                    <li key={index}>
                    {file.name}
                    <Link href={`/file/${file.id}`}>
                        <button>View</button>
                    </Link>
                </li>
        ))}
    </ul>
    );
};
