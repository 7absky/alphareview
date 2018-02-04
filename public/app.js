var socket = io();
var whiteboard = (function(socket) {

    var wrapperElement = document.querySelector('#root');
    var socket = socket;
    var element = null;
    var context = null;
    var styles = {
        background: '#ffffff',
        lineWidth: 5,
        strokeStyle: 'red',
        lineCap: 'round' 
    }
    var currentState = {
        isDrawing: false,
        color: styles.strokeStyle,
        lineWidth: styles.lineWidth,
        lineCap: styles.lineCap
    }

    function init() {
        createCanvas();
        customize();
        window.onresize = resize;
        addListeners();
    }

    function createCanvas() {
        element = document.createElement('canvas');
        element.id = 'whiteboard';
        element.style = styles.background;
        wrapperElement.appendChild(element);
        resize();            
        return element;
    }

    function customize() {
        context = element.getContext('2d');
        context.lineWidth = currentState.lineWidth;
        context.strokeStyle = currentState.color;
        context.lineCap = currentState.lineCap;
    }

    function resize() {
        var parentSize = wrapperElement.getBoundingClientRect();
        element.width = parentSize.width;
        element.height = parentSize.height;
    }

    function addListeners() {
        element.onmousedown = startDrawing;
        element.onmousemove = draw;
        element.onmouseup = stopDrawing;
        socket.on('drawing', throttle(onDrawingEvent, 10));
    }

    function startDrawing(e) {
        currentState.isDrawing = true;
        currentState.posX = e.pageX;
        currentState.posY = e.pageY;
    }

    function draw(e) {
        if (currentState.isDrawing) {
            var x0 = currentState.posX;
            var y0 = currentState.posY;
            var x1 = e.pageX;
            var y1 = e.pageY;
            drawLine(x0, y0, x1, y1, currentState.color, true);
            currentState.posX = e.pageX;
            currentState.posY = e.pageY;
        }
    }

    function drawLine(x0, y0, x1, y1, color, emit) {
        context.beginPath();
        var offsetLeftAcc = element.parentNode.offsetLeft + element.offsetLeft;
        var offsetTopAcc = element.parentNode.offsetTop + element.offsetTop;
        context.moveTo(x0 - offsetLeftAcc, y0 - offsetTopAcc);
        context.lineTo(x1 - offsetLeftAcc, y1 - offsetTopAcc);
        context.strokeStyle = color;
        context.stroke();
        context.closePath();

        if(!emit) {return;}

        var w = element.width;
        var h = element.height;

        socket.emit('drawing', {
            x0: x0 / w, 
            y0: y0 / h, 
            x1: x1 / w,
            y1: y1 / h,
            color: color
        });
    }

    function stopDrawing() {
        currentState.isDrawing = false;
    }

    function onDrawingEvent(data) {
        var w = element.width;
        var h = element.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, 'green');
    }

    function throttle(callback, delay){
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();

            if( (time-previousCall) >= delay ) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }



    return {
        init: init,
    }
})(socket);