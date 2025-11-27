import { Shield, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

/**
 * StyleShowcase Component
 * Demonstrates all custom CSS classes and styling
 */
export default function StyleShowcase() {
  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="gradient-text-sky mb-4">Sky266 Professional Theme</h1>
        <p className="text-xl text-gray-600">
          Beautiful Sky Blue, White & Black Design System
        </p>
      </div>

      {/* Buttons Section */}
      <section className="card fade-in">
        <h2 className="text-2xl font-bold mb-6 text-sky-600">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-primary">
            <Shield className="w-5 h-5" />
            Primary Button
          </button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-ghost">Ghost Button</button>
        </div>
      </section>

      {/* Cards Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-sky-600">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card hover-lift">
            <h3 className="text-xl font-semibold mb-2">Standard Card</h3>
            <p className="text-gray-600">
              This is a standard card with hover effects and smooth transitions.
            </p>
          </div>
          <div className="card-sky hover-lift">
            <h3 className="text-xl font-semibold mb-2">Sky Card</h3>
            <p className="text-gray-600">
              This card has a sky blue gradient background and border.
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-value">95%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-6 text-sky-600">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <span className="badge badge-primary">
            <Info className="w-4 h-4" />
            Primary
          </span>
          <span className="badge badge-success">
            <CheckCircle className="w-4 h-4" />
            Success
          </span>
          <span className="badge badge-warning">
            <AlertTriangle className="w-4 h-4" />
            Warning
          </span>
          <span className="badge badge-error">
            <XCircle className="w-4 h-4" />
            Error
          </span>
        </div>
      </section>

      {/* Progress Bars */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-6 text-sky-600">Progress Bars</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Training Progress</span>
              <span className="text-sm text-gray-600">75%</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Quiz Completion</span>
              <span className="text-sm text-gray-600">90%</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-sky-600">Alerts</h2>
        <div className="alert alert-info">
          <Info className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong>Information:</strong> This is an informational alert with sky blue styling.
          </div>
        </div>
        <div className="alert alert-success">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong>Success:</strong> Your training module has been completed successfully!
          </div>
        </div>
        <div className="alert alert-warning">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong>Warning:</strong> You have pending security updates to review.
          </div>
        </div>
        <div className="alert alert-error">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong>Error:</strong> Failed to load training content. Please try again.
          </div>
        </div>
      </section>

      {/* Input Fields */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-6 text-sky-600">Input Fields</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Enter your password"
            />
          </div>
        </div>
      </section>

      {/* Gradients */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-sky-600">Gradient Backgrounds</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="gradient-sky p-8 rounded-xl text-white text-center">
            <h3 className="font-bold text-xl">Sky Gradient</h3>
          </div>
          <div className="gradient-sky-light p-8 rounded-xl text-sky-700 text-center">
            <h3 className="font-bold text-xl">Light Gradient</h3>
          </div>
          <div className="gradient-sky-dark p-8 rounded-xl text-white text-center">
            <h3 className="font-bold text-xl">Dark Gradient</h3>
          </div>
        </div>
      </section>

      {/* Table */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-sky-600">Table</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Driver</td>
              <td>85%</td>
              <td>
                <span className="badge badge-success">Active</span>
              </td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>Booking Agent</td>
              <td>92%</td>
              <td>
                <span className="badge badge-success">Active</span>
              </td>
            </tr>
            <tr>
              <td>Mike Johnson</td>
              <td>Manager</td>
              <td>78%</td>
              <td>
                <span className="badge badge-warning">Pending</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Stats Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-sky-600">Dashboard Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="stat-value">156</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">89%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">24</div>
            <div className="stat-label">Active Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">1,234</div>
            <div className="stat-label">Certificates Issued</div>
          </div>
        </div>
      </section>

      {/* Special Effects */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-6 text-sky-600">Special Effects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card glow-sky text-center p-6">
            <Shield className="w-12 h-12 mx-auto mb-4 text-sky-500" />
            <h3 className="font-bold">Glow Effect</h3>
          </div>
          <div className="card shadow-sky text-center p-6">
            <Shield className="w-12 h-12 mx-auto mb-4 text-sky-500" />
            <h3 className="font-bold">Sky Shadow</h3>
          </div>
          <div className="card hover-lift text-center p-6">
            <Shield className="w-12 h-12 mx-auto mb-4 text-sky-500" />
            <h3 className="font-bold">Hover Lift</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

