
import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import './Header.css';
import { SVGUpload } from './SVGUpload';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import {GcodeContext} from '../context/GcodeContext';
import { LayerSelector } from './LayerSelector';
import { GCodeTools } from '../common/GCodeTools';
import { JobContext } from '../context/JobContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Header() {

  const {update, fileData, currentLayer}  = useContext(GcodeContext);
  const {bedWidth, bedHeight} = useContext(JobContext);

  const jobSettings = useContext(JobContext);
  const classes = useStyles();

  const processChange = async (data: string) => {
    const {gcode, layers, selectedLayer} = await new GCodeTools(bedWidth, bedHeight, currentLayer, jobSettings).processFile(data);
    update({
      currentGcode: gcode,
      fileData: data,
      layers,
      currentLayer: layers[0].id,
      filteredFileData: selectedLayer,
    });
  };

  const changeLayer = async (layer: string) => {
    const {gcode, selectedLayer} = await new GCodeTools(bedWidth, bedHeight, layer, jobSettings).processFile(fileData);
    update({
      currentGcode: gcode,
      currentLayer: layer,
      filteredFileData: selectedLayer,
    });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <div className='title'>
            <AllInclusiveIcon />
            CloudGCoder
          </div>
          {fileData && (
            <LayerSelector onChange={(data) => changeLayer(data)}/>
          )}
          <SVGUpload onChange={(data) => processChange(data)}/>
        </Toolbar>       
      </AppBar>
    </>
  )
}

export default Header;