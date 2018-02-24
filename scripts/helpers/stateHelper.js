define([], function(){
    var state = {
        currentAction: 'draw',
        isDrawing: false,
        color: "red",
        lineWidth: 5,
        lineCap: 'round',
    };
    var changeEvent = new CustomEvent('stateChange');
    function setState(key, value){
        state[key] = value;
        document.dispatchEvent(changeEvent);
    }

    function getState(key) {
        return state[key];
    }

    function getCurrentState(){
        return state;
    }

    return {
        setState: setState,
        getState: getState,
        getCurrentState: getCurrentState
    }
});