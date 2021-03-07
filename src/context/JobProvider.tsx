import React, {useState} from 'react';
import {JobContext, JobSettings, initial} from './JobContext';

interface Props {
  children: any;
}

function JobProvider(props: Props) {
  const [settings, setSettings] = useState(initial);
  const update = (values: Partial<JobSettings>) => setSettings({...settings, ...values})
  const {children} = props;
  
  return (
    <JobContext.Provider value={{...settings, updateSettings: update}}>
      {children}
    </JobContext.Provider>
  );
}

export default JobProvider;