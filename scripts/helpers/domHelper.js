define([],function(){
    
    function createElement(elt, attributes){
        var node = document.createElement(elt);
        // set attributes for DOM element
        if(attributes) {
            for(var attr in attributes) {
                if(attributes.hasOwnProperty(attr)) {
                    node.setAttribute(attr, attributes[attr]);
                }
            }
        }
        // check if another argument is a string
        // if so, append it to the node as a text
        if(arguments[2]) {
            for (var i = 2; i < arguments.length; i++) {
                var child = arguments[i];
                if (child && typeof child == 'string') {
                    child = document.createTextNode(child);
                }
                node.appendChild(child);
            }
        }
        return node;
    }


    return {
        createElement: createElement
    }
});