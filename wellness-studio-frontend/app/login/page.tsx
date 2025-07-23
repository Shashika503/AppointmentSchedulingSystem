'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { login, setStoredToken , setUserRole } from '@/lib/auth';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
useEffect(() => {
  let timeout: NodeJS.Timeout;
  if (success || error) {
    timeout = setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  }
  return () => clearTimeout(timeout);
}, [success, error]);
  // Check if user is already logged in and redirect based on their role
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      if (role === 'Admin') {
        router.push('/admin');
      } else if (role === 'Client') {
        router.push('/client');
      }
    }
  }, [router]);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { token, role , refreshToken , userId } = await login(username, password);
      setStoredToken(token);
      setUserRole(role);
      localStorage.setItem('userId', userId);
      // Optionally store refresh token if needed
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);

      
      // Redirect based on role
      router.push(role === 'Admin' ? '/admin' : '/client');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900"> Wellness AppointmentPro</h1>
          </div>
          <p className="text-gray-600">Sign in to manage your appointments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-gray-600">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Client:</strong> client1 / client123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
