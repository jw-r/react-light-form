import getNative from './_getNative';

var defineProperty = (function () {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {
    console.log(e);
  }
})();

export default defineProperty;
