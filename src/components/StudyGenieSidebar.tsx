import { useState } from "react";
import { 
  Upload, 
  FileText, 
  HelpCircle, 
  CreditCard, 
  MessageCircle, 
  Languages, 
  BarChart3,
  BookOpen,
  Sparkles
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Upload Notes", id: "upload", icon: Upload },
  { title: "Summarizer", id: "summarize", icon: FileText },
  { title: "Quiz Generator", id: "quiz", icon: HelpCircle },
  { title: "Flashcards", id: "flashcards", icon: CreditCard },
  { title: "AI Tutor", id: "tutor", icon: MessageCircle },
  { title: "Translate", id: "translate", icon: Languages },
  { title: "Dashboard", id: "dashboard", icon: BarChart3 },
];

interface StudyGenieSidebarProps {
  onViewChange?: (view: string) => void;
  currentView?: string;
}

export function StudyGenieSidebar({ onViewChange, currentView = "upload" }: StudyGenieSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (id: string) => currentView === id;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-primary text-primary-foreground font-medium glow-primary" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-300";

  return (
    <Sidebar className={`glass border-r border-sidebar-border ${collapsed ? "w-14" : "w-64"} transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg animate-glow-pulse">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold gradient-text">StudyGenie</h1>
              <p className="text-xs text-muted-foreground">AI Study Assistant</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-2">
            {!collapsed && "Features"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="glass-hover rounded-lg transition-all duration-300"
                  >
                    <button
                      onClick={() => onViewChange?.(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg ${getNavClass({ isActive: isActive(item.id) })}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Built at SUNHACKS 2025</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">GenAI Track</p>
        </div>
      )}
    </Sidebar>
  );
}