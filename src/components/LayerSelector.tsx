import * as React from 'react';
import {FormControl, InputLabel, Select, MenuItem, FormHelperText} from '@material-ui/core';
import { GcodeContext, SVGLayer } from '../context/GcodeContext';

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
        <FormControl>
          <InputLabel shrink id="layer-label">
            Layer
          </InputLabel>
          <Select
            id="layer"
            value={currentLayer}
            onChange={(e) => onChange(e.target.name || '')}
            displayEmpty
          >
            {layers.map((layer, index) => (
              <MenuItem key={index} value={layer.id}>
              <em>{layer.name}</em>
              </MenuItem>
            ))
            }
          </Select>
          <FormHelperText>Select layer to work with</FormHelperText>
        </FormControl>
      </>
    )
  }
}

LayerSelector.contextType = GcodeContext;