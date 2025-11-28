import React, { useState, useRef } from 'react';
import { Upload, Eye, Search, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

// Type definitions
interface ExcelDataItem {
  [key: string]: string | number | boolean | null;
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

interface PostingStatus {
  loading?: boolean;
  success?: boolean;
  error?: string;
  postAll?: {
    inProgress: boolean;
    completed: number;
    total: number;
    errors?: number;
  };
  generateAll?: {
    inProgress: boolean;
    completed: number;
    total: number;
  };
  [key: number]: 'generating' | 'success' | undefined;
}

const EventsExcelDataProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelDataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [postingStatus, setPostingStatus] = useState<PostingStatus>({});
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [processingInfo, setProcessingInfo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postStatusStore, setPostStatusStore] = useState<string | any>({});

  // console.log("excelData", excelData);
  console.log("postStatus", postStatusStore);

  // Function to extract Excel data using xlsx library
  const extractExcelData = async (file: File): Promise<ExcelDataItem[]> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get the first worksheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1, // Use first row as header
            defval: '' // Default value for empty cells
          }) as (string | number)[][];

          if (jsonData.length === 0) {
            throw new Error('Excel file is empty');
          }

          // Extract headers from first row
          const headers = jsonData[0].map(header => String(header).trim());
          setColumns(headers);

          // Convert rows to objects
          const rows: ExcelDataItem[] = jsonData.slice(1).map((row, index) => {
            const rowData: ExcelDataItem = { _id: index + 1 }; // Add unique ID

            headers.forEach((header, colIndex) => {
              const cellValue = row[colIndex];
              rowData[header] = cellValue !== undefined ? cellValue : '';
            });

            return rowData;
          }).filter(row => {
            // Filter out completely empty rows
            // Check if any column (except _id) has meaningful content
            return Object.entries(row).some(([key, value]) => {
              if (key === '_id') return false; // Skip the internal ID field

              // Check if value has meaningful content
              if (value === null || value === undefined || value === '') return false;

              // Handle whitespace-only strings
              if (typeof value === 'string' && value.trim() === '') return false;

              // Handle zero values (0 is considered valid data)
              if (value === 0) return true;

              // Handle boolean false (false is considered valid data)
              if (value === false) return true;

              // Any other non-empty value is considered valid
              return true;
            });
          }).map((row, index) => ({
            ...row,
            _id: index + 1 // Re-assign sequential IDs after filtering
          }));

          // Log filtering results for debugging
          const totalRowsBeforeFilter = jsonData.length - 1; // Subtract header row
          const filteredRowsCount = totalRowsBeforeFilter - rows.length;
          console.log(`Excel processing: ${totalRowsBeforeFilter} total rows, ${filteredRowsCount} empty rows filtered out, ${rows.length} rows with data`);

          // Set processing info for user feedback
          if (filteredRowsCount > 0) {
            setProcessingInfo(`Processed ${totalRowsBeforeFilter} rows, filtered out ${filteredRowsCount} empty rows. Showing ${rows.length} rows with data.`);
          } else {
            setProcessingInfo(`Processed ${rows.length} rows with data.`);
          }

          setIsLoading(false);
          resolve(rows);
        } catch (error) {
          setIsLoading(false);
          const errorMessage = error instanceof Error ? error.message : 'Failed to parse Excel file';
          setError(errorMessage);
          reject(new Error(errorMessage));
        }
      };

      reader.onerror = () => {
        setIsLoading(false);
        const errorMessage = 'Failed to read file';
        setError(errorMessage);
        reject(new Error(errorMessage));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      // Validate file type
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'];

      if (!validTypes.includes(uploadedFile.type) &&
        !uploadedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
        setError('Please select a valid Excel file (.xlsx, .xls, or .csv)');
        return;
      }

      setFile(uploadedFile);
      setError(null);
      setProcessingInfo(null);

      try {
        const data = await extractExcelData(uploadedFile);
        setExcelData(data);
        setPostingStatus({});
      } catch (error) {
        console.error('Error reading Excel file:', error);
        setExcelData([]);
        setColumns([]);
      }
    }
  };

  const handlePostData = async () => {
    // Legacy function - posts all data at once
    setPostingStatus({ loading: true });

    const API_ENDPOINT = 'https://m6x894fyqk.execute-api.ap-south-1.amazonaws.com/dev2/';

    try {
      // Prepare all data for batch posting
      const dataToPost = excelData.map(item => {
        const { _id, _status, ...cleanData } = item;
        return cleanData;
      });

      // Create metadata for the batch request
      const uploadedAtIso = new Date().toISOString();
      const safeFileName = (file?.name || 'excel').replace(/[^\x00-\x7F]/g, '_'); // Replace non-ASCII chars
      const metadata = {
        uploadedAt: uploadedAtIso,
        fileName: file?.name || 'unknown',
        batchSize: dataToPost.length,
        isBatch: true
      };

      // Make API call to post all data with required format (ARRAY, not array-of-array)
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `${safeFileName}:${uploadedAtIso}`
        },
        body: JSON.stringify({ data: dataToPost, metadata }) // ✅ send array directly
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Successfully posted all data:', result);

      // Update all data with posted status
      const updatedData = excelData.map(item => ({
        ...item,
        _status: 'posted' as const
      }));
      setExcelData(updatedData);
      setPostingStatus({ success: true, loading: false });

    } catch (error) {
      console.error('Error posting data:', error);
      alert(`Failed to post data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setPostingStatus({ loading: false });
    }
  };


  const handlePostAllData = async () => {
    const pendingItems = excelData.filter(item => !item._status || item._status === 'pending');
    if (pendingItems.length === 0) {
      alert('No pending items to post.');
      return;
    }

    setPostingStatus(prev => ({
      ...prev,
      postAll: {
        inProgress: true,
        completed: 0,
        total: pendingItems.length,
        errors: 0
      }
    }));

    // const API_ENDPOINT = 'https://3qw4mfji02.execute-api.ap-south-1.amazonaws.com/prod/ingest';
    const API_ENDPOINT = 'https://m6x894fyqk.execute-api.ap-south-1.amazonaws.com/dev2/';
    // const API_ENDPOINT = 'https://9jkuuqgayb.execute-api.ap-south-1.amazonaws.com/dev/';

    // 🔑 Stabilize idempotency for the whole run
    const batchUploadedAtIso = new Date().toISOString();
    const safeFileName = (file?.name || 'excel').replace(/[^\x00-\x7F]/g, '_');

    // Post items one by one with actual API calls
    for (let i = 0; i < pendingItems.length; i++) {
      const item = pendingItems[i];

      try {
        // Prepare data for API (exclude internal fields)
        const { _id, _status, ...dataToPost } = item;

        // Create metadata for the request
        const metadata = {
          uploadedAt: batchUploadedAtIso,          // ✅ fixed for the batch
          fileName: file?.name || 'unknown',
          rowIndex: i + 1,
          totalRows: pendingItems.length
        };

        // Make API call to post data with required format (ARRAY with one item)
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': `${safeFileName}:${batchUploadedAtIso}:${i + 1}` // 👈 unique per row // ✅ fixed for the batch
          },
          body: JSON.stringify({ data: [dataToPost], metadata })        // ✅ wrap per-row object in array
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`Successfully posted item ${i + 1}:`, result);
        setPostStatusStore((prev: Record<string | number, any>) => ({ ...prev, [item._id]: { uploadId: result.uploadId } }));

        // Update data with posted status
        setExcelData(prevData =>
          prevData.map(dataItem =>
            dataItem._id === item._id ? { ...dataItem, _status: 'posted' } : dataItem
          )
        );

      } catch (error) {
        console.error(`Error posting item ${i + 1}:`, error);

        // Increment error count
        setPostingStatus(prev => ({
          ...prev,
          postAll: {
            ...prev.postAll!,
            errors: (prev.postAll?.errors || 0) + 1
          }
        }));

        // Continue to next item
      }

      // Update progress
      setPostingStatus(prev => ({
        ...prev,
        postAll: {
          ...prev.postAll!,
          completed: i + 1
        }
      }));

      // Small delay to avoid overwhelming the API
      if (i < pendingItems.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Complete the process
    setPostingStatus(prev => ({
      ...prev,
      postAll: {
        inProgress: false,
        completed: pendingItems.length,
        total: pendingItems.length
      }
    }));

    // Clear progress after 3 seconds
    setTimeout(() => {
      setPostingStatus(prev => {
        const { postAll, ...rest } = prev;
        return rest;
      });
    }, 3000);
  };

  const handleGenerateWebsite = async (id: string | number) => {
    const numericId = typeof id === 'number' ? id : parseInt(String(id));
    setPostingStatus(prev => ({ ...prev, [numericId]: 'generating' }));

    try {
      // Get the uploadId from postStatusStore for this item
      const uploadId = postStatusStore[numericId]?.uploadId;

      if (!uploadId) {
        throw new Error('No uploadId found for this item');
      }

      // const GENERATE_API_ENDPOINT = 'https://18pvso3ggh.execute-api.ap-south-1.amazonaws.com/dev/'; // Replace with your actual API
      const GENERATE_API_ENDPOINT = 'https://9jkuuqgayb.execute-api.ap-south-1.amazonaws.com/dev/';

      // Prepare payload for generate API
      const payload = {
        uploadid: uploadId,
        metadata: {
          fileName: file?.name || 'unknown',
          generatedAt: new Date().toISOString(),
          itemId: numericId
        }
      };

      // Call generate API
      const response = await fetch(GENERATE_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Successfully generated website:', result);

      // Update data with generated status
      const updatedData = excelData.map(item =>
        item._id === id ? { ...item, _status: 'generated' } : item
      );
      setExcelData(updatedData);
      setPostingStatus(prev => ({ ...prev, [numericId]: 'success' }));

    } catch (error) {
      console.error('Error generating website:', error);
      alert(`Failed to generate website: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setPostingStatus(prev => ({ ...prev, [numericId]: undefined }));
    }
  };

  const handleGenerateAllWebsites = async () => {
    const postedItems = excelData.filter(item => item._status === 'posted');
    if (postedItems.length === 0) {
      alert('No posted items to generate websites for. Please post data first.');
      return;
    }

    setPostingStatus(prev => ({
      ...prev,
      generateAll: {
        inProgress: true,
        completed: 0,
        total: postedItems.length
      }
    }));

    // const GENERATE_API_ENDPOINT = 'https://18pvso3ggh.execute-api.ap-south-1.amazonaws.com/dev';
    const GENERATE_API_ENDPOINT = 'https://9jkuuqgayb.execute-api.ap-south-1.amazonaws.com/dev/';

    // Generate websites one by one with actual API calls
    for (let i = 0; i < postedItems.length; i++) {
      const item = postedItems[i];
      const itemId = item._id || i;
      const numericId = typeof itemId === 'number' ? itemId : i;

      // Update individual item status
      setPostingStatus(prev => ({ ...prev, [numericId]: 'generating' }));

      try {
        // Get the uploadId from postStatusStore for this item
        const uploadId = postStatusStore[itemId]?.uploadId;

        if (!uploadId) {
          console.warn(`No uploadId found for item ${itemId}, skipping...`);
          continue;
        }

        // Prepare payload for generate API
        const payload = {
          uploadid: uploadId,
          metadata: {
            fileName: file?.name || 'unknown',
            generatedAt: new Date().toISOString(),
            itemIndex: i + 1,
            totalItems: postedItems.length
          }
        };

        // Call generate API
        const response = await fetch(GENERATE_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`Successfully generated website for item ${i + 1}:`, result);

        // Update data with generated status
        setExcelData(prevData =>
          prevData.map(dataItem =>
            dataItem._id === itemId ? { ...dataItem, _status: 'generated' } : dataItem
          )
        );

        // Update individual item status
        setPostingStatus(prev => ({ ...prev, [numericId]: 'success' }));

      } catch (error) {
        console.error(`Error generating website for item ${i + 1}:`, error);
        // Continue with next item even if one fails
      }

      // Update progress
      setPostingStatus(prev => ({
        ...prev,
        generateAll: {
          ...prev.generateAll!,
          completed: i + 1
        }
      }));

      // Increased delay to avoid overwhelming the API - changed from 500ms to 6000ms (6 seconds)
      if (i < postedItems.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 6000)); // Increased from 500ms to 6000ms
      }
    }

    // Complete the process
    setPostingStatus(prev => ({
      ...prev,
      generateAll: {
        inProgress: false,
        completed: postedItems.length,
        total: postedItems.length
      }
    }));

    // Clear progress after 3 seconds
    setTimeout(() => {
      setPostingStatus(prev => {
        const { generateAll, ...rest } = prev;
        return rest;
      });
    }, 3000);
  };

  const handleViewWebsite = (website: string) => {
    // In a real app, this would open the generated website
    alert(`Viewing website: ${website}`);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return excelData;

    return [...excelData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle different data types
      const aString = String(aValue || '').toLowerCase();
      const bString = String(bValue || '').toLowerCase();

      if (aString < bString) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aString > bString) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [excelData, sortConfig]);

  const filteredData = sortedData.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-800 mb-2">Excel Data Processor</h1>
          <p className="text-yellow-600 text-lg">Upload Events Excel files and manage your data</p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-yellow-300">
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-16 h-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-semibold text-yellow-800 mb-4">Upload Excel File</h2>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className={`${isLoading ? 'bg-yellow-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mb-4`}
            >
              <FileText className="w-5 h-5" />
              {isLoading ? 'Processing...' : 'Choose File'}
            </button>

            {file && (
              <p className="text-green-600 font-medium mb-4">
                Selected: {file.name}
              </p>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-medium">Error: {error}</p>
              </div>
            )}

            {processingInfo && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  {processingInfo}
                </p>
              </div>
            )}

            {excelData.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                {/* Post All Data Button */}
                <button
                  onClick={handlePostAllData}
                  disabled={postingStatus.postAll?.inProgress || excelData.every(item => item._status === 'posted' || item._status === 'generated')}
                  className={`${postingStatus.postAll?.inProgress || excelData.every(item => item._status === 'posted' || item._status === 'generated')
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600'
                    } text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2`}
                >
                  {postingStatus.postAll?.inProgress ? (
                    <>
                      <AlertCircle className="w-5 h-5 animate-spin" />
                      Posting {postingStatus.postAll.completed}/{postingStatus.postAll.total}
                    </>
                  ) : postingStatus.postAll?.completed === postingStatus.postAll?.total && (postingStatus.postAll?.total || 0) > 0 ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      All Posted ({postingStatus.postAll?.completed || 0})
                    </>
                  ) : excelData.every(item => item._status === 'posted' || item._status === 'generated') ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      All Data Posted
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Post All Data
                    </>
                  )}
                </button>

                {/* Legacy Single Post Button (Optional - for individual posting) */}
                {/* <button
                  onClick={handlePostData}
                  disabled={postingStatus.loading}
                  className={`${
                    postingStatus.loading 
                      ? 'bg-orange-400 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  } text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm`}
                >
                  {postingStatus.loading ? (
                    <>
                      <AlertCircle className="w-4 h-4 animate-spin" />
                      Posting...
                    </>
                  ) : postingStatus.success ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Posted!
                    </>
                  ) : (
                    'Post All (Legacy)'
                  )}
                </button> */}

                {/* Generate All Button */}
                {excelData.some(item => item._status === 'posted') && (
                  <button
                    onClick={handleGenerateAllWebsites}
                    disabled={postingStatus.generateAll?.inProgress}
                    className={`${postingStatus.generateAll?.inProgress
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                      } text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2`}
                  >
                    {postingStatus.generateAll?.inProgress ? (
                      <>
                        <AlertCircle className="w-5 h-5 animate-spin" />
                        Generating {postingStatus.generateAll.completed}/{postingStatus.generateAll.total}
                      </>
                    ) : postingStatus.generateAll?.completed === postingStatus.generateAll?.total && (postingStatus.generateAll?.total || 0) > 0 ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        All Generated ({postingStatus.generateAll?.completed || 0})
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Generate All Websites
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        {excelData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-yellow-300">
            {/* Search and Controls */}
            <div className="p-4 bg-yellow-50 border-b-2 border-yellow-200">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-600 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-yellow-700 whitespace-nowrap">Items per page:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="border border-yellow-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Results info and pagination */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-yellow-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} records
                  {filteredData.length < excelData.length && ` (filtered from ${excelData.length} total)`}
                </div>

                {/* Progress Indicators */}
                <div className="flex flex-col gap-2">
                  {/* Posting Progress Indicator */}
                  {postingStatus.postAll?.inProgress && (
                    <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-600 animate-spin" />
                      <div className="text-sm">
                        <span className="font-medium text-red-800">
                          Posting Data: {postingStatus.postAll.completed}/{postingStatus.postAll.total}
                          {(postingStatus.postAll.errors || 0) > 0 && (
                            <span className="text-orange-600 ml-2">({postingStatus.postAll.errors} errors)</span>
                          )}
                        </span>
                        <div className="w-32 bg-red-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(postingStatus.postAll.completed / postingStatus.postAll.total) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generation Progress Indicator */}
                  {postingStatus.generateAll?.inProgress && (
                    <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                      <AlertCircle className="w-4 h-4 text-blue-600 animate-spin" />
                      <div className="text-sm">
                        <span className="font-medium text-blue-800">
                          Generating Websites: {postingStatus.generateAll.completed}/{postingStatus.generateAll.total}
                        </span>
                        <div className="w-32 bg-blue-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(postingStatus.generateAll.completed / postingStatus.generateAll.total) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                        }`}
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                              ? 'bg-yellow-600 text-white'
                              : 'bg-white text-yellow-600 hover:bg-yellow-100 border border-yellow-300'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                        }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Table - Enhanced for better column visibility */}
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <table className="min-w-full table-auto">
                  <thead className="bg-yellow-100">
                    <tr>
                      <th className="px-3 py-3 text-left text-yellow-800 font-semibold text-xs uppercase tracking-wider min-w-[100px] whitespace-nowrap">
                        Actions
                      </th>
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="px-3 py-3 text-left text-yellow-800 font-semibold cursor-pointer hover:bg-yellow-200 transition-colors text-xs uppercase tracking-wider min-w-[120px] whitespace-nowrap"
                          onClick={() => handleSort(column)}
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate">{column}</span>
                            <span className="text-yellow-600">{getSortIcon(column)}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-100 bg-white">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row, index) => {
                        const rowId = row._id || (startIndex + index);
                        const numericRowId = typeof rowId === 'number' ? rowId : (startIndex + index);
                        return (
                          <tr key={`row-${rowId}`} className="hover:bg-yellow-50 transition-colors">
                            <td className="px-3 py-2 min-w-[100px]">
                              <div className="flex items-center gap-1">
                                {row._status === 'generated' && (
                                  <button
                                    onClick={() => handleViewWebsite(String(row.website || row.url || ''))}
                                    className="bg-black hover:bg-gray-800 text-white p-1.5 rounded-md transition-colors duration-200"
                                    title="View Website"
                                  >
                                    <Eye className="w-3 h-3" />
                                  </button>
                                )}

                                {row._status === 'posted' && (
                                  <button
                                    onClick={() => handleGenerateWebsite(numericRowId)}
                                    disabled={postingStatus[numericRowId] === 'generating'}
                                    className={`${postingStatus[numericRowId] === 'generating'
                                      ? 'bg-yellow-400 cursor-not-allowed'
                                      : 'bg-yellow-500 hover:bg-yellow-600'
                                      } text-white px-2 py-1 rounded-md transition-colors duration-200 text-xs font-medium`}
                                  >
                                    {postingStatus[numericRowId] === 'generating' ? (
                                      <span className="flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 animate-spin" />
                                        <span className="hidden sm:inline">Gen...</span>
                                      </span>
                                    ) : postingStatus[numericRowId] === 'success' ? (
                                      <span className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span className="hidden sm:inline">Done</span>
                                      </span>
                                    ) : (
                                      <span className="hidden sm:inline">Generate</span>
                                    )}
                                  </button>
                                )}

                                {row._status === 'generated' && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    ✓
                                  </span>
                                )}

                                {(!row._status || row._status === 'pending') && (
                                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                    ⏳
                                  </span>
                                )}
                              </div>
                            </td>
                            {columns.map((column) => (
                              <td key={`${rowId}-${column}`} className="px-3 py-2 text-yellow-900 text-xs min-w-[120px]">
                                <div className="truncate max-w-[150px]" title={String(row[column] || '')}>
                                  {String(row[column] || '')}
                                </div>
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-yellow-600">
                          {searchTerm ? 'No matching records found. Try adjusting your search.' : 'No data to display.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {excelData.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Data Available</h3>
            <p className="text-yellow-600">Upload an Excel file to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsExcelDataProcessor;
