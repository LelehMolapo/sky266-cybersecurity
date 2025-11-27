// src/components/ManagerDashboard.tsx (Full Complete Code - No Cuts, Fixed All Errors)
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Award,
  BarChart3,
  Video,
  Brain
} from 'lucide-react';
import { supabaseDb } from '../lib/supabase';

interface EmployeeProgress {
  videosCompleted: number;
  totalVideos: number;
  quizzesPassed: number;
  totalQuizzes: number;
  overallProgress: number;
  certificatesEarned: number;
  status?: 'active' | 'completed' | 'behind';
}

interface Employee extends EmployeeProgress {
  id: string; // Fixed: string to match localStorage random ID
  name: string;
  email: string;
  department?: string;
  role: 'driver' | 'booking-agent';
  lastActive?: string;
}

export default function ManagerDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'behind'>('all');

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const { data: users } = await supabaseDb.getAllUsersProgress();
        if (users) {
          const formattedEmployees: Employee[] = users
            .filter(user => user.role !== 'manager')
            .map(user => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              department: user.department,
              lastActive: user.last_active,
              videosCompleted: user.training_progress?.videos_completed || 0,
              totalVideos: user.training_progress?.total_videos || 16,
              quizzesPassed: user.training_progress?.quizzes_passed || 0,
              totalQuizzes: user.training_progress?.total_quizzes || 10,
              overallProgress: user.training_progress?.overall_progress || 0,
              certificatesEarned: user.training_progress?.certificates_earned || 0,
              status: user.training_progress?.overall_progress >= 100 ? 'completed' : 
                     user.training_progress?.overall_progress < 30 ? 'behind' : 'active'
            }));
          setEmployees(formattedEmployees);
        }
      } catch (error) {
        console.error('Failed to load employees:', error);
        // Fallback to localStorage
        const allUsers: Employee[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sky266_user_')) {
            const userStr = localStorage.getItem(key);
            if (userStr) {
              const user = JSON.parse(userStr);
              if (user.role !== 'manager') {
                const progressKey = `sky266_progress_${user.id}`;
                const progressStr = localStorage.getItem(progressKey);
                let progress: EmployeeProgress = {
                  videosCompleted: 0,
                  totalVideos: 16,
                  quizzesPassed: 0,
                  totalQuizzes: 10,
                  overallProgress: 0,
                  certificatesEarned: 0,
                  status: 'active',
                };
                if (progressStr) {
                  progress = JSON.parse(progressStr);
                }
                allUsers.push({ ...user, ...progress } as Employee);
              }
            }
          }
        }
        setEmployees(allUsers);
      }
    };

    loadEmployees();

    // Listen for real-time updates
    const handleProgressUpdate = (event: CustomEvent) => {
      const { userId, progress } = event.detail;
      console.log('Manager dashboard received update:', { userId, progress });
      setEmployees(prev => prev.map(emp => 
        emp.id === userId ? {
          ...emp,
          videosCompleted: progress.videos_completed ?? emp.videosCompleted,
          quizzesPassed: progress.quizzes_passed ?? emp.quizzesPassed,
          overallProgress: progress.overall_progress ?? emp.overallProgress,
          certificatesEarned: progress.certificates_earned ?? emp.certificatesEarned,
          status: (progress.overall_progress ?? 0) >= 100 ? 'completed' : 
                 (progress.overall_progress ?? 0) < 30 ? 'behind' : 'active'
        } : emp
      ));
    };

    window.addEventListener('trainingProgressUpdate', handleProgressUpdate as EventListener);
    return () => {
      window.removeEventListener('trainingProgressUpdate', handleProgressUpdate as EventListener);
    };
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (emp.department && emp.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const status = emp.status || 'active';
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalEmployees = employees.length;
  const completedEmployees = employees.filter(e => (e.status || 'active') === 'completed').length;
  const averageProgress = totalEmployees > 0 ? Math.round(
    employees.reduce((acc, e) => acc + (e.overallProgress || 0), 0) / totalEmployees
  ) : 0;
  const behindEmployees = employees.filter(e => (e.status || 'active') === 'behind').length;

  const stats = [
    {
      title: 'Total Staff',
      value: totalEmployees,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Average Progress',
      value: `${averageProgress}%`,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Completed',
      value: completedEmployees,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: 'Behind Schedule',
      value: behindEmployees,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 text-white">Completed</Badge>;
      case 'behind':
        return <Badge className="bg-yellow-600 text-white">Behind</Badge>;
      default:
        return <Badge className="bg-blue-600 text-white">Active</Badge>;
    }
  };

  // Top Performers: Sort dynamically from employees
  const topPerformers = employees
    .sort((a, b) => (b.overallProgress || 0) - (a.overallProgress || 0))
    .slice(0, 5);

  // Department Performance: Group by role
  const departmentPerformance = employees.reduce((acc, emp) => {
    const dept = emp.role === 'driver' ? 'Drivers' : emp.role === 'booking-agent' ? 'Booking Agents' : 'Other';
    if (!acc[dept]) {
      acc[dept] = { employees: 0, totalProgress: 0 };
    }
    acc[dept].employees += 1;
    acc[dept].totalProgress += (emp.overallProgress || 0);
    return acc;
  }, {} as Record<string, { employees: number; totalProgress: number }>);

  const departmentStats = Object.entries(departmentPerformance).map(([dept, data]) => ({
    dept,
    avgProgress: Math.round(data.totalProgress / data.employees),
    count: data.employees,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 border border-blue-500/20 shadow-xl shadow-blue-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-white mb-2">Manager Dashboard</h2>
          <p className="text-blue-100">
            Monitor security training progress for drivers, booking agents, and all courier staff
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-white text-2xl">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Employee Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Staff Training Progress</CardTitle>
              <CardDescription className="text-gray-400">
                Track individual completion rates for drivers and booking agents
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={filterStatus} onValueChange={(v: string) => setFilterStatus(v as 'all' | 'active' | 'completed' | 'behind')} className="mb-4">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
                All ({employees.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-600">
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-blue-600">
                Completed
              </TabsTrigger>
              <TabsTrigger value="behind" className="data-[state=active]:bg-blue-600">
                Behind
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Staff Member</TableHead>
                  <TableHead className="text-gray-400">Role</TableHead>
                  <TableHead className="text-gray-400">Department</TableHead>
                  <TableHead className="text-gray-400">Progress</TableHead>
                  <TableHead className="text-gray-400">Videos</TableHead>
                  <TableHead className="text-gray-400">Quizzes</TableHead>
                  <TableHead className="text-gray-400">Certificates</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => {
                  const status = employee.status || 'active';
                  return (
                    <TableRow key={employee.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell>
                        <div>
                          <p className="text-white">{employee.name}</p>
                          <p className="text-gray-400 text-sm">{employee.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${
                          employee.role === 'driver' ? 'border-blue-500/50 text-blue-400' : 'border-green-500/50 text-green-400'
                        }`}>
                          {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{employee.department || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-[120px]">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Overall</span>
                            <span className="text-blue-400">{employee.overallProgress || 0}%</span>
                          </div>
                          <Progress value={employee.overallProgress || 0} className="h-2 bg-gray-800" />
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4 text-blue-400" />
                          {employee.videosCompleted || 0}/{employee.totalVideos || 16}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-1">
                          <Brain className="w-4 h-4 text-purple-400" />
                          {employee.quizzesPassed || 0}/{employee.totalQuizzes || 10}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-yellow-400" />
                          {employee.certificatesEarned || 0}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(status)}</TableCell>
                      <TableCell className="text-gray-400 text-sm">{employee.lastActive || 'N/A'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No staff members found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.length > 0 ? departmentStats.map((deptStat, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">{deptStat.dept} ({deptStat.count})</span>
                    <span className="text-blue-400">{deptStat.avgProgress}%</span>
                  </div>
                  <Progress value={deptStat.avgProgress} className="h-2 bg-gray-800" />
                </div>
              )) : (
                <p className="text-gray-400 text-center">No department data available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.length > 0 ? topPerformers.map((employee, index) => (
                <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-600' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' :
                      'bg-gray-700'
                    }`}>
                      <span className="text-white text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white">{employee.name}</p>
                      <p className="text-gray-400 text-sm">{employee.role} • {employee.department || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400">{employee.overallProgress || 0}%</p>
                    <p className="text-gray-500 text-xs">{employee.certificatesEarned || 0} certs</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-center">No staff performance data available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
