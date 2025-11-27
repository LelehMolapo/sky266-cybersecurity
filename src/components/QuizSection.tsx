import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { CheckCircle2, XCircle, Trophy, Brain, ArrowRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';

export default function QuizSection() {
  const { user, progress, addActivity, addCertificate, updateProgress } = useUser();
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  
  const quizzes = [
    {
      id: 'q1',
      title: 'Phishing Detection Fundamentals',
      description: 'Test your ability to identify phishing attempts',
      difficulty: 'Beginner',
      questions: 10,
      passingScore: 70,
      completed: true,
      score: 85,
      questions_data: [
        {
          question: 'What is the primary goal of a phishing attack?',
          options: [
            'To damage computer hardware',
            'To steal sensitive information or credentials',
            'To improve system performance',
            'To install antivirus software',
          ],
          correct: 1,
        },
        {
          question: 'Which of the following is a red flag in an email that might indicate phishing?',
          options: [
            'Proper grammar and spelling',
            'Sender email from your company domain',
            'Urgent language requesting immediate action',
            'Professional company logo',
          ],
          correct: 2,
        },
        {
          question: 'What should you do if you receive a suspicious email?',
          options: [
            'Click on the link to investigate',
            'Reply with your credentials to verify',
            'Report it to IT security and delete it',
            'Forward it to all colleagues as a warning',
          ],
          correct: 2,
        },
        {
          question: 'Hovering over a link in an email allows you to:',
          options: [
            'Automatically download the file',
            'See the actual URL before clicking',
            'Mark the email as safe',
            'Reply to the sender',
          ],
          correct: 1,
        },
        {
          question: 'Which domain is most likely a phishing attempt?',
          options: [
            'support@sky266.com',
            'admin@sky266-security.com',
            'help@sky266.net',
            'security@sky266official.biz',
          ],
          correct: 3,
        },
      ],
    },
    {
      id: 'q2',
      title: 'Password Security Quiz',
      description: 'Assess your knowledge of password best practices',
      difficulty: 'Beginner',
      questions: 8,
      passingScore: 75,
      completed: true,
      score: 92,
      questions_data: [
        {
          question: 'What makes a strong password?',
          options: [
            'Your birthday',
            'A mix of uppercase, lowercase, numbers, and symbols',
            'A common word from the dictionary',
            'Your username backwards',
          ],
          correct: 1,
        },
        {
          question: 'How often should you change your passwords?',
          options: [
            'Every day',
            'Never, if it\'s strong enough',
            'Every 90 days or when compromised',
            'Only when you forget them',
          ],
          correct: 2,
        },
        {
          question: 'Should you use the same password for multiple accounts?',
          options: [
            'Yes, for convenience',
            'No, each account should have a unique password',
            'Only for unimportant accounts',
            'Yes, but add a number at the end',
          ],
          correct: 1,
        },
        {
          question: 'What is the recommended minimum length for a password?',
          options: [
            '4 characters',
            '6 characters',
            '8 characters',
            '12 characters or more',
          ],
          correct: 3,
        },
      ],
    },
    {
      id: 'q3',
      title: 'Social Engineering Awareness',
      description: 'Identify social engineering tactics and threats',
      difficulty: 'Intermediate',
      questions: 12,
      passingScore: 80,
      completed: false,
      questions_data: [
        {
          question: 'What is social engineering?',
          options: [
            'Building social media profiles',
            'Manipulating people to divulge confidential information',
            'Engineering social networks',
            'Creating engineering communities',
          ],
          correct: 1,
        },
        {
          question: 'Which is an example of pretexting?',
          options: [
            'Sending mass spam emails',
            'Installing malware on a computer',
            'Creating a fake scenario to obtain information',
            'Hacking into a database',
          ],
          correct: 2,
        },
        {
          question: 'A stranger tailgates you into a secure building. What should you do?',
          options: [
            'Let them in, they might be new',
            'Politely ask them to use their own badge',
            'Ignore them and continue walking',
            'Hold the door open to be courteous',
          ],
          correct: 1,
        },
        {
          question: 'What is "baiting" in cybersecurity?',
          options: [
            'Catching fish in a network',
            'Offering something enticing to trick victims',
            'Setting up honeypots',
            'Training employees',
          ],
          correct: 1,
        },
      ],
    },
    {
      id: 'q4',
      title: 'Data Protection & Privacy',
      description: 'Understanding data handling and privacy regulations',
      difficulty: 'Intermediate',
      questions: 10,
      passingScore: 75,
      completed: false,
      questions_data: [
        {
          question: 'What does PII stand for?',
          options: [
            'Personal Identification Information',
            'Personally Identifiable Information',
            'Private Internet Information',
            'Protected Individual Identity',
          ],
          correct: 1,
        },
        {
          question: 'How should you dispose of documents containing sensitive information?',
          options: [
            'Throw them in the trash',
            'Shred them',
            'Leave them on your desk',
            'Email them to yourself',
          ],
          correct: 1,
        },
        {
          question: 'Is it safe to discuss confidential company information in public places?',
          options: [
            'Yes, if you speak quietly',
            'No, you could be overheard',
            'Yes, if you use code words',
            'Only in restaurants',
          ],
          correct: 1,
        },
      ],
    },
  ];

  const handleStartQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizResults(null);
  };

  const handleAnswerSelect = (answerIndex: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < selectedQuiz.questions_data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user) return;

    let correct = 0;
    selectedQuiz.questions_data.forEach((q: any, index: number) => {
      if (selectedAnswers[index] && parseInt(selectedAnswers[index]) === q.correct) {
        correct++;
      }
    });

    const score = Math.round((correct / selectedQuiz.questions_data.length) * 100);
    const passed = score >= selectedQuiz.passingScore;

    setQuizResults({ score, correct, total: selectedQuiz.questions_data.length, passed });
    setShowResults(true);

    if (passed) {
      updateProgress({ quizzes_passed: progress.quizzes_passed + 1 });
    }

    addActivity({
      title: `Completed: ${selectedQuiz.title}`,
      status: passed ? 'Passed' : 'Completed',
      time: new Date().toLocaleString(),
      type: passed ? 'success' : 'info',
    });

    if (passed) {
      addCertificate({
        id: `cert_${Date.now()}`,
        user_id: user.id,
        title: selectedQuiz.title,
        description: `Certified in ${selectedQuiz.title.toLowerCase()}`,
        date_earned: new Date().toISOString(),
        score,
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        category: selectedQuiz.difficulty,
      });
      toast.success('Congratulations!', { description: `You passed with ${score}%` });
    } else {
      toast.error('Quiz Failed', { description: `You scored ${score}%. Passing score is ${selectedQuiz.passingScore}%` });
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizResults(null);
  };

  if (selectedQuiz && !showResults) {
    const question = selectedQuiz.questions_data[currentQuestion];
    const progressValue = ((currentQuestion + 1) / selectedQuiz.questions_data.length) * 100;

    return (
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gray-900 border-gray-800 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-white">{selectedQuiz.title}</CardTitle>
              <Button
                variant="ghost"
                onClick={() => setSelectedQuiz(null)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                Exit Quiz
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Question {currentQuestion + 1} of {selectedQuiz.questions_data.length}
                </span>
                <span className="text-blue-400">{Math.round(progressValue)}%</span>
              </div>
              <Progress value={progressValue} className="h-3 bg-gray-800" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-white mb-6 text-lg">{question.question}</h3>
              <RadioGroup
                value={selectedAnswers[currentQuestion]}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {question.options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedAnswers[currentQuestion] === index.toString()
                        ? 'border-blue-600 bg-blue-600/10'
                        : 'border-gray-800 hover:border-blue-600/50 hover:bg-gray-800/50'
                    }`}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="text-gray-300 cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-800">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedAnswers[currentQuestion]}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 shadow-lg shadow-blue-600/30"
              >
                {currentQuestion === selectedQuiz.questions_data.length - 1 ? 'Submit Quiz' : 'Next Question'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && quizResults) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gray-900 border-gray-800 shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
            quizResults.passed ? 'bg-green-500/10' : 'bg-red-500/10'
          }`} />
          <CardContent className="p-8 text-center relative z-10">
            <div className={`inline-flex p-6 rounded-full mb-6 animate-bounce ${
              quizResults.passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {quizResults.passed ? (
                <Trophy className="w-20 h-20 text-green-500" />
              ) : (
                <XCircle className="w-20 h-20 text-red-500" />
              )}
            </div>
            <h2 className="text-white mb-3 text-3xl">
              {quizResults.passed ? 'Congratulations! 🎉' : 'Keep Learning! 📚'}
            </h2>
            <p className="text-gray-400 mb-2 text-lg">
              You scored <span className={`${quizResults.passed ? 'text-green-400' : 'text-red-400'}`}>{quizResults.score}%</span>
            </p>
            <p className="text-gray-500 mb-8">
              {quizResults.correct} out of {quizResults.total} questions correct
            </p>
            <div className="max-w-md mx-auto mb-8">
              <Progress 
                value={quizResults.score} 
                className={`h-4 ${quizResults.passed ? 'bg-green-900/30' : 'bg-red-900/30'}`}
              />
            </div>
            {quizResults.passed && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-green-400 text-sm">
                  ✓ Certificate earned! Check your profile to download.
                </p>
              </div>
            )}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                variant="outline"
                onClick={() => setSelectedQuiz(null)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Back to Quizzes
              </Button>
              {!quizResults.passed && (
                <Button
                  onClick={handleRetake}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
              )}

            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 border-gray-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600/20 p-4 rounded-lg">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white mb-1">Knowledge Assessment</h3>
                <p className="text-gray-400">
                  Test your cybersecurity knowledge and earn certifications
                </p>
              </div>
            </div>
            <Badge className="bg-purple-600 text-white">
              <Trophy className="w-3 h-3 mr-1" />
              {progress.quizzes_passed} Completed
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <Card 
            key={quiz.id}
            className="bg-gray-900 border-gray-800 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 hover:scale-105 cursor-pointer group"
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-white group-hover:text-blue-400 transition-colors">{quiz.title}</CardTitle>
                {quiz.completed && (
                  <div className="bg-green-600 p-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <CardDescription className="text-gray-400">
                {quiz.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
                <Badge variant="outline" className={`${
                  quiz.difficulty === 'Beginner' ? 'border-green-500/50 text-green-400 bg-green-500/5' :
                  quiz.difficulty === 'Intermediate' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/5' :
                  'border-red-500/50 text-red-400 bg-red-500/5'
                }`}>
                  {quiz.difficulty}
                </Badge>
                <span className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  {quiz.questions} Questions
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Pass: {quiz.passingScore}%
                </span>
              </div>
              
              {quiz.completed && quiz.score && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg animate-pulse">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Previous Score:
                    </span>
                    <span className="text-green-400">{quiz.score}%</span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => handleStartQuiz(quiz)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg group-hover:shadow-blue-600/50 transition-all"
              >
                {quiz.completed ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </>
                ) : (
                  <>
                    Start Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
