import * as React from 'react';
import LayersIcon from '@material-ui/icons/Layers';
import { GcodeContext, SVGLayer } from '../context/GcodeContext';
import './LayerSelector.css';

interface Props {
  onChange: (newValue: string) => void;
}

export class LayerSelector extends React.Component<Props> {

  static contextType = GcodeContext;

  render() {
    const {layers, currentLayer}: {currentLayer: string, layers: SVGLayer[]} = this.context;
    const {onChange} = this.props;
    return (
      <>
        <div className='layerSelector'>
          <LayersIcon />
          <select id='layers' onChange={(e) => onChange(e.target.value)}>
          {layers.map((layer, index) => (
            <option key={index} value={layer.id}>{layer.name}</option>
          ))
          }
          </select>
        </div>
      </>
    )
  }
}

LayerSelector.contextType = GcodeContext;