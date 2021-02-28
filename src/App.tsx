import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';import './App.css';
import { SVGViewer } from './components/SVGViewer';
import { SVGUpload } from './components/SVGUpload';
import Icon from './Icon';
import {GcodeContext, initial, SVGLayer} from './context/GcodeContext';
import { GCodeTools } from './common/GCodeTools';
import { LayerSelector } from './components/LayerSelector';


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



function App() {

  const [gcodeValue, setGcodeValue] = useState(initial);

  const classes = useStyles();

  const setFileData = (fileData: string) => setGcodeValue({...gcodeValue, fileData})

  const setGcode = (currentGcode: string) => setGcodeValue({...gcodeValue, currentGcode})

  const setLayers = (layers: SVGLayer[]) => setGcodeValue({...gcodeValue, layers})

  const processChange = async (data: string) => {
    console.log(data);
    const {bedWidth, bedHeight} = gcodeValue;
    const {gcode, layers} = await new GCodeTools(bedWidth, bedHeight).processFile(data);
    setGcodeValue({
      ...gcodeValue,
      fileData: data,
      currentGcode: gcode,
      layers,
    });
  }

  const changeLayer = async (layer: string) => {
    const {bedWidth, bedHeight, fileData} = gcodeValue;
    const {gcode} = await new GCodeTools(bedWidth, bedHeight).processFile(fileData);
    setGcodeValue({
      ...gcodeValue,
      currentGcode: gcode,
      currentLayer: layer,
    });
  }

  return (
    <GcodeContext.Provider value={{...gcodeValue, setFileData, setGcode, setLayers}}>
      <div className="App">
        <AppBar position="static">
        <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Laserify
              <Icon />
            </Typography>
            <SVGUpload onChange={(data) => processChange(data)}/>
            {gcodeValue.fileData && (
              <LayerSelector onChange={(data) => changeLayer(data)}/>
            )}
          </Toolbar>       
        </AppBar>
        {gcodeValue.fileData && (
          <>
            <SVGViewer />
          </>
        )}
      </div>
    </GcodeContext.Provider>
  );
}

export default App;
