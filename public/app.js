function Whiteboard(parentId, socket){
    this.parent = document.querySelector('#' + parentId);
    this.socket = socket;
    this.currentState = {
        isDrawing: false
    }
    window.onresize = this.fillParent.bind(this);
}

Whiteboard.prototype.init = function(id, options){
    this.createAndAppendCanvas(id, options);
    this.fillParent();
    this.addListeners();
};

Whiteboard.prototype.createAndAppendCanvas = function(id, options) {
    var canvasElement = document.createElement('canvas');
    this.element = canvasElement;
    this.element.id = id;
    this.context = this.element.getContext('2d');
    this.customize(options, this.context);
    this.parent.appendChild(this.element);

}

Whiteboard.prototype.fillParent = function() {
    var parentSize = this.parent.getBoundingClientRect();
    this.element.width = parentSize.width;
    this.element.height = parentSize.height;
    console.log('window resized!');
}

Whiteboard.prototype.addListeners = function() {
    var self = this;
    self.element.onmousedown = this.startDrawing.bind(self);
    self.element.onmousemove = this.draw.bind(self);
    self.element.onmouseup = this.stopDrawing.bind(self);
    self.socket.on('drawing', this.onDrawingEvent.bind(self))
}

Whiteboard.prototype.onDrawingEvent = function(data) {
    this.drawLine(data.x0, data.y0, data.x1, data.y1);
}

Whiteboard.prototype.startDrawing = function(e) {
    this.currentState.isDrawing = true;
    this.currentState.posX = e.pageX - this.element.offsetLeft;
    this.currentState.posY = e.pageY - this.element.offsetTop;
}

Whiteboard.prototype.draw = function(e) {
    if(this.currentState.isDrawing) {
        var x0 = this.currentState.posX;
        var y0 = this.currentState.posY;
        var x1 = e.pageX - this.element.offsetLeft;
        var y1 = e.pageY - this.element.offsetTop;
        this.drawLine(x0, y0, x1, y1, true);
        // this.context.lineTo(e.pageX - this.element.offsetLeft, e.pageY - this.element.offsetTop);
        // this.context.stroke();
        this.currentState.posX = e.pageX - this.element.offsetLeft;
        this.currentState.posY = e.pageY - this.element.offsetTop;
    }
}

Whiteboard.prototype.drawLine = function(x0, y0, x1, y1, emit) {
    // var x0 = state.posX;
    // var y0 = state.posY;
    // var x1 = event.pageX - this.element.offsetLeft;
    // var y1 = event.pageY - this.element.offsetTop;
    var ctx = this.context;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
    ctx.closePath();

    if(!emit) {return;}

    var w = this.element.width;
    var h = this.element.height;

    socket.emit('drawing', {
        x0: x0, 
        y0: y0, 
        x1: x1,
        y1: y1 
    });
}

Whiteboard.prototype.stopDrawing = function(e) {
    this.currentState.isDrawing = false;
}

Whiteboard.prototype.customize = function(options, context) {
    this.element.style.background = options.bg || 'red';
    // this.context.lineWidth = options.lineWidth || 5;
    // this.context.strokeStyle = options.strokeColor || 'red';
    // this.context.lineCap = options.lineCap || 'round';       
}

// Limit number of the events per second
Whiteboard.prototype.throttle = function(callback, delay){
    var previousCall = new Date().getTime();

    return function() {
        var time = new Date().getTime();

        if( (time-previousCall) >= delay ) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
}





