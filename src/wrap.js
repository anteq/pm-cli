module.exports = {
    wrap: function(template, values) {
        let keys = Object.keys(values);
        for (let key of keys) {
            template = template.replace(`{${key}}`, `<span class="prop prop-${key}">${values[key]}</span>`);
        }
        return template;
    }
}