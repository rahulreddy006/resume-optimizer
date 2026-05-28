import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ScoreCircle from '../components/ui/ScoreCircle';
import KeywordChip from '../components/ui/KeywordChip';

const Results = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await api.get(`/analyses/${id}`);
        setAnalysis(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysisData();
  }, [id]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-20 text-center text-slate-500 animate-pulse">Loading intelligence report...</div>;
  if (!analysis) return <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-20 text-center text-slate-500">Report not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10 animate-fade-in space-y-6 md:space-y-8">
      
      {/* Header with Circle Component */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6">
        <div className="w-full min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight break-words">Evaluation Report</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-2 truncate w-full">
            Target Reference: {analysis.jobDescription}
          </p>
        </div>
        <div className="w-full md:w-auto flex justify-center md:justify-end shrink-0">
          <ScoreCircle score={analysis.score} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Keyword Columns Component */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Matched Criteria ({analysis.matchedKeywords.length})</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedKeywords.length > 0 ? (
                analysis.matchedKeywords.map((kw, i) => <KeywordChip key={i} word={kw} type="matched" />)
              ) : (
                <p className="text-xs text-slate-400">No direct skill intersections found.</p>
              )}
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Missing Requirements ({analysis.missingKeywords.length})</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.length > 0 ? (
                analysis.missingKeywords.map((kw, i) => <KeywordChip key={i} word={kw} type="missing" />)
              ) : (
                <p className="text-xs text-slate-400">All required terms identified.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Section Checklist Array */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Structure Verification</h2>
            <ul className="space-y-3">
              {Object.entries(analysis.sectionFeedback || {}).map(([key, isPresent]) => (
                <li key={key} className="flex items-center text-sm">
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full mr-3 text-white text-xs font-bold shrink-0 ${isPresent ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {isPresent ? '✓' : '×'}
                  </span>
                  <span className="text-slate-700 capitalize truncate">{key.replace('has', '')} Identifier</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Corrective Action List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-md">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4">Actionable Directives</h2>
            {analysis.suggestions.length === 0 ? (
              <p className="text-sm text-slate-400">Profile matches structural optimization standards.</p>
            ) : (
              <ul className="space-y-4">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start">
                    <span className="text-indigo-400 mr-2 mt-0.5 shrink-0">•</span>
                    <span className="break-words">{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center md:justify-end pt-4">
        <Link to="/dashboard" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          &larr; Return to Overview
        </Link>
      </div>
    </div>
  );
};

export default Results;