import React, {useContext} from 'react';
import {Paper,
  FormGroup,
  Switch,
  Button,Slider,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Grid} from '@material-ui/core';
import { JobContext } from '../context/JobContext';
import { GcodeContext } from '../context/GcodeContext';
import './JobSettings.css';

interface Props {
  disabled: boolean;
}

function JobSettings({disabled}: Props) {
  const {
    laserMode,
    bedWidth,
    bedHeight,
    feed,
    toolDiameter,
    depthOfCut,
    materialThickness,
    retract,
    unit,
    align,
    ramping,
    updateSettings
  } = useContext(JobContext);
  const {regenerate, currentGcode, currentLayer} = useContext(GcodeContext);

  const downloadGcode = (layer:string, gcode: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(gcode));
    element.setAttribute('download', `${layer}.gcode`);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  };

  return (
    <div id="jobSettings">
      <Paper elevation={3}>
        <FormGroup row>
        <Grid className='toggleSwitch' component="label" container alignItems="center" spacing={1}>
            <Grid item>CNC</Grid>
            <Grid item>
              <Switch 
                name="laserMode"
                disabled={disabled}
                checked={laserMode}
                onChange={(e, checked) => {
                  updateSettings({laserMode: checked});
                  regenerate(checked);
                }}
                color='primary'
              />
            </Grid>
            <Grid item>Laser</Grid>
          </Grid>
        </FormGroup>
        <FormGroup row>
          <Grid className='toggleSwitch' component="label" container alignItems="center" spacing={1}>
            <Grid item>Inch</Grid>
            <Grid item>
              <Switch 
                name="unit"
                disabled={disabled}
                checked={unit === 'mm'}
                onChange={(e, checked) => {
                  updateSettings({unit: checked ? 'mm' : 'inch'});
                  regenerate(laserMode);
                }}
                color='primary'
              />
            </Grid>
            <Grid item>MM</Grid>
          </Grid>
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
                label={`Tool Diameter (${unit})`}
                onChange={(e) => updateSettings({toolDiameter: parseFloat(e.target.value)})}
              />
            </FormGroup>
            <FormGroup row>
              <TextField 
                name="materialThickness"
                value={materialThickness}
                label={`Material Thickness (${unit})`}
                onChange={(e) => updateSettings({materialThickness: parseFloat(e.target.value)})}
              />
            </FormGroup>
            <FormGroup row>
              <TextField 
                name="depthOfCut"
                value={depthOfCut}
                label={`Depth of cut (${unit})`}
                onChange={(e) => updateSettings({depthOfCut: parseFloat(e.target.value)})}
              />
            </FormGroup>
            <FormGroup row>
              <TextField 
                name="retract"
                value={retract}
                label={`Retract (${unit})`}
                onChange={(e) => updateSettings({depthOfCut: parseFloat(e.target.value)})}
              />
            </FormGroup>
            <FormGroup row>
              <FormControl>
              <InputLabel id="align-label">Align</InputLabel>
              <Select
                labelId="align-label"
                id="align"
                value={align}
                className='selectBox'
                onChange={(e) => updateSettings({align: e.target.value as "inner" | "outer" | "center"})}
              >
                <MenuItem value={'inner'}>Inner</MenuItem>
                <MenuItem value={'outer'}>Outer</MenuItem>
                <MenuItem value={'center'}>Center</MenuItem>
              </Select>
              </FormControl>
            </FormGroup>
            <FormGroup row>
              <FormControlLabel
                className='checkLabel'
                control={<Checkbox 
                  checked={ramping}
                  onChange={(e, checked) => updateSettings({ramping: checked})}
                  name="ramping"
                  color="primary"
                />}
                label="Ramping?"
              />
            </FormGroup>
          </>
        )}
        <FormGroup row>
          <TextField 
            name="feed"
            value={feed}
            label={`Feed (${unit}/sec)`}
            onChange={(e) => updateSettings({feed: parseInt(e.target.value, 10)})}
          />
        </FormGroup>
        
        <FormGroup row>
          <TextField 
            name="bedWidth"
            value={bedWidth}
            label={`Bed Width (${unit})`}
            onChange={(e) => updateSettings({bedWidth: parseFloat(e.target.value)})}
          />
        </FormGroup>
        <FormGroup row>
          <TextField 
            name="bedHeight"
            value={bedHeight}
            label={`Bed Height (${unit})`}
            onChange={(e) => updateSettings({bedHeight: parseFloat(e.target.value)})}
          />
        </FormGroup>
        <Button disabled={disabled} color='secondary' onClick={() => regenerate(laserMode)}>GENERATE</Button>
        <Button disabled={disabled} color='primary' onClick={() => downloadGcode(currentLayer, currentGcode)}>DOWNLOAD</Button>
      </Paper>
    </div>
  )
}

export default JobSettings;