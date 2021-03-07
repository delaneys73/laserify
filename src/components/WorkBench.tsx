import React,{useContext} from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { GcodeContext } from '../context/GcodeContext';
import { SVGViewer } from './SVGViewer';
import GCodeView from './GCodeView';
import JobSettings from './JobSettings';
import './Workbench.css';
import { JobContext } from '../context/JobContext';

function WorkBench() {
  const {fileData, currentGcode} = useContext(GcodeContext);
  const {bedWidth, bedHeight} = useContext(JobContext);

  return (
    <div id='workbench'>
      <div id='panels'>
        <Accordion disabled={!fileData}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>SVG</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {fileData && (
              <>
                <SVGViewer bedHeight={bedHeight} bedWidth={bedWidth} />
              </>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion disabled={!currentGcode}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>GCODE</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <GCodeView />
          </AccordionDetails>
        </Accordion>
      </div>
      <JobSettings />
    </div>
  );
}

export default WorkBench;