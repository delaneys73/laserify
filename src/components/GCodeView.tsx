import React, {useContext} from 'react';
import { GcodeContext } from '../context/GcodeContext';
import './GCodeView.css';

function GCodeView() {
  const {currentGcode} = useContext(GcodeContext);
  return (
    <pre className='gcodeView'>
      {currentGcode}
    </pre>
  )
}

export default GCodeView;