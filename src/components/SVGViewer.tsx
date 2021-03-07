import * as React from 'react';
import Canvg from 'canvg';
import './SVGViewer.css';
import {GcodeContext} from '../context/GcodeContext';
import { RefObject } from 'react';

interface Props {
  bedWidth: number;
  bedHeight: number;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
export class SVGViewer extends React.Component<Props> {
  viewport: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  bottomRuler: RefObject<SVGSVGElement> = React.createRef<SVGSVGElement>();
  sideRuler: RefObject<SVGSVGElement> = React.createRef<SVGSVGElement>();

  async reGenerateSvg() {
    const {filteredFileData} = this.context;
    const canvas: HTMLCanvasElement = document.getElementById('svgPreview') as HTMLCanvasElement;

    if (canvas && filteredFileData) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const v = await Canvg.from(ctx, filteredFileData);
        v.start();
        if (this.viewport.current) {
          const offset =  canvas.height - 410;
          this.viewport.current.scrollTop = offset;
          this.drawRuler(canvas.width, canvas.height);
        }
      }
    }
  }

  
  // a function to create a text element 
  drawText(value: string, options: Record<string, any>, parent: any) {
    const text = document.createElementNS(SVG_NS, 'text');
    //set the attributes for the text
    for (var name in options) {
      if (options.hasOwnProperty(name)) {
        text.setAttributeNS(null, name, options[name]);
      }
    }
    // set the text content
    text.textContent = value;
    // append the text to an svg element of your choice
    parent.appendChild(text);
    return text;
  }

  drawRuler(width: number, height: number) {
    const {bedWidth, bedHeight} = this.props;
    const text = (value: string, x: number, y: number, ref: any) => {
      this.drawText(value, {
        x,
        y,
        fill: '#fff',
        'font-size': '0.5em'
      }, ref);
    }
    const mmppX = width / bedWidth;
    const mmppY = height / bedHeight;
    if (this.bottomRuler.current) {
      for (let x=0; x < bedWidth; x+=10) {
        text(`${x}mm`, x* mmppX, 18, this.bottomRuler.current);
      }
    }

    if (this.sideRuler.current) {
      this.sideRuler.current.setAttribute('style',`height: ${height}px`);
      for (let y=0; y < bedHeight; y+=10) {
        text(`${y}mm`, 2, (height - (y * mmppY)), this.sideRuler.current);
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
            <div className='viewport' ref={this.viewport}>
              <div className='rulers'>
                <canvas id='svgPreview'/>
                <svg className='bottomRuler' ref={this.bottomRuler}></svg>
              </div>
              <svg className='sideRuler' ref={this.sideRuler}></svg>
            </div>
          </div>
      </>
    );
  }
}

SVGViewer.contextType = GcodeContext;
