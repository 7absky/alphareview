define([
    "./helpers/domHelper",
    "./helpers/stateHelper",
    "whiteboard"
], function(DOMHelper, StateHelper, Whiteboard){
    var loginPage = document.querySelector(".loginPage");
    var parentElement;
    var alphanumeric = /^[a-z0-9@]+$/i;
    var texts = {
        nameTitle: "Podaj swoją nazwę",
        goBtnText: 'GO!'
    }
    var ui = {
        title: DOMHelper.createElement('p', null, texts.nameTitle),
        nameInput: DOMHelper.createElement('input', {type: "text", maxlength: 12}),
        goButton: DOMHelper.createElement('button', {disabled: ''}, texts.goBtnText)
    }

    function init(parent) {
        DOMHelper.appendChild(parent, createLoginPageStructure());
        attachListeners();
    }

    function createLoginPageStructure() {
        var viewTree = DOMHelper.createElement('form', null, ui.title, ui.nameInput, ui.goButton);
        return viewTree;
    }

    function attachListeners() {
       ui.nameInput.addEventListener('keyup', validate);
       ui.goButton.addEventListener('click', startApplication);
    }

    function validate(e) {
        var value = e.target.value;
        if ( (value.length >= 4 && value.match(alphanumeric)) && (value.length <= 12 && value.match(alphanumeric)) ) {
            ui.goButton.removeAttribute('disabled');
        } else {
            ui.goButton.setAttribute('disabled', '');
        }
    }

    function startApplication(e) {
        e.preventDefault();
        var name = ui.nameInput.value;
        StateHelper.setState('user', name);
        fadeOut(function(){
            Whiteboard.init('drawingCanvas');
        });
    }

    function fadeOut(cb) {
        var pos = 0;
        var id = setInterval(function(){
            if(pos <= 100){
                loginPage.style.top = pos + "%";
                pos++;
            } else {
                clearInterval(id);
                setTimeout(cb, 300);
            }
        }, 5);
    }


    return {
        init: init
    };
});