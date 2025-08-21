import { useState, useRef } from "react";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNotes, UploadedFile } from "@/contexts/NotesContext";

export function UploadNotes() {
  const { uploadedFiles: files, addFiles, removeFile, updateFile } = useNotes();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: false,
      content: `Sample extracted content from ${file.name}. This would be the actual text content extracted from your uploaded file using OCR for images or text extraction for PDFs. The content would be processed and made available for summarization, quiz generation, and flashcard creation.`
    }));

    addFiles(newFiles);

    // Simulate upload and content extraction
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        updateFile(file.id, { uploaded: true });
      }, 1000 * (index + 1));
    });

    toast({
      title: "Files uploading...",
      description: `${newFiles.length} file(s) being processed`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          Upload Your Study Materials
        </h2>
        <p className="text-muted-foreground">
          Upload PDFs, images, or documents to get started with AI-powered study tools
        </p>
      </div>

      <Card className="glass glass-hover">
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragOver 
                ? "border-primary bg-primary/10 scale-105" 
                : "border-muted hover:border-primary/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFileSelect(e.dataTransfer.files);
            }}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Drag and drop your files here
            </h3>
            <p className="text-muted-foreground mb-4">
              Supports PDF, PNG, JPG, and TXT files up to 10MB
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="w-5 h-5" />
              Uploaded Files ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card/50 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    {file.uploaded ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                    )}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}