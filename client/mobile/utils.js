const seenKeys = {};
const MULTIPLIER = Math.pow(2, 24);

function generateRandomKey() {
    let key;
    while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
        key = Math.floor(Math.random() * MULTIPLIER).toString(32);
    }
    seenKeys[key] = true;
    return key;
}

export function convertTextToDraftjsContent(text) {
    const strings = text.split(/\r\n?|\n/g);
    const blocks = strings.map(string => ({
        "key": generateRandomKey(),
        "text": string,
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }));
    return {
        "blocks": blocks,
        "entityMap": {}
    }
}

export function isAuthValid(token) {
    return Boolean(token && token !== 'undefined' && token !== 'null');
}

export function parseAuth(token) {
    let result;
    switch (token) {
        case 'undefined':
            result = undefined;
            break;
        case 'null':
            result = null;
            break;
        default:
            result = token;
    }
    return result;
}

export function removeParentheses(text) {
    return text.replace(/\[(?:[^\]\[]|\[[^\]\[]*\])*\]/g, '').replace(/\((?:[^)(]|\([^)(]*\))*\)/g, '').replace(/【(?:[^】【]|（[^】【]*】)*】/g, '').replace(/（(?:[^）（]|（[^）（]*）)*）/g, '')
}

export async function checkResponseStatus(response, removeAuth) {
    let allOk, any401;
    if (Array.isArray(response)) {
        allOk = response.every(item => item.ok);
        any401 = response.some(item => item.status === 401);
    } else {
        allOk = response.ok;
        any401 = response.status === 401;
    }
    if (!allOk) {
        if (any401) {
            alert('Token invalid. Please log in again.');
            await removeAuth();
        } else {
            alert('Request failed. Please try again later.');
        }
    }
    return allOk;
}

export class OrderedSet {
    constructor(items = []) {
        this.ids = new Set();
        this.items = [];
        for (let item of items) {
            if (!this.ids.has(item.id.toString())) {
                this.ids.add(item.id.toString());
                this.items.push(item);
            }
        }
    }

    get size() {
        return this.items.length;
    }

    get length() {
        return this.items.length;
    }

    get(index) {
        return this.items[index];
    }

    forEach(fn) {
        this.items.forEach(fn);
    }

    map(fn) {
        return this.items.map(fn);
    }

    union(items) {
        for (let item of items) {
            if (!this.ids.has(item.id.toString())) {
                this.ids.add(item.id.toString());
                this.items.push(item);
            }
        }
        return this;
    }

    unionFront(items) {
        for (let item of items.reverse()) {
            if (!this.ids.has(item.id.toString())) {
                this.ids.add(item.id.toString());
                this.items.unshift(item);
            }
        }
        return this;
    }

    toArray() {
        return this.items;
    }

    toString() {
        return this.items.toString();
    }
}
