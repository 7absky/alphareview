define([], function(){
    var state = {
        isDrawing: false,
        color: "red",
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