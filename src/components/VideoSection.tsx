import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Play, CheckCircle2, Clock, Lock, Video, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import { supabaseDb } from '../lib/supabase';

interface Video {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  thumbnail: string;
  description: string;
  youtubeId: string;
  locked?: boolean;
}

interface Category {
  category: string;
  videos: Video[];
}

export default function VideoSection() {
  const { user, progress, updateProgress, addActivity } = useUser();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoCategories, setVideoCategories] = useState<Category[]>([]);
  const [isWatching, setIsWatching] = useState(false);

  // Initial videos with all completed: false (starts at 0/10)
  const initialVideoCategories: Category[] = [
    {
      category: 'Essential Training',
      videos: [
        {
          id: 'v1',
          title: 'Introduction to Cybersecurity',
          duration: '0:45',
          completed: false,
          thumbnail: 'cybersecurity intro',
          description: 'Learn the basics of cybersecurity and why it matters for Sky266.',
          youtubeId: 'MDOLeYF4v0c',
        },
        {
          id: 'v2',
          title: 'Recognizing Phishing Attacks',
          duration: '0:52',
          completed: false,
          thumbnail: 'phishing email',
          description: 'Identify and avoid common phishing attempts targeting employees.',
          youtubeId: 'gSQgbCo6PAg',
        },
        {
          id: 'v3',
          title: 'Password Security Best Practices',
          duration: '0:38',
          completed: false,
          thumbnail: 'password security',
          description: 'Create strong passwords and manage them securely.',
          youtubeId: 'XT-lj9fouvU',
        },
        {
          id: 'v4',
          title: 'Social Engineering Tactics',
          duration: '0:58',
          completed: false,
          thumbnail: 'social engineering',
          description: 'Understand how attackers manipulate people to gain access.',
          youtubeId: 'KiTnqDw-oAo',
        },
      ],
    },
    {
      category: 'Advanced Topics',
      videos: [
        {
          id: 'v5',
          title: 'Multi-Factor Authentication',
          duration: '0:42',
          completed: false,
          thumbnail: 'two factor authentication',
          description: 'Learn how MFA protects your accounts from unauthorized access.',
          youtubeId: '1hRiICIceCs',
        },
        {
          id: 'v6',
          title: 'Secure Remote Work',
          duration: '0:55',
          completed: false,
          thumbnail: 'remote work security',
          description: 'Best practices for staying secure while working remotely.',
          youtubeId: '2oJwhcDdFrk',
        },
        {
          id: 'v7',
          title: 'Data Protection & Privacy',
          duration: '0:48',
          completed: false,
          thumbnail: 'data privacy',
          description: 'Protecting sensitive company and customer data.',
          youtubeId: '0pHF7zMj2rA',
        },
        {
          id: 'v8',
          title: 'Incident Reporting Procedures',
          duration: '0:50',
          completed: false,
          locked: true,
          thumbnail: 'incident response',
          description: 'What to do when you suspect a security incident.',
          youtubeId: 'dQw4w9WgXcQ',
        },
      ],
    },
    {
      category: 'Specialized Training',
      videos: [
        {
          id: 'v9',
          title: 'Ransomware Awareness',
          duration: '0:56',
          completed: false,
          locked: true,
          thumbnail: 'ransomware protection',
          description: 'Understanding and preventing ransomware attacks.',
          youtubeId: 'dQw4w9WgXcQ',
        },
        {
          id: 'v10',
          title: 'Mobile Device Security',
          duration: '0:44',
          completed: false,
          locked: true,
          thumbnail: 'mobile security',
          description: 'Securing company data on mobile devices.',
          youtubeId: 'dQw4w9WgXcQ',
        },
      ],
    },
  ];

  // Load initial state on mount/user change (sync with progress count if needed)
  useEffect(() => {
    if (!user) return;

    // Start fresh for driver/booking-agent: all false, but respect context count by marking first N as completed
    let loadedCategories = initialVideoCategories.map(cat => ({
      ...cat,
      videos: cat.videos.map(video => ({
        ...video,
        completed: false, // Always start false for per-video UI
      })),
    }));

    // If context has progress.videosCompleted > 0, mark first N videos as completed (simple heuristic)
    if (progress.videosCompleted > 0) {
      let completedCount = 0;
      loadedCategories = loadedCategories.map(cat => ({
        ...cat,
        videos: cat.videos.map(video => {
          if (!video.locked && completedCount < progress.videosCompleted) {
            completedCount++;
            return { ...video, completed: true };
          }
          return video;
        }),
      }));
    }

    setVideoCategories(loadedCategories);
  }, [user, progress.videosCompleted]);

  const totalVideos = videoCategories.reduce((acc, cat) => acc + cat.videos.length, 0);
  const completedVideosCount = videoCategories.reduce(
    (acc, cat) => acc + cat.videos.filter((v: Video) => v.completed).length,
    0
  );
  const completionPercentage = Math.round((completedVideosCount / totalVideos) * 100);

  const handleVideoClick = (video: Video) => {
    if (video.locked) {
      toast.warning('Video Locked', { description: 'Complete previous videos to unlock.' });
      return;
    }
    if (video.completed) {
      toast.info('Already Completed', { description: 'You\'ve already watched this video!' });
      return;
    }
    setSelectedVideo(video);
    setIsWatching(false);
  };

  const handleVideoComplete = async () => {
    if (!selectedVideo || !user) return;

    // Update progress count and level progress
    updateProgress({ 
      videos_completed: progress.videos_completed + 1,
      level_progress: {
        videos: progress.level_progress.videos + 1,
        quizzes: progress.level_progress.quizzes
      }
    });

    // Update local state for UI
    setVideoCategories(prev => prev.map(cat => ({
      ...cat,
      videos: cat.videos.map((v: Video) => 
        v.id === selectedVideo.id ? { ...v, completed: true } : v
      ),
    })));

    addActivity({
      title: `Watched: ${selectedVideo.title}`,
      status: 'Completed',
      time: new Date().toLocaleString(),
      type: 'success',
    });

    toast.success('Video Completed!', { 
      description: `Level progress: ${progress.level_progress.videos + 1}/5 videos` 
    });

    setSelectedVideo(null);
    setIsWatching(false);
  };

  // Simulate completion after 10 seconds (in real app, use YouTube API onEnded)
  useEffect(() => {
    if (selectedVideo && !isWatching) {
      setIsWatching(true);
      const timer = setTimeout(() => {
        handleVideoComplete();
      }, 10000); // 10s watch time simulation

      return () => clearTimeout(timer);
    }
  }, [selectedVideo]);

  return (
    <div className="space-y-6">
      {/* Progress Overview - Now starts at 0/10 and updates dynamically */}
      <Card className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <Video className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white mb-1">Video Training Progress</h3>
                <p className="text-gray-400 text-sm">
                  {completedVideosCount} of {totalVideos} videos completed • Keep it up!
                </p>
              </div>
            </div>
            <Badge className="bg-blue-600 text-white shadow-lg">{completionPercentage}% Complete</Badge>
          </div>
          <Progress value={completionPercentage} className="h-3 bg-gray-800" />
        </CardContent>
      </Card>

      {/* Video Categories */}
      {videoCategories.map((category, catIndex) => (
        <div key={catIndex} className="space-y-4">
          <h3 className="text-white font-semibold">{category.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.videos.map((video: Video) => (
              <Card
                key={video.id}
                className={`bg-gray-900 border-gray-800 overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-900/20 hover:scale-105 ${
                  video.locked ? 'opacity-60' : ''
                }`}
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {video.locked ? (
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Complete previous videos</p>
                      </div>
                    ) : (
                      <div className="bg-blue-600/90 p-4 rounded-full group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Play className="w-8 h-8 text-white" fill="white" />
                      </div>
                    )}
                  </div>
                  {video.completed && (
                    <div className="absolute top-2 right-2 bg-green-600 p-1 rounded-full shadow-lg animate-pulse">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-white text-sm line-clamp-1">{video.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-xs line-clamp-2">
                    {video.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedVideo?.title}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedVideo?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            {selectedVideo && (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&mute=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {isWatching && (
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Watching... (auto-complete in 10s)
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Duration: {selectedVideo?.duration}</span>
            </div>
            {selectedVideo && (
              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Watch on YouTube → 
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
