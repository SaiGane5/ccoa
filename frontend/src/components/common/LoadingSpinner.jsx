import { Loader } from 'lucide-react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <Loader className={`animate-spin text-brand-accent ${sizeClasses[size]}`} />
  );
};

export default LoadingSpinner;