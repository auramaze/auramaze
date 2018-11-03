import {ContentState, convertFromHTML, EditorState} from "draft-js";

export function generateHighlightContent(highlight) {
    if (highlight) {
        let content = '';

        content += 'name.default' in highlight ? `[name] ${highlight['name.default']}<br />` : '';
        content += 'title.default' in highlight ? `[title] ${highlight['title.default']}<br />` : '';
        content += 'artist.default' in highlight ? `[artist] ${highlight['artist.default']}<br />` : '';
        content += 'museum.default' in highlight ? `[museum] ${highlight['museum.default']}<br />` : '';
        content += 'style.default' in highlight ? `[style] ${highlight['style.default']}<br />` : '';
        content += 'genre.default' in highlight ? `[genre] ${highlight['genre.default']}<br />` : '';

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
