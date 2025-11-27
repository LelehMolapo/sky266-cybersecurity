// Advanced analytics and performance monitoring
class Analytics {
  private events: Array<{timestamp: number, event: string, properties?: any}> = [];
  
  track(eventName: string, properties?: Record<string, any>) {
    const event = {
      timestamp: Date.now(),
      event: eventName,
      properties: {
        ...properties,
        url: window.location.pathname,
        userAgent: navigator.userAgent,
        sessionId: this.getSessionId()
      }
    };
    
    this.events.push(event);
    console.log(`Analytics: ${eventName}`, event);
    
    // Store locally and batch send
    this.storeEvent(event);
  }
  
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2);
      sessionStorage.setItem('analytics_session', sessionId);
    }
    return sessionId;
  }
  
  private storeEvent(event: any) {
    const stored = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    stored.push(event);
    localStorage.setItem('analytics_events', JSON.stringify(stored.slice(-100))); // Keep last 100
  }
  
  getEvents() {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  }
}

const analytics = new Analytics();

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  analytics.track(eventName, properties);
};

export const trackPageView = (page: string) => {
  trackEvent('page_view', { page });
};

export const trackUserAction = (action: string, userId?: string) => {
  trackEvent('user_action', { action, userId });
};

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  console.log(`${name} took ${duration} milliseconds`);
  trackEvent('performance_measure', { name, duration });
};

export const getAnalyticsData = () => {
  return analytics.getEvents();
};