import * as React from 'react';
import Canvg from 'canvg';
import './SVGViewer.css';
import {GcodeContext} from '../context/GcodeContext';

interface Props {}

export class SVGViewer extends React.Component<Props> {
  async reGenerateSvg() {
    const {fileData} = this.context;
    const canvas: HTMLCanvasElement = document.getElementById('svgPreview') as HTMLCanvasElement;

    if (canvas && fileData) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const v = await Canvg.from(ctx, fileData);
        v.start();
      }
    }
  }

  async componentDidMount() {
    await this.reGenerateSvg();
  }

  async componentDidUpdate() {
    await this.reGenerateSvg();
  }

  render() {
    return (
      <>
          <div className='viewer-outer'>
            <div className='viewer-header'>
            </div>
            <div className='viewport'>
              <canvas id='svgPreview'/>
            </div>
          </div>
      </>
    );
  }
}

SVGViewer.contextType = GcodeContext;
