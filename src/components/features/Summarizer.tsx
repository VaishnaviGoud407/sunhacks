import { useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SummaryResult {
  summary: string;
  keyPoints: string[];
  language: string;
}

export function Summarizer() {
  const [inputText, setInputText] = useState("");
  const [language, setLanguage] = useState("english");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to summarize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockSummary: SummaryResult = {
        summary: "This is a comprehensive summary of the provided text, highlighting the main concepts and ideas in a concise format. The content covers key topics and provides essential insights for better understanding.",
        keyPoints: [
          "Main concept identification and analysis",
          "Key relationships between different topics",
          "Important definitions and terminology",
          "Critical insights and conclusions",
          "Practical applications and examples"
        ],
        language: language
      };

      setSummary(mockSummary);
      toast({
        title: "Summary generated!",
        description: "Your study summary is ready",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          AI Text Summarizer
        </h2>
        <p className="text-muted-foreground">
          Transform lengthy content into concise, digestible summaries
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass glass-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Input Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here to get an AI-powered summary..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] bg-background/50 border-muted"
              rows={12}
            />
            
            <div className="flex gap-3">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="marathi">Marathi</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={handleSummarize} 
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-primary hover:opacity-90 flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Summarize
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass glass-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="space-y-4 animate-scale-in">
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Summary</h4>
                  <p className="text-sm leading-relaxed bg-background/50 p-4 rounded-lg border">
                    {summary.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-primary">Key Points</h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, index) => (
                      <li 
                        key={index} 
                        className="flex items-start gap-2 text-sm"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="w-2 h-2 bg-gradient-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Export Summary
                </Button>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Your summary will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}