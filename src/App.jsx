import React, { useState, useRef } from 'react';
import { AlertCircle, Upload, Image, FileText, Plus, X } from 'lucide-react';

const DashboardApp = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    setIsProcessing(true);
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size,
      file: file
    }));

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const renderHome = () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl md:text-2xl text-gray-100">Welcome</h2>
        <p className="text-gray-400">Get started with your data visualization</p>
        <button
          onClick={() => setCurrentSection('login')}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 mt-4"
        >
          Login
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl md:text-2xl text-gray-100">Account Access</h2>
        <div className="space-y-4 mt-4">
          <button
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => setCurrentSection('dashboard')}
          >
            Login
          </button>
          <button
            className="w-full rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-700"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg md:text-xl text-gray-100">Features</h3>
            <div className="space-y-2 text-gray-300 mt-4">
              <div className="flex items-center space-x-2">
                <Upload size={16} />
                <span>Data Upload</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image size={16} />
                <span>Visualization</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText size={16} />
                <span>Analysis</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg md:text-xl text-gray-100">Upload Data</h3>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-300">
                Drag & drop files here or click to select
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9 space-y-6">
          {isProcessing && (
            <div className="bg-blue-900 text-blue-100 p-4 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4" />
              <p className="ml-2">Processing your files... Please wait.</p>
            </div>
          )}

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-lg md:text-xl text-gray-100">Your Files</h3>
              <button 
                className="rounded-full bg-blue-600 p-2 hover:bg-blue-700"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {uploadedFiles.map(file => (
                <div
                  key={file.id}
                  className="group relative flex flex-col items-center rounded-lg border border-gray-700 p-4 hover:bg-gray-700"
                >
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  {file.type === 'image' ? (
                    <Image className="h-8 w-8 text-gray-300" />
                  ) : (
                    <FileText className="h-8 w-8 text-gray-300" />
                  )}
                  <span className="mt-2 text-sm text-gray-300 text-center break-all">
                    {file.name}
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'home':
        return renderHome();
      case 'login':
        return renderLogin();
      case 'dashboard':
        return renderDashboard();
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {renderContent()}
    </div>
  );
};

export default DashboardApp;
