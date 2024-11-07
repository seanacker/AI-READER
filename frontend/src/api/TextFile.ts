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

export async function summarizeText (pdfText: string) {
const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
    model: "gpt-4",
    prompt: `Please provide a summary of the following text:\n\n${pdfText}`,
    max_tokens: 150,
    temperature: 0.5
    })
});

const data = await response.json();
return data.choices[0].text.trim();
};
