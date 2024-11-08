export type TextFile = {
    name: string,
    id: string,
    content: string
}

export async function getFileById(id: string): Promise<Blob> {
    const response = await fetch(`http://localhost:5000/text-file/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to retrieve file');
    }
  
    const blob = await response.blob(); // Retrieve binary data as Blob
    return blob;
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

export async function saveFile(fileData: Uint8Array, fileName: string): Promise<string> {
    const response = await fetch('http://localhost:5000/text-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream', // Binary data
        'X-File-Name': encodeURIComponent(fileName)  // Pass file name in headers
      },
      body: fileData
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
  

 
  