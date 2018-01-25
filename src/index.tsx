import * as React from 'react';
import { render } from 'react-dom';
import { remote } from 'electron';

import imageProcessing from './imageProcessing';

class Root extends React.Component <any, { 
    origin: string, destination: string,
    thumb: boolean, rename: boolean, ignoreSmaller: boolean, cleanDestination: boolean, buffer: boolean,
    width: number, height: number, thumbWidth: number, thumbHeight: number,
  }>{
  state = {
    origin           : '',
    destination      : '',
    thumb            : true,
    rename           : true,
    ignoreSmaller    : true,
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

  process(e) {
    e.preventDefault();
    var { origin, destination, thumb, rename, ignoreSmaller, cleanDestination, buffer, width, height, thumbWidth, thumbHeight } = this.state;

    imageProcessing({ origin, destination, thumb, rename, ignoreSmaller, cleanDestination });
  }

  dialog(field){
    var [folder] = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if(folder) this.setState({ [field]: folder });
  }

  render() {
    var { origin, destination, thumb, rename, ignoreSmaller, cleanDestination, buffer, width, height, thumbWidth, thumbHeight } = this.state;
    return <div>
      <nav>
        <span>Image Processing</span>
      </nav>

      <section>
        <form onSubmit={this.process}>
          <Input label="Origin"
            value={origin}
            onChange={origin => this.setState({ origin })}
            onClick={this.dialog.bind(this, 'origin')}
            />

          <Input label="Destination"
            value={destination}
            onChange={destination => this.setState({ destination })} 
            onClick={this.dialog.bind(this, 'destination')} />

          <Checkbox label="Generate thumbnails"
            checked={thumb}
            onChange={thumb => this.setState({ thumb })} />

          <Checkbox label="Rename files"
            checked={rename}
            onChange={rename => this.setState({ rename })} />

          <Checkbox label="Ignore if smaller than result"
            checked={ignoreSmaller}
            onChange={ignoreSmaller => this.setState({ ignoreSmaller })} />

          <Checkbox label="Clean destination"
            checked={cleanDestination}
            onChange={cleanDestination => this.setState({ cleanDestination })} />

          <br/>

          <button type="submit" className="btn btn-primary">Go!</button>
        </form>
      </section>
    </div>
  }
}

const Input = ({ label, onChange, value, onClick = undefined }) => (
  <div className="form-group">
    <label>
      {label}
      <div className="input-group mb-3">
        <input type="text" className="form-control" 
          onChange={ref => onChange(ref.target.value)}
          value={value} />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" onClick={onClick}>
            <span className="oi oi-folder" />
          </button>
        </div>
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