import ChatWindow from '../components/chat/ChatWindow';
import LearningPlan from '../components/onboarding/LearningPlan';

const DashboardPage = ({ onboardingData, sessionId }) => {
  return (
    // ~ Modified the grid layout to create a fixed-height, two-column view
    <div className="grid h-[calc(100vh-100px)] w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:grid-rows-1">
      {/* + This outer div allows the inner content to scroll */}
      <div className="overflow-y-auto">
        <LearningPlan data={onboardingData} />
      </div>
      {/* + This div will hold the chat window and keep it sticky within its column */}
      <div className="relative h-full">
        <div className="absolute inset-0">
          <ChatWindow sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;