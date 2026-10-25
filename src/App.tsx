import React from 'react';
import MainDashboard from './components/MainDashboard';

function App() {
  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* This renders your real gamified coin-mining panel interface */}
      <MainDashboard />
    </div>
  );
}

export default App;
