// this file used on codepen as utilities
// powered by MIKOLOISM

console.log('[codepen.js] - running...');

/**
 * typeOf - Return Actual/Exact Type Of `$value`
 * @param {any} value - which value to return type
 * @return {string} type - exact type of `value`
 */
function typeOf(value) {
  let regex = /\[object (.*?)\]/i;
  let exactPrototype = Object.prototype.toString.call(value);
  let exactType = regex.exec(exactPrototype)[1];
  return exactType.toLowerCase();
}

/**
 * isType - check `value` be in `type`
 * @param {any} value - which value to equal type
 * @param {string} type - what type of equal
 * @return {boolean} isType - Resualt of Equalition [true|false]
 */
function isType(value, type) {
  // `type` should be passed and be {string|array[string]}
  if (!type && typeOf(type) !== 'string' && typeOf(type) !== 'array')
    return new Error(
      '[isType] : please, `type` argumant should be string or Array of types'
    );
  // if `type` is array, check some of type be match with value
  // ALT : type.some((t) => typeOf(value) === t);
  if (typeOf(type) === 'array') return type.indexOf(typeOf(value)) != -1;
  // only string type available, check value with type
  return typeOf(value) === type;
}

/**
 * isElement - check if `value` is Element|HTMLElement, return true, else, false
 * @param {any} value - which value to check if element
 * @param {?string} elementType - which element is, alike 'heading'|'div' etc.
 * @return {boolean} isElement - Resualt of Equalition [true|false]
 */
function isElement(value, type) {
  let regex = /^(HTML){0,1}.*?(Element){1}$/gi;
  let baseType = typeOf(value);
  let exactType = regex.exec(baseType);
  if (!type) return exactType.indexOf('element') != -1;
  return (
    exactType.indexOf('element') != -1 && exactType[2] === type.toLowerCase()
  );
}

/**
 * append - Append Children to Parent Elements
 * @param {HTMLElement} parent - parent HTMLElement Object
 * @param {Children=null} children - HTML String | HTML Object | Array of Child Object
 * @return {HTMLElement} element - Appended Elements to Parents
 */
function append(parent, children) {
  // if children is string
  // is textNode, then, appending to parent
  if (isType(children, 'text')) return parent.appendChild(children);
  if (isType(children, 'string'))
    // convert to textNode, and append to parent
    return parent.appendChild(document.createTextNode(children));
  // if children is array, return again each element of array to this function
  if (isType(children, 'array'))
    return children.map((child) => append(parent, child));
  // if children is HTMLElement|Element, appending
  if (isElement(children)) return parent.appendChild(children);
}

/**
 * createElement - Create Element as Annar Component
 * @param {string='div'} TagName
 * @param {?object=null} Props - Attributes/Properties
 * @param {?Children=null} children - HTML String | HTML Object | Array of Child Object
 * @return {HTMLElement} element - Created Element
 */
function createElement(tag, props, children) {
  let $this = document.createElement(tag);

  if (props) {
    Object.keys(props).forEach((attr) => {
      $this.setAttribute(attr, props[attr]);
    });
  }

  if (children) {
    append($this, children);
  }

  return $this;
}

function createFragment() {
  return document.createDocumentFragment();
}

function query(q) {
  return document.querySelector(q);
}
function queryAll(q) {
  return document.querySelectorAll(q);
}

/**
 * listener - Event Listener (alise `el.addEventListener`)
 * @param {string|HTMLElement} elemenr - Selector or HTML Element Objext
 * @param {string} event - Event
 * @param {Function} handler - A Function as Callback function when event trigger
 */
function listener(element, event, cb = () => {}, ...options) {
  // when element is html object
  if (isElement(element)) {
    return element.addEventListener(event, cb, ...options);
  }

  // when element is string selector
  if (isType(element, 'string')) {
    let elements = [...queryAll(element)];
    return elements.map(($this) => {
      return $this.addEventListener(event, cb, ...options);
    });
  }
}
