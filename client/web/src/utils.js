import {ContentState, convertFromHTML, EditorState} from 'draft-js';

export function generateHighlightContent(highlight) {
    if (highlight) {
        let content = '';
        const properties = ['name', 'title', 'artist', 'museum', 'style', 'genre'];

        for (let property of properties) {
            const keys = Object.keys(highlight).filter(key => key.startsWith(property));
            content += keys.length ? `[${property}] <u>${highlight[keys[0]]}</u><br />` : '';
        }

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

export function lockBody() {
    document.body.style.overflow = 'hidden';
    // document.body.style.position = 'fixed';
    // document.body.style.height = '100%';
    // document.body.style.width = '100%';
}

export function unlockBody() {
    document.body.style.overflow = 'visible';
    // document.body.style.position = 'static';
}

export const removeCookies = (cookies) => {
    cookies.remove('id', {path: '/'});
    cookies.remove('username', {path: '/'});
    cookies.remove('token', {path: '/'});
};

export const getLocaleValue = (object, language) => {
    return object && (language in object ? object[language] : object.default);
};

export const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const validateUsername = username => Boolean(username.match(/^(?!.*--)[a-z][a-z0-9-]{1,48}[a-z0-9]$/));

export const validatePassword = password => Boolean(password.match(/^[A-Za-z0-9#?!@$%^&*-]{4,}$/));
