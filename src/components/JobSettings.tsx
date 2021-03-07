import React, {useContext} from 'react';
import {Paper, FormControlLabel, FormGroup, Switch, Button, Slider, TextField} from '@material-ui/core';
import { JobContext } from '../context/JobContext';
import { GcodeContext } from '../context/GcodeContext';
import './JobSettings.css';

function JobSettings() {
  const {laserMode, bedWidth, bedHeight, speed, toolDiameter, depthOfCut, materialThickness, updateSettings} = useContext(JobContext);
  const {regenerate} = useContext(GcodeContext);

  return (
    <div id="jobSettings">
      <Paper elevation={3}>
        <FormGroup row>
          <FormControlLabel
            control={<Switch 
              name="laserMode"
              checked={laserMode}
              onChange={() => {
                updateSettings({laserMode: !laserMode});
                regenerate(!laserMode);
              }}
              color='primary'
            />}
            label="Laser Only"
          />
        </FormGroup>
        {laserMode && (
          <FormGroup row>
            <div className='sliderLabel'>Passes</div>
            <Slider
              defaultValue={1}
              step={1}
              valueLabelDisplay="auto"
              max={20}
              onChange={(e: any, newValue: number | number[]) => updateSettings({passes: newValue as number})}
            />
          </FormGroup>
        )}
        {!laserMode && (
          <>
            <FormGroup row>
              <TextField 
                name="toolDiameter"
                value={toolDiameter}
                label='Tool Diameter (mm)'
                onChange={(e) => updateSettings({toolDiameter: parseFloat(e.target.value)})}
              />
            </FormGroup>
            <FormGroup row>
              <TextField 
                name="materialThickness"
                value={materialThickness}
                label='Material Thickness (mm)'
                onChange={(e) => updateSettings({materialThickness: parseInt(e.target.value, 10)})}
              />
            </FormGroup>
            <FormGroup row>
              <TextField 
                name="depthOfCut"
                value={depthOfCut}
                label='Depth of cut (mm)'
                onChange={(e) => updateSettings({depthOfCut: parseInt(e.target.value, 10)})}
              />
            </FormGroup>
          </>
        )}
        <FormGroup row>
          <TextField 
            name="speed"
            value={speed}
            label='Speed'
            onChange={(e) => updateSettings({speed: parseInt(e.target.value, 10)})}
          />
        </FormGroup>
        
        <FormGroup row>
          <TextField 
            name="bedWidth"
            value={bedWidth}
            label='Bed Width (mm)'
            onChange={(e) => updateSettings({bedWidth: parseFloat(e.target.value)})}
          />
        </FormGroup>
        <FormGroup row>
          <TextField 
            name="bedHeight"
            value={bedHeight}
            label='Bed Height (mm)'
            onChange={(e) => updateSettings({bedHeight: parseFloat(e.target.value)})}
          />
        </FormGroup>
        <Button color='secondary' onClick={() => regenerate(laserMode)}>GENERATE</Button>
        <Button color='primary'>DOWNLOAD</Button>
      </Paper>
    </div>
  )
}

export default JobSettings;