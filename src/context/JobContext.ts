import * as React from 'react';

export interface JobSettings {
  laserMode: boolean;
  toolDiameter: number;
  passes: number;
  speed: number;
  materialThickness: number;
  depthOfCut: number;
  bedWidth: number;
  bedHeight: number;
  updateSettings: (values: Partial<JobSettings>) => void;
}

export const initial: JobSettings = {
  laserMode: true,
  toolDiameter: 0.1,
  passes: 1,
  speed: 350,
  materialThickness: 3,
  depthOfCut: 0.5,
  bedWidth: 210,
  bedHeight: 320,
  updateSettings: () => {},
};

export const JobContext = React.createContext(initial);