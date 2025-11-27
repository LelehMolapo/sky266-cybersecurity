import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Bot, Send, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your cybersecurity assistant. Ask me anything about security best practices, threats, or training questions.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getAIResponse = (question: string): string => {
    const responses: Record<string, string> = {
      // Basic Security
      'phishing': 'Phishing attacks use deceptive emails, websites, or messages to steal credentials. Red flags: urgent language, suspicious links, grammar errors, unexpected attachments. Always verify sender through official channels.',
      'password': 'Strong passwords: 12+ characters, mix of uppercase/lowercase/numbers/symbols. Use unique passwords per account. Enable 2FA everywhere. Consider password managers like Bitwarden or 1Password.',
      'malware': 'Malware includes viruses, ransomware, spyware, trojans. Prevention: keep software updated, use reputable antivirus, avoid suspicious downloads, scan USB devices, backup data regularly.',
      'social engineering': 'Psychological manipulation to extract information. Common tactics: pretexting, baiting, tailgating, quid pro quo. Defense: verify identities, follow protocols, be skeptical of unsolicited requests.',
      
      // Network Security
      'vpn': 'VPNs encrypt internet traffic and mask IP addresses. Use for remote work, public WiFi, accessing geo-restricted content. Choose reputable providers with no-logs policies.',
      'firewall': 'Firewalls monitor and control network traffic based on security rules. Types: network firewalls (hardware) and host firewalls (software). Essential for blocking unauthorized access.',
      'wifi': 'WiFi security: Use WPA3 encryption, strong passwords, hide SSID, disable WPS. Avoid public WiFi for sensitive activities. Use VPN on untrusted networks.',
      'network': 'Network security involves protecting data in transit. Use HTTPS, secure protocols (SSH, SFTP), network segmentation, intrusion detection systems.',
      
      // Advanced Threats
      'ransomware': 'Ransomware encrypts files and demands payment. Prevention: regular backups, updated software, email filtering, user training. Never pay ransom - it funds more attacks.',
      'apt': 'Advanced Persistent Threats are sophisticated, long-term attacks by nation-states or organized groups. They use multiple attack vectors and remain undetected for months.',
      'zero day': 'Zero-day vulnerabilities are unknown security flaws with no available patches. Attackers exploit them before vendors can fix them. Use behavioral analysis and sandboxing.',
      'ddos': 'DDoS attacks overwhelm systems with traffic. Mitigation: rate limiting, traffic filtering, CDNs, DDoS protection services. Have incident response plans ready.',
      
      // Data Protection
      'encryption': 'Encryption converts data into unreadable format. Use AES-256 for files, TLS for transmission, end-to-end encryption for messaging. Manage encryption keys securely.',
      'backup': 'Follow 3-2-1 rule: 3 copies of data, 2 different media types, 1 offsite. Test backups regularly. Consider immutable backups to prevent ransomware encryption.',
      'gdpr': 'GDPR requires data protection by design, user consent, breach notification within 72 hours, data portability rights. Fines up to 4% of annual revenue.',
      'pii': 'Personally Identifiable Information includes names, addresses, SSNs, emails. Protect with encryption, access controls, data minimization, regular audits.',
      
      // Authentication
      '2fa': 'Two-Factor Authentication adds security layer beyond passwords. Types: SMS (weak), authenticator apps (better), hardware tokens (best). Enable on all critical accounts.',
      'mfa': 'Multi-Factor Authentication uses something you know (password), have (token), or are (biometric). Reduces breach risk by 99.9% according to Microsoft.',
      'sso': 'Single Sign-On allows one login for multiple applications. Benefits: improved security, user experience. Risks: single point of failure. Use with MFA.',
      
      // Incident Response
      'incident': 'Incident response phases: Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned. Have documented procedures and trained teams.',
      'forensics': 'Digital forensics involves collecting, preserving, analyzing digital evidence. Maintain chain of custody, use write-blocking tools, document everything.',
      'breach': 'Data breach response: contain immediately, assess scope, notify stakeholders, preserve evidence, communicate transparently, implement improvements.',
      
      // Compliance
      'compliance': 'Security compliance frameworks: ISO 27001, NIST, SOC 2, PCI DSS. Regular audits, documentation, risk assessments, employee training required.',
      'audit': 'Security audits assess controls effectiveness. Types: internal, external, compliance. Include vulnerability scans, penetration testing, policy reviews.',
      
      // Mobile Security
      'mobile': 'Mobile security: use device encryption, screen locks, app permissions review, avoid public WiFi, install from official stores, enable remote wipe.',
      'byod': 'Bring Your Own Device policies need mobile device management (MDM), app wrapping, data segregation, compliance monitoring.',
      
      // Cloud Security
      'cloud': 'Cloud security shared responsibility: provider secures infrastructure, customer secures data/applications. Use IAM, encryption, monitoring, compliance tools.',
      'aws': 'AWS security: use IAM roles, enable CloudTrail, configure security groups, encrypt data, monitor with GuardDuty, follow Well-Architected Framework.',
      
      // General Questions
      'threat': 'Threat landscape constantly evolves. Stay updated through security feeds, threat intelligence, vendor advisories. Implement defense in depth strategies.',
      'security': 'Cybersecurity is everyone\'s responsibility. Key principles: least privilege, defense in depth, assume breach, continuous monitoring, user education.',
      'training': 'Security awareness training should be ongoing, interactive, role-specific. Include phishing simulations, incident reporting procedures, policy updates.',
      'policy': 'Security policies define rules and procedures. Include acceptable use, incident response, data classification, access control. Review and update regularly.'
    };

    const lowerQuestion = question.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }
    
    // Check for related terms
    if (lowerQuestion.includes('hack') || lowerQuestion.includes('attack')) {
      return 'Cyber attacks come in many forms: phishing, malware, social engineering, DDoS, man-in-the-middle. Defense requires layered security: firewalls, antivirus, training, monitoring, incident response plans.';
    }
    
    if (lowerQuestion.includes('safe') || lowerQuestion.includes('protect')) {
      return 'Stay safe online: use strong unique passwords with 2FA, keep software updated, be cautious with emails/links, backup data regularly, use reputable security software, and report suspicious activities.';
    }
    
    if (lowerQuestion.includes('email')) {
      return 'Email security: verify sender authenticity, avoid clicking suspicious links, don\'t download unexpected attachments, use encrypted email for sensitive data, enable spam filtering.';
    }

    return 'I\'m your cybersecurity expert! Ask me about: phishing, passwords, malware, ransomware, VPNs, firewalls, encryption, compliance (GDPR, ISO 27001), incident response, cloud security, mobile security, or any other cybersecurity topic.';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="bg-gray-900 border-gray-800 h-96">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          AI Security Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    {message.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cybersecurity..."
              className="bg-gray-800 border-gray-700 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}