import React, {useState} from 'react';
import {LinearProgress} from '@material-ui/core';
import {ProgressContext} from './context/ProgressContext';
import WorkBench from './components/WorkBench';
import Header from './components/Header';
import JobProvider from './context/JobProvider';
import GcodeProvider from './context/GcodeProvider';
import './App.css';

function App() {
  const [progress, setProgress] = useState(false)
  
  return (
    <JobProvider>
      <GcodeProvider>
        <ProgressContext.Provider value={{active: progress, setProgress}}>
          <div className={`App ${progress ? 'busy' : ''}`}>
            <Header />
            {progress && (
              <LinearProgress />
            )}
            <WorkBench />
          </div>
        </ProgressContext.Provider>
      </GcodeProvider>
    </JobProvider>
  );
}

export default App;
