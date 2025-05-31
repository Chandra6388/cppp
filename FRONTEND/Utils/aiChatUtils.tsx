import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "", // ✅ uses env securely
  dangerouslyAllowBrowser: true,               // ❗only for dev/testing
});

export async function generateAIResponse(message: string, userContext: any): Promise<string> {
  const systemPrompt = `
You are a helpful AI support assistant for a website that provides email signature creation.
User name: ${userContext.name}
Subscription Status: ${userContext.isPro ? 'Pro' : 'Free'}
Last Signature: ${userContext.lastSignature.name} created on ${userContext.lastSignature.createdAt}
Respond briefly and politely. If the question is in Hindi, reply in Hindi.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]
  });

  return completion.choices[0].message.content ?? "Sorry, I couldn't understand that.";
}





