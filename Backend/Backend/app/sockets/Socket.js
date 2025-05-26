const { OpenAI } = require("openai");
const db = require('../models')
const ChatMessageDb = db.ChatMessageDb

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function chatSocketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);
    socket.on("send_message", async ({ message, userContext }) => {
      socket.emit("typing");
      const userId = userContext.userId;  
      const username = userContext.name;  

      console.log("cccccc",userContext )
      try {
        await ChatMessageDb.create({
          userId,
          username,
          sender: "user",
          content: message,
          timestamp: new Date(),
        });


       
        const systemPrompt = `
You are a helpful AI support assistant for a website that provides email signature creation.
User name: ${userContext.name}
Subscription Status: ${userContext.isPro ? 'Pro' : 'Free'}
Last Signature: ${userContext.lastSignature.name} created on ${userContext.lastSignature.createdAt}
Respond in user's language.
`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        });

        const aiReply = completion.choices[0].message.content;

        const supportMessage = {
          id: Date.now().toString(),
          sender: "support",
          content: aiReply,
          timestamp: new Date(),
        };

        await ChatMessageDb.create({
          userId,
          username,
          sender: "support",
          content: aiReply,
          timestamp: supportMessage.timestamp,
        });

        socket.emit("receive_message", supportMessage);

      } catch (err) {
        console.error("❌ AI or DB Error:", err);
        const fallbackMessage = {
          sender: "support",
          content: "AI is currently unavailable. Please try again later.",
          timestamp: new Date(),
        };

        // Optional: store fallback too if needed
        await ChatMessageDb.create({
          userId,
          username,
          sender: "support",
          content: fallbackMessage.content,
          timestamp: fallbackMessage.timestamp,
        });

        socket.emit("receive_message", fallbackMessage);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
}

module.exports = chatSocketHandler;
