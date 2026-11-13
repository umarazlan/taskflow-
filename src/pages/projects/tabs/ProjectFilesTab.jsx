import React, { useState } from 'react';
import { Card, Button, Badge, notify } from '../../../components/ui';
import { UploadCloud, FileText, Image as ImageIcon, FileCode, Download, Trash2 } from 'lucide-react';

const INITIAL_FILES = [
  { id: 'f-1', name: 'Design_System_Specification_v2.pdf', size: '2.4 MB', type: 'pdf', uploadedBy: 'Emily Zhang', date: 'Nov 10' },
  { id: 'f-2', name: 'Architecture_Diagram_Microservices.png', size: '1.8 MB', type: 'image', uploadedBy: 'Marcus Johnson', date: 'Nov 08' },
  { id: 'f-3', name: 'OpenAPI_Schema_v2.4.yaml', size: '340 KB', type: 'code', uploadedBy: 'Alex Morgan', date: 'Nov 02' },
];

export function ProjectFilesTab() {
  const [files, setFiles] = useState(INITIAL_FILES);

  const handleMockUpload = (e) => {
    e.preventDefault();
    const mockFile = {
      id: `f-${Date.now()}`,
      name: `Sprint_Deliverables_Export_${Date.now().toString().slice(-4)}.pdf`,
      size: '1.2 MB',
      type: 'pdf',
      uploadedBy: 'Alex Morgan',
      date: 'Just now',
    };
    setFiles([mockFile, ...files]);
    notify.success('File uploaded successfully!');
  };

  const handleDeleteFile = (id) => {
    setFiles(files.filter((f) => f.id !== id));
    notify.info('File removed');
  };

  return (
    <div className="space-y-6">
      {/* Upload Dropzone */}
      <div
        onClick={handleMockUpload}
        className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white dark:bg-slate-900 group"
      >
        <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/70 dark:text-brand-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <UploadCloud className="h-6 w-6" />
        </div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Click or drag files here to upload to this project
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Supports PDF, PNG, JPG, Figma, ZIP up to 25MB
        </p>
      </div>

      {/* Uploaded Files Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Project Attachments ({files.length})
          </h4>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                  {file.type === 'image' ? <ImageIcon className="h-4 w-4" /> : file.type === 'code' ? <FileCode className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {file.size} &bull; Uploaded by {file.uploadedBy} on {file.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => notify.success(`Downloading ${file.name}...`)}
                  leftIcon={Download}
                >
                  Download
                </Button>
                <button
                  type="button"
                  onClick={() => handleDeleteFile(file.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
