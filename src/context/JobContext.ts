import * as React from 'react';

export interface JobSettings {
  laserMode: boolean;
  toolDiameter: number;
  passes: number;
  feed: number;
  materialThickness: number;
  depthOfCut: number;
  bedWidth: number;
  bedHeight: number;
  retract: number;
  align: 'inner' | 'outer' | 'center';
  ramping: boolean;
  unit: 'mm' | 'inch';
  updateSettings: (values: Partial<JobSettings>) => void;
}

export const initial: JobSettings = {
  laserMode: true,
  toolDiameter: 0.1,
  passes: 1,
  feed: 350,
  materialThickness: 3,
  depthOfCut: 0.5,
  bedWidth: 400,
  bedHeight: 400,
  retract: 3,
  align: 'center',
  ramping: true,
  unit: 'mm',
  updateSettings: () => {},
};

export const JobContext = React.createContext(initial);