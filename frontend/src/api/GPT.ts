export const summarizeText = async (pdfText: string): Promise<string> => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_GPT_MODEL, // Use "gpt-4-turbo" if available in your plan
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes documents."
          },
          {
            role: "user",
            content: `Please provide a summary of the following document:\n\n${pdfText}`
          }
        ],
        max_tokens: 500,
        temperature: 0.5
      })
    });
  
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.trim();
  };

export const askQuestionWithContext = async (
    question: string,
    summary: string,
    pdfText: string
  ): Promise<string> => {
    try {
      // Prepare the context message with the summary and part of the PDF content
      const messages = [
        {
          role: "system",
          content: "You are a helpful assistant that answers questions based on the provided document."
        },
        {
          role: "user",
          content: `Document Summary: ${summary}\n\nDocument Content Excerpt: ${pdfText.slice(0, 1000)}`
        },
        {
          role: "user",
          content: `Question: ${question}`
        }
      ];
  
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.NEXT_PUBLIC_GPT_MODEL,
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      return "I'm sorry, I couldn't process your request.";
    }
  };
  