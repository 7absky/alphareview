define(["./helpers/domHelper",
        "./helpers/stateHelper"], 
        function(DOMHelper, StateHelper){


    var tools = ['black', 'red', 'blue', 'green', 'mouse', 'note'];
    var toolboxElt;

    
    function createToolboxStructure(){
        toolboxElt = DOMHelper.createElement('div', {id: "toolbox"});
        tools.forEach(function(tool){
            var elt = DOMHelper.createElement('div', {
                'class': 'tool',
                'data-tool': tool,
                'style': 'background:' + (tool == 'note' ? 'yellow' : tool == 'mouse' ? 'white' : tool)
            });
            toolboxElt.appendChild(elt);
        });
    }

    function attachListeners(){
        toolboxElt.addEventListener('click', function(e){
            e.stopPropagation();
            var tool = e.target.dataset.tool;
            if (tool) {
                if (tool == 'mouse') {
                    console.log('mouse clicked!');
                    return;
                }
                if (tool == 'note') {
                    console.log('note clicked!');
                    return;
                }
                console.log(tool + ' clicked');
            }
        });
    }

    function chooseMouse() {
        StateHelper.setState('color', 'white');
        StateHelper.setState('lineWidth', 30);
    }

    (function(){
        createToolboxStructure();
        attachListeners();
    })();

    return toolboxElt;
});