import { useState } from "react";
import { Languages, ArrowRightLeft, Copy, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export function Translator() {
  const [inputText, setInputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("hindi");
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: "auto", name: "Detect Language", flag: "🌐" },
    { code: "english", name: "English", flag: "🇺🇸" },
    { code: "hindi", name: "Hindi", flag: "🇮🇳" },
    { code: "marathi", name: "Marathi", flag: "🇮🇳" },
    { code: "spanish", name: "Spanish", flag: "🇪🇸" },
    { code: "french", name: "French", flag: "🇫🇷" },
    { code: "german", name: "German", flag: "🇩🇪" },
    { code: "chinese", name: "Chinese", flag: "🇨🇳" },
    { code: "japanese", name: "Japanese", flag: "🇯🇵" },
    { code: "arabic", name: "Arabic", flag: "🇸🇦" },
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to translate",
        variant: "destructive",
      });
      return;
    }

    if (sourceLanguage === targetLanguage && sourceLanguage !== "auto") {
      toast({
        title: "Same languages selected",
        description: "Please select different source and target languages",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockTranslation: TranslationResult = {
        originalText: inputText,
        translatedText: `This is the translated version of your text in ${
          languages.find(l => l.code === targetLanguage)?.name || targetLanguage
        }. The translation maintains the meaning and context while adapting to the target language's structure and cultural nuances.`,
        sourceLanguage: sourceLanguage === "auto" ? "english" : sourceLanguage,
        targetLanguage: targetLanguage
      };

      setTranslation(mockTranslation);
      toast({
        title: "Translation complete!",
        description: "Text has been successfully translated",
      });
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "Please try again or check your connection",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    if (sourceLanguage === "auto") return;
    
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    
    // If there's a translation, swap the texts
    if (translation) {
      setInputText(translation.translatedText);
      setTranslation({
        ...translation,
        originalText: translation.translatedText,
        translatedText: translation.originalText,
        sourceLanguage: translation.targetLanguage,
        targetLanguage: translation.sourceLanguage,
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          AI Multilingual Translator
        </h2>
        <p className="text-muted-foreground">
          Translate your study materials into multiple languages
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Language Selection */}
        <Card className="glass mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">From</label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={swapLanguages}
                disabled={sourceLanguage === "auto"}
                variant="outline"
                size="icon"
                className="mt-6 glass-hover"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">To</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.filter(l => l.code !== "auto").map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Translation Interface */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="glass glass-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Original Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text to translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[300px] bg-background/50 resize-none"
                rows={12}
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={() => speakText(inputText, sourceLanguage)}
                  disabled={!inputText.trim()}
                  variant="outline"
                  size="sm"
                  className="glass-hover"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen
                </Button>
                
                <Button
                  onClick={() => copyToClipboard(inputText)}
                  disabled={!inputText.trim()}
                  variant="outline"
                  size="sm"
                  className="glass-hover"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>

              <Button 
                onClick={handleTranslate} 
                disabled={isTranslating || !inputText.trim()}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {isTranslating ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4 mr-2" />
                    Translate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="glass glass-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Translation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {translation ? (
                <div className="space-y-4 animate-scale-in">
                  <div className="min-h-[300px] p-4 bg-background/50 rounded-lg border">
                    <p className="text-sm leading-relaxed">
                      {translation.translatedText}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => speakText(translation.translatedText, targetLanguage)}
                      variant="outline"
                      size="sm"
                      className="glass-hover"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                    
                    <Button
                      onClick={() => copyToClipboard(translation.translatedText)}
                      variant="outline"
                      size="sm"
                      className="glass-hover"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                    Translated from {
                      languages.find(l => l.code === translation.sourceLanguage)?.name
                    } to {
                      languages.find(l => l.code === translation.targetLanguage)?.name
                    }
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Languages className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Translation will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}