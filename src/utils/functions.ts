/* eslint-disable @typescript-eslint/no-explicit-any */
import { decryptData, encryptData } from "./encryptions";

/**
 * Filter an object
 * @param  {[type]}   obj      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function filterObject(
    obj: any,
    callback: (val: any, key: string) => boolean
) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, val]) => callback(val, key))
    );
}

/**
 * Strip html tag an object
 * @param  {[string]}   txt
 * @return {[string]}
 */
export function stripTags(txt: string) {
    return `${txt}`.replace(/(<([^>]+)>)/gi, "");
}

/**
 * Convert Hex color to RGB/A
 * @param  {[type]} hex   [description]
 * @param  {[type]} alpha [description]
 * @return {[type]}       [description]
 */
export function hexToRGB(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Generate Random Color
 * @return {string} [Color code]
 */
export const generateRandomColor = (opacity: number) => {
    const characters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += characters[Math.floor(Math.random() * 16)];
    }
    if (opacity >= 0 && opacity <= 1) {
        return hexToRGB(color, opacity);
    }
    return color;
};
// check the item has children
export function hasChildren(item: any) {
    const { items: children } = item;

    if (children === undefined) {
        return false;
    }

    if (children.constructor !== Array) {
        return false;
    }

    if (children.length === 0) {
        return false;
    }

    return true;
}

/**
 * Generate random gradient
 * @param  {Boolean} radial [description]
 * @return {string}         [description]
 */
export const generateLinearGradient = (alpha = null) => {
    const direction = Math.round(Math.random() * 360);
    const r1 = Math.round(Math.random() * 255);
    const g1 = Math.round(Math.random() * 255);
    const b1 = Math.round(Math.random() * 255);
    const a1 =
        typeof alpha === "number" ? alpha : Math.round(Math.random() * 10) / 10;

    const r2 = Math.round(Math.random() * 255);
    const g2 = Math.round(Math.random() * 255);
    const b2 = Math.round(Math.random() * 255);
    const a2 =
        typeof alpha === "number" ? alpha : Math.round(Math.random() * 10) / 10;

    return `linear-gradient(${direction}deg, rgba(${r1},${g1},${b1},${a1}), rgba(${r2},${g2},${b2},${a2}))`;
};

export const generateRadialGradient = () => {
    const a1 = Math.round(Math.random() * 10) / 10;
    const a2 = Math.round(Math.random() * 10) / 10;
    const a3 = Math.round(Math.random() * 10) / 10;

    return `radial-gradient(ellipse, ${generateRandomColor(
        a1
    )}, ${generateRandomColor(a2)}, ${generateRandomColor(a3)})`;
};

/**
 * Generate random array
 * @param  {Number} limit [description]
 * @return {array}       newly generated array
 */
export function randomArray(limit = 10, unique = false) {
    if (!unique) {
        return Array.from({ length: limit }, () =>
            Math.floor(Math.random() * limit)
        );
    }
    return [
        ...new Set(
            Array.from({ length: limit * 2 }, () =>
                Math.floor(Math.random() * limit * 2)
            )
        ),
    ].slice(0, limit);
}
/**
 * Unique the array by key by keeping first match
 * @param  {[type]} array [description]
 * @param  {[type]} key   [description]
 * @return {[type]}       [description]
 */
export function uniqByKeepFirst(array: Array<any>, key: (item: any) => any) {
    if (!Array.isArray(array)) {
        return [];
    }
    const seen = new Set();
    return array.filter((item) => {
        const finder = key(item);
        return seen.has(finder) ? false : seen.add(finder);
    });
}
/**
 * * Unique the array by key by keeping last match
 * @param  {[type]} array [description]
 * @param  {[type]} key   [description]
 * @return {[type]}       [description]
 */
export function uniqByKeepLast(array: Array<any>, key: (item: any) => any) {
    if (!Array.isArray(array)) {
        return [];
    }
    return [...new Map(array.map((item) => [key(item), item])).values()];
}

