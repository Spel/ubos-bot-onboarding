import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFromStorage, STORAGE_KEYS } from "../utils/localStorage";
import DOMPurify from 'dompurify';
import Header from "../components/Header";

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
          <li><code>/crud</code> - Display a CRUD management interface example</li>
          <li><code>/dashboard</code> - Show an interactive dashboard example</li>
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
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'code', 'pre', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'div', 'h2', 'h3', 'span', 'button', 'input'],
                ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'type', 'placeholder', 'style']
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
        return getHelpContent();
      
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
      
      case '/crud':
        return `
          <div class="space-y-4">
            <h2 class="text-xl font-bold">User Management CRUD</h2>
            
            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add New</button>
                <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Refresh</button>
              </div>
              <div class="relative">
                <input type="text" placeholder="Search users..." class="px-4 py-2 border rounded-lg" />
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border p-2 text-left">ID</th>
                    <th class="border p-2 text-left">Name</th>
                    <th class="border p-2 text-left">Email</th>
                    <th class="border p-2 text-left">Role</th>
                    <th class="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="hover:bg-gray-50">
                    <td class="border p-2">1</td>
                    <td class="border p-2">John Doe</td>
                    <td class="border p-2">john@example.com</td>
                    <td class="border p-2">Admin</td>
                    <td class="border p-2">
                      <div class="flex gap-2">
                        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                        <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr class="hover:bg-gray-50">
                    <td class="border p-2">2</td>
                    <td class="border p-2">Jane Smith</td>
                    <td class="border p-2">jane@example.com</td>
                    <td class="border p-2">User</td>
                    <td class="border p-2">
                      <div class="flex gap-2">
                        <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                        <button class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">
                Showing 2 of 2 entries
              </div>
              <div class="flex gap-2">
                <button class="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
                <button class="px-3 py-1 bg-blue-500 text-white rounded">1</button>
                <button class="px-3 py-1 border rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        `;

      case '/dashboard':
        return `
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                <div class="text-sm opacity-80">Total Users</div>
                <div class="text-2xl font-bold">1,234</div>
                <div class="text-sm mt-2">
                  <span class="text-green-300">↑ 12%</span> vs last month
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                <div class="text-sm opacity-80">Revenue</div>
                <div class="text-2xl font-bold">$45,678</div>
                <div class="text-sm mt-2">
                  <span class="text-green-300">↑ 8%</span> vs last month
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
                <div class="text-sm opacity-80">Active Projects</div>
                <div class="text-2xl font-bold">27</div>
                <div class="text-sm mt-2">
                  <span class="text-red-300">↓ 3%</span> vs last month
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg shadow">
                <h3 class="font-bold mb-4">Recent Activity</h3>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <div class="text-sm font-medium">New user registered</div>
                      <div class="text-xs text-gray-500">2 minutes ago</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <div class="text-sm font-medium">Project "Alpha" completed</div>
                      <div class="text-xs text-gray-500">1 hour ago</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div>
                      <div class="text-sm font-medium">Server maintenance scheduled</div>
                      <div class="text-xs text-gray-500">3 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white p-4 rounded-lg shadow">
                <h3 class="font-bold mb-4">Top Projects</h3>
                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span>Project Alpha</span>
                      <span>85%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span>Project Beta</span>
                      <span>65%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-500 h-2 rounded-full" style="width: 65%"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span>Project Gamma</span>
                      <span>40%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-yellow-500 h-2 rounded-full" style="width: 40%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

      default:
        return null;
    }
  };

  const getHelpContent = () => `
    <p>Available commands:</p>
    <ul>
      <li><code>/code [language]</code> - Display formatted code block</li>
      <li><code>/list</code> - Generate a formatted bullet list</li>
      <li><code>/table</code> - Show data in a table format</li>
      <li><code>/crud</code> - Display a CRUD management interface example</li>
      <li><code>/dashboard</code> - Show an interactive dashboard example</li>
      <li><code>/help</code> - Show these instructions</li>
    </ul>
  `;

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
      <Header darkMode={darkMode} />
      <div className="flex flex-1 h-[calc(100vh-4rem)] mt-[4rem]"> {/* Fixed height calculation and margin-top */}
        <main className="flex-1 flex flex-col relative">
          <div className={`flex-1 flex flex-col rounded-lg shadow-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'}`}>
            {/* Messages area with flex-grow and overflow */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"> {/* min-h-0 ensures proper scrolling */}
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

            {/* Input area - fixed at bottom */}
            <div className={`border-t ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
              <form onSubmit={handleSendMessage} className="p-4">
                <div className="flex gap-2">
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
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}