import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface ResumePreviewOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume: {
    filename: string;
    originalName: string;
    mimeType?: string;
    uploadedAt?: string;
  } | null;
  studentName?: string;
}

export function ResumePreviewOverlay({ open, onOpenChange, resume, studentName }: ResumePreviewOverlayProps) {
  if (!resume) return null;

  const fileUrl = `/api/resumes/${resume.filename}`;
  const ext = (resume.originalName || resume.filename).split('.').pop()?.toLowerCase() || '';
  const canEmbed = ['pdf', 'png', 'jpg', 'jpeg', 'txt'].includes(ext);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[92vh] flex flex-col p-6 rounded-3xl border border-border shadow-2xl bg-card">
        <DialogHeader className="pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-serif font-bold text-foreground leading-tight">
                {resume.originalName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {studentName ? `Resume of ${studentName}` : 'Document Preview'}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(fileUrl, '_blank')}
              className="gap-1.5 text-xs rounded-xl"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Tab
            </Button>
            <a href={fileUrl} download={resume.originalName}>
              <Button size="sm" className="gap-1.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                <Download className="w-3.5 h-3.5" /> Download
              </Button>
            </a>
          </div>
        </DialogHeader>

        {/* Embedded Viewer Container */}
        <div className="flex-1 min-h-[60vh] mt-4 rounded-2xl overflow-hidden bg-slate-950/5 border border-border/60 flex items-center justify-center relative">
          {ext === 'pdf' ? (
            <object
              data={fileUrl}
              type="application/pdf"
              className="w-full h-full min-h-[60vh] rounded-2xl border-0"
            >
              <iframe
                src={fileUrl}
                title={resume.originalName}
                className="w-full h-full min-h-[60vh] rounded-2xl border-0"
              />
            </object>
          ) : ['png', 'jpg', 'jpeg'].includes(ext) ? (
            <div className="p-4 flex items-center justify-center w-full h-full min-h-[60vh]">
              <img
                src={fileUrl}
                alt={resume.originalName}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md border border-border/40"
              />
            </div>
          ) : ext === 'txt' ? (
            <iframe
              src={fileUrl}
              title={resume.originalName}
              className="w-full h-full min-h-[60vh] rounded-2xl border-0 bg-background p-4"
            />
          ) : (
            <div className="text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-600">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">{resume.originalName}</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Format (.{ext.toUpperCase()}) requires local viewing. Click below to download the file directly.
                </p>
              </div>
              <a href={fileUrl} download={resume.originalName}>
                <Button className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-6">
                  <Download className="w-4 h-4" /> Download File (.{ext.toUpperCase()})
                </Button>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
