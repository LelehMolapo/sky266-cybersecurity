import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, Shield, AlertTriangle, Download } from 'lucide-react';
import { supabaseDb } from '../lib/supabase';

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completedTraining: 0,
    securityIncidents: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: allUsers } = await supabaseDb.getAllUsers();
    if (allUsers) {
      setUsers(allUsers);
      setStats({
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter(u => u.last_active).length,
        completedTraining: allUsers.filter(u => u.role !== 'manager').length,
        securityIncidents: 0
      });
    }
  };

  const exportData = () => {
    const csvContent = users.map(u => 
      `${u.name},${u.email},${u.role},${u.created_at}`
    ).join('\n');
    
    const blob = new Blob([`Name,Email,Role,Created\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-white text-2xl">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-gray-400 text-sm">Training Complete</p>
                <p className="text-white text-2xl">{stats.completedTraining}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-gray-400 text-sm">Security Incidents</p>
                <p className="text-white text-2xl">{stats.securityIncidents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <Button onClick={exportData} className="w-full bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.slice(0, 10).map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white">{user.name}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                <Badge className={user.role === 'manager' ? 'bg-purple-600' : 'bg-blue-600'}>
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}