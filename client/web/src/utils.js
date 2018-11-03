import {ContentState, convertFromHTML, EditorState} from "draft-js";

export function generateHighlightContent(highlight) {
    if (highlight) {
        let content = '';

        content += 'name.default' in highlight ? `[name] <u>${highlight['name.default']}</u><br />` : '';
        content += 'title.default' in highlight ? `[title] <u>${highlight['title.default']}</u><br />` : '';
        content += 'artist.default' in highlight ? `[artist] <u>${highlight['artist.default']}</u><br />` : '';
        content += 'museum.default' in highlight ? `[museum] <u>${highlight['museum.default']}</u><br />` : '';
        content += 'style.default' in highlight ? `[style] <u>${highlight['style.default']}</u><br />` : '';
        content += 'genre.default' in highlight ? `[genre] <u>${highlight['genre.default']}</u><br />` : '';

        const introductions = Object.keys(highlight)
            .filter(key => key.startsWith('introduction'))
            .reduce((arr, key) => arr.concat(highlight[key]), []);
        content += introductions.join(' ...<br />');

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
