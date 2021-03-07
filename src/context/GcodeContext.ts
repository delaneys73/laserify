import * as React from 'react';

export interface SVGLayer {
  id: string;
  name: string;
}

export interface GcodeContextValue {
  fileData: string;
  filteredFileData: string;
  layers: SVGLayer[];
  currentGcode: string;
  currentLayer: string;
  setFileData: (data: string) => void;
  setGcode: (data: string) => void;
  setLayers: (data: SVGLayer[]) => void;
  setCurrentLayer: (data: string) => void;
  update: (changes: any) => void;
  regenerate: (currentLaserMode: boolean) => void;
}

export const initial: GcodeContextValue = {
  fileData: '',
  filteredFileData: '',
  layers: [],
  currentGcode: '',
  currentLayer: '',
  setFileData: () => {},
  setGcode: () => {},
  setLayers: () => {},
  setCurrentLayer: () => {},
  update: () => {},
  regenerate: () => {},
}

export const GcodeContext = React.createContext(initial);
