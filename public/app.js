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

    var colors = ['black', 'red', 'blue', 'green', 'white'];

    function init() {
        createCanvas();
        customize();
        createAndAddToolbox();
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
        element.onmouseout = stopDrawing;
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
            drawLine(x0, y0, x1, y1, currentState, true);
            currentState.posX = e.pageX;
            currentState.posY = e.pageY;
        }
    }

    function drawLine(x0, y0, x1, y1, options, emit) {
        context.beginPath();
        var offsetLeftAcc = element.parentNode.offsetLeft + element.offsetLeft;
        var offsetTopAcc = element.parentNode.offsetTop + element.offsetTop;
        context.moveTo(x0 - offsetLeftAcc, y0 - offsetTopAcc);
        context.lineTo(x1 - offsetLeftAcc, y1 - offsetTopAcc);
        context.strokeStyle = options.color;
        context.lineWidth = options.lineWidth;
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
            options: currentState
        });
    }

    function stopDrawing() {
        currentState.isDrawing = false;
    }

    function onDrawingEvent(data) {
        var w = element.width;
        var h = element.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.options);
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


    function createAndAddToolbox() {
        var element = document.createElement('div');
        element.id = 'toolbox';
        element.innerHTML = prepareToolboxMarkup();
        wrapperElement.appendChild(element);
        addStylesForTools();
        attachListenersToToolbox();
        return element;
    }

    function addStylesForTools() {
        document.querySelectorAll('.tool-color').forEach(function(tool){
            tool.style.background = tool.id;
        })
    }

    function prepareToolboxMarkup() {
        var markup = `<div class="toolbox-colors flex-center">`;
        colors.forEach(function(color){
            markup += `<div class="tool tool-color" id="${color}"></div>`
        });
        markup += `</div>`;
        return markup;
    }

    function attachListenersToToolbox() {
        var colorsToolbox = document.querySelector('.toolbox-colors');
        colorsToolbox.addEventListener('click', setColor);
    }

    function setColor(e) {
        var chosenColor = e.target.id; 
        // white is considered as a rubber so it has to be much wider 
        if(chosenColor === 'white') {
            currentState.lineWidth = 30;
        } else {
            currentState.lineWidth = 5;
        }
        currentState.color = chosenColor;
        customize();
    }


    return {
        init: init,
    }
})(socket);