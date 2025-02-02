
/**
 * Results abstraction.
 *
 * @param {HTMLElement} container
 */

class Results extends Component {
    constructor (contain) {
        super(container)
    }

    listItems = items => {
        const ul = this.container.getElementsByTagName('ul')[0]
        ul.innerHTML = ''

        items.forEach(item => {
            const li = document.createElement('li')
            ul.appendChild(li)

            this.paintItem(li, item)
        })
    }
    
    paintItem = (li, ul) => {
    li.innerText = item;
    }
}






/*
function Results(container) {
    Component.call(this, container);
}

Results.prototype = Object.create(Component.prototype);
Results.prototype.constructor = Results;

Results.prototype.listItems = function (items) {
    var ul = this.container.getElementsByTagName('ul')[0];
    ul.innerHTML = '';

    items.forEach(function (item) {
        var li = document.createElement('li');

        ul.appendChild(li);

        this.paintItem(li, item);
    }.bind(this)); // WATCH this
};

Results.prototype.paintItem = function(li, item) {
    li.innerText = item;
}; */
