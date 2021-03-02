import * as React from 'react';
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

export class WorkBench extends React.Component {
  static contextType = GcodeContext;

  render() {
    const {fileData, currentGcode} = this.context;
    return (
    <div>
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
            <SVGViewer />
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
    );
  }
}