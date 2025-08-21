import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, Target, Flame, Award, BookOpen, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface StudyStats {
  totalQuizzes: number;
  averageScore: number;
  studyStreak: number;
  hoursStudied: number;
  flashcardsReviewed: number;
  summariesGenerated: number;
  weeklyProgress: number[];
  subjects: { name: string; progress: number; color: string }[];
}

export function Dashboard() {
  const [stats, setStats] = useState<StudyStats>({
    totalQuizzes: 24,
    averageScore: 85,
    studyStreak: 7,
    hoursStudied: 32,
    flashcardsReviewed: 156,
    summariesGenerated: 18,
    weeklyProgress: [65, 72, 80, 85, 78, 90, 88],
    subjects: [
      { name: "Mathematics", progress: 85, color: "bg-blue-500" },
      { name: "Science", progress: 92, color: "bg-green-500" },
      { name: "History", progress: 78, color: "bg-purple-500" },
      { name: "Literature", progress: 88, color: "bg-orange-500" },
    ]
  });

  const [animatedValues, setAnimatedValues] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    studyStreak: 0,
    hoursStudied: 0,
  });

  // Animate counters on component mount
  useEffect(() => {
    const animateCounter = (key: keyof typeof animatedValues, target: number) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 30);
    };

    animateCounter('totalQuizzes', stats.totalQuizzes);
    animateCounter('averageScore', stats.averageScore);
    animateCounter('studyStreak', stats.studyStreak);
    animateCounter('hoursStudied', stats.hoursStudied);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">
          Study Progress Dashboard
        </h2>
        <p className="text-muted-foreground">
          Track your learning journey and celebrate your achievements
        </p>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass glass-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                <p className="text-3xl font-bold gradient-text">
                  {animatedValues.totalQuizzes}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass glass-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold gradient-text">
                  {animatedValues.averageScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass glass-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Streak</p>
                <p className="text-3xl font-bold gradient-text">
                  {animatedValues.studyStreak} days
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-glow-pulse">
                <Flame className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass glass-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours Studied</p>
                <p className="text-3xl font-bold gradient-text">
                  {animatedValues.hoursStudied}h
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <Card className="glass glass-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-32 gap-2">
                {stats.weeklyProgress.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-primary rounded-t-sm transition-all duration-1000 delay-200"
                      style={{ 
                        height: `${(value / 100) * 100}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </p>
                    <p className="text-xs font-medium">{value}%</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card className="glass glass-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Subject Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.subjects.map((subject, index) => (
                <div 
                  key={subject.name} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={subject.progress} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass glass-hover">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-primary rounded-full" />
                <p className="text-sm">Completed Mathematics Quiz</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-secondary rounded-full" />
                <p className="text-sm">Generated Science Summary</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-primary rounded-full" />
                <p className="text-sm">Reviewed 15 Flashcards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass glass-hover">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Quiz Master</p>
                  <p className="text-xs text-muted-foreground">Scored 90%+ on 5 quizzes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Flame className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Study Streak</p>
                  <p className="text-xs text-muted-foreground">7 days in a row</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass glass-hover">
          <CardHeader>
            <CardTitle className="text-lg">Study Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Weekly Goal</span>
                  <span>80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Target</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <Button variant="outline" size="sm" className="w-full glass-hover">
                Set New Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}