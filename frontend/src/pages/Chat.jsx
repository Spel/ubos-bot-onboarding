import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import DOMPurify from 'dompurify';

export default function Chat() {
  const { botId } = useParams();
  const [darkMode, setDarkMode] = useState(getFromStorage(STORAGE_KEYS.DARK_MODE, false));
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Add initial instruction message when component mounts
  useEffect(() => {
    const instructionMessage = {
      id: Date.now(),
      content: `
        <p>Welcome to the HTML-enabled experimental chat! Try these special commands:</p>
        <ul>
          <li><code>/code [language]</code> - Display formatted code block (e.g. "/code javascript")</li>
          <li><code>/list</code> - Generate a formatted bullet list</li>
          <li><code>/table</code> - Show data in a table format</li>
          <li><code>/help</code> - Show these instructions again</li>
        </ul>
      `,
      sender: "bot",
      timestamp: new Date().toISOString()
    };
    setMessages([instructionMessage]);
  }, []);

  // Safely render HTML content
  const renderMessage = (content) => {
    if (typeof content === 'string') {
      if (content.includes('<') && content.includes('>')) {
        return (
          <div 
            className="message-content"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(content, { 
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'code', 'pre', 'table', 'tr', 'td', 'th', 'thead', 'tbody'],
                ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
              }) 
            }} 
          />
        );
      }
      return <p>{content}</p>;
    }
    return null;
  };

  const handleSpecialCommands = (message) => {
    const command = message.toLowerCase().split(' ')[0];
    const param = message.split(' ').slice(1).join(' ');
    
    switch(command) {
      case '/help':
        return `
          <p>Available commands:</p>
          <ul>
            <li><code>/code [language]</code> - Display formatted code block</li>
            <li><code>/list</code> - Generate a formatted bullet list</li>
            <li><code>/table</code> - Show data in a table format</li>
            <li><code>/help</code> - Show these instructions</li>
          </ul>
        `;
      
      case '/code':
        return `
          <p>Here's a sample code block in ${param || 'javascript'}:</p>
          <pre><code>// Example code
${param === 'python' ? 
`def greet(name):
    return f"Hello, {name}!"

print(greet("User"))` : 
`function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("User"));`
}
          </code></pre>
        `;
      
      case '/list':
        return `
          <p>Here's a formatted list example:</p>
          <ul>
            <li><strong>First item</strong> with some description</li>
            <li><em>Second item</em> with emphasized text</li>
            <li>Third item with a <a href="#" target="_blank">link</a></li>
            <li>Fourth item with <code>inline code</code></li>
          </ul>
        `;
      
      case '/table':
        return `
          <p>Here's a sample data table:</p>
          <table class="border-collapse my-2">
            <thead>
              <tr>
                <th class="border p-2">Name</th>
                <th class="border p-2">Type</th>
                <th class="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border p-2">Item 1</td>
                <td class="border p-2">Type A</td>
                <td class="border p-2">Description of item 1</td>
              </tr>
              <tr>
                <td class="border p-2">Item 2</td>
                <td class="border p-2">Type B</td>
                <td class="border p-2">Description of item 2</td>
              </tr>
            </tbody>
          </table>
        `;
      
      default:
        return null;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Check for special commands
    const specialResponse = handleSpecialCommands(inputMessage);
    
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        content: specialResponse || `<p>I received your message: <strong>${inputMessage}</strong></p>
                 <p>Try using special commands like <code>/help</code> to see what I can do!</p>`,
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-neutral-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'} overflow-hidden flex flex-col h-[80vh]`}>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : (darkMode ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-gray-900')
                }`}>
                  {renderMessage(message.content)}
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`rounded-lg px-4 py-2 ${darkMode ? 'bg-neutral-700' : 'bg-gray-100'}`}>
                  <div className="flex space-x-2">
                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className={`p-4 border-t ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message or use /help to see commands..."
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-neutral-700 border-neutral-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors disabled:opacity-50`}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}