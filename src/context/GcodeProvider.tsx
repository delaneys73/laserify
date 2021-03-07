import React, {useState, useContext} from 'react';
import { GCodeTools } from '../common/GCodeTools';
import {GcodeContext, initial, SVGLayer} from './GcodeContext';
import {JobContext} from './JobContext';

interface Props {
  children: any;
}

function GcodeProvider(props: Props) {
  const {children} = props;
  
  const [gcodeValue, setGcodeValue] = useState(initial);
  const jobSettings = useContext(JobContext);

  const update = (changeset: any) => setGcodeValue({...gcodeValue, ...changeset})

  const setFileData = (fileData: string) => setGcodeValue({...gcodeValue, fileData});

  const setGcode = (currentGcode: string) => setGcodeValue({...gcodeValue, currentGcode})

  const setLayers = (layers: SVGLayer[]) => setGcodeValue({...gcodeValue, layers})

  const regenerate = async (laserMode?: boolean) => {
    const {bedWidth, bedHeight} = jobSettings;
    const {currentLayer, fileData} = gcodeValue;
    const tools = new GCodeTools(bedWidth, bedHeight, currentLayer, {...jobSettings, laserMode: (laserMode===true)});
    const {gcode, layers, selectedLayer} = await tools.processFile(fileData);
    update({
      currentGcode: gcode,
      fileData,
      layers,
      currentLayer,
      filteredFileData: selectedLayer,
    });
  };

  return (
    <GcodeContext.Provider value={{...gcodeValue, setFileData, setGcode, setLayers, update, regenerate}}>
      {children}
    </GcodeContext.Provider>
  );
}

export default GcodeProvider;