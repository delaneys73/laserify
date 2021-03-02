import * as React from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import './SVGUpload.css';
import {ProgressContext} from '../context/ProgressContext'

interface Props {
  onChange: (data: string) => void;
}

interface State {
  fileName: string;
}

export class SVGUpload extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fileName: '',
    }
  }
  
  static contextType = ProgressContext;

  async getFileData(file: File): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result?.toString());
      reader.onerror = (error) => reject(error);
    });
  };

  async onUpload(event: any) {
    const {onChange} = this.props;
    const {setProgress} = this.context;
    try {
      setProgress(true);
      const file = event.target.files[0];
      const fileName = event.target.value.split( '\\' ).pop();
      this.setState({fileName});
      const uri = await this.getFileData(file);
      if (uri) {
        await onChange(uri);
      }
    } finally {
      setProgress(false);
    }
  }

  render() {
    const {fileName} = this.state;
    return (
      <>
        <input
          accept='*.svg'
          type='file'
          id='fileUpload'
          name='fileUpload'
          className='inputfile'
          onChange={(e) => this.onUpload(e)}
        />
        <div className='fileWrapper'>
          <CloudUploadIcon />
          <label htmlFor='fileUpload'>
            {fileName || 'Choose a file'}
          </label>
        </div>
      </>
    )
  }
}
