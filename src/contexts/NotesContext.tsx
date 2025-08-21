import { createContext, useContext, useState, ReactNode } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded: boolean;
  content?: string; // The extracted text content from the file
}

interface NotesContextType {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;
  addFiles: (files: UploadedFile[]) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<UploadedFile>) => void;
  getNotesContent: () => string;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const addFiles = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFile = (id: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, ...updates } : file
      )
    );
  };

  const getNotesContent = () => {
    return uploadedFiles
      .filter(file => file.uploaded && file.content)
      .map(file => `--- ${file.name} ---\n${file.content}`)
      .join('\n\n');
  };

  return (
    <NotesContext.Provider value={{
      uploadedFiles,
      setUploadedFiles,
      addFiles,
      removeFile,
      updateFile,
      getNotesContent
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}