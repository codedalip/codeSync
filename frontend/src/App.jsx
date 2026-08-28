import React, { useState, useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useWorkspaceStore } from './stores/useWorkspaceStore';
import LandingPage from './components/landing/LandingPage';
import WorkspaceDashboard from './components/workspace/WorkspaceDashboard';
import IDELayout from './components/ide/IDELayout';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { joinWorkspace } = useWorkspaceStore();

  // Helper to read initial workspace ID from URL or localStorage
  const getInitialWorkspaceId = () => {
    const params = new URLSearchParams(window.location.search);
    const urlWsId = params.get('workspace');
    if (urlWsId) return urlWsId;
    return localStorage.getItem('activeWorkspaceId') || null;
  };

  // Helper to read initial view from sessionStorage (persists across F5 reloads)
  const getInitialView = () => {
    const savedView = sessionStorage.getItem('currentView');
    const wsId = getInitialWorkspaceId();
    if (savedView === 'ide' && !wsId) {
      return 'dashboard';
    }
    if (savedView) return savedView;
    const params = new URLSearchParams(window.location.search);
    if (params.get('workspace')) return 'ide';
    return 'landing';
  };

  const [activeWorkspaceId, setActiveWorkspaceId] = useState(getInitialWorkspaceId);
  const [currentView, setCurrentViewRaw] = useState(getInitialView);

  const setCurrentView = (view) => {
    sessionStorage.setItem('currentView', view);
    setCurrentViewRaw(view);
  };

  // Update URL & LocalStorage whenever active workspace changes
  const updateActiveWorkspace = (wsId) => {
    setActiveWorkspaceId(wsId);
    if (wsId) {
      localStorage.setItem('activeWorkspaceId', wsId);
      const newUrl = `${window.location.pathname}?workspace=${wsId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else {
      localStorage.removeItem('activeWorkspaceId');
      window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
    }
  };

  // Keep view state valid
  useEffect(() => {
    if (isAuthenticated) {
      if (currentView === 'ide' && !activeWorkspaceId) {
        setCurrentView('dashboard');
      }
    } else {
      updateActiveWorkspace(null);
      sessionStorage.removeItem('currentView');
      setCurrentViewRaw('landing');
    }
  }, [isAuthenticated, activeWorkspaceId, currentView]);

  const handleJoinWorkspaceFromLanding = async (code) => {
    if (!isAuthenticated) {
      alert('Please sign in or register to join the workspace.');
      return;
    }
    const res = await joinWorkspace(code);
    if (res.success && res.workspace) {
      updateActiveWorkspace(res.workspace._id);
      setCurrentView('ide');
    } else {
      alert(res.error || 'Invalid or expired workspace join code.');
    }
  };

  // 1. If user is logged in and explicitly in IDE view with an active workspace
  if (isAuthenticated && currentView === 'ide' && activeWorkspaceId) {
    return (
      <IDELayout
        workspaceId={activeWorkspaceId}
        onBackToDashboard={() => {
          setCurrentView('dashboard');
        }}
        onGoToHome={() => {
          setCurrentView('landing');
        }}
      />
    );
  }

  // 2. If user is logged in and on Dashboard view
  if (isAuthenticated && currentView === 'dashboard') {
    return (
      <WorkspaceDashboard
        onSelectWorkspace={(wsId) => {
          updateActiveWorkspace(wsId);
          setCurrentView('ide');
        }}
        onGoToHome={() => {
          setCurrentView('landing');
        }}
      />
    );
  }

  // 3. Default: Landing Page View (accessible logged in or out!)
  return (
    <LandingPage
      activeWorkspaceId={activeWorkspaceId}
      onGetStarted={() => setCurrentView(activeWorkspaceId ? 'ide' : 'dashboard')}
      onGoToDashboard={() => setCurrentView('dashboard')}
      onGoToIDE={() => setCurrentView('ide')}
      onJoinWorkspace={handleJoinWorkspaceFromLanding}
    />
  );
}

export default App;
