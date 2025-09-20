import React, { useState } from 'react';
import { 
  ArrowRight, 
  FileText, 
  Image, 
  Download,
  Loader,
  RefreshCw
} from 'lucide-react';
import { PDFFile } from '../types';
import { PDFToolkit } from '../utils/pdfUtils';
import toast from 'react-hot-toast';

interface FileConverterProps {
  files: PDFFile[];
  onClearFiles: () => void;
}

export const FileConverter: React.FC<FileConverterProps> = ({ files, onClearFiles }) => {
  const [isConverting, setIsConverting] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);

  const handleConversion = async (type: string) => {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um arquivo');
      return;
    }

    setIsConverting(true);
    setCurrentOperation(type);

    try {
      switch (type) {
        case 'word-to-pdf':
          await convertWordToPDF();
          break;
        case 'excel-to-pdf':
          await convertExcelToPDF();
          break;
        case 'csv-to-pdf':
          await convertCSVToPDF();
          break;
        case 'pdf-to-images':
          await convertPDFToImages();
          break;
        default:
          toast.error('Tipo de conversão não suportado');
      }
    } catch (error) {
      console.error(`Error in ${type}:`, error);
      toast.error(`Erro na conversão: ${error}`);
    } finally {
      setIsConverting(false);
      setCurrentOperation(null);
    }
  };

  const convertWordToPDF = async () => {
    for (const file of files) {
      if (!file.name.toLowerCase().includes('.doc')) continue;
      
      toast.loading(`Convertendo ${file.name}...`, { id: 'convert' });
      
      const pdfBlob = await PDFToolkit.convertWordToPDF(file.file);
      const filename = file.name.replace(/\.(docx?)/i, '.pdf');
      PDFToolkit.downloadFile(pdfBlob, filename);
      
      toast.success(`${file.name} convertido para PDF!`);
    }
    toast.dismiss('convert');
  };

  const convertExcelToPDF = async () => {
    for (const file of files) {
      if (!file.name.toLowerCase().includes('.xls')) continue;
      
      toast.loading(`Convertendo ${file.name}...`, { id: 'convert' });
      
      const pdfBlob = await PDFToolkit.convertExcelToPDF(file.file);
      const filename = file.name.replace(/\.(xlsx?)/i, '.pdf');
      PDFToolkit.downloadFile(pdfBlob, filename);
      
      toast.success(`${file.name} convertido para PDF!`);
    }
    toast.dismiss('convert');
  };

  const convertCSVToPDF = async () => {
    for (const file of files) {
      if (!file.name.toLowerCase().includes('.csv')) continue;
      
      toast.loading(`Convertendo ${file.name}...`, { id: 'convert' });
      
      const pdfBlob = await PDFToolkit.convertCSVToPDF(file.file);
      const filename = file.name.replace(/\.csv/i, '.pdf');
      PDFToolkit.downloadFile(pdfBlob, filename);
      
      toast.success(`${file.name} convertido para PDF!`);
    }
    toast.dismiss('convert');
  };

  const convertPDFToImages = async () => {
    for (const file of files) {
      if (!file.name.toLowerCase().includes('.pdf')) continue;
      
      toast.loading(`Convertendo ${file.name} para imagens...`, { id: 'convert' });
      
      const imageBlobs = await PDFToolkit.convertPDFToImages(file.file);
      
      imageBlobs.forEach((blob, index) => {
        const filename = `${file.name.replace('.pdf', '')}_page_${index + 1}.png`;
        PDFToolkit.downloadFile(blob, filename);
      });
      
      toast.success(`${file.name} convertido para ${imageBlobs.length} imagens!`);
    }
    toast.dismiss('convert');
  };

  const conversions = [
    {
      id: 'word-to-pdf',
      title: 'Word → PDF',
      description: 'Converta documentos Word para PDF',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      acceptedTypes: ['.doc', '.docx'],
      disabled: !files.some(f => f.name.toLowerCase().includes('.doc'))
    },
    {
      id: 'excel-to-pdf',
      title: 'Excel → PDF',
      description: 'Converta planilhas Excel para PDF',
      icon: FileText,
      color: 'bg-green-500 hover:bg-green-600',
      acceptedTypes: ['.xls', '.xlsx'],
      disabled: !files.some(f => f.name.toLowerCase().includes('.xls'))
    },
    {
      id: 'csv-to-pdf',
      title: 'CSV → PDF',
      description: 'Converta arquivos CSV para PDF',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600',
      acceptedTypes: ['.csv'],
      disabled: !files.some(f => f.name.toLowerCase().includes('.csv'))
    },
    {
      id: 'pdf-to-images',
      title: 'PDF → Imagens',
      description: 'Converta páginas do PDF em imagens',
      icon: Image,
      color: 'bg-purple-500 hover:bg-purple-600',
      acceptedTypes: ['.pdf'],
      disabled: !files.some(f => f.name.toLowerCase().includes('.pdf'))
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {conversions.map((conversion) => {
          const Icon = conversion.icon;
          const isCurrentOp = currentOperation === conversion.id;
          
          return (
            <button
              key={conversion.id}
              onClick={() => handleConversion(conversion.id)}
              disabled={isConverting || conversion.disabled}
              className={`p-4 rounded-lg text-white font-medium transition-all duration-200 ${
                conversion.disabled 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : `${conversion.color} transform hover:scale-105 shadow-lg hover:shadow-xl`
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                {isCurrentOp ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
                <div className="text-center">
                  <h3 className="text-sm font-semibold">{conversion.title}</h3>
                  <p className="text-xs opacity-90">{conversion.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>Tipos suportados:</p>
        <p className="font-medium">
          Para PDF: Word (.doc, .docx), Excel (.xls, .xlsx), CSV (.csv)
        </p>
        <p className="font-medium">
          Do PDF: Imagens (.png)
        </p>
      </div>

      {files.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={onClearFiles}
            disabled={isConverting}
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