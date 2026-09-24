import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { master, metCourses, missingCourses } = body;
    
    // Secure method: Fetching the API key from .env.local
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
       console.error("API Key Not Found: Cannot read the .env.local file.");
       return NextResponse.json({ advice: "API Key not found! Please check your .env.local file and restart the server." }, { status: 500 });
    }

const prompt = `
      You are an expert academic advisor for Eindhoven University of Technology (TU/e).
      A student is planning to apply for the "${master}" master's program.
      
      Bachelor's courses successfully completed by the student: 
      ${metCourses.map((c: any) => c.name).join(', ') || 'None'}
      
      Master's prerequisites the student is MISSING: 
      ${missingCourses.map((c: any) => c.name).join(', ') || 'None'}
      
      Provide the student with short, professional, and guiding advice. 
      If they have no missing prerequisites, congratulate them and offer portfolio suggestions to increase their chances of admission. 
      If they are missing prerequisites, explain in a friendly tone how critical it is to take these courses during the Q3/Q4 quartiles of their bachelor's studies, otherwise they will be forced to do a pre-master program.
      Write only the advice text addressing the student directly; do not provide any extra explanations.
    `;

    // Using the most stable model 'gemini-pro'
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error("Gemini API Error Details:", errorData);
      return NextResponse.json({ advice: `The AI server is currently unresponsive. Please try again later.` }, { status: 500 });
    }

    const aiData = await aiResponse.json();
    const finalAdvice = aiData.candidates[0].content.parts[0].text;

    return NextResponse.json({ advice: finalAdvice });

  } catch (error: any) {
    console.error("System Error:", error);
    return NextResponse.json({ advice: `A server connection issue occurred.` }, { status: 500 });
  }
}
