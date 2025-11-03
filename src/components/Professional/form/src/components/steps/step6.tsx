import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import * as mammoth from "mammoth";
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useForm } from '../../context/FormContext';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

interface ExtractedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  extractedText: string;
  uploadDate: Date;
}

interface Step6Props {
  className?: string;
  step?: any;
  allSteps?: any[];
  onSubmit?: (data: any) => void;
}

const Step6: React.FC<Step6Props> = ({ className = '', onSubmit }) => {
  const { data, updateField } = useForm();

  // ✅ Initialize with pre-filled resume data from context
  const [documents, setDocuments] = useState<ExtractedDocument[]>(() => {
    if (data.resume && Array.isArray(data.resume) && data.resume.length > 0) {
      console.log('Loading pre-filled resume data:', data.resume);
      // Convert any string dates back to Date objects and ensure proper typing
      return data.resume.map(doc => ({
        ...doc,
        uploadDate: doc.uploadDate instanceof Date ? doc.uploadDate : new Date(doc.uploadDate || Date.now())
      }));
    }
    return [];
  });

  const [selectedDocument, setSelectedDocument] = useState<ExtractedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Auto-select first document when documents are loaded from context
  useEffect(() => {
    if (documents.length > 0 && !selectedDocument) {
      setSelectedDocument(documents[0]);
    }
  }, [documents, selectedDocument]);

  // ✅ Update context and parent when documents change
  useEffect(() => {
    // Send data to parent (optional)
    if (onSubmit) {
      const payload = { documents, showFullText };
      onSubmit(payload);
    }

    // ✅ Update FormContext
    updateField('resume', documents);

    console.log('Updated FormContext resume:', documents);
  }, [documents, showFullText, onSubmit, updateField]);

  const handleSubmit = () => {
    const payload = {
      documents: documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        extractedText: doc.extractedText,
        uploadDate: doc.uploadDate,
      })),
      showFullText,
    };

    console.log("Submitting extracted data:", payload);

    if (onSubmit) {
      onSubmit(payload);
    } else {
      alert("Submit handler not provided — printing in console.");
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsLoading(true);
    const newDocuments: ExtractedDocument[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        console.log(`Processing file: ${file.name} (${file.type})`);
        const extractedText = await extractTextFromFile(file);
        const document: ExtractedDocument = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type || 'unknown',
          size: file.size,
          extractedText,
          uploadDate: new Date(),
        };
        newDocuments.push(document);
        console.log(`Successfully processed: ${file.name}`);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        const document: ExtractedDocument = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type || 'unknown',
          size: file.size,
          extractedText: `Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          uploadDate: new Date(),
        };
        newDocuments.push(document);
        errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0) {
      console.warn('File processing errors:', errors);
    }

    setDocuments(prev => [...prev, ...newDocuments]);
    if (newDocuments.length > 0 && !selectedDocument) {
      setSelectedDocument(newDocuments[0]);
    }
    setIsLoading(false);
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type.toLowerCase();
    if (fileType.includes('pdf')) return await extractTextFromPDF(file);
    if (fileType.includes('word') || fileType.includes('document') || file.name.endsWith('.docx')) return await extractTextFromWord(file);
    if (fileType.includes('text') || file.name.endsWith('.txt')) return await extractTextFromTxt(file);
    throw new Error(`Unsupported file type: ${fileType}`);
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => (item.str ? item.str : '')).join(' ');
        if (pageText.trim()) {
          fullText += `=== Page ${pageNum} ===\n${pageText.trim()}\n\n`;
        }
      }

      if (fullText.trim()) {
        return `Document: ${file.name}\nPages: ${pdf.numPages}\nExtracted: ${new Date().toLocaleString()}\n\n${fullText.trim()}`;
      } else {
        throw new Error('No readable text content found');
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      return `PDF Extraction failed for ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const extractTextFromWord = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || 'No text content found.';
  };

  const extractTextFromTxt = async (file: File): Promise<string> => {
    return await file.text();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const downloadText = (doc: ExtractedDocument) => {
    const element = document.createElement('a');
    const file = new Blob([doc.extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.name}_extracted.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (selectedDocument?.id === id) {
      const remaining = documents.filter(doc => doc.id !== id);
      setSelectedDocument(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string, name: string) => {
    if (type.includes('pdf') || name.endsWith('.pdf')) return '📄';
    if (type.includes('word') || name.endsWith('.docx') || name.endsWith('.doc')) return '📝';
    if (type.includes('text') || name.endsWith('.txt')) return '📋';
    return '📎';
  };

  return (
    <div className={`min-h-screen bg-yellow-50 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-yellow-400 rounded-lg shadow-lg p-6 mb-6 border-2 border-red-500">
          <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-red-600" />
            Document Text Extractor
          </h1>
          <p className="text-gray-800">
            Upload PDF, Word, or text documents to extract and view their content.
            {documents.length > 0 && (
              <span className="ml-2 text-green-700 font-semibold">
                ({documents.length} document{documents.length > 1 ? 's' : ''} loaded)
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border-2 border-red-300 overflow-hidden">
              <div className="bg-red-600 text-white p-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5" /> Upload Documents
                </h2>
              </div>

              <div
                className={`p-6 border-2 border-dashed m-4 rounded-lg transition-all duration-200 ${
                  dragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-yellow-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2">Drag & drop files here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isLoading ? 'Processing...' : 'Choose Files'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>

              {documents.length > 0 && (
                <div className="border-t border-gray-200">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Uploaded Documents</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedDocument?.id === doc.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-yellow-50'
                          }`}
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-lg">{getFileTypeIcon(doc.type, doc.name)}</span>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm text-gray-800 truncate">{doc.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadText(doc);
                                }}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                title="Download extracted text"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteDocument(doc.id);
                                }}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                title="Delete document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Display Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border-2 border-red-300 overflow-hidden h-full">
              <div className="bg-black text-white p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Extracted Text
                  {selectedDocument && (
                    <span className="text-sm font-normal text-gray-300">- {selectedDocument.name}</span>
                  )}
                </h2>
                {selectedDocument && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFullText(!showFullText)}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-black rounded text-sm font-medium hover:bg-yellow-400 transition-colors"
                    >
                      {showFullText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showFullText ? 'Collapse' : 'Expand'}
                    </button>
                    <button
                      onClick={() => downloadText(selectedDocument)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6">
                {selectedDocument ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">File:</span>
                          <p className="text-gray-600 truncate">{selectedDocument.name}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Size:</span>
                          <p className="text-gray-600">{formatFileSize(selectedDocument.size)}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Type:</span>
                          <p className="text-gray-600">{selectedDocument.type || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Uploaded:</span>
                          <p className="text-gray-600">{selectedDocument.uploadDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Extracted Content</h3>
                        <p className="text-sm text-gray-600">{selectedDocument.extractedText.length} characters</p>
                      </div>

                      <button onClick={() => console.log('FormContext data on next:', data)}>
                        Check FormContext
                      </button>

                      <div
                        className={`p-4 bg-white ${showFullText ? 'max-h-none' : 'max-h-96 overflow-y-auto'}`}
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {selectedDocument.extractedText ? (
                          <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {selectedDocument.extractedText}
                          </pre>
                        ) : (
                          <p className="text-gray-500 italic">No text content found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {documents.length > 0 ? 'Select a Document' : 'No Document Selected'}
                    </h3>
                    <p className="text-gray-500">
                      {documents.length > 0 
                        ? 'Choose a document from the list to view its extracted text.' 
                        : 'Upload a document to view its extracted text.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6;