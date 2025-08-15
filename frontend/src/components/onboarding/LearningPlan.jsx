import { FileCode, Target, BookOpen, Youtube, Book, Search, ChevronRight } from 'lucide-react';

/**
 * A helper component to render an appropriate icon based on the resource type.
 * @param {{type: string}} props
 */
const ResourceIcon = ({ type }) => {
  switch (type.toLowerCase()) {
    case 'youtube':
      return <Youtube size={16} className="text-red-500 flex-shrink-0 mt-0.5" />;
    case 'blog':
      return <Book size={16} className="text-green-500 flex-shrink-0 mt-0.5" />;
    case 'official docs':
      return <FileCode size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />;
    default:
      return <Search size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />;
  }
};

const LearningPlan = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="rounded-lg bg-brand-gray p-6 border border-brand-light-gray">
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
        <BookOpen className="text-brand-accent"/> Onboarding Plan
      </h2>
      <div className="space-y-4">
        {data.learning_path.map(step => (
          <div key={step.step} className="rounded-md border border-brand-light-gray bg-brand-dark p-4">
            <h3 className="flex items-center text-lg font-bold">
              <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-sm flex-shrink-0">{step.step}</span>
              {step.title}
            </h3>
            <p className="mt-2 text-gray-400">{step.description}</p>
            
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-gray-300">Files to Review:</p>
              <ul className="space-y-1 text-sm text-gray-300">
                {step.files_to_review.map(file => (
                  <li key={file} className="flex items-center gap-2">
                    <FileCode size={16} className="text-gray-500"/> {file}
                  </li>
                ))}
              </ul>
            </div>

            {/* Render the external resources section if it exists */}
            {step.external_resources && step.external_resources.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-gray-300">Suggested Learning:</p>
                <ul className="space-y-1.5 text-sm text-gray-300">
                  {step.external_resources.map((res, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ResourceIcon type={res.type} />
                      <span>{res.suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="mb-6 mt-10 flex items-center gap-3 text-2xl font-bold">
        <Target className="text-brand-accent"/> Starter Tasks
      </h2>
      <div className="space-y-4">
        {data.starter_tasks.map(task => (
          <div key={task.title} className="rounded-md border border-brand-light-gray bg-brand-dark p-4">
            <h3 className="font-bold text-lg">{task.title}</h3>
            <p className="mt-2 text-gray-400">{task.description}</p>
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-gray-300">Suggested Files:</p>
              <ul className="space-y-1 text-sm text-gray-300">
                {task.suggested_files.map(file => (
                   <li key={file} className="flex items-center gap-2">
                     <ChevronRight size={16} className="text-brand-accent"/> {file}
                   </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPlan;