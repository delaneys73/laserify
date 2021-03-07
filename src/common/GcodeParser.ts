import GCanvas from 'gcanvas';
import Canvg from 'canvg';
import { JobSettings } from '../context/JobContext';

export class GcodeParser {
  constructor(bedWidth:number, bedHeight: number, fileData: string, jobSettings: JobSettings) {
    this.bedHeight = bedHeight;
    this.bedWidth = bedWidth;
    this.fileData = fileData;
    this.jobSettings = jobSettings;
  }
  
  public lines: string[] = [];
  private bedWidth: number;
  private bedHeight: number;
  private fileData: string;
  private jobSettings: JobSettings;
  private lastPathStart: number = -1;

  scaleGCodeCmd(
    width: number,
    height: number,
    code: string,
    xStr: string,
    yStr: string,
    zStr?: string,
    iStr?: string,
    jStr?: string,
    fStr?: string,
  ): string {
    const {bedWidth, bedHeight} = this;
    const xRatio  = width / bedWidth;
    const yRatio  = height / bedHeight;
    const x = Number.parseFloat(xStr) / xRatio;
    const y = bedHeight - Number.parseFloat(yStr) / yRatio;
    
    const z = zStr ? Number.parseFloat(zStr) : 0;
    const i = iStr ? Number.parseFloat(iStr) / xRatio : 0;
    const j = jStr ? Number.parseFloat(jStr) / xRatio : 0;
    const f = fStr ? Number.parseFloat(fStr) : 0;

    const zcode = zStr ? ` Z${z.toFixed(4)}` : '';
    const icode = iStr ? ` I${i.toFixed(4)}` : '';
    const jcode = jStr ? ` J${j.toFixed(4)}` : '';
    const fcode = fStr ? ` F${f.toFixed(4)}` : '';

    return `${code} X${x.toFixed(4)} Y${y.toFixed(4)}${zcode}${icode}${jcode}${fcode}`
  }

  repeatPasses() {
    const {laserMode, passes} = this.jobSettings;
    if (laserMode && passes > 1 && this.lastPathStart !== -1) {
      const path = this.lines.slice(this.lastPathStart, this.lines.length);
      for (let j=0; j < passes-1; j++) {
        this.lines.push(`; Pass ${j+2}`);  
        this.lines = this.lines.concat(path);
      }
      this.lastPathStart = -1;
    }
  }

  getGcodeDriver(width: number, height: number) {
    return new GCanvas.GcodeDriver({
      write: (cmd: string) => {
        const lastLine = this.lines.length > 0 ?
        this.lines[this.lines.length-1] :
        '';

        const cutCodes: string[] = ['G1', 'G2', 'G3'];

        if (cutCodes.includes(cmd.substring(0,2)) && lastLine.startsWith('G0')) {
          this.lines.push('M03');  
          this.lastPathStart = this.lines.length -2;
        }
        if (cmd.startsWith('G0') && cutCodes.includes(lastLine.substring(0,2))) {
          this.lines.push('M05');  
          this.repeatPasses()
        }

        const matches = cmd.match(/^(G\d+) X(.*?) Y(.*?)( Z(.*?))?( I(.*?))?( J(.*?))?( F(.*?))?$/);
        if (matches) {
          const newLine = this.scaleGCodeCmd(
            width,
            height,
            matches[1],
            matches[2],
            matches[3],
            matches[5],
            matches[7],
            matches[9],
            matches[11],
          );
          this.lines.push(`${newLine}`);
        } else {
          this.lines.push(`${cmd}`);
        }
      }
    });
  }

  clearLines() {
    this.lines = [];
  }

  getGcode() : string {
    return this.lines.join('\n');
  }

  async generate(width: number, height: number) {
    const driver = this.getGcodeDriver(width, height);
    const {fileData} = this;
    const {toolDiameter, speed, depthOfCut, laserMode, materialThickness} = this.jobSettings;
    this.clearLines();

    try {
      const gctx = new GCanvas(driver);
      if (laserMode) {
        gctx.toolDiameter = 0.1;
      } else {
        gctx.depth = materialThickness;
        gctx.depthOfCut = depthOfCut;
        gctx.toolDiameter = toolDiameter;
      }
      
      gctx.unit ='mm';
      gctx.feed = speed;
      gctx.map('xy-z');
      
      const g = await Canvg.from(gctx.canvas.getContext('2d'), fileData);

      g.start({
        ignoreMouse: true,
        enableRedraw: false,
      });

      this.lines.push('M05');
      this.repeatPasses();
    } catch (err) {
      console.error(err);
    }
  }
}