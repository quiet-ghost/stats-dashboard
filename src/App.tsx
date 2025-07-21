import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/FileUpload';
import { Dashboard } from '@/components/Dashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { processExcelFile, combineDataFromFiles } from '@/utils/excelProcessor';
import type { FileUpload as FileUploadType, StatsData } from '@/types';
import { BarChart3, Upload } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<FileUploadType[]>([]);
  const [allData, setAllData] = useState<StatsData[]>([]);

  const handleFilesAdded = useCallback(async (newFiles: File[]) => {
    const fileUploads: FileUploadType[] = newFiles.map(file => ({
      file,
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      size: file.size,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...fileUploads]);

    // Process each file
    for (const fileUpload of fileUploads) {
      try {
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id ? { ...f, status: 'processing' } : f
        ));

        const data = await processExcelFile(fileUpload.file);
        
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id ? { ...f, status: 'completed', data } : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id ? { 
            ...f, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error'
          } : f
        ));
      }
    }
  }, []);

  const handleFileRemove = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Combine data from all successfully processed files
  React.useEffect(() => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.data);
    const combinedData = combineDataFromFiles(completedFiles.map(f => ({ data: f.data! })));
    setAllData(combinedData);
  }, [files]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Pick & Pack Stats Dashboard</h1>
              <p className="text-muted-foreground">
                Upload Excel files to analyze warehouse performance data. 
                Data is processed locally and creates a pivot table view for accurate employee analysis.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Files</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <FileUpload 
              files={files}
              onFilesAdded={handleFilesAdded}
              onFileRemove={handleFileRemove}
            />
            
            {allData.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✓ Successfully processed {allData.length} records from {files.filter(f => f.status === 'completed').length} files
                </p>
                <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                  Switch to the Dashboard tab to view your performance analytics.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard data={allData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
