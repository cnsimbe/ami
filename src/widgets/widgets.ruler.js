import WidgetsHandle from '../../src/widgets/widgets.handle';

/**
 * @module widgets/handle
 * 
 */

export default class WidgetsRuler extends THREE.Object3D{
  constructor(targetMesh, controls, camera, container, connectAllEvents = false) {
    super();

    // enable/disable flag

    this._targetMesh = targetMesh;
    this._controls = controls;
    this._camera = camera;
    this._container = container;
    this._connectAllEvents = connectAllEvents;

    this._hovered = false;

    this._worldPosition = new THREE.Vector3();
    if(this._targetMesh !== null){
      this._worldPosition = this._targetMesh.position;
    }

    // DOM STUFF...
    // NEED 3D too...
    this._line = null;
    this._distance = null;

    // add handles
    this._handles = [];

    // first handle
    this._firstHandle = new WidgetsHandle(this._targetMesh, this._controls, this._camera, this._container, connectAllEvents);
    this._firstHandle.worldPosition = this._worldPosition;
    this._firstHandle.hovered = true;
    this.add(this._firstHandle);
 
    this._handles.push(this._firstHandle);

    this._secondHandle = new WidgetsHandle(this._targetMesh, this._controls, this._camera, this._container, connectAllEvents);
    this._secondHandle.worldPosition = this._worldPosition;
    this._secondHandle.hovered = true;
    this._secondHandle.active = true;
    this.add(this._secondHandle);

    this._active = true;
        
    this._handles.push(this._secondHandle);

    this._colors = {
      default: '#00B0FF',
      active: '#FFEB3B',
      hover: '#F50057',
      select: '#76FF03'
    };
    this._color = this._colors.default;

    // DOM STUFF
    this.create();

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    // this.onEnd = this.onEnd.bind(this);
    // this.onHover = this.onHover.bind(this);
    // this.update = this.update.bind(this);
  }

  onMove(evt){

    this._firstHandle.onMove(evt);
    this._secondHandle.onMove(evt);

    this._hovered = this._firstHandle.hovered || this._secondHandle.hovered;
    this.update();
  }

  onStart(evt){
    this._firstHandle.onStart(evt);
    this._secondHandle.onStart(evt);

    this._active = this._firstHandle.active || this._secondHandle.active;
    this.update();
  }

  onEnd(evt){
    this._firstHandle.onEnd(evt);
    this._secondHandle.onEnd(evt);

    this._active = this._firstHandle.active || this._secondHandle.active;
    window.console.log(this._firstHandle.active);
    window.console.log(this._secondHandle.active);
    window.console.log(this._active);
    this.update();
  }

  create(){
    this.createDOM();
  }

  update(){
    this.updateColor();

    this.updateDOMPosition();
    this.updateDOMColor();
  }

  updateColor(){
    if(this._active){
      this._color = this._colors.active;
    }
    else if(this._hovered){
      this._color = this._colors.hover;
    }
    else if(this._selected){
      this._color = this._colors.select;
    }
    else{
      this._color = this._colors.default;
    }
  }

  createDOM(){
    // add line!
    this._line = document.createElement('div');
    this._line.setAttribute('class', 'widgets handle line');
    this._line.style.position = 'absolute';
    this._line.style.transformOrigin = '0 100%';
    this._line.style.marginTop = '-1px';
    this._line.style.height = '2px';
    this._line.style.width = '3px';
    this._container.appendChild(this._line);

    // add distance!
    this._distance = document.createElement('div');
    this._distance.setAttribute('class', 'widgets handle distance');
    this._distance.style.border = '2px solid';
    this._distance.style.backgroundColor = '#F9F9F9';
    // this._distance.style.opacity = '0.5';
    this._distance.style.color = '#353535';
    this._distance.style.padding = '4px';
    this._distance.style.position = 'absolute';
    this._distance.style.transformOrigin = '0 100%';
    this._distance.innerHTML = 'Hello, world!';
    this._container.appendChild(this._distance);

    this.updateDOMColor();
  }

  updateDOMPosition(){
    //update rulers lines and text!
    var x1 = this._firstHandle.screenPosition.x;
    var y1 = this._firstHandle.screenPosition.y; 
    var x2 = this._secondHandle.screenPosition.x;
    var y2 = this._secondHandle.screenPosition.y;

    var x0 = x1 + (x2 - x1)/2;
    var y0 = y1 + (y2 - y1)/2;

    var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    let posY = y1 - this._container.offsetHeight;

    // update line
    let transform = `translate3D(${x1}px,${posY}px, 0)`;
    transform += ` rotate(${angle}deg)`;

    this._line.style.transform = transform;
    this._line.style.width = length;

    // update distance
    let w0 = this._handles[0].worldPosition;
    let w1 = this._handles[1].worldPosition;

    this._distance.innerHTML = `${Math.sqrt((w0.x-w1.x)*(w0.x-w1.x) + (w0.y-w1.y)*(w0.y-w1.y) + (w0.z-w1.z)*(w0.z-w1.z)).toFixed(2)} mm`;
    let posY0 = y0 - this._container.offsetHeight - this._distance.offsetHeight/2;
    x0 -= this._distance.offsetWidth/2;

    var transform2 = `translate3D(${Math.round(x0)}px,${Math.round(posY0)}px, 0)`;
    this._distance.style.transform = transform2;
  }

  updateDOMColor(){
    this._line.style.backgroundColor = `${this._color}`;
    this._distance.style.borderColor = `${this._color}`;
  }

  get hovered(){
    return this._hovered;
  }

  set hovered(hovered){
    this._hovered = hovered;
  }

  get active(){
    return this._active;
  }

  set active(active){
    this._active = active;
  }

  get worldPosition(){
    return this._worldPosition;
  }

  set worldPosition(worldPosition){
    this._worldPosition = worldPosition;
    this._firstHandle.worldPosition = this._worldPosition;
    this._secondHandle.worldPosition = this._worldPosition;

    this.update();
  }

}
