import * as React from 'react';
import { render } from 'react-dom';
import { remote } from 'electron';
import * as cn from 'classnames';

import imageProcessing from './imageProcessing';

class Root extends React.Component <any, { 
    origin: string, destination: string,
    thumb: boolean, rename: boolean, ignoreSmaller: boolean, cleanDestination: boolean, buffer: boolean,
    width: number, height: number, thumbWidth: number, thumbHeight: number,
  }>{
  state = {
    origin           : 'C:\\Users\\gavi\\Desktop\\sofi\\moni', // TODO: remove
    destination      : 'C:\\Users\\gavi\\Desktop\\lala',       // TODO: remove
    thumb            : true,
    rename           : false,
    ignoreSmaller    : false,
    cleanDestination : false,
    buffer           : false,
    width            : 800,
    height           : undefined,
    thumbWidth       : 220,
    thumbHeight      : 150
  };

  constructor(props){
    super(props);
    this.process = this.process.bind(this);
    this.dialog = this.dialog.bind(this);
  }

  close() {
    remote.getCurrentWindow().close();
  }

  process(e) {
    e.preventDefault();
    var { origin, destination, thumb, rename, ignoreSmaller,
      cleanDestination, buffer, width, height, thumbWidth, thumbHeight } = this.state;

    imageProcessing({ origin, destination,
      thumb, rename, ignoreSmaller, cleanDestination,
      width, height, thumbWidth, thumbHeight });
  }

  dialog(field){
    var [folder] = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if(folder) this.setState({ [field]: folder });
  }

  render() {
    var { origin, destination, thumb, rename, ignoreSmaller, cleanDestination,
      buffer, width, height, thumbWidth, thumbHeight } = this.state;
    return <div>
      <nav>
        <h1 className="title">Image Processing</h1>

        <button className="btn btn-danger" onClick={this.close}><span className="oi oi-x" /></button>
      </nav>

      <section>
        <form onSubmit={this.process}>
          
          <div className="row no-gutters">
            <div className="col">
              <div className="paths-panel">
                <Input label="Origin"
                  value={origin}
                  onChange={origin => this.setState({ origin })}
                  onClick={this.dialog.bind(this, 'origin')}
                  />
                <Input label="Destination"
                  value={destination}
                  onChange={destination => this.setState({ destination })} 
                  onClick={this.dialog.bind(this, 'destination')} />

                <button type="submit" className="btn btn-primary btn-block mt-5">Process</button>
              </div>
            </div>

            <div className="col-4">
              <div className="options-panel">
                <p className="mb-2"><b>Options</b></p>

                {/* Image size */}
                <div className="row no-gutters">
                  <div className="col-12">
                    <label className="m-0">Image size</label>
                  </div>
                  <div className="col">
                    <Input
                      value={width}
                      onChange={width => this.setState({ width: parseInt(width) })} />
                  </div>
                  <div className="col-auto p-3">
                    x
                  </div>
                  <div className="col">
                    <Input
                      value={height}
                      onChange={height => this.setState({ height: parseInt(height) })} />
                  </div>
                </div>

                {/* Thumbnail size */}
                <div className="row no-gutters">
                  <div className="col-12">
                    <label className="m-0">Thumbnail size</label>
                  </div>
                  <div className="col">
                    <Input
                      disabled={!thumb}
                      value={thumbWidth}
                      onChange={thumbWidth => this.setState({ thumbWidth: parseInt(thumbWidth) })} />
                  </div>
                  <div className="col-auto p-3">
                    x
                  </div>
                  <div className="col">
                    <Input
                      disabled={!thumb}
                      value={thumbHeight}
                      onChange={thumbHeight => this.setState({ thumbHeight: parseInt(thumbHeight) })} />
                  </div>
                </div>

                <Checkbox label="Generate thumbnails"
                  checked={thumb}
                  onChange={thumb => this.setState({ thumb })} />
                <Checkbox label="Rename files"
                  checked={rename}
                  onChange={rename => this.setState({ rename })} />
                <Checkbox label="Ignore if smaller"
                  checked={ignoreSmaller}
                  onChange={ignoreSmaller => this.setState({ ignoreSmaller })} />
                <Checkbox label="Clean destination"
                  checked={cleanDestination}
                  onChange={cleanDestination => this.setState({ cleanDestination })} />
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  }
}

const Input = ({ label = '', onChange, value, onClick = undefined, disabled = false }) => (
  <div className="form-group">
    <label>
      {label}
      <div className="input-group">
        <input type="text" className="form-control" disabled={disabled}
          onChange={ref => onChange(ref.target.value)}
          value={value} />
        {onClick && <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" onClick={onClick}>
            <span className="oi oi-folder" />
          </button>
        </div>}
      </div>
    </label>
  </div>
);

const Checkbox = ({ label, onChange, checked }) => (
  <div className="form-check">
    <label className="form-check-label">
      <input className="form-check-input" type="checkbox" onChange={ref => onChange(ref.target.checked)} checked={checked} />
      {label}
    </label>
  </div>
);

render(<Root />, document.getElementById('root'));