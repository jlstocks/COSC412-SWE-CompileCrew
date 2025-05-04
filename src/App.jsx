import { useState } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello! I am ChatGPT!",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((msg) => ({
      role: msg.sender === "ChatGPT" ? "assistant" : "user",
      content: msg.message
    }));

    const systemMessage = {
      role: "system",
      content: "You are a helpful assistant. Explain all concepts simply."
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      const data = await response.json();

      if (data && data.choices && data.choices.length > 0) {
        const reply = {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        };
        setMessages([...chatMessages, reply]);
      } else {
        console.error("No response from ChatGPT.");
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }

    setTyping(false);
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "600px", width: "600px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..." /> : null}
            >
              {messages.map((msg, i) => (
                <Message key={i} model={msg} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here..." onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
