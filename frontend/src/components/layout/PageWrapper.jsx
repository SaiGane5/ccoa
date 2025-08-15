const PageWrapper = ({ children }) => {
  return (
    <div className="container mx-auto flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
};

export default PageWrapper;