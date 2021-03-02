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
  bedWidth: number;
  bedHeight: number;
  setFileData: (data: string) => void;
  setGcode: (data: string) => void;
  setLayers: (data: SVGLayer[]) => void;
  setCurrentLayer: (data: string) => void;
  update: (changes: any) => void;
}

export const initial: GcodeContextValue = {
  fileData: '',
  filteredFileData: '',
  layers: [],
  currentGcode: '',
  currentLayer: '',
  bedWidth: 210,
  bedHeight: 320,
  setFileData: () => {},
  setGcode: () => {},
  setLayers: () => {},
  setCurrentLayer: () => {},
  update: () => {},
}

export const GcodeContext = React.createContext(initial);
