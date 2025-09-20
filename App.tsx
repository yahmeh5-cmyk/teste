import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigation, TabType } from './src/components/Navigation';
import { FileUpload } from './src/components/FileUpload';
import { PDFOperations } from './src/components/PDFOperations';
import { FileConverter } from './src/components/FileConverter';
import { PDFCreator } from './src/components/PDFCreator';
import { DocumentChat } from './src/components/DocumentChat';
import { PDFFile } from './src/types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('operations');
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFilesAdded = (newFiles: PDFFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleClearFiles = () => {
    setFiles([]);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getAcceptedTypes = () => {
    switch (activeTab) {
      case 'converter':
        return ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt'];
      case 'chat':
        return ['.pdf', '.txt', '.doc', '.docx'];
      default:
        return ['.pdf'];
    }
  };

  const getUploadTitle = () => {
    switch (activeTab) {
      case 'operations':
        return 'Arraste arquivos PDF aqui';
      case 'converter':
        return 'Arraste arquivos para conversão';
      case 'chat':
        return 'Arraste documentos para análise';
      default:
        return 'Arraste arquivos aqui';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'operations':
        return (
          <div className="space-y-8">
            <FileUpload
              onFilesAdded={handleFilesAdded}
              files={files}
              onRemoveFile={handleRemoveFile}
              acceptedTypes={getAcceptedTypes()}
              title={getUploadTitle()}
            />
            <PDFOperations files={files} onClearFiles={handleClearFiles} />
          </div>
        );
      
      case 'converter':
        return (
          <div className="space-y-8">
            <FileUpload
              onFilesAdded={handleFilesAdded}
              files={files}
              onRemoveFile={handleRemoveFile}
              acceptedTypes={getAcceptedTypes()}
              title={getUploadTitle()}
            />
            <FileConverter files={files} onClearFiles={handleClearFiles} />
          </div>
        );
      
      case 'creator':
        return <PDFCreator />;
      
      case 'chat':
        return (
          <DocumentChat
            files={files}
            onFilesAdded={handleFilesAdded}
            onClearFiles={handleClearFiles}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />
      
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {activeTab !== 'chat' && activeTab !== 'creator' && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === 'operations' && 'Operações com PDF'}
                {activeTab === 'converter' && 'Conversor de Arquivos'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'operations' && 'Comprima, mescle e divida seus PDFs facilmente'}
                {activeTab === 'converter' && 'Converta entre diferentes formatos de documento'}
              </p>
            </div>
          )}
          
          {renderContent()}
        </div>
      </main>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;