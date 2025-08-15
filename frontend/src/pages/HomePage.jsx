import RepoInput from '../components/common/RepoInput';
import RepoHistory from '../components/history/RepoHistory';
import PageWrapper from '../components/layout/PageWrapper';
import { useRepoHistory } from '../hooks/useRepoHistory';

const HomePage = ({ onAnalyze, onSelectHistory, isLoading }) => {
  const { history } = useRepoHistory();

  return (
    <PageWrapper>
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Codebase Onboarding, Perfected.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          Paste a public repository URL to generate a personalized learning path, get starter tasks, and start a Q&A session with an AI assistant.
        </p>
      </div>

      <div className="mt-10 w-full max-w-3xl">
        <RepoInput onSubmit={onAnalyze} isLoading={isLoading} />
      </div>

      <RepoHistory history={history} onSelect={onSelectHistory} />
    </PageWrapper>
  );
};

export default HomePage;