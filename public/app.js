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
}

Whiteboard.prototype.addListeners = function() {
    var self = this;
    self.element.onmousedown = this.startDrawing.bind(self);
    self.element.onmousemove = this.draw.bind(self);
    self.element.onmouseup = this.stopDrawing.bind(self);
    self.socket.on('drawing', this.throttle(this.onDrawingEvent.bind(self), 10));
}

Whiteboard.prototype.onDrawingEvent = function(data) {
    var w = this.element.width;
    var h = this.element.height;
    this.drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, 'green');
}

Whiteboard.prototype.startDrawing = function(e) {
    this.currentState.isDrawing = true;
    // coordinates on canvas element
    this.currentState.posX = e.pageX;
    this.currentState.posY = e.pageY;
}

Whiteboard.prototype.draw = function(e) {
    if(this.currentState.isDrawing) {
        var x0 = this.currentState.posX;
        var y0 = this.currentState.posY;
        var x1 = e.pageX;
        var y1 = e.pageY;
        this.drawLine(x0, y0, x1, y1, 'red', true);

        this.currentState.posX = e.pageX;
        this.currentState.posY = e.pageY;
    }
}

Whiteboard.prototype.drawLine = function(x0, y0, x1, y1, color, emit) {
    var ctx = this.context;

    ctx.beginPath();
    ctx.moveTo(x0 - this.element.offsetLeft, y0 - this.element.offsetTop);
    ctx.lineTo(x1 - this.element.offsetLeft, y1 - this.element.offsetTop);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();

    if(!emit) {return;}

    var w = this.element.width;
    var h = this.element.height;

    socket.emit('drawing', {
        x0: x0 / w, 
        y0: y0 / h, 
        x1: x1 / w,
        y1: y1 / h
    });
}

Whiteboard.prototype.stopDrawing = function(e) {
    this.currentState.isDrawing = false;
}

Whiteboard.prototype.customize = function(options, context) {
    this.element.style.background = options.bg || 'red';
    this.context.lineWidth = options.lineWidth || 5;
    this.context.strokeStyle = options.strokeColor || 'red';
    this.context.lineCap = options.lineCap || 'round';       
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


function ToolBox() {
    this.tools = [
        'RED',
        'GREEN',
        'BLUE',
        'THIN',
        'MEDIUM',
        'BOLD',
        'ERASE',
        'GOOD',
        'BAD'
    ];
}

ToolBox.prototype.init = function() {

}




ToolBox.prototype.prepareMarkup = function() {
    const markup = this.tools.map(function(toolName) {
        return `<li class="tool ${toolName}"></li>`;
    });
    return '<ul class="tools">' + markup.join("") + '</ul>';
}

ToolBox.prototype.getMarkup = function() {
    return this.prepareMarkup();
}

var foo = new ToolBox();
console.log(foo.getMarkup());



