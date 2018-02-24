define(["./helpers/domHelper",
        "./helpers/stateHelper"], 
        function(DOMHelper, StateHelper){


    var tools = ['black', 'red', 'blue', 'green', 'mouse', 'note'];
    var toolboxElt;
    var whiteboard;
    
    function createToolboxStructure(){
        toolboxElt = DOMHelper.createElement('div', {
            id: 'toolbox',
            'style': 'display: flex'});
        tools.forEach(function(tool){
            var txt;
            tool === 'note' ? txt = 'Txt' : txt = undefined;
            var elt = DOMHelper.createElement('div', {
                'class': 'tool',
                'data-tool': tool,
                'style': 'background:' + (tool == 'note' ? 'yellow' : tool == 'mouse' ? 'white' : tool)
            },txt);
            toolboxElt.appendChild(elt);
        });
    }

    function attachListeners() {
        whiteboard = document.querySelector('#whiteboard');        
        toolboxElt.addEventListener('click', function(e){
            e.stopPropagation();
            var tool = e.target.dataset.tool;
            if (tool) {
                if (tool == 'mouse') {
                    chooseMouse();
                    return;
                }
                if (tool == 'note') {
                    chooseNote();
                    return;
                }
                choosePen(tool);
            }
        });
    }

    function chooseMouse() {
        StateHelper.setState('color', 'white');
        StateHelper.setState('currentAction', 'draw');
        StateHelper.setState('lineWidth', 30);
        whiteboard.style.cursor = 'default';
        
    }

    function choosePen(tool) {
        StateHelper.setState('color', tool);
        StateHelper.setState('currentAction', 'draw');
        StateHelper.setState('lineWidth', 5);
        whiteboard.style.cursor = 'default';
    }

    function chooseNote() {
        StateHelper.setState('currentAction', 'text');
        whiteboard.style.cursor = 'crosshair';
    }

    (function(){
        createToolboxStructure();
        attachListeners();
    })();

    return toolboxElt;
});