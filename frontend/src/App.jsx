import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { onboardRepository, generateSessionId } from './api/ccoaApi';
import { useRepoHistory } from './hooks/useRepoHistory';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'loading' | 'dashboard'
  const [onboardingData, setOnboardingData] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const { addRepoToHistory } = useRepoHistory();

  const handleAnalyze = async (repoUrl) => {
    setCurrentView('loading');
    
    const loadingToast = toast.loading(`Onboarding ${repoUrl.split('/').slice(-2).join('/')}...`);

    try {
      const response = await onboardRepository(repoUrl);
      setOnboardingData(response.data);
      setSessionId(generateSessionId(repoUrl));
      addRepoToHistory(repoUrl);
      setCurrentView('dashboard');
      toast.success('Repository onboarded successfully!', { id: loadingToast });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "An unexpected error occurred.";
      toast.error(errorMessage, { id: loadingToast });
      setCurrentView('home');
    }
  };

  const handleSelectHistory = (repoUrl) => {
    // For now, re-analyzing is the simplest flow.
    // A future improvement could be to cache results.
    handleAnalyze(repoUrl);
  };
  
  const goToHome = () => {
    setCurrentView('home');
    setOnboardingData(null);
    setSessionId('');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center mt-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-300">Analyzing repository... this may take a moment.</p>
          </div>
        );
      case 'dashboard':
        return <DashboardPage onboardingData={onboardingData} sessionId={sessionId} />;
      case 'home':
      default:
        return (
          <HomePage
            onAnalyze={handleAnalyze}
            onSelectHistory={handleSelectHistory}
            isLoading={currentView === 'loading'}
          />
        );
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#3A3A3C',
            color: '#E5E5E7',
          },
        }}
      />
      <div className="flex h-screen flex-col">
        <Header onHomeClick={goToHome} />
        <main className="flex-grow overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </>
  );
}

export default App;