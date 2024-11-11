import { ChapterUploadData } from "@/components/FileUpload/FileUpload";

export type TextFile = {
    name: string,
    id: string
}

export type Chapter = {
  id: string,
  fileName:  string,
  chapterTitle: string,
  content: string,
  summary?: string,
}

export async function getChapters(pdfId: string): Promise<Chapter[]> {
    const response = await fetch(`http://localhost:5000/text-file/${pdfId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to retrieve file');
    }
  
    const chapters = await response.json(); // Retrieve binary data as Blob
    return chapters;
  }
  

export async function getAllFiles(): Promise<{files: {id: string, name: string}[]}> {
    const response = await fetch(
        `http://localhost:5000/text-files`, 
        {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'}
        }
    )
    const jsonBody = await response.json().catch(() => undefined)
    return jsonBody as {files: {id: string, name: string}[]}
}

export async function saveFile(fileName: string, chapters: ChapterUploadData[]): Promise<string> {
  // Convert each chapter's content from Blob to Base64
  const chaptersData = await Promise.all(
    chapters.map(async (chapter) => ({
      title: chapter.title,
      content: await blobToBase64(chapter.content),
    }))
  );

  // Send the transformed data to the backend
  const response = await fetch('http://localhost:5000/text-file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName, chapters: chaptersData }),
  });

  if (!response.ok) {
    throw new Error('Failed to save file');
  }

  const data = await response.json();
  return data.id; // Assuming response contains the saved file's ID
}

export const saveSummaryToDB = async (id: string, summary: string, chatHistory: { user: string, assistant: string }[]) => {
  await fetch('http://localhost:5000/save-summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
      summary,
      chatHistory
    })
  });
};

export const getSummaryFromDB = async (id: string) => {
  const response = await fetch(`http://localhost:5000/get-summary/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve summary and chat history');
  }

  const data = await response.json();
  return data;
};

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1]; // Remove data URL prefix
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


 
  