import { useEffect } from 'react';
import { toast } from 'sonner';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

const educationalTips = [
  {
    icon: Shield,
    title: 'Security Tip / Keletso ea Tšireletso',
    message: 'Always verify the sender before clicking email links. Hover over links to see the actual destination. / Kamehla netefatsa motho ea romellang pele o tobetsa likhokahano tsa email.',
  },
  {
    icon: Lock,
    title: 'Password Reminder / Hopolo ea Password',
    message: 'Use unique passwords for each account. Consider using a password manager to generate and store strong passwords. / Sebelisa li-password tse fapaneng bakeng sa account e nngwe le e nngwe.',
  },
  {
    icon: Eye,
    title: 'Privacy Alert / Temoso ea Lekunutu',
    message: 'Be cautious about what you share on social media. Attackers use personal information for social engineering. / Hlokomela seo u se arolellanang mecheng ea sechaba.',
  },
  {
    icon: AlertTriangle,
    title: 'Phishing Warning / Temoso ea Phishing',
    message: 'Legitimate companies never ask for passwords via email. When in doubt, contact the company directly. / Likhamphani tse nepahetseng ha li kope li-password ka email.',
  },
  {
    icon: Shield,
    title: 'Software Updates / Ntlafatso ea Software',
    message: 'Keep your software updated. Security patches protect against newly discovered vulnerabilities. / Boloka software ea hau e ntlafalitsoe.',
  },
  {
    icon: Lock,
    title: 'Two-Factor Authentication / Netefatso ea Lintlha Peli',
    message: 'Enable 2FA on all important accounts. It adds an extra layer of security even if your password is compromised. / Bulela 2FA li-account tsohle tsa bohlokoa.',
  },
  {
    icon: Eye,
    title: 'Public WiFi Safety / Polokeho ea WiFi ea Sechaba',
    message: 'Avoid accessing sensitive information on public WiFi. Use a VPN for secure connections when necessary. / Qoba ho fihlella tlhahisoleseling e kotsing ho WiFi ea sechaba.',
  },
  {
    icon: AlertTriangle,
    title: 'USB Security / Tšireletso ea USB',
    message: 'Never plug in unknown USB devices. They could contain malware that automatically installs when connected. / Se ke ua kena lisebelisoa tsa USB tse sa tsejoeng.',
  }
];

export default function EducationalNotifications() {
  useEffect(() => {
    let tipIndex = 0;
    
    const showTip = () => {
      const tip = educationalTips[tipIndex];
      const Icon = tip.icon;
      
      toast(tip.title, {
        description: tip.message,
        icon: <Icon className="w-4 h-4" />,
        duration: 10000,
      });
      
      tipIndex = (tipIndex + 1) % educationalTips.length;
    };

    // Show first tip after 30 seconds
    const initialTimer = setTimeout(showTip, 30000);
    
    // Then show tips every 2 minutes
    const interval = setInterval(showTip, 120000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return null; // This component only handles notifications
}