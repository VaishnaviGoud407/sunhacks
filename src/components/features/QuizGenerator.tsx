import { useState } from "react";
import { HelpCircle, CheckCircle, XCircle, Trophy, RotateCcw, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useNotes } from "@/contexts/NotesContext";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: { [key: number]: number };
}

export function QuizGenerator() {
  const { getNotesContent, uploadedFiles } = useNotes();
  const [numQuestions, setNumQuestions] = useState("5");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async () => {
    const notesContent = getNotesContent();
    if (!notesContent.trim()) {
      toast({
        title: "No notes available",
        description: "Please upload some study materials first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockQuestions: Question[] = Array.from({ length: parseInt(numQuestions) }, (_, i) => ({
        id: i + 1,
        question: `Sample question ${i + 1}: What is the main concept discussed in the text regarding topic ${i + 1}?`,
        options: [
          `Option A for question ${i + 1}`,
          `Option B for question ${i + 1}`,
          `Option C for question ${i + 1}`,
          `Option D for question ${i + 1}`,
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This is the explanation for question ${i + 1}, providing detailed reasoning for the correct answer.`
      }));

      setQuestions(mockQuestions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setUserAnswers({});
      setQuizResult(null);
      
      toast({
        title: "Quiz generated!",
        description: `${mockQuestions.length} questions ready`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return userAnswers[index] === question.correctAnswer ? count + 1 : count;
    }, 0);

    setQuizResult({
      score: correctAnswers,
      totalQuestions: questions.length,
      answers: userAnswers
    });
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuizResult(null);
    setQuestions([]);
  };

  if (!quizStarted && questions.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-2">
            AI Quiz Generator
          </h2>
          <p className="text-muted-foreground">
            Generate personalized quizzes from your study materials
          </p>
        </div>

        <Card className="glass glass-hover max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Create Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedFiles.length > 0 ? (
              <div className="space-y-3">
                <div>
                  <Label>Your Uploaded Notes</Label>
                  <div className="mt-2 max-h-[200px] overflow-y-auto space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="p-3 rounded-lg border bg-background/50">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm font-medium">{file.name}</span>
                          {file.uploaded && <span className="text-xs text-green-500">✓ Ready</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {uploadedFiles.filter(f => f.uploaded).length} files ready for quiz generation
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground">No notes uploaded yet</p>
                  <p className="text-sm text-muted-foreground">Go to Upload Notes to add your study materials</p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="num-questions">Number of Questions</Label>
              <Input
                id="num-questions"
                type="number"
                min="3"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={generateQuiz} 
              disabled={isGenerating || uploadedFiles.filter(f => f.uploaded).length === 0}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Generate Quiz from Notes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizResult) {
    const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);
    
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="glass glass-hover max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {percentage}%
              </div>
              <p className="text-muted-foreground">
                {quizResult.score} out of {quizResult.totalQuestions} questions correct
              </p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Question Review</h4>
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="p-3 rounded-lg border bg-background/50">
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-medium">Question {index + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {question.question}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-muted-foreground">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <Button 
              onClick={resetQuiz} 
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Create New Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          Quiz Time!
        </h2>
        <p className="text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="glass glass-hover">
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={userAnswers[currentQuestion] === index ? "default" : "outline"}
                className={`w-full text-left justify-start p-4 h-auto ${
                  userAnswers[currentQuestion] === index 
                    ? "bg-gradient-primary text-white" 
                    : "hover:bg-muted"
                }`}
                onClick={() => handleAnswer(index)}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}

            <div className="pt-4">
              <Button 
                onClick={nextQuestion}
                disabled={userAnswers[currentQuestion] === undefined}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}