import { useState, useEffect } from "react";
import { CreditCard, ChevronLeft, ChevronRight, RotateCcw, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export function Flashcards() {
  const [inputText, setInputText] = useState("");
  const [numCards, setNumCards] = useState("10");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const { toast } = useToast();

  const generateFlashcards = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to generate flashcards from",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockFlashcards: Flashcard[] = Array.from({ length: parseInt(numCards) }, (_, i) => ({
        id: i + 1,
        front: `Concept ${i + 1}`,
        back: `This is the detailed explanation for concept ${i + 1}, providing comprehensive information about the topic discussed in your study material. It includes key points, definitions, and important details that you should remember.`
      }));

      setFlashcards(mockFlashcards);
      setStudyMode(true);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      
      toast({
        title: "Flashcards generated!",
        description: `${mockFlashcards.length} flashcards ready for study`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const resetStudy = () => {
    setStudyMode(false);
    setFlashcards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!studyMode) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          flipCard();
          break;
        case 'ArrowLeft':
          prevCard();
          break;
        case 'ArrowRight':
          nextCard();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [studyMode, currentCardIndex, flashcards.length]);

  if (!studyMode) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-2">
            AI Flashcard Generator
          </h2>
          <p className="text-muted-foreground">
            Create interactive flashcards from your study material
          </p>
        </div>

        <Card className="glass glass-hover max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Create Flashcards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="flashcard-text">Study Material</Label>
              <Textarea
                id="flashcard-text"
                placeholder="Paste your study material here to generate flashcards..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] mt-2 bg-background/50"
                rows={8}
              />
            </div>

            <div>
              <Label htmlFor="num-cards">Number of Flashcards</Label>
              <Input
                id="num-cards"
                type="number"
                min="5"
                max="50"
                value={numCards}
                onChange={(e) => setNumCards(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={generateFlashcards} 
              disabled={isGenerating || !inputText.trim()}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Flashcards
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          Study Flashcards
        </h2>
        <p className="text-muted-foreground">
          Card {currentCardIndex + 1} of {flashcards.length}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6 bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
          />
        </div>

        {/* Flashcard */}
        <div className="relative h-80 mb-6">
          <div 
            className={`absolute inset-0 w-full h-full transition-transform duration-500 cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
            onClick={flipCard}
          >
            {/* Front of card */}
            <Card 
              className={`absolute inset-0 glass glass-hover backface-hidden ${
                !isFlipped ? 'block' : 'hidden'
              }`}
            >
              <CardContent className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">{currentCard.front}</h3>
                  <p className="text-muted-foreground text-sm">
                    Click to reveal answer • Press Space to flip
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Back of card */}
            <Card 
              className={`absolute inset-0 glass glass-hover backface-hidden ${
                isFlipped ? 'block' : 'hidden'
              }`}
            >
              <CardContent className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-lg leading-relaxed">{currentCard.back}</p>
                  <p className="text-muted-foreground text-sm mt-4">
                    Click to flip back • Use arrow keys to navigate
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            className="glass-hover"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={flipCard}
              className="bg-gradient-primary hover:opacity-90"
            >
              Flip Card
            </Button>
            
            <Button
              onClick={resetStudy}
              variant="outline"
              className="glass-hover"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Set
            </Button>
          </div>

          <Button
            onClick={nextCard}
            disabled={currentCardIndex === flashcards.length - 1}
            variant="outline"
            className="glass-hover"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Keyboard shortcuts:</span> 
            <span className="mx-2">Space</span> to flip • 
            <span className="mx-2">← →</span> to navigate
          </p>
        </div>
      </div>
    </div>
  );
}