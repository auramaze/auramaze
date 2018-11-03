import {ContentState, convertFromHTML, EditorState} from 'draft-js';

export function generateHighlightContent(highlight) {
    if (highlight) {
        let content = '';
        let keys;

        keys = Object.keys(highlight).filter(key => key.startsWith('name'));
        content += keys.length ? `[name] <u>${highlight[keys[0]]}</u><br />` : '';

        keys = Object.keys(highlight).filter(key => key.startsWith('title'));
        content += keys.length ? `[title] <u>${highlight[keys[0]]}</u><br />` : '';

        keys = Object.keys(highlight).filter(key => key.startsWith('artist'));
        content += keys.length ? `[artist] <u>${highlight[keys[0]]}</u><br />` : '';

        keys = Object.keys(highlight).filter(key => key.startsWith('museum'));
        content += keys.length ? `[museum] <u>${highlight[keys[0]]}</u><br />` : '';

        keys = Object.keys(highlight).filter(key => key.startsWith('style'));
        content += keys.length ? `[style] <u>${highlight[keys[0]]}</u><br />` : '';

        keys = Object.keys(highlight).filter(key => key.startsWith('genre'));
        content += keys.length ? `[genre] <u>${highlight[keys[0]]}</u><br />` : '';

        const introductions = Object.keys(highlight)
            .filter(key => key.startsWith('introduction'))
            .reduce((arr, key) => arr.concat(highlight[key]), []);
        content += introductions.join(' ... ');

        return content;
    } else {
        return '';
    }
}

export function convertHTMLToEditorState(html) {
    const blocksFromHTML = html && convertFromHTML(html);
    const contentState = blocksFromHTML && ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
    );
    return contentState && EditorState.createWithContent(contentState);
}
