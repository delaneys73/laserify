import * as React from 'react';

interface Progress {
  active: boolean;
  setProgress: (value: boolean) => void;
}

export const initial: Progress = {
  active: false,
  setProgress: () => {},
}
 
export const ProgressContext = React.createContext(initial);
