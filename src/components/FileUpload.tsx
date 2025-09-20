import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { PDFFile } from '../types';

interface FileUploadProps {
  onFilesAdded: (files: PDFFile[]) => void;
  files: PDFFile[];
  onRemoveFile: (id: string) => void;
  acceptedTypes?: string[];
  multiple?: boolean;
  title?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesAdded,
  files,
  onRemoveFile,
  acceptedTypes = ['.pdf'],
  multiple = true,
  title = 'Arraste arquivos aqui ou clique para selecionar'
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: PDFFile[] = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      size: file.size,
      file
    }));
    onFilesAdded(newFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: acceptedTypes.reduce((acc, type) => {
      if (type === '.pdf') acc['application/pdf'] = ['.pdf'];
      if (type === '.docx') acc['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
      if (type === '.doc') acc['application/msword'] = ['.doc'];
      if (type === '.xlsx') acc['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx'];
      if (type === '.xls') acc['application/vnd.ms-excel'] = ['.xls'];
      if (type === '.csv') acc['text/csv'] = ['.csv'];
      if (type === '.txt') acc['text/plain'] = ['.txt'];
      if (type === '.jpg' || type === '.jpeg') acc['image/jpeg'] = ['.jpg', '.jpeg'];
      if (type === '.png') acc['image/png'] = ['.png'];
      return acc;
    }, {} as Record<string, string[]>)
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">{title}</p>
        <p className="text-sm text-gray-500">
          {acceptedTypes.join(', ')} • Tamanho máximo: 10MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-gray-700">Arquivos selecionados:</h3>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(file.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};