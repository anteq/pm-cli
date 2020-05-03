const placeholder = { text: '-', class: null, img: null };
const displayTypes = ['text', 'name', 'color', 'class', 'img', 'icon', 'date', 'alt'];

function findAndFill(doc, context) {
    fillArrays(doc, context);
    fillSingles(doc, context);
    return doc;
}

function fillArrays(doc, context) {
    let allArrays = [...doc.querySelectorAll('[data-each]')].map(x => x.dataset.each);
    for (let key of allArrays) {
        cloneAndFillArray(key, doc, context);
    }
}

function fillSingles(doc, context) {
    findKeysAndFill(doc, context);
}

function findKeysAndFill(doc, context) {
    let allKeys = [...doc.querySelectorAll('[data-value]')].map(x => x.dataset.value);
    for (let key of allKeys) {
        findValueAndFill(key, doc, context)
    }
}

function cloneAndFillArray(key, doc, context) {
    let node = doc.querySelector(`[data-each~="${key}"]`);
    if (node) {
        if (context[key] && Array.isArray(context[key])) {
            for (let i in context[key]) {
                var valueNode = node.cloneNode(true);
                var localContext = {...context, comment: context[key][i]};
                localContext[key] = context[key][i];
                findKeysAndFill(valueNode, localContext);
                node.parentNode.appendChild(valueNode);
            }
        }
    }
    node.remove();
}

function findValueAndFill(key, doc, context) {
    let node = doc.querySelector(`[data-value~="${key}"]:not([data-filled])`);
    if (node) {
        let types = node.dataset.type ? node.dataset.type.split(' ') : ['text'];
        let value = getValue(context, node.dataset.value);
        node.dataset.filled = true;
        if (types.includes('text')) node.innerHTML = value.text || value.name;
        if (types.includes('class')) node.classList.add(value.class || value.color || value.text);
        if (types.includes('img')) node.setAttribute('src', value.img || value.icon);
        if (types.includes('date')) node.innerHTML = typeof value.text.fromNow === 'function' ? value.text.fromNow() : '-';
        if (types.includes('alt')) node.setAttribute('alt', value.text || value.name);
        if (doc.querySelector(`[data-value~="${key}"]:not([data-filled])`)) {
            // recursively find another one to fill
            findValueAndFill(key, doc, context);
        }
    }
}

function getValue(context, value) {
    if (!value) return placeholder;
    let [key, property] = value.split('.');
    if (Object.keys(context).includes(key)) {
        let object = context[key];
        if (typeof object === 'object' && object[property] !== null && Object.keys(object).includes(property)) {
            if (typeof object[property] === 'object' && object[property] !== null && Object.keys(object[property]).some(key => displayTypes.includes(key))) {
                return object[property];
            } else {
                return { text: object[property] };       
            }
        } else if (typeof object === 'string') {
            return { text: object };
        } else {
            return placeholder;
        }
    } else {
        return placeholder;
    }
}

module.exports = { findAndFill };