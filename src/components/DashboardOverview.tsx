// src/components/DashboardOverview.tsx (Updated - Fixed snake_case properties)
import '../styles/dashboard.css';
import { TrendingUp, Video, Brain, CheckCircle2, Clock, Shield } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const { user, progress } = useUser();

  // Dynamic stats from context
  const stats = [
    {
      title: 'Overall Progress',
      value: `${progress.overall_progress}%`,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Videos Watched',
      value: `${progress.videos_completed}/${progress.total_videos}`,
      icon: Video,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: 'Quizzes Passed',
      value: `${progress.quizzes_passed}/${progress.total_quizzes}`,
      icon: Brain,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Compliance Status',
      value: progress.certificates_earned > 0 ? 'Active' : 'Pending',
      icon: Shield,
      color: progress.certificates_earned > 0 ? 'text-green-400' : 'text-yellow-400',
      bgColor: progress.certificates_earned > 0 ? 'bg-green-400/10' : 'bg-yellow-400/10',
    },
  ];

  // Recent activities from context (limit to 3)
  const recentActivities = progress.recentActivities.slice(0, 3).map(activity => ({
    ...activity,
    type: activity.type || 'info', // Fallback if type missing
  }));

  // Static upcoming (can be made dynamic later via API/context)
  const upcomingTraining = [
    {
      title: 'Advanced Ransomware Protection',
      date: 'Nov 20, 2025',
      duration: '25 min',
    },
    {
      title: 'Zero Trust Security Model',
      date: 'Nov 22, 2025',
      duration: '30 min',
    },
    {
      title: 'Incident Response Procedures',
      date: 'Nov 25, 2025',
      duration: '20 min',
    },
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'info': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Section - Personalized */}
      <div className="hero" role="region" aria-label="welcome">
        <div style={{ zIndex: 2 }}>
          <h2>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h2>
          <p>Continue your cybersecurity journey. You're at {progress.overall_progress}% overall.</p>
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            🎯 Goal: Complete {Math.max(0, progress.total_videos - progress.videos_completed)} more videos this week
          </p>
        </div>
        <div style={{ zIndex: 2 }}>
          <div className="badge" style={{ display: 'inline-block' }}>
            {progress.overall_progress}% Complete
          </div>
        </div>
      </div>

      {/* Stats Grid - Dynamic */}
      <div className="stats-grid" aria-hidden={false}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card" role="article" aria-label={stat.title}>
              <div>
                <div className={`stat-icon ${stat.bgColor}`}>
                  <Icon className={stat.color} />
                </div>
              </div>
              <div>
                <p className="stat-title">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Overall Progress - Dynamic Bars */}
        <div className="section-card">
          <div style={{ marginBottom: '0.5rem' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Overall Progress</h3>
            <p className="muted" style={{ marginTop: '0.35rem' }}>Your training completion status</p>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.8rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span className="muted">Videos</span>
                <span style={{ color: 'var(--sky)' }}>{Math.round((progress.videos_completed / progress.total_videos) * 100)}%</span>
              </div>
              <div className="progress-track" aria-hidden="true">
                <div className="progress-bar" style={{ width: `${(progress.videos_completed / progress.total_videos) * 100}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span className="muted">Quizzes</span>
                <span style={{ color: 'var(--sky)' }}>{Math.round((progress.quizzes_passed / progress.total_quizzes) * 100)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${(progress.quizzes_passed / progress.total_quizzes) * 100}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span className="muted">Certificates</span>
                <span style={{ color: 'var(--sky)' }}>{Math.round((progress.certificates_earned / 3) * 100)}%</span> {/* Assume max 3 certs */}
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${(progress.certificates_earned / 3) * 100}%` }} />
              </div>
            </div>

            <div>
              <button 
                onClick={() => onNavigate('videos')}
                className="cta"
              >
                Continue Training
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity - From Context */}
        <div className="section-card">
          <div style={{ marginBottom: '0.5rem' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Recent Activity</h3>
            <p className="muted" style={{ marginTop: '0.35rem' }}>Your latest updates</p>
          </div>

          <div style={{ marginTop: '0.6rem' }}>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div style={{ minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ 
                      padding: '0.4rem', 
                      borderRadius: '8px', 
                      background: activity.type === 'success' ? 'rgba(34,197,94,0.08)' : 
                                  activity.type === 'info' ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)' 
                    }}>
                      {activity.type === 'success' && <CheckCircle2 className="icon" size={16} />}
                      {activity.type === 'info' && <Video className="icon" size={16} />}
                      {activity.type === 'warning' && <Clock className="icon" size={16} />}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: '#fff', fontSize: '0.95rem' }}>{activity.title}</p>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.35rem' }}>
                      <div style={{ 
                        borderRadius: '6px', 
                        padding: '0.2rem 0.45rem', 
                        border: '1px solid rgba(255,255,255,0.04)' 
                      }}>
                        <span className={getStatusColor(activity.type)} style={{ fontSize: '0.78rem' }}>
                          {activity.status}
                        </span>
                      </div>
                      <span className="muted" style={{ fontSize: '0.82rem' }}>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="muted" style={{ textAlign: 'center', padding: '1rem' }}>No recent activity. Start with a video or quiz!</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Training - Static */}
      <div style={{ marginTop: '1rem' }} className="section-card">
        <div style={{ marginBottom: '0.6rem' }}>
          <h3 style={{ color: '#fff', margin: 0 }}>Upcoming Training</h3>
          <p className="muted" style={{ marginTop: '0.35rem' }}>Scheduled modules</p>
        </div>
        <div className="upcoming-grid" style={{ marginTop: '0.6rem' }}>
          {upcomingTraining.map((training, index) => (
            <div key={index} style={{ 
              padding: '0.8rem', 
              borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.03)', 
              background: 'rgba(255,255,255,0.02)' 
            }}>
              <h4 style={{ margin: 0, color: '#fff' }}>{training.title}</h4>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem', color: 'var(--muted)' }}>
                <span>{training.date}</span>
                <span>{training.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tip - Static */}
      <div style={{ marginTop: '1rem' }} className="tip-card">
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(14,165,233,0.06)', padding: '0.5rem', borderRadius: '8px' }}>
            <Shield size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Security Tip of the Day</h3>
              <div style={{ 
                borderRadius: '8px', 
                padding: '0.25rem 0.5rem', 
                border: '1px solid rgba(14,165,233,0.06)', 
                color: 'var(--sky)' 
              }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <p className="muted" style={{ marginTop: '0.5rem' }}>
              When handling customer information, never share sensitive data via unsecured channels. Always verify identities and use approved systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}