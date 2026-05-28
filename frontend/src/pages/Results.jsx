// import { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import api from '../api/axios';
// import ScoreCircle from '../components/ui/ScoreCircle';
// import KeywordChip from '../components/ui/KeywordChip';

// const Results = () => {
//   const { id } = useParams();
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAnalysisData = async () => {
//       try {
//         const response = await api.get(`/analyses/${id}`);
//         setAnalysis(response.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAnalysisData();
//   }, [id]);

//   if (loading) return <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-20 text-center text-slate-500 animate-pulse">Loading intelligence report...</div>;
//   if (!analysis) return <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-20 text-center text-slate-500">Report not found.</div>;

//   return (
//     <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10 animate-fade-in space-y-6 md:space-y-8">
      
//       {/* Header with Circle Component */}
//       <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6">
//         <div className="w-full min-w-0">
//           <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight break-words">Evaluation Report</h1>
//           <p className="text-xs md:text-sm text-slate-500 mt-2 truncate w-full">
//             Target Reference: {analysis.jobDescription}
//           </p>
//         </div>
//         <div className="w-full md:w-auto flex justify-center md:justify-end shrink-0">
//           <ScoreCircle score={analysis.score} />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
//         {/* Keyword Columns Component */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm space-y-6">
//           <div>
//             <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Matched Criteria ({analysis.matchedKeywords.length})</h2>
//             <div className="flex flex-wrap gap-2">
//               {analysis.matchedKeywords.length > 0 ? (
//                 analysis.matchedKeywords.map((kw, i) => <KeywordChip key={i} word={kw} type="matched" />)
//               ) : (
//                 <p className="text-xs text-slate-400">No direct skill intersections found.</p>
//               )}
//             </div>
//           </div>
          
//           <div className="border-t border-slate-100 pt-6">
//             <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Missing Requirements ({analysis.missingKeywords.length})</h2>
//             <div className="flex flex-wrap gap-2">
//               {analysis.missingKeywords.length > 0 ? (
//                 analysis.missingKeywords.map((kw, i) => <KeywordChip key={i} word={kw} type="missing" />)
//               ) : (
//                 <p className="text-xs text-slate-400">All required terms identified.</p>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6 md:space-y-8">
//           {/* Section Checklist Array */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm">
//             <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Structure Verification</h2>
//             <ul className="space-y-3">
//               {Object.entries(analysis.sectionFeedback || {}).map(([key, isPresent]) => (
//                 <li key={key} className="flex items-center text-sm">
//                   <span className={`flex items-center justify-center w-5 h-5 rounded-full mr-3 text-white text-xs font-bold shrink-0 ${isPresent ? 'bg-emerald-500' : 'bg-red-500'}`}>
//                     {isPresent ? '✓' : '×'}
//                   </span>
//                   <span className="text-slate-700 capitalize truncate">{key.replace('has', '')} Identifier</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Corrective Action List */}
//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-md">
//             <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4">Actionable Directives</h2>
//             {analysis.suggestions.length === 0 ? (
//               <p className="text-sm text-slate-400">Profile matches structural optimization standards.</p>
//             ) : (
//               <ul className="space-y-4">
//                 {analysis.suggestions.map((s, i) => (
//                   <li key={i} className="text-sm text-slate-300 flex items-start">
//                     <span className="text-indigo-400 mr-2 mt-0.5 shrink-0">•</span>
//                     <span className="break-words">{s}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div className="flex justify-center md:justify-end pt-4">
//         <Link to="/dashboard" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
//           &larr; Return to Overview
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Results;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

// Simplified internal ScoreCircle
const ScoreCircle = ({ score }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const getColor = () => {
    if (score >= 75) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };
  return (
    <div className="relative flex items-center justify-center w-28 h-28 md:w-32 md:h-32 shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} className="stroke-slate-100" strokeWidth="8" fill="transparent" />
        <circle cx="50" cy="50" r={radius} className={`${getColor()} transition-all duration-1000 ease-out`} strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-slate-900">
        <span className="text-3xl md:text-4xl font-extrabold tracking-tighter">{score}%</span>
        <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Rating</span>
      </div>
    </div>
  );
};

// Simplified internal KeywordChip
const KeywordChip = ({ word, type }) => (
  <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
    type === 'matched' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
  }`}>
    {word}
  </span>
);

const Results = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // NEW: State for Tabs and Copy function
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' or 'coverLetter'
  const [copied, setCopied] = useState(false);

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

  const handleCopyLetter = () => {
    if (analysis?.coverLetter) {
      navigator.clipboard.writeText(analysis.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 md:px-6 py-20 text-center text-slate-500 animate-pulse">Compiling analytical verification datasets...</div>;
  if (!analysis) return <div className="max-w-5xl mx-auto px-4 md:px-6 py-20 text-center text-slate-500">Report not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 animate-fade-in space-y-6 md:space-y-8">
      
      {/* Header with Circle Component */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-indigo-600"></div>
        <div className="min-w-0 flex-1 w-full text-center md:text-left">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
            NLP Analysis Report (v2.0)
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-3 break-words">
            Evaluation Report
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-lg truncate mx-auto md:mx-0">System UUID: {analysis.id}</p>
        </div>
        <div className="flex md:border-l md:border-slate-100 md:pl-8">
          <ScoreCircle score={analysis.score} />
        </div>
      </div>

      {/* NEW: Tab Navigation */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'metrics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Analytics Matrix
        </button>
        <button
          onClick={() => setActiveTab('coverLetter')}
          className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'coverLetter' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          AI Cover Letter
        </button>
      </div>

      {/* TAB CONTENT: Metrics */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-fade-in">
          {/* Keyword Metric Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-8 shadow-sm space-y-6 lg:col-span-1">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Structured Keyword Verification Matrix</h2>
            <div className="space-y-6 divide-y divide-slate-100">
              <div>
                <h3 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">
                  Matched Technical Assets ({analysis.matchedKeywords?.length})
                </h3>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {analysis.matchedKeywords?.length > 0 ? (
                    analysis.matchedKeywords?.map((kw, i) => <KeywordChip key={i} word={kw} type="matched" />)
                  ) : (
                    <p className="text-xs text-slate-400 italic">No direct intersection identified.</p>
                  )}
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">
                  Missing Attributes ({analysis.missingKeywords?.length})
                </h3>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {analysis.missingKeywords?.length > 0 ? (
                    analysis.missingKeywords?.map((kw, i) => <KeywordChip key={i} word={kw} type="missing" />)
                  ) : (
                    <p className="text-xs text-slate-400 italic">All target criteria met.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stack Checklist and Suggestions */}
          <div className="space-y-6 md:space-y-8 lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-8 shadow-sm">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 mb-2">Section Completeness Checks</h2>
              <div className="divide-y divide-slate-100 text-sm">
                {Object.entries(analysis.sectionFeedback || {}).map(([key, value]) => (
                  <div key={key} className="py-3.5 flex justify-between items-center gap-2">
                    <span className="text-slate-600 capitalize truncate">{key.replace('has', '')} Block Identifier</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${value ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {value ? 'Verified' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 shadow-md">
              <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">Optimized Adjustments Directive</h2>
              {analysis.suggestions?.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Document features perfect structural indexing and alignment.</p>
              ) : (
                <ul className="space-y-4">
                  {analysis.suggestions?.map((suggestion, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start">
                      <span className="text-indigo-400 mr-2.5 mt-0.5 shrink-0">•</span> 
                      <span className="break-words">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW TAB CONTENT: Cover Letter */}
      {activeTab === 'coverLetter' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm animate-fade-in relative">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Generated Cover Letter</h2>
            <button 
              onClick={handleCopyLetter}
              className="text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          
          {/* whitespace-pre-wrap ensures the line breaks from Gemini render correctly */}
          {analysis.coverLetter ? (
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-serif">
              {analysis.coverLetter}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No cover letter was generated for this analysis.</p>
          )}
        </div>
      )}
      
      <div className="flex justify-center pt-6">
        <Link to="/dashboard" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          &larr; Return to Enterprise Overview
        </Link>
      </div>
    </div>
  );
};

export default Results;