export type Refs = Record<string, HTMLElement>;
export type Collections = Record<string, HTMLElement[]>;

interface CompiledTemplate {
  refs: Refs;
  root: HTMLElement;
  collections: Collections;
}

export const compileTemplate = (HTML: string): CompiledTemplate => {
  const tmp = document.createElement('template');
  tmp.innerHTML = HTML;
  const DOM = tmp.content.firstElementChild;
  if (!DOM) throw new Error("Component's create() method should return HTML of Element");

  const refs: Refs = {};
  const collections: Collections = {};

  const allCollectionsReffed = DOM.querySelectorAll('[collection]');
  const allReffed = DOM.querySelectorAll('[ref]');

  allReffed.forEach((reffed) => {
    const refName = reffed.getAttribute('ref');
    if (!refName) throw new Error("Element's ref can not be empty");

    refs[refName] = reffed as HTMLElement;
    reffed.removeAttribute('ref');
  });

  allCollectionsReffed.forEach((reffed) => {
    const refName = reffed.getAttribute('collection');

    if (!refName) throw new Error("Element's collection can not be empty");
    if (!Array.isArray(collections[refName])) collections[refName] = [];
    collections[refName].push(reffed as HTMLElement);
  });

  return {
    root: DOM as HTMLElement,
    refs,
    collections,
  };
};
