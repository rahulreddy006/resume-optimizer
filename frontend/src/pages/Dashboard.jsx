import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analysesLoading, setAnalysesLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/resumes');
        setResumes(response.data);
      } catch (err) {
        console.error('Error fetching system data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    if (window.confirm('Confirm permanent deletion of this asset?')) {
      try {
        await api.delete(`/resumes/${id}`);
        setResumes(resumes.filter(r => r.id !== id));
        if (selectedResumeId === id) setSelectedResumeId(null);
      } catch (err) {
        alert('Action could not be executed.');
      }
    }
  };

  const loadAnalyses = async (resumeId) => {
    if (selectedResumeId === resumeId) {
      setSelectedResumeId(null); 
      return;
    }
    setSelectedResumeId(resumeId);
    setAnalysesLoading(true);
    try {
      const response = await api.get(`/analyses/resume/${resumeId}`);
      setAnalyses(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalysesLoading(false);
    }
  };

  return (
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 animate-fade-in">
      
      {/* MOBILE FIX 1: Stack header on small screens, side-by-side on large screens */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Enterprise Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Manage documents and historical evaluations.</p>
        </div>
        <Link 
          to="/upload"
          className="w-full sm:w-auto text-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all"
        >
          Upload New Resume
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
        </div>
      ) : resumes.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 sm:p-16 text-center">
          <p className="text-sm text-slate-500">No records found. Upload a resume to begin.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div 
                onClick={() => loadAnalyses(resume.id)}
                className="flex justify-between items-center p-4 sm:p-6 cursor-pointer hover:bg-slate-50 transition-colors gap-4"
              >
                {/* MOBILE FIX 2: min-w-0 allows the flex child to shrink, truncate adds the "..." */}
                <div className="min-w-0 flex-1">
                  <h3 
                    className="text-slate-900 font-semibold truncate" 
                    title={resume.fileName} /* Shows full name on hover */
                  >
                    {resume.fileName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                
                {/* shrink-0 prevents the delete button from being squished by long filenames */}
                <button
                  onClick={(e) => handleDelete(resume.id, e)}
                  className="shrink-0 text-slate-400 hover:text-red-600 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>

              {/* Collapsible Analyses Section */}
              {selectedResumeId === resume.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-6">
                  {/* UPDATE: Added flex container and "Run New Analysis" shortcut button */}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Historical Analyses</h4>
                    <Link 
                      to={`/upload?resumeId=${resume.id}`} 
                      className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 transition-colors"
                    >
                      + Run New Analysis
                    </Link>
                  </div>
                  
                  {analysesLoading ? (
                    <p className="text-sm text-slate-400">Loading records...</p>
                  ) : analyses.length === 0 ? (
                    <p className="text-sm text-slate-400">No analyses run for this document yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {analyses.map(analysis => (
                        // ... keep the rest of your mapping code exactly the same
                        <div key={analysis.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                          <div>
                            <p className="text-2xl font-bold text-slate-900">{analysis.score}%</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(analysis.createdAt).toLocaleDateString()}</p>
                          </div>
                          <button 
                            onClick={() => navigate(`/results/${analysis.id}`)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline shrink-0"
                          >
                            View Full Report
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;