define([], function(){
    var state = {
        isDrawing: false,
        color: "#D20001",
        lineWidth: 5,
        lineCap: 'round'
    };

    function setState(key, value){
        state[key] = value;
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