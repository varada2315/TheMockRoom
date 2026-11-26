import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, KeyRound, ArrowLeft, GraduationCap, UserCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { apiClient, setSession } from '@/lib/api-client';
import { toast } from 'sonner';

interface LoginPageProps {
  role: 'student' | 'mentor' | 'superadmin';
}

export function LoginPage({ role }: LoginPageProps) {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const roleConfigs = {
    student: {
      title: 'Student Portal Access',
      subtitle: 'View your course status, scores, and upload your resume',
      icon: GraduationCap,
      badge: 'Student Module',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      demoUser: 'student_sam',
      demoPass: 'StudentPassword123!',
      redirect: '/student/dashboard',
    },
    mentor: {
      title: 'Mentor Portal Access',
      subtitle: 'Manage assigned students, record grades, and track progress',
      icon: UserCheck,
      badge: 'Mentor Module',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      demoUser: 'mentor_alex',
      demoPass: 'MentorPassword123!',
      redirect: '/mentor/dashboard',
    },
    superadmin: {
      title: 'Private Administration Console',
      subtitle: 'Restricted system-wide management and control center',
      icon: ShieldCheck,
      badge: 'Unlisted Admin Access',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      demoUser: 'admin',
      demoPass: 'AdminPassword123!',
      redirect: '/portal-admin-x7k2',
    },
  };

  const config = roleConfigs[role];
  const IconComponent = config.icon;

  const fillDemoCredentials = () => {
    setUsername(config.demoUser);
    setPassword(config.demoPass);
    toast.info(`Filled credentials for ${config.demoUser}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both Login ID / Username and Password');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.login(username, password, role);
      setSession(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      setLocation(config.redirect);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Main Website
          </a>
        </Link>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.badgeColor}`}>
          {config.badge}
        </span>
      </div>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border border-border shadow-xl bg-card">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <IconComponent className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-2xl font-serif font-bold text-foreground">
                {config.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {config.subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-foreground">
                    Login ID / Username
                  </Label>
                  <div className="relative">
                    <UserCircle className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter Login ID"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg py-5 font-semibold transition-all mt-4"
                >
                  {loading ? 'Authenticating...' : `Sign In as ${role.toUpperCase()}`}
                </Button>
              </form>

              {/* Easy Auto-Fill Demo Box */}
              <div className="mt-5 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Demo / Test Account Credentials:</span>
                  <Button type="button" variant="outline" size="sm" onClick={fillDemoCredentials} className="h-7 text-[11px] rounded-lg gap-1 hover:bg-primary/10 hover:text-primary">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Auto-Fill Demo
                  </Button>
                </div>
                <div className="font-mono text-[11px] text-muted-foreground flex justify-between items-center bg-background p-2.5 rounded-lg border border-border/40">
                  <span>Username: <strong className="text-foreground font-semibold">{config.demoUser}</strong></span>
                  <span>Password: <strong className="text-foreground font-semibold">{config.demoPass}</strong></span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-2 pt-2 pb-6 text-xs text-muted-foreground">
              {role === 'student' && (
                <p>
                  Need a student account? Contact your course administrator to issue credentials.
                </p>
              )}
              {role === 'mentor' && (
                <p>
                  Mentor accounts are issued directly by the Super Admin.
                </p>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </main>

      <footer className="text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} The Mock Room Learning Management Portal. All rights reserved.
      </footer>
    </div>
  );
}
