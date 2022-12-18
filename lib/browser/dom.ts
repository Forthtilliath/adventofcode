/* Returns the first element that is a descendant of node that matches selectors. */
export const $ = document.querySelector.bind(document);
/* Returns all element descendants of node that match selectors. */
export const $$ = document.querySelectorAll.bind(document);