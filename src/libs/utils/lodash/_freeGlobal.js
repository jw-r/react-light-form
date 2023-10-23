/** Detect free variable `global` from Node.js. */
// eslint-disable-next-line no-undef
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

export default freeGlobal;
