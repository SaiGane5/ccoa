export const generateSessionId = (url) => {
  return url
    .replace(/https?:\/\//, "")
    .replace(/\//g, "_")
    .replace(/\./g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
};

export const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const validateGitHubUrl = (url) => {
  const githubPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
  return githubPattern.test(url);
};
