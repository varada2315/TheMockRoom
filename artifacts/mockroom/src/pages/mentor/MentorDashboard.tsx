import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  UserCheck, Users, Search, BookOpen, Award, FileText, 
  LogOut, Clock, Eye, Edit3, ShieldAlert, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { apiClient, clearSession, getStoredUser } from '@/lib/api-client';
import { toast } from 'sonner';
import { ResumePreviewOverlay } from '@/components/ResumePreviewOverlay';

function parseScore(val: any): number {
  if (typeof val === 'number') return Math.min(100, Math.max(0, val));
  if (!val) return 0;
  const num = parseInt(String(val).replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
}

export function MentorDashboard() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Resume Preview Overlay state
  const [previewOverlayOpen, setPreviewOverlayOpen] = useState(false);
  const [previewResumeData, setPreviewResumeData] = useState<{ resume: any; studentName: string } | null>(null);

  // Score Form State
  const [scoreForm, setScoreForm] = useState({
    assignmentScore: '0%',
    testQuizScore: '0%',
    projectScore: '0%',
    overallGrade: '',
    mentorRemarks: '',
  });

  const currentUser = getStoredUser();

  const fetchMentorStudents = async () => {
    try {
      const res = await apiClient.getMentorStudents();
      setData(res || {});
    } catch (err: any) {
      toast.error(err.message || 'Failed to load assigned students');
      setData({ students: [], courses: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorStudents();
  }, []);

  const handleLogout = () => {
    clearSession();
    toast.success('Logged out successfully');
    setLocation('/login/mentor');
  };

  const openScoreModal = (student: any) => {
    setSelectedStudent(student);
    const existing = student.scores || {};
    setScoreForm({
      assignmentScore: existing.assignmentScore !== undefined && existing.assignmentScore !== null && existing.assignmentScore !== '' ? `${parseScore(existing.assignmentScore)}%` : '0%',
      testQuizScore: existing.testQuizScore !== undefined && existing.testQuizScore !== null && existing.testQuizScore !== '' ? `${parseScore(existing.testQuizScore)}%` : '0%',
      projectScore: existing.projectScore !== undefined && existing.projectScore !== null && existing.projectScore !== '' ? `${parseScore(existing.projectScore)}%` : '0%',
      overallGrade: existing.overallGrade || '',
      mentorRemarks: existing.mentorRemarks || '',
    });
    setScoreModalOpen(true);
  };

  const handleSaveScores = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setSubmitting(true);
    try {
      await apiClient.updateMentorScores({
        studentId: selectedStudent.id,
        courseId: selectedStudent.enrolledCourse?.id || '',
        ...scoreForm,
      });
      toast.success(`Evaluation saved for ${selectedStudent.name}`);
      setScoreModalOpen(false);
      fetchMentorStudents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save scores');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs text-muted-foreground font-medium">Loading Mentor Portal...</p>
      </div>
    );
  }

  const students = data?.students || [];
  const courses = data?.courses || [];

  const filteredStudents = students.filter((s: any) => {
    const query = (searchQuery || '').toLowerCase().trim();
    if (!query) return true;
    const nameMatch = (s.name || '').toLowerCase().includes(query);
    const emailMatch = (s.email || '').toLowerCase().includes(query);
    const courseMatch = (s.enrolledCourse?.title || '').toLowerCase().includes(query);
    return nameMatch || emailMatch || courseMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-slate-900 leading-tight">Instructor Portal</h1>
              <p className="text-[11px] text-blue-600 font-medium">The Mock Room Learning Console</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900">{currentUser?.name || 'Instructor'}</span>
              <span className="text-[11px] text-blue-600 font-semibold">Verified Mentor</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-xs font-semibold rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100">
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Course Summary Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
              Assigned Courses Evaluation
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Student Roster & Performance Ratings
            </h2>
            <p className="text-xs text-slate-500">
              Assigned Track: <span className="font-semibold text-blue-600">{courses.map((c: any) => c.title).join(', ') || 'Assigned Courses'}</span>
            </p>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
            <div className="bg-blue-50/70 px-5 py-3 rounded-2xl border border-blue-200/80 text-center min-w-[120px]">
              <span className="text-[10px] text-blue-700 uppercase tracking-wider font-bold block">Enrolled Students</span>
              <div className="text-2xl font-bold text-blue-900 font-mono mt-0.5">{students.length}</div>
            </div>
          </div>
        </div>

        {/* Search & Notice Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search student name or course..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 text-xs rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50/80 px-3.5 py-2.5 rounded-xl border border-amber-200/80">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Personal contact info (Name, Email, Phone) is read-only for Mentors.</span>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student: any) => (
              <Card key={student.id || Math.random()} className="rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between overflow-hidden">
                <div>
                  <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-sm shadow-xs">
                          {(student.name || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold text-slate-900">{student.name || 'Student'}</CardTitle>
                          <CardDescription className="text-xs text-slate-500 truncate max-w-[160px]">{student.email}</CardDescription>
                        </div>
                      </div>
                      <Badge className="text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1">
                        {student.scores?.overallGrade ? `Grade: ${student.scores.overallGrade}` : 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3.5 text-xs">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Phone Number:</span>
                      <span className="font-mono text-slate-800">{student.phone || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-500">
                      <span>Enrolled Course:</span>
                      <span className="font-semibold text-blue-600 truncate max-w-[170px]">{student.enrolledCourse?.title || 'Unassigned'}</span>
                    </div>

                    {/* Scores Pill */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 font-mono">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Assignment:</span>
                        <span className="font-bold text-slate-900">{student.scores?.assignmentScore || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Test / Quiz:</span>
                        <span className="font-bold text-slate-900">{student.scores?.testQuizScore || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Project:</span>
                        <span className="font-bold text-slate-900">{student.scores?.projectScore || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Resume status */}
                    {student.resume ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <span className="truncate font-medium text-slate-700 flex items-center gap-1.5 max-w-[160px]">
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{student.resume.originalName}</span>
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-semibold"
                          onClick={() => {
                            setPreviewResumeData({ resume: student.resume, studentName: student.name });
                            setPreviewOverlayOpen(true);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1 text-blue-600" /> Preview Overlay
                        </Button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic block text-center py-1">No resume uploaded</span>
                    )}
                  </CardContent>
                </div>

                <div className="p-4 pt-2 bg-slate-50/50 border-t border-slate-100">
                  <Button
                    size="sm"
                    onClick={() => openScoreModal(student)}
                    className="w-full gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all py-4"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Upload / Update Scores
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-slate-400 text-xs">
              No students found matching your criteria.
            </div>
          )}
        </div>
      </main>

      {/* White + Electric Blue Score Evaluation Modal */}
      <Dialog open={scoreModalOpen} onOpenChange={setScoreModalOpen}>
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
          <DialogHeader className="pb-4 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-lg font-serif font-bold text-slate-900">
                  Evaluation & Scores — {selectedStudent?.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-blue-600 font-semibold mt-0.5">
                  Course: {selectedStudent?.enrolledCourse?.title || 'Enrolled Course'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSaveScores} className="space-y-5 pt-3">
            {/* Interactive Range Sliders (0% - 100%) */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                Evaluation Sliders (Default: 0%)
              </span>

              {/* Assignment Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="assignmentSlider" className="font-bold text-slate-800">Assignment Score</Label>
                  <span className="font-bold font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {parseScore(scoreForm.assignmentScore)}%
                  </span>
                </div>
                <input
                  id="assignmentSlider"
                  type="range"
                  min="0"
                  max="100"
                  value={parseScore(scoreForm.assignmentScore)}
                  onChange={e => setScoreForm({ ...scoreForm, assignmentScore: `${e.target.value}%` })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Test / Quiz Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="testQuizSlider" className="font-bold text-slate-800">Test / Quiz Score</Label>
                  <span className="font-bold font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {parseScore(scoreForm.testQuizScore)}%
                  </span>
                </div>
                <input
                  id="testQuizSlider"
                  type="range"
                  min="0"
                  max="100"
                  value={parseScore(scoreForm.testQuizScore)}
                  onChange={e => setScoreForm({ ...scoreForm, testQuizScore: `${e.target.value}%` })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Project Score Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="projectSlider" className="font-bold text-slate-800">Project Score</Label>
                  <span className="font-bold font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {parseScore(scoreForm.projectScore)}%
                  </span>
                </div>
                <input
                  id="projectSlider"
                  type="range"
                  min="0"
                  max="100"
                  value={parseScore(scoreForm.projectScore)}
                  onChange={e => setScoreForm({ ...scoreForm, projectScore: `${e.target.value}%` })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Grade Selector */}
            <div className="space-y-2">
              <Label htmlFor="overallGrade" className="text-xs font-bold text-slate-700">
                Overall Grade / Standing
              </Label>
              <div className="flex items-center gap-2 flex-wrap">
                {['A+', 'A', 'B+', 'B', 'C', 'Needs Improvement'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setScoreForm({ ...scoreForm, overallGrade: g })}
                    className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all ${
                      scoreForm.overallGrade === g
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <Input
                id="overallGrade"
                placeholder="Or type custom grade rating..."
                value={scoreForm.overallGrade}
                onChange={e => setScoreForm({ ...scoreForm, overallGrade: e.target.value })}
                className="rounded-xl text-xs mt-2 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mentorRemarks" className="text-xs font-bold text-slate-700">
                Mentor Remarks & Feedback
              </Label>
              <Textarea
                id="mentorRemarks"
                placeholder="Enter detailed feedback and recommendations..."
                rows={3}
                value={scoreForm.mentorRemarks}
                onChange={e => setScoreForm({ ...scoreForm, mentorRemarks: e.target.value })}
                className="rounded-xl text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Score History Section */}
            {selectedStudent?.scoreHistory && selectedStudent.scoreHistory.length > 0 && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                  Evaluation History Log ({selectedStudent.scoreHistory.length})
                </span>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {selectedStudent.scoreHistory.slice().reverse().map((h: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between items-center text-slate-500 text-[11px]">
                        <span>{h.timestamp ? new Date(h.timestamp).toLocaleDateString() : 'N/A'}</span>
                        <span className="font-bold text-blue-700 font-mono">Grade: {h.overallGrade || 'N/A'}</span>
                      </div>
                      <p className="text-slate-800 text-[11px] truncate">"{h.mentorRemarks || 'No remarks'}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setScoreModalOpen(false)} className="rounded-xl text-xs border-slate-200 bg-white text-slate-700 hover:bg-slate-100">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
                {submitting ? 'Saving...' : 'Save Evaluation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ResumePreviewOverlay
        open={previewOverlayOpen}
        onOpenChange={setPreviewOverlayOpen}
        resume={previewResumeData?.resume || null}
        studentName={previewResumeData?.studentName}
      />
    </div>
  );
}
