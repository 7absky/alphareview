define(["./libs/socket.io",
        "./helpers/domHelper",
        "./helpers/stateHelper"], function(Socket, DOMHelper, StateHelper){
    var socket = new Socket();
    var wrapperElement = document.querySelector('#root');
    var element = null; 
    var context = null;
    var styles = {
        background: '#ffffff',
        lineWidth: 5,
        strokeStyle: 'red',
        lineCap: 'round' 
    }
    var currentState = StateHelper.getCurrentState();

    var colors = ['black', 'red', 'blue', 'green', 'white'];

    function init() {
        createCanvas();
        customize();
        createAndAddToolbox();
        window.onresize = resize;
        addListeners();
    }

    function createCanvas() {
        element = DOMHelper.createElement('canvas', {id: 'whiteboard', style: 'background: #ffffff'});
        wrapperElement.appendChild(element);
        resize();            
        return element;
    }

    function customize() {
        context = element.getContext('2d');
        context.lineWidth = StateHelper.getState('lineWdth');
        context.strokeStyle = StateHelper.getState('color');
        context.lineCap = StateHelper.getState('lineCap');
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
        StateHelper.setState('isDrawing', true);
        StateHelper.setState('posX', e.pageX);
        StateHelper.setState('posY', e.pageY);
    }

    function draw(e) {
        if (StateHelper.getState('isDrawing')) {
            var x0 = StateHelper.getState('posX');
            var y0 = StateHelper.getState('posY');
            var x1 = e.pageX;
            var y1 = e.pageY;
            drawLine(x0, y0, x1, y1, currentState, true);
            StateHelper.setState('posX', e.pageX);
            StateHelper.setState('posY', e.pageY);
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
        StateHelper.setState('isDrawing', false);
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
        var colorsHTML = '',
            notesHTML = '',
            markup = '';
        
        colorsHTML = `<div class="toolbox-colors flex-center">`;
        colors.forEach(function(color){
            colorsHTML += `<div class="tool tool-color" id="${color}"></div>`
        });
        colorsHTML += `</div>`;
        notesHTML += `<div class="toolbox-notes flex-center">`;
        notesHTML += `<div class="tool tool-note' id="positive"></div>`;
        notesHTML += `<div class="tool tool-note' id="negative"></div>`;
        notesHTML += '</div>'
        return colorsHTML + notesHTML;
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
        init: init
    }
});