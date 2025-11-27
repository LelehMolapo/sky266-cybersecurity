// src/components/MyCertificates.tsx (Updated - Fixed Certificate Types)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Award, Download, Share2, CheckCircle2, Calendar, ArrowLeft, Trophy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import { Certificate as SupabaseCertificate } from '../lib/supabase';

interface MyCertificatesProps {
  onBack: () => void;
}

export default function MyCertificates({ onBack }: MyCertificatesProps) {
  const { progress, downloadCertificate, language } = useUser();
  const certificates: SupabaseCertificate[] = progress.certificates;

  const t = language === 'en' ? {
    back: 'Back to Dashboard',
    earned: 'Earned Certificates',
    inProgress: 'In Progress',
    benefits: 'Certificate Benefits',
    active: 'Active Certificates',
    avgScore: 'Average Score',
    completion: 'Completion Rate',
    descEarned: 'Your completed cybersecurity certifications',
    descInProgress: 'Certifications you\'re currently working towards',
    benefit1: 'Recognized proof of cybersecurity competency',
    benefit2: 'Valid for one year from date of completion',
    benefit3: 'Shareable on professional networks',
    benefit4: 'Counts towards annual compliance requirements',
    benefit5: 'Downloadable PDF format for your records',
    download: 'Download',
    share: 'Share',
    earnedOn: 'Earned:',
    score: 'Score:',
    validUntil: 'Valid until:',
    quizzesRemaining: 'quizzes remaining',
    noCerts: 'No certificates yet? Start earning them!',
    startQuizzes: 'Complete quizzes in the Training section to unlock your first certificate.',
  } : {
    back: 'Kgutlela Dashboard',
    earned: 'Ditifikete tse Fumanoeng',
    inProgress: 'Tse ntseng li Etsahaloa',
    benefits: 'Melemo ya Setifikete',
    active: 'Ditifikete tse Sebetsang',
    avgScore: 'Lenaneo la Lenaneo',
    completion: 'Lenaneo la Ho Qeta',
    descEarned: 'Ditifikete tsa hau tse phethehileng tsa tshireletso ea cyber',
    descInProgress: 'Ditifikete tseo u li sebetsang hona joale',
    benefit1: 'Bopaki bo tsejoeng ba bokhoni ba tshireletso ea cyber',
    benefit2: 'E sebetsa selemo se le seng ho tloha letsatsing la ho qeta',
    benefit3: 'E arolelanoa marang-rang a litsebi',
    benefit4: 'E bala ho ea litlhoko tsa tokelo ea selemo le selemo',
    benefit5: 'Fomate e ka khoasang ea PDF bakeng sa lirekoto tsa hau',
    download: 'Khumusha',
    share: 'Arolelana',
    earnedOn: 'E Fumanoeng:',
    score: 'Lenaneo:',
    validUntil: 'E sebetsa ho fihlela:',
    quizzesRemaining: 'ditlhahlobo tse setseng',
    noCerts: 'Ha ho ditifikete hona joale? Qala ho li fumana!',
    startQuizzes: 'Qeta ditlhahlobo karolong ya Boikoetliso ho bula setifikete sa hao sa pele.',
  };

  // Mock upcoming (dynamic if expanded)
  const upcomingCertifications = [
    {
      title: language === 'en' ? 'Multi-Factor Authentication' : 'Phethahatso ea Multi-Factor',
      progress: 60,
      remainingQuizzes: 2,
    },
    {
      title: language === 'en' ? 'Data Protection & Privacy' : 'Tshireletso ea Data le Puso ea Botho',
      progress: 40,
      remainingQuizzes: 3,
    },
    {
      title: language === 'en' ? 'Incident Response Procedures' : 'Mehlala ea Karabelo ea Ketsahalo',
      progress: 20,
      remainingQuizzes: 4,
    },
  ];

  const handleDownload = (cert: SupabaseCertificate) => {
    downloadCertificate(cert);
  };

  const handleShare = (certTitle: string) => {
    toast.success('Share Link Copied', {
      description: 'Certificate link copied to clipboard',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const avgScore = certificates.length > 0 ? Math.round(certificates.reduce((acc, cert) => acc + cert.score, 0) / certificates.length) : 0;
  const completionRate = Math.round((certificates.length / 5) * 100); // Assume 5 total possible

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-gray-400 hover:text-white hover:bg-gray-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t.back}
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-lg p-6 border border-yellow-500/20 shadow-xl shadow-yellow-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h2 className="text-white mb-2 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              {t.earned}
            </h2>
            <p className="text-yellow-100">
              {language === 'en' ? 'View and manage your earned cybersecurity certifications' : 'Sheba le laola ditifikete tsa hau tse fumanoeng tsa tshireletso ea cyber'}
            </p>
          </div>
          <Badge className="bg-white text-yellow-800 shadow-lg text-lg px-4 py-2">
            {certificates.length} {language === 'en' ? 'Earned' : 'tse Fumanoeng'}
          </Badge>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{t.active}</p>
                <p className="text-white text-2xl">{certificates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Award className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{t.avgScore}</p>
                <p className="text-white text-2xl">{avgScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/10 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{t.completion}</p>
                <p className="text-white text-2xl">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Certificates */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">{t.earned}</CardTitle>
          <CardDescription className="text-gray-400">
            {t.descEarned}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certificates.length > 0 ? (
              certificates.map((cert: SupabaseCertificate) => (
                <div
                  key={cert.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-yellow-600/50 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-600/20 p-3 rounded-lg shrink-0">
                        <Award className="w-8 h-8 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-white">{cert.title}</h3>
                          <Badge className="bg-green-600 text-white">Active</Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {cert.category}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{cert.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{t.earnedOn} {formatDate(cert.date_earned)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span>{t.score} {cert.score}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{t.validUntil} {formatDate(cert.valid_until)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        onClick={() => handleDownload(cert)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t.download}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleShare(cert.title)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Share2 className="w-4 h-4" />
                        {t.share}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-white mb-2">{t.noCerts}</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">{t.startQuizzes}</p>
                <Button onClick={onBack} variant="outline" className="border-gray-600 text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.back}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* In Progress Certifications */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">{t.inProgress}</CardTitle>
          <CardDescription className="text-gray-400">
            {t.descInProgress}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingCertifications.map((cert, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white">{cert.title}</h4>
                  <Badge variant="outline" className="border-blue-600 text-blue-400">
                    {cert.progress}% {language === 'en' ? 'Complete' : 'E Phethehileng'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{cert.remainingQuizzes} {t.quizzesRemaining}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${cert.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Benefits */}
      <Card className="bg-gradient-to-r from-blue-950/30 to-purple-900/20 border-blue-600/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/20 p-3 rounded-lg">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white mb-2">{t.benefits}</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• {t.benefit1}</li>
                <li>• {t.benefit2}</li>
                <li>• {t.benefit3}</li>
                <li>• {t.benefit4}</li>
                <li>• {t.benefit5}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
