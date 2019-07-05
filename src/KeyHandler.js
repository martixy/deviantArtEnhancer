import Bro from 'brototype'

const KeyHandler = function() {
    this.bindings = {};
    this.modifiers = {'altKey': false, 'ctrlKey': false, 'metaKey': false, 'shiftKey': false}; //Ordering is explicit here (also alphabetical)
    this.eventTypes = {
        "keydown": [],
        "keypress": [],
        "keyup": []
    }
    this.keyRouterBound = this.keyRouter.bind(this); //Extract so we can bind and unbind the same function as a listerner. Otherwise .bind would probably make us a new object.
}

//TODO: Handle overwriting keys. E.g. make callbacks into an array.
KeyHandler.prototype.registerKey = function(eventType, key, callback) {
    if (!this.eventTypes.hasOwnProperty(eventType)) {
        console.warn('Key Handler: Cannot handle event type: ' + eventType);
        return;
    }
    key = this.normalizeKey(key);
    const hash = hashKey(key);
    Bro(this.bindings).makeItHappen(`${hash}.${eventType}`, callback);
    if (this.eventTypes[eventType].length === 0) {
        $(document).on(eventType, this.keyRouterBound);
        console.info('KeyHandler: Adding listener on ' + eventType);
    }
    if (!this.eventTypes[eventType].includes(hash)) {
        this.eventTypes[eventType].push(hash);
    }
    return key;
}

KeyHandler.prototype.unregisterKey = function(eventType, key, callback = null) { //TODO: Callback here so removal of single callback from a whole stack of em is possible.
    if (!this.eventTypes.hasOwnProperty(eventType)) {
        console.warn('Key Handler: Cannot handle event type: ' + eventType);
        return;
    }
    key = this.normalizeKey(key);
    const hash = hashKey(key);
    let removee = this.eventTypes[eventType].indexOf(hash);
    if (~removee) this.eventTypes[eventType].splice(removee, 1);
    if (this.eventTypes[eventType].length === 0) {
        $(document).off(eventType, this.keyRouterBound);
        console.info('KeyHandler: Removing listener on ' + eventType);
    }
    delete this.bindings[hash][eventType];
    return key;
}

KeyHandler.prototype.getRegisteredKeys = function() {
    let result = {};
    for (let binding in this.bindings) {
        result[binding] = {};
        result[binding]['key'] = this.resolveKey(binding);
        let eventTypes = [];
        for (let [eventType, arr] of Object.entries(this.eventTypes)) {
            if (~arr.findIndex(el => el === binding)) {
                eventTypes.push(eventType);
            }
        }
        result[binding]['eventType'] = eventTypes;
    }
    return result;
}

KeyHandler.prototype.hasKey = function(key) {
    key = this.normalizeKey(key);
    const hash = hashKey(key);
    return this.bindings.hasOwnProperty(hash);
}

KeyHandler.prototype.getHandler = function(key, eventType = null) {
    key = this.normalizeKey(key);
    const hash = hashKey(key);
    if (eventType && this.eventTypes.hasOwnProperty(eventType)) {
        return this.bindings[hash][eventType];
    } else {
        return this.bindings[hash];
    }
}

KeyHandler.prototype.keyRouter = function(jev) {
    let ev = jev.originalEvent; //Original event is better.
    const eventHashes = hashEvent(ev);
    for (let [type, hash] of Object.entries(eventHashes)) {
        if (this.bindings.hasOwnProperty(hash) && this.bindings[hash].hasOwnProperty(ev.type)) {
            this.bindings[hash][ev.type](jev);
        }
    }
}

// Normalize to key + type (the key here is not the same as the key property of an event)
KeyHandler.prototype.normalizeKey = function(key) {
    if (typeof key === 'string') { //Assume key
        let code = strToCode(key);
        if (code !== undefined) {
            return { key: code, type: 'code', ...this.modifiers }
        }
        return { key: key, type: 'key', ...this.modifiers }
    }
    // Otherwise assume object
    if (!key.hasOwnProperty('key')) {
        return {key: "Unidentified"};
    }
    const types = ['code', 'key'];
    let result = {key: key.key, ...this.modifiers};
    if (key.type && types.includes(key.type)) {
        if (key.type === 'keyCode') {
            throw new Error('keyCode is a deprecated feature and unsupported by this program');
        }
        result.type = key.type;
    } else {
        result.type = 'key';
    }
    for (let mod in this.modifiers) {
        if (key.hasOwnProperty(mod)) result[mod] = key[mod];
    }
    return result;
}

KeyHandler.prototype.resolveKey = function(hash) {
    let parts = hash.split(':');
    let result = {
        type: parts[0],
        key: parts[1],
    }
    let i = 0;
    for (let mod in this.modifiers) {
        result[mod] = parts[2][i] === 't' ? true : false;
    }
    return result;
}

function hashKey(key) {
    if (key.key === "Unidentified") return "Unidentified";
    return `${key.type}:${key.key}:`+(key.altKey?'t':'f')+(key.ctrlKey?'t':'f')+(key.metaKey?'t':'f')+(key.shiftKey?'t':'f');
}

function hashEvent(ev) {
    const types = ['code', 'key'];
    return types.reduce((carry, type) => {
        carry[type] = `${type}:${ev[type]}:`+(ev.altKey?'t':'f')+(ev.ctrlKey?'t':'f')+(ev.metaKey?'t':'f')+(ev.shiftKey?'t':'f');
        return carry;
    }, {});
}

function strToCode(str) {
    if (str in keyToCodeMap) return keyToCodeMap[str];
    if (str.match(/^n\d$/) != null) return `Numpad${str[1]}`;
    if (str.match(/^\d$/) != null) return [`Numpad${str}`, `Digit${str}`];
    if (str.match(/[a-zA-Z]/) != null) return `Key${str.toUpperCase()}`
    if (str.match(/^Key[A-Z]$/) != null) return str;
    if (keyCodes.includes(str)) return str;
    return undefined;
}

// q -> KeyQ
// n+ -> NumpadAdd, n1 -> Numpad1
// 1 -> Digit1 or Numpad1
const keyToCodeMap = {
    'Escape': 'Escape',
    '`': 'Backquote',
    '[': 'BracketLeft',
    ']': 'BracketRight',
    ';': 'Semicolon',
    '\'': 'Quote',
    '\\': 'Backslash',
    ',': 'Comma',
    '.': ['Period', 'NumpadDecimal'],
    '/': ['Slash', 'NumpadDivide'],
    '-': ['Minus', 'NumpadSubtract'],
    '*': 'NumpadMultiply',
    '+': 'NumpadAdd',
    '=': 'Equal',
    ' ': 'Space',
    'Control': ['ControlLeft', 'ControlRight'],
    'Shift': ['ShiftLeft', 'ShiftRight'],
    'Alt': ['AltLeft', 'AltRight'],
    'Meta': ['MetaLeft', 'MetaRight'],
    'Enter': ['Enter', 'NumpadEnter'],
    'nEnter': 'NumpadEnter',
    'n.': 'NumpadDecimal',
    'n+': 'NumpadAdd',
    'n-': 'NumpadSubtract',
    'n*': 'NumpadMultiply',
    'n/': 'NumpadDivide'
}

const keyCodes = Object.values(keyToCodeMap).flat();


export default KeyHandler
