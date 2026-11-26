import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { 
  GraduationCap, FileText, Upload, CheckCircle2, Clock, 
  Award, LogOut, User, Mail, Phone, MapPin, BookOpen, AlertCircle, Eye, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient, clearSession } from '@/lib/api-client';
import { toast } from 'sonner';
import { ResumePreviewOverlay } from '@/components/ResumePreviewOverlay';

function parseScore(val: any): number {
  if (typeof val === 'number') return Math.min(100, Math.max(0, val));
  if (!val) return 0;
  const num = parseInt(String(val).replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
}

export function StudentDashboard() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewOverlayOpen, setPreviewOverlayOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.getStudentProfile();
      setData(res || {});
    } catch (err: any) {
      toast.error(err.message || 'Failed to load student profile');
      setData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    clearSession();
    toast.success('Logged out successfully');
    setLocation('/login/student');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!ext || !allowedExtensions.includes(ext)) {
      toast.error('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    setUploading(true);
    try {
      await apiClient.uploadResume(file);
      toast.success('Resume uploaded successfully!');
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || 'Resume upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-muted-foreground font-medium">Loading Student Learning Portal...</p>
      </div>
    );
  }

  const { portfolio, scores, scoreHistory, resume } = data || {};

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-blue-500/20">
      {/* Top Navbar */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg leading-tight">Student Dashboard</h1>
              <p className="text-xs text-muted-foreground">The Mock Room Learning Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold">{portfolio?.name || 'Student'}</span>
              <span className="text-xs text-muted-foreground">{portfolio?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 rounded-xl text-xs font-semibold hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Header - Non-boxy */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-blue-500/25 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 text-xs font-semibold border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Student Profile & Scores
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Welcome back, {portfolio?.name || 'Student'}!
            </h2>
            <p className="text-sm text-muted-foreground">
              Enrolled Course: <span className="font-semibold text-foreground">{portfolio?.enrolledCourse?.title || 'Unassigned Program'}</span> ({portfolio?.enrolledCourse?.code || 'N/A'})
            </p>
          </div>

          {/* Overall Grade Metric Card */}
          <div className="bg-card/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-border/60 flex items-center gap-4 shadow-sm min-w-[220px] shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Overall Standing</div>
              <div className="text-2xl font-bold text-blue-600">{scores?.overallGrade || 'Pending'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Portfolio & Resume Upload */}
          <div className="space-y-6">
            {/* Student Portfolio Card */}
            <Card className="rounded-3xl border border-border/60 shadow-sm bg-card">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-base font-serif font-bold flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Personal Portfolio
                </CardTitle>
                <CardDescription className="text-xs">Your contact profile & mentor assignment</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Full Name</span>
                    <span className="font-semibold text-foreground text-sm">{portfolio?.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Email Address</span>
                    <span className="font-medium text-foreground">{portfolio?.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Phone Number</span>
                    <span className="font-medium text-foreground">{portfolio?.phone}</span>
                  </div>
                </div>

                {portfolio?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Address</span>
                      <span className="font-medium text-foreground">{portfolio?.address}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 pt-3 border-t border-border/40">
                  <BookOpen className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Course Instructor(s)</span>
                    <span className="font-semibold text-blue-600 text-sm">
                      {portfolio?.assignedMentors && portfolio.assignedMentors.length > 0
                        ? portfolio.assignedMentors.map((m: any) => m.name).join(', ')
                        : portfolio?.assignedMentor?.name || 'Course Instructor'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume Upload / Replacement Card */}
            <Card className="rounded-3xl border border-border/60 shadow-sm bg-card">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-base font-serif font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Resume & Portfolio Document
                </CardTitle>
                <CardDescription className="text-xs">Upload or replace your PDF/DOC resume</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {resume ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Resume Uploaded</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(resume.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-foreground font-mono truncate bg-background p-2.5 rounded-xl border border-border/60">
                      {resume.originalName}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1.5 text-xs rounded-xl"
                        onClick={() => setPreviewOverlayOpen(true)}
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" /> Preview Resume Overlay
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full gap-1.5 text-xs rounded-xl"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-3.5 h-3.5" /> Replace
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-border/60 rounded-2xl space-y-3">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground opacity-60" />
                    <div>
                      <p className="text-sm font-semibold">No resume uploaded yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Accepted: PDF, DOC, DOCX, RTF, TXT, PAGES, ODT, PNG, JPG (Max 15MB)</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2 rounded-xl"
                    >
                      <Upload className="w-4 h-4" /> Upload Resume
                    </Button>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.rtf,.txt,.pages,.odt,.png,.jpg,.jpeg"
                  className="hidden"
                />
              </CardContent>
            </Card>

            <ResumePreviewOverlay
              open={previewOverlayOpen}
              onOpenChange={setPreviewOverlayOpen}
              resume={resume}
              studentName={portfolio?.name}
            />
          </div>

          {/* Right Column: Performance Scores & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Performance Scores (Read-only) */}
            <Card className="rounded-3xl border border-border/60 shadow-sm bg-card">
              <CardHeader className="pb-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-serif font-bold flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      Course Performance Scores
                    </CardTitle>
                    <CardDescription className="text-xs">Live evaluation entered by your mentor</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-[11px] rounded-full px-2.5">Read Only</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {scores ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {/* Assignment Progress Meter */}
                      <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">Assignment Score</span>
                          <span className="font-bold text-blue-600 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                            {parseScore(scores.assignmentScore)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${parseScore(scores.assignmentScore)}%` }}
                          />
                        </div>
                      </div>

                      {/* Test / Quiz Progress Meter */}
                      <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">Test / Quiz Score</span>
                          <span className="font-bold text-blue-600 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                            {parseScore(scores.testQuizScore)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${parseScore(scores.testQuizScore)}%` }}
                          />
                        </div>
                      </div>

                      {/* Project Score Progress Meter */}
                      <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">Project Score</span>
                          <span className="font-bold text-blue-600 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                            {parseScore(scores.projectScore)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${parseScore(scores.projectScore)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {scores.mentorRemarks && (
                      <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Mentor Remarks & Feedback</span>
                        <p className="text-sm text-foreground italic">"{scores.mentorRemarks}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground text-sm space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto opacity-50" />
                    <p>No score evaluations published yet. Check back soon as your mentor evaluates your work.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance History Log Timeline */}
            <Card className="rounded-3xl border border-border/60 shadow-sm bg-card">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-base font-serif font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Performance History Log
                </CardTitle>
                <CardDescription className="text-xs">Timeline of grades and evaluation updates</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {scoreHistory && scoreHistory.length > 0 ? (
                  <div className="relative pl-6 border-l-2 border-blue-500/25 space-y-6">
                    {scoreHistory.slice().reverse().map((entry: any, index: number) => (
                      <div key={entry.id || index} className="relative space-y-2">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-background" />

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            Updated by {entry.updatedByMentorName || 'Instructor'}
                          </span>
                          <span>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'N/A'}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-card border border-border/60 text-xs space-y-2 shadow-xs">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                            <div><span className="text-muted-foreground">Assign:</span> {entry.assignmentScore}</div>
                            <div><span className="text-muted-foreground">Quiz:</span> {entry.testQuizScore}</div>
                            <div><span className="text-muted-foreground">Proj:</span> {entry.projectScore}</div>
                            <div><span className="text-muted-foreground">Grade:</span> <span className="font-bold text-blue-600">{entry.overallGrade}</span></div>
                          </div>
                          {entry.mentorRemarks && (
                            <p className="text-muted-foreground pt-2 border-t border-border/40 italic text-[11px]">
                              "{entry.mentorRemarks}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">No historical score logs registered yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
