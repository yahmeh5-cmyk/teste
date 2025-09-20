import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { 
  MessageCircle, 
  Send, 
  FileText, 
  Trash2, 
  Upload,
  Bot,
  User,
  Loader
} from 'lucide-react';
import { useGeminiChat } from '../hooks/useGeminiChat';
import { PDFToolkit } from '../utils/pdfUtils';
import { PDFFile } from '../types';
import toast from 'react-hot-toast';
import 'highlight.js/styles/github.css';

interface DocumentChatProps {
  files: PDFFile[];
  onFilesAdded: (files: PDFFile[]) => void;
  onClearFiles: () => void;
}

export const DocumentChat: React.FC<DocumentChatProps> = ({
  files,
  onFilesAdded,
  onClearFiles
}) => {
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    messages,
    isLoading,
    documents,
    sendMessage,
    addDocument,
    clearChat,
    clearDocuments
  } = useGeminiChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeDocuments = async () => {
    if (files.length === 0) {
      toast.error('Adicione documentos para análise');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      for (const file of files) {
        toast.loading(`Analisando ${file.name}...`, { id: `analyze-${file.id}` });
        
        let content = '';
        
        if (file.name.toLowerCase().endsWith('.pdf')) {
          content = await PDFToolkit.extractTextFromPDF(file.file);
        } else if (file.name.toLowerCase().includes('.txt')) {
          content = await file.file.text();
        } else {
          // For other file types, try to extract as text
          content = await file.file.text();
        }
        
        addDocument({
          fileName: file.name,
          content: content,
          metadata: {
            size: file.size,
            type: file.file.type
          }
        });
        
        toast.dismiss(`analyze-${file.id}`);
        toast.success(`${file.name} analisado com sucesso!`);
      }
      
      toast.success('Todos os documentos foram analisados! Você já pode fazer perguntas.');
    } catch (error) {
      console.error('Error analyzing documents:', error);
      toast.error('Erro ao analisar documentos');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    if (documents.length === 0) {
      toast.error('Primeiro analise alguns documentos para poder fazer perguntas');
      return;
    }
    
    await sendMessage(message);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-t-lg shadow-lg p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Chat com Documentos</h2>
              <p className="text-gray-600">
                {documents.length > 0 
                  ? `${documents.length} documento(s) carregado(s)` 
                  : 'Faça upload e analise documentos para começar'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {files.length > 0 && (
              <button
                onClick={analyzeDocuments}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>{isAnalyzing ? 'Analisando...' : 'Analisar Documentos'}</span>
              </button>
            )}
            
            {documents.length > 0 && (
              <button
                onClick={() => {
                  clearDocuments();
                  clearChat();
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Arquivos carregados:</h3>
          <div className="flex flex-wrap gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg text-sm"
              >
                <FileText className="h-4 w-4 text-blue-500" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Nenhuma conversa ainda</p>
            <p>Faça upload de documentos e comece a fazer perguntas!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {msg.role === 'assistant' && (
                    <Bot className="h-5 w-5 mt-0.5 text-blue-500 flex-shrink-0" />
                  )}
                  {msg.role === 'user' && (
                    <User className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            code: ({ inline, className, children, ...props }) => {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline ? (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              ) : (
                                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                    <div className="text-xs mt-2 opacity-70">
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border shadow-sm p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-500" />
                <Loader className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-gray-500">Pensando...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder={
              documents.length > 0 
                ? 'Digite sua pergunta sobre os documentos...' 
                : 'Primeiro analise alguns documentos'
            }
            disabled={documents.length === 0 || isLoading}
            rows={1}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
            style={{ minHeight: '2.5rem', maxHeight: '8rem' }}
          />
          <button
            type="submit"
            disabled={!message.trim() || documents.length === 0 || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};