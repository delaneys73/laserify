declare module 'gcanvas' {
  export class GcodeDriver {
    constructor(config: any);
  }
  export default class Gcanvas {
    constructor(driver?: GcodeDriver);
    public static GcodeDriver: typeof GcodeDriver;
    public canvas: RenderingContext2D;
    public strokeText: string;
    public depth: number;
    public depthOfCut: number;
    public feed: number;
    public unit: 'mm' | 'inch';
    public map(map: string);
    public toolDiameter: number;
    public retract: number;
    public align: 'inner' | 'outer' | 'center';
    public ramping: boolean;
  }
};
