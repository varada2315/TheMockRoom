import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Users, GraduationCap, BookOpen, UserPlus, 
  PlusCircle, Edit3, Search, LogOut, CheckCircle2, Copy, Eye, 
  Sparkles, Layers, RefreshCw, Activity, Award,
  FileText, KeyRound, Mail, Phone, Check, Trash2, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient, clearSession, getStoredUser } from '@/lib/api-client';
import { toast } from 'sonner';
import { ResumePreviewOverlay } from '@/components/ResumePreviewOverlay';

export function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'enrolled' | 'unassigned' | 'resume'>('all');

  // Resume Preview Overlay state
  const [previewOverlayOpen, setPreviewOverlayOpen] = useState(false);
  const [previewResumeData, setPreviewResumeData] = useState<{ resume: any; studentName: string } | null>(null);

  // Modals state
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editStudentModalOpen, setEditStudentModalOpen] = useState(false);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [editMentorModalOpen, setEditMentorModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState<any>(null);

  // Deletion modals state
  const [deleteStudentConfirmOpen, setDeleteStudentConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [deleteMentorConfirmOpen, setDeleteMentorConfirmOpen] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [studentForm, setStudentForm] = useState({ name: '', email: '', phone: '', address: '', courseId: '' });
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editingMentor, setEditingMentor] = useState<any>(null);
  const [mentorForm, setMentorForm] = useState({ name: '', email: '', phone: '', courseIds: [] as string[] });
  const [courseForm, setCourseForm] = useState({ title: '', code: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const currentUser = getStoredUser();

  const fetchOverview = async () => {
    try {
      const res = await apiClient.getAdminOverview();
      setData(res || {});
    } catch (err: any) {
      toast.error(err.message || 'Failed to load admin overview');
      setData({ students: [], mentors: [], courses: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleLogout = () => {
    clearSession();
    toast.success('Logged out from Admin Console');
    setLocation('/portal-admin-x7k2/login');
  };

  // Student Creation
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiClient.createStudent(studentForm);
      toast.success('Student account created successfully!');
      setStudentModalOpen(false);
      setStudentForm({ name: '', email: '', phone: '', address: '', courseId: '' });
      setGeneratedCreds(res.generatedCredentials);
      setCredentialsModalOpen(true);
      fetchOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  // Student Update
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setSubmitting(true);
    try {
      await apiClient.updateStudent(editingStudent.id, editingStudent);
      toast.success('Student account updated successfully!');
      setEditStudentModalOpen(false);
      fetchOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update student');
    } finally {
      setSubmitting(false);
    }
  };

  // Student Delete
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    setDeleting(true);
    try {
      await apiClient.deleteStudent(studentToDelete.id);
      toast.success(`Student "${studentToDelete.name}" deleted successfully.`);
      setDeleteStudentConfirmOpen(false);
      setStudentToDelete(null);
      fetchOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete student.');
    } finally {
      setDeleting(false);
    }
  };

  // Mentor Update
  const handleUpdateMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMentor) return;

    setSubmitting(true);
    try {
      await apiClient.updateMentor(editingMentor.id, editingMentor);
      toast.success('Mentor account updated successfully!');
      setEditMentorModalOpen(false);
      fetchOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update mentor');
    } finally {
      setSubmitting(false);
    }
  };

  // Mentor Delete
  const handleDeleteMentor = async () => {
    if (!mentorToDelete) return;
    setDeleting(true);
    try {
      await apiClient.deleteMentor(mentorToDelete.id);
      toast.success(`Mentor "${mentorToDelete.name}" deleted successfully.`);
      setDeleteMentorConfirmOpen(false);
      setMentorToDelete(null);
      fetchOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete mentor.');
    } finally {
      setDeleting(false);
    }
  };

  // Mentor Creation
  const handleCreateMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiClient.createMentor(mentorForm);
      toast.success('Mentor account created successfully!');
      setMentorModalOpen(false);
      setMentorForm({ name: '', email: '', phone: '', courseIds: [] });
      setGeneratedCreds(res.generatedCredentials);
      setCredentialsModalOpen(true);
      fetchOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create mentor');
    } finally {
      setSubmitting(false);
    }
  };

  // Course Creation
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.createCourse(courseForm);
      toast.success('New course created successfully!');
      setCourseModalOpen(false);
      setCourseForm({ title: '', code: '', description: '' });
      fetchOverview();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string = 'Copied to clipboard!') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const copyAllCredentials = (creds: any) => {
    if (!creds) return;
    const summary = `🔐 The Mock Room Access Credentials\n\nLogin ID / Username: ${creds.username}\nPassword: ${creds.password}\n\nLogin Portal: ${window.location.origin}/portal-admin-x7k2/login`;
    navigator.clipboard.writeText(summary);
    toast.success('Full credential summary copied for sharing!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-800">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <ShieldCheck className="w-6 h-6 text-blue-600 absolute" />
        </div>
        <p className="mt-6 text-sm text-slate-500 font-medium tracking-wide">Loading Executive Dashboard...</p>
      </div>
    );
  }

  const students = data?.students || [];
  const mentors = data?.mentors || [];
  const courses = data?.courses || [];

  const studentsWithResumesCount = students.filter((s: any) => !!s.resume).length;

  const filteredStudents = students.filter((s: any) => {
    const query = (searchQuery || '').toLowerCase().trim();
    const nameMatch = (s.name || '').toLowerCase().includes(query);
    const emailMatch = (s.email || '').toLowerCase().includes(query);
    const usernameMatch = (s.username || '').toLowerCase().includes(query);
    const courseMatch = (s.enrolledCourse?.title || '').toLowerCase().includes(query);
    const matchesSearch = !query || (nameMatch || emailMatch || usernameMatch || courseMatch);

    if (!matchesSearch) return false;

    if (studentFilter === 'enrolled') return !!s.enrolledCourse;
    if (studentFilter === 'unassigned') return !s.enrolledCourse;
    if (studentFilter === 'resume') return !!s.resume;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="flex flex-col min-h-screen">
        {/* Top Header Navbar */}
        <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-lg text-slate-900 tracking-tight">The Mock Room</h1>
                  <Badge variant="outline" className="text-[11px] bg-blue-50 text-blue-700 border-blue-200 rounded-full px-2.5 py-0.5 font-semibold">
                    Super Admin Console
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">Central Portal Operations & Governance</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800">{currentUser?.name || 'Super Administrator'}</span>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> System Active
                </span>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="gap-2 rounded-xl text-xs font-semibold border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 transition-all shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Console</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Executive Hero Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs"
          >
            <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-blue-500/10 via-blue-500/5 to-transparent pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5" /> Executive Command Hub
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                  Management Console & Data Registry
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Real-time operations across enrolled candidate profiles, course curriculums, assigned mentors, grade history, and uploaded resumes.
                </p>
              </div>

              {/* Action Toolbar Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button 
                  onClick={() => setStudentModalOpen(true)} 
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md shadow-blue-500/15 px-5 py-2.5 text-xs sm:text-sm transition-all transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-4 h-4" /> Add Student
                </Button>
                <Button 
                  onClick={() => setMentorModalOpen(true)} 
                  variant="outline" 
                  className="gap-2 rounded-2xl px-5 py-2.5 font-semibold text-xs sm:text-sm border-slate-200 bg-white text-slate-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-xs"
                >
                  <Users className="w-4 h-4 text-emerald-600" /> Add Mentor
                </Button>
                <Button 
                  onClick={() => setCourseModalOpen(true)} 
                  variant="outline" 
                  className="gap-2 rounded-2xl px-5 py-2.5 font-semibold text-xs sm:text-sm border-slate-200 bg-white text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" /> New Course
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Metric Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Metric 1 */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
              <Card className="rounded-3xl border border-slate-200 bg-white p-5 hover:border-blue-300 transition-all hover:shadow-md group">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Students</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">{students.length}</h3>
                    <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Enrolled Candidates
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Metric 2 */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="rounded-3xl border border-slate-200 bg-white p-5 hover:border-emerald-300 transition-all hover:shadow-md group">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Mentors</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-1 group-hover:text-emerald-600 transition-colors">{mentors.length}</h3>
                    <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Verified Instructors
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Metric 3 */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <Card className="rounded-3xl border border-slate-200 bg-white p-5 hover:border-indigo-300 transition-all hover:shadow-md group">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Courses</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">{courses.length}</h3>
                    <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> Program Tracks
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Metric 4 */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="rounded-3xl border border-slate-200 bg-white p-5 hover:border-sky-300 transition-all hover:shadow-md group">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Resumes Uploaded</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-1 group-hover:text-sky-600 transition-colors">{studentsWithResumesCount}</h3>
                    <p className="text-xs text-sky-600 font-semibold mt-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Portfolio Attached
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <Tabs defaultValue="students" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-xs">
              <TabsList className="bg-slate-100/80 p-1 rounded-xl border border-slate-200 inline-flex w-full md:w-auto">
                <TabsTrigger 
                  value="students" 
                  className="flex-1 md:flex-none gap-2 rounded-lg px-5 py-2 font-semibold text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xs transition-all text-slate-600"
                >
                  <GraduationCap className="w-4 h-4" /> Students <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold">{students.length}</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="mentors" 
                  className="flex-1 md:flex-none gap-2 rounded-lg px-5 py-2 font-semibold text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xs transition-all text-slate-600"
                >
                  <Users className="w-4 h-4" /> Mentors <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold">{mentors.length}</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="courses" 
                  className="flex-1 md:flex-none gap-2 rounded-lg px-5 py-2 font-semibold text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xs transition-all text-slate-600"
                >
                  <BookOpen className="w-4 h-4" /> Courses <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold">{courses.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <Button 
                size="sm" 
                variant="ghost" 
                onClick={fetchOverview} 
                className="gap-2 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl px-4 py-2 self-end md:self-auto font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
              </Button>
            </div>

            {/* TAB 1: STUDENTS */}
            <TabsContent value="students" className="space-y-5">
              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <Input
                    placeholder="Search name, email, login ID, course..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 bg-slate-50 border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-400"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-700 font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">Filter:</span>
                  <button
                    onClick={() => setStudentFilter('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      studentFilter === 'all' 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({students.length})
                  </button>
                  <button
                    onClick={() => setStudentFilter('enrolled')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      studentFilter === 'enrolled' 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Enrolled ({students.filter((s: any) => !!s.enrolledCourse).length})
                  </button>
                  <button
                    onClick={() => setStudentFilter('unassigned')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      studentFilter === 'unassigned' 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Unassigned ({students.filter((s: any) => !s.enrolledCourse).length})
                  </button>
                  <button
                    onClick={() => setStudentFilter('resume')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      studentFilter === 'resume' 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Has Resume ({studentsWithResumesCount})
                  </button>
                </div>
              </div>

              {/* Table */}
              <Card className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <thead className="bg-slate-100/80 text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Student Profile</th>
                        <th className="px-6 py-4">Login ID</th>
                        <th className="px-6 py-4">Enrolled Course</th>
                        <th className="px-6 py-4">Assigned Mentor(s)</th>
                        <th className="px-6 py-4">Overall Grade</th>
                        <th className="px-6 py-4">Resume</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((s: any) => (
                          <tr key={s.id || Math.random()} className="hover:bg-blue-50/40 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm shadow-xs">
                                  {(s.name || 'S').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{s.name || 'Unnamed Student'}</div>
                                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {s.email || 'N/A'}</span>
                                    {s.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {s.phone}</span>}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <button 
                                onClick={() => copyToClipboard(s.username, 'Login ID copied!')}
                                className="font-mono text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1 hover:bg-blue-100 transition-colors flex items-center gap-1.5 font-bold"
                                title="Click to copy Login ID"
                              >
                                <KeyRound className="w-3 h-3 text-blue-600" />
                                <span>{s.username}</span>
                              </button>
                            </td>

                            <td className="px-6 py-4">
                              {s.enrolledCourse ? (
                                <Badge variant="outline" className="rounded-lg bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold text-xs py-1">
                                  {s.enrolledCourse.title}
                                </Badge>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Unassigned</span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-xs font-medium">
                              {s.assignedMentors && s.assignedMentors.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {s.assignedMentors.map((m: any) => (
                                    <Badge key={m.id || m.email} variant="outline" className="rounded-lg bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] py-0.5 font-semibold">
                                      {m.name}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-xs">No active mentor</span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              {s.scores?.overallGrade ? (
                                <Badge className="rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2.5 py-1 text-xs">
                                  {s.scores.overallGrade}
                                </Badge>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">Pending Review</span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              {s.resume ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-xs gap-1.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl font-semibold border border-emerald-200"
                                  onClick={() => {
                                    setPreviewResumeData({ resume: s.resume, studentName: s.name });
                                    setPreviewOverlayOpen(true);
                                  }}
                                >
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" /> Preview Overlay
                                </Button>
                              ) : (
                                <span className="text-xs text-slate-400 italic">No File</span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingStudent({
                                      ...s,
                                      courseId: s.enrolledCourse?.id || '',
                                    });
                                    setEditStudentModalOpen(true);
                                  }}
                                  className="h-8 gap-1.5 text-xs rounded-xl border-blue-200 bg-white text-blue-700 hover:bg-blue-50 font-semibold"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Edit
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setStudentToDelete(s);
                                    setDeleteStudentConfirmOpen(true);
                                  }}
                                  className="h-8 gap-1.5 text-xs rounded-xl border-rose-200 bg-white text-rose-700 hover:bg-rose-50 hover:border-rose-300 font-semibold px-2.5"
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <GraduationCap className="w-8 h-8 text-slate-300" />
                              <p className="font-semibold text-slate-600">No matching student records found.</p>
                              <p className="text-xs text-slate-400">Try adjusting your search filter.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 2: MENTORS */}
            <TabsContent value="mentors" className="space-y-5">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-base font-serif font-bold text-slate-900">Mentor Roster</h3>
                  <p className="text-xs text-slate-500">Instructor profiles and assigned course tracks</p>
                </div>
                <Button onClick={() => setMentorModalOpen(true)} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-4 shadow-xs">
                  <PlusCircle className="w-4 h-4" /> Create Mentor Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((m: any) => (
                  <Card key={m.id || Math.random()} className="rounded-3xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between">
                    <CardHeader className="pb-3 border-b border-slate-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-base shadow-xs">
                            {(m.name || 'M').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <CardTitle className="text-base font-bold text-slate-900">{m.name}</CardTitle>
                            <CardDescription className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" /> {m.email}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={m.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold' : 'bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold'}>
                          {m.isActive ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-3.5 text-xs text-slate-700 flex-1">
                      <div className="flex justify-between items-center font-mono">
                        <span className="text-slate-400 font-sans font-medium">Login ID:</span>
                        <button 
                          onClick={() => copyToClipboard(m.username, 'Mentor Login ID copied!')}
                          className="text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5 font-bold hover:bg-blue-100"
                        >
                          {m.username}
                        </button>
                      </div>
                      <div className="flex justify-between items-center font-mono">
                        <span className="text-slate-400 font-sans font-medium">Phone:</span>
                        <span className="text-slate-800 font-medium">{m.phone || 'N/A'}</span>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Assigned Courses:</span>
                        {m.assignedCourses && m.assignedCourses.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {m.assignedCourses.map((c: any) => (
                              <Badge key={c.id} variant="outline" className="rounded-lg bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px] py-0.5 font-semibold">
                                {c.title}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No courses assigned yet</span>
                        )}
                      </div>
                    </CardContent>

                    <div className="p-4 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingMentor({
                            ...m,
                            courseIds: m.assignedCourseIds || m.assignedCourses?.map((c: any) => c.id) || [],
                          });
                          setEditMentorModalOpen(true);
                        }}
                        className="flex-1 gap-1.5 text-xs rounded-xl border-blue-200 bg-white text-blue-700 hover:bg-blue-50 font-semibold"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Edit Profile & Courses
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setMentorToDelete(m);
                          setDeleteMentorConfirmOpen(true);
                        }}
                        className="gap-1.5 text-xs rounded-xl border-rose-200 bg-white text-rose-700 hover:bg-rose-50 hover:border-rose-300 font-semibold px-3"
                        title="Delete Mentor"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 3: COURSES */}
            <TabsContent value="courses" className="space-y-5">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-base font-serif font-bold text-slate-900">Curriculum & Courses</h3>
                  <p className="text-xs text-slate-500">Available mock interview training tracks</p>
                </div>
                <Button onClick={() => setCourseModalOpen(true)} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-4 shadow-xs">
                  <PlusCircle className="w-4 h-4" /> Create Course
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((c: any) => (
                  <Card key={c.id || Math.random()} className="rounded-3xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between">
                    <CardHeader className="pb-3 border-b border-slate-100">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <CardTitle className="text-lg font-bold text-slate-900">{c.title}</CardTitle>
                          <Badge variant="outline" className="font-mono text-xs rounded-lg mt-1 bg-indigo-50 text-indigo-700 border-indigo-200 font-bold">
                            {c.code}
                          </Badge>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 text-xs text-slate-600 space-y-4 flex-1">
                      <p className="leading-relaxed text-slate-600">{c.description || 'No description provided.'}</p>
                      
                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] font-mono text-slate-400">
                        <span>Course Code: <strong className="text-indigo-700 font-bold">{c.code}</strong></span>
                        <span>Added: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* MODAL: DELETE STUDENT CONFIRMATION */}
        <Dialog open={deleteStudentConfirmOpen} onOpenChange={setDeleteStudentConfirmOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-white border-slate-200 text-slate-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-rose-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Delete Student Profile
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Are you sure you want to permanently delete this student profile?
              </DialogDescription>
            </DialogHeader>

            {studentToDelete && (
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2 my-2 text-xs">
                <p className="font-bold text-slate-900 text-sm">{studentToDelete.name}</p>
                <p className="text-slate-600"><strong className="text-slate-700">Login ID:</strong> {studentToDelete.username}</p>
                <p className="text-slate-600"><strong className="text-slate-700">Email:</strong> {studentToDelete.email}</p>
                <p className="text-rose-700 text-[11px] font-medium pt-1">⚠️ All course enrollments, grade history, and uploaded resume files associated with this student will be permanently removed.</p>
              </div>
            )}

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setDeleteStudentConfirmOpen(false)} className="rounded-xl border-slate-200 text-slate-600">
                Cancel
              </Button>
              <Button type="button" onClick={handleDeleteStudent} disabled={deleting} className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold">
                {deleting ? 'Deleting...' : 'Delete Student'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL: DELETE MENTOR CONFIRMATION */}
        <Dialog open={deleteMentorConfirmOpen} onOpenChange={setDeleteMentorConfirmOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-white border-slate-200 text-slate-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-rose-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Delete Mentor Account
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Are you sure you want to permanently delete this mentor account?
              </DialogDescription>
            </DialogHeader>

            {mentorToDelete && (
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2 my-2 text-xs">
                <p className="font-bold text-slate-900 text-sm">{mentorToDelete.name}</p>
                <p className="text-slate-600"><strong className="text-slate-700">Login ID:</strong> {mentorToDelete.username}</p>
                <p className="text-slate-600"><strong className="text-slate-700">Email:</strong> {mentorToDelete.email}</p>
                <p className="text-rose-700 text-[11px] font-medium pt-1">⚠️ This instructor's course assignments will be unlinked.</p>
              </div>
            )}

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setDeleteMentorConfirmOpen(false)} className="rounded-xl border-slate-200 text-slate-600">
                Cancel
              </Button>
              <Button type="button" onClick={handleDeleteMentor} disabled={deleting} className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold">
                {deleting ? 'Deleting...' : 'Delete Mentor'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL: CREATE STUDENT */}
        <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-white border-slate-200 text-slate-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" /> Create Student Profile
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Enter student info. Unique Login ID & Password will be auto-generated.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateStudent} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="stdName" className="text-xs font-bold text-slate-700">Full Name *</Label>
                <Input
                  id="stdName"
                  required
                  placeholder="e.g. Samuel Rodriguez"
                  value={studentForm.name}
                  onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stdEmail" className="text-xs font-bold text-slate-700">Email Address *</Label>
                <Input
                  id="stdEmail"
                  type="email"
                  required
                  placeholder="samuel@example.com"
                  value={studentForm.email}
                  onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stdPhone" className="text-xs font-bold text-slate-700">Phone Number *</Label>
                <Input
                  id="stdPhone"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={studentForm.phone}
                  onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stdAddress" className="text-xs font-bold text-slate-700">Location / Address</Label>
                <Input
                  id="stdAddress"
                  placeholder="City, Country"
                  value={studentForm.address}
                  onChange={e => setStudentForm({ ...studentForm, address: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stdCourse" className="text-xs font-bold text-slate-700">Assign Program Course</Label>
                <Select
                  value={studentForm.courseId}
                  onValueChange={val => setStudentForm({ ...studentForm, courseId: val })}
                >
                  <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs">
                    <SelectValue placeholder="Select course track..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white border-slate-200 text-slate-900">
                    {courses.map((c: any) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.title} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setStudentModalOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {submitting ? 'Generating...' : 'Create & Issue Credentials'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL: EDIT STUDENT */}
        <Dialog open={editStudentModalOpen} onOpenChange={setEditStudentModalOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-white border-slate-200 text-slate-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" /> Edit Student Profile
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Modify profile details, course enrollment, or reset login password.
              </DialogDescription>
            </DialogHeader>

            {editingStudent && (
              <form onSubmit={handleUpdateStudent} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="editName" className="text-xs font-bold text-slate-700">Full Name</Label>
                  <Input
                    id="editName"
                    value={editingStudent.name || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editEmail" className="text-xs font-bold text-slate-700">Email Address</Label>
                  <Input
                    id="editEmail"
                    value={editingStudent.email || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editPhone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                  <Input
                    id="editPhone"
                    value={editingStudent.phone || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editCourseSelect" className="text-xs font-bold text-slate-700">Enrolled Course</Label>
                  <Select
                    value={editingStudent.courseId || editingStudent.enrolledCourse?.id || ''}
                    onValueChange={val => setEditingStudent({ ...editingStudent, courseId: val })}
                  >
                    <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs">
                      <SelectValue placeholder="Select course..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-white border-slate-200 text-slate-900">
                      {courses.map((c: any) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">
                          {c.title} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editUsername" className="text-xs font-bold text-blue-700">Login ID / Username</Label>
                  <Input
                    id="editUsername"
                    value={editingStudent.username || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, username: e.target.value })}
                    className="rounded-xl bg-blue-50 border-blue-200 text-blue-900 font-mono text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editPassword" className="text-xs font-bold text-slate-700">Reset Password (Optional)</Label>
                  <Input
                    id="editPassword"
                    type="password"
                    placeholder="Leave empty to keep unchanged"
                    value={editingStudent.password || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, password: e.target.value })}
                    className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <DialogFooter className="pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setEditStudentModalOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* MODAL: CREATE MENTOR */}
        <Dialog open={mentorModalOpen} onOpenChange={setMentorModalOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-white border-slate-200 text-slate-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Create Mentor Profile
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Add an instructor to assign to training courses.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateMentor} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="mntName" className="text-xs font-bold text-slate-700">Full Name *</Label>
                <Input
                  id="mntName"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={mentorForm.name}
                  onChange={e => setMentorForm({ ...mentorForm, name: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mntEmail" className="text-xs font-bold text-slate-700">Email Address *</Label>
                <Input
                  id="mntEmail"
                  type="email"
                  required
                  placeholder="alex.rivera@example.com"
                  value={mentorForm.email}
                  onChange={e => setMentorForm({ ...mentorForm, email: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mntPhone" className="text-xs font-bold text-slate-700">Phone Number *</Label>
                <Input
                  id="mntPhone"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={mentorForm.phone}
                  onChange={e => setMentorForm({ ...mentorForm, phone: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Assign Courses</Label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 border border-slate-200 rounded-2xl bg-slate-50">
                  {courses.map((c: any) => {
                    const isSelected = mentorForm.courseIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setMentorForm({ ...mentorForm, courseIds: mentorForm.courseIds.filter(id => id !== c.id) });
                          } else {
                            setMentorForm({ ...mentorForm, courseIds: [...mentorForm.courseIds, c.id] });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {c.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setMentorModalOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {submitting ? 'Creating...' : 'Create Mentor'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL: EDIT MENTOR */}
        <Dialog open={editMentorModalOpen} onOpenChange={setEditMentorModalOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-white border-slate-200 text-slate-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" /> Edit Mentor Account
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Modify instructor details, assigned course tracks, or login password.
              </DialogDescription>
            </DialogHeader>

            {editingMentor && (
              <form onSubmit={handleUpdateMentor} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="mntEditName" className="text-xs font-bold text-slate-700">Full Name</Label>
                  <Input
                    id="mntEditName"
                    value={editingMentor.name || ''}
                    onChange={e => setEditingMentor({ ...editingMentor, name: e.target.value })}
                    className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mntEditEmail" className="text-xs font-bold text-slate-700">Email Address</Label>
                  <Input
                    id="mntEditEmail"
                    value={editingMentor.email || ''}
                    onChange={e => setEditingMentor({ ...editingMentor, email: e.target.value })}
                    className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mntEditPhone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                  <Input
                    id="mntEditPhone"
                    value={editingMentor.phone || ''}
                    onChange={e => setEditingMentor({ ...editingMentor, phone: e.target.value })}
                    className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Assigned Courses</Label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 border border-slate-200 rounded-2xl bg-slate-50">
                    {courses.map((c: any) => {
                      const currentIds = editingMentor.courseIds || editingMentor.assignedCourseIds || [];
                      const isSelected = currentIds.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            const nextIds = isSelected
                              ? currentIds.filter((id: string) => id !== c.id)
                              : [...currentIds, c.id];
                            setEditingMentor({ ...editingMentor, courseIds: nextIds, assignedCourseIds: nextIds });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {c.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mntEditUsername" className="text-xs font-bold text-blue-700">Login ID / Username</Label>
                  <Input
                    id="mntEditUsername"
                    value={editingMentor.username || ''}
                    onChange={e => setEditingMentor({ ...editingMentor, username: e.target.value })}
                    className="rounded-xl bg-blue-50 border-blue-200 text-blue-900 font-mono text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mntEditPassword" className="text-xs font-bold text-slate-700">New Password (Optional)</Label>
                  <Input
                    id="mntEditPassword"
                    type="password"
                    placeholder="Leave empty to keep unchanged"
                    value={editingMentor.password || ''}
                    onChange={e => setEditingMentor({ ...editingMentor, password: e.target.value })}
                    className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                  />
                </div>

                <DialogFooter className="pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setEditMentorModalOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* MODAL: CREATE COURSE */}
        <Dialog open={courseModalOpen} onOpenChange={setCourseModalOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-white border-slate-200 text-slate-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Create New Course
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Define a new mock interview curriculum track.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateCourse} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="crsTitle" className="text-xs font-bold text-slate-700">Course Title *</Label>
                <Input
                  id="crsTitle"
                  required
                  placeholder="e.g. AI & Generative Engineering"
                  value={courseForm.title}
                  onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="crsCode" className="text-xs font-bold text-slate-700">Course Code *</Label>
                <Input
                  id="crsCode"
                  required
                  placeholder="e.g. AI-GEN-301"
                  value={courseForm.code}
                  onChange={e => setCourseForm({ ...courseForm, code: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="crsDesc" className="text-xs font-bold text-slate-700">Course Description</Label>
                <Textarea
                  id="crsDesc"
                  placeholder="Describe program goals, modules..."
                  value={courseForm.description}
                  onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="rounded-xl bg-slate-50 border-slate-200 text-slate-900 text-xs"
                />
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setCourseModalOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {submitting ? 'Saving...' : 'Create Course'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL: GENERATED CREDENTIALS */}
        <Dialog open={credentialsModalOpen} onOpenChange={setCredentialsModalOpen}>
          <DialogContent className="max-w-md rounded-3xl bg-white border-slate-200 text-slate-900 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif flex items-center gap-2 text-blue-600">
                <CheckCircle2 className="w-6 h-6" /> Account Credentials Issued
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Share these generated credentials directly with the user.
              </DialogDescription>
            </DialogHeader>

            {generatedCreds && (
              <div className="space-y-3 my-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block font-sans font-semibold">Login ID / Username</span>
                      <span className="font-bold text-blue-700 text-sm">{generatedCreds.username}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedCreds.username, 'Login ID copied!')} className="rounded-lg h-8 text-blue-600 hover:bg-blue-50">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block font-sans font-semibold">Temporary Password</span>
                      <span className="font-bold text-slate-900 text-sm">{generatedCreds.password}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedCreds.password, 'Password copied!')} className="rounded-lg h-8 text-blue-600 hover:bg-blue-50">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={() => copyAllCredentials(generatedCreds)} 
                  variant="outline"
                  className="w-full gap-2 rounded-xl border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 font-bold text-xs py-2.5"
                >
                  <Copy className="w-4 h-4" /> Copy Full Credentials Summary
                </Button>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setCredentialsModalOpen(false)} className="rounded-xl w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* RESUME PREVIEW OVERLAY */}
        <ResumePreviewOverlay
          open={previewOverlayOpen}
          onOpenChange={setPreviewOverlayOpen}
          resume={previewResumeData?.resume || null}
          studentName={previewResumeData?.studentName}
        />
      </div>
    </div>
  );
}
