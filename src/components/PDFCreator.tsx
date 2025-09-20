import React, { useState } from 'react';
import { FileText, Download, Loader } from 'lucide-react';
import { PDFToolkit } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

export const PDFCreator: React.FC = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePDF = async () => {
    if (!text.trim()) {
      toast.error('Digite algum texto para criar o PDF');
      return;
    }

    setIsCreating(true);
    
    try {
      toast.loading('Criando PDF...', { id: 'create' });
      
      const pdfBlob = await PDFToolkit.createPDFFromText(text, { 
        title: title.trim() || undefined 
      });
      
      const filename = title.trim() ? `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf` : `documento_${Date.now()}.pdf`;
      PDFToolkit.downloadFile(pdfBlob, filename);
      
      toast.dismiss('create');
      toast.success('PDF criado com sucesso!');
      
      // Clear form
      setText('');
      setTitle('');
    } catch (error) {
      console.error('Error creating PDF:', error);
      toast.dismiss('create');
      toast.error('Erro ao criar PDF');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Criar PDF</h2>
            <p className="text-gray-600">Digite seu texto e crie um PDF personalizado</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Documento (opcional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do documento..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo do Documento
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite o texto que deseja incluir no PDF..."
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
            />
          </div>

          <div className="text-sm text-gray-500">
            {text.length} caracteres
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCreatePDF}
            disabled={isCreating || !text.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            <span>{isCreating ? 'Criando...' : 'Criar PDF'}</span>
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Dicas:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• O título aparecerá no topo da primeira página</li>
          <li>• O texto será formatado automaticamente</li>
          <li>• Quebras de linha serão preservadas</li>
          <li>• Páginas adicionais serão criadas automaticamente conforme necessário</li>
        </ul>
      </div>
    </div>
  );
};