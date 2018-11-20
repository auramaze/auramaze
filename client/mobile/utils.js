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
