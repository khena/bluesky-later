import { useEffect, useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { PostScheduler } from "./components/PostScheduler";
import { ScheduledPosts } from "./components/ScheduledPosts";
import { getStoredCredentials, checkScheduledPosts } from "./lib/bluesky";
import { Toaster } from "react-hot-toast";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const creds = await getStoredCredentials();
      setIsAuthenticated(!!creds);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(checkScheduledPosts, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm onSuccess={() => setIsAuthenticated(true)} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            BlueSky Post Scheduler
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PostScheduler />
          <ScheduledPosts />
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
