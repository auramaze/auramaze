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

export const noImage = 'data:image/png;base64,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';

export function getImageDefaultUrl(image) {
    return image && image.default && image.default.url
}

export function getImageDefaultWidth(image) {
    return image && image.default && image.default.width
}

export function getImageDefaultHeight(image) {
    return image && image.default && image.default.height
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
