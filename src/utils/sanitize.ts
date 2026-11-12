import DOMPurify from "dompurify";

/**
 * Shared notes are other people's HTML. Strip anything that can run script
 * before it is rendered on the app's own origin.
 */
export const sanitizeHtml = (html: string) =>
    DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
