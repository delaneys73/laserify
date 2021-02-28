import * as React from 'react';

interface Props {
  onChange: (data: string) => void;
}

export class SVGUpload extends React.Component<Props> {

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
    const file = event.target.files[0];
    const uri = await this.getFileData(file);
    if (uri) {
      onChange(uri);
    }
  }

  render() {
    return (
      <input
      accept='*.svg'
      type='file'
      id='fileUpload'
      onChange={(e) => this.onUpload(e)}
    />
    )
  }
}
