const KeywordChip = ({ word, type }) => {
  const isMatched = type === 'matched';
  
  return (
    <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 ${
      isMatched 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    }`}>
      {word}
    </span>
  );
};

export default KeywordChip;