/**
 * Pick object from another object
 * @param  {[type]} obj [description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
export function pick(obj: Record<any, any>, arr: Array<string>) {
    const newObj: Record<string, any> = {};
    arr.forEach((key) => {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}

/**
 * Check the password strength
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
export function passwordStrengthValidator(value: string) {
    const regexp = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).+$/;
    const strong = regexp.test(value);
    return strong;
}
/**
 * De-bounce
 * @param  {Function} callback [description]
 * @param  {[type]}   wait     [description]
 * @return {[type]}            [description]
 */
export function debounce(callback: (...props: any) => void, wait: number) {
    let timerId: NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback(...args);
        }, wait);
    };
}
/**
 * Chunk the array
 * @param  {array} inputArray
 * @param  {Number} chunk      divide to
 * @return {array}            new array
 */
export function arrayChunk(inputArray: Array<any>, chunk = 3) {
    if (!Array.isArray(inputArray)) {
        return [inputArray];
    }
    if (chunk < 0) {
        throw new Error("Invalid chunk size!");
    }
    return inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunk);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);
}

/**
 * Check the value is empty or not.
 * @param  {[type]}  value [description]
 * @return {Boolean} check the value is empty or not
 */
export function isEmpty(value: any) {
    if (typeof value === "undefined" || value === null || value === undefined) {
        return true;
    }
    if (Array.isArray(value) && value.length <= 0) {
        return true;
    }
    if (typeof value === "object") {
        return Object.values(value).filter((item) => item).length <= 0;
    }
    if (typeof value === "string") {
        return value.length <= 0;
    }
    if (typeof value === "number") {
        return value <= 0;
    }
    return false;
}

/**
 * Capitalize the text
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
export function capitalize(string: string) {
    if (isEmpty(string)) {
        return "";
    }
    const value = string.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * serialize the text
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
export function serializeText(string: string) {
    if (isEmpty(string)) {
        return "";
    }
    const value = string.toString().split("_").join(" ");
    return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Filter an object
 * @param  {[type]}   obj      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export const camelCaseToText = (str: string) =>
    capitalize(
        str.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`).trim()
    );

export function camelize(str: string) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, "");
}
/**
 * Download JSON Object as File
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * replace undefined with a empty string
 * @param  {[type]} string [description]
 * @return {[type]} string [description]
 */
export function replaceUndefinied(item: any) {
    const str = JSON.stringify(item, (_, value) =>
        value === undefined ? "" : value
    );
    return JSON.parse(str);
}

export const parseNote = (note = "") => {
    if (note.startsWith("<")) {
        return note;
    }
    return `${note}`
        .split("\n\n")
        .map((item) => `<p>${item}</p>`)
        .join("");
};

export function generateNoteId(noteId = "") {
    let id = noteId;
    if (id.startsWith("msar-")) {
        id = noteId.slice(5);
    }

    if (!id) {
        const randomId = Math.random().toString(36).substring(5, 15);
        return "note-" + randomId;
    }

    if (!id.startsWith("note-")) {
        return "note-" + id;
    }
    return id;
}

export function generateShareToken(noteId: string) {
    let readyForShare = noteId;
    if (noteId.startsWith("note-") || noteId.startsWith("msar-")) {
        readyForShare = noteId.slice(5);
    }

    return encryptData(`share-${readyForShare}`);
}

export function checkShareTokenIsValid(token: string) {
    const decryptedToken = decryptData(token);
    return decryptedToken.startsWith("share-");
}

export function generateNoteIdWithToken(id = "") {
    if (id.startsWith("note-")) {
        return "";
    }

    if (id.startsWith("msar-")) {
        let noteToken = encryptData(`note-${id.slice(5)}`);
        if (id.slice(5).startsWith("note-")) {
            noteToken = encryptData(`note-${id.slice(10)}`);
        }
        return `?token=${noteToken}`;
    }
    return "";
}

export function isJsonString(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
