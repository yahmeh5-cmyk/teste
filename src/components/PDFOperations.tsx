import React, { useState } from 'react';
import { 
  Compress, 
  Merge, 
  Split, 
  FileText, 
  Download,
  Loader,
  RefreshCw
} from 'lucide-react';
import { PDFFile, PDFOperation } from '../types';
import { PDFToolkit } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

interface PDFOperationsProps {
  files: PDFFile[];
  onClearFiles: () => void;
}

export const PDFOperations: React.FC<PDFOperationsProps> = ({ files, onClearFiles }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<PDFOperation | null>(null);

  const handleOperation = async (operation: PDFOperation) => {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um arquivo');
      return;
    }

    setIsProcessing(true);
    setCurrentOperation(operation);

    try {
      switch (operation) {
        case 'compress':
          await compressFiles();
          break;
        case 'merge':
          await mergeFiles();
          break;
        case 'split':
          await splitFiles();
          break;
        default:
          toast.error('Operação não implementada');
      }
    } catch (error) {
      console.error(`Error in ${operation}:`, error);
      toast.error(`Erro ao executar ${operation}`);
    } finally {
      setIsProcessing(false);
      setCurrentOperation(null);
    }
  };

  const compressFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      toast.loading(`Comprimindo ${file.name}...`, { id: 'compress' });
      
      const compressedBlob = await PDFToolkit.compressPDF(file.file);
      const filename = `compressed_${file.name}`;
      PDFToolkit.downloadFile(compressedBlob, filename);
      
      toast.success(`${file.name} comprimido com sucesso!`);
    }
    toast.dismiss('compress');
  };

  const mergeFiles = async () => {
    if (files.length < 2) {
      toast.error('Selecione pelo menos 2 arquivos para mesclar');
      return;
    }

    toast.loading('Mesclando PDFs...', { id: 'merge' });
    
    const mergedBlob = await PDFToolkit.mergePDFs(files.map(f => f.file));
    const filename = `merged_${Date.now()}.pdf`;
    PDFToolkit.downloadFile(mergedBlob, filename);
    
    toast.dismiss('merge');
    toast.success('PDFs mesclados com sucesso!');
  };

  const splitFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      toast.loading(`Dividindo ${file.name}...`, { id: 'split' });
      
      const splitBlobs = await PDFToolkit.splitPDF(file.file);
      
      splitBlobs.forEach((blob, index) => {
        const filename = `${file.name.replace('.pdf', '')}_page_${index + 1}.pdf`;
        PDFToolkit.downloadFile(blob, filename);
      });
      
      toast.success(`${file.name} dividido em ${splitBlobs.length} páginas!`);
    }
    toast.dismiss('split');
  };

  const operations = [
    {
      id: 'compress' as PDFOperation,
      title: 'Comprimir PDF',
      description: 'Reduza o tamanho dos seus PDFs',
      icon: Compress,
      color: 'bg-blue-500 hover:bg-blue-600',
      disabled: files.length === 0
    },
    {
      id: 'merge' as PDFOperation,
      title: 'Mesclar PDFs',
      description: 'Combine múltiplos PDFs em um',
      icon: Merge,
      color: 'bg-green-500 hover:bg-green-600',
      disabled: files.length < 2
    },
    {
      id: 'split' as PDFOperation,
      title: 'Dividir PDF',
      description: 'Separe páginas de um PDF',
      icon: Split,
      color: 'bg-orange-500 hover:bg-orange-600',
      disabled: files.length === 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {operations.map((op) => {
          const Icon = op.icon;
          const isCurrentOp = currentOperation === op.id;
          
          return (
            <button
              key={op.id}
              onClick={() => handleOperation(op.id)}
              disabled={isProcessing || op.disabled}
              className={`p-6 rounded-lg text-white font-medium transition-all duration-200 ${
                op.disabled 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : `${op.color} transform hover:scale-105 shadow-lg hover:shadow-xl`
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                {isCurrentOp ? (
                  <Loader className="h-8 w-8 animate-spin" />
                ) : (
                  <Icon className="h-8 w-8" />
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{op.title}</h3>
                  <p className="text-sm opacity-90">{op.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {files.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={onClearFiles}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Limpar Arquivos</span>
          </button>
        </div>
      )}
    </div>
  );
};