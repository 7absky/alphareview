define(["./helpers/domHelper"], function(DOMHelper){
    var element = null;
    var el = {
        input: null,
        submitBtn: null,
        list: null
    };
    function makeStructure() {
         element = DOMHelper.createElement('div', {class: 'panel flex-column',id: 'sidebar-notes'}, 
                                DOMHelper.createElement('form',{class: 'notes-form'},
                                    DOMHelper.createElement('input', {type:'text', class: 'notes-input', id: 'notesInput'}),
                                    DOMHelper.createElement('button',{id: 'submitNote'}, "+")),
                                DOMHelper.createElement('ul', {class: 'notes-list', id: 'notesList'}));
    }

    function init(parent) {
        makeStructure();
        DOMHelper.appendChild(parent, element);
        cacheElements();
        attachListeners();
    }

    function cacheElements() {
        el.input = document.querySelector('#notesInput');
        el.submitBtn = document.querySelector('#submitNote');
        el.list = document.querySelector('#notesList');
    }

    function attachListeners() {
        el.submitBtn.addEventListener('click', submitNote);
    }

    function submitNote(e) {
        e.preventDefault();
        var value = el.input.value;
        if (value !== '') {
            el.list.appendChild(createNote(value));
        }
        el.input.value = '';
    }

    function createNote(value) {
        var newNote = DOMHelper.createElement('li', null, DOMHelper.createElement('div', null, value));
        return newNote;
    }

    return {
        init: init
    };
});