import GCanvas from 'gcanvas';
import Canvg from 'canvg';
import { JobSettings } from '../context/JobContext';

const DECIMALS = 2;
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

    const zcode = zStr ? ` Z${z.toFixed(DECIMALS)}` : '';
    const icode = iStr ? ` I${i.toFixed(DECIMALS)}` : '';
    const jcode = jStr ? ` J${j.toFixed(DECIMALS)}` : '';
    const fcode = ` F${fStr}`;

    return `${code} X${x.toFixed(DECIMALS)} Y${y.toFixed(DECIMALS)}${zcode}${icode}${jcode}${fcode}`
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

        const {feed} = this.jobSettings;

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
          const feedRate = `${feed * 60}`;
          const newLine = this.scaleGCodeCmd(
            width,
            height,
            matches[1],
            matches[2],
            matches[3],
            matches[5],
            matches[7],
            matches[9],
            feedRate,
          );
          this.lines.push(`${newLine}`);
        } else {
          if (cmd === 'G93') {
            this.lines.push('G94');
          } else {
            this.lines.push(`${cmd}`);
          }
        }
      }
    });
  }

  clearLines() {
    const {laserMode, feed, retract, unit, align, depthOfCut, toolDiameter, passes} = this.jobSettings;
    if (laserMode) {
      this.lines = [
        `; Feed: ${feed}${unit}/s`,
        `; Passes: ${passes}`,
      ];
    } else {
      this.lines = [
        `; Feed: ${feed}${unit}/s`,
        `; Tool: ${toolDiameter}${unit}`,
        `; Retract ${retract}${unit}`,
        `; Align ${align}`,
        `; Depth of cut ${depthOfCut}${unit}`,
      ];
    }
  }

  getGcode() : string {
    return this.lines.join('\n');
  }

  async generate(width: number, height: number) {
    const driver = this.getGcodeDriver(width, height);
    const {fileData} = this;
    const {
      toolDiameter,
      feed,
      depthOfCut,
      laserMode,
      materialThickness,
      align,
      ramping,
      retract,
      unit,
    } = this.jobSettings;
    this.clearLines();

    try {
      const gctx = new GCanvas(driver);
      if (laserMode) {
        gctx.toolDiameter = 0.1;
      } else {
        gctx.depth = materialThickness;
        gctx.depthOfCut = depthOfCut;
        gctx.toolDiameter = toolDiameter;
        gctx.retract = retract;
        gctx.ramping = ramping;
        gctx.align = align;
      }
      
      gctx.unit = unit;
      gctx.feed = feed;
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