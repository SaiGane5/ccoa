import { useState } from 'react';
import { Github, Search } from 'lucide-react';

const RepoInput = ({ onSubmit, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onSubmit(repoUrl.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 rounded-lg bg-brand-gray p-2 border border-brand-light-gray focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/50 transition-all">
      <Github className="text-gray-400 ml-2" />
      <input
        type="text"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Paste a public GitHub repository URL..."
        className="w-full bg-transparent p-2 text-gray-200 placeholder-gray-500 focus:outline-none"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="flex items-center gap-2 rounded-md bg-brand-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-500"
        disabled={isLoading}
      >
        <Search size={18} />
        Analyze
      </button>
    </form>
  );
};

export default RepoInput;