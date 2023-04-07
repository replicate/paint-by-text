import { ChatOpenAI } from "langchain/chat_models";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

const chat = new ChatOpenAI({ temperature: 0 });

export default async function handler(request, response) {
  const llmResponse = await chat.call([
    new HumanChatMessage(
      "Translate this sentence from English to French. I love programming."
    ),
  ]);
  console.log({ llmResponse });

  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}
