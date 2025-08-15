import { Github } from 'lucide-react';

const Header = ({ onHomeClick }) => {
  return (
    <header className="flex w-full items-center justify-between p-4 border-b border-brand-light-gray">
      <button onClick={onHomeClick} className="flex items-center gap-2 text-xl font-bold transition-opacity hover:opacity-80">
        <span className="rounded-lg bg-brand-accent p-1.5"></span>
        CCOA
      </button>
      <a
        href="https://github.com/SaiGane5/ccoa.git" // Replace with your actual repo link
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
      >
        <Github size={20} />
        View on GitHub
      </a>
    </header>
  );
};

export default Header;