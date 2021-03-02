import React, {useState} from 'react';
import {LinearProgress} from '@material-ui/core';
import './App.css';
import {GcodeContext, initial, SVGLayer} from './context/GcodeContext';
import {ProgressContext} from './context/ProgressContext';
import { WorkBench } from './components/WorkBench';
import Header from './components/Header';



function App() {

  const [gcodeValue, setGcodeValue] = useState(initial);
  const [progress, setProgress] = useState(false)

  const update = (changeset: any) => setGcodeValue({...gcodeValue, ...changeset})

  const setFileData = (fileData: string) => setGcodeValue({...gcodeValue, fileData});

  const setGcode = (currentGcode: string) => setGcodeValue({...gcodeValue, currentGcode})

  const setLayers = (layers: SVGLayer[]) => setGcodeValue({...gcodeValue, layers})

  return (
    <GcodeContext.Provider value={{...gcodeValue, setFileData, setGcode, setLayers, update}}>
      <ProgressContext.Provider value={{active: progress, setProgress}}>
      <div className={`App ${progress ? 'busy' : ''}`}>
        <Header />
        {progress && (
          <LinearProgress />
        )}
        <WorkBench />
      </div>
      </ProgressContext.Provider>
    </GcodeContext.Provider>
  );
}

export default App;
