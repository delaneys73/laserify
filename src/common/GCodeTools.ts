import Canvg from 'canvg';
import { SVGLayer } from '../context/GcodeContext';
import { JobSettings } from '../context/JobContext';
import { GcodeParser } from './GcodeParser';

export class GCodeTools {
  constructor(bedWidth: number, bedHeight: number, currentLayer: string, jobSettings: JobSettings) {
    this.bedWidth = bedWidth;
    this.bedHeight = bedHeight;
    this.currentLayer = currentLayer;
    this.jobSettings = jobSettings;
  }
  private bedHeight: number;
  private bedWidth: number;
  private currentLayer: string;
  private jobSettings: JobSettings;

  async getGcode(data: string): Promise<string> {
    const {bedWidth, bedHeight} = this;
    const parser = new GcodeParser(bedWidth, bedHeight, data, this.jobSettings);
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const v = await Canvg.from(ctx, data);
      v.start();
    }
    await parser.generate(canvas.width, canvas.height);
    return parser.getGcode();
  }

  getLayers(data: string): {layers: SVGLayer[], selectedLayer: string} {
    const layers: SVGLayer[] = [];
    const parser: DOMParser = new DOMParser();
    const inkscapeNS = 'http://www.inkscape.org/namespaces/inkscape';
    const doc: Document = parser.parseFromString(data, 'image/svg+xml');

    const withLayers = (callback: (group: SVGElement, id: string, name: string) => void) => {
      const groups = doc.getElementsByTagName('g');
      for (let x=0; x < groups.length; x++) {
        const group = groups.item(x);
        if (group?.hasAttributeNS(inkscapeNS, 'groupmode')) {
          const groupMode = group.getAttributeNS(inkscapeNS, 'groupmode');
          if (groupMode === 'layer') {
            const id = group.getAttribute('id') || 'layer1';
            const name = group.getAttributeNS(inkscapeNS, 'label') || 'Layer 1';
            callback(group, id, name);
          }
        }
      }
    };

    withLayers((group, id, name) => {
      layers.push({
        id,
        name,
      });
    });

    withLayers((group, id) => {
      if (!this.currentLayer) {
        this.currentLayer = id;
      }
      
      if (id !== this.currentLayer) {
        group.remove();
      }
    });

    return {layers, selectedLayer: new XMLSerializer().serializeToString(doc)};
  }

  async processFile(data: string): Promise<{gcode: string, layers: SVGLayer[], selectedLayer: string}> {
    const {layers, selectedLayer} = this.getLayers(data);

    const gcode = await this.getGcode(selectedLayer);
    
    return {
      gcode,
      layers,
      selectedLayer,
    }
  }

}