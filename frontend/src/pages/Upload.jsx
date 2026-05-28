import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const Upload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State
  const [file, setFile] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(searchParams.get('resumeId') || '');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/resumes');
        setUserResumes(response.data);
      } catch (err) {
        console.error('Failed to fetch resumes', err);
      }
    };
    fetchResumes();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setSelectedResumeId(''); // Clear dropdown if they choose to upload a new file
    }
  };

  const handleAnalysisSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription) return;
    setLoading(true);

    try {
      let activeResumeId = selectedResumeId;

      // If they uploaded a new file instead of selecting an existing one, upload it first
      if (!activeResumeId && file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/resumes/upload', formData);
        activeResumeId = uploadRes.data.resume.id;
      }

      if (!activeResumeId) {
        alert('Please upload a document or select an existing one.');
        setLoading(false);
        return;
      }

      // Run the analysis against the active resume ID
      const response = await api.post('/analyses', {
        resumeId: activeResumeId,
        jobDescription
      });
      
      navigate(`/results/${response.data.analysis.id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Analysis processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10 animate-fade-in">
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">New Evaluation</h1>
        <p className="text-sm text-slate-500 mt-1">Cross-reference candidate profiles with job requirements.</p>
      </div>

      <form onSubmit={handleAnalysisSubmit} className="space-y-6 md:space-y-8">
        {/* Step 1: Asset Selection (Dual-Input) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Step 1: Select Target Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A: Upload New */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Upload New Document</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-5 text-center transition-all duration-200 bg-slate-50/50 relative">
                <input 
                  type="file" 
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <p className="text-sm text-slate-600 font-medium truncate px-2">
                  {file ? file.name : 'Choose PDF or DOCX file'}
                </p>
              </div>
            </div>

            {/* Option B: Use Existing */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Or Use Saved Document</label>
              <select
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  if (e.target.value) setFile(null); // Clear file input if they select from dropdown
                }}
                className="w-full px-3.5 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
              >
                <option value="">Select a saved document...</option>
                {userResumes.map(r => (
                  <option key={r.id} value={r.id}>{r.fileName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Job Description */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Step 2: Target Requirements</h2>
          <textarea
            rows={7}
            placeholder="Paste target framework parameters, technical requirements, or organizational objectives..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all duration-200"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || (!file && !selectedResumeId) || !jobDescription}
            className="w-full md:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-800 active:scale-[0.99] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? 'Executing NLP Analytics...' : 'Run Alignment Engine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;