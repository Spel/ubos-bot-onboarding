import React, { useState } from 'react';
import { ChevronDown, Play, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { updateBot } from "../../utils/botsData";

export function PromptSection({ darkMode, bot }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    mode: 'balanced',
    model: 'gpt-4',
    systemPrompt: bot?.systemPrompt || '',
    maxTokens: bot?.maxTokens || 2000,
    memoryType: bot?.memoryType || 'conversation',
  });

  const modeSettings = {
    creative: {
      label: 'Creative',
      description: 'More imaginative and varied responses, better for brainstorming and creative tasks',
      temperature: 0.9,
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      )
    },
    balanced: {
      label: 'Balanced',
      description: 'Good mix of creativity and precision, suitable for most tasks',
      temperature: 0.7,
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97Z" />
        </svg>
      )
    },
    precise: {
      label: 'Precise',
      description: 'More focused and deterministic responses, better for factual or technical tasks',
      temperature: 0.3,
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      )
    }
  };

  const models = {
    ubos: [
      { id: 'ubos-llm', label: 'UBOS LLM', description: 'Default UBOS language model' },
    ],
    openai: [
      { id: 'gpt-4', label: 'GPT-4', description: 'Most capable OpenAI model' },
      { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Faster version of GPT-4' },
      { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and efficient model' }
    ],
    anthropic: [
      { id: 'claude-3-opus', label: 'Claude 3 Opus', description: 'Most capable Anthropic model' },
      { id: 'claude-3-sonnet', label: 'Claude 3 Sonnet', description: 'Balanced performance and speed' },
      { id: 'claude-3-haiku', label: 'Claude 3 Haiku', description: 'Fast and efficient model' }
    ]
  };

  const memoryTypes = [
    { 
      id: 'conversation',
      label: 'Conversation Memory',
      description: 'Remember context within the current conversation',
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      )
    },
    { 
      id: 'long-term',
      label: 'Long-term Memory',
      description: 'Remember context across multiple conversations using vector database',
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
        </svg>
      )
    },
    { 
      id: 'none',
      label: 'No Memory',
      description: 'Each interaction is independent, no context is maintained',
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedBot = {
        ...bot,
        ...formData
      };
      
      await updateBot(bot.id, updatedBot);
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating bot:', error);
      alert('There was an error updating your bot. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* System Prompt Section */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          System Prompt
        </h2>
        <div className="space-y-2">
          <textarea
            value={formData.systemPrompt}
            onChange={(e) => handleChange('systemPrompt', e.target.value)}
            placeholder="Define how your agent should behave and what role it should take..."
            className={`w-full h-32 p-3 rounded-lg resize-none ${
              darkMode 
                ? 'bg-neutral-900 text-white border-neutral-700 focus:border-blue-500' 
                : 'bg-white text-gray-900 border-gray-200 focus:border-blue-500'
            } border focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
          />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            This prompt sets the foundation for how your agent will behave in all interactions.
          </p>
        </div>
      </div>

      {/* Model Selection */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Language Model
        </h2>
        <div className="space-y-4">
          <select
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              darkMode 
                ? 'bg-neutral-900 text-white border-neutral-700 focus:border-blue-500' 
                : 'bg-white text-gray-900 border-gray-200 focus:border-blue-500'
            } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
          >
            {Object.entries(models).map(([category, categoryModels]) => (
              <optgroup key={category} label={category.toUpperCase()}>
                {categoryModels.map((modelOption) => (
                  <option key={modelOption.id} value={modelOption.id}>
                    {modelOption.label} - {modelOption.description}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Response Style and Memory Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Response Style */}
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Response Style
          </h2>
          <div className="space-y-4">
            {Object.entries(modeSettings).map(([key, setting]) => (
              <div
                key={key}
                className={`relative flex items-center p-3 cursor-pointer rounded-lg border ${
                  formData.mode === key
                    ? darkMode
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-blue-500 bg-blue-50'
                    : darkMode
                    ? 'border-neutral-700 hover:border-neutral-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleChange('mode', key)}
              >
                <input
                  type="radio"
                  name="mode"
                  value={key}
                  checked={formData.mode === key}
                  onChange={() => handleChange('mode', key)}
                  className="sr-only"
                />
                <div className={`${darkMode ? 'text-white' : 'text-gray-900'} mr-3`}>
                  {setting.icon}
                </div>
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {setting.label}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {setting.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Configuration */}
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Memory & Context
          </h2>
          <div className="space-y-4">
            {memoryTypes.map((memory) => (
              <div
                key={memory.id}
                className={`relative flex items-center p-3 cursor-pointer rounded-lg border ${
                  formData.memoryType === memory.id
                    ? darkMode
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-blue-500 bg-blue-50'
                    : darkMode
                    ? 'border-neutral-700 hover:border-neutral-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleChange('memoryType', memory.id)}
              >
                <input
                  type="radio"
                  name="memoryType"
                  value={memory.id}
                  checked={formData.memoryType === memory.id}
                  onChange={() => handleChange('memoryType', memory.id)}
                  className="sr-only"
                />
                <div className={`${darkMode ? 'text-white' : 'text-gray-900'} mr-3`}>
                  {memory.icon}
                </div>
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {memory.label}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {memory.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Max Tokens and Save Button */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Max Tokens
            </label>
            <input
              type="number"
              value={formData.maxTokens}
              onChange={(e) => handleChange('maxTokens', e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-neutral-900 text-white border-neutral-700 focus:border-blue-500' 
                  : 'bg-white text-gray-900 border-gray-200 focus:border-blue-500'
              } focus:ring-1 focus:ring-blue-500 outline-none transition-colors`}
            />
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          {saveSuccess && (
            <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              Changes saved successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
