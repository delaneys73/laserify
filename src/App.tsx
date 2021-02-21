import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';import './App.css';
import { SVGViewer } from './components/SVGViewer';
import Icon from './Icon';

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

  const [fileData, setFileData] = useState("");

  const getBase64 = async (file: File): Promise<string | undefined>  => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString());
      reader.onerror = (error) => reject(error);
    });
  };

  const onUpload = async (event: any) => {
    const file = event.target.files[0];
    const uri = await getBase64(file);
    if (uri) {
      setFileData(uri);
    }
  }

  const classes = useStyles();

  return (
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
            <input
              accept='*.svg'
              type='file'
              id='fileUpload'
              onChange={(e) => onUpload(e)}
            />
        </Toolbar>       
      </AppBar>
      {fileData && (
        <SVGViewer fileData={fileData}/>
      )}
    </div>
  );
}

export default App;
