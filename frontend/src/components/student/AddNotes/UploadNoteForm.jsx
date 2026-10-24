import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  UploadCloud,
  FileText,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileUp,
  Globe,
  Lock,
  BookOpen,
  Calendar,
  Layers,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { noteApi } from '../../../services/noteApi';
import {
  setCurrentStep,
  setIsCompleted
} from '../../../store/slices/courseSlice';

export const UploadNoteForm = () => {
  const dispatch = useDispatch();
  const {
    selectedCourse,
    selectedSemester,
    selectedSubject
  } = useSelector((state) => state.course);

  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrlInput, setFileUrlInput] = useState('');
  const [useFileUrl, setUseFileUrl] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organizationType: 'GENERAL', // 'UNIT', 'GENERAL'
    unitName: '',
    visibility: 'PUBLIC', // 'PUBLIC', 'PRIVATE'
    tags: '',
  });

  const fileInputRef = useRef(null);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate 50MB limit
    if (selected.size > 50 * 1024 * 1024) {
      toast.error('File size cannot exceed 50MB');
      return;
    }

    setFile(selected);

    // Auto-fill note title from file name if empty
    if (!formData.title.trim()) {
      const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, '');
      setFormData((prev) => ({
        ...prev,
        title: nameWithoutExt,
      }));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse?._id || !selectedSemester?._id || !selectedSubject?._id) {
      toast.error('Curriculum hierarchy missing. Please select course, semester, and subject.');
      dispatch(setCurrentStep(3));
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Note title is required');
      return;
    }

    if (!file && (!useFileUrl || !fileUrlInput.trim())) {
      toast.error('Please choose a file to upload or enter a file URL');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('course', selectedCourse._id);
      submitData.append('semester', selectedSemester._id);
      submitData.append('subject', selectedSubject._id);
      submitData.append('organizationType', formData.organizationType);
      submitData.append('visibility', formData.visibility);



      if (formData.organizationType === 'UNIT' && formData.unitName.trim()) {
        submitData.append('unitName', formData.unitName.trim());
      }

      if (formData.tags.trim()) {
        submitData.append('tags', formData.tags.trim());
      }

      if (file) {
        submitData.append('file', file);
      } else if (fileUrlInput.trim()) {
        submitData.append('fileUrl', fileUrlInput.trim());
      }

      const res = await noteApi.createNote(submitData);
      if (res && res.success) {
        toast.success(res.message || 'Note uploaded successfully!');
        dispatch(setIsCompleted(true));
      } else {
        throw new Error(res?.message || 'Failed to upload note');
      }
    } catch (err) {
      toast.error(err.message || 'Error uploading note. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Guard: If parent hierarchy missing
  if (!selectedCourse || !selectedSemester || !selectedSubject) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center space-y-4 shadow-xs">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Curriculum Incomplete</h3>
          <p className="text-xs text-slate-500">
            Please select Course, Semester, and Subject before uploading notes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(setCurrentStep(3))}
          className="px-5 py-2 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Step 3: Subject</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 space-y-4">
      {/* Header */}
      <div className="pb-5 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Upload Notes for {selectedSubject.name}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload PDF lecture notes, handwritten scans, summaries, or past questions.
        </p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document File Upload Drop Area */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Note Document <span className="text-rose-500">*</span>
          </label>

          {!useFileUrl ? (
            <div>
              {!file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-[var(--primary)] bg-slate-50 hover:bg-[var(--primary-light)]/20 p-6 sm:p-8 text-center cursor-pointer transition-all space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[var(--primary)] mx-auto flex items-center justify-center shadow-xs">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Click to browse or drag and drop your note document
                    </p>
                    <p className="text-xs text-slate-500">
                      Supports PDF, DOC, DOCX, PNG, JPG (up to 50MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for upload
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Remove File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => setUseFileUrl(true)}
                  className="text-xs text-[var(--primary)] hover:underline cursor-pointer"
                >
                  Or enter document URL link instead
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="url"
                value={fileUrlInput}
                onChange={(e) => setFileUrlInput(e.target.value)}
                placeholder="https://example.com/document.pdf or Cloudinary URL"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setUseFileUrl(false)}
                  className="text-xs text-[var(--primary)] hover:underline cursor-pointer"
                >
                  Switch back to local file upload
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Note Metadata Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Note Title */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Note Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Complete Unit 1 Handwritten Lecture Notes"
              maxLength={200}
              required
              className="w-full px-4 py-2.5 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
            />
          </div>

          {/* Organization Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Organization Structure
            </label>
            <select
              name="organizationType"
              value={formData.organizationType}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all cursor-pointer"
            >
              <option value="GENERAL">General / Entire Subject</option>
              <option value="UNIT">Unit / Module Specific</option>
            </select>
          </div>

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Visibility & Privacy
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all cursor-pointer"
            >
              <option value="PUBLIC">Public — Accessible to all students</option>
              <option value="PRIVATE">Private — Only visible to me</option>
            </select>
          </div>

          {/* Conditional: Unit Name if UNIT chosen */}
          {formData.organizationType === 'UNIT' && (
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Unit / Module Name
              </label>
              <input
                type="text"
                name="unitName"
                value={formData.unitName}
                onChange={handleInputChange}
                placeholder="e.g. Unit 1: Introduction to Data Structures"
                className="w-full px-4 py-2.5 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Description(Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Summary of lecture notes, key revision topics, tips for exams..."
              className="w-full px-4 py-2.5 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Search Tags (Comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g. exam, formula-sheet, midterm, handwritten"
              className="w-full px-4 py-2.5 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={() => dispatch(setCurrentStep(3))}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Subject</span>
          </button>

          <button
            type="submit"
            disabled={submitting || (!file && !fileUrlInput.trim()) || !formData.title.trim()}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Note...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload & Finish</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadNoteForm;
