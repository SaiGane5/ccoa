import { History } from 'lucide-react';

const RepoHistory = ({ history, onSelect }) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 max-w-3xl w-full">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400">
        <History size={16} />
        Recent Repositories
      </h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {history.map(repoUrl => (
          <button
            key={repoUrl}
            onClick={() => onSelect(repoUrl)}
            className="rounded-full bg-brand-gray px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-brand-light-gray hover:text-white"
          >
            {repoUrl.split('/').slice(-2).join('/')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RepoHistory;