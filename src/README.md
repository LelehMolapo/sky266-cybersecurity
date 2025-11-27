# Sky266 Courier Security Platform

A comprehensive cybersecurity awareness training platform for Sky266 courier operations, featuring role-based access, interactive training modules, and real-time progress tracking.

## 🌟 Features

### For All Users
- **Modern Authentication** - Secure sign up and sign in with email/password
- **Interactive Training** - Video tutorials and quizzes on cybersecurity topics
- **Progress Tracking** - Monitor your training completion and earned certificates
- **Security Alerts** - Real-time notifications about threats and updates
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### For Drivers
- **Delivery Security Training** - Learn to protect customer data and delivery codes
- **Mobile Device Security** - Best practices for securing work phones and tablets
- **Phishing Prevention** - Recognize and avoid courier-targeted scams

### For Booking Agents
- **Customer Data Protection** - Proper handling of sensitive information
- **Identity Verification** - Best practices for confirming customer identity
- **Phone Security** - Secure communication protocols

### For Managers
- **Team Dashboard** - Monitor all staff training progress
- **Compliance Tracking** - Ensure team meets security requirements
- **Analytics** - View completion rates and identify training gaps
- **Department Reports** - Track progress by department

## 🎨 Design

- **Color Scheme**: Professional black, blue, and white theme
- **Branding**: Sky266 logo integration throughout
- **Dark Mode**: Modern dark theme reduces eye strain
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG compliant design

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Hosting**: Vercel/Netlify

## 🚀 Quick Start

### Option 1: Test Locally (No Setup Required)

The app works immediately in **mock mode** with no configuration:

1. **Just run it!** - The app is ready to use
2. **Sign up** - Create test accounts and explore
3. **All features work** - Videos, quizzes, dashboards, etc.
4. **Note:** Data is temporary and resets on refresh

Perfect for testing and demonstration!

### Option 2: Connect to Real Database

For persistent data and production use:

1. **Create Supabase account** at [supabase.com](https://supabase.com)
2. **Follow QUICK_START.md** - Complete setup in 30 minutes
3. **Or follow DEPLOYMENT_GUIDE.md** - Detailed deployment guide

See **SETUP_INSTRUCTIONS.md** for local database setup.

### Prerequisites (for production only)

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/sky266-security.git
cd sky266-security
```

2. **The app works immediately!**
```bash
# Open the app - it works in mock mode
# No installation or setup required for testing
```

3. **For production: Set up environment variables**

Create a `.env.local` file (optional for local testing):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **For production: Set up database**

Follow the instructions in `QUICK_START.md` or `DEPLOYMENT_GUIDE.md`.

The app will work at your deployment URL

## 📦 Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## 🌐 Deployment

See the comprehensive **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for step-by-step instructions on:

- Setting up Supabase database
- Configuring authentication
- Deploying to Vercel or Netlify
- Setting up custom domains
- Monitoring and maintenance

## 📚 Project Structure

```
sky266-security/
├── App.tsx                 # Main application component
├── components/
│   ├── AuthPage.tsx        # Login and signup interface
│   ├── DashboardOverview.tsx
│   ├── ManagerDashboard.tsx
│   ├── VideoSection.tsx
│   ├── QuizSection.tsx
│   ├── ProfileSettings.tsx
│   ├── MyCertificates.tsx
│   └── ui/                 # Reusable UI components
├── lib/
│   └── supabase.ts         # Database client and functions
├── styles/
│   └── globals.css         # Global styles and Tailwind config
└── DEPLOYMENT_GUIDE.md     # Complete deployment instructions
```

## 🔒 Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Different permissions for different roles
- **HTTPS Only** - All connections encrypted
- **Password Hashing** - Passwords never stored in plain text
- **SQL Injection Protection** - Parameterized queries

## 🧪 Testing

Test accounts for development:

**Driver Account**
- Email: driver@test.com
- Password: TestPass123

**Booking Agent Account**
- Email: agent@test.com
- Password: TestPass123

**Manager Account**
- Email: manager@test.com
- Password: TestPass123

## 📊 Database Schema

The app uses the following main tables:
- `users` - User profiles and authentication
- `training_progress` - Track video and quiz completion
- `certificates` - Store earned certifications
- `video_completions` - Log watched videos
- `quiz_results` - Store quiz scores
- `security_alerts` - System-wide notifications

See `README_DATABASE.md` for complete schema documentation.

## 🤝 Contributing

This is a private Sky266 project. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Wait for review

## 📝 License

© 2025 Sky266 Courier Services. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## 🆘 Support

For technical support:
- **Internal**: Contact Sky266 IT Department
- **Supabase Issues**: [Supabase Support](https://supabase.com/support)
- **Deployment Issues**: See `DEPLOYMENT_GUIDE.md` troubleshooting section

## 🔄 Version History

### Version 1.0.0 (Current)
- Initial release
- Authentication system
- Training modules (videos and quizzes)
- Manager dashboard
- Certificate system
- Security alerts
- Profile management

## 🎯 Roadmap

Planned features:
- [ ] Multi-factor authentication
- [ ] Real video content integration
- [ ] Advanced analytics for managers
- [ ] Mobile app version
- [ ] Integration with HR systems
- [ ] Custom training paths per role
- [ ] Gamification and leaderboards
- [ ] Automated certificate generation

## 📧 Contact

**Sky266 IT Security Team**
- Email: security@sky266.com
- Internal Portal: [sky266.com/it](https://sky266.com/it)

---

**Built with ❤️ for Sky266 Courier Team**
