import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudyGenieSidebar } from "./StudyGenieSidebar";
import { UploadNotes } from "./features/UploadNotes";
import { Summarizer } from "./features/Summarizer";
import { QuizGenerator } from "./features/QuizGenerator";
import { Flashcards } from "./features/Flashcards";
import { InteractiveTutor } from "./features/InteractiveTutor";
import { Translator } from "./features/Translator";
import { Dashboard } from "./features/Dashboard";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";

interface StudyGenieLayoutProps {
  onViewChange?: (view: string) => void;
}

export function StudyGenieLayout(props: StudyGenieLayoutProps = {}) {
  const { onViewChange } = props;
  const [currentView, setCurrentView] = useState("upload");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "upload":
        return <UploadNotes />;
      case "summarize":
        return <Summarizer />;
      case "quiz":
        return <QuizGenerator />;
      case "flashcards":
        return <Flashcards />;
      case "tutor":
        return <InteractiveTutor />;
      case "translate":
        return <Translator />;
      case "dashboard":
        return <Dashboard />;
      default:
        return <UploadNotes />;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">StudyGenie</h1>
          <p className="text-muted-foreground">Loading your AI study assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-hero">
        {/* Global header with sidebar trigger */}
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-gradient-glass backdrop-blur-lg border-b border-glass-border">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger>
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold gradient-text">
                  📚 StudyGenie – Personalized Study Guide Generator
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Built at SUNHACKS 2025 – GenAI Track</span>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <StudyGenieSidebar onViewChange={handleViewChange} currentView={currentView} />

        {/* Main content */}
        <main className="flex-1 pt-14">
          <div className="container mx-auto p-6">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}