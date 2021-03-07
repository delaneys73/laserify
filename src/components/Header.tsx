
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

  const setDefaultBedSize = (data: string, bedWidth: number, bedHeight: number) => {
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(data, 'image/svg+xml');

    const svg = doc.getElementsByTagName('svg').item(0);
    const viewbox = svg?.getAttribute('viewBox');
    if (viewbox) {
      const {updateSettings} = jobSettings;
      const bounds = viewbox.split(' ');
      const w = parseInt(bounds[2], 10);
      const h = parseInt(bounds[3], 10);
      updateSettings({bedWidth: w, bedHeight: h});
      return [w, h];
    }

    return [bedWidth, bedHeight]
  }

  const processChange = async (data: string) => {
    const [bw, bh] = setDefaultBedSize(data, bedWidth, bedHeight);

    const {gcode, layers, selectedLayer} = await new GCodeTools(bw, bh, currentLayer, jobSettings).processFile(data);

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