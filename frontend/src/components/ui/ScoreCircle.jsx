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
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="stroke-slate-100"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={`${getColor()} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-slate-900">
        <span className="text-3xl font-extrabold tracking-tighter">{score}</span>
      </div>
    </div>
  );
};

export default ScoreCircle;