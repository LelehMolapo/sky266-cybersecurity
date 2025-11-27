export const quizzesByLevel = {
  beginner: [
    {
      id: 'b1',
      title: 'Basic Email Security',
      description: 'Learn to identify suspicious emails',
      difficulty: 'Beginner',
      questions: 5,
      passingScore: 60,
      questions_data: [
        {
          question: 'What should you do if you receive an email from an unknown sender?',
          options: ['Open it immediately', 'Delete it without reading', 'Check the sender carefully before opening', 'Forward it to colleagues'],
          correct: 2,
        },
        {
          question: 'Which of these is a sign of a phishing email?',
          options: ['Professional formatting', 'Urgent language', 'Company logo', 'Proper grammar'],
          correct: 1,
        },
        {
          question: 'What is the safest way to verify a suspicious email?',
          options: ['Click the links to check', 'Reply asking for verification', 'Contact the sender through a different method', 'Ignore it completely'],
          correct: 2,
        },
        {
          question: 'Should you download attachments from unknown senders?',
          options: ['Yes, always', 'No, never', 'Only if they look safe', 'Only .txt files'],
          correct: 1,
        },
        {
          question: 'What does "BCC" mean in email?',
          options: ['Big Carbon Copy', 'Blind Carbon Copy', 'Basic Copy Control', 'Backup Copy Center'],
          correct: 1,
        }
      ]
    }
  ],
  intermediate: [
    {
      id: 'i1',
      title: 'Advanced Phishing Detection',
      description: 'Identify sophisticated phishing attempts',
      difficulty: 'Intermediate',
      questions: 5,
      passingScore: 70,
      questions_data: [
        {
          question: 'What is spear phishing?',
          options: ['Random mass emails', 'Targeted attacks on specific individuals', 'Fishing with spears', 'Email encryption'],
          correct: 1,
        },
        {
          question: 'How can you verify a suspicious link without clicking it?',
          options: ['Hover over it', 'Right-click and inspect', 'Use a URL scanner', 'All of the above'],
          correct: 3,
        },
        {
          question: 'What is CEO fraud?',
          options: ['When CEOs commit fraud', 'Impersonating executives to request transfers', 'Fraudulent CEO elections', 'CEO password theft'],
          correct: 1,
        },
        {
          question: 'Which domain is most likely legitimate for Sky266?',
          options: ['sky266-security.com', 'sky266.com', 'sky266official.net', 'sky-266.org'],
          correct: 1,
        },
        {
          question: 'What should you do if you accidentally clicked a phishing link?',
          options: ['Nothing', 'Change passwords immediately', 'Disconnect from internet', 'Report to IT and change passwords'],
          correct: 3,
        }
      ]
    }
  ],
  advanced: [
    {
      id: 'a1',
      title: 'Network Security Fundamentals',
      description: 'Understanding network-based threats',
      difficulty: 'Advanced',
      questions: 5,
      passingScore: 80,
      questions_data: [
        {
          question: 'What is a man-in-the-middle attack?',
          options: ['Physical interception', 'Intercepting communications between two parties', 'Standing between people', 'Network congestion'],
          correct: 1,
        },
        {
          question: 'Which protocol provides secure web browsing?',
          options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
          correct: 1,
        },
        {
          question: 'What is a VPN primarily used for?',
          options: ['Faster internet', 'Secure remote connections', 'Gaming', 'File sharing'],
          correct: 1,
        },
        {
          question: 'What does end-to-end encryption mean?',
          options: ['Encryption at both ends', 'Data encrypted throughout transmission', 'Encryption that ends', 'Final encryption step'],
          correct: 1,
        },
        {
          question: 'What is a firewall\'s primary function?',
          options: ['Prevent fires', 'Block unauthorized network access', 'Speed up internet', 'Store data'],
          correct: 1,
        }
      ]
    }
  ],
  expert: [
    {
      id: 'e1',
      title: 'Incident Response Procedures',
      description: 'Advanced security incident handling',
      difficulty: 'Expert',
      questions: 5,
      passingScore: 85,
      questions_data: [
        {
          question: 'What is the first step in incident response?',
          options: ['Containment', 'Identification', 'Eradication', 'Recovery'],
          correct: 1,
        },
        {
          question: 'What should you do immediately after detecting a security breach?',
          options: ['Fix it yourself', 'Isolate affected systems', 'Ignore minor breaches', 'Wait for confirmation'],
          correct: 1,
        },
        {
          question: 'What is forensic analysis in cybersecurity?',
          options: ['Legal procedures', 'Investigating security incidents', 'Court testimony', 'Police work'],
          correct: 1,
        },
        {
          question: 'How long should incident logs be retained?',
          options: ['1 week', '1 month', 'According to compliance requirements', '1 year'],
          correct: 2,
        },
        {
          question: 'What is the purpose of a post-incident review?',
          options: ['Blame assignment', 'Process improvement', 'Legal compliance', 'Documentation only'],
          correct: 1,
        }
      ]
    }
  ],
  professional: [
    {
      id: 'p1',
      title: 'Advanced Threat Intelligence',
      description: 'Professional-level security analysis',
      difficulty: 'Professional',
      questions: 5,
      passingScore: 90,
      questions_data: [
        {
          question: 'What is threat hunting?',
          options: ['Hunting animals', 'Proactively searching for threats', 'Threat elimination', 'Threat prevention'],
          correct: 1,
        },
        {
          question: 'What is an APT?',
          options: ['Application Programming Tool', 'Advanced Persistent Threat', 'Automated Protection Technology', 'Active Prevention Technique'],
          correct: 1,
        },
        {
          question: 'What is the MITRE ATT&CK framework?',
          options: ['Attack simulation tool', 'Knowledge base of adversary tactics', 'Antivirus software', 'Firewall configuration'],
          correct: 1,
        },
        {
          question: 'What is zero-day vulnerability?',
          options: ['Vulnerability with no impact', 'Unknown vulnerability with no patch', 'Vulnerability lasting zero days', 'Vulnerability on day zero'],
          correct: 1,
        },
        {
          question: 'What is threat intelligence sharing?',
          options: ['Sharing threats with attackers', 'Collaborative security information exchange', 'Public threat disclosure', 'Internal threat reporting'],
          correct: 1,
        }
      ]
    }
  ]
};