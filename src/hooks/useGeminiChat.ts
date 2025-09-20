import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/genai';
import { ChatMessage, DocumentAnalysis } from '../types';

const API_KEY = process.env.GEMINI_API_KEY || '';

export const useGeminiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentAnalysis[]>([]);

  const genAI = new GoogleGenerativeAI(API_KEY);

  const addDocument = useCallback((doc: DocumentAnalysis) => {
    setDocuments(prev => [...prev, doc]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Create context from documents
      const documentContext = documents.map(doc => 
        `Documento: ${doc.fileName}\nConteúdo: ${doc.content.substring(0, 10000)}...`
      ).join('\n\n');

      const prompt = `
Você é um assistente especializado em análise de documentos. Aqui estão os documentos carregados:

${documentContext}

Usuário pergunta: ${content}

Por favor, responda baseado no conteúdo dos documentos fornecidos. Use formato Markdown para estruturar sua resposta quando apropriado. Se a pergunta não estiver relacionada aos documentos, informe que você só pode responder sobre os documentos carregados.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se a API key do Gemini está configurada corretamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [genAI, documents]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    documents,
    sendMessage,
    addDocument,
    clearChat,
    clearDocuments
  };
};