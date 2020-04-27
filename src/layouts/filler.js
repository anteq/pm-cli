const placeholder = { text: '-', class: null, img: null };
const displayTypes = ['text', 'name', 'color', 'class', 'img', 'icon', 'date'];

function findAndFill(doc, context) {
    console.debug(doc.querySelectorAll('[data-value]'));
    let allValues = [...doc.querySelectorAll('[data-value]')].map(x => x.dataset.value);
    for (let v of allValues) {
        let node = doc.querySelector(`[data-value~="${v}"]`);
        let types = node.dataset.type ? node.dataset.type.split(' ') : ['text'];
        let value = getValue(context, node.dataset.value);
        if (types.includes('text')) node.innerHTML = value.text || value.name;
        if (types.includes('class')) node.classList.add(value.class || value.color);
        if (types.includes('img')) node.setAttribute('src', value.img || value.icon);
        if (types.includes('date')) node.innerHTML = typeof value.text.fromNow === 'function' ? value.text.fromNow() : '-';
    }
    return doc;
}

function getValue(context, value) {
    if (!value) return placeholder;
    let [key, property] = value.split('.');
    if (Object.keys(context).includes(key)) {
        console.debug(context, key, property);
        let object = context[key];
        if (typeof object === 'object' && Object.keys(object).includes(property)) {
            if (typeof object[property] === 'object' && Object.keys(object[property]).some(key => displayTypes.includes(key))) {
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