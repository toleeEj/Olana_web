import { useState, useEffect, useCallback } from 'react';
import adminApi from '../../services/adminApi';
import FormModal from '../../components/FormModal';
import ImageUpload from '../../components/ImageUpload';
import { FileText, Upload, Link as LinkIcon, AlertCircle, Loader } from 'lucide-react';

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/core/resumes/');
      if (res.data.results?.length > 0) {
        const mainResume = res.data.results[0];
        setResume(mainResume);
        setExternalUrl(mainResume.external_url || '');
      }
    } catch (err) {
      setError('Failed to load resume');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!pdfFile && !externalUrl?.trim()) {
      alert('Please upload a PDF or provide an external URL');
      return;
    }

    setSubmitting(true);
    const payload = new FormData();
    if (pdfFile) payload.append('pdf_file', pdfFile);
    if (externalUrl?.trim()) payload.append('external_url', externalUrl.trim());

    try {
      let res;
      if (resume?.id) {
        res = await adminApi.patch(`/core/resumes/${resume.id}/`, payload);
      } else {
        res = await adminApi.post('/core/resumes/', payload);
      }
      setResume(res.data);
      setModalOpen(false);
      setPdfFile(null);
    } catch (err) {
      alert('Failed to save resume');
    } finally {
      setSubmitting(false);
    }
  }, [resume, externalUrl, pdfFile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size={32} className="animate-spin text-[#1B4D3E]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FEF2F2] border border-[#E8A87A] text-[#1B4D3E] p-6 rounded-xl flex items-center gap-3">
        <AlertCircle size={20} className="text-[#E8A87A]" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1B4D3E] flex items-center gap-2">
          <FileText size={24} className="text-[#7ABF8E]" />
          Resume / CV
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] transition-colors"
        >
          <Upload size={16} />
          {resume ? 'Update' : 'Upload'}
        </button>
      </div>

      {resume ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="p-6 border-b bg-[#F8FAF5]">
            <h2 className="text-lg font-semibold text-[#1B4D3E] mb-4">Current Resume</h2>
            <div className="space-y-3">
              {resume.pdf_file && (
                <a
                  href={resume.pdf_file}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 text-[#7ABF8E] hover:text-[#1B4D3E] transition-colors"
                >
                  <FileText size={18} /> View PDF Resume
                </a>
              )}
              {resume.external_url && (
                <a
                  href={resume.external_url}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 text-[#7ABF8E] hover:text-[#1B4D3E] transition-colors break-all"
                >
                  <LinkIcon size={18} /> {resume.external_url}
                </a>
              )}
              <p className="text-xs text-[#5B6E6B] mt-2">
                Last updated: {new Date(resume.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#F8FAF5] border border-[#E2E8F0] p-8 rounded-xl text-center">
          <FileText size={48} className="mx-auto mb-3 text-[#7ABF8E] opacity-50" />
          <h2 className="text-lg font-semibold text-[#1B4D3E] mb-1">No Resume Found</h2>
          <p className="text-sm text-[#5B6E6B] mb-4">Upload a PDF or add an external link</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52]"
          >
            Upload Resume
          </button>
        </div>
      )}

      <FormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPdfFile(null);
        }}
        title={resume ? 'Update Resume' : 'Upload Resume'}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        submitText={resume ? 'Update' : 'Upload'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1B4D3E] mb-2">PDF Resume</label>
            <ImageUpload
              label="Choose PDF file"
              existingImage={null}
              onUploadComplete={setPdfFile}
              accept=".pdf"
            />
            {pdfFile && (
              <p className="mt-2 text-xs text-[#7ABF8E]">
                Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#5B6E6B]">OR</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B4D3E] mb-1">External URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6E6B]" size={16} />
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="w-full pl-9 p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E] focus:border-transparent"
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}