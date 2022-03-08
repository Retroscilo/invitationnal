// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"node_modules/@babel/runtime-corejs2/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime.js"}],"node_modules/core-js/library/modules/es6.object.to-string.js":[function(require,module,exports) {

},{}],"node_modules/core-js/library/modules/_to-integer.js":[function(require,module,exports) {
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],"node_modules/core-js/library/modules/_defined.js":[function(require,module,exports) {
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],"node_modules/core-js/library/modules/_string-at.js":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_to-integer":"node_modules/core-js/library/modules/_to-integer.js","./_defined":"node_modules/core-js/library/modules/_defined.js"}],"node_modules/core-js/library/modules/_library.js":[function(require,module,exports) {
module.exports = true;

},{}],"node_modules/core-js/library/modules/_global.js":[function(require,module,exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],"node_modules/core-js/library/modules/_core.js":[function(require,module,exports) {
var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],"node_modules/core-js/library/modules/_a-function.js":[function(require,module,exports) {
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],"node_modules/core-js/library/modules/_ctx.js":[function(require,module,exports) {
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":"node_modules/core-js/library/modules/_a-function.js"}],"node_modules/core-js/library/modules/_is-object.js":[function(require,module,exports) {
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],"node_modules/core-js/library/modules/_an-object.js":[function(require,module,exports) {
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":"node_modules/core-js/library/modules/_is-object.js"}],"node_modules/core-js/library/modules/_fails.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],"node_modules/core-js/library/modules/_descriptors.js":[function(require,module,exports) {
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":"node_modules/core-js/library/modules/_fails.js"}],"node_modules/core-js/library/modules/_dom-create.js":[function(require,module,exports) {
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_is-object":"node_modules/core-js/library/modules/_is-object.js","./_global":"node_modules/core-js/library/modules/_global.js"}],"node_modules/core-js/library/modules/_ie8-dom-define.js":[function(require,module,exports) {
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":"node_modules/core-js/library/modules/_descriptors.js","./_fails":"node_modules/core-js/library/modules/_fails.js","./_dom-create":"node_modules/core-js/library/modules/_dom-create.js"}],"node_modules/core-js/library/modules/_to-primitive.js":[function(require,module,exports) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":"node_modules/core-js/library/modules/_is-object.js"}],"node_modules/core-js/library/modules/_object-dp.js":[function(require,module,exports) {
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_ie8-dom-define":"node_modules/core-js/library/modules/_ie8-dom-define.js","./_to-primitive":"node_modules/core-js/library/modules/_to-primitive.js","./_descriptors":"node_modules/core-js/library/modules/_descriptors.js"}],"node_modules/core-js/library/modules/_property-desc.js":[function(require,module,exports) {
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],"node_modules/core-js/library/modules/_hide.js":[function(require,module,exports) {
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_object-dp":"node_modules/core-js/library/modules/_object-dp.js","./_property-desc":"node_modules/core-js/library/modules/_property-desc.js","./_descriptors":"node_modules/core-js/library/modules/_descriptors.js"}],"node_modules/core-js/library/modules/_has.js":[function(require,module,exports) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],"node_modules/core-js/library/modules/_export.js":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_global":"node_modules/core-js/library/modules/_global.js","./_core":"node_modules/core-js/library/modules/_core.js","./_ctx":"node_modules/core-js/library/modules/_ctx.js","./_hide":"node_modules/core-js/library/modules/_hide.js","./_has":"node_modules/core-js/library/modules/_has.js"}],"node_modules/core-js/library/modules/_redefine.js":[function(require,module,exports) {
module.exports = require('./_hide');

},{"./_hide":"node_modules/core-js/library/modules/_hide.js"}],"node_modules/core-js/library/modules/_iterators.js":[function(require,module,exports) {
module.exports = {};

},{}],"node_modules/core-js/library/modules/_cof.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],"node_modules/core-js/library/modules/_iobject.js":[function(require,module,exports) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":"node_modules/core-js/library/modules/_cof.js"}],"node_modules/core-js/library/modules/_to-iobject.js":[function(require,module,exports) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_iobject":"node_modules/core-js/library/modules/_iobject.js","./_defined":"node_modules/core-js/library/modules/_defined.js"}],"node_modules/core-js/library/modules/_to-length.js":[function(require,module,exports) {
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":"node_modules/core-js/library/modules/_to-integer.js"}],"node_modules/core-js/library/modules/_to-absolute-index.js":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":"node_modules/core-js/library/modules/_to-integer.js"}],"node_modules/core-js/library/modules/_array-includes.js":[function(require,module,exports) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-iobject":"node_modules/core-js/library/modules/_to-iobject.js","./_to-length":"node_modules/core-js/library/modules/_to-length.js","./_to-absolute-index":"node_modules/core-js/library/modules/_to-absolute-index.js"}],"node_modules/core-js/library/modules/_shared.js":[function(require,module,exports) {

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":"node_modules/core-js/library/modules/_core.js","./_global":"node_modules/core-js/library/modules/_global.js","./_library":"node_modules/core-js/library/modules/_library.js"}],"node_modules/core-js/library/modules/_uid.js":[function(require,module,exports) {
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],"node_modules/core-js/library/modules/_shared-key.js":[function(require,module,exports) {
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":"node_modules/core-js/library/modules/_shared.js","./_uid":"node_modules/core-js/library/modules/_uid.js"}],"node_modules/core-js/library/modules/_object-keys-internal.js":[function(require,module,exports) {
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_has":"node_modules/core-js/library/modules/_has.js","./_to-iobject":"node_modules/core-js/library/modules/_to-iobject.js","./_array-includes":"node_modules/core-js/library/modules/_array-includes.js","./_shared-key":"node_modules/core-js/library/modules/_shared-key.js"}],"node_modules/core-js/library/modules/_enum-bug-keys.js":[function(require,module,exports) {
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],"node_modules/core-js/library/modules/_object-keys.js":[function(require,module,exports) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_object-keys-internal":"node_modules/core-js/library/modules/_object-keys-internal.js","./_enum-bug-keys":"node_modules/core-js/library/modules/_enum-bug-keys.js"}],"node_modules/core-js/library/modules/_object-dps.js":[function(require,module,exports) {
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_object-dp":"node_modules/core-js/library/modules/_object-dp.js","./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_object-keys":"node_modules/core-js/library/modules/_object-keys.js","./_descriptors":"node_modules/core-js/library/modules/_descriptors.js"}],"node_modules/core-js/library/modules/_html.js":[function(require,module,exports) {
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":"node_modules/core-js/library/modules/_global.js"}],"node_modules/core-js/library/modules/_object-create.js":[function(require,module,exports) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_object-dps":"node_modules/core-js/library/modules/_object-dps.js","./_enum-bug-keys":"node_modules/core-js/library/modules/_enum-bug-keys.js","./_shared-key":"node_modules/core-js/library/modules/_shared-key.js","./_dom-create":"node_modules/core-js/library/modules/_dom-create.js","./_html":"node_modules/core-js/library/modules/_html.js"}],"node_modules/core-js/library/modules/_wks.js":[function(require,module,exports) {
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_shared":"node_modules/core-js/library/modules/_shared.js","./_uid":"node_modules/core-js/library/modules/_uid.js","./_global":"node_modules/core-js/library/modules/_global.js"}],"node_modules/core-js/library/modules/_set-to-string-tag.js":[function(require,module,exports) {
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_object-dp":"node_modules/core-js/library/modules/_object-dp.js","./_has":"node_modules/core-js/library/modules/_has.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_iter-create.js":[function(require,module,exports) {
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_object-create":"node_modules/core-js/library/modules/_object-create.js","./_property-desc":"node_modules/core-js/library/modules/_property-desc.js","./_set-to-string-tag":"node_modules/core-js/library/modules/_set-to-string-tag.js","./_hide":"node_modules/core-js/library/modules/_hide.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_to-object.js":[function(require,module,exports) {
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":"node_modules/core-js/library/modules/_defined.js"}],"node_modules/core-js/library/modules/_object-gpo.js":[function(require,module,exports) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":"node_modules/core-js/library/modules/_has.js","./_to-object":"node_modules/core-js/library/modules/_to-object.js","./_shared-key":"node_modules/core-js/library/modules/_shared-key.js"}],"node_modules/core-js/library/modules/_iter-define.js":[function(require,module,exports) {
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_library":"node_modules/core-js/library/modules/_library.js","./_export":"node_modules/core-js/library/modules/_export.js","./_redefine":"node_modules/core-js/library/modules/_redefine.js","./_hide":"node_modules/core-js/library/modules/_hide.js","./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_iter-create":"node_modules/core-js/library/modules/_iter-create.js","./_set-to-string-tag":"node_modules/core-js/library/modules/_set-to-string-tag.js","./_object-gpo":"node_modules/core-js/library/modules/_object-gpo.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/es6.string.iterator.js":[function(require,module,exports) {
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_string-at":"node_modules/core-js/library/modules/_string-at.js","./_iter-define":"node_modules/core-js/library/modules/_iter-define.js"}],"node_modules/core-js/library/modules/_add-to-unscopables.js":[function(require,module,exports) {
module.exports = function () { /* empty */ };

},{}],"node_modules/core-js/library/modules/_iter-step.js":[function(require,module,exports) {
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],"node_modules/core-js/library/modules/es6.array.iterator.js":[function(require,module,exports) {
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":"node_modules/core-js/library/modules/_add-to-unscopables.js","./_iter-step":"node_modules/core-js/library/modules/_iter-step.js","./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_to-iobject":"node_modules/core-js/library/modules/_to-iobject.js","./_iter-define":"node_modules/core-js/library/modules/_iter-define.js"}],"node_modules/core-js/library/modules/web.dom.iterable.js":[function(require,module,exports) {

require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./es6.array.iterator":"node_modules/core-js/library/modules/es6.array.iterator.js","./_global":"node_modules/core-js/library/modules/_global.js","./_hide":"node_modules/core-js/library/modules/_hide.js","./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_classof.js":[function(require,module,exports) {
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":"node_modules/core-js/library/modules/_cof.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_an-instance.js":[function(require,module,exports) {
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],"node_modules/core-js/library/modules/_iter-call.js":[function(require,module,exports) {
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js"}],"node_modules/core-js/library/modules/_is-array-iter.js":[function(require,module,exports) {
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/core.get-iterator-method.js":[function(require,module,exports) {
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":"node_modules/core-js/library/modules/_classof.js","./_wks":"node_modules/core-js/library/modules/_wks.js","./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_core":"node_modules/core-js/library/modules/_core.js"}],"node_modules/core-js/library/modules/_for-of.js":[function(require,module,exports) {
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_ctx":"node_modules/core-js/library/modules/_ctx.js","./_iter-call":"node_modules/core-js/library/modules/_iter-call.js","./_is-array-iter":"node_modules/core-js/library/modules/_is-array-iter.js","./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_to-length":"node_modules/core-js/library/modules/_to-length.js","./core.get-iterator-method":"node_modules/core-js/library/modules/core.get-iterator-method.js"}],"node_modules/core-js/library/modules/_species-constructor.js":[function(require,module,exports) {
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_a-function":"node_modules/core-js/library/modules/_a-function.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_invoke.js":[function(require,module,exports) {
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],"node_modules/core-js/library/modules/_task.js":[function(require,module,exports) {


var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_ctx":"node_modules/core-js/library/modules/_ctx.js","./_invoke":"node_modules/core-js/library/modules/_invoke.js","./_html":"node_modules/core-js/library/modules/_html.js","./_dom-create":"node_modules/core-js/library/modules/_dom-create.js","./_global":"node_modules/core-js/library/modules/_global.js","./_cof":"node_modules/core-js/library/modules/_cof.js"}],"node_modules/core-js/library/modules/_microtask.js":[function(require,module,exports) {


var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_global":"node_modules/core-js/library/modules/_global.js","./_task":"node_modules/core-js/library/modules/_task.js","./_cof":"node_modules/core-js/library/modules/_cof.js"}],"node_modules/core-js/library/modules/_new-promise-capability.js":[function(require,module,exports) {
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":"node_modules/core-js/library/modules/_a-function.js"}],"node_modules/core-js/library/modules/_perform.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],"node_modules/core-js/library/modules/_user-agent.js":[function(require,module,exports) {

var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":"node_modules/core-js/library/modules/_global.js"}],"node_modules/core-js/library/modules/_promise-resolve.js":[function(require,module,exports) {
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_is-object":"node_modules/core-js/library/modules/_is-object.js","./_new-promise-capability":"node_modules/core-js/library/modules/_new-promise-capability.js"}],"node_modules/core-js/library/modules/_redefine-all.js":[function(require,module,exports) {
var hide = require('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":"node_modules/core-js/library/modules/_hide.js"}],"node_modules/core-js/library/modules/_set-species.js":[function(require,module,exports) {

'use strict';
var global = require('./_global');
var core = require('./_core');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_global":"node_modules/core-js/library/modules/_global.js","./_core":"node_modules/core-js/library/modules/_core.js","./_object-dp":"node_modules/core-js/library/modules/_object-dp.js","./_descriptors":"node_modules/core-js/library/modules/_descriptors.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_iter-detect.js":[function(require,module,exports) {
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/es6.promise.js":[function(require,module,exports) {


'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_library":"node_modules/core-js/library/modules/_library.js","./_global":"node_modules/core-js/library/modules/_global.js","./_ctx":"node_modules/core-js/library/modules/_ctx.js","./_classof":"node_modules/core-js/library/modules/_classof.js","./_export":"node_modules/core-js/library/modules/_export.js","./_is-object":"node_modules/core-js/library/modules/_is-object.js","./_a-function":"node_modules/core-js/library/modules/_a-function.js","./_an-instance":"node_modules/core-js/library/modules/_an-instance.js","./_for-of":"node_modules/core-js/library/modules/_for-of.js","./_species-constructor":"node_modules/core-js/library/modules/_species-constructor.js","./_task":"node_modules/core-js/library/modules/_task.js","./_microtask":"node_modules/core-js/library/modules/_microtask.js","./_new-promise-capability":"node_modules/core-js/library/modules/_new-promise-capability.js","./_perform":"node_modules/core-js/library/modules/_perform.js","./_user-agent":"node_modules/core-js/library/modules/_user-agent.js","./_promise-resolve":"node_modules/core-js/library/modules/_promise-resolve.js","./_wks":"node_modules/core-js/library/modules/_wks.js","./_redefine-all":"node_modules/core-js/library/modules/_redefine-all.js","./_set-to-string-tag":"node_modules/core-js/library/modules/_set-to-string-tag.js","./_set-species":"node_modules/core-js/library/modules/_set-species.js","./_core":"node_modules/core-js/library/modules/_core.js","./_iter-detect":"node_modules/core-js/library/modules/_iter-detect.js"}],"node_modules/core-js/library/modules/es7.promise.finally.js":[function(require,module,exports) {

// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_export":"node_modules/core-js/library/modules/_export.js","./_core":"node_modules/core-js/library/modules/_core.js","./_global":"node_modules/core-js/library/modules/_global.js","./_species-constructor":"node_modules/core-js/library/modules/_species-constructor.js","./_promise-resolve":"node_modules/core-js/library/modules/_promise-resolve.js"}],"node_modules/core-js/library/modules/es7.promise.try.js":[function(require,module,exports) {
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":"node_modules/core-js/library/modules/_export.js","./_new-promise-capability":"node_modules/core-js/library/modules/_new-promise-capability.js","./_perform":"node_modules/core-js/library/modules/_perform.js"}],"node_modules/core-js/library/fn/promise.js":[function(require,module,exports) {
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
require('../modules/es7.promise.finally');
require('../modules/es7.promise.try');
module.exports = require('../modules/_core').Promise;

},{"../modules/es6.object.to-string":"node_modules/core-js/library/modules/es6.object.to-string.js","../modules/es6.string.iterator":"node_modules/core-js/library/modules/es6.string.iterator.js","../modules/web.dom.iterable":"node_modules/core-js/library/modules/web.dom.iterable.js","../modules/es6.promise":"node_modules/core-js/library/modules/es6.promise.js","../modules/es7.promise.finally":"node_modules/core-js/library/modules/es7.promise.finally.js","../modules/es7.promise.try":"node_modules/core-js/library/modules/es7.promise.try.js","../modules/_core":"node_modules/core-js/library/modules/_core.js"}],"node_modules/@babel/runtime-corejs2/core-js/promise.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/promise");
},{"core-js/library/fn/promise":"node_modules/core-js/library/fn/promise.js"}],"node_modules/@babel/runtime-corejs2/helpers/asyncToGenerator.js":[function(require,module,exports) {
var _Promise = require("@babel/runtime-corejs2/core-js/promise");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    _Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new _Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{"@babel/runtime-corejs2/core-js/promise":"node_modules/@babel/runtime-corejs2/core-js/promise.js"}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/parallax-js/dist/parallax.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;

    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }

    g.Parallax = f();
  }
})(function () {
  var define, module, exports;
  return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }

        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }

      return n[o].exports;
    }

    var i = typeof require == "function" && require;

    for (var o = 0; o < r.length; o++) s(r[o]);

    return s;
  }({
    1: [function (require, module, exports) {
      /*
      object-assign
      (c) Sindre Sorhus
      @license MIT
      */
      'use strict';
      /* eslint-disable no-unused-vars */

      var getOwnPropertySymbols = Object.getOwnPropertySymbols;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var propIsEnumerable = Object.prototype.propertyIsEnumerable;

      function toObject(val) {
        if (val === null || val === undefined) {
          throw new TypeError('Object.assign cannot be called with null or undefined');
        }

        return Object(val);
      }

      function shouldUseNative() {
        try {
          if (!Object.assign) {
            return false;
          } // Detect buggy property enumeration order in older V8 versions.
          // https://bugs.chromium.org/p/v8/issues/detail?id=4118


          var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

          test1[5] = 'de';

          if (Object.getOwnPropertyNames(test1)[0] === '5') {
            return false;
          } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


          var test2 = {};

          for (var i = 0; i < 10; i++) {
            test2['_' + String.fromCharCode(i)] = i;
          }

          var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
            return test2[n];
          });

          if (order2.join('') !== '0123456789') {
            return false;
          } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


          var test3 = {};
          'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
            test3[letter] = letter;
          });

          if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
            return false;
          }

          return true;
        } catch (err) {
          // We don't expect any of the above to throw, but better to be safe.
          return false;
        }
      }

      module.exports = shouldUseNative() ? Object.assign : function (target, source) {
        var from;
        var to = toObject(target);
        var symbols;

        for (var s = 1; s < arguments.length; s++) {
          from = Object(arguments[s]);

          for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
              to[key] = from[key];
            }
          }

          if (getOwnPropertySymbols) {
            symbols = getOwnPropertySymbols(from);

            for (var i = 0; i < symbols.length; i++) {
              if (propIsEnumerable.call(from, symbols[i])) {
                to[symbols[i]] = from[symbols[i]];
              }
            }
          }
        }

        return to;
      };
    }, {}],
    2: [function (require, module, exports) {
      (function (process) {
        // Generated by CoffeeScript 1.12.2
        (function () {
          var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

          if (typeof performance !== "undefined" && performance !== null && performance.now) {
            module.exports = function () {
              return performance.now();
            };
          } else if (typeof process !== "undefined" && process !== null && process.hrtime) {
            module.exports = function () {
              return (getNanoSeconds() - nodeLoadTime) / 1e6;
            };

            hrtime = process.hrtime;

            getNanoSeconds = function () {
              var hr;
              hr = hrtime();
              return hr[0] * 1e9 + hr[1];
            };

            moduleLoadTime = getNanoSeconds();
            upTime = process.uptime() * 1e9;
            nodeLoadTime = moduleLoadTime - upTime;
          } else if (Date.now) {
            module.exports = function () {
              return Date.now() - loadTime;
            };

            loadTime = Date.now();
          } else {
            module.exports = function () {
              return new Date().getTime() - loadTime;
            };

            loadTime = new Date().getTime();
          }
        }).call(this);
      }).call(this, require('_process'));
    }, {
      "_process": 3
    }],
    3: [function (require, module, exports) {
      // shim for using process in browser
      var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }

      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }

      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }

        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();

      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        } // if setTimeout wasn't available but was latter defined


        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }

        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }

      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        } // if clearTimeout wasn't available but was latter defined


        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }

        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }

      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;

      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }

        draining = false;

        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }

        if (queue.length) {
          drainQueue();
        }
      }

      function drainQueue() {
        if (draining) {
          return;
        }

        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;

        while (len) {
          currentQueue = queue;
          queue = [];

          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }

          queueIndex = -1;
          len = queue.length;
        }

        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }

      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);

        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }

        queue.push(new Item(fun, args));

        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      }; // v8 likes predictible objects


      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }

      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };

      process.title = 'browser';
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues

      process.versions = {};

      function noop() {}

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) {
        return [];
      };

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      process.cwd = function () {
        return '/';
      };

      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };

      process.umask = function () {
        return 0;
      };
    }, {}],
    4: [function (require, module, exports) {
      (function (global) {
        var now = require('performance-now'),
            root = typeof window === 'undefined' ? global : window,
            vendors = ['moz', 'webkit'],
            suffix = 'AnimationFrame',
            raf = root['request' + suffix],
            caf = root['cancel' + suffix] || root['cancelRequest' + suffix];

        for (var i = 0; !raf && i < vendors.length; i++) {
          raf = root[vendors[i] + 'Request' + suffix];
          caf = root[vendors[i] + 'Cancel' + suffix] || root[vendors[i] + 'CancelRequest' + suffix];
        } // Some versions of FF have rAF but not cAF


        if (!raf || !caf) {
          var last = 0,
              id = 0,
              queue = [],
              frameDuration = 1000 / 60;

          raf = function (callback) {
            if (queue.length === 0) {
              var _now = now(),
                  next = Math.max(0, frameDuration - (_now - last));

              last = next + _now;
              setTimeout(function () {
                var cp = queue.slice(0); // Clear queue here to prevent
                // callbacks from appending listeners
                // to the current frame's queue

                queue.length = 0;

                for (var i = 0; i < cp.length; i++) {
                  if (!cp[i].cancelled) {
                    try {
                      cp[i].callback(last);
                    } catch (e) {
                      setTimeout(function () {
                        throw e;
                      }, 0);
                    }
                  }
                }
              }, Math.round(next));
            }

            queue.push({
              handle: ++id,
              callback: callback,
              cancelled: false
            });
            return id;
          };

          caf = function (handle) {
            for (var i = 0; i < queue.length; i++) {
              if (queue[i].handle === handle) {
                queue[i].cancelled = true;
              }
            }
          };
        }

        module.exports = function (fn) {
          // Wrap in a new function to prevent
          // `cancel` potentially being assigned
          // to the native rAF function
          return raf.call(root, fn);
        };

        module.exports.cancel = function () {
          caf.apply(root, arguments);
        };

        module.exports.polyfill = function () {
          root.requestAnimationFrame = raf;
          root.cancelAnimationFrame = caf;
        };
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "performance-now": 2
    }],
    5: [function (require, module, exports) {
      'use strict';

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      /**
      * Parallax.js
      * @author Matthew Wagerfield - @wagerfield, René Roth - mail@reneroth.org
      * @description Creates a parallax effect between an array of layers,
      *              driving the motion from the gyroscope output of a smartdevice.
      *              If no gyroscope is available, the cursor position is used.
      */


      var rqAnFr = require('raf');

      var objectAssign = require('object-assign');

      var helpers = {
        propertyCache: {},
        vendors: [null, ['-webkit-', 'webkit'], ['-moz-', 'Moz'], ['-o-', 'O'], ['-ms-', 'ms']],
        clamp: function clamp(value, min, max) {
          return min < max ? value < min ? min : value > max ? max : value : value < max ? max : value > min ? min : value;
        },
        data: function data(element, name) {
          return helpers.deserialize(element.getAttribute('data-' + name));
        },
        deserialize: function deserialize(value) {
          if (value === 'true') {
            return true;
          } else if (value === 'false') {
            return false;
          } else if (value === 'null') {
            return null;
          } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
            return parseFloat(value);
          } else {
            return value;
          }
        },
        camelCase: function camelCase(value) {
          return value.replace(/-+(.)?/g, function (match, character) {
            return character ? character.toUpperCase() : '';
          });
        },
        accelerate: function accelerate(element) {
          helpers.css(element, 'transform', 'translate3d(0,0,0) rotate(0.0001deg)');
          helpers.css(element, 'transform-style', 'preserve-3d');
          helpers.css(element, 'backface-visibility', 'hidden');
        },
        transformSupport: function transformSupport(value) {
          var element = document.createElement('div'),
              propertySupport = false,
              propertyValue = null,
              featureSupport = false,
              cssProperty = null,
              jsProperty = null;

          for (var i = 0, l = helpers.vendors.length; i < l; i++) {
            if (helpers.vendors[i] !== null) {
              cssProperty = helpers.vendors[i][0] + 'transform';
              jsProperty = helpers.vendors[i][1] + 'Transform';
            } else {
              cssProperty = 'transform';
              jsProperty = 'transform';
            }

            if (element.style[jsProperty] !== undefined) {
              propertySupport = true;
              break;
            }
          }

          switch (value) {
            case '2D':
              featureSupport = propertySupport;
              break;

            case '3D':
              if (propertySupport) {
                var body = document.body || document.createElement('body'),
                    documentElement = document.documentElement,
                    documentOverflow = documentElement.style.overflow,
                    isCreatedBody = false;

                if (!document.body) {
                  isCreatedBody = true;
                  documentElement.style.overflow = 'hidden';
                  documentElement.appendChild(body);
                  body.style.overflow = 'hidden';
                  body.style.background = '';
                }

                body.appendChild(element);
                element.style[jsProperty] = 'translate3d(1px,1px,1px)';
                propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
                featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== 'none';
                documentElement.style.overflow = documentOverflow;
                body.removeChild(element);

                if (isCreatedBody) {
                  body.removeAttribute('style');
                  body.parentNode.removeChild(body);
                }
              }

              break;
          }

          return featureSupport;
        },
        css: function css(element, property, value) {
          var jsProperty = helpers.propertyCache[property];

          if (!jsProperty) {
            for (var i = 0, l = helpers.vendors.length; i < l; i++) {
              if (helpers.vendors[i] !== null) {
                jsProperty = helpers.camelCase(helpers.vendors[i][1] + '-' + property);
              } else {
                jsProperty = property;
              }

              if (element.style[jsProperty] !== undefined) {
                helpers.propertyCache[property] = jsProperty;
                break;
              }
            }
          }

          element.style[jsProperty] = value;
        }
      };
      var MAGIC_NUMBER = 30,
          DEFAULTS = {
        relativeInput: false,
        clipRelativeInput: false,
        inputElement: null,
        hoverOnly: false,
        calibrationThreshold: 100,
        calibrationDelay: 500,
        supportDelay: 500,
        calibrateX: false,
        calibrateY: true,
        invertX: true,
        invertY: true,
        limitX: false,
        limitY: false,
        scalarX: 10.0,
        scalarY: 10.0,
        frictionX: 0.1,
        frictionY: 0.1,
        originX: 0.5,
        originY: 0.5,
        pointerEvents: false,
        precision: 1,
        onReady: null,
        selector: null
      };

      var Parallax = function () {
        function Parallax(element, options) {
          _classCallCheck(this, Parallax);

          this.element = element;
          var data = {
            calibrateX: helpers.data(this.element, 'calibrate-x'),
            calibrateY: helpers.data(this.element, 'calibrate-y'),
            invertX: helpers.data(this.element, 'invert-x'),
            invertY: helpers.data(this.element, 'invert-y'),
            limitX: helpers.data(this.element, 'limit-x'),
            limitY: helpers.data(this.element, 'limit-y'),
            scalarX: helpers.data(this.element, 'scalar-x'),
            scalarY: helpers.data(this.element, 'scalar-y'),
            frictionX: helpers.data(this.element, 'friction-x'),
            frictionY: helpers.data(this.element, 'friction-y'),
            originX: helpers.data(this.element, 'origin-x'),
            originY: helpers.data(this.element, 'origin-y'),
            pointerEvents: helpers.data(this.element, 'pointer-events'),
            precision: helpers.data(this.element, 'precision'),
            relativeInput: helpers.data(this.element, 'relative-input'),
            clipRelativeInput: helpers.data(this.element, 'clip-relative-input'),
            hoverOnly: helpers.data(this.element, 'hover-only'),
            inputElement: document.querySelector(helpers.data(this.element, 'input-element')),
            selector: helpers.data(this.element, 'selector')
          };

          for (var key in data) {
            if (data[key] === null) {
              delete data[key];
            }
          }

          objectAssign(this, DEFAULTS, data, options);

          if (!this.inputElement) {
            this.inputElement = this.element;
          }

          this.calibrationTimer = null;
          this.calibrationFlag = true;
          this.enabled = false;
          this.depthsX = [];
          this.depthsY = [];
          this.raf = null;
          this.bounds = null;
          this.elementPositionX = 0;
          this.elementPositionY = 0;
          this.elementWidth = 0;
          this.elementHeight = 0;
          this.elementCenterX = 0;
          this.elementCenterY = 0;
          this.elementRangeX = 0;
          this.elementRangeY = 0;
          this.calibrationX = 0;
          this.calibrationY = 0;
          this.inputX = 0;
          this.inputY = 0;
          this.motionX = 0;
          this.motionY = 0;
          this.velocityX = 0;
          this.velocityY = 0;
          this.onMouseMove = this.onMouseMove.bind(this);
          this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
          this.onDeviceMotion = this.onDeviceMotion.bind(this);
          this.onOrientationTimer = this.onOrientationTimer.bind(this);
          this.onMotionTimer = this.onMotionTimer.bind(this);
          this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
          this.onAnimationFrame = this.onAnimationFrame.bind(this);
          this.onWindowResize = this.onWindowResize.bind(this);
          this.windowWidth = null;
          this.windowHeight = null;
          this.windowCenterX = null;
          this.windowCenterY = null;
          this.windowRadiusX = null;
          this.windowRadiusY = null;
          this.portrait = false;
          this.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
          this.motionSupport = !!window.DeviceMotionEvent && !this.desktop;
          this.orientationSupport = !!window.DeviceOrientationEvent && !this.desktop;
          this.orientationStatus = 0;
          this.motionStatus = 0;
          this.initialise();
        }

        _createClass(Parallax, [{
          key: 'initialise',
          value: function initialise() {
            if (this.transform2DSupport === undefined) {
              this.transform2DSupport = helpers.transformSupport('2D');
              this.transform3DSupport = helpers.transformSupport('3D');
            } // Configure Context Styles


            if (this.transform3DSupport) {
              helpers.accelerate(this.element);
            }

            var style = window.getComputedStyle(this.element);

            if (style.getPropertyValue('position') === 'static') {
              this.element.style.position = 'relative';
            } // Pointer events


            if (!this.pointerEvents) {
              this.element.style.pointerEvents = 'none';
            } // Setup


            this.updateLayers();
            this.updateDimensions();
            this.enable();
            this.queueCalibration(this.calibrationDelay);
          }
        }, {
          key: 'doReadyCallback',
          value: function doReadyCallback() {
            if (this.onReady) {
              this.onReady();
            }
          }
        }, {
          key: 'updateLayers',
          value: function updateLayers() {
            if (this.selector) {
              this.layers = this.element.querySelectorAll(this.selector);
            } else {
              this.layers = this.element.children;
            }

            if (!this.layers.length) {
              console.warn('ParallaxJS: Your scene does not have any layers.');
            }

            this.depthsX = [];
            this.depthsY = [];

            for (var index = 0; index < this.layers.length; index++) {
              var layer = this.layers[index];

              if (this.transform3DSupport) {
                helpers.accelerate(layer);
              }

              layer.style.position = index ? 'absolute' : 'relative';
              layer.style.display = 'block';
              layer.style.left = 0;
              layer.style.top = 0;
              var depth = helpers.data(layer, 'depth') || 0;
              this.depthsX.push(helpers.data(layer, 'depth-x') || depth);
              this.depthsY.push(helpers.data(layer, 'depth-y') || depth);
            }
          }
        }, {
          key: 'updateDimensions',
          value: function updateDimensions() {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            this.windowCenterX = this.windowWidth * this.originX;
            this.windowCenterY = this.windowHeight * this.originY;
            this.windowRadiusX = Math.max(this.windowCenterX, this.windowWidth - this.windowCenterX);
            this.windowRadiusY = Math.max(this.windowCenterY, this.windowHeight - this.windowCenterY);
          }
        }, {
          key: 'updateBounds',
          value: function updateBounds() {
            this.bounds = this.inputElement.getBoundingClientRect();
            this.elementPositionX = this.bounds.left;
            this.elementPositionY = this.bounds.top;
            this.elementWidth = this.bounds.width;
            this.elementHeight = this.bounds.height;
            this.elementCenterX = this.elementWidth * this.originX;
            this.elementCenterY = this.elementHeight * this.originY;
            this.elementRangeX = Math.max(this.elementCenterX, this.elementWidth - this.elementCenterX);
            this.elementRangeY = Math.max(this.elementCenterY, this.elementHeight - this.elementCenterY);
          }
        }, {
          key: 'queueCalibration',
          value: function queueCalibration(delay) {
            clearTimeout(this.calibrationTimer);
            this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay);
          }
        }, {
          key: 'enable',
          value: function enable() {
            if (this.enabled) {
              return;
            }

            this.enabled = true;

            if (this.orientationSupport) {
              this.portrait = false;
              window.addEventListener('deviceorientation', this.onDeviceOrientation);
              this.detectionTimer = setTimeout(this.onOrientationTimer, this.supportDelay);
            } else if (this.motionSupport) {
              this.portrait = false;
              window.addEventListener('devicemotion', this.onDeviceMotion);
              this.detectionTimer = setTimeout(this.onMotionTimer, this.supportDelay);
            } else {
              this.calibrationX = 0;
              this.calibrationY = 0;
              this.portrait = false;
              window.addEventListener('mousemove', this.onMouseMove);
              this.doReadyCallback();
            }

            window.addEventListener('resize', this.onWindowResize);
            this.raf = rqAnFr(this.onAnimationFrame);
          }
        }, {
          key: 'disable',
          value: function disable() {
            if (!this.enabled) {
              return;
            }

            this.enabled = false;

            if (this.orientationSupport) {
              window.removeEventListener('deviceorientation', this.onDeviceOrientation);
            } else if (this.motionSupport) {
              window.removeEventListener('devicemotion', this.onDeviceMotion);
            } else {
              window.removeEventListener('mousemove', this.onMouseMove);
            }

            window.removeEventListener('resize', this.onWindowResize);
            rqAnFr.cancel(this.raf);
          }
        }, {
          key: 'calibrate',
          value: function calibrate(x, y) {
            this.calibrateX = x === undefined ? this.calibrateX : x;
            this.calibrateY = y === undefined ? this.calibrateY : y;
          }
        }, {
          key: 'invert',
          value: function invert(x, y) {
            this.invertX = x === undefined ? this.invertX : x;
            this.invertY = y === undefined ? this.invertY : y;
          }
        }, {
          key: 'friction',
          value: function friction(x, y) {
            this.frictionX = x === undefined ? this.frictionX : x;
            this.frictionY = y === undefined ? this.frictionY : y;
          }
        }, {
          key: 'scalar',
          value: function scalar(x, y) {
            this.scalarX = x === undefined ? this.scalarX : x;
            this.scalarY = y === undefined ? this.scalarY : y;
          }
        }, {
          key: 'limit',
          value: function limit(x, y) {
            this.limitX = x === undefined ? this.limitX : x;
            this.limitY = y === undefined ? this.limitY : y;
          }
        }, {
          key: 'origin',
          value: function origin(x, y) {
            this.originX = x === undefined ? this.originX : x;
            this.originY = y === undefined ? this.originY : y;
          }
        }, {
          key: 'setInputElement',
          value: function setInputElement(element) {
            this.inputElement = element;
            this.updateDimensions();
          }
        }, {
          key: 'setPosition',
          value: function setPosition(element, x, y) {
            x = x.toFixed(this.precision) + 'px';
            y = y.toFixed(this.precision) + 'px';

            if (this.transform3DSupport) {
              helpers.css(element, 'transform', 'translate3d(' + x + ',' + y + ',0)');
            } else if (this.transform2DSupport) {
              helpers.css(element, 'transform', 'translate(' + x + ',' + y + ')');
            } else {
              element.style.left = x;
              element.style.top = y;
            }
          }
        }, {
          key: 'onOrientationTimer',
          value: function onOrientationTimer() {
            if (this.orientationSupport && this.orientationStatus === 0) {
              this.disable();
              this.orientationSupport = false;
              this.enable();
            } else {
              this.doReadyCallback();
            }
          }
        }, {
          key: 'onMotionTimer',
          value: function onMotionTimer() {
            if (this.motionSupport && this.motionStatus === 0) {
              this.disable();
              this.motionSupport = false;
              this.enable();
            } else {
              this.doReadyCallback();
            }
          }
        }, {
          key: 'onCalibrationTimer',
          value: function onCalibrationTimer() {
            this.calibrationFlag = true;
          }
        }, {
          key: 'onWindowResize',
          value: function onWindowResize() {
            this.updateDimensions();
          }
        }, {
          key: 'onAnimationFrame',
          value: function onAnimationFrame() {
            this.updateBounds();
            var calibratedInputX = this.inputX - this.calibrationX,
                calibratedInputY = this.inputY - this.calibrationY;

            if (Math.abs(calibratedInputX) > this.calibrationThreshold || Math.abs(calibratedInputY) > this.calibrationThreshold) {
              this.queueCalibration(0);
            }

            if (this.portrait) {
              this.motionX = this.calibrateX ? calibratedInputY : this.inputY;
              this.motionY = this.calibrateY ? calibratedInputX : this.inputX;
            } else {
              this.motionX = this.calibrateX ? calibratedInputX : this.inputX;
              this.motionY = this.calibrateY ? calibratedInputY : this.inputY;
            }

            this.motionX *= this.elementWidth * (this.scalarX / 100);
            this.motionY *= this.elementHeight * (this.scalarY / 100);

            if (!isNaN(parseFloat(this.limitX))) {
              this.motionX = helpers.clamp(this.motionX, -this.limitX, this.limitX);
            }

            if (!isNaN(parseFloat(this.limitY))) {
              this.motionY = helpers.clamp(this.motionY, -this.limitY, this.limitY);
            }

            this.velocityX += (this.motionX - this.velocityX) * this.frictionX;
            this.velocityY += (this.motionY - this.velocityY) * this.frictionY;

            for (var index = 0; index < this.layers.length; index++) {
              var layer = this.layers[index],
                  depthX = this.depthsX[index],
                  depthY = this.depthsY[index],
                  xOffset = this.velocityX * (depthX * (this.invertX ? -1 : 1)),
                  yOffset = this.velocityY * (depthY * (this.invertY ? -1 : 1));
              this.setPosition(layer, xOffset, yOffset);
            }

            this.raf = rqAnFr(this.onAnimationFrame);
          }
        }, {
          key: 'rotate',
          value: function rotate(beta, gamma) {
            // Extract Rotation
            var x = (beta || 0) / MAGIC_NUMBER,
                //  -90 :: 90
            y = (gamma || 0) / MAGIC_NUMBER; // -180 :: 180
            // Detect Orientation Change

            var portrait = this.windowHeight > this.windowWidth;

            if (this.portrait !== portrait) {
              this.portrait = portrait;
              this.calibrationFlag = true;
            }

            if (this.calibrationFlag) {
              this.calibrationFlag = false;
              this.calibrationX = x;
              this.calibrationY = y;
            }

            this.inputX = x;
            this.inputY = y;
          }
        }, {
          key: 'onDeviceOrientation',
          value: function onDeviceOrientation(event) {
            var beta = event.beta;
            var gamma = event.gamma;

            if (beta !== null && gamma !== null) {
              this.orientationStatus = 1;
              this.rotate(beta, gamma);
            }
          }
        }, {
          key: 'onDeviceMotion',
          value: function onDeviceMotion(event) {
            var beta = event.rotationRate.beta;
            var gamma = event.rotationRate.gamma;

            if (beta !== null && gamma !== null) {
              this.motionStatus = 1;
              this.rotate(beta, gamma);
            }
          }
        }, {
          key: 'onMouseMove',
          value: function onMouseMove(event) {
            var clientX = event.clientX,
                clientY = event.clientY; // reset input to center if hoverOnly is set and we're not hovering the element

            if (this.hoverOnly && (clientX < this.elementPositionX || clientX > this.elementPositionX + this.elementWidth || clientY < this.elementPositionY || clientY > this.elementPositionY + this.elementHeight)) {
              this.inputX = 0;
              this.inputY = 0;
              return;
            }

            if (this.relativeInput) {
              // Clip mouse coordinates inside element bounds.
              if (this.clipRelativeInput) {
                clientX = Math.max(clientX, this.elementPositionX);
                clientX = Math.min(clientX, this.elementPositionX + this.elementWidth);
                clientY = Math.max(clientY, this.elementPositionY);
                clientY = Math.min(clientY, this.elementPositionY + this.elementHeight);
              } // Calculate input relative to the element.


              if (this.elementRangeX && this.elementRangeY) {
                this.inputX = (clientX - this.elementPositionX - this.elementCenterX) / this.elementRangeX;
                this.inputY = (clientY - this.elementPositionY - this.elementCenterY) / this.elementRangeY;
              }
            } else {
              // Calculate input relative to the window.
              if (this.windowRadiusX && this.windowRadiusY) {
                this.inputX = (clientX - this.windowCenterX) / this.windowRadiusX;
                this.inputY = (clientY - this.windowCenterY) / this.windowRadiusY;
              }
            }
          }
        }, {
          key: 'destroy',
          value: function destroy() {
            this.disable();
            clearTimeout(this.calibrationTimer);
            clearTimeout(this.detectionTimer);
            this.element.removeAttribute('style');

            for (var index = 0; index < this.layers.length; index++) {
              this.layers[index].removeAttribute('style');
            }

            delete this.element;
            delete this.layers;
          }
        }, {
          key: 'version',
          value: function version() {
            return '3.1.0';
          }
        }]);

        return Parallax;
      }();

      module.exports = Parallax;
    }, {
      "object-assign": 1,
      "raf": 4
    }]
  }, {}, [5])(5);
});
},{"process":"node_modules/process/browser.js"}],"js/lib/animations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.section0Away = section0Away;
exports.section1In = section1In;
exports.programIn = programIn;
exports.animateCSS = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));

var _parallaxJs = _interopRequireDefault(require("parallax-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mobile = window.innerWidth < 800 ? true : false; // Init parallax on first Section #section0

var section0 = document.getElementById('section0');
var section1 = document.getElementById('section1');
var section1Instance; // OnLoad

if (!mobile) {
  var section0Instance = new _parallaxJs.default(section0, {
    'calibrateX': true,
    'calibrateY': true,
    'selector': '.layer',
    relativeInput: true,
    hoverOnly: true
  });
} // Animate and destroy section0


function section0Away() {
  return _section0Away.apply(this, arguments);
}

function _section0Away() {
  _section0Away = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var resolveAfter,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            resolveAfter = _args.length > 0 && _args[0] !== undefined ? _args[0] : 600;
            document.querySelector('.discover').remove(); // Animation

            section0.querySelector('.title').classList.add('title--away');
            document.querySelector('body').classList.add('body--pink');
            setTimeout(function () {
              section0.querySelector(".".concat('farLandscape')).classList.add('farLandscape'.concat("--away"));
            }, 200);
            setTimeout(function () {
              section0.querySelector(".".concat('town')).classList.add('town'.concat("--away"));
            }, 300);
            setTimeout(function () {
              section0.querySelector(".".concat('vineFront')).classList.add('vineFront'.concat("--away"));
            }, 500);
            setTimeout(function () {
              section0.querySelector(".".concat('vineBack')).classList.add('vineBack'.concat("--away"));
            }, 400); // Garbage

            section0Instance === null || section0Instance === void 0 ? void 0 : section0Instance.destroy();
            setTimeout(function () {
              section0.remove();
            }, 1200); // resolve after

            _context.next = 12;
            return new _promise.default(function (resolve) {
              return setTimeout(resolve, resolveAfter);
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _section0Away.apply(this, arguments);
}

function section1In() {
  return _section1In.apply(this, arguments);
}

function _section1In() {
  _section1In = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var resolveAfter,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            resolveAfter = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 700;
            section1.querySelector('.subject').classList.add('subject--rotated');
            section1.querySelector('.background').classList.add('background--visible');
            section1.querySelector('#invitation').classList.remove('invitation--hidden');
            section1.querySelector('#invitation').style.transition = '';
            setTimeout(function () {
              section1.querySelector('.subject').style.transition = 'none'; // Parallax sanity
            }, 700);
            setTimeout(function () {
              mobile && document.getElementById('invitation').classList.add('is-onScreen');
            }, 1000);

            if (!mobile) {
              section1Instance = new _parallaxJs.default(section1, {
                'calibrateX': true,
                'calibrateY': true,
                'selector': '.layer',
                relativeInput: true,
                hoverOnly: true,
                pointerEvents: true
              });
            } // resolve after


            _context2.next = 10;
            return new _promise.default(function (resolve) {
              return setTimeout(resolve, resolveAfter);
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _section1In.apply(this, arguments);
}

function programIn(_x) {
  return _programIn.apply(this, arguments);
}

function _programIn() {
  _programIn = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(resolveAfter) {
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            section1.querySelector('#invitation').classList.add('invitation--hidden');
            section1.querySelector('#program').classList.remove('program--hidden');
            setTimeout(function () {
              return document.body.addEventListener('click', closeProgram);
            }, 200);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _programIn.apply(this, arguments);
}

function closeProgram(e) {
  console.log(e.composedPath());
  var closeProgramButton = document.querySelector('.close--program');
  var program = document.getElementById('program');

  if (e.target == closeProgramButton || e.composedPath().every(function (node) {
    return node != program;
  })) {
    section1.querySelector('#invitation').classList.remove('invitation--hidden');
    program.classList.add('program--hidden');
    document.body.removeEventListener('click', closeProgram);
  }
}

var animateCSS = function animateCSS(element, animation) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'animate__';
  // We create a Promise and return it
  return new _promise.default(function (resolve, reject) {
    var animationName = "".concat(prefix).concat(animation);
    var node = document.querySelector(element);
    node.classList.add("".concat(prefix, "animated"), animationName); // When the animation ends, we clean the classes and resolve the Promise

    function handleAnimationEnd() {
      node.classList.remove("".concat(prefix, "animated"), animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {
      once: true
    });
  });
};

exports.animateCSS = animateCSS;
},{"@babel/runtime-corejs2/regenerator":"node_modules/@babel/runtime-corejs2/regenerator/index.js","@babel/runtime-corejs2/core-js/promise":"node_modules/@babel/runtime-corejs2/core-js/promise.js","@babel/runtime-corejs2/helpers/asyncToGenerator":"node_modules/@babel/runtime-corejs2/helpers/asyncToGenerator.js","parallax-js":"node_modules/parallax-js/dist/parallax.js"}],"node_modules/core-js/library/modules/_object-sap.js":[function(require,module,exports) {
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_export":"node_modules/core-js/library/modules/_export.js","./_core":"node_modules/core-js/library/modules/_core.js","./_fails":"node_modules/core-js/library/modules/_fails.js"}],"node_modules/core-js/library/modules/es6.object.keys.js":[function(require,module,exports) {
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_to-object":"node_modules/core-js/library/modules/_to-object.js","./_object-keys":"node_modules/core-js/library/modules/_object-keys.js","./_object-sap":"node_modules/core-js/library/modules/_object-sap.js"}],"node_modules/core-js/library/fn/object/keys.js":[function(require,module,exports) {
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;

},{"../../modules/es6.object.keys":"node_modules/core-js/library/modules/es6.object.keys.js","../../modules/_core":"node_modules/core-js/library/modules/_core.js"}],"node_modules/@babel/runtime-corejs2/core-js/object/keys.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/object/keys");
},{"core-js/library/fn/object/keys":"node_modules/core-js/library/fn/object/keys.js"}],"node_modules/core-js/library/modules/_object-pie.js":[function(require,module,exports) {
exports.f = {}.propertyIsEnumerable;

},{}],"node_modules/core-js/library/modules/_object-to-array.js":[function(require,module,exports) {
var DESCRIPTORS = require('./_descriptors');
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || isEnum.call(O, key)) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

},{"./_descriptors":"node_modules/core-js/library/modules/_descriptors.js","./_object-keys":"node_modules/core-js/library/modules/_object-keys.js","./_to-iobject":"node_modules/core-js/library/modules/_to-iobject.js","./_object-pie":"node_modules/core-js/library/modules/_object-pie.js"}],"node_modules/core-js/library/modules/es7.object.values.js":[function(require,module,exports) {
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":"node_modules/core-js/library/modules/_export.js","./_object-to-array":"node_modules/core-js/library/modules/_object-to-array.js"}],"node_modules/core-js/library/fn/object/values.js":[function(require,module,exports) {
require('../../modules/es7.object.values');
module.exports = require('../../modules/_core').Object.values;

},{"../../modules/es7.object.values":"node_modules/core-js/library/modules/es7.object.values.js","../../modules/_core":"node_modules/core-js/library/modules/_core.js"}],"node_modules/@babel/runtime-corejs2/core-js/object/values.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/object/values");
},{"core-js/library/fn/object/values":"node_modules/core-js/library/fn/object/values.js"}],"node_modules/@babel/runtime-corejs2/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"node_modules/core-js/library/modules/es6.object.define-property.js":[function(require,module,exports) {
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_export":"node_modules/core-js/library/modules/_export.js","./_descriptors":"node_modules/core-js/library/modules/_descriptors.js","./_object-dp":"node_modules/core-js/library/modules/_object-dp.js"}],"node_modules/core-js/library/fn/object/define-property.js":[function(require,module,exports) {
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/es6.object.define-property":"node_modules/core-js/library/modules/es6.object.define-property.js","../../modules/_core":"node_modules/core-js/library/modules/_core.js"}],"node_modules/@babel/runtime-corejs2/core-js/object/define-property.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/object/define-property");
},{"core-js/library/fn/object/define-property":"node_modules/core-js/library/fn/object/define-property.js"}],"node_modules/@babel/runtime-corejs2/helpers/createClass.js":[function(require,module,exports) {
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;

    _Object$defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{"@babel/runtime-corejs2/core-js/object/define-property":"node_modules/@babel/runtime-corejs2/core-js/object/define-property.js"}],"node_modules/@babel/runtime-corejs2/helpers/defineProperty.js":[function(require,module,exports) {
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    _Object$defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{"@babel/runtime-corejs2/core-js/object/define-property":"node_modules/@babel/runtime-corejs2/core-js/object/define-property.js"}],"node_modules/lodash/_arrayEach.js":[function(require,module,exports) {
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],"node_modules/lodash/_createBaseFor.js":[function(require,module,exports) {
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],"node_modules/lodash/_baseFor.js":[function(require,module,exports) {
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":"node_modules/lodash/_createBaseFor.js"}],"node_modules/lodash/_baseTimes.js":[function(require,module,exports) {
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],"node_modules/lodash/_freeGlobal.js":[function(require,module,exports) {
var global = arguments[3];
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

},{}],"node_modules/lodash/_root.js":[function(require,module,exports) {
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":"node_modules/lodash/_freeGlobal.js"}],"node_modules/lodash/_Symbol.js":[function(require,module,exports) {
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_getRawTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":"node_modules/lodash/_Symbol.js"}],"node_modules/lodash/_objectToString.js":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],"node_modules/lodash/_baseGetTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":"node_modules/lodash/_Symbol.js","./_getRawTag":"node_modules/lodash/_getRawTag.js","./_objectToString":"node_modules/lodash/_objectToString.js"}],"node_modules/lodash/isObjectLike.js":[function(require,module,exports) {
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],"node_modules/lodash/_baseIsArguments.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/isArguments.js":[function(require,module,exports) {
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":"node_modules/lodash/_baseIsArguments.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/isArray.js":[function(require,module,exports) {
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],"node_modules/lodash/stubFalse.js":[function(require,module,exports) {
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],"node_modules/lodash/isBuffer.js":[function(require,module,exports) {

var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":"node_modules/lodash/_root.js","./stubFalse":"node_modules/lodash/stubFalse.js"}],"node_modules/lodash/_isIndex.js":[function(require,module,exports) {
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],"node_modules/lodash/isLength.js":[function(require,module,exports) {
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],"node_modules/lodash/_baseIsTypedArray.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isLength":"node_modules/lodash/isLength.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/_baseUnary.js":[function(require,module,exports) {
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],"node_modules/lodash/_nodeUtil.js":[function(require,module,exports) {
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":"node_modules/lodash/_freeGlobal.js"}],"node_modules/lodash/isTypedArray.js":[function(require,module,exports) {
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":"node_modules/lodash/_baseIsTypedArray.js","./_baseUnary":"node_modules/lodash/_baseUnary.js","./_nodeUtil":"node_modules/lodash/_nodeUtil.js"}],"node_modules/lodash/_arrayLikeKeys.js":[function(require,module,exports) {
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":"node_modules/lodash/_baseTimes.js","./isArguments":"node_modules/lodash/isArguments.js","./isArray":"node_modules/lodash/isArray.js","./isBuffer":"node_modules/lodash/isBuffer.js","./_isIndex":"node_modules/lodash/_isIndex.js","./isTypedArray":"node_modules/lodash/isTypedArray.js"}],"node_modules/lodash/_isPrototype.js":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],"node_modules/lodash/_overArg.js":[function(require,module,exports) {
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],"node_modules/lodash/_nativeKeys.js":[function(require,module,exports) {
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":"node_modules/lodash/_overArg.js"}],"node_modules/lodash/_baseKeys.js":[function(require,module,exports) {
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":"node_modules/lodash/_isPrototype.js","./_nativeKeys":"node_modules/lodash/_nativeKeys.js"}],"node_modules/lodash/isObject.js":[function(require,module,exports) {
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],"node_modules/lodash/isFunction.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isObject":"node_modules/lodash/isObject.js"}],"node_modules/lodash/isArrayLike.js":[function(require,module,exports) {
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":"node_modules/lodash/isFunction.js","./isLength":"node_modules/lodash/isLength.js"}],"node_modules/lodash/keys.js":[function(require,module,exports) {
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":"node_modules/lodash/_arrayLikeKeys.js","./_baseKeys":"node_modules/lodash/_baseKeys.js","./isArrayLike":"node_modules/lodash/isArrayLike.js"}],"node_modules/lodash/_baseForOwn.js":[function(require,module,exports) {
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":"node_modules/lodash/_baseFor.js","./keys":"node_modules/lodash/keys.js"}],"node_modules/lodash/_createBaseEach.js":[function(require,module,exports) {
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":"node_modules/lodash/isArrayLike.js"}],"node_modules/lodash/_baseEach.js":[function(require,module,exports) {
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":"node_modules/lodash/_baseForOwn.js","./_createBaseEach":"node_modules/lodash/_createBaseEach.js"}],"node_modules/lodash/identity.js":[function(require,module,exports) {
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],"node_modules/lodash/_castFunction.js":[function(require,module,exports) {
var identity = require('./identity');

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;

},{"./identity":"node_modules/lodash/identity.js"}],"node_modules/lodash/forEach.js":[function(require,module,exports) {
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    castFunction = require('./_castFunction'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;

},{"./_arrayEach":"node_modules/lodash/_arrayEach.js","./_baseEach":"node_modules/lodash/_baseEach.js","./_castFunction":"node_modules/lodash/_castFunction.js","./isArray":"node_modules/lodash/isArray.js"}],"node_modules/lodash/isSymbol.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/_isKey.js":[function(require,module,exports) {
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":"node_modules/lodash/isArray.js","./isSymbol":"node_modules/lodash/isSymbol.js"}],"node_modules/lodash/_coreJsData.js":[function(require,module,exports) {
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_isMasked.js":[function(require,module,exports) {
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":"node_modules/lodash/_coreJsData.js"}],"node_modules/lodash/_toSource.js":[function(require,module,exports) {
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],"node_modules/lodash/_baseIsNative.js":[function(require,module,exports) {
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./isFunction":"node_modules/lodash/isFunction.js","./_isMasked":"node_modules/lodash/_isMasked.js","./isObject":"node_modules/lodash/isObject.js","./_toSource":"node_modules/lodash/_toSource.js"}],"node_modules/lodash/_getValue.js":[function(require,module,exports) {
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],"node_modules/lodash/_getNative.js":[function(require,module,exports) {
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":"node_modules/lodash/_baseIsNative.js","./_getValue":"node_modules/lodash/_getValue.js"}],"node_modules/lodash/_nativeCreate.js":[function(require,module,exports) {
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":"node_modules/lodash/_getNative.js"}],"node_modules/lodash/_hashClear.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":"node_modules/lodash/_nativeCreate.js"}],"node_modules/lodash/_hashDelete.js":[function(require,module,exports) {
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],"node_modules/lodash/_hashGet.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":"node_modules/lodash/_nativeCreate.js"}],"node_modules/lodash/_hashHas.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":"node_modules/lodash/_nativeCreate.js"}],"node_modules/lodash/_hashSet.js":[function(require,module,exports) {
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":"node_modules/lodash/_nativeCreate.js"}],"node_modules/lodash/_Hash.js":[function(require,module,exports) {
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":"node_modules/lodash/_hashClear.js","./_hashDelete":"node_modules/lodash/_hashDelete.js","./_hashGet":"node_modules/lodash/_hashGet.js","./_hashHas":"node_modules/lodash/_hashHas.js","./_hashSet":"node_modules/lodash/_hashSet.js"}],"node_modules/lodash/_listCacheClear.js":[function(require,module,exports) {
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],"node_modules/lodash/eq.js":[function(require,module,exports) {
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],"node_modules/lodash/_assocIndexOf.js":[function(require,module,exports) {
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":"node_modules/lodash/eq.js"}],"node_modules/lodash/_listCacheDelete.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":"node_modules/lodash/_assocIndexOf.js"}],"node_modules/lodash/_listCacheGet.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":"node_modules/lodash/_assocIndexOf.js"}],"node_modules/lodash/_listCacheHas.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":"node_modules/lodash/_assocIndexOf.js"}],"node_modules/lodash/_listCacheSet.js":[function(require,module,exports) {
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":"node_modules/lodash/_assocIndexOf.js"}],"node_modules/lodash/_ListCache.js":[function(require,module,exports) {
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":"node_modules/lodash/_listCacheClear.js","./_listCacheDelete":"node_modules/lodash/_listCacheDelete.js","./_listCacheGet":"node_modules/lodash/_listCacheGet.js","./_listCacheHas":"node_modules/lodash/_listCacheHas.js","./_listCacheSet":"node_modules/lodash/_listCacheSet.js"}],"node_modules/lodash/_Map.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_mapCacheClear.js":[function(require,module,exports) {
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":"node_modules/lodash/_Hash.js","./_ListCache":"node_modules/lodash/_ListCache.js","./_Map":"node_modules/lodash/_Map.js"}],"node_modules/lodash/_isKeyable.js":[function(require,module,exports) {
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],"node_modules/lodash/_getMapData.js":[function(require,module,exports) {
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":"node_modules/lodash/_isKeyable.js"}],"node_modules/lodash/_mapCacheDelete.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":"node_modules/lodash/_getMapData.js"}],"node_modules/lodash/_mapCacheGet.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":"node_modules/lodash/_getMapData.js"}],"node_modules/lodash/_mapCacheHas.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":"node_modules/lodash/_getMapData.js"}],"node_modules/lodash/_mapCacheSet.js":[function(require,module,exports) {
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":"node_modules/lodash/_getMapData.js"}],"node_modules/lodash/_MapCache.js":[function(require,module,exports) {
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":"node_modules/lodash/_mapCacheClear.js","./_mapCacheDelete":"node_modules/lodash/_mapCacheDelete.js","./_mapCacheGet":"node_modules/lodash/_mapCacheGet.js","./_mapCacheHas":"node_modules/lodash/_mapCacheHas.js","./_mapCacheSet":"node_modules/lodash/_mapCacheSet.js"}],"node_modules/lodash/memoize.js":[function(require,module,exports) {
var MapCache = require('./_MapCache');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":"node_modules/lodash/_MapCache.js"}],"node_modules/lodash/_memoizeCapped.js":[function(require,module,exports) {
var memoize = require('./memoize');

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;

},{"./memoize":"node_modules/lodash/memoize.js"}],"node_modules/lodash/_stringToPath.js":[function(require,module,exports) {
var memoizeCapped = require('./_memoizeCapped');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./_memoizeCapped":"node_modules/lodash/_memoizeCapped.js"}],"node_modules/lodash/_arrayMap.js":[function(require,module,exports) {
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],"node_modules/lodash/_baseToString.js":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":"node_modules/lodash/_Symbol.js","./_arrayMap":"node_modules/lodash/_arrayMap.js","./isArray":"node_modules/lodash/isArray.js","./isSymbol":"node_modules/lodash/isSymbol.js"}],"node_modules/lodash/toString.js":[function(require,module,exports) {
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":"node_modules/lodash/_baseToString.js"}],"node_modules/lodash/_castPath.js":[function(require,module,exports) {
var isArray = require('./isArray'),
    isKey = require('./_isKey'),
    stringToPath = require('./_stringToPath'),
    toString = require('./toString');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;

},{"./isArray":"node_modules/lodash/isArray.js","./_isKey":"node_modules/lodash/_isKey.js","./_stringToPath":"node_modules/lodash/_stringToPath.js","./toString":"node_modules/lodash/toString.js"}],"node_modules/lodash/_toKey.js":[function(require,module,exports) {
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":"node_modules/lodash/isSymbol.js"}],"node_modules/lodash/_baseGet.js":[function(require,module,exports) {
var castPath = require('./_castPath'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":"node_modules/lodash/_castPath.js","./_toKey":"node_modules/lodash/_toKey.js"}],"node_modules/lodash/get.js":[function(require,module,exports) {
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":"node_modules/lodash/_baseGet.js"}],"node_modules/lodash/_defineProperty.js":[function(require,module,exports) {
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":"node_modules/lodash/_getNative.js"}],"node_modules/lodash/_baseAssignValue.js":[function(require,module,exports) {
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

},{"./_defineProperty":"node_modules/lodash/_defineProperty.js"}],"node_modules/lodash/_assignValue.js":[function(require,module,exports) {
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

},{"./_baseAssignValue":"node_modules/lodash/_baseAssignValue.js","./eq":"node_modules/lodash/eq.js"}],"node_modules/lodash/_copyObject.js":[function(require,module,exports) {
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":"node_modules/lodash/_assignValue.js","./_baseAssignValue":"node_modules/lodash/_baseAssignValue.js"}],"node_modules/lodash/_apply.js":[function(require,module,exports) {
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],"node_modules/lodash/_overRest.js":[function(require,module,exports) {
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

},{"./_apply":"node_modules/lodash/_apply.js"}],"node_modules/lodash/constant.js":[function(require,module,exports) {
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],"node_modules/lodash/_baseSetToString.js":[function(require,module,exports) {
var constant = require('./constant'),
    defineProperty = require('./_defineProperty'),
    identity = require('./identity');

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;

},{"./constant":"node_modules/lodash/constant.js","./_defineProperty":"node_modules/lodash/_defineProperty.js","./identity":"node_modules/lodash/identity.js"}],"node_modules/lodash/_shortOut.js":[function(require,module,exports) {
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;

},{}],"node_modules/lodash/_setToString.js":[function(require,module,exports) {
var baseSetToString = require('./_baseSetToString'),
    shortOut = require('./_shortOut');

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;

},{"./_baseSetToString":"node_modules/lodash/_baseSetToString.js","./_shortOut":"node_modules/lodash/_shortOut.js"}],"node_modules/lodash/_baseRest.js":[function(require,module,exports) {
var identity = require('./identity'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;

},{"./identity":"node_modules/lodash/identity.js","./_overRest":"node_modules/lodash/_overRest.js","./_setToString":"node_modules/lodash/_setToString.js"}],"node_modules/lodash/_isIterateeCall.js":[function(require,module,exports) {
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./eq":"node_modules/lodash/eq.js","./isArrayLike":"node_modules/lodash/isArrayLike.js","./_isIndex":"node_modules/lodash/_isIndex.js","./isObject":"node_modules/lodash/isObject.js"}],"node_modules/lodash/_createAssigner.js":[function(require,module,exports) {
var baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"./_baseRest":"node_modules/lodash/_baseRest.js","./_isIterateeCall":"node_modules/lodash/_isIterateeCall.js"}],"node_modules/lodash/assign.js":[function(require,module,exports) {
var assignValue = require('./_assignValue'),
    copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    isArrayLike = require('./isArrayLike'),
    isPrototype = require('./_isPrototype'),
    keys = require('./keys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;

},{"./_assignValue":"node_modules/lodash/_assignValue.js","./_copyObject":"node_modules/lodash/_copyObject.js","./_createAssigner":"node_modules/lodash/_createAssigner.js","./isArrayLike":"node_modules/lodash/isArrayLike.js","./_isPrototype":"node_modules/lodash/_isPrototype.js","./keys":"node_modules/lodash/keys.js"}],"node_modules/lodash/_getPrototype.js":[function(require,module,exports) {
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":"node_modules/lodash/_overArg.js"}],"node_modules/lodash/isPlainObject.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./_getPrototype":"node_modules/lodash/_getPrototype.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/airtable/lib/fetch.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var node_fetch_1 = __importDefault(require("node-fetch"));

module.exports = // istanbul ignore next
typeof window === 'undefined' ? node_fetch_1.default : window.fetch.bind(window);
},{"node-fetch":"node_modules/parcel-bundler/src/builtins/_empty.js"}],"node_modules/abortcontroller-polyfill/dist/cjs-ponyfill.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var Emitter = /*#__PURE__*/function () {
  function Emitter() {
    _classCallCheck(this, Emitter);

    Object.defineProperty(this, 'listeners', {
      value: {},
      writable: true,
      configurable: true
    });
  }

  _createClass(Emitter, [{
    key: "addEventListener",
    value: function addEventListener(type, callback) {
      if (!(type in this.listeners)) {
        this.listeners[type] = [];
      }

      this.listeners[type].push(callback);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, callback) {
      if (!(type in this.listeners)) {
        return;
      }

      var stack = this.listeners[type];

      for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback) {
          stack.splice(i, 1);
          return;
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      var _this = this;

      if (!(event.type in this.listeners)) {
        return;
      }

      var debounce = function debounce(callback) {
        setTimeout(function () {
          return callback.call(_this, event);
        });
      };

      var stack = this.listeners[event.type];

      for (var i = 0, l = stack.length; i < l; i++) {
        debounce(stack[i]);
      }

      return !event.defaultPrevented;
    }
  }]);

  return Emitter;
}();

var AbortSignal = /*#__PURE__*/function (_Emitter) {
  _inherits(AbortSignal, _Emitter);

  var _super = _createSuper(AbortSignal);

  function AbortSignal() {
    var _this2;

    _classCallCheck(this, AbortSignal);

    _this2 = _super.call(this); // Some versions of babel does not transpile super() correctly for IE <= 10, if the parent
    // constructor has failed to run, then "this.listeners" will still be undefined and then we call
    // the parent constructor directly instead as a workaround. For general details, see babel bug:
    // https://github.com/babel/babel/issues/3041
    // This hack was added as a fix for the issue described here:
    // https://github.com/Financial-Times/polyfill-library/pull/59#issuecomment-477558042

    if (!_this2.listeners) {
      Emitter.call(_assertThisInitialized(_this2));
    } // Compared to assignment, Object.defineProperty makes properties non-enumerable by default and
    // we want Object.keys(new AbortController().signal) to be [] for compat with the native impl


    Object.defineProperty(_assertThisInitialized(_this2), 'aborted', {
      value: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(_assertThisInitialized(_this2), 'onabort', {
      value: null,
      writable: true,
      configurable: true
    });
    return _this2;
  }

  _createClass(AbortSignal, [{
    key: "toString",
    value: function toString() {
      return '[object AbortSignal]';
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      if (event.type === 'abort') {
        this.aborted = true;

        if (typeof this.onabort === 'function') {
          this.onabort.call(this, event);
        }
      }

      _get(_getPrototypeOf(AbortSignal.prototype), "dispatchEvent", this).call(this, event);
    }
  }]);

  return AbortSignal;
}(Emitter);
var AbortController = /*#__PURE__*/function () {
  function AbortController() {
    _classCallCheck(this, AbortController);

    // Compared to assignment, Object.defineProperty makes properties non-enumerable by default and
    // we want Object.keys(new AbortController()) to be [] for compat with the native impl
    Object.defineProperty(this, 'signal', {
      value: new AbortSignal(),
      writable: true,
      configurable: true
    });
  }

  _createClass(AbortController, [{
    key: "abort",
    value: function abort() {
      var event;

      try {
        event = new Event('abort');
      } catch (e) {
        if (typeof document !== 'undefined') {
          if (!document.createEvent) {
            // For Internet Explorer 8:
            event = document.createEventObject();
            event.type = 'abort';
          } else {
            // For Internet Explorer 11:
            event = document.createEvent('Event');
            event.initEvent('abort', false, false);
          }
        } else {
          // Fallback where document isn't available:
          event = {
            type: 'abort',
            bubbles: false,
            cancelable: false
          };
        }
      }

      this.signal.dispatchEvent(event);
    }
  }, {
    key: "toString",
    value: function toString() {
      return '[object AbortController]';
    }
  }]);

  return AbortController;
}();

if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  // These are necessary to make sure that we get correct output for:
  // Object.prototype.toString.call(new AbortController())
  AbortController.prototype[Symbol.toStringTag] = 'AbortController';
  AbortSignal.prototype[Symbol.toStringTag] = 'AbortSignal';
}

function polyfillNeeded(self) {
  if (self.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
    console.log('__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill');
    return true;
  } // Note that the "unfetch" minimal fetch polyfill defines fetch() without
  // defining window.Request, and this polyfill need to work on top of unfetch
  // so the below feature detection needs the !self.AbortController part.
  // The Request.prototype check is also needed because Safari versions 11.1.2
  // up to and including 12.1.x has a window.AbortController present but still
  // does NOT correctly implement abortable fetch:
  // https://bugs.webkit.org/show_bug.cgi?id=174980#c2


  return typeof self.Request === 'function' && !self.Request.prototype.hasOwnProperty('signal') || !self.AbortController;
}

/**
 * Note: the "fetch.Request" default value is available for fetch imported from
 * the "node-fetch" package and not in browsers. This is OK since browsers
 * will be importing umd-polyfill.js from that path "self" is passed the
 * decorator so the default value will not be used (because browsers that define
 * fetch also has Request). One quirky setup where self.fetch exists but
 * self.Request does not is when the "unfetch" minimal fetch polyfill is used
 * on top of IE11; for this case the browser will try to use the fetch.Request
 * default value which in turn will be undefined but then then "if (Request)"
 * will ensure that you get a patched fetch but still no Request (as expected).
 * @param {fetch, Request = fetch.Request}
 * @returns {fetch: abortableFetch, Request: AbortableRequest}
 */

function abortableFetchDecorator(patchTargets) {
  if ('function' === typeof patchTargets) {
    patchTargets = {
      fetch: patchTargets
    };
  }

  var _patchTargets = patchTargets,
      fetch = _patchTargets.fetch,
      _patchTargets$Request = _patchTargets.Request,
      NativeRequest = _patchTargets$Request === void 0 ? fetch.Request : _patchTargets$Request,
      NativeAbortController = _patchTargets.AbortController,
      _patchTargets$__FORCE = _patchTargets.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL,
      __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL = _patchTargets$__FORCE === void 0 ? false : _patchTargets$__FORCE;

  if (!polyfillNeeded({
    fetch: fetch,
    Request: NativeRequest,
    AbortController: NativeAbortController,
    __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL: __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL
  })) {
    return {
      fetch: fetch,
      Request: Request
    };
  }

  var Request = NativeRequest; // Note that the "unfetch" minimal fetch polyfill defines fetch() without
  // defining window.Request, and this polyfill need to work on top of unfetch
  // hence we only patch it if it's available. Also we don't patch it if signal
  // is already available on the Request prototype because in this case support
  // is present and the patching below can cause a crash since it assigns to
  // request.signal which is technically a read-only property. This latter error
  // happens when you run the main5.js node-fetch example in the repo
  // "abortcontroller-polyfill-examples". The exact error is:
  //   request.signal = init.signal;
  //   ^
  // TypeError: Cannot set property signal of #<Request> which has only a getter

  if (Request && !Request.prototype.hasOwnProperty('signal') || __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
    Request = function Request(input, init) {
      var signal;

      if (init && init.signal) {
        signal = init.signal; // Never pass init.signal to the native Request implementation when the polyfill has
        // been installed because if we're running on top of a browser with a
        // working native AbortController (i.e. the polyfill was installed due to
        // __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL being set), then passing our
        // fake AbortSignal to the native fetch will trigger:
        // TypeError: Failed to construct 'Request': member signal is not of type AbortSignal.

        delete init.signal;
      }

      var request = new NativeRequest(input, init);

      if (signal) {
        Object.defineProperty(request, 'signal', {
          writable: false,
          enumerable: false,
          configurable: true,
          value: signal
        });
      }

      return request;
    };

    Request.prototype = NativeRequest.prototype;
  }

  var realFetch = fetch;

  var abortableFetch = function abortableFetch(input, init) {
    var signal = Request && Request.prototype.isPrototypeOf(input) ? input.signal : init ? init.signal : undefined;

    if (signal) {
      var abortError;

      try {
        abortError = new DOMException('Aborted', 'AbortError');
      } catch (err) {
        // IE 11 does not support calling the DOMException constructor, use a
        // regular error object on it instead.
        abortError = new Error('Aborted');
        abortError.name = 'AbortError';
      } // Return early if already aborted, thus avoiding making an HTTP request


      if (signal.aborted) {
        return Promise.reject(abortError);
      } // Turn an event into a promise, reject it once `abort` is dispatched


      var cancellation = new Promise(function (_, reject) {
        signal.addEventListener('abort', function () {
          return reject(abortError);
        }, {
          once: true
        });
      });

      if (init && init.signal) {
        // Never pass .signal to the native implementation when the polyfill has
        // been installed because if we're running on top of a browser with a
        // working native AbortController (i.e. the polyfill was installed due to
        // __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL being set), then passing our
        // fake AbortSignal to the native fetch will trigger:
        // TypeError: Failed to execute 'fetch' on 'Window': member signal is not of type AbortSignal.
        delete init.signal;
      } // Return the fastest promise (don't need to wait for request to finish)


      return Promise.race([cancellation, realFetch(input, init)]);
    }

    return realFetch(input, init);
  };

  return {
    fetch: abortableFetch,
    Request: Request
  };
}

exports.AbortController = AbortController;
exports.AbortSignal = AbortSignal;
exports.abortableFetch = abortableFetchDecorator;

},{}],"node_modules/airtable/lib/abort-controller.js":[function(require,module,exports) {
"use strict"; // istanbul ignore file

var AbortController;

if (typeof window === 'undefined') {
  AbortController = require('abort-controller');
} else {
  if ('signal' in new Request('')) {
    AbortController = window.AbortController;
  } else {
    var polyfill = require('abortcontroller-polyfill/dist/cjs-ponyfill');

    AbortController = polyfill.AbortController;
  }
}

module.exports = AbortController;
},{"abort-controller":"node_modules/parcel-bundler/src/builtins/_empty.js","abortcontroller-polyfill/dist/cjs-ponyfill":"node_modules/abortcontroller-polyfill/dist/cjs-ponyfill.js"}],"node_modules/lodash/isNil.js":[function(require,module,exports) {
/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 * @example
 *
 * _.isNil(null);
 * // => true
 *
 * _.isNil(void 0);
 * // => true
 *
 * _.isNil(NaN);
 * // => false
 */
function isNil(value) {
  return value == null;
}

module.exports = isNil;

},{}],"node_modules/airtable/lib/object_to_query_param_string.js":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var isArray_1 = __importDefault(require("lodash/isArray"));

var forEach_1 = __importDefault(require("lodash/forEach"));

var isNil_1 = __importDefault(require("lodash/isNil")); // Adapted from jQuery.param:
// https://github.com/jquery/jquery/blob/2.2-stable/src/serialize.js


function buildParams(prefix, obj, addFn) {
  if (isArray_1.default(obj)) {
    // Serialize array item.
    forEach_1.default(obj, function (value, index) {
      if (/\[\]$/.test(prefix)) {
        // Treat each array item as a scalar.
        addFn(prefix, value);
      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(prefix + "[" + (_typeof(value) === 'object' && value !== null ? index : '') + "]", value, addFn);
      }
    });
  } else if (_typeof(obj) === 'object') {
    // Serialize object item.
    forEach_1.default(obj, function (value, key) {
      buildParams(prefix + "[" + key + "]", value, addFn);
    });
  } else {
    // Serialize scalar item.
    addFn(prefix, obj);
  }
}

function objectToQueryParamString(obj) {
  var parts = [];

  var addFn = function addFn(key, value) {
    value = isNil_1.default(value) ? '' : value;
    parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  };

  forEach_1.default(obj, function (value, key) {
    buildParams(key, value, addFn);
  });
  return parts.join('&').replace(/%20/g, '+');
}

module.exports = objectToQueryParamString;
},{"lodash/isArray":"node_modules/lodash/isArray.js","lodash/forEach":"node_modules/lodash/forEach.js","lodash/isNil":"node_modules/lodash/isNil.js"}],"node_modules/airtable/lib/airtable_error.js":[function(require,module,exports) {
"use strict";

var AirtableError =
/** @class */
function () {
  function AirtableError(error, message, statusCode) {
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
  }

  AirtableError.prototype.toString = function () {
    return [this.message, '(', this.error, ')', this.statusCode ? "[Http code " + this.statusCode + "]" : ''].join('');
  };

  return AirtableError;
}();

module.exports = AirtableError;
},{}],"node_modules/lodash/_stackClear.js":[function(require,module,exports) {
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":"node_modules/lodash/_ListCache.js"}],"node_modules/lodash/_stackDelete.js":[function(require,module,exports) {
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],"node_modules/lodash/_stackGet.js":[function(require,module,exports) {
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],"node_modules/lodash/_stackHas.js":[function(require,module,exports) {
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],"node_modules/lodash/_stackSet.js":[function(require,module,exports) {
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":"node_modules/lodash/_ListCache.js","./_Map":"node_modules/lodash/_Map.js","./_MapCache":"node_modules/lodash/_MapCache.js"}],"node_modules/lodash/_Stack.js":[function(require,module,exports) {
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":"node_modules/lodash/_ListCache.js","./_stackClear":"node_modules/lodash/_stackClear.js","./_stackDelete":"node_modules/lodash/_stackDelete.js","./_stackGet":"node_modules/lodash/_stackGet.js","./_stackHas":"node_modules/lodash/_stackHas.js","./_stackSet":"node_modules/lodash/_stackSet.js"}],"node_modules/lodash/_setCacheAdd.js":[function(require,module,exports) {
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],"node_modules/lodash/_setCacheHas.js":[function(require,module,exports) {
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],"node_modules/lodash/_SetCache.js":[function(require,module,exports) {
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":"node_modules/lodash/_MapCache.js","./_setCacheAdd":"node_modules/lodash/_setCacheAdd.js","./_setCacheHas":"node_modules/lodash/_setCacheHas.js"}],"node_modules/lodash/_arraySome.js":[function(require,module,exports) {
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],"node_modules/lodash/_cacheHas.js":[function(require,module,exports) {
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],"node_modules/lodash/_equalArrays.js":[function(require,module,exports) {
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome'),
    cacheHas = require('./_cacheHas');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":"node_modules/lodash/_SetCache.js","./_arraySome":"node_modules/lodash/_arraySome.js","./_cacheHas":"node_modules/lodash/_cacheHas.js"}],"node_modules/lodash/_Uint8Array.js":[function(require,module,exports) {
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_mapToArray.js":[function(require,module,exports) {
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],"node_modules/lodash/_setToArray.js":[function(require,module,exports) {
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],"node_modules/lodash/_equalByTag.js":[function(require,module,exports) {
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":"node_modules/lodash/_Symbol.js","./_Uint8Array":"node_modules/lodash/_Uint8Array.js","./eq":"node_modules/lodash/eq.js","./_equalArrays":"node_modules/lodash/_equalArrays.js","./_mapToArray":"node_modules/lodash/_mapToArray.js","./_setToArray":"node_modules/lodash/_setToArray.js"}],"node_modules/lodash/_arrayPush.js":[function(require,module,exports) {
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],"node_modules/lodash/_baseGetAllKeys.js":[function(require,module,exports) {
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":"node_modules/lodash/_arrayPush.js","./isArray":"node_modules/lodash/isArray.js"}],"node_modules/lodash/_arrayFilter.js":[function(require,module,exports) {
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],"node_modules/lodash/stubArray.js":[function(require,module,exports) {
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],"node_modules/lodash/_getSymbols.js":[function(require,module,exports) {
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":"node_modules/lodash/_arrayFilter.js","./stubArray":"node_modules/lodash/stubArray.js"}],"node_modules/lodash/_getAllKeys.js":[function(require,module,exports) {
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":"node_modules/lodash/_baseGetAllKeys.js","./_getSymbols":"node_modules/lodash/_getSymbols.js","./keys":"node_modules/lodash/keys.js"}],"node_modules/lodash/_equalObjects.js":[function(require,module,exports) {
var getAllKeys = require('./_getAllKeys');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./_getAllKeys":"node_modules/lodash/_getAllKeys.js"}],"node_modules/lodash/_DataView.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_Promise.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_Set.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_WeakMap.js":[function(require,module,exports) {
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":"node_modules/lodash/_getNative.js","./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_getTag.js":[function(require,module,exports) {
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":"node_modules/lodash/_DataView.js","./_Map":"node_modules/lodash/_Map.js","./_Promise":"node_modules/lodash/_Promise.js","./_Set":"node_modules/lodash/_Set.js","./_WeakMap":"node_modules/lodash/_WeakMap.js","./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./_toSource":"node_modules/lodash/_toSource.js"}],"node_modules/lodash/_baseIsEqualDeep.js":[function(require,module,exports) {
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":"node_modules/lodash/_Stack.js","./_equalArrays":"node_modules/lodash/_equalArrays.js","./_equalByTag":"node_modules/lodash/_equalByTag.js","./_equalObjects":"node_modules/lodash/_equalObjects.js","./_getTag":"node_modules/lodash/_getTag.js","./isArray":"node_modules/lodash/isArray.js","./isBuffer":"node_modules/lodash/isBuffer.js","./isTypedArray":"node_modules/lodash/isTypedArray.js"}],"node_modules/lodash/_baseIsEqual.js":[function(require,module,exports) {
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":"node_modules/lodash/_baseIsEqualDeep.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/_baseIsMatch.js":[function(require,module,exports) {
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":"node_modules/lodash/_Stack.js","./_baseIsEqual":"node_modules/lodash/_baseIsEqual.js"}],"node_modules/lodash/_isStrictComparable.js":[function(require,module,exports) {
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":"node_modules/lodash/isObject.js"}],"node_modules/lodash/_getMatchData.js":[function(require,module,exports) {
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":"node_modules/lodash/_isStrictComparable.js","./keys":"node_modules/lodash/keys.js"}],"node_modules/lodash/_matchesStrictComparable.js":[function(require,module,exports) {
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

},{}],"node_modules/lodash/_baseMatches.js":[function(require,module,exports) {
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":"node_modules/lodash/_baseIsMatch.js","./_getMatchData":"node_modules/lodash/_getMatchData.js","./_matchesStrictComparable":"node_modules/lodash/_matchesStrictComparable.js"}],"node_modules/lodash/_baseHasIn.js":[function(require,module,exports) {
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

},{}],"node_modules/lodash/_hasPath.js":[function(require,module,exports) {
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isLength = require('./isLength'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":"node_modules/lodash/_castPath.js","./isArguments":"node_modules/lodash/isArguments.js","./isArray":"node_modules/lodash/isArray.js","./_isIndex":"node_modules/lodash/_isIndex.js","./isLength":"node_modules/lodash/isLength.js","./_toKey":"node_modules/lodash/_toKey.js"}],"node_modules/lodash/hasIn.js":[function(require,module,exports) {
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":"node_modules/lodash/_baseHasIn.js","./_hasPath":"node_modules/lodash/_hasPath.js"}],"node_modules/lodash/_baseMatchesProperty.js":[function(require,module,exports) {
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":"node_modules/lodash/_baseIsEqual.js","./get":"node_modules/lodash/get.js","./hasIn":"node_modules/lodash/hasIn.js","./_isKey":"node_modules/lodash/_isKey.js","./_isStrictComparable":"node_modules/lodash/_isStrictComparable.js","./_matchesStrictComparable":"node_modules/lodash/_matchesStrictComparable.js","./_toKey":"node_modules/lodash/_toKey.js"}],"node_modules/lodash/_baseProperty.js":[function(require,module,exports) {
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],"node_modules/lodash/_basePropertyDeep.js":[function(require,module,exports) {
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":"node_modules/lodash/_baseGet.js"}],"node_modules/lodash/property.js":[function(require,module,exports) {
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":"node_modules/lodash/_baseProperty.js","./_basePropertyDeep":"node_modules/lodash/_basePropertyDeep.js","./_isKey":"node_modules/lodash/_isKey.js","./_toKey":"node_modules/lodash/_toKey.js"}],"node_modules/lodash/_baseIteratee.js":[function(require,module,exports) {
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":"node_modules/lodash/_baseMatches.js","./_baseMatchesProperty":"node_modules/lodash/_baseMatchesProperty.js","./identity":"node_modules/lodash/identity.js","./isArray":"node_modules/lodash/isArray.js","./property":"node_modules/lodash/property.js"}],"node_modules/lodash/_baseMap.js":[function(require,module,exports) {
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./_baseEach":"node_modules/lodash/_baseEach.js","./isArrayLike":"node_modules/lodash/isArrayLike.js"}],"node_modules/lodash/map.js":[function(require,module,exports) {
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    isArray = require('./isArray');

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;

},{"./_arrayMap":"node_modules/lodash/_arrayMap.js","./_baseIteratee":"node_modules/lodash/_baseIteratee.js","./_baseMap":"node_modules/lodash/_baseMap.js","./isArray":"node_modules/lodash/isArray.js"}],"node_modules/airtable/lib/deprecate.js":[function(require,module,exports) {
"use strict";

var didWarnForDeprecation = {};
/**
 * Convenience function for marking a function as deprecated.
 *
 * Will emit a warning the first time that function is called.
 *
 * @param fn the function to mark as deprecated.
 * @param key a unique key identifying the function.
 * @param message the warning message.
 *
 * @return a wrapped function
 */

function deprecate(fn, key, message) {
  return function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (!didWarnForDeprecation[key]) {
      didWarnForDeprecation[key] = true;
      console.warn(message);
    }

    fn.apply(this, args);
  };
}

module.exports = deprecate;
},{}],"node_modules/lodash/_baseAssign.js":[function(require,module,exports) {
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":"node_modules/lodash/_copyObject.js","./keys":"node_modules/lodash/keys.js"}],"node_modules/lodash/_nativeKeysIn.js":[function(require,module,exports) {
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

},{}],"node_modules/lodash/_baseKeysIn.js":[function(require,module,exports) {
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

},{"./isObject":"node_modules/lodash/isObject.js","./_isPrototype":"node_modules/lodash/_isPrototype.js","./_nativeKeysIn":"node_modules/lodash/_nativeKeysIn.js"}],"node_modules/lodash/keysIn.js":[function(require,module,exports) {
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

},{"./_arrayLikeKeys":"node_modules/lodash/_arrayLikeKeys.js","./_baseKeysIn":"node_modules/lodash/_baseKeysIn.js","./isArrayLike":"node_modules/lodash/isArrayLike.js"}],"node_modules/lodash/_baseAssignIn.js":[function(require,module,exports) {
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;

},{"./_copyObject":"node_modules/lodash/_copyObject.js","./keysIn":"node_modules/lodash/keysIn.js"}],"node_modules/lodash/_cloneBuffer.js":[function(require,module,exports) {

var root = require('./_root');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{"./_root":"node_modules/lodash/_root.js"}],"node_modules/lodash/_copyArray.js":[function(require,module,exports) {
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],"node_modules/lodash/_copySymbols.js":[function(require,module,exports) {
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":"node_modules/lodash/_copyObject.js","./_getSymbols":"node_modules/lodash/_getSymbols.js"}],"node_modules/lodash/_getSymbolsIn.js":[function(require,module,exports) {
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

},{"./_arrayPush":"node_modules/lodash/_arrayPush.js","./_getPrototype":"node_modules/lodash/_getPrototype.js","./_getSymbols":"node_modules/lodash/_getSymbols.js","./stubArray":"node_modules/lodash/stubArray.js"}],"node_modules/lodash/_copySymbolsIn.js":[function(require,module,exports) {
var copyObject = require('./_copyObject'),
    getSymbolsIn = require('./_getSymbolsIn');

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;

},{"./_copyObject":"node_modules/lodash/_copyObject.js","./_getSymbolsIn":"node_modules/lodash/_getSymbolsIn.js"}],"node_modules/lodash/_getAllKeysIn.js":[function(require,module,exports) {
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

},{"./_baseGetAllKeys":"node_modules/lodash/_baseGetAllKeys.js","./_getSymbolsIn":"node_modules/lodash/_getSymbolsIn.js","./keysIn":"node_modules/lodash/keysIn.js"}],"node_modules/lodash/_initCloneArray.js":[function(require,module,exports) {
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],"node_modules/lodash/_cloneArrayBuffer.js":[function(require,module,exports) {
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":"node_modules/lodash/_Uint8Array.js"}],"node_modules/lodash/_cloneDataView.js":[function(require,module,exports) {
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":"node_modules/lodash/_cloneArrayBuffer.js"}],"node_modules/lodash/_cloneRegExp.js":[function(require,module,exports) {
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],"node_modules/lodash/_cloneSymbol.js":[function(require,module,exports) {
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":"node_modules/lodash/_Symbol.js"}],"node_modules/lodash/_cloneTypedArray.js":[function(require,module,exports) {
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":"node_modules/lodash/_cloneArrayBuffer.js"}],"node_modules/lodash/_initCloneByTag.js":[function(require,module,exports) {
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":"node_modules/lodash/_cloneArrayBuffer.js","./_cloneDataView":"node_modules/lodash/_cloneDataView.js","./_cloneRegExp":"node_modules/lodash/_cloneRegExp.js","./_cloneSymbol":"node_modules/lodash/_cloneSymbol.js","./_cloneTypedArray":"node_modules/lodash/_cloneTypedArray.js"}],"node_modules/lodash/_baseCreate.js":[function(require,module,exports) {
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;

},{"./isObject":"node_modules/lodash/isObject.js"}],"node_modules/lodash/_initCloneObject.js":[function(require,module,exports) {
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":"node_modules/lodash/_baseCreate.js","./_getPrototype":"node_modules/lodash/_getPrototype.js","./_isPrototype":"node_modules/lodash/_isPrototype.js"}],"node_modules/lodash/_baseIsMap.js":[function(require,module,exports) {
var getTag = require('./_getTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;

},{"./_getTag":"node_modules/lodash/_getTag.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/isMap.js":[function(require,module,exports) {
var baseIsMap = require('./_baseIsMap'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;

},{"./_baseIsMap":"node_modules/lodash/_baseIsMap.js","./_baseUnary":"node_modules/lodash/_baseUnary.js","./_nodeUtil":"node_modules/lodash/_nodeUtil.js"}],"node_modules/lodash/_baseIsSet.js":[function(require,module,exports) {
var getTag = require('./_getTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;

},{"./_getTag":"node_modules/lodash/_getTag.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/isSet.js":[function(require,module,exports) {
var baseIsSet = require('./_baseIsSet'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;

},{"./_baseIsSet":"node_modules/lodash/_baseIsSet.js","./_baseUnary":"node_modules/lodash/_baseUnary.js","./_nodeUtil":"node_modules/lodash/_nodeUtil.js"}],"node_modules/lodash/_baseClone.js":[function(require,module,exports) {
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseAssignIn = require('./_baseAssignIn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    copySymbolsIn = require('./_copySymbolsIn'),
    getAllKeys = require('./_getAllKeys'),
    getAllKeysIn = require('./_getAllKeysIn'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isMap = require('./isMap'),
    isObject = require('./isObject'),
    isSet = require('./isSet'),
    keys = require('./keys'),
    keysIn = require('./keysIn');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":"node_modules/lodash/_Stack.js","./_arrayEach":"node_modules/lodash/_arrayEach.js","./_assignValue":"node_modules/lodash/_assignValue.js","./_baseAssign":"node_modules/lodash/_baseAssign.js","./_baseAssignIn":"node_modules/lodash/_baseAssignIn.js","./_cloneBuffer":"node_modules/lodash/_cloneBuffer.js","./_copyArray":"node_modules/lodash/_copyArray.js","./_copySymbols":"node_modules/lodash/_copySymbols.js","./_copySymbolsIn":"node_modules/lodash/_copySymbolsIn.js","./_getAllKeys":"node_modules/lodash/_getAllKeys.js","./_getAllKeysIn":"node_modules/lodash/_getAllKeysIn.js","./_getTag":"node_modules/lodash/_getTag.js","./_initCloneArray":"node_modules/lodash/_initCloneArray.js","./_initCloneByTag":"node_modules/lodash/_initCloneByTag.js","./_initCloneObject":"node_modules/lodash/_initCloneObject.js","./isArray":"node_modules/lodash/isArray.js","./isBuffer":"node_modules/lodash/isBuffer.js","./isMap":"node_modules/lodash/isMap.js","./isObject":"node_modules/lodash/isObject.js","./isSet":"node_modules/lodash/isSet.js","./keys":"node_modules/lodash/keys.js","./keysIn":"node_modules/lodash/keysIn.js"}],"node_modules/lodash/clone.js":[function(require,module,exports) {
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

module.exports = clone;

},{"./_baseClone":"node_modules/lodash/_baseClone.js"}],"node_modules/airtable/lib/callback_to_promise.js":[function(require,module,exports) {
"use strict";
/**
 * Given a function fn that takes a callback as its last argument, returns
 * a new version of the function that takes the callback optionally. If
 * the function is not called with a callback for the last argument, the
 * function will return a promise instead.
 */

function callbackToPromise(fn, context, callbackArgIndex) {
  if (callbackArgIndex === void 0) {
    callbackArgIndex = void 0;
  }

  return function () {
    var thisCallbackArgIndex;

    if (callbackArgIndex === void 0) {
      // istanbul ignore next
      thisCallbackArgIndex = arguments.length > 0 ? arguments.length - 1 : 0;
    } else {
      thisCallbackArgIndex = callbackArgIndex;
    }

    var callbackArg = arguments[thisCallbackArgIndex];

    if (typeof callbackArg === 'function') {
      fn.apply(context, arguments);
      return void 0;
    } else {
      var args_1 = []; // If an explicit callbackArgIndex is set, but the function is called
      // with too few arguments, we want to push undefined onto args so that
      // our constructed callback ends up at the right index.

      var argLen = Math.max(arguments.length, thisCallbackArgIndex);

      for (var i = 0; i < argLen; i++) {
        args_1.push(arguments[i]);
      }

      return new Promise(function (resolve, reject) {
        args_1.push(function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
        fn.apply(context, args_1);
      });
    }
  };
}

module.exports = callbackToPromise;
},{}],"node_modules/airtable/lib/record.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var assign_1 = __importDefault(require("lodash/assign"));

var callback_to_promise_1 = __importDefault(require("./callback_to_promise"));

var Record =
/** @class */
function () {
  function Record(table, recordId, recordJson) {
    this._table = table;
    this.id = recordId || recordJson.id;
    this.setRawJson(recordJson);
    this.save = callback_to_promise_1.default(save, this);
    this.patchUpdate = callback_to_promise_1.default(patchUpdate, this);
    this.putUpdate = callback_to_promise_1.default(putUpdate, this);
    this.destroy = callback_to_promise_1.default(destroy, this);
    this.fetch = callback_to_promise_1.default(fetch, this);
    this.updateFields = this.patchUpdate;
    this.replaceFields = this.putUpdate;
  }

  Record.prototype.getId = function () {
    return this.id;
  };

  Record.prototype.get = function (columnName) {
    return this.fields[columnName];
  };

  Record.prototype.set = function (columnName, columnValue) {
    this.fields[columnName] = columnValue;
  };

  Record.prototype.setRawJson = function (rawJson) {
    this._rawJson = rawJson;
    this.fields = this._rawJson && this._rawJson.fields || {};
  };

  return Record;
}();

function save(done) {
  this.putUpdate(this.fields, done);
}

function patchUpdate(cellValuesByName, opts, done) {
  var _this = this;

  if (!done) {
    done = opts;
    opts = {};
  }

  var updateBody = assign_1.default({
    fields: cellValuesByName
  }, opts);

  this._table._base.runAction('patch', "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, updateBody, function (err, response, results) {
    if (err) {
      done(err);
      return;
    }

    _this.setRawJson(results);

    done(null, _this);
  });
}

function putUpdate(cellValuesByName, opts, done) {
  var _this = this;

  if (!done) {
    done = opts;
    opts = {};
  }

  var updateBody = assign_1.default({
    fields: cellValuesByName
  }, opts);

  this._table._base.runAction('put', "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, updateBody, function (err, response, results) {
    if (err) {
      done(err);
      return;
    }

    _this.setRawJson(results);

    done(null, _this);
  });
}

function destroy(done) {
  var _this = this;

  this._table._base.runAction('delete', "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, null, function (err) {
    if (err) {
      done(err);
      return;
    }

    done(null, _this);
  });
}

function fetch(done) {
  var _this = this;

  this._table._base.runAction('get', "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, null, function (err, response, results) {
    if (err) {
      done(err);
      return;
    }

    _this.setRawJson(results);

    done(null, _this);
  });
}

module.exports = Record;
},{"lodash/assign":"node_modules/lodash/assign.js","./callback_to_promise":"node_modules/airtable/lib/callback_to_promise.js"}],"node_modules/airtable/lib/has.js":[function(require,module,exports) {
"use strict";

function has(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

module.exports = has;
},{}],"node_modules/lodash/_baseFindIndex.js":[function(require,module,exports) {
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],"node_modules/lodash/_baseIsNaN.js":[function(require,module,exports) {
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;

},{}],"node_modules/lodash/_strictIndexOf.js":[function(require,module,exports) {
/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;

},{}],"node_modules/lodash/_baseIndexOf.js":[function(require,module,exports) {
var baseFindIndex = require('./_baseFindIndex'),
    baseIsNaN = require('./_baseIsNaN'),
    strictIndexOf = require('./_strictIndexOf');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;

},{"./_baseFindIndex":"node_modules/lodash/_baseFindIndex.js","./_baseIsNaN":"node_modules/lodash/_baseIsNaN.js","./_strictIndexOf":"node_modules/lodash/_strictIndexOf.js"}],"node_modules/lodash/isString.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isArray":"node_modules/lodash/isArray.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/lodash/_trimmedEndIndex.js":[function(require,module,exports) {
/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;

},{}],"node_modules/lodash/_baseTrim.js":[function(require,module,exports) {
var trimmedEndIndex = require('./_trimmedEndIndex');

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;

},{"./_trimmedEndIndex":"node_modules/lodash/_trimmedEndIndex.js"}],"node_modules/lodash/toNumber.js":[function(require,module,exports) {
var baseTrim = require('./_baseTrim'),
    isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./_baseTrim":"node_modules/lodash/_baseTrim.js","./isObject":"node_modules/lodash/isObject.js","./isSymbol":"node_modules/lodash/isSymbol.js"}],"node_modules/lodash/toFinite.js":[function(require,module,exports) {
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;

},{"./toNumber":"node_modules/lodash/toNumber.js"}],"node_modules/lodash/toInteger.js":[function(require,module,exports) {
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

},{"./toFinite":"node_modules/lodash/toFinite.js"}],"node_modules/lodash/_baseValues.js":[function(require,module,exports) {
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;

},{"./_arrayMap":"node_modules/lodash/_arrayMap.js"}],"node_modules/lodash/values.js":[function(require,module,exports) {
var baseValues = require('./_baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;

},{"./_baseValues":"node_modules/lodash/_baseValues.js","./keys":"node_modules/lodash/keys.js"}],"node_modules/lodash/includes.js":[function(require,module,exports) {
var baseIndexOf = require('./_baseIndexOf'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    toInteger = require('./toInteger'),
    values = require('./values');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

module.exports = includes;

},{"./_baseIndexOf":"node_modules/lodash/_baseIndexOf.js","./isArrayLike":"node_modules/lodash/isArrayLike.js","./isString":"node_modules/lodash/isString.js","./toInteger":"node_modules/lodash/toInteger.js","./values":"node_modules/lodash/values.js"}],"node_modules/airtable/lib/typecheck.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var includes_1 = __importDefault(require("lodash/includes"));

var isArray_1 = __importDefault(require("lodash/isArray"));

function check(fn, error) {
  return function (value) {
    if (fn(value)) {
      return {
        pass: true
      };
    } else {
      return {
        pass: false,
        error: error
      };
    }
  };
}

check.isOneOf = function isOneOf(options) {
  return includes_1.default.bind(this, options);
};

check.isArrayOf = function (itemValidator) {
  return function (value) {
    return isArray_1.default(value) && value.every(itemValidator);
  };
};

module.exports = check;
},{"lodash/includes":"node_modules/lodash/includes.js","lodash/isArray":"node_modules/lodash/isArray.js"}],"node_modules/lodash/isNumber.js":[function(require,module,exports) {
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && baseGetTag(value) == numberTag);
}

module.exports = isNumber;

},{"./_baseGetTag":"node_modules/lodash/_baseGetTag.js","./isObjectLike":"node_modules/lodash/isObjectLike.js"}],"node_modules/airtable/lib/query_params.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paramValidators = void 0;

var typecheck_1 = __importDefault(require("./typecheck"));

var isString_1 = __importDefault(require("lodash/isString"));

var isNumber_1 = __importDefault(require("lodash/isNumber"));

var isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));

var includes_1 = __importDefault(require("lodash/includes"));

exports.paramValidators = {
  fields: typecheck_1.default(typecheck_1.default.isArrayOf(isString_1.default), 'the value for `fields` should be an array of strings'),
  filterByFormula: typecheck_1.default(isString_1.default, 'the value for `filterByFormula` should be a string'),
  maxRecords: typecheck_1.default(isNumber_1.default, 'the value for `maxRecords` should be a number'),
  pageSize: typecheck_1.default(isNumber_1.default, 'the value for `pageSize` should be a number'),
  offset: typecheck_1.default(isNumber_1.default, 'the value for `offset` should be a number'),
  sort: typecheck_1.default(typecheck_1.default.isArrayOf(function (obj) {
    return isPlainObject_1.default(obj) && isString_1.default(obj.field) && (obj.direction === void 0 || includes_1.default(['asc', 'desc'], obj.direction));
  }), 'the value for `sort` should be an array of sort objects. ' + 'Each sort object must have a string `field` value, and an optional ' + '`direction` value that is "asc" or "desc".'),
  view: typecheck_1.default(isString_1.default, 'the value for `view` should be a string'),
  cellFormat: typecheck_1.default(function (cellFormat) {
    return isString_1.default(cellFormat) && includes_1.default(['json', 'string'], cellFormat);
  }, 'the value for `cellFormat` should be "json" or "string"'),
  timeZone: typecheck_1.default(isString_1.default, 'the value for `timeZone` should be a string'),
  userLocale: typecheck_1.default(isString_1.default, 'the value for `userLocale` should be a string')
};
},{"./typecheck":"node_modules/airtable/lib/typecheck.js","lodash/isString":"node_modules/lodash/isString.js","lodash/isNumber":"node_modules/lodash/isNumber.js","lodash/isPlainObject":"node_modules/lodash/isPlainObject.js","lodash/includes":"node_modules/lodash/includes.js"}],"node_modules/airtable/lib/query.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var isFunction_1 = __importDefault(require("lodash/isFunction"));

var clone_1 = __importDefault(require("lodash/clone"));

var forEach_1 = __importDefault(require("lodash/forEach"));

var map_1 = __importDefault(require("lodash/map"));

var keys_1 = __importDefault(require("lodash/keys"));

var record_1 = __importDefault(require("./record"));

var callback_to_promise_1 = __importDefault(require("./callback_to_promise"));

var has_1 = __importDefault(require("./has"));

var query_params_1 = require("./query_params");
/**
 * Builds a query object. Won't fetch until `firstPage` or
 * or `eachPage` is called.
 *
 * Params should be validated prior to being passed to Query
 * with `Query.validateParams`.
 */


var Query =
/** @class */
function () {
  function Query(table, params) {
    this._table = table;
    this._params = params;
    this.firstPage = callback_to_promise_1.default(firstPage, this);
    this.eachPage = callback_to_promise_1.default(eachPage, this, 1);
    this.all = callback_to_promise_1.default(all, this);
  }
  /**
   * Validates the parameters for passing to the Query constructor.
   *
   * @params {object} params parameters to validate
   *
   * @return an object with two keys:
   *  validParams: the object that should be passed to the constructor.
   *  ignoredKeys: a list of keys that will be ignored.
   *  errors: a list of error messages.
   */


  Query.validateParams = function (params) {
    var validParams = {};
    var ignoredKeys = [];
    var errors = [];
    forEach_1.default(keys_1.default(params), function (key) {
      var value = params[key];

      if (has_1.default(Query.paramValidators, key)) {
        var validator = Query.paramValidators[key];
        var validationResult = validator(value);

        if (validationResult.pass) {
          validParams[key] = value;
        } else {
          errors.push(validationResult.error);
        }
      } else {
        ignoredKeys.push(key);
      }
    });
    return {
      validParams: validParams,
      ignoredKeys: ignoredKeys,
      errors: errors
    };
  };

  Query.paramValidators = query_params_1.paramValidators;
  return Query;
}();
/**
 * Fetches the first page of results for the query asynchronously,
 * then calls `done(error, records)`.
 */


function firstPage(done) {
  if (!isFunction_1.default(done)) {
    throw new Error('The first parameter to `firstPage` must be a function');
  }

  this.eachPage(function (records) {
    done(null, records);
  }, function (error) {
    done(error, null);
  });
}
/**
 * Fetches each page of results for the query asynchronously.
 *
 * Calls `pageCallback(records, fetchNextPage)` for each
 * page. You must call `fetchNextPage()` to fetch the next page of
 * results.
 *
 * After fetching all pages, or if there's an error, calls
 * `done(error)`.
 */


function eachPage(pageCallback, done) {
  var _this = this;

  if (!isFunction_1.default(pageCallback)) {
    throw new Error('The first parameter to `eachPage` must be a function');
  }

  if (!isFunction_1.default(done) && done !== void 0) {
    throw new Error('The second parameter to `eachPage` must be a function or undefined');
  }

  var path = "/" + this._table._urlEncodedNameOrId();

  var params = clone_1.default(this._params);

  var inner = function inner() {
    _this._table._base.runAction('get', path, params, null, function (err, response, result) {
      if (err) {
        done(err, null);
      } else {
        var next = void 0;

        if (result.offset) {
          params.offset = result.offset;
          next = inner;
        } else {
          next = function next() {
            done(null);
          };
        }

        var records = map_1.default(result.records, function (recordJson) {
          return new record_1.default(_this._table, null, recordJson);
        });
        pageCallback(records, next);
      }
    });
  };

  inner();
}
/**
 * Fetches all pages of results asynchronously. May take a long time.
 */


function all(done) {
  if (!isFunction_1.default(done)) {
    throw new Error('The first parameter to `all` must be a function');
  }

  var allRecords = [];
  this.eachPage(function (pageRecords, fetchNextPage) {
    allRecords.push.apply(allRecords, pageRecords);
    fetchNextPage();
  }, function (err) {
    if (err) {
      done(err, null);
    } else {
      done(null, allRecords);
    }
  });
}

module.exports = Query;
},{"lodash/isFunction":"node_modules/lodash/isFunction.js","lodash/clone":"node_modules/lodash/clone.js","lodash/forEach":"node_modules/lodash/forEach.js","lodash/map":"node_modules/lodash/map.js","lodash/keys":"node_modules/lodash/keys.js","./record":"node_modules/airtable/lib/record.js","./callback_to_promise":"node_modules/airtable/lib/callback_to_promise.js","./has":"node_modules/airtable/lib/has.js","./query_params":"node_modules/airtable/lib/query_params.js"}],"node_modules/airtable/lib/table.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var isArray_1 = __importDefault(require("lodash/isArray"));

var isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));

var assign_1 = __importDefault(require("lodash/assign"));

var forEach_1 = __importDefault(require("lodash/forEach"));

var map_1 = __importDefault(require("lodash/map"));

var deprecate_1 = __importDefault(require("./deprecate"));

var query_1 = __importDefault(require("./query"));

var record_1 = __importDefault(require("./record"));

var callback_to_promise_1 = __importDefault(require("./callback_to_promise"));

var Table =
/** @class */
function () {
  function Table(base, tableId, tableName) {
    if (!tableId && !tableName) {
      throw new Error('Table name or table ID is required');
    }

    this._base = base;
    this.id = tableId;
    this.name = tableName; // Public API

    this.find = callback_to_promise_1.default(this._findRecordById, this);
    this.select = this._selectRecords.bind(this);
    this.create = callback_to_promise_1.default(this._createRecords, this);
    this.update = callback_to_promise_1.default(this._updateRecords.bind(this, false), this);
    this.replace = callback_to_promise_1.default(this._updateRecords.bind(this, true), this);
    this.destroy = callback_to_promise_1.default(this._destroyRecord, this); // Deprecated API

    this.list = deprecate_1.default(this._listRecords.bind(this), 'table.list', 'Airtable: `list()` is deprecated. Use `select()` instead.');
    this.forEach = deprecate_1.default(this._forEachRecord.bind(this), 'table.forEach', 'Airtable: `forEach()` is deprecated. Use `select()` instead.');
  }

  Table.prototype._findRecordById = function (recordId, done) {
    var record = new record_1.default(this, recordId);
    record.fetch(done);
  };

  Table.prototype._selectRecords = function (params) {
    if (params === void 0) {
      params = {};
    }

    if (arguments.length > 1) {
      console.warn("Airtable: `select` takes only one parameter, but it was given " + arguments.length + " parameters. Use `eachPage` or `firstPage` to fetch records.");
    }

    if (isPlainObject_1.default(params)) {
      var validationResults = query_1.default.validateParams(params);

      if (validationResults.errors.length) {
        var formattedErrors = map_1.default(validationResults.errors, function (error) {
          return "  * " + error;
        });
        throw new Error("Airtable: invalid parameters for `select`:\n" + formattedErrors.join('\n'));
      }

      if (validationResults.ignoredKeys.length) {
        console.warn("Airtable: the following parameters to `select` will be ignored: " + validationResults.ignoredKeys.join(', '));
      }

      return new query_1.default(this, validationResults.validParams);
    } else {
      throw new Error('Airtable: the parameter for `select` should be a plain object or undefined.');
    }
  };

  Table.prototype._urlEncodedNameOrId = function () {
    return this.id || encodeURIComponent(this.name);
  };

  Table.prototype._createRecords = function (recordsData, optionalParameters, done) {
    var _this = this;

    var isCreatingMultipleRecords = isArray_1.default(recordsData);

    if (!done) {
      done = optionalParameters;
      optionalParameters = {};
    }

    var requestData;

    if (isCreatingMultipleRecords) {
      requestData = {
        records: recordsData
      };
    } else {
      requestData = {
        fields: recordsData
      };
    }

    assign_1.default(requestData, optionalParameters);

    this._base.runAction('post', "/" + this._urlEncodedNameOrId() + "/", {}, requestData, function (err, resp, body) {
      if (err) {
        done(err);
        return;
      }

      var result;

      if (isCreatingMultipleRecords) {
        result = body.records.map(function (record) {
          return new record_1.default(_this, record.id, record);
        });
      } else {
        result = new record_1.default(_this, body.id, body);
      }

      done(null, result);
    });
  };

  Table.prototype._updateRecords = function (isDestructiveUpdate, recordsDataOrRecordId, recordDataOrOptsOrDone, optsOrDone, done) {
    var _this = this;

    var opts;

    if (isArray_1.default(recordsDataOrRecordId)) {
      var recordsData = recordsDataOrRecordId;
      opts = isPlainObject_1.default(recordDataOrOptsOrDone) ? recordDataOrOptsOrDone : {};
      done = optsOrDone || recordDataOrOptsOrDone;
      var method = isDestructiveUpdate ? 'put' : 'patch';
      var requestData = assign_1.default({
        records: recordsData
      }, opts);

      this._base.runAction(method, "/" + this._urlEncodedNameOrId() + "/", {}, requestData, function (err, resp, body) {
        if (err) {
          done(err);
          return;
        }

        var result = body.records.map(function (record) {
          return new record_1.default(_this, record.id, record);
        });
        done(null, result);
      });
    } else {
      var recordId = recordsDataOrRecordId;
      var recordData = recordDataOrOptsOrDone;
      opts = isPlainObject_1.default(optsOrDone) ? optsOrDone : {};
      done = done || optsOrDone;
      var record = new record_1.default(this, recordId);

      if (isDestructiveUpdate) {
        record.putUpdate(recordData, opts, done);
      } else {
        record.patchUpdate(recordData, opts, done);
      }
    }
  };

  Table.prototype._destroyRecord = function (recordIdsOrId, done) {
    var _this = this;

    if (isArray_1.default(recordIdsOrId)) {
      var queryParams = {
        records: recordIdsOrId
      };

      this._base.runAction('delete', "/" + this._urlEncodedNameOrId(), queryParams, null, function (err, response, results) {
        if (err) {
          done(err);
          return;
        }

        var records = map_1.default(results.records, function (_a) {
          var id = _a.id;
          return new record_1.default(_this, id, null);
        });
        done(null, records);
      });
    } else {
      var record = new record_1.default(this, recordIdsOrId);
      record.destroy(done);
    }
  };

  Table.prototype._listRecords = function (limit, offset, opts, done) {
    var _this = this;

    if (!done) {
      done = opts;
      opts = {};
    }

    var listRecordsParameters = assign_1.default({
      limit: limit,
      offset: offset
    }, opts);

    this._base.runAction('get', "/" + this._urlEncodedNameOrId() + "/", listRecordsParameters, null, function (err, response, results) {
      if (err) {
        done(err);
        return;
      }

      var records = map_1.default(results.records, function (recordJson) {
        return new record_1.default(_this, null, recordJson);
      });
      done(null, records, results.offset);
    });
  };

  Table.prototype._forEachRecord = function (opts, callback, done) {
    var _this = this;

    if (arguments.length === 2) {
      done = callback;
      callback = opts;
      opts = {};
    }

    var limit = Table.__recordsPerPageForIteration || 100;
    var offset = null;

    var nextPage = function nextPage() {
      _this._listRecords(limit, offset, opts, function (err, page, newOffset) {
        if (err) {
          done(err);
          return;
        }

        forEach_1.default(page, callback);

        if (newOffset) {
          offset = newOffset;
          nextPage();
        } else {
          done();
        }
      });
    };

    nextPage();
  };

  return Table;
}();

module.exports = Table;
},{"lodash/isArray":"node_modules/lodash/isArray.js","lodash/isPlainObject":"node_modules/lodash/isPlainObject.js","lodash/assign":"node_modules/lodash/assign.js","lodash/forEach":"node_modules/lodash/forEach.js","lodash/map":"node_modules/lodash/map.js","./deprecate":"node_modules/airtable/lib/deprecate.js","./query":"node_modules/airtable/lib/query.js","./record":"node_modules/airtable/lib/record.js","./callback_to_promise":"node_modules/airtable/lib/callback_to_promise.js"}],"node_modules/airtable/lib/http_headers.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var forEach_1 = __importDefault(require("lodash/forEach"));

var isBrowser = typeof window !== 'undefined';

var HttpHeaders =
/** @class */
function () {
  function HttpHeaders() {
    this._headersByLowercasedKey = {};
  }

  HttpHeaders.prototype.set = function (headerKey, headerValue) {
    var lowercasedKey = headerKey.toLowerCase();

    if (lowercasedKey === 'x-airtable-user-agent') {
      lowercasedKey = 'user-agent';
      headerKey = 'User-Agent';
    }

    this._headersByLowercasedKey[lowercasedKey] = {
      headerKey: headerKey,
      headerValue: headerValue
    };
  };

  HttpHeaders.prototype.toJSON = function () {
    var result = {};
    forEach_1.default(this._headersByLowercasedKey, function (headerDefinition, lowercasedKey) {
      var headerKey;
      /* istanbul ignore next */

      if (isBrowser && lowercasedKey === 'user-agent') {
        // Some browsers do not allow overriding the user agent.
        // https://github.com/Airtable/airtable.js/issues/52
        headerKey = 'X-Airtable-User-Agent';
      } else {
        headerKey = headerDefinition.headerKey;
      }

      result[headerKey] = headerDefinition.headerValue;
    });
    return result;
  };

  return HttpHeaders;
}();

module.exports = HttpHeaders;
},{"lodash/forEach":"node_modules/lodash/forEach.js"}],"node_modules/airtable/lib/internal_config.json":[function(require,module,exports) {
module.exports = {
  "INITIAL_RETRY_DELAY_IF_RATE_LIMITED": 5000,
  "MAX_RETRY_DELAY_IF_RATE_LIMITED": 600000
};
},{}],"node_modules/airtable/lib/exponential_backoff_with_jitter.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var internal_config_json_1 = __importDefault(require("./internal_config.json")); // "Full Jitter" algorithm taken from https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/


function exponentialBackoffWithJitter(numberOfRetries) {
  var rawBackoffTimeMs = internal_config_json_1.default.INITIAL_RETRY_DELAY_IF_RATE_LIMITED * Math.pow(2, numberOfRetries);
  var clippedBackoffTimeMs = Math.min(internal_config_json_1.default.MAX_RETRY_DELAY_IF_RATE_LIMITED, rawBackoffTimeMs);
  var jitteredBackoffTimeMs = Math.random() * clippedBackoffTimeMs;
  return jitteredBackoffTimeMs;
}

module.exports = exponentialBackoffWithJitter;
},{"./internal_config.json":"node_modules/airtable/lib/internal_config.json"}],"node_modules/airtable/lib/package_version_browser.js":[function(require,module,exports) {
"use strict";

module.exports = "1.0.0";
},{}],"node_modules/airtable/lib/run_action.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var exponential_backoff_with_jitter_1 = __importDefault(require("./exponential_backoff_with_jitter"));

var object_to_query_param_string_1 = __importDefault(require("./object_to_query_param_string"));

var package_version_1 = __importDefault(require("./package_version"));

var fetch_1 = __importDefault(require("./fetch"));

var abort_controller_1 = __importDefault(require("./abort-controller"));

var userAgent = "Airtable.js/" + package_version_1.default;

function runAction(base, method, path, queryParams, bodyData, callback, numAttempts) {
  var url = base._airtable._endpointUrl + "/v" + base._airtable._apiVersionMajor + "/" + base._id + path + "?" + object_to_query_param_string_1.default(queryParams);
  var headers = {
    authorization: "Bearer " + base._airtable._apiKey,
    'x-api-version': base._airtable._apiVersion,
    'x-airtable-application-id': base.getId(),
    'content-type': 'application/json'
  };
  var isBrowser = typeof window !== 'undefined'; // Some browsers do not allow overriding the user agent.
  // https://github.com/Airtable/airtable.js/issues/52

  if (isBrowser) {
    headers['x-airtable-user-agent'] = userAgent;
  } else {
    headers['User-Agent'] = userAgent;
  }

  var controller = new abort_controller_1.default();
  var normalizedMethod = method.toUpperCase();
  var options = {
    method: normalizedMethod,
    headers: headers,
    signal: controller.signal
  };

  if (bodyData !== null) {
    if (normalizedMethod === 'GET' || normalizedMethod === 'HEAD') {
      console.warn('body argument to runAction are ignored with GET or HEAD requests');
    } else {
      options.body = JSON.stringify(bodyData);
    }
  }

  var timeout = setTimeout(function () {
    controller.abort();
  }, base._airtable.requestTimeout);
  fetch_1.default(url, options).then(function (resp) {
    clearTimeout(timeout);

    if (resp.status === 429 && !base._airtable._noRetryIfRateLimited) {
      var backoffDelayMs = exponential_backoff_with_jitter_1.default(numAttempts);
      setTimeout(function () {
        runAction(base, method, path, queryParams, bodyData, callback, numAttempts + 1);
      }, backoffDelayMs);
    } else {
      resp.json().then(function (body) {
        var error = base._checkStatusForError(resp.status, body); // Ensure Response interface matches interface from
        // `request` Response object


        var r = {};
        Object.keys(resp).forEach(function (property) {
          r[property] = resp[property];
        });
        r.body = body;
        r.statusCode = resp.status;
        callback(error, r, body);
      }).catch(function () {
        callback(base._checkStatusForError(resp.status));
      });
    }
  }).catch(function (error) {
    clearTimeout(timeout);
    callback(error);
  });
}

module.exports = runAction;
},{"./exponential_backoff_with_jitter":"node_modules/airtable/lib/exponential_backoff_with_jitter.js","./object_to_query_param_string":"node_modules/airtable/lib/object_to_query_param_string.js","./package_version":"node_modules/airtable/lib/package_version_browser.js","./fetch":"node_modules/airtable/lib/fetch.js","./abort-controller":"node_modules/airtable/lib/abort-controller.js"}],"node_modules/airtable/lib/base.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var forEach_1 = __importDefault(require("lodash/forEach"));

var get_1 = __importDefault(require("lodash/get"));

var assign_1 = __importDefault(require("lodash/assign"));

var isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));

var fetch_1 = __importDefault(require("./fetch"));

var abort_controller_1 = __importDefault(require("./abort-controller"));

var object_to_query_param_string_1 = __importDefault(require("./object_to_query_param_string"));

var airtable_error_1 = __importDefault(require("./airtable_error"));

var table_1 = __importDefault(require("./table"));

var http_headers_1 = __importDefault(require("./http_headers"));

var run_action_1 = __importDefault(require("./run_action"));

var package_version_1 = __importDefault(require("./package_version"));

var exponential_backoff_with_jitter_1 = __importDefault(require("./exponential_backoff_with_jitter"));

var userAgent = "Airtable.js/" + package_version_1.default;

var Base =
/** @class */
function () {
  function Base(airtable, baseId) {
    this._airtable = airtable;
    this._id = baseId;
  }

  Base.prototype.table = function (tableName) {
    return new table_1.default(this, null, tableName);
  };

  Base.prototype.makeRequest = function (options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var method = get_1.default(options, 'method', 'GET').toUpperCase();
    var url = this._airtable._endpointUrl + "/v" + this._airtable._apiVersionMajor + "/" + this._id + get_1.default(options, 'path', '/') + "?" + object_to_query_param_string_1.default(get_1.default(options, 'qs', {}));
    var controller = new abort_controller_1.default();
    var requestOptions = {
      method: method,
      headers: this._getRequestHeaders(get_1.default(options, 'headers', {})),
      signal: controller.signal
    };

    if ('body' in options && _canRequestMethodIncludeBody(method)) {
      requestOptions.body = JSON.stringify(options.body);
    }

    var timeout = setTimeout(function () {
      controller.abort();
    }, this._airtable.requestTimeout);
    return new Promise(function (resolve, reject) {
      fetch_1.default(url, requestOptions).then(function (resp) {
        clearTimeout(timeout);
        resp.statusCode = resp.status;

        if (resp.status === 429 && !_this._airtable._noRetryIfRateLimited) {
          var numAttempts_1 = get_1.default(options, '_numAttempts', 0);
          var backoffDelayMs = exponential_backoff_with_jitter_1.default(numAttempts_1);
          setTimeout(function () {
            var newOptions = assign_1.default({}, options, {
              _numAttempts: numAttempts_1 + 1
            });

            _this.makeRequest(newOptions).then(resolve).catch(reject);
          }, backoffDelayMs);
        } else {
          resp.json().then(function (body) {
            var err = _this._checkStatusForError(resp.status, body) || _getErrorForNonObjectBody(resp.status, body);

            if (err) {
              reject(err);
            } else {
              resolve({
                statusCode: resp.status,
                headers: resp.headers,
                body: body
              });
            }
          }).catch(function () {
            var err = _getErrorForNonObjectBody(resp.status);

            reject(err);
          });
        }
      }).catch(function (err) {
        clearTimeout(timeout);
        err = new airtable_error_1.default('CONNECTION_ERROR', err.message, null);
        reject(err);
      });
    });
  };
  /**
   * @deprecated This method is deprecated.
   */


  Base.prototype.runAction = function (method, path, queryParams, bodyData, callback) {
    run_action_1.default(this, method, path, queryParams, bodyData, callback, 0);
  };

  Base.prototype._getRequestHeaders = function (headers) {
    var result = new http_headers_1.default();
    result.set('Authorization', "Bearer " + this._airtable._apiKey);
    result.set('User-Agent', userAgent);
    result.set('Content-Type', 'application/json');
    forEach_1.default(headers, function (headerValue, headerKey) {
      result.set(headerKey, headerValue);
    });
    return result.toJSON();
  };

  Base.prototype._checkStatusForError = function (statusCode, body) {
    var _a = (body !== null && body !== void 0 ? body : {
      error: {}
    }).error,
        error = _a === void 0 ? {} : _a;
    var type = error.type,
        message = error.message;

    if (statusCode === 401) {
      return new airtable_error_1.default('AUTHENTICATION_REQUIRED', 'You should provide valid api key to perform this operation', statusCode);
    } else if (statusCode === 403) {
      return new airtable_error_1.default('NOT_AUTHORIZED', 'You are not authorized to perform this operation', statusCode);
    } else if (statusCode === 404) {
      return new airtable_error_1.default('NOT_FOUND', message !== null && message !== void 0 ? message : 'Could not find what you are looking for', statusCode);
    } else if (statusCode === 413) {
      return new airtable_error_1.default('REQUEST_TOO_LARGE', 'Request body is too large', statusCode);
    } else if (statusCode === 422) {
      return new airtable_error_1.default(type !== null && type !== void 0 ? type : 'UNPROCESSABLE_ENTITY', message !== null && message !== void 0 ? message : 'The operation cannot be processed', statusCode);
    } else if (statusCode === 429) {
      return new airtable_error_1.default('TOO_MANY_REQUESTS', 'You have made too many requests in a short period of time. Please retry your request later', statusCode);
    } else if (statusCode === 500) {
      return new airtable_error_1.default('SERVER_ERROR', 'Try again. If the problem persists, contact support.', statusCode);
    } else if (statusCode === 503) {
      return new airtable_error_1.default('SERVICE_UNAVAILABLE', 'The service is temporarily unavailable. Please retry shortly.', statusCode);
    } else if (statusCode >= 400) {
      return new airtable_error_1.default(type !== null && type !== void 0 ? type : 'UNEXPECTED_ERROR', message !== null && message !== void 0 ? message : 'An unexpected error occurred', statusCode);
    } else {
      return null;
    }
  };

  Base.prototype.doCall = function (tableName) {
    return this.table(tableName);
  };

  Base.prototype.getId = function () {
    return this._id;
  };

  Base.createFunctor = function (airtable, baseId) {
    var base = new Base(airtable, baseId);

    var baseFn = function baseFn(tableName) {
      return base.doCall(tableName);
    };

    forEach_1.default(['table', 'makeRequest', 'runAction', 'getId'], function (baseMethod) {
      baseFn[baseMethod] = base[baseMethod].bind(base);
    });
    baseFn._base = base;
    return baseFn;
  };

  return Base;
}();

function _canRequestMethodIncludeBody(method) {
  return method !== 'GET' && method !== 'DELETE';
}

function _getErrorForNonObjectBody(statusCode, body) {
  if (isPlainObject_1.default(body)) {
    return null;
  } else {
    return new airtable_error_1.default('UNEXPECTED_ERROR', 'The response from Airtable was invalid JSON. Please try again soon.', statusCode);
  }
}

module.exports = Base;
},{"lodash/forEach":"node_modules/lodash/forEach.js","lodash/get":"node_modules/lodash/get.js","lodash/assign":"node_modules/lodash/assign.js","lodash/isPlainObject":"node_modules/lodash/isPlainObject.js","./fetch":"node_modules/airtable/lib/fetch.js","./abort-controller":"node_modules/airtable/lib/abort-controller.js","./object_to_query_param_string":"node_modules/airtable/lib/object_to_query_param_string.js","./airtable_error":"node_modules/airtable/lib/airtable_error.js","./table":"node_modules/airtable/lib/table.js","./http_headers":"node_modules/airtable/lib/http_headers.js","./run_action":"node_modules/airtable/lib/run_action.js","./package_version":"node_modules/airtable/lib/package_version_browser.js","./exponential_backoff_with_jitter":"node_modules/airtable/lib/exponential_backoff_with_jitter.js"}],"node_modules/airtable/lib/airtable.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var base_1 = __importDefault(require("./base"));

var record_1 = __importDefault(require("./record"));

var table_1 = __importDefault(require("./table"));

var airtable_error_1 = __importDefault(require("./airtable_error"));

var Airtable =
/** @class */
function () {
  function Airtable(opts) {
    if (opts === void 0) {
      opts = {};
    }

    var defaultConfig = Airtable.default_config();
    var apiVersion = opts.apiVersion || Airtable.apiVersion || defaultConfig.apiVersion;
    Object.defineProperties(this, {
      _apiKey: {
        value: opts.apiKey || Airtable.apiKey || defaultConfig.apiKey
      },
      _endpointUrl: {
        value: opts.endpointUrl || Airtable.endpointUrl || defaultConfig.endpointUrl
      },
      _apiVersion: {
        value: apiVersion
      },
      _apiVersionMajor: {
        value: apiVersion.split('.')[0]
      },
      _noRetryIfRateLimited: {
        value: opts.noRetryIfRateLimited || Airtable.noRetryIfRateLimited || defaultConfig.noRetryIfRateLimited
      }
    });
    this.requestTimeout = opts.requestTimeout || defaultConfig.requestTimeout;

    if (!this._apiKey) {
      throw new Error('An API key is required to connect to Airtable');
    }
  }

  Airtable.prototype.base = function (baseId) {
    return base_1.default.createFunctor(this, baseId);
  };

  Airtable.default_config = function () {
    return {
      endpointUrl: undefined || 'https://api.airtable.com',
      apiVersion: '0.1.0',
      apiKey: undefined,
      noRetryIfRateLimited: false,
      requestTimeout: 300 * 1000
    };
  };

  Airtable.configure = function (_a) {
    var apiKey = _a.apiKey,
        endpointUrl = _a.endpointUrl,
        apiVersion = _a.apiVersion,
        noRetryIfRateLimited = _a.noRetryIfRateLimited;
    Airtable.apiKey = apiKey;
    Airtable.endpointUrl = endpointUrl;
    Airtable.apiVersion = apiVersion;
    Airtable.noRetryIfRateLimited = noRetryIfRateLimited;
  };

  Airtable.base = function (baseId) {
    return new Airtable().base(baseId);
  };

  Airtable.Base = base_1.default;
  Airtable.Record = record_1.default;
  Airtable.Table = table_1.default;
  Airtable.Error = airtable_error_1.default;
  return Airtable;
}();

module.exports = Airtable;
},{"./base":"node_modules/airtable/lib/base.js","./record":"node_modules/airtable/lib/record.js","./table":"node_modules/airtable/lib/table.js","./airtable_error":"node_modules/airtable/lib/airtable_error.js"}],"node_modules/lottie-web/build/player/lottie.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
(typeof navigator !== "undefined") && (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lottie = factory());
})(this, (function () { 'use strict';

  var svgNS = 'http://www.w3.org/2000/svg';
  var locationHref = '';
  var _useWebWorker = false;
  var initialDefaultFrame = -999999;

  var setWebWorker = function setWebWorker(flag) {
    _useWebWorker = !!flag;
  };

  var getWebWorker = function getWebWorker() {
    return _useWebWorker;
  };

  var setLocationHref = function setLocationHref(value) {
    locationHref = value;
  };

  var getLocationHref = function getLocationHref() {
    return locationHref;
  };

  function createTag(type) {
    // return {appendChild:function(){},setAttribute:function(){},style:{}}
    return document.createElement(type);
  }

  function extendPrototype(sources, destination) {
    var i;
    var len = sources.length;
    var sourcePrototype;

    for (i = 0; i < len; i += 1) {
      sourcePrototype = sources[i].prototype;

      for (var attr in sourcePrototype) {
        if (Object.prototype.hasOwnProperty.call(sourcePrototype, attr)) destination.prototype[attr] = sourcePrototype[attr];
      }
    }
  }

  function getDescriptor(object, prop) {
    return Object.getOwnPropertyDescriptor(object, prop);
  }

  function createProxyFunction(prototype) {
    function ProxyFunction() {}

    ProxyFunction.prototype = prototype;
    return ProxyFunction;
  }

  // import Howl from '../../3rd_party/howler';
  var audioControllerFactory = function () {
    function AudioController(audioFactory) {
      this.audios = [];
      this.audioFactory = audioFactory;
      this._volume = 1;
      this._isMuted = false;
    }

    AudioController.prototype = {
      addAudio: function addAudio(audio) {
        this.audios.push(audio);
      },
      pause: function pause() {
        var i;
        var len = this.audios.length;

        for (i = 0; i < len; i += 1) {
          this.audios[i].pause();
        }
      },
      resume: function resume() {
        var i;
        var len = this.audios.length;

        for (i = 0; i < len; i += 1) {
          this.audios[i].resume();
        }
      },
      setRate: function setRate(rateValue) {
        var i;
        var len = this.audios.length;

        for (i = 0; i < len; i += 1) {
          this.audios[i].setRate(rateValue);
        }
      },
      createAudio: function createAudio(assetPath) {
        if (this.audioFactory) {
          return this.audioFactory(assetPath);
        }

        if (window.Howl) {
          return new window.Howl({
            src: [assetPath]
          });
        }

        return {
          isPlaying: false,
          play: function play() {
            this.isPlaying = true;
          },
          seek: function seek() {
            this.isPlaying = false;
          },
          playing: function playing() {},
          rate: function rate() {},
          setVolume: function setVolume() {}
        };
      },
      setAudioFactory: function setAudioFactory(audioFactory) {
        this.audioFactory = audioFactory;
      },
      setVolume: function setVolume(value) {
        this._volume = value;

        this._updateVolume();
      },
      mute: function mute() {
        this._isMuted = true;

        this._updateVolume();
      },
      unmute: function unmute() {
        this._isMuted = false;

        this._updateVolume();
      },
      getVolume: function getVolume() {
        return this._volume;
      },
      _updateVolume: function _updateVolume() {
        var i;
        var len = this.audios.length;

        for (i = 0; i < len; i += 1) {
          this.audios[i].volume(this._volume * (this._isMuted ? 0 : 1));
        }
      }
    };
    return function () {
      return new AudioController();
    };
  }();

  var createTypedArray = function () {
    function createRegularArray(type, len) {
      var i = 0;
      var arr = [];
      var value;

      switch (type) {
        case 'int16':
        case 'uint8c':
          value = 1;
          break;

        default:
          value = 1.1;
          break;
      }

      for (i = 0; i < len; i += 1) {
        arr.push(value);
      }

      return arr;
    }

    function createTypedArrayFactory(type, len) {
      if (type === 'float32') {
        return new Float32Array(len);
      }

      if (type === 'int16') {
        return new Int16Array(len);
      }

      if (type === 'uint8c') {
        return new Uint8ClampedArray(len);
      }

      return createRegularArray(type, len);
    }

    if (typeof Uint8ClampedArray === 'function' && typeof Float32Array === 'function') {
      return createTypedArrayFactory;
    }

    return createRegularArray;
  }();

  function createSizedArray(len) {
    return Array.apply(null, {
      length: len
    });
  }

  function _typeof$6(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$6 = function _typeof(obj) { return typeof obj; }; } else { _typeof$6 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$6(obj); }
  var subframeEnabled = true;
  var expressionsPlugin = null;
  var idPrefix = '';
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var _shouldRoundValues = false;
  var bmPow = Math.pow;
  var bmSqrt = Math.sqrt;
  var bmFloor = Math.floor;
  var bmMax = Math.max;
  var bmMin = Math.min;
  var BMMath = {};

  (function () {
    var propertyNames = ['abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'atan2', 'ceil', 'cbrt', 'expm1', 'clz32', 'cos', 'cosh', 'exp', 'floor', 'fround', 'hypot', 'imul', 'log', 'log1p', 'log2', 'log10', 'max', 'min', 'pow', 'random', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc', 'E', 'LN10', 'LN2', 'LOG10E', 'LOG2E', 'PI', 'SQRT1_2', 'SQRT2'];
    var i;
    var len = propertyNames.length;

    for (i = 0; i < len; i += 1) {
      BMMath[propertyNames[i]] = Math[propertyNames[i]];
    }
  })();

  function ProjectInterface$1() {
    return {};
  }

  BMMath.random = Math.random;

  BMMath.abs = function (val) {
    var tOfVal = _typeof$6(val);

    if (tOfVal === 'object' && val.length) {
      var absArr = createSizedArray(val.length);
      var i;
      var len = val.length;

      for (i = 0; i < len; i += 1) {
        absArr[i] = Math.abs(val[i]);
      }

      return absArr;
    }

    return Math.abs(val);
  };

  var defaultCurveSegments = 150;
  var degToRads = Math.PI / 180;
  var roundCorner = 0.5519;

  function roundValues(flag) {
    _shouldRoundValues = !!flag;
  }

  function bmRnd(value) {
    if (_shouldRoundValues) {
      return Math.round(value);
    }

    return value;
  }

  function styleDiv(element) {
    element.style.position = 'absolute';
    element.style.top = 0;
    element.style.left = 0;
    element.style.display = 'block';
    element.style.transformOrigin = '0 0';
    element.style.webkitTransformOrigin = '0 0';
    element.style.backfaceVisibility = 'visible';
    element.style.webkitBackfaceVisibility = 'visible';
    element.style.transformStyle = 'preserve-3d';
    element.style.webkitTransformStyle = 'preserve-3d';
    element.style.mozTransformStyle = 'preserve-3d';
  }

  function BMEnterFrameEvent(type, currentTime, totalTime, frameMultiplier) {
    this.type = type;
    this.currentTime = currentTime;
    this.totalTime = totalTime;
    this.direction = frameMultiplier < 0 ? -1 : 1;
  }

  function BMCompleteEvent(type, frameMultiplier) {
    this.type = type;
    this.direction = frameMultiplier < 0 ? -1 : 1;
  }

  function BMCompleteLoopEvent(type, totalLoops, currentLoop, frameMultiplier) {
    this.type = type;
    this.currentLoop = currentLoop;
    this.totalLoops = totalLoops;
    this.direction = frameMultiplier < 0 ? -1 : 1;
  }

  function BMSegmentStartEvent(type, firstFrame, totalFrames) {
    this.type = type;
    this.firstFrame = firstFrame;
    this.totalFrames = totalFrames;
  }

  function BMDestroyEvent(type, target) {
    this.type = type;
    this.target = target;
  }

  function BMRenderFrameErrorEvent(nativeError, currentTime) {
    this.type = 'renderFrameError';
    this.nativeError = nativeError;
    this.currentTime = currentTime;
  }

  function BMConfigErrorEvent(nativeError) {
    this.type = 'configError';
    this.nativeError = nativeError;
  }

  function BMAnimationConfigErrorEvent(type, nativeError) {
    this.type = type;
    this.nativeError = nativeError;
  }

  var createElementID = function () {
    var _count = 0;
    return function createID() {
      _count += 1;
      return idPrefix + '__lottie_element_' + _count;
    };
  }();

  function HSVtoRGB(h, s, v) {
    var r;
    var g;
    var b;
    var i;
    var f;
    var p;
    var q;
    var t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;

      case 1:
        r = q;
        g = v;
        b = p;
        break;

      case 2:
        r = p;
        g = v;
        b = t;
        break;

      case 3:
        r = p;
        g = q;
        b = v;
        break;

      case 4:
        r = t;
        g = p;
        b = v;
        break;

      case 5:
        r = v;
        g = p;
        b = q;
        break;

      default:
        break;
    }

    return [r, g, b];
  }

  function RGBtoHSV(r, g, b) {
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var d = max - min;
    var h;
    var s = max === 0 ? 0 : d / max;
    var v = max / 255;

    switch (max) {
      case min:
        h = 0;
        break;

      case r:
        h = g - b + d * (g < b ? 6 : 0);
        h /= 6 * d;
        break;

      case g:
        h = b - r + d * 2;
        h /= 6 * d;
        break;

      case b:
        h = r - g + d * 4;
        h /= 6 * d;
        break;

      default:
        break;
    }

    return [h, s, v];
  }

  function addSaturationToRGB(color, offset) {
    var hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255);
    hsv[1] += offset;

    if (hsv[1] > 1) {
      hsv[1] = 1;
    } else if (hsv[1] <= 0) {
      hsv[1] = 0;
    }

    return HSVtoRGB(hsv[0], hsv[1], hsv[2]);
  }

  function addBrightnessToRGB(color, offset) {
    var hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255);
    hsv[2] += offset;

    if (hsv[2] > 1) {
      hsv[2] = 1;
    } else if (hsv[2] < 0) {
      hsv[2] = 0;
    }

    return HSVtoRGB(hsv[0], hsv[1], hsv[2]);
  }

  function addHueToRGB(color, offset) {
    var hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255);
    hsv[0] += offset / 360;

    if (hsv[0] > 1) {
      hsv[0] -= 1;
    } else if (hsv[0] < 0) {
      hsv[0] += 1;
    }

    return HSVtoRGB(hsv[0], hsv[1], hsv[2]);
  }

  var rgbToHex = function () {
    var colorMap = [];
    var i;
    var hex;

    for (i = 0; i < 256; i += 1) {
      hex = i.toString(16);
      colorMap[i] = hex.length === 1 ? '0' + hex : hex;
    }

    return function (r, g, b) {
      if (r < 0) {
        r = 0;
      }

      if (g < 0) {
        g = 0;
      }

      if (b < 0) {
        b = 0;
      }

      return '#' + colorMap[r] + colorMap[g] + colorMap[b];
    };
  }();

  var setSubframeEnabled = function setSubframeEnabled(flag) {
    subframeEnabled = !!flag;
  };

  var getSubframeEnabled = function getSubframeEnabled() {
    return subframeEnabled;
  };

  var setExpressionsPlugin = function setExpressionsPlugin(value) {
    expressionsPlugin = value;
  };

  var getExpressionsPlugin = function getExpressionsPlugin() {
    return expressionsPlugin;
  };

  var setDefaultCurveSegments = function setDefaultCurveSegments(value) {
    defaultCurveSegments = value;
  };

  var getDefaultCurveSegments = function getDefaultCurveSegments() {
    return defaultCurveSegments;
  };

  var setIdPrefix = function setIdPrefix(value) {
    idPrefix = value;
  };

  var getIdPrefix = function getIdPrefix() {
    return idPrefix;
  };

  function createNS(type) {
    // return {appendChild:function(){},setAttribute:function(){},style:{}}
    return document.createElementNS(svgNS, type);
  }

  function _typeof$5(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$5 = function _typeof(obj) { return typeof obj; }; } else { _typeof$5 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$5(obj); }

  var dataManager = function () {
    var _counterId = 1;
    var processes = [];
    var workerFn;
    var workerInstance;
    var workerProxy = {
      onmessage: function onmessage() {},
      postMessage: function postMessage(path) {
        workerFn({
          data: path
        });
      }
    };
    var _workerSelf = {
      postMessage: function postMessage(data) {
        workerProxy.onmessage({
          data: data
        });
      }
    };

    function createWorker(fn) {
      if (window.Worker && window.Blob && getWebWorker()) {
        var blob = new Blob(['var _workerSelf = self; self.onmessage = ', fn.toString()], {
          type: 'text/javascript'
        }); // var blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });

        var url = URL.createObjectURL(blob);
        return new Worker(url);
      }

      workerFn = fn;
      return workerProxy;
    }

    function setupWorker() {
      if (!workerInstance) {
        workerInstance = createWorker(function workerStart(e) {
          function dataFunctionManager() {
            function completeLayers(layers, comps) {
              var layerData;
              var i;
              var len = layers.length;
              var j;
              var jLen;
              var k;
              var kLen;

              for (i = 0; i < len; i += 1) {
                layerData = layers[i];

                if ('ks' in layerData && !layerData.completed) {
                  layerData.completed = true;

                  if (layerData.tt) {
                    layers[i - 1].td = layerData.tt;
                  }

                  if (layerData.hasMask) {
                    var maskProps = layerData.masksProperties;
                    jLen = maskProps.length;

                    for (j = 0; j < jLen; j += 1) {
                      if (maskProps[j].pt.k.i) {
                        convertPathsToAbsoluteValues(maskProps[j].pt.k);
                      } else {
                        kLen = maskProps[j].pt.k.length;

                        for (k = 0; k < kLen; k += 1) {
                          if (maskProps[j].pt.k[k].s) {
                            convertPathsToAbsoluteValues(maskProps[j].pt.k[k].s[0]);
                          }

                          if (maskProps[j].pt.k[k].e) {
                            convertPathsToAbsoluteValues(maskProps[j].pt.k[k].e[0]);
                          }
                        }
                      }
                    }
                  }

                  if (layerData.ty === 0) {
                    layerData.layers = findCompLayers(layerData.refId, comps);
                    completeLayers(layerData.layers, comps);
                  } else if (layerData.ty === 4) {
                    completeShapes(layerData.shapes);
                  } else if (layerData.ty === 5) {
                    completeText(layerData);
                  }
                }
              }
            }

            function completeChars(chars, assets) {
              if (chars) {
                var i = 0;
                var len = chars.length;

                for (i = 0; i < len; i += 1) {
                  if (chars[i].t === 1) {
                    // var compData = findComp(chars[i].data.refId, assets);
                    chars[i].data.layers = findCompLayers(chars[i].data.refId, assets); // chars[i].data.ip = 0;
                    // chars[i].data.op = 99999;
                    // chars[i].data.st = 0;
                    // chars[i].data.sr = 1;
                    // chars[i].w = compData.w;
                    // chars[i].data.ks = {
                    //   a: { k: [0, 0, 0], a: 0 },
                    //   p: { k: [0, -compData.h, 0], a: 0 },
                    //   r: { k: 0, a: 0 },
                    //   s: { k: [100, 100], a: 0 },
                    //   o: { k: 100, a: 0 },
                    // };

                    completeLayers(chars[i].data.layers, assets);
                  }
                }
              }
            }

            function findComp(id, comps) {
              var i = 0;
              var len = comps.length;

              while (i < len) {
                if (comps[i].id === id) {
                  return comps[i];
                }

                i += 1;
              }

              return null;
            }

            function findCompLayers(id, comps) {
              var comp = findComp(id, comps);

              if (comp) {
                if (!comp.layers.__used) {
                  comp.layers.__used = true;
                  return comp.layers;
                }

                return JSON.parse(JSON.stringify(comp.layers));
              }

              return null;
            }

            function completeShapes(arr) {
              var i;
              var len = arr.length;
              var j;
              var jLen;

              for (i = len - 1; i >= 0; i -= 1) {
                if (arr[i].ty === 'sh') {
                  if (arr[i].ks.k.i) {
                    convertPathsToAbsoluteValues(arr[i].ks.k);
                  } else {
                    jLen = arr[i].ks.k.length;

                    for (j = 0; j < jLen; j += 1) {
                      if (arr[i].ks.k[j].s) {
                        convertPathsToAbsoluteValues(arr[i].ks.k[j].s[0]);
                      }

                      if (arr[i].ks.k[j].e) {
                        convertPathsToAbsoluteValues(arr[i].ks.k[j].e[0]);
                      }
                    }
                  }
                } else if (arr[i].ty === 'gr') {
                  completeShapes(arr[i].it);
                }
              }
            }

            function convertPathsToAbsoluteValues(path) {
              var i;
              var len = path.i.length;

              for (i = 0; i < len; i += 1) {
                path.i[i][0] += path.v[i][0];
                path.i[i][1] += path.v[i][1];
                path.o[i][0] += path.v[i][0];
                path.o[i][1] += path.v[i][1];
              }
            }

            function checkVersion(minimum, animVersionString) {
              var animVersion = animVersionString ? animVersionString.split('.') : [100, 100, 100];

              if (minimum[0] > animVersion[0]) {
                return true;
              }

              if (animVersion[0] > minimum[0]) {
                return false;
              }

              if (minimum[1] > animVersion[1]) {
                return true;
              }

              if (animVersion[1] > minimum[1]) {
                return false;
              }

              if (minimum[2] > animVersion[2]) {
                return true;
              }

              if (animVersion[2] > minimum[2]) {
                return false;
              }

              return null;
            }

            var checkText = function () {
              var minimumVersion = [4, 4, 14];

              function updateTextLayer(textLayer) {
                var documentData = textLayer.t.d;
                textLayer.t.d = {
                  k: [{
                    s: documentData,
                    t: 0
                  }]
                };
              }

              function iterateLayers(layers) {
                var i;
                var len = layers.length;

                for (i = 0; i < len; i += 1) {
                  if (layers[i].ty === 5) {
                    updateTextLayer(layers[i]);
                  }
                }
              }

              return function (animationData) {
                if (checkVersion(minimumVersion, animationData.v)) {
                  iterateLayers(animationData.layers);

                  if (animationData.assets) {
                    var i;
                    var len = animationData.assets.length;

                    for (i = 0; i < len; i += 1) {
                      if (animationData.assets[i].layers) {
                        iterateLayers(animationData.assets[i].layers);
                      }
                    }
                  }
                }
              };
            }();

            var checkChars = function () {
              var minimumVersion = [4, 7, 99];
              return function (animationData) {
                if (animationData.chars && !checkVersion(minimumVersion, animationData.v)) {
                  var i;
                  var len = animationData.chars.length;

                  for (i = 0; i < len; i += 1) {
                    var charData = animationData.chars[i];

                    if (charData.data && charData.data.shapes) {
                      completeShapes(charData.data.shapes);
                      charData.data.ip = 0;
                      charData.data.op = 99999;
                      charData.data.st = 0;
                      charData.data.sr = 1;
                      charData.data.ks = {
                        p: {
                          k: [0, 0],
                          a: 0
                        },
                        s: {
                          k: [100, 100],
                          a: 0
                        },
                        a: {
                          k: [0, 0],
                          a: 0
                        },
                        r: {
                          k: 0,
                          a: 0
                        },
                        o: {
                          k: 100,
                          a: 0
                        }
                      };

                      if (!animationData.chars[i].t) {
                        charData.data.shapes.push({
                          ty: 'no'
                        });
                        charData.data.shapes[0].it.push({
                          p: {
                            k: [0, 0],
                            a: 0
                          },
                          s: {
                            k: [100, 100],
                            a: 0
                          },
                          a: {
                            k: [0, 0],
                            a: 0
                          },
                          r: {
                            k: 0,
                            a: 0
                          },
                          o: {
                            k: 100,
                            a: 0
                          },
                          sk: {
                            k: 0,
                            a: 0
                          },
                          sa: {
                            k: 0,
                            a: 0
                          },
                          ty: 'tr'
                        });
                      }
                    }
                  }
                }
              };
            }();

            var checkPathProperties = function () {
              var minimumVersion = [5, 7, 15];

              function updateTextLayer(textLayer) {
                var pathData = textLayer.t.p;

                if (typeof pathData.a === 'number') {
                  pathData.a = {
                    a: 0,
                    k: pathData.a
                  };
                }

                if (typeof pathData.p === 'number') {
                  pathData.p = {
                    a: 0,
                    k: pathData.p
                  };
                }

                if (typeof pathData.r === 'number') {
                  pathData.r = {
                    a: 0,
                    k: pathData.r
                  };
                }
              }

              function iterateLayers(layers) {
                var i;
                var len = layers.length;

                for (i = 0; i < len; i += 1) {
                  if (layers[i].ty === 5) {
                    updateTextLayer(layers[i]);
                  }
                }
              }

              return function (animationData) {
                if (checkVersion(minimumVersion, animationData.v)) {
                  iterateLayers(animationData.layers);

                  if (animationData.assets) {
                    var i;
                    var len = animationData.assets.length;

                    for (i = 0; i < len; i += 1) {
                      if (animationData.assets[i].layers) {
                        iterateLayers(animationData.assets[i].layers);
                      }
                    }
                  }
                }
              };
            }();

            var checkColors = function () {
              var minimumVersion = [4, 1, 9];

              function iterateShapes(shapes) {
                var i;
                var len = shapes.length;
                var j;
                var jLen;

                for (i = 0; i < len; i += 1) {
                  if (shapes[i].ty === 'gr') {
                    iterateShapes(shapes[i].it);
                  } else if (shapes[i].ty === 'fl' || shapes[i].ty === 'st') {
                    if (shapes[i].c.k && shapes[i].c.k[0].i) {
                      jLen = shapes[i].c.k.length;

                      for (j = 0; j < jLen; j += 1) {
                        if (shapes[i].c.k[j].s) {
                          shapes[i].c.k[j].s[0] /= 255;
                          shapes[i].c.k[j].s[1] /= 255;
                          shapes[i].c.k[j].s[2] /= 255;
                          shapes[i].c.k[j].s[3] /= 255;
                        }

                        if (shapes[i].c.k[j].e) {
                          shapes[i].c.k[j].e[0] /= 255;
                          shapes[i].c.k[j].e[1] /= 255;
                          shapes[i].c.k[j].e[2] /= 255;
                          shapes[i].c.k[j].e[3] /= 255;
                        }
                      }
                    } else {
                      shapes[i].c.k[0] /= 255;
                      shapes[i].c.k[1] /= 255;
                      shapes[i].c.k[2] /= 255;
                      shapes[i].c.k[3] /= 255;
                    }
                  }
                }
              }

              function iterateLayers(layers) {
                var i;
                var len = layers.length;

                for (i = 0; i < len; i += 1) {
                  if (layers[i].ty === 4) {
                    iterateShapes(layers[i].shapes);
                  }
                }
              }

              return function (animationData) {
                if (checkVersion(minimumVersion, animationData.v)) {
                  iterateLayers(animationData.layers);

                  if (animationData.assets) {
                    var i;
                    var len = animationData.assets.length;

                    for (i = 0; i < len; i += 1) {
                      if (animationData.assets[i].layers) {
                        iterateLayers(animationData.assets[i].layers);
                      }
                    }
                  }
                }
              };
            }();

            var checkShapes = function () {
              var minimumVersion = [4, 4, 18];

              function completeClosingShapes(arr) {
                var i;
                var len = arr.length;
                var j;
                var jLen;

                for (i = len - 1; i >= 0; i -= 1) {
                  if (arr[i].ty === 'sh') {
                    if (arr[i].ks.k.i) {
                      arr[i].ks.k.c = arr[i].closed;
                    } else {
                      jLen = arr[i].ks.k.length;

                      for (j = 0; j < jLen; j += 1) {
                        if (arr[i].ks.k[j].s) {
                          arr[i].ks.k[j].s[0].c = arr[i].closed;
                        }

                        if (arr[i].ks.k[j].e) {
                          arr[i].ks.k[j].e[0].c = arr[i].closed;
                        }
                      }
                    }
                  } else if (arr[i].ty === 'gr') {
                    completeClosingShapes(arr[i].it);
                  }
                }
              }

              function iterateLayers(layers) {
                var layerData;
                var i;
                var len = layers.length;
                var j;
                var jLen;
                var k;
                var kLen;

                for (i = 0; i < len; i += 1) {
                  layerData = layers[i];

                  if (layerData.hasMask) {
                    var maskProps = layerData.masksProperties;
                    jLen = maskProps.length;

                    for (j = 0; j < jLen; j += 1) {
                      if (maskProps[j].pt.k.i) {
                        maskProps[j].pt.k.c = maskProps[j].cl;
                      } else {
                        kLen = maskProps[j].pt.k.length;

                        for (k = 0; k < kLen; k += 1) {
                          if (maskProps[j].pt.k[k].s) {
                            maskProps[j].pt.k[k].s[0].c = maskProps[j].cl;
                          }

                          if (maskProps[j].pt.k[k].e) {
                            maskProps[j].pt.k[k].e[0].c = maskProps[j].cl;
                          }
                        }
                      }
                    }
                  }

                  if (layerData.ty === 4) {
                    completeClosingShapes(layerData.shapes);
                  }
                }
              }

              return function (animationData) {
                if (checkVersion(minimumVersion, animationData.v)) {
                  iterateLayers(animationData.layers);

                  if (animationData.assets) {
                    var i;
                    var len = animationData.assets.length;

                    for (i = 0; i < len; i += 1) {
                      if (animationData.assets[i].layers) {
                        iterateLayers(animationData.assets[i].layers);
                      }
                    }
                  }
                }
              };
            }();

            function completeData(animationData) {
              if (animationData.__complete) {
                return;
              }

              checkColors(animationData);
              checkText(animationData);
              checkChars(animationData);
              checkPathProperties(animationData);
              checkShapes(animationData);
              completeLayers(animationData.layers, animationData.assets);
              completeChars(animationData.chars, animationData.assets);
              animationData.__complete = true;
            }

            function completeText(data) {
              if (data.t.a.length === 0 && !('m' in data.t.p)) {// data.singleShape = true;
              }
            }

            var moduleOb = {};
            moduleOb.completeData = completeData;
            moduleOb.checkColors = checkColors;
            moduleOb.checkChars = checkChars;
            moduleOb.checkPathProperties = checkPathProperties;
            moduleOb.checkShapes = checkShapes;
            moduleOb.completeLayers = completeLayers;
            return moduleOb;
          }

          if (!_workerSelf.dataManager) {
            _workerSelf.dataManager = dataFunctionManager();
          }

          if (!_workerSelf.assetLoader) {
            _workerSelf.assetLoader = function () {
              function formatResponse(xhr) {
                // using typeof doubles the time of execution of this method,
                // so if available, it's better to use the header to validate the type
                var contentTypeHeader = xhr.getResponseHeader('content-type');

                if (contentTypeHeader && xhr.responseType === 'json' && contentTypeHeader.indexOf('json') !== -1) {
                  return xhr.response;
                }

                if (xhr.response && _typeof$5(xhr.response) === 'object') {
                  return xhr.response;
                }

                if (xhr.response && typeof xhr.response === 'string') {
                  return JSON.parse(xhr.response);
                }

                if (xhr.responseText) {
                  return JSON.parse(xhr.responseText);
                }

                return null;
              }

              function loadAsset(path, fullPath, callback, errorCallback) {
                var response;
                var xhr = new XMLHttpRequest(); // set responseType after calling open or IE will break.

                try {
                  // This crashes on Android WebView prior to KitKat
                  xhr.responseType = 'json';
                } catch (err) {} // eslint-disable-line no-empty


                xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                      response = formatResponse(xhr);
                      callback(response);
                    } else {
                      try {
                        response = formatResponse(xhr);
                        callback(response);
                      } catch (err) {
                        if (errorCallback) {
                          errorCallback(err);
                        }
                      }
                    }
                  }
                };

                try {
                  xhr.open('GET', path, true);
                } catch (error) {
                  xhr.open('GET', fullPath + '/' + path, true);
                }

                xhr.send();
              }

              return {
                load: loadAsset
              };
            }();
          }

          if (e.data.type === 'loadAnimation') {
            _workerSelf.assetLoader.load(e.data.path, e.data.fullPath, function (data) {
              _workerSelf.dataManager.completeData(data);

              _workerSelf.postMessage({
                id: e.data.id,
                payload: data,
                status: 'success'
              });
            }, function () {
              _workerSelf.postMessage({
                id: e.data.id,
                status: 'error'
              });
            });
          } else if (e.data.type === 'complete') {
            var animation = e.data.animation;

            _workerSelf.dataManager.completeData(animation);

            _workerSelf.postMessage({
              id: e.data.id,
              payload: animation,
              status: 'success'
            });
          } else if (e.data.type === 'loadData') {
            _workerSelf.assetLoader.load(e.data.path, e.data.fullPath, function (data) {
              _workerSelf.postMessage({
                id: e.data.id,
                payload: data,
                status: 'success'
              });
            }, function () {
              _workerSelf.postMessage({
                id: e.data.id,
                status: 'error'
              });
            });
          }
        });

        workerInstance.onmessage = function (event) {
          var data = event.data;
          var id = data.id;
          var process = processes[id];
          processes[id] = null;

          if (data.status === 'success') {
            process.onComplete(data.payload);
          } else if (process.onError) {
            process.onError();
          }
        };
      }
    }

    function createProcess(onComplete, onError) {
      _counterId += 1;
      var id = 'processId_' + _counterId;
      processes[id] = {
        onComplete: onComplete,
        onError: onError
      };
      return id;
    }

    function loadAnimation(path, onComplete, onError) {
      setupWorker();
      var processId = createProcess(onComplete, onError);
      workerInstance.postMessage({
        type: 'loadAnimation',
        path: path,
        fullPath: window.location.origin + window.location.pathname,
        id: processId
      });
    }

    function loadData(path, onComplete, onError) {
      setupWorker();
      var processId = createProcess(onComplete, onError);
      workerInstance.postMessage({
        type: 'loadData',
        path: path,
        fullPath: window.location.origin + window.location.pathname,
        id: processId
      });
    }

    function completeAnimation(anim, onComplete, onError) {
      setupWorker();
      var processId = createProcess(onComplete, onError);
      workerInstance.postMessage({
        type: 'complete',
        animation: anim,
        id: processId
      });
    }

    return {
      loadAnimation: loadAnimation,
      loadData: loadData,
      completeAnimation: completeAnimation
    };
  }();

  var ImagePreloader = function () {
    var proxyImage = function () {
      var canvas = createTag('canvas');
      canvas.width = 1;
      canvas.height = 1;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, 1, 1);
      return canvas;
    }();

    function imageLoaded() {
      this.loadedAssets += 1;

      if (this.loadedAssets === this.totalImages && this.loadedFootagesCount === this.totalFootages) {
        if (this.imagesLoadedCb) {
          this.imagesLoadedCb(null);
        }
      }
    }

    function footageLoaded() {
      this.loadedFootagesCount += 1;

      if (this.loadedAssets === this.totalImages && this.loadedFootagesCount === this.totalFootages) {
        if (this.imagesLoadedCb) {
          this.imagesLoadedCb(null);
        }
      }
    }

    function getAssetsPath(assetData, assetsPath, originalPath) {
      var path = '';

      if (assetData.e) {
        path = assetData.p;
      } else if (assetsPath) {
        var imagePath = assetData.p;

        if (imagePath.indexOf('images/') !== -1) {
          imagePath = imagePath.split('/')[1];
        }

        path = assetsPath + imagePath;
      } else {
        path = originalPath;
        path += assetData.u ? assetData.u : '';
        path += assetData.p;
      }

      return path;
    }

    function testImageLoaded(img) {
      var _count = 0;
      var intervalId = setInterval(function () {
        var box = img.getBBox();

        if (box.width || _count > 500) {
          this._imageLoaded();

          clearInterval(intervalId);
        }

        _count += 1;
      }.bind(this), 50);
    }

    function createImageData(assetData) {
      var path = getAssetsPath(assetData, this.assetsPath, this.path);
      var img = createNS('image');

      if (isSafari) {
        this.testImageLoaded(img);
      } else {
        img.addEventListener('load', this._imageLoaded, false);
      }

      img.addEventListener('error', function () {
        ob.img = proxyImage;

        this._imageLoaded();
      }.bind(this), false);
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', path);

      if (this._elementHelper.append) {
        this._elementHelper.append(img);
      } else {
        this._elementHelper.appendChild(img);
      }

      var ob = {
        img: img,
        assetData: assetData
      };
      return ob;
    }

    function createImgData(assetData) {
      var path = getAssetsPath(assetData, this.assetsPath, this.path);
      var img = createTag('img');
      img.crossOrigin = 'anonymous';
      img.addEventListener('load', this._imageLoaded, false);
      img.addEventListener('error', function () {
        ob.img = proxyImage;

        this._imageLoaded();
      }.bind(this), false);
      img.src = path;
      var ob = {
        img: img,
        assetData: assetData
      };
      return ob;
    }

    function createFootageData(data) {
      var ob = {
        assetData: data
      };
      var path = getAssetsPath(data, this.assetsPath, this.path);
      dataManager.loadData(path, function (footageData) {
        ob.img = footageData;

        this._footageLoaded();
      }.bind(this), function () {
        ob.img = {};

        this._footageLoaded();
      }.bind(this));
      return ob;
    }

    function loadAssets(assets, cb) {
      this.imagesLoadedCb = cb;
      var i;
      var len = assets.length;

      for (i = 0; i < len; i += 1) {
        if (!assets[i].layers) {
          if (!assets[i].t || assets[i].t === 'seq') {
            this.totalImages += 1;
            this.images.push(this._createImageData(assets[i]));
          } else if (assets[i].t === 3) {
            this.totalFootages += 1;
            this.images.push(this.createFootageData(assets[i]));
          }
        }
      }
    }

    function setPath(path) {
      this.path = path || '';
    }

    function setAssetsPath(path) {
      this.assetsPath = path || '';
    }

    function getAsset(assetData) {
      var i = 0;
      var len = this.images.length;

      while (i < len) {
        if (this.images[i].assetData === assetData) {
          return this.images[i].img;
        }

        i += 1;
      }

      return null;
    }

    function destroy() {
      this.imagesLoadedCb = null;
      this.images.length = 0;
    }

    function loadedImages() {
      return this.totalImages === this.loadedAssets;
    }

    function loadedFootages() {
      return this.totalFootages === this.loadedFootagesCount;
    }

    function setCacheType(type, elementHelper) {
      if (type === 'svg') {
        this._elementHelper = elementHelper;
        this._createImageData = this.createImageData.bind(this);
      } else {
        this._createImageData = this.createImgData.bind(this);
      }
    }

    function ImagePreloaderFactory() {
      this._imageLoaded = imageLoaded.bind(this);
      this._footageLoaded = footageLoaded.bind(this);
      this.testImageLoaded = testImageLoaded.bind(this);
      this.createFootageData = createFootageData.bind(this);
      this.assetsPath = '';
      this.path = '';
      this.totalImages = 0;
      this.totalFootages = 0;
      this.loadedAssets = 0;
      this.loadedFootagesCount = 0;
      this.imagesLoadedCb = null;
      this.images = [];
    }

    ImagePreloaderFactory.prototype = {
      loadAssets: loadAssets,
      setAssetsPath: setAssetsPath,
      setPath: setPath,
      loadedImages: loadedImages,
      loadedFootages: loadedFootages,
      destroy: destroy,
      getAsset: getAsset,
      createImgData: createImgData,
      createImageData: createImageData,
      imageLoaded: imageLoaded,
      footageLoaded: footageLoaded,
      setCacheType: setCacheType
    };
    return ImagePreloaderFactory;
  }();

  function BaseEvent() {}

  BaseEvent.prototype = {
    triggerEvent: function triggerEvent(eventName, args) {
      if (this._cbs[eventName]) {
        var callbacks = this._cbs[eventName];

        for (var i = 0; i < callbacks.length; i += 1) {
          callbacks[i](args);
        }
      }
    },
    addEventListener: function addEventListener(eventName, callback) {
      if (!this._cbs[eventName]) {
        this._cbs[eventName] = [];
      }

      this._cbs[eventName].push(callback);

      return function () {
        this.removeEventListener(eventName, callback);
      }.bind(this);
    },
    removeEventListener: function removeEventListener(eventName, callback) {
      if (!callback) {
        this._cbs[eventName] = null;
      } else if (this._cbs[eventName]) {
        var i = 0;
        var len = this._cbs[eventName].length;

        while (i < len) {
          if (this._cbs[eventName][i] === callback) {
            this._cbs[eventName].splice(i, 1);

            i -= 1;
            len -= 1;
          }

          i += 1;
        }

        if (!this._cbs[eventName].length) {
          this._cbs[eventName] = null;
        }
      }
    }
  };

  var markerParser = function () {
    function parsePayloadLines(payload) {
      var lines = payload.split('\r\n');
      var keys = {};
      var line;
      var keysCount = 0;

      for (var i = 0; i < lines.length; i += 1) {
        line = lines[i].split(':');

        if (line.length === 2) {
          keys[line[0]] = line[1].trim();
          keysCount += 1;
        }
      }

      if (keysCount === 0) {
        throw new Error();
      }

      return keys;
    }

    return function (_markers) {
      var markers = [];

      for (var i = 0; i < _markers.length; i += 1) {
        var _marker = _markers[i];
        var markerData = {
          time: _marker.tm,
          duration: _marker.dr
        };

        try {
          markerData.payload = JSON.parse(_markers[i].cm);
        } catch (_) {
          try {
            markerData.payload = parsePayloadLines(_markers[i].cm);
          } catch (__) {
            markerData.payload = {
              name: _markers[i]
            };
          }
        }

        markers.push(markerData);
      }

      return markers;
    };
  }();

  var ProjectInterface = function () {
    function registerComposition(comp) {
      this.compositions.push(comp);
    }

    return function () {
      function _thisProjectFunction(name) {
        var i = 0;
        var len = this.compositions.length;

        while (i < len) {
          if (this.compositions[i].data && this.compositions[i].data.nm === name) {
            if (this.compositions[i].prepareFrame && this.compositions[i].data.xt) {
              this.compositions[i].prepareFrame(this.currentFrame);
            }

            return this.compositions[i].compInterface;
          }

          i += 1;
        }

        return null;
      }

      _thisProjectFunction.compositions = [];
      _thisProjectFunction.currentFrame = 0;
      _thisProjectFunction.registerComposition = registerComposition;
      return _thisProjectFunction;
    };
  }();

  var renderers = {};

  var registerRenderer = function registerRenderer(key, value) {
    renderers[key] = value;
  };

  function getRenderer(key) {
    return renderers[key];
  }

  function _typeof$4(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }

  var AnimationItem = function AnimationItem() {
    this._cbs = [];
    this.name = '';
    this.path = '';
    this.isLoaded = false;
    this.currentFrame = 0;
    this.currentRawFrame = 0;
    this.firstFrame = 0;
    this.totalFrames = 0;
    this.frameRate = 0;
    this.frameMult = 0;
    this.playSpeed = 1;
    this.playDirection = 1;
    this.playCount = 0;
    this.animationData = {};
    this.assets = [];
    this.isPaused = true;
    this.autoplay = false;
    this.loop = true;
    this.renderer = null;
    this.animationID = createElementID();
    this.assetsPath = '';
    this.timeCompleted = 0;
    this.segmentPos = 0;
    this.isSubframeEnabled = getSubframeEnabled();
    this.segments = [];
    this._idle = true;
    this._completedLoop = false;
    this.projectInterface = ProjectInterface();
    this.imagePreloader = new ImagePreloader();
    this.audioController = audioControllerFactory();
    this.markers = [];
    this.configAnimation = this.configAnimation.bind(this);
    this.onSetupError = this.onSetupError.bind(this);
    this.onSegmentComplete = this.onSegmentComplete.bind(this);
  };

  extendPrototype([BaseEvent], AnimationItem);

  AnimationItem.prototype.setParams = function (params) {
    if (params.wrapper || params.container) {
      this.wrapper = params.wrapper || params.container;
    }

    var animType = 'svg';

    if (params.animType) {
      animType = params.animType;
    } else if (params.renderer) {
      animType = params.renderer;
    }

    var RendererClass = getRenderer(animType);
    this.renderer = new RendererClass(this, params.rendererSettings);
    this.imagePreloader.setCacheType(animType, this.renderer.globalData.defs);
    this.renderer.setProjectInterface(this.projectInterface);
    this.animType = animType;

    if (params.loop === '' || params.loop === null || params.loop === undefined || params.loop === true) {
      this.loop = true;
    } else if (params.loop === false) {
      this.loop = false;
    } else {
      this.loop = parseInt(params.loop, 10);
    }

    this.autoplay = 'autoplay' in params ? params.autoplay : true;
    this.name = params.name ? params.name : '';
    this.autoloadSegments = Object.prototype.hasOwnProperty.call(params, 'autoloadSegments') ? params.autoloadSegments : true;
    this.assetsPath = params.assetsPath;
    this.initialSegment = params.initialSegment;

    if (params.audioFactory) {
      this.audioController.setAudioFactory(params.audioFactory);
    }

    if (params.animationData) {
      this.setupAnimation(params.animationData);
    } else if (params.path) {
      if (params.path.lastIndexOf('\\') !== -1) {
        this.path = params.path.substr(0, params.path.lastIndexOf('\\') + 1);
      } else {
        this.path = params.path.substr(0, params.path.lastIndexOf('/') + 1);
      }

      this.fileName = params.path.substr(params.path.lastIndexOf('/') + 1);
      this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf('.json'));
      dataManager.loadAnimation(params.path, this.configAnimation, this.onSetupError);
    }
  };

  AnimationItem.prototype.onSetupError = function () {
    this.trigger('data_failed');
  };

  AnimationItem.prototype.setupAnimation = function (data) {
    dataManager.completeAnimation(data, this.configAnimation);
  };

  AnimationItem.prototype.setData = function (wrapper, animationData) {
    if (animationData) {
      if (_typeof$4(animationData) !== 'object') {
        animationData = JSON.parse(animationData);
      }
    }

    var params = {
      wrapper: wrapper,
      animationData: animationData
    };
    var wrapperAttributes = wrapper.attributes;
    params.path = wrapperAttributes.getNamedItem('data-animation-path') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-animation-path').value : wrapperAttributes.getNamedItem('data-bm-path') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-bm-path').value : wrapperAttributes.getNamedItem('bm-path') ? wrapperAttributes.getNamedItem('bm-path').value : '';
    params.animType = wrapperAttributes.getNamedItem('data-anim-type') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-anim-type').value : wrapperAttributes.getNamedItem('data-bm-type') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-bm-type').value : wrapperAttributes.getNamedItem('bm-type') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('bm-type').value : wrapperAttributes.getNamedItem('data-bm-renderer') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-bm-renderer').value : wrapperAttributes.getNamedItem('bm-renderer') ? wrapperAttributes.getNamedItem('bm-renderer').value : 'canvas';
    var loop = wrapperAttributes.getNamedItem('data-anim-loop') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-anim-loop').value : wrapperAttributes.getNamedItem('data-bm-loop') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-bm-loop').value : wrapperAttributes.getNamedItem('bm-loop') ? wrapperAttributes.getNamedItem('bm-loop').value : '';

    if (loop === 'false') {
      params.loop = false;
    } else if (loop === 'true') {
      params.loop = true;
    } else if (loop !== '') {
      params.loop = parseInt(loop, 10);
    }

    var autoplay = wrapperAttributes.getNamedItem('data-anim-autoplay') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-anim-autoplay').value : wrapperAttributes.getNamedItem('data-bm-autoplay') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-bm-autoplay').value : wrapperAttributes.getNamedItem('bm-autoplay') ? wrapperAttributes.getNamedItem('bm-autoplay').value : true;
    params.autoplay = autoplay !== 'false';
    params.name = wrapperAttributes.getNamedItem('data-name') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-name').value : wrapperAttributes.getNamedItem('data-bm-name') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-bm-name').value : wrapperAttributes.getNamedItem('bm-name') ? wrapperAttributes.getNamedItem('bm-name').value : '';
    var prerender = wrapperAttributes.getNamedItem('data-anim-prerender') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-anim-prerender').value : wrapperAttributes.getNamedItem('data-bm-prerender') // eslint-disable-line no-nested-ternary
    ? wrapperAttributes.getNamedItem('data-bm-prerender').value : wrapperAttributes.getNamedItem('bm-prerender') ? wrapperAttributes.getNamedItem('bm-prerender').value : '';

    if (prerender === 'false') {
      params.prerender = false;
    }

    this.setParams(params);
  };

  AnimationItem.prototype.includeLayers = function (data) {
    if (data.op > this.animationData.op) {
      this.animationData.op = data.op;
      this.totalFrames = Math.floor(data.op - this.animationData.ip);
    }

    var layers = this.animationData.layers;
    var i;
    var len = layers.length;
    var newLayers = data.layers;
    var j;
    var jLen = newLayers.length;

    for (j = 0; j < jLen; j += 1) {
      i = 0;

      while (i < len) {
        if (layers[i].id === newLayers[j].id) {
          layers[i] = newLayers[j];
          break;
        }

        i += 1;
      }
    }

    if (data.chars || data.fonts) {
      this.renderer.globalData.fontManager.addChars(data.chars);
      this.renderer.globalData.fontManager.addFonts(data.fonts, this.renderer.globalData.defs);
    }

    if (data.assets) {
      len = data.assets.length;

      for (i = 0; i < len; i += 1) {
        this.animationData.assets.push(data.assets[i]);
      }
    }

    this.animationData.__complete = false;
    dataManager.completeAnimation(this.animationData, this.onSegmentComplete);
  };

  AnimationItem.prototype.onSegmentComplete = function (data) {
    this.animationData = data;
    var expressionsPlugin = getExpressionsPlugin();

    if (expressionsPlugin) {
      expressionsPlugin.initExpressions(this);
    }

    this.loadNextSegment();
  };

  AnimationItem.prototype.loadNextSegment = function () {
    var segments = this.animationData.segments;

    if (!segments || segments.length === 0 || !this.autoloadSegments) {
      this.trigger('data_ready');
      this.timeCompleted = this.totalFrames;
      return;
    }

    var segment = segments.shift();
    this.timeCompleted = segment.time * this.frameRate;
    var segmentPath = this.path + this.fileName + '_' + this.segmentPos + '.json';
    this.segmentPos += 1;
    dataManager.loadData(segmentPath, this.includeLayers.bind(this), function () {
      this.trigger('data_failed');
    }.bind(this));
  };

  AnimationItem.prototype.loadSegments = function () {
    var segments = this.animationData.segments;

    if (!segments) {
      this.timeCompleted = this.totalFrames;
    }

    this.loadNextSegment();
  };

  AnimationItem.prototype.imagesLoaded = function () {
    this.trigger('loaded_images');
    this.checkLoaded();
  };

  AnimationItem.prototype.preloadImages = function () {
    this.imagePreloader.setAssetsPath(this.assetsPath);
    this.imagePreloader.setPath(this.path);
    this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this));
  };

  AnimationItem.prototype.configAnimation = function (animData) {
    if (!this.renderer) {
      return;
    }

    try {
      this.animationData = animData;

      if (this.initialSegment) {
        this.totalFrames = Math.floor(this.initialSegment[1] - this.initialSegment[0]);
        this.firstFrame = Math.round(this.initialSegment[0]);
      } else {
        this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip);
        this.firstFrame = Math.round(this.animationData.ip);
      }

      this.renderer.configAnimation(animData);

      if (!animData.assets) {
        animData.assets = [];
      }

      this.assets = this.animationData.assets;
      this.frameRate = this.animationData.fr;
      this.frameMult = this.animationData.fr / 1000;
      this.renderer.searchExtraCompositions(animData.assets);
      this.markers = markerParser(animData.markers || []);
      this.trigger('config_ready');
      this.preloadImages();
      this.loadSegments();
      this.updaFrameModifier();
      this.waitForFontsLoaded();

      if (this.isPaused) {
        this.audioController.pause();
      }
    } catch (error) {
      this.triggerConfigError(error);
    }
  };

  AnimationItem.prototype.waitForFontsLoaded = function () {
    if (!this.renderer) {
      return;
    }

    if (this.renderer.globalData.fontManager.isLoaded) {
      this.checkLoaded();
    } else {
      setTimeout(this.waitForFontsLoaded.bind(this), 20);
    }
  };

  AnimationItem.prototype.checkLoaded = function () {
    if (!this.isLoaded && this.renderer.globalData.fontManager.isLoaded && (this.imagePreloader.loadedImages() || this.renderer.rendererType !== 'canvas') && this.imagePreloader.loadedFootages()) {
      this.isLoaded = true;
      var expressionsPlugin = getExpressionsPlugin();

      if (expressionsPlugin) {
        expressionsPlugin.initExpressions(this);
      }

      this.renderer.initItems();
      setTimeout(function () {
        this.trigger('DOMLoaded');
      }.bind(this), 0);
      this.gotoFrame();

      if (this.autoplay) {
        this.play();
      }
    }
  };

  AnimationItem.prototype.resize = function () {
    this.renderer.updateContainerSize();
  };

  AnimationItem.prototype.setSubframe = function (flag) {
    this.isSubframeEnabled = !!flag;
  };

  AnimationItem.prototype.gotoFrame = function () {
    this.currentFrame = this.isSubframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame; // eslint-disable-line no-bitwise

    if (this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted) {
      this.currentFrame = this.timeCompleted;
    }

    this.trigger('enterFrame');
    this.renderFrame();
    this.trigger('drawnFrame');
  };

  AnimationItem.prototype.renderFrame = function () {
    if (this.isLoaded === false || !this.renderer) {
      return;
    }

    try {
      this.renderer.renderFrame(this.currentFrame + this.firstFrame);
    } catch (error) {
      this.triggerRenderFrameError(error);
    }
  };

  AnimationItem.prototype.play = function (name) {
    if (name && this.name !== name) {
      return;
    }

    if (this.isPaused === true) {
      this.isPaused = false;
      this.audioController.resume();

      if (this._idle) {
        this._idle = false;
        this.trigger('_active');
      }
    }
  };

  AnimationItem.prototype.pause = function (name) {
    if (name && this.name !== name) {
      return;
    }

    if (this.isPaused === false) {
      this.isPaused = true;
      this._idle = true;
      this.trigger('_idle');
      this.audioController.pause();
    }
  };

  AnimationItem.prototype.togglePause = function (name) {
    if (name && this.name !== name) {
      return;
    }

    if (this.isPaused === true) {
      this.play();
    } else {
      this.pause();
    }
  };

  AnimationItem.prototype.stop = function (name) {
    if (name && this.name !== name) {
      return;
    }

    this.pause();
    this.playCount = 0;
    this._completedLoop = false;
    this.setCurrentRawFrameValue(0);
  };

  AnimationItem.prototype.getMarkerData = function (markerName) {
    var marker;

    for (var i = 0; i < this.markers.length; i += 1) {
      marker = this.markers[i];

      if (marker.payload && marker.payload.name === markerName) {
        return marker;
      }
    }

    return null;
  };

  AnimationItem.prototype.goToAndStop = function (value, isFrame, name) {
    if (name && this.name !== name) {
      return;
    }

    var numValue = Number(value);

    if (isNaN(numValue)) {
      var marker = this.getMarkerData(value);

      if (marker) {
        this.goToAndStop(marker.time, true);
      }
    } else if (isFrame) {
      this.setCurrentRawFrameValue(value);
    } else {
      this.setCurrentRawFrameValue(value * this.frameModifier);
    }

    this.pause();
  };

  AnimationItem.prototype.goToAndPlay = function (value, isFrame, name) {
    if (name && this.name !== name) {
      return;
    }

    var numValue = Number(value);

    if (isNaN(numValue)) {
      var marker = this.getMarkerData(value);

      if (marker) {
        if (!marker.duration) {
          this.goToAndStop(marker.time, true);
        } else {
          this.playSegments([marker.time, marker.time + marker.duration], true);
        }
      }
    } else {
      this.goToAndStop(numValue, isFrame, name);
    }

    this.play();
  };

  AnimationItem.prototype.advanceTime = function (value) {
    if (this.isPaused === true || this.isLoaded === false) {
      return;
    }

    var nextValue = this.currentRawFrame + value * this.frameModifier;
    var _isComplete = false; // Checking if nextValue > totalFrames - 1 for addressing non looping and looping animations.
    // If animation won't loop, it should stop at totalFrames - 1. If it will loop it should complete the last frame and then loop.

    if (nextValue >= this.totalFrames - 1 && this.frameModifier > 0) {
      if (!this.loop || this.playCount === this.loop) {
        if (!this.checkSegments(nextValue > this.totalFrames ? nextValue % this.totalFrames : 0)) {
          _isComplete = true;
          nextValue = this.totalFrames - 1;
        }
      } else if (nextValue >= this.totalFrames) {
        this.playCount += 1;

        if (!this.checkSegments(nextValue % this.totalFrames)) {
          this.setCurrentRawFrameValue(nextValue % this.totalFrames);
          this._completedLoop = true;
          this.trigger('loopComplete');
        }
      } else {
        this.setCurrentRawFrameValue(nextValue);
      }
    } else if (nextValue < 0) {
      if (!this.checkSegments(nextValue % this.totalFrames)) {
        if (this.loop && !(this.playCount-- <= 0 && this.loop !== true)) {
          // eslint-disable-line no-plusplus
          this.setCurrentRawFrameValue(this.totalFrames + nextValue % this.totalFrames);

          if (!this._completedLoop) {
            this._completedLoop = true;
          } else {
            this.trigger('loopComplete');
          }
        } else {
          _isComplete = true;
          nextValue = 0;
        }
      }
    } else {
      this.setCurrentRawFrameValue(nextValue);
    }

    if (_isComplete) {
      this.setCurrentRawFrameValue(nextValue);
      this.pause();
      this.trigger('complete');
    }
  };

  AnimationItem.prototype.adjustSegment = function (arr, offset) {
    this.playCount = 0;

    if (arr[1] < arr[0]) {
      if (this.frameModifier > 0) {
        if (this.playSpeed < 0) {
          this.setSpeed(-this.playSpeed);
        } else {
          this.setDirection(-1);
        }
      }

      this.totalFrames = arr[0] - arr[1];
      this.timeCompleted = this.totalFrames;
      this.firstFrame = arr[1];
      this.setCurrentRawFrameValue(this.totalFrames - 0.001 - offset);
    } else if (arr[1] > arr[0]) {
      if (this.frameModifier < 0) {
        if (this.playSpeed < 0) {
          this.setSpeed(-this.playSpeed);
        } else {
          this.setDirection(1);
        }
      }

      this.totalFrames = arr[1] - arr[0];
      this.timeCompleted = this.totalFrames;
      this.firstFrame = arr[0];
      this.setCurrentRawFrameValue(0.001 + offset);
    }

    this.trigger('segmentStart');
  };

  AnimationItem.prototype.setSegment = function (init, end) {
    var pendingFrame = -1;

    if (this.isPaused) {
      if (this.currentRawFrame + this.firstFrame < init) {
        pendingFrame = init;
      } else if (this.currentRawFrame + this.firstFrame > end) {
        pendingFrame = end - init;
      }
    }

    this.firstFrame = init;
    this.totalFrames = end - init;
    this.timeCompleted = this.totalFrames;

    if (pendingFrame !== -1) {
      this.goToAndStop(pendingFrame, true);
    }
  };

  AnimationItem.prototype.playSegments = function (arr, forceFlag) {
    if (forceFlag) {
      this.segments.length = 0;
    }

    if (_typeof$4(arr[0]) === 'object') {
      var i;
      var len = arr.length;

      for (i = 0; i < len; i += 1) {
        this.segments.push(arr[i]);
      }
    } else {
      this.segments.push(arr);
    }

    if (this.segments.length && forceFlag) {
      this.adjustSegment(this.segments.shift(), 0);
    }

    if (this.isPaused) {
      this.play();
    }
  };

  AnimationItem.prototype.resetSegments = function (forceFlag) {
    this.segments.length = 0;
    this.segments.push([this.animationData.ip, this.animationData.op]);

    if (forceFlag) {
      this.checkSegments(0);
    }
  };

  AnimationItem.prototype.checkSegments = function (offset) {
    if (this.segments.length) {
      this.adjustSegment(this.segments.shift(), offset);
      return true;
    }

    return false;
  };

  AnimationItem.prototype.destroy = function (name) {
    if (name && this.name !== name || !this.renderer) {
      return;
    }

    this.renderer.destroy();
    this.imagePreloader.destroy();
    this.trigger('destroy');
    this._cbs = null;
    this.onEnterFrame = null;
    this.onLoopComplete = null;
    this.onComplete = null;
    this.onSegmentStart = null;
    this.onDestroy = null;
    this.renderer = null;
    this.renderer = null;
    this.imagePreloader = null;
    this.projectInterface = null;
  };

  AnimationItem.prototype.setCurrentRawFrameValue = function (value) {
    this.currentRawFrame = value;
    this.gotoFrame();
  };

  AnimationItem.prototype.setSpeed = function (val) {
    this.playSpeed = val;
    this.updaFrameModifier();
  };

  AnimationItem.prototype.setDirection = function (val) {
    this.playDirection = val < 0 ? -1 : 1;
    this.updaFrameModifier();
  };

  AnimationItem.prototype.setVolume = function (val, name) {
    if (name && this.name !== name) {
      return;
    }

    this.audioController.setVolume(val);
  };

  AnimationItem.prototype.getVolume = function () {
    return this.audioController.getVolume();
  };

  AnimationItem.prototype.mute = function (name) {
    if (name && this.name !== name) {
      return;
    }

    this.audioController.mute();
  };

  AnimationItem.prototype.unmute = function (name) {
    if (name && this.name !== name) {
      return;
    }

    this.audioController.unmute();
  };

  AnimationItem.prototype.updaFrameModifier = function () {
    this.frameModifier = this.frameMult * this.playSpeed * this.playDirection;
    this.audioController.setRate(this.playSpeed * this.playDirection);
  };

  AnimationItem.prototype.getPath = function () {
    return this.path;
  };

  AnimationItem.prototype.getAssetsPath = function (assetData) {
    var path = '';

    if (assetData.e) {
      path = assetData.p;
    } else if (this.assetsPath) {
      var imagePath = assetData.p;

      if (imagePath.indexOf('images/') !== -1) {
        imagePath = imagePath.split('/')[1];
      }

      path = this.assetsPath + imagePath;
    } else {
      path = this.path;
      path += assetData.u ? assetData.u : '';
      path += assetData.p;
    }

    return path;
  };

  AnimationItem.prototype.getAssetData = function (id) {
    var i = 0;
    var len = this.assets.length;

    while (i < len) {
      if (id === this.assets[i].id) {
        return this.assets[i];
      }

      i += 1;
    }

    return null;
  };

  AnimationItem.prototype.hide = function () {
    this.renderer.hide();
  };

  AnimationItem.prototype.show = function () {
    this.renderer.show();
  };

  AnimationItem.prototype.getDuration = function (isFrame) {
    return isFrame ? this.totalFrames : this.totalFrames / this.frameRate;
  };

  AnimationItem.prototype.trigger = function (name) {
    if (this._cbs && this._cbs[name]) {
      switch (name) {
        case 'enterFrame':
        case 'drawnFrame':
          this.triggerEvent(name, new BMEnterFrameEvent(name, this.currentFrame, this.totalFrames, this.frameModifier));
          break;

        case 'loopComplete':
          this.triggerEvent(name, new BMCompleteLoopEvent(name, this.loop, this.playCount, this.frameMult));
          break;

        case 'complete':
          this.triggerEvent(name, new BMCompleteEvent(name, this.frameMult));
          break;

        case 'segmentStart':
          this.triggerEvent(name, new BMSegmentStartEvent(name, this.firstFrame, this.totalFrames));
          break;

        case 'destroy':
          this.triggerEvent(name, new BMDestroyEvent(name, this));
          break;

        default:
          this.triggerEvent(name);
      }
    }

    if (name === 'enterFrame' && this.onEnterFrame) {
      this.onEnterFrame.call(this, new BMEnterFrameEvent(name, this.currentFrame, this.totalFrames, this.frameMult));
    }

    if (name === 'loopComplete' && this.onLoopComplete) {
      this.onLoopComplete.call(this, new BMCompleteLoopEvent(name, this.loop, this.playCount, this.frameMult));
    }

    if (name === 'complete' && this.onComplete) {
      this.onComplete.call(this, new BMCompleteEvent(name, this.frameMult));
    }

    if (name === 'segmentStart' && this.onSegmentStart) {
      this.onSegmentStart.call(this, new BMSegmentStartEvent(name, this.firstFrame, this.totalFrames));
    }

    if (name === 'destroy' && this.onDestroy) {
      this.onDestroy.call(this, new BMDestroyEvent(name, this));
    }
  };

  AnimationItem.prototype.triggerRenderFrameError = function (nativeError) {
    var error = new BMRenderFrameErrorEvent(nativeError, this.currentFrame);
    this.triggerEvent('error', error);

    if (this.onError) {
      this.onError.call(this, error);
    }
  };

  AnimationItem.prototype.triggerConfigError = function (nativeError) {
    var error = new BMConfigErrorEvent(nativeError, this.currentFrame);
    this.triggerEvent('error', error);

    if (this.onError) {
      this.onError.call(this, error);
    }
  };

  var animationManager = function () {
    var moduleOb = {};
    var registeredAnimations = [];
    var initTime = 0;
    var len = 0;
    var playingAnimationsNum = 0;
    var _stopped = true;
    var _isFrozen = false;

    function removeElement(ev) {
      var i = 0;
      var animItem = ev.target;

      while (i < len) {
        if (registeredAnimations[i].animation === animItem) {
          registeredAnimations.splice(i, 1);
          i -= 1;
          len -= 1;

          if (!animItem.isPaused) {
            subtractPlayingCount();
          }
        }

        i += 1;
      }
    }

    function registerAnimation(element, animationData) {
      if (!element) {
        return null;
      }

      var i = 0;

      while (i < len) {
        if (registeredAnimations[i].elem === element && registeredAnimations[i].elem !== null) {
          return registeredAnimations[i].animation;
        }

        i += 1;
      }

      var animItem = new AnimationItem();
      setupAnimation(animItem, element);
      animItem.setData(element, animationData);
      return animItem;
    }

    function getRegisteredAnimations() {
      var i;
      var lenAnims = registeredAnimations.length;
      var animations = [];

      for (i = 0; i < lenAnims; i += 1) {
        animations.push(registeredAnimations[i].animation);
      }

      return animations;
    }

    function addPlayingCount() {
      playingAnimationsNum += 1;
      activate();
    }

    function subtractPlayingCount() {
      playingAnimationsNum -= 1;
    }

    function setupAnimation(animItem, element) {
      animItem.addEventListener('destroy', removeElement);
      animItem.addEventListener('_active', addPlayingCount);
      animItem.addEventListener('_idle', subtractPlayingCount);
      registeredAnimations.push({
        elem: element,
        animation: animItem
      });
      len += 1;
    }

    function loadAnimation(params) {
      var animItem = new AnimationItem();
      setupAnimation(animItem, null);
      animItem.setParams(params);
      return animItem;
    }

    function setSpeed(val, animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.setSpeed(val, animation);
      }
    }

    function setDirection(val, animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.setDirection(val, animation);
      }
    }

    function play(animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.play(animation);
      }
    }

    function resume(nowTime) {
      var elapsedTime = nowTime - initTime;
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.advanceTime(elapsedTime);
      }

      initTime = nowTime;

      if (playingAnimationsNum && !_isFrozen) {
        window.requestAnimationFrame(resume);
      } else {
        _stopped = true;
      }
    }

    function first(nowTime) {
      initTime = nowTime;
      window.requestAnimationFrame(resume);
    }

    function pause(animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.pause(animation);
      }
    }

    function goToAndStop(value, isFrame, animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.goToAndStop(value, isFrame, animation);
      }
    }

    function stop(animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.stop(animation);
      }
    }

    function togglePause(animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.togglePause(animation);
      }
    }

    function destroy(animation) {
      var i;

      for (i = len - 1; i >= 0; i -= 1) {
        registeredAnimations[i].animation.destroy(animation);
      }
    }

    function searchAnimations(animationData, standalone, renderer) {
      var animElements = [].concat([].slice.call(document.getElementsByClassName('lottie')), [].slice.call(document.getElementsByClassName('bodymovin')));
      var i;
      var lenAnims = animElements.length;

      for (i = 0; i < lenAnims; i += 1) {
        if (renderer) {
          animElements[i].setAttribute('data-bm-type', renderer);
        }

        registerAnimation(animElements[i], animationData);
      }

      if (standalone && lenAnims === 0) {
        if (!renderer) {
          renderer = 'svg';
        }

        var body = document.getElementsByTagName('body')[0];
        body.innerText = '';
        var div = createTag('div');
        div.style.width = '100%';
        div.style.height = '100%';
        div.setAttribute('data-bm-type', renderer);
        body.appendChild(div);
        registerAnimation(div, animationData);
      }
    }

    function resize() {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.resize();
      }
    }

    function activate() {
      if (!_isFrozen && playingAnimationsNum) {
        if (_stopped) {
          window.requestAnimationFrame(first);
          _stopped = false;
        }
      }
    }

    function freeze() {
      _isFrozen = true;
    }

    function unfreeze() {
      _isFrozen = false;
      activate();
    }

    function setVolume(val, animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.setVolume(val, animation);
      }
    }

    function mute(animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.mute(animation);
      }
    }

    function unmute(animation) {
      var i;

      for (i = 0; i < len; i += 1) {
        registeredAnimations[i].animation.unmute(animation);
      }
    }

    moduleOb.registerAnimation = registerAnimation;
    moduleOb.loadAnimation = loadAnimation;
    moduleOb.setSpeed = setSpeed;
    moduleOb.setDirection = setDirection;
    moduleOb.play = play;
    moduleOb.pause = pause;
    moduleOb.stop = stop;
    moduleOb.togglePause = togglePause;
    moduleOb.searchAnimations = searchAnimations;
    moduleOb.resize = resize; // moduleOb.start = start;

    moduleOb.goToAndStop = goToAndStop;
    moduleOb.destroy = destroy;
    moduleOb.freeze = freeze;
    moduleOb.unfreeze = unfreeze;
    moduleOb.setVolume = setVolume;
    moduleOb.mute = mute;
    moduleOb.unmute = unmute;
    moduleOb.getRegisteredAnimations = getRegisteredAnimations;
    return moduleOb;
  }();

  /* eslint-disable */
  var BezierFactory = function () {
    /**
       * BezierEasing - use bezier curve for transition easing function
       * by Gaëtan Renaudeau 2014 - 2015 – MIT License
       *
       * Credits: is based on Firefox's nsSMILKeySpline.cpp
       * Usage:
       * var spline = BezierEasing([ 0.25, 0.1, 0.25, 1.0 ])
       * spline.get(x) => returns the easing value | x must be in [0, 1] range
       *
       */
    var ob = {};
    ob.getBezierEasing = getBezierEasing;
    var beziers = {};

    function getBezierEasing(a, b, c, d, nm) {
      var str = nm || ('bez_' + a + '_' + b + '_' + c + '_' + d).replace(/\./g, 'p');

      if (beziers[str]) {
        return beziers[str];
      }

      var bezEasing = new BezierEasing([a, b, c, d]);
      beziers[str] = bezEasing;
      return bezEasing;
    } // These values are established by empiricism with tests (tradeoff: performance VS precision)


    var NEWTON_ITERATIONS = 4;
    var NEWTON_MIN_SLOPE = 0.001;
    var SUBDIVISION_PRECISION = 0.0000001;
    var SUBDIVISION_MAX_ITERATIONS = 10;
    var kSplineTableSize = 11;
    var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
    var float32ArraySupported = typeof Float32Array === 'function';

    function A(aA1, aA2) {
      return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    }

    function B(aA1, aA2) {
      return 3.0 * aA2 - 6.0 * aA1;
    }

    function C(aA1) {
      return 3.0 * aA1;
    } // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.


    function calcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    } // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.


    function getSlope(aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function binarySubdivide(aX, aA, aB, mX1, mX2) {
      var currentX,
          currentT,
          i = 0;

      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;

        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

      return currentT;
    }

    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
      for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }

      return aGuessT;
    }
    /**
       * points is an array of [ mX1, mY1, mX2, mY2 ]
       */


    function BezierEasing(points) {
      this._p = points;
      this._mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
      this._precomputed = false;
      this.get = this.get.bind(this);
    }

    BezierEasing.prototype = {
      get: function get(x) {
        var mX1 = this._p[0],
            mY1 = this._p[1],
            mX2 = this._p[2],
            mY2 = this._p[3];
        if (!this._precomputed) this._precompute();
        if (mX1 === mY1 && mX2 === mY2) return x; // linear
        // Because JavaScript number are imprecise, we should guarantee the extremes are right.

        if (x === 0) return 0;
        if (x === 1) return 1;
        return calcBezier(this._getTForX(x), mY1, mY2);
      },
      // Private part
      _precompute: function _precompute() {
        var mX1 = this._p[0],
            mY1 = this._p[1],
            mX2 = this._p[2],
            mY2 = this._p[3];
        this._precomputed = true;

        if (mX1 !== mY1 || mX2 !== mY2) {
          this._calcSampleValues();
        }
      },
      _calcSampleValues: function _calcSampleValues() {
        var mX1 = this._p[0],
            mX2 = this._p[2];

        for (var i = 0; i < kSplineTableSize; ++i) {
          this._mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
      },

      /**
           * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
           */
      _getTForX: function _getTForX(aX) {
        var mX1 = this._p[0],
            mX2 = this._p[2],
            mSampleValues = this._mSampleValues;
        var intervalStart = 0.0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;

        for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
          intervalStart += kSampleStepSize;
        }

        --currentSample; // Interpolate to provide an initial guess for t

        var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;
        var initialSlope = getSlope(guessForT, mX1, mX2);

        if (initialSlope >= NEWTON_MIN_SLOPE) {
          return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        }

        if (initialSlope === 0.0) {
          return guessForT;
        }

        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    };
    return ob;
  }();

  var pooling = function () {
    function _double(arr) {
      return arr.concat(createSizedArray(arr.length));
    }

    return {
      "double": _double
    };
  }();

  var poolFactory = function () {
    return function (initialLength, _create, _release) {
      var _length = 0;
      var _maxLength = initialLength;
      var pool = createSizedArray(_maxLength);
      var ob = {
        newElement: newElement,
        release: release
      };

      function newElement() {
        var element;

        if (_length) {
          _length -= 1;
          element = pool[_length];
        } else {
          element = _create();
        }

        return element;
      }

      function release(element) {
        if (_length === _maxLength) {
          pool = pooling["double"](pool);
          _maxLength *= 2;
        }

        if (_release) {
          _release(element);
        }

        pool[_length] = element;
        _length += 1;
      }

      return ob;
    };
  }();

  var bezierLengthPool = function () {
    function create() {
      return {
        addedLength: 0,
        percents: createTypedArray('float32', getDefaultCurveSegments()),
        lengths: createTypedArray('float32', getDefaultCurveSegments())
      };
    }

    return poolFactory(8, create);
  }();

  var segmentsLengthPool = function () {
    function create() {
      return {
        lengths: [],
        totalLength: 0
      };
    }

    function release(element) {
      var i;
      var len = element.lengths.length;

      for (i = 0; i < len; i += 1) {
        bezierLengthPool.release(element.lengths[i]);
      }

      element.lengths.length = 0;
    }

    return poolFactory(8, create, release);
  }();

  function bezFunction() {
    var math = Math;

    function pointOnLine2D(x1, y1, x2, y2, x3, y3) {
      var det1 = x1 * y2 + y1 * x3 + x2 * y3 - x3 * y2 - y3 * x1 - x2 * y1;
      return det1 > -0.001 && det1 < 0.001;
    }

    function pointOnLine3D(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
      if (z1 === 0 && z2 === 0 && z3 === 0) {
        return pointOnLine2D(x1, y1, x2, y2, x3, y3);
      }

      var dist1 = math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2) + math.pow(z2 - z1, 2));
      var dist2 = math.sqrt(math.pow(x3 - x1, 2) + math.pow(y3 - y1, 2) + math.pow(z3 - z1, 2));
      var dist3 = math.sqrt(math.pow(x3 - x2, 2) + math.pow(y3 - y2, 2) + math.pow(z3 - z2, 2));
      var diffDist;

      if (dist1 > dist2) {
        if (dist1 > dist3) {
          diffDist = dist1 - dist2 - dist3;
        } else {
          diffDist = dist3 - dist2 - dist1;
        }
      } else if (dist3 > dist2) {
        diffDist = dist3 - dist2 - dist1;
      } else {
        diffDist = dist2 - dist1 - dist3;
      }

      return diffDist > -0.0001 && diffDist < 0.0001;
    }

    var getBezierLength = function () {
      return function (pt1, pt2, pt3, pt4) {
        var curveSegments = getDefaultCurveSegments();
        var k;
        var i;
        var len;
        var ptCoord;
        var perc;
        var addedLength = 0;
        var ptDistance;
        var point = [];
        var lastPoint = [];
        var lengthData = bezierLengthPool.newElement();
        len = pt3.length;

        for (k = 0; k < curveSegments; k += 1) {
          perc = k / (curveSegments - 1);
          ptDistance = 0;

          for (i = 0; i < len; i += 1) {
            ptCoord = bmPow(1 - perc, 3) * pt1[i] + 3 * bmPow(1 - perc, 2) * perc * pt3[i] + 3 * (1 - perc) * bmPow(perc, 2) * pt4[i] + bmPow(perc, 3) * pt2[i];
            point[i] = ptCoord;

            if (lastPoint[i] !== null) {
              ptDistance += bmPow(point[i] - lastPoint[i], 2);
            }

            lastPoint[i] = point[i];
          }

          if (ptDistance) {
            ptDistance = bmSqrt(ptDistance);
            addedLength += ptDistance;
          }

          lengthData.percents[k] = perc;
          lengthData.lengths[k] = addedLength;
        }

        lengthData.addedLength = addedLength;
        return lengthData;
      };
    }();

    function getSegmentsLength(shapeData) {
      var segmentsLength = segmentsLengthPool.newElement();
      var closed = shapeData.c;
      var pathV = shapeData.v;
      var pathO = shapeData.o;
      var pathI = shapeData.i;
      var i;
      var len = shapeData._length;
      var lengths = segmentsLength.lengths;
      var totalLength = 0;

      for (i = 0; i < len - 1; i += 1) {
        lengths[i] = getBezierLength(pathV[i], pathV[i + 1], pathO[i], pathI[i + 1]);
        totalLength += lengths[i].addedLength;
      }

      if (closed && len) {
        lengths[i] = getBezierLength(pathV[i], pathV[0], pathO[i], pathI[0]);
        totalLength += lengths[i].addedLength;
      }

      segmentsLength.totalLength = totalLength;
      return segmentsLength;
    }

    function BezierData(length) {
      this.segmentLength = 0;
      this.points = new Array(length);
    }

    function PointData(partial, point) {
      this.partialLength = partial;
      this.point = point;
    }

    var buildBezierData = function () {
      var storedData = {};
      return function (pt1, pt2, pt3, pt4) {
        var bezierName = (pt1[0] + '_' + pt1[1] + '_' + pt2[0] + '_' + pt2[1] + '_' + pt3[0] + '_' + pt3[1] + '_' + pt4[0] + '_' + pt4[1]).replace(/\./g, 'p');

        if (!storedData[bezierName]) {
          var curveSegments = getDefaultCurveSegments();
          var k;
          var i;
          var len;
          var ptCoord;
          var perc;
          var addedLength = 0;
          var ptDistance;
          var point;
          var lastPoint = null;

          if (pt1.length === 2 && (pt1[0] !== pt2[0] || pt1[1] !== pt2[1]) && pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt1[0] + pt3[0], pt1[1] + pt3[1]) && pointOnLine2D(pt1[0], pt1[1], pt2[0], pt2[1], pt2[0] + pt4[0], pt2[1] + pt4[1])) {
            curveSegments = 2;
          }

          var bezierData = new BezierData(curveSegments);
          len = pt3.length;

          for (k = 0; k < curveSegments; k += 1) {
            point = createSizedArray(len);
            perc = k / (curveSegments - 1);
            ptDistance = 0;

            for (i = 0; i < len; i += 1) {
              ptCoord = bmPow(1 - perc, 3) * pt1[i] + 3 * bmPow(1 - perc, 2) * perc * (pt1[i] + pt3[i]) + 3 * (1 - perc) * bmPow(perc, 2) * (pt2[i] + pt4[i]) + bmPow(perc, 3) * pt2[i];
              point[i] = ptCoord;

              if (lastPoint !== null) {
                ptDistance += bmPow(point[i] - lastPoint[i], 2);
              }
            }

            ptDistance = bmSqrt(ptDistance);
            addedLength += ptDistance;
            bezierData.points[k] = new PointData(ptDistance, point);
            lastPoint = point;
          }

          bezierData.segmentLength = addedLength;
          storedData[bezierName] = bezierData;
        }

        return storedData[bezierName];
      };
    }();

    function getDistancePerc(perc, bezierData) {
      var percents = bezierData.percents;
      var lengths = bezierData.lengths;
      var len = percents.length;
      var initPos = bmFloor((len - 1) * perc);
      var lengthPos = perc * bezierData.addedLength;
      var lPerc = 0;

      if (initPos === len - 1 || initPos === 0 || lengthPos === lengths[initPos]) {
        return percents[initPos];
      }

      var dir = lengths[initPos] > lengthPos ? -1 : 1;
      var flag = true;

      while (flag) {
        if (lengths[initPos] <= lengthPos && lengths[initPos + 1] > lengthPos) {
          lPerc = (lengthPos - lengths[initPos]) / (lengths[initPos + 1] - lengths[initPos]);
          flag = false;
        } else {
          initPos += dir;
        }

        if (initPos < 0 || initPos >= len - 1) {
          // FIX for TypedArrays that don't store floating point values with enough accuracy
          if (initPos === len - 1) {
            return percents[initPos];
          }

          flag = false;
        }
      }

      return percents[initPos] + (percents[initPos + 1] - percents[initPos]) * lPerc;
    }

    function getPointInSegment(pt1, pt2, pt3, pt4, percent, bezierData) {
      var t1 = getDistancePerc(percent, bezierData);
      var u1 = 1 - t1;
      var ptX = math.round((u1 * u1 * u1 * pt1[0] + (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[0] + (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[0] + t1 * t1 * t1 * pt2[0]) * 1000) / 1000;
      var ptY = math.round((u1 * u1 * u1 * pt1[1] + (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[1] + (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[1] + t1 * t1 * t1 * pt2[1]) * 1000) / 1000;
      return [ptX, ptY];
    }

    var bezierSegmentPoints = createTypedArray('float32', 8);

    function getNewSegment(pt1, pt2, pt3, pt4, startPerc, endPerc, bezierData) {
      if (startPerc < 0) {
        startPerc = 0;
      } else if (startPerc > 1) {
        startPerc = 1;
      }

      var t0 = getDistancePerc(startPerc, bezierData);
      endPerc = endPerc > 1 ? 1 : endPerc;
      var t1 = getDistancePerc(endPerc, bezierData);
      var i;
      var len = pt1.length;
      var u0 = 1 - t0;
      var u1 = 1 - t1;
      var u0u0u0 = u0 * u0 * u0;
      var t0u0u0_3 = t0 * u0 * u0 * 3; // eslint-disable-line camelcase

      var t0t0u0_3 = t0 * t0 * u0 * 3; // eslint-disable-line camelcase

      var t0t0t0 = t0 * t0 * t0; //

      var u0u0u1 = u0 * u0 * u1;
      var t0u0u1_3 = t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1; // eslint-disable-line camelcase

      var t0t0u1_3 = t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1; // eslint-disable-line camelcase

      var t0t0t1 = t0 * t0 * t1; //

      var u0u1u1 = u0 * u1 * u1;
      var t0u1u1_3 = t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1; // eslint-disable-line camelcase

      var t0t1u1_3 = t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1; // eslint-disable-line camelcase

      var t0t1t1 = t0 * t1 * t1; //

      var u1u1u1 = u1 * u1 * u1;
      var t1u1u1_3 = t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1; // eslint-disable-line camelcase

      var t1t1u1_3 = t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1; // eslint-disable-line camelcase

      var t1t1t1 = t1 * t1 * t1;

      for (i = 0; i < len; i += 1) {
        bezierSegmentPoints[i * 4] = math.round((u0u0u0 * pt1[i] + t0u0u0_3 * pt3[i] + t0t0u0_3 * pt4[i] + t0t0t0 * pt2[i]) * 1000) / 1000; // eslint-disable-line camelcase

        bezierSegmentPoints[i * 4 + 1] = math.round((u0u0u1 * pt1[i] + t0u0u1_3 * pt3[i] + t0t0u1_3 * pt4[i] + t0t0t1 * pt2[i]) * 1000) / 1000; // eslint-disable-line camelcase

        bezierSegmentPoints[i * 4 + 2] = math.round((u0u1u1 * pt1[i] + t0u1u1_3 * pt3[i] + t0t1u1_3 * pt4[i] + t0t1t1 * pt2[i]) * 1000) / 1000; // eslint-disable-line camelcase

        bezierSegmentPoints[i * 4 + 3] = math.round((u1u1u1 * pt1[i] + t1u1u1_3 * pt3[i] + t1t1u1_3 * pt4[i] + t1t1t1 * pt2[i]) * 1000) / 1000; // eslint-disable-line camelcase
      }

      return bezierSegmentPoints;
    }

    return {
      getSegmentsLength: getSegmentsLength,
      getNewSegment: getNewSegment,
      getPointInSegment: getPointInSegment,
      buildBezierData: buildBezierData,
      pointOnLine2D: pointOnLine2D,
      pointOnLine3D: pointOnLine3D
    };
  }

  var bez = bezFunction();

  var PropertyFactory = function () {
    var initFrame = initialDefaultFrame;
    var mathAbs = Math.abs;

    function interpolateValue(frameNum, caching) {
      var offsetTime = this.offsetTime;
      var newValue;

      if (this.propType === 'multidimensional') {
        newValue = createTypedArray('float32', this.pv.length);
      }

      var iterationIndex = caching.lastIndex;
      var i = iterationIndex;
      var len = this.keyframes.length - 1;
      var flag = true;
      var keyData;
      var nextKeyData;
      var keyframeMetadata;

      while (flag) {
        keyData = this.keyframes[i];
        nextKeyData = this.keyframes[i + 1];

        if (i === len - 1 && frameNum >= nextKeyData.t - offsetTime) {
          if (keyData.h) {
            keyData = nextKeyData;
          }

          iterationIndex = 0;
          break;
        }

        if (nextKeyData.t - offsetTime > frameNum) {
          iterationIndex = i;
          break;
        }

        if (i < len - 1) {
          i += 1;
        } else {
          iterationIndex = 0;
          flag = false;
        }
      }

      keyframeMetadata = this.keyframesMetadata[i] || {};
      var k;
      var kLen;
      var perc;
      var jLen;
      var j;
      var fnc;
      var nextKeyTime = nextKeyData.t - offsetTime;
      var keyTime = keyData.t - offsetTime;
      var endValue;

      if (keyData.to) {
        if (!keyframeMetadata.bezierData) {
          keyframeMetadata.bezierData = bez.buildBezierData(keyData.s, nextKeyData.s || keyData.e, keyData.to, keyData.ti);
        }

        var bezierData = keyframeMetadata.bezierData;

        if (frameNum >= nextKeyTime || frameNum < keyTime) {
          var ind = frameNum >= nextKeyTime ? bezierData.points.length - 1 : 0;
          kLen = bezierData.points[ind].point.length;

          for (k = 0; k < kLen; k += 1) {
            newValue[k] = bezierData.points[ind].point[k];
          } // caching._lastKeyframeIndex = -1;

        } else {
          if (keyframeMetadata.__fnct) {
            fnc = keyframeMetadata.__fnct;
          } else {
            fnc = BezierFactory.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y, keyData.n).get;
            keyframeMetadata.__fnct = fnc;
          }

          perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime));
          var distanceInLine = bezierData.segmentLength * perc;
          var segmentPerc;
          var addedLength = caching.lastFrame < frameNum && caching._lastKeyframeIndex === i ? caching._lastAddedLength : 0;
          j = caching.lastFrame < frameNum && caching._lastKeyframeIndex === i ? caching._lastPoint : 0;
          flag = true;
          jLen = bezierData.points.length;

          while (flag) {
            addedLength += bezierData.points[j].partialLength;

            if (distanceInLine === 0 || perc === 0 || j === bezierData.points.length - 1) {
              kLen = bezierData.points[j].point.length;

              for (k = 0; k < kLen; k += 1) {
                newValue[k] = bezierData.points[j].point[k];
              }

              break;
            } else if (distanceInLine >= addedLength && distanceInLine < addedLength + bezierData.points[j + 1].partialLength) {
              segmentPerc = (distanceInLine - addedLength) / bezierData.points[j + 1].partialLength;
              kLen = bezierData.points[j].point.length;

              for (k = 0; k < kLen; k += 1) {
                newValue[k] = bezierData.points[j].point[k] + (bezierData.points[j + 1].point[k] - bezierData.points[j].point[k]) * segmentPerc;
              }

              break;
            }

            if (j < jLen - 1) {
              j += 1;
            } else {
              flag = false;
            }
          }

          caching._lastPoint = j;
          caching._lastAddedLength = addedLength - bezierData.points[j].partialLength;
          caching._lastKeyframeIndex = i;
        }
      } else {
        var outX;
        var outY;
        var inX;
        var inY;
        var keyValue;
        len = keyData.s.length;
        endValue = nextKeyData.s || keyData.e;

        if (this.sh && keyData.h !== 1) {
          if (frameNum >= nextKeyTime) {
            newValue[0] = endValue[0];
            newValue[1] = endValue[1];
            newValue[2] = endValue[2];
          } else if (frameNum <= keyTime) {
            newValue[0] = keyData.s[0];
            newValue[1] = keyData.s[1];
            newValue[2] = keyData.s[2];
          } else {
            var quatStart = createQuaternion(keyData.s);
            var quatEnd = createQuaternion(endValue);
            var time = (frameNum - keyTime) / (nextKeyTime - keyTime);
            quaternionToEuler(newValue, slerp(quatStart, quatEnd, time));
          }
        } else {
          for (i = 0; i < len; i += 1) {
            if (keyData.h !== 1) {
              if (frameNum >= nextKeyTime) {
                perc = 1;
              } else if (frameNum < keyTime) {
                perc = 0;
              } else {
                if (keyData.o.x.constructor === Array) {
                  if (!keyframeMetadata.__fnct) {
                    keyframeMetadata.__fnct = [];
                  }

                  if (!keyframeMetadata.__fnct[i]) {
                    outX = keyData.o.x[i] === undefined ? keyData.o.x[0] : keyData.o.x[i];
                    outY = keyData.o.y[i] === undefined ? keyData.o.y[0] : keyData.o.y[i];
                    inX = keyData.i.x[i] === undefined ? keyData.i.x[0] : keyData.i.x[i];
                    inY = keyData.i.y[i] === undefined ? keyData.i.y[0] : keyData.i.y[i];
                    fnc = BezierFactory.getBezierEasing(outX, outY, inX, inY).get;
                    keyframeMetadata.__fnct[i] = fnc;
                  } else {
                    fnc = keyframeMetadata.__fnct[i];
                  }
                } else if (!keyframeMetadata.__fnct) {
                  outX = keyData.o.x;
                  outY = keyData.o.y;
                  inX = keyData.i.x;
                  inY = keyData.i.y;
                  fnc = BezierFactory.getBezierEasing(outX, outY, inX, inY).get;
                  keyData.keyframeMetadata = fnc;
                } else {
                  fnc = keyframeMetadata.__fnct;
                }

                perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime));
              }
            }

            endValue = nextKeyData.s || keyData.e;
            keyValue = keyData.h === 1 ? keyData.s[i] : keyData.s[i] + (endValue[i] - keyData.s[i]) * perc;

            if (this.propType === 'multidimensional') {
              newValue[i] = keyValue;
            } else {
              newValue = keyValue;
            }
          }
        }
      }

      caching.lastIndex = iterationIndex;
      return newValue;
    } // based on @Toji's https://github.com/toji/gl-matrix/


    function slerp(a, b, t) {
      var out = [];
      var ax = a[0];
      var ay = a[1];
      var az = a[2];
      var aw = a[3];
      var bx = b[0];
      var by = b[1];
      var bz = b[2];
      var bw = b[3];
      var omega;
      var cosom;
      var sinom;
      var scale0;
      var scale1;
      cosom = ax * bx + ay * by + az * bz + aw * bw;

      if (cosom < 0.0) {
        cosom = -cosom;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
      }

      if (1.0 - cosom > 0.000001) {
        omega = Math.acos(cosom);
        sinom = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
      } else {
        scale0 = 1.0 - t;
        scale1 = t;
      }

      out[0] = scale0 * ax + scale1 * bx;
      out[1] = scale0 * ay + scale1 * by;
      out[2] = scale0 * az + scale1 * bz;
      out[3] = scale0 * aw + scale1 * bw;
      return out;
    }

    function quaternionToEuler(out, quat) {
      var qx = quat[0];
      var qy = quat[1];
      var qz = quat[2];
      var qw = quat[3];
      var heading = Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy * qy - 2 * qz * qz);
      var attitude = Math.asin(2 * qx * qy + 2 * qz * qw);
      var bank = Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx * qx - 2 * qz * qz);
      out[0] = heading / degToRads;
      out[1] = attitude / degToRads;
      out[2] = bank / degToRads;
    }

    function createQuaternion(values) {
      var heading = values[0] * degToRads;
      var attitude = values[1] * degToRads;
      var bank = values[2] * degToRads;
      var c1 = Math.cos(heading / 2);
      var c2 = Math.cos(attitude / 2);
      var c3 = Math.cos(bank / 2);
      var s1 = Math.sin(heading / 2);
      var s2 = Math.sin(attitude / 2);
      var s3 = Math.sin(bank / 2);
      var w = c1 * c2 * c3 - s1 * s2 * s3;
      var x = s1 * s2 * c3 + c1 * c2 * s3;
      var y = s1 * c2 * c3 + c1 * s2 * s3;
      var z = c1 * s2 * c3 - s1 * c2 * s3;
      return [x, y, z, w];
    }

    function getValueAtCurrentTime() {
      var frameNum = this.comp.renderedFrame - this.offsetTime;
      var initTime = this.keyframes[0].t - this.offsetTime;
      var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;

      if (!(frameNum === this._caching.lastFrame || this._caching.lastFrame !== initFrame && (this._caching.lastFrame >= endTime && frameNum >= endTime || this._caching.lastFrame < initTime && frameNum < initTime))) {
        if (this._caching.lastFrame >= frameNum) {
          this._caching._lastKeyframeIndex = -1;
          this._caching.lastIndex = 0;
        }

        var renderResult = this.interpolateValue(frameNum, this._caching);
        this.pv = renderResult;
      }

      this._caching.lastFrame = frameNum;
      return this.pv;
    }

    function setVValue(val) {
      var multipliedValue;

      if (this.propType === 'unidimensional') {
        multipliedValue = val * this.mult;

        if (mathAbs(this.v - multipliedValue) > 0.00001) {
          this.v = multipliedValue;
          this._mdf = true;
        }
      } else {
        var i = 0;
        var len = this.v.length;

        while (i < len) {
          multipliedValue = val[i] * this.mult;

          if (mathAbs(this.v[i] - multipliedValue) > 0.00001) {
            this.v[i] = multipliedValue;
            this._mdf = true;
          }

          i += 1;
        }
      }
    }

    function processEffectsSequence() {
      if (this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length) {
        return;
      }

      if (this.lock) {
        this.setVValue(this.pv);
        return;
      }

      this.lock = true;
      this._mdf = this._isFirstFrame;
      var i;
      var len = this.effectsSequence.length;
      var finalValue = this.kf ? this.pv : this.data.k;

      for (i = 0; i < len; i += 1) {
        finalValue = this.effectsSequence[i](finalValue);
      }

      this.setVValue(finalValue);
      this._isFirstFrame = false;
      this.lock = false;
      this.frameId = this.elem.globalData.frameId;
    }

    function addEffect(effectFunction) {
      this.effectsSequence.push(effectFunction);
      this.container.addDynamicProperty(this);
    }

    function ValueProperty(elem, data, mult, container) {
      this.propType = 'unidimensional';
      this.mult = mult || 1;
      this.data = data;
      this.v = mult ? data.k * mult : data.k;
      this.pv = data.k;
      this._mdf = false;
      this.elem = elem;
      this.container = container;
      this.comp = elem.comp;
      this.k = false;
      this.kf = false;
      this.vel = 0;
      this.effectsSequence = [];
      this._isFirstFrame = true;
      this.getValue = processEffectsSequence;
      this.setVValue = setVValue;
      this.addEffect = addEffect;
    }

    function MultiDimensionalProperty(elem, data, mult, container) {
      this.propType = 'multidimensional';
      this.mult = mult || 1;
      this.data = data;
      this._mdf = false;
      this.elem = elem;
      this.container = container;
      this.comp = elem.comp;
      this.k = false;
      this.kf = false;
      this.frameId = -1;
      var i;
      var len = data.k.length;
      this.v = createTypedArray('float32', len);
      this.pv = createTypedArray('float32', len);
      this.vel = createTypedArray('float32', len);

      for (i = 0; i < len; i += 1) {
        this.v[i] = data.k[i] * this.mult;
        this.pv[i] = data.k[i];
      }

      this._isFirstFrame = true;
      this.effectsSequence = [];
      this.getValue = processEffectsSequence;
      this.setVValue = setVValue;
      this.addEffect = addEffect;
    }

    function KeyframedValueProperty(elem, data, mult, container) {
      this.propType = 'unidimensional';
      this.keyframes = data.k;
      this.keyframesMetadata = [];
      this.offsetTime = elem.data.st;
      this.frameId = -1;
      this._caching = {
        lastFrame: initFrame,
        lastIndex: 0,
        value: 0,
        _lastKeyframeIndex: -1
      };
      this.k = true;
      this.kf = true;
      this.data = data;
      this.mult = mult || 1;
      this.elem = elem;
      this.container = container;
      this.comp = elem.comp;
      this.v = initFrame;
      this.pv = initFrame;
      this._isFirstFrame = true;
      this.getValue = processEffectsSequence;
      this.setVValue = setVValue;
      this.interpolateValue = interpolateValue;
      this.effectsSequence = [getValueAtCurrentTime.bind(this)];
      this.addEffect = addEffect;
    }

    function KeyframedMultidimensionalProperty(elem, data, mult, container) {
      this.propType = 'multidimensional';
      var i;
      var len = data.k.length;
      var s;
      var e;
      var to;
      var ti;

      for (i = 0; i < len - 1; i += 1) {
        if (data.k[i].to && data.k[i].s && data.k[i + 1] && data.k[i + 1].s) {
          s = data.k[i].s;
          e = data.k[i + 1].s;
          to = data.k[i].to;
          ti = data.k[i].ti;

          if (s.length === 2 && !(s[0] === e[0] && s[1] === e[1]) && bez.pointOnLine2D(s[0], s[1], e[0], e[1], s[0] + to[0], s[1] + to[1]) && bez.pointOnLine2D(s[0], s[1], e[0], e[1], e[0] + ti[0], e[1] + ti[1]) || s.length === 3 && !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) && bez.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], s[0] + to[0], s[1] + to[1], s[2] + to[2]) && bez.pointOnLine3D(s[0], s[1], s[2], e[0], e[1], e[2], e[0] + ti[0], e[1] + ti[1], e[2] + ti[2])) {
            data.k[i].to = null;
            data.k[i].ti = null;
          }

          if (s[0] === e[0] && s[1] === e[1] && to[0] === 0 && to[1] === 0 && ti[0] === 0 && ti[1] === 0) {
            if (s.length === 2 || s[2] === e[2] && to[2] === 0 && ti[2] === 0) {
              data.k[i].to = null;
              data.k[i].ti = null;
            }
          }
        }
      }

      this.effectsSequence = [getValueAtCurrentTime.bind(this)];
      this.data = data;
      this.keyframes = data.k;
      this.keyframesMetadata = [];
      this.offsetTime = elem.data.st;
      this.k = true;
      this.kf = true;
      this._isFirstFrame = true;
      this.mult = mult || 1;
      this.elem = elem;
      this.container = container;
      this.comp = elem.comp;
      this.getValue = processEffectsSequence;
      this.setVValue = setVValue;
      this.interpolateValue = interpolateValue;
      this.frameId = -1;
      var arrLen = data.k[0].s.length;
      this.v = createTypedArray('float32', arrLen);
      this.pv = createTypedArray('float32', arrLen);

      for (i = 0; i < arrLen; i += 1) {
        this.v[i] = initFrame;
        this.pv[i] = initFrame;
      }

      this._caching = {
        lastFrame: initFrame,
        lastIndex: 0,
        value: createTypedArray('float32', arrLen)
      };
      this.addEffect = addEffect;
    }

    function getProp(elem, data, type, mult, container) {
      var p;

      if (!data.k.length) {
        p = new ValueProperty(elem, data, mult, container);
      } else if (typeof data.k[0] === 'number') {
        p = new MultiDimensionalProperty(elem, data, mult, container);
      } else {
        switch (type) {
          case 0:
            p = new KeyframedValueProperty(elem, data, mult, container);
            break;

          case 1:
            p = new KeyframedMultidimensionalProperty(elem, data, mult, container);
            break;

          default:
            break;
        }
      }

      if (p.effectsSequence.length) {
        container.addDynamicProperty(p);
      }

      return p;
    }

    var ob = {
      getProp: getProp
    };
    return ob;
  }();

  function DynamicPropertyContainer() {}

  DynamicPropertyContainer.prototype = {
    addDynamicProperty: function addDynamicProperty(prop) {
      if (this.dynamicProperties.indexOf(prop) === -1) {
        this.dynamicProperties.push(prop);
        this.container.addDynamicProperty(this);
        this._isAnimated = true;
      }
    },
    iterateDynamicProperties: function iterateDynamicProperties() {
      this._mdf = false;
      var i;
      var len = this.dynamicProperties.length;

      for (i = 0; i < len; i += 1) {
        this.dynamicProperties[i].getValue();

        if (this.dynamicProperties[i]._mdf) {
          this._mdf = true;
        }
      }
    },
    initDynamicPropertyContainer: function initDynamicPropertyContainer(container) {
      this.container = container;
      this.dynamicProperties = [];
      this._mdf = false;
      this._isAnimated = false;
    }
  };

  var pointPool = function () {
    function create() {
      return createTypedArray('float32', 2);
    }

    return poolFactory(8, create);
  }();

  function ShapePath() {
    this.c = false;
    this._length = 0;
    this._maxLength = 8;
    this.v = createSizedArray(this._maxLength);
    this.o = createSizedArray(this._maxLength);
    this.i = createSizedArray(this._maxLength);
  }

  ShapePath.prototype.setPathData = function (closed, len) {
    this.c = closed;
    this.setLength(len);
    var i = 0;

    while (i < len) {
      this.v[i] = pointPool.newElement();
      this.o[i] = pointPool.newElement();
      this.i[i] = pointPool.newElement();
      i += 1;
    }
  };

  ShapePath.prototype.setLength = function (len) {
    while (this._maxLength < len) {
      this.doubleArrayLength();
    }

    this._length = len;
  };

  ShapePath.prototype.doubleArrayLength = function () {
    this.v = this.v.concat(createSizedArray(this._maxLength));
    this.i = this.i.concat(createSizedArray(this._maxLength));
    this.o = this.o.concat(createSizedArray(this._maxLength));
    this._maxLength *= 2;
  };

  ShapePath.prototype.setXYAt = function (x, y, type, pos, replace) {
    var arr;
    this._length = Math.max(this._length, pos + 1);

    if (this._length >= this._maxLength) {
      this.doubleArrayLength();
    }

    switch (type) {
      case 'v':
        arr = this.v;
        break;

      case 'i':
        arr = this.i;
        break;

      case 'o':
        arr = this.o;
        break;

      default:
        arr = [];
        break;
    }

    if (!arr[pos] || arr[pos] && !replace) {
      arr[pos] = pointPool.newElement();
    }

    arr[pos][0] = x;
    arr[pos][1] = y;
  };

  ShapePath.prototype.setTripleAt = function (vX, vY, oX, oY, iX, iY, pos, replace) {
    this.setXYAt(vX, vY, 'v', pos, replace);
    this.setXYAt(oX, oY, 'o', pos, replace);
    this.setXYAt(iX, iY, 'i', pos, replace);
  };

  ShapePath.prototype.reverse = function () {
    var newPath = new ShapePath();
    newPath.setPathData(this.c, this._length);
    var vertices = this.v;
    var outPoints = this.o;
    var inPoints = this.i;
    var init = 0;

    if (this.c) {
      newPath.setTripleAt(vertices[0][0], vertices[0][1], inPoints[0][0], inPoints[0][1], outPoints[0][0], outPoints[0][1], 0, false);
      init = 1;
    }

    var cnt = this._length - 1;
    var len = this._length;
    var i;

    for (i = init; i < len; i += 1) {
      newPath.setTripleAt(vertices[cnt][0], vertices[cnt][1], inPoints[cnt][0], inPoints[cnt][1], outPoints[cnt][0], outPoints[cnt][1], i, false);
      cnt -= 1;
    }

    return newPath;
  };

  var shapePool = function () {
    function create() {
      return new ShapePath();
    }

    function release(shapePath) {
      var len = shapePath._length;
      var i;

      for (i = 0; i < len; i += 1) {
        pointPool.release(shapePath.v[i]);
        pointPool.release(shapePath.i[i]);
        pointPool.release(shapePath.o[i]);
        shapePath.v[i] = null;
        shapePath.i[i] = null;
        shapePath.o[i] = null;
      }

      shapePath._length = 0;
      shapePath.c = false;
    }

    function clone(shape) {
      var cloned = factory.newElement();
      var i;
      var len = shape._length === undefined ? shape.v.length : shape._length;
      cloned.setLength(len);
      cloned.c = shape.c;

      for (i = 0; i < len; i += 1) {
        cloned.setTripleAt(shape.v[i][0], shape.v[i][1], shape.o[i][0], shape.o[i][1], shape.i[i][0], shape.i[i][1], i);
      }

      return cloned;
    }

    var factory = poolFactory(4, create, release);
    factory.clone = clone;
    return factory;
  }();

  function ShapeCollection() {
    this._length = 0;
    this._maxLength = 4;
    this.shapes = createSizedArray(this._maxLength);
  }

  ShapeCollection.prototype.addShape = function (shapeData) {
    if (this._length === this._maxLength) {
      this.shapes = this.shapes.concat(createSizedArray(this._maxLength));
      this._maxLength *= 2;
    }

    this.shapes[this._length] = shapeData;
    this._length += 1;
  };

  ShapeCollection.prototype.releaseShapes = function () {
    var i;

    for (i = 0; i < this._length; i += 1) {
      shapePool.release(this.shapes[i]);
    }

    this._length = 0;
  };

  var shapeCollectionPool = function () {
    var ob = {
      newShapeCollection: newShapeCollection,
      release: release
    };
    var _length = 0;
    var _maxLength = 4;
    var pool = createSizedArray(_maxLength);

    function newShapeCollection() {
      var shapeCollection;

      if (_length) {
        _length -= 1;
        shapeCollection = pool[_length];
      } else {
        shapeCollection = new ShapeCollection();
      }

      return shapeCollection;
    }

    function release(shapeCollection) {
      var i;
      var len = shapeCollection._length;

      for (i = 0; i < len; i += 1) {
        shapePool.release(shapeCollection.shapes[i]);
      }

      shapeCollection._length = 0;

      if (_length === _maxLength) {
        pool = pooling["double"](pool);
        _maxLength *= 2;
      }

      pool[_length] = shapeCollection;
      _length += 1;
    }

    return ob;
  }();

  var ShapePropertyFactory = function () {
    var initFrame = -999999;

    function interpolateShape(frameNum, previousValue, caching) {
      var iterationIndex = caching.lastIndex;
      var keyPropS;
      var keyPropE;
      var isHold;
      var j;
      var k;
      var jLen;
      var kLen;
      var perc;
      var vertexValue;
      var kf = this.keyframes;

      if (frameNum < kf[0].t - this.offsetTime) {
        keyPropS = kf[0].s[0];
        isHold = true;
        iterationIndex = 0;
      } else if (frameNum >= kf[kf.length - 1].t - this.offsetTime) {
        keyPropS = kf[kf.length - 1].s ? kf[kf.length - 1].s[0] : kf[kf.length - 2].e[0];
        /* if(kf[kf.length - 1].s){
                  keyPropS = kf[kf.length - 1].s[0];
              }else{
                  keyPropS = kf[kf.length - 2].e[0];
              } */

        isHold = true;
      } else {
        var i = iterationIndex;
        var len = kf.length - 1;
        var flag = true;
        var keyData;
        var nextKeyData;
        var keyframeMetadata;

        while (flag) {
          keyData = kf[i];
          nextKeyData = kf[i + 1];

          if (nextKeyData.t - this.offsetTime > frameNum) {
            break;
          }

          if (i < len - 1) {
            i += 1;
          } else {
            flag = false;
          }
        }

        keyframeMetadata = this.keyframesMetadata[i] || {};
        isHold = keyData.h === 1;
        iterationIndex = i;

        if (!isHold) {
          if (frameNum >= nextKeyData.t - this.offsetTime) {
            perc = 1;
          } else if (frameNum < keyData.t - this.offsetTime) {
            perc = 0;
          } else {
            var fnc;

            if (keyframeMetadata.__fnct) {
              fnc = keyframeMetadata.__fnct;
            } else {
              fnc = BezierFactory.getBezierEasing(keyData.o.x, keyData.o.y, keyData.i.x, keyData.i.y).get;
              keyframeMetadata.__fnct = fnc;
            }

            perc = fnc((frameNum - (keyData.t - this.offsetTime)) / (nextKeyData.t - this.offsetTime - (keyData.t - this.offsetTime)));
          }

          keyPropE = nextKeyData.s ? nextKeyData.s[0] : keyData.e[0];
        }

        keyPropS = keyData.s[0];
      }

      jLen = previousValue._length;
      kLen = keyPropS.i[0].length;
      caching.lastIndex = iterationIndex;

      for (j = 0; j < jLen; j += 1) {
        for (k = 0; k < kLen; k += 1) {
          vertexValue = isHold ? keyPropS.i[j][k] : keyPropS.i[j][k] + (keyPropE.i[j][k] - keyPropS.i[j][k]) * perc;
          previousValue.i[j][k] = vertexValue;
          vertexValue = isHold ? keyPropS.o[j][k] : keyPropS.o[j][k] + (keyPropE.o[j][k] - keyPropS.o[j][k]) * perc;
          previousValue.o[j][k] = vertexValue;
          vertexValue = isHold ? keyPropS.v[j][k] : keyPropS.v[j][k] + (keyPropE.v[j][k] - keyPropS.v[j][k]) * perc;
          previousValue.v[j][k] = vertexValue;
        }
      }
    }

    function interpolateShapeCurrentTime() {
      var frameNum = this.comp.renderedFrame - this.offsetTime;
      var initTime = this.keyframes[0].t - this.offsetTime;
      var endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
      var lastFrame = this._caching.lastFrame;

      if (!(lastFrame !== initFrame && (lastFrame < initTime && frameNum < initTime || lastFrame > endTime && frameNum > endTime))) {
        /// /
        this._caching.lastIndex = lastFrame < frameNum ? this._caching.lastIndex : 0;
        this.interpolateShape(frameNum, this.pv, this._caching); /// /
      }

      this._caching.lastFrame = frameNum;
      return this.pv;
    }

    function resetShape() {
      this.paths = this.localShapeCollection;
    }

    function shapesEqual(shape1, shape2) {
      if (shape1._length !== shape2._length || shape1.c !== shape2.c) {
        return false;
      }

      var i;
      var len = shape1._length;

      for (i = 0; i < len; i += 1) {
        if (shape1.v[i][0] !== shape2.v[i][0] || shape1.v[i][1] !== shape2.v[i][1] || shape1.o[i][0] !== shape2.o[i][0] || shape1.o[i][1] !== shape2.o[i][1] || shape1.i[i][0] !== shape2.i[i][0] || shape1.i[i][1] !== shape2.i[i][1]) {
          return false;
        }
      }

      return true;
    }

    function setVValue(newPath) {
      if (!shapesEqual(this.v, newPath)) {
        this.v = shapePool.clone(newPath);
        this.localShapeCollection.releaseShapes();
        this.localShapeCollection.addShape(this.v);
        this._mdf = true;
        this.paths = this.localShapeCollection;
      }
    }

    function processEffectsSequence() {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }

      if (!this.effectsSequence.length) {
        this._mdf = false;
        return;
      }

      if (this.lock) {
        this.setVValue(this.pv);
        return;
      }

      this.lock = true;
      this._mdf = false;
      var finalValue;

      if (this.kf) {
        finalValue = this.pv;
      } else if (this.data.ks) {
        finalValue = this.data.ks.k;
      } else {
        finalValue = this.data.pt.k;
      }

      var i;
      var len = this.effectsSequence.length;

      for (i = 0; i < len; i += 1) {
        finalValue = this.effectsSequence[i](finalValue);
      }

      this.setVValue(finalValue);
      this.lock = false;
      this.frameId = this.elem.globalData.frameId;
    }

    function ShapeProperty(elem, data, type) {
      this.propType = 'shape';
      this.comp = elem.comp;
      this.container = elem;
      this.elem = elem;
      this.data = data;
      this.k = false;
      this.kf = false;
      this._mdf = false;
      var pathData = type === 3 ? data.pt.k : data.ks.k;
      this.v = shapePool.clone(pathData);
      this.pv = shapePool.clone(this.v);
      this.localShapeCollection = shapeCollectionPool.newShapeCollection();
      this.paths = this.localShapeCollection;
      this.paths.addShape(this.v);
      this.reset = resetShape;
      this.effectsSequence = [];
    }

    function addEffect(effectFunction) {
      this.effectsSequence.push(effectFunction);
      this.container.addDynamicProperty(this);
    }

    ShapeProperty.prototype.interpolateShape = interpolateShape;
    ShapeProperty.prototype.getValue = processEffectsSequence;
    ShapeProperty.prototype.setVValue = setVValue;
    ShapeProperty.prototype.addEffect = addEffect;

    function KeyframedShapeProperty(elem, data, type) {
      this.propType = 'shape';
      this.comp = elem.comp;
      this.elem = elem;
      this.container = elem;
      this.offsetTime = elem.data.st;
      this.keyframes = type === 3 ? data.pt.k : data.ks.k;
      this.keyframesMetadata = [];
      this.k = true;
      this.kf = true;
      var len = this.keyframes[0].s[0].i.length;
      this.v = shapePool.newElement();
      this.v.setPathData(this.keyframes[0].s[0].c, len);
      this.pv = shapePool.clone(this.v);
      this.localShapeCollection = shapeCollectionPool.newShapeCollection();
      this.paths = this.localShapeCollection;
      this.paths.addShape(this.v);
      this.lastFrame = initFrame;
      this.reset = resetShape;
      this._caching = {
        lastFrame: initFrame,
        lastIndex: 0
      };
      this.effectsSequence = [interpolateShapeCurrentTime.bind(this)];
    }

    KeyframedShapeProperty.prototype.getValue = processEffectsSequence;
    KeyframedShapeProperty.prototype.interpolateShape = interpolateShape;
    KeyframedShapeProperty.prototype.setVValue = setVValue;
    KeyframedShapeProperty.prototype.addEffect = addEffect;

    var EllShapeProperty = function () {
      var cPoint = roundCorner;

      function EllShapePropertyFactory(elem, data) {
        this.v = shapePool.newElement();
        this.v.setPathData(true, 4);
        this.localShapeCollection = shapeCollectionPool.newShapeCollection();
        this.paths = this.localShapeCollection;
        this.localShapeCollection.addShape(this.v);
        this.d = data.d;
        this.elem = elem;
        this.comp = elem.comp;
        this.frameId = -1;
        this.initDynamicPropertyContainer(elem);
        this.p = PropertyFactory.getProp(elem, data.p, 1, 0, this);
        this.s = PropertyFactory.getProp(elem, data.s, 1, 0, this);

        if (this.dynamicProperties.length) {
          this.k = true;
        } else {
          this.k = false;
          this.convertEllToPath();
        }
      }

      EllShapePropertyFactory.prototype = {
        reset: resetShape,
        getValue: function getValue() {
          if (this.elem.globalData.frameId === this.frameId) {
            return;
          }

          this.frameId = this.elem.globalData.frameId;
          this.iterateDynamicProperties();

          if (this._mdf) {
            this.convertEllToPath();
          }
        },
        convertEllToPath: function convertEllToPath() {
          var p0 = this.p.v[0];
          var p1 = this.p.v[1];
          var s0 = this.s.v[0] / 2;
          var s1 = this.s.v[1] / 2;

          var _cw = this.d !== 3;

          var _v = this.v;
          _v.v[0][0] = p0;
          _v.v[0][1] = p1 - s1;
          _v.v[1][0] = _cw ? p0 + s0 : p0 - s0;
          _v.v[1][1] = p1;
          _v.v[2][0] = p0;
          _v.v[2][1] = p1 + s1;
          _v.v[3][0] = _cw ? p0 - s0 : p0 + s0;
          _v.v[3][1] = p1;
          _v.i[0][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
          _v.i[0][1] = p1 - s1;
          _v.i[1][0] = _cw ? p0 + s0 : p0 - s0;
          _v.i[1][1] = p1 - s1 * cPoint;
          _v.i[2][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
          _v.i[2][1] = p1 + s1;
          _v.i[3][0] = _cw ? p0 - s0 : p0 + s0;
          _v.i[3][1] = p1 + s1 * cPoint;
          _v.o[0][0] = _cw ? p0 + s0 * cPoint : p0 - s0 * cPoint;
          _v.o[0][1] = p1 - s1;
          _v.o[1][0] = _cw ? p0 + s0 : p0 - s0;
          _v.o[1][1] = p1 + s1 * cPoint;
          _v.o[2][0] = _cw ? p0 - s0 * cPoint : p0 + s0 * cPoint;
          _v.o[2][1] = p1 + s1;
          _v.o[3][0] = _cw ? p0 - s0 : p0 + s0;
          _v.o[3][1] = p1 - s1 * cPoint;
        }
      };
      extendPrototype([DynamicPropertyContainer], EllShapePropertyFactory);
      return EllShapePropertyFactory;
    }();

    var StarShapeProperty = function () {
      function StarShapePropertyFactory(elem, data) {
        this.v = shapePool.newElement();
        this.v.setPathData(true, 0);
        this.elem = elem;
        this.comp = elem.comp;
        this.data = data;
        this.frameId = -1;
        this.d = data.d;
        this.initDynamicPropertyContainer(elem);

        if (data.sy === 1) {
          this.ir = PropertyFactory.getProp(elem, data.ir, 0, 0, this);
          this.is = PropertyFactory.getProp(elem, data.is, 0, 0.01, this);
          this.convertToPath = this.convertStarToPath;
        } else {
          this.convertToPath = this.convertPolygonToPath;
        }

        this.pt = PropertyFactory.getProp(elem, data.pt, 0, 0, this);
        this.p = PropertyFactory.getProp(elem, data.p, 1, 0, this);
        this.r = PropertyFactory.getProp(elem, data.r, 0, degToRads, this);
        this.or = PropertyFactory.getProp(elem, data.or, 0, 0, this);
        this.os = PropertyFactory.getProp(elem, data.os, 0, 0.01, this);
        this.localShapeCollection = shapeCollectionPool.newShapeCollection();
        this.localShapeCollection.addShape(this.v);
        this.paths = this.localShapeCollection;

        if (this.dynamicProperties.length) {
          this.k = true;
        } else {
          this.k = false;
          this.convertToPath();
        }
      }

      StarShapePropertyFactory.prototype = {
        reset: resetShape,
        getValue: function getValue() {
          if (this.elem.globalData.frameId === this.frameId) {
            return;
          }

          this.frameId = this.elem.globalData.frameId;
          this.iterateDynamicProperties();

          if (this._mdf) {
            this.convertToPath();
          }
        },
        convertStarToPath: function convertStarToPath() {
          var numPts = Math.floor(this.pt.v) * 2;
          var angle = Math.PI * 2 / numPts;
          /* this.v.v.length = numPts;
                  this.v.i.length = numPts;
                  this.v.o.length = numPts; */

          var longFlag = true;
          var longRad = this.or.v;
          var shortRad = this.ir.v;
          var longRound = this.os.v;
          var shortRound = this.is.v;
          var longPerimSegment = 2 * Math.PI * longRad / (numPts * 2);
          var shortPerimSegment = 2 * Math.PI * shortRad / (numPts * 2);
          var i;
          var rad;
          var roundness;
          var perimSegment;
          var currentAng = -Math.PI / 2;
          currentAng += this.r.v;
          var dir = this.data.d === 3 ? -1 : 1;
          this.v._length = 0;

          for (i = 0; i < numPts; i += 1) {
            rad = longFlag ? longRad : shortRad;
            roundness = longFlag ? longRound : shortRound;
            perimSegment = longFlag ? longPerimSegment : shortPerimSegment;
            var x = rad * Math.cos(currentAng);
            var y = rad * Math.sin(currentAng);
            var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
            var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
            x += +this.p.v[0];
            y += +this.p.v[1];
            this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);
            /* this.v.v[i] = [x,y];
                      this.v.i[i] = [x+ox*perimSegment*roundness*dir,y+oy*perimSegment*roundness*dir];
                      this.v.o[i] = [x-ox*perimSegment*roundness*dir,y-oy*perimSegment*roundness*dir];
                      this.v._length = numPts; */

            longFlag = !longFlag;
            currentAng += angle * dir;
          }
        },
        convertPolygonToPath: function convertPolygonToPath() {
          var numPts = Math.floor(this.pt.v);
          var angle = Math.PI * 2 / numPts;
          var rad = this.or.v;
          var roundness = this.os.v;
          var perimSegment = 2 * Math.PI * rad / (numPts * 4);
          var i;
          var currentAng = -Math.PI * 0.5;
          var dir = this.data.d === 3 ? -1 : 1;
          currentAng += this.r.v;
          this.v._length = 0;

          for (i = 0; i < numPts; i += 1) {
            var x = rad * Math.cos(currentAng);
            var y = rad * Math.sin(currentAng);
            var ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y);
            var oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y);
            x += +this.p.v[0];
            y += +this.p.v[1];
            this.v.setTripleAt(x, y, x - ox * perimSegment * roundness * dir, y - oy * perimSegment * roundness * dir, x + ox * perimSegment * roundness * dir, y + oy * perimSegment * roundness * dir, i, true);
            currentAng += angle * dir;
          }

          this.paths.length = 0;
          this.paths[0] = this.v;
        }
      };
      extendPrototype([DynamicPropertyContainer], StarShapePropertyFactory);
      return StarShapePropertyFactory;
    }();

    var RectShapeProperty = function () {
      function RectShapePropertyFactory(elem, data) {
        this.v = shapePool.newElement();
        this.v.c = true;
        this.localShapeCollection = shapeCollectionPool.newShapeCollection();
        this.localShapeCollection.addShape(this.v);
        this.paths = this.localShapeCollection;
        this.elem = elem;
        this.comp = elem.comp;
        this.frameId = -1;
        this.d = data.d;
        this.initDynamicPropertyContainer(elem);
        this.p = PropertyFactory.getProp(elem, data.p, 1, 0, this);
        this.s = PropertyFactory.getProp(elem, data.s, 1, 0, this);
        this.r = PropertyFactory.getProp(elem, data.r, 0, 0, this);

        if (this.dynamicProperties.length) {
          this.k = true;
        } else {
          this.k = false;
          this.convertRectToPath();
        }
      }

      RectShapePropertyFactory.prototype = {
        convertRectToPath: function convertRectToPath() {
          var p0 = this.p.v[0];
          var p1 = this.p.v[1];
          var v0 = this.s.v[0] / 2;
          var v1 = this.s.v[1] / 2;
          var round = bmMin(v0, v1, this.r.v);
          var cPoint = round * (1 - roundCorner);
          this.v._length = 0;

          if (this.d === 2 || this.d === 1) {
            this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, 0, true);
            this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, p0 + v0, p1 + v1 - round, 1, true);

            if (round !== 0) {
              this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, 2, true);
              this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0 + round, p1 + v1, 3, true);
              this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, 4, true);
              this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1 + round, 5, true);
              this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, 6, true);
              this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, p0 + v0 - round, p1 - v1, 7, true);
            } else {
              this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0 + cPoint, p1 + v1, p0 - v0, p1 + v1, 2);
              this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0, p1 - v1 + cPoint, p0 - v0, p1 - v1, 3);
            }
          } else {
            this.v.setTripleAt(p0 + v0, p1 - v1 + round, p0 + v0, p1 - v1 + cPoint, p0 + v0, p1 - v1 + round, 0, true);

            if (round !== 0) {
              this.v.setTripleAt(p0 + v0 - round, p1 - v1, p0 + v0 - round, p1 - v1, p0 + v0 - cPoint, p1 - v1, 1, true);
              this.v.setTripleAt(p0 - v0 + round, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0 + round, p1 - v1, 2, true);
              this.v.setTripleAt(p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + round, p0 - v0, p1 - v1 + cPoint, 3, true);
              this.v.setTripleAt(p0 - v0, p1 + v1 - round, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1 - round, 4, true);
              this.v.setTripleAt(p0 - v0 + round, p1 + v1, p0 - v0 + round, p1 + v1, p0 - v0 + cPoint, p1 + v1, 5, true);
              this.v.setTripleAt(p0 + v0 - round, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0 - round, p1 + v1, 6, true);
              this.v.setTripleAt(p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - round, p0 + v0, p1 + v1 - cPoint, 7, true);
            } else {
              this.v.setTripleAt(p0 - v0, p1 - v1, p0 - v0 + cPoint, p1 - v1, p0 - v0, p1 - v1, 1, true);
              this.v.setTripleAt(p0 - v0, p1 + v1, p0 - v0, p1 + v1 - cPoint, p0 - v0, p1 + v1, 2, true);
              this.v.setTripleAt(p0 + v0, p1 + v1, p0 + v0 - cPoint, p1 + v1, p0 + v0, p1 + v1, 3, true);
            }
          }
        },
        getValue: function getValue() {
          if (this.elem.globalData.frameId === this.frameId) {
            return;
          }

          this.frameId = this.elem.globalData.frameId;
          this.iterateDynamicProperties();

          if (this._mdf) {
            this.convertRectToPath();
          }
        },
        reset: resetShape
      };
      extendPrototype([DynamicPropertyContainer], RectShapePropertyFactory);
      return RectShapePropertyFactory;
    }();

    function getShapeProp(elem, data, type) {
      var prop;

      if (type === 3 || type === 4) {
        var dataProp = type === 3 ? data.pt : data.ks;
        var keys = dataProp.k;

        if (keys.length) {
          prop = new KeyframedShapeProperty(elem, data, type);
        } else {
          prop = new ShapeProperty(elem, data, type);
        }
      } else if (type === 5) {
        prop = new RectShapeProperty(elem, data);
      } else if (type === 6) {
        prop = new EllShapeProperty(elem, data);
      } else if (type === 7) {
        prop = new StarShapeProperty(elem, data);
      }

      if (prop.k) {
        elem.addDynamicProperty(prop);
      }

      return prop;
    }

    function getConstructorFunction() {
      return ShapeProperty;
    }

    function getKeyframedConstructorFunction() {
      return KeyframedShapeProperty;
    }

    var ob = {};
    ob.getShapeProp = getShapeProp;
    ob.getConstructorFunction = getConstructorFunction;
    ob.getKeyframedConstructorFunction = getKeyframedConstructorFunction;
    return ob;
  }();

  /*!
   Transformation Matrix v2.0
   (c) Epistemex 2014-2015
   www.epistemex.com
   By Ken Fyrstenberg
   Contributions by leeoniya.
   License: MIT, header required.
   */

  /**
   * 2D transformation matrix object initialized with identity matrix.
   *
   * The matrix can synchronize a canvas context by supplying the context
   * as an argument, or later apply current absolute transform to an
   * existing context.
   *
   * All values are handled as floating point values.
   *
   * @param {CanvasRenderingContext2D} [context] - Optional context to sync with Matrix
   * @prop {number} a - scale x
   * @prop {number} b - shear y
   * @prop {number} c - shear x
   * @prop {number} d - scale y
   * @prop {number} e - translate x
   * @prop {number} f - translate y
   * @prop {CanvasRenderingContext2D|null} [context=null] - set or get current canvas context
   * @constructor
   */

  var Matrix = function () {
    var _cos = Math.cos;
    var _sin = Math.sin;
    var _tan = Math.tan;
    var _rnd = Math.round;

    function reset() {
      this.props[0] = 1;
      this.props[1] = 0;
      this.props[2] = 0;
      this.props[3] = 0;
      this.props[4] = 0;
      this.props[5] = 1;
      this.props[6] = 0;
      this.props[7] = 0;
      this.props[8] = 0;
      this.props[9] = 0;
      this.props[10] = 1;
      this.props[11] = 0;
      this.props[12] = 0;
      this.props[13] = 0;
      this.props[14] = 0;
      this.props[15] = 1;
      return this;
    }

    function rotate(angle) {
      if (angle === 0) {
        return this;
      }

      var mCos = _cos(angle);

      var mSin = _sin(angle);

      return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    function rotateX(angle) {
      if (angle === 0) {
        return this;
      }

      var mCos = _cos(angle);

      var mSin = _sin(angle);

      return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1);
    }

    function rotateY(angle) {
      if (angle === 0) {
        return this;
      }

      var mCos = _cos(angle);

      var mSin = _sin(angle);

      return this._t(mCos, 0, mSin, 0, 0, 1, 0, 0, -mSin, 0, mCos, 0, 0, 0, 0, 1);
    }

    function rotateZ(angle) {
      if (angle === 0) {
        return this;
      }

      var mCos = _cos(angle);

      var mSin = _sin(angle);

      return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }

    function shear(sx, sy) {
      return this._t(1, sy, sx, 1, 0, 0);
    }

    function skew(ax, ay) {
      return this.shear(_tan(ax), _tan(ay));
    }

    function skewFromAxis(ax, angle) {
      var mCos = _cos(angle);

      var mSin = _sin(angle);

      return this._t(mCos, mSin, 0, 0, -mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, _tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); // return this._t(mCos, mSin, -mSin, mCos, 0, 0)._t(1, 0, _tan(ax), 1, 0, 0)._t(mCos, -mSin, mSin, mCos, 0, 0);
    }

    function scale(sx, sy, sz) {
      if (!sz && sz !== 0) {
        sz = 1;
      }

      if (sx === 1 && sy === 1 && sz === 1) {
        return this;
      }

      return this._t(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
    }

    function setTransform(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      this.props[0] = a;
      this.props[1] = b;
      this.props[2] = c;
      this.props[3] = d;
      this.props[4] = e;
      this.props[5] = f;
      this.props[6] = g;
      this.props[7] = h;
      this.props[8] = i;
      this.props[9] = j;
      this.props[10] = k;
      this.props[11] = l;
      this.props[12] = m;
      this.props[13] = n;
      this.props[14] = o;
      this.props[15] = p;
      return this;
    }

    function translate(tx, ty, tz) {
      tz = tz || 0;

      if (tx !== 0 || ty !== 0 || tz !== 0) {
        return this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
      }

      return this;
    }

    function transform(a2, b2, c2, d2, e2, f2, g2, h2, i2, j2, k2, l2, m2, n2, o2, p2) {
      var _p = this.props;

      if (a2 === 1 && b2 === 0 && c2 === 0 && d2 === 0 && e2 === 0 && f2 === 1 && g2 === 0 && h2 === 0 && i2 === 0 && j2 === 0 && k2 === 1 && l2 === 0) {
        // NOTE: commenting this condition because TurboFan deoptimizes code when present
        // if(m2 !== 0 || n2 !== 0 || o2 !== 0){
        _p[12] = _p[12] * a2 + _p[15] * m2;
        _p[13] = _p[13] * f2 + _p[15] * n2;
        _p[14] = _p[14] * k2 + _p[15] * o2;
        _p[15] *= p2; // }

        this._identityCalculated = false;
        return this;
      }

      var a1 = _p[0];
      var b1 = _p[1];
      var c1 = _p[2];
      var d1 = _p[3];
      var e1 = _p[4];
      var f1 = _p[5];
      var g1 = _p[6];
      var h1 = _p[7];
      var i1 = _p[8];
      var j1 = _p[9];
      var k1 = _p[10];
      var l1 = _p[11];
      var m1 = _p[12];
      var n1 = _p[13];
      var o1 = _p[14];
      var p1 = _p[15];
      /* matrix order (canvas compatible):
           * ace
           * bdf
           * 001
           */

      _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2;
      _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2;
      _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2;
      _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2;
      _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2;
      _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2;
      _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2;
      _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2;
      _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2;
      _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2;
      _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2;
      _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2;
      _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2;
      _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2;
      _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2;
      _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2;
      this._identityCalculated = false;
      return this;
    }

    function isIdentity() {
      if (!this._identityCalculated) {
        this._identity = !(this.props[0] !== 1 || this.props[1] !== 0 || this.props[2] !== 0 || this.props[3] !== 0 || this.props[4] !== 0 || this.props[5] !== 1 || this.props[6] !== 0 || this.props[7] !== 0 || this.props[8] !== 0 || this.props[9] !== 0 || this.props[10] !== 1 || this.props[11] !== 0 || this.props[12] !== 0 || this.props[13] !== 0 || this.props[14] !== 0 || this.props[15] !== 1);
        this._identityCalculated = true;
      }

      return this._identity;
    }

    function equals(matr) {
      var i = 0;

      while (i < 16) {
        if (matr.props[i] !== this.props[i]) {
          return false;
        }

        i += 1;
      }

      return true;
    }

    function clone(matr) {
      var i;

      for (i = 0; i < 16; i += 1) {
        matr.props[i] = this.props[i];
      }

      return matr;
    }

    function cloneFromProps(props) {
      var i;

      for (i = 0; i < 16; i += 1) {
        this.props[i] = props[i];
      }
    }

    function applyToPoint(x, y, z) {
      return {
        x: x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12],
        y: x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13],
        z: x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]
      };
      /* return {
           x: x * me.a + y * me.c + me.e,
           y: x * me.b + y * me.d + me.f
           }; */
    }

    function applyToX(x, y, z) {
      return x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12];
    }

    function applyToY(x, y, z) {
      return x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13];
    }

    function applyToZ(x, y, z) {
      return x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14];
    }

    function getInverseMatrix() {
      var determinant = this.props[0] * this.props[5] - this.props[1] * this.props[4];
      var a = this.props[5] / determinant;
      var b = -this.props[1] / determinant;
      var c = -this.props[4] / determinant;
      var d = this.props[0] / determinant;
      var e = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / determinant;
      var f = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / determinant;
      var inverseMatrix = new Matrix();
      inverseMatrix.props[0] = a;
      inverseMatrix.props[1] = b;
      inverseMatrix.props[4] = c;
      inverseMatrix.props[5] = d;
      inverseMatrix.props[12] = e;
      inverseMatrix.props[13] = f;
      return inverseMatrix;
    }

    function inversePoint(pt) {
      var inverseMatrix = this.getInverseMatrix();
      return inverseMatrix.applyToPointArray(pt[0], pt[1], pt[2] || 0);
    }

    function inversePoints(pts) {
      var i;
      var len = pts.length;
      var retPts = [];

      for (i = 0; i < len; i += 1) {
        retPts[i] = inversePoint(pts[i]);
      }

      return retPts;
    }

    function applyToTriplePoints(pt1, pt2, pt3) {
      var arr = createTypedArray('float32', 6);

      if (this.isIdentity()) {
        arr[0] = pt1[0];
        arr[1] = pt1[1];
        arr[2] = pt2[0];
        arr[3] = pt2[1];
        arr[4] = pt3[0];
        arr[5] = pt3[1];
      } else {
        var p0 = this.props[0];
        var p1 = this.props[1];
        var p4 = this.props[4];
        var p5 = this.props[5];
        var p12 = this.props[12];
        var p13 = this.props[13];
        arr[0] = pt1[0] * p0 + pt1[1] * p4 + p12;
        arr[1] = pt1[0] * p1 + pt1[1] * p5 + p13;
        arr[2] = pt2[0] * p0 + pt2[1] * p4 + p12;
        arr[3] = pt2[0] * p1 + pt2[1] * p5 + p13;
        arr[4] = pt3[0] * p0 + pt3[1] * p4 + p12;
        arr[5] = pt3[0] * p1 + pt3[1] * p5 + p13;
      }

      return arr;
    }

    function applyToPointArray(x, y, z) {
      var arr;

      if (this.isIdentity()) {
        arr = [x, y, z];
      } else {
        arr = [x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12], x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13], x * this.props[2] + y * this.props[6] + z * this.props[10] + this.props[14]];
      }

      return arr;
    }

    function applyToPointStringified(x, y) {
      if (this.isIdentity()) {
        return x + ',' + y;
      }

      var _p = this.props;
      return Math.round((x * _p[0] + y * _p[4] + _p[12]) * 100) / 100 + ',' + Math.round((x * _p[1] + y * _p[5] + _p[13]) * 100) / 100;
    }

    function toCSS() {
      // Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.

      /* if(this.isIdentity()) {
              return '';
          } */
      var i = 0;
      var props = this.props;
      var cssValue = 'matrix3d(';
      var v = 10000;

      while (i < 16) {
        cssValue += _rnd(props[i] * v) / v;
        cssValue += i === 15 ? ')' : ',';
        i += 1;
      }

      return cssValue;
    }

    function roundMatrixProperty(val) {
      var v = 10000;

      if (val < 0.000001 && val > 0 || val > -0.000001 && val < 0) {
        return _rnd(val * v) / v;
      }

      return val;
    }

    function to2dCSS() {
      // Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.

      /* if(this.isIdentity()) {
              return '';
          } */
      var props = this.props;

      var _a = roundMatrixProperty(props[0]);

      var _b = roundMatrixProperty(props[1]);

      var _c = roundMatrixProperty(props[4]);

      var _d = roundMatrixProperty(props[5]);

      var _e = roundMatrixProperty(props[12]);

      var _f = roundMatrixProperty(props[13]);

      return 'matrix(' + _a + ',' + _b + ',' + _c + ',' + _d + ',' + _e + ',' + _f + ')';
    }

    return function () {
      this.reset = reset;
      this.rotate = rotate;
      this.rotateX = rotateX;
      this.rotateY = rotateY;
      this.rotateZ = rotateZ;
      this.skew = skew;
      this.skewFromAxis = skewFromAxis;
      this.shear = shear;
      this.scale = scale;
      this.setTransform = setTransform;
      this.translate = translate;
      this.transform = transform;
      this.applyToPoint = applyToPoint;
      this.applyToX = applyToX;
      this.applyToY = applyToY;
      this.applyToZ = applyToZ;
      this.applyToPointArray = applyToPointArray;
      this.applyToTriplePoints = applyToTriplePoints;
      this.applyToPointStringified = applyToPointStringified;
      this.toCSS = toCSS;
      this.to2dCSS = to2dCSS;
      this.clone = clone;
      this.cloneFromProps = cloneFromProps;
      this.equals = equals;
      this.inversePoints = inversePoints;
      this.inversePoint = inversePoint;
      this.getInverseMatrix = getInverseMatrix;
      this._t = this.transform;
      this.isIdentity = isIdentity;
      this._identity = true;
      this._identityCalculated = false;
      this.props = createTypedArray('float32', 16);
      this.reset();
    };
  }();

  function _typeof$3(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }
  var lottie = {};
  var standalone = '__[STANDALONE]__';
  var animationData = '__[ANIMATIONDATA]__';
  var renderer = '';

  function setLocation(href) {
    setLocationHref(href);
  }

  function searchAnimations() {
    if (standalone === true) {
      animationManager.searchAnimations(animationData, standalone, renderer);
    } else {
      animationManager.searchAnimations();
    }
  }

  function setSubframeRendering(flag) {
    setSubframeEnabled(flag);
  }

  function setPrefix(prefix) {
    setIdPrefix(prefix);
  }

  function loadAnimation(params) {
    if (standalone === true) {
      params.animationData = JSON.parse(animationData);
    }

    return animationManager.loadAnimation(params);
  }

  function setQuality(value) {
    if (typeof value === 'string') {
      switch (value) {
        case 'high':
          setDefaultCurveSegments(200);
          break;

        default:
        case 'medium':
          setDefaultCurveSegments(50);
          break;

        case 'low':
          setDefaultCurveSegments(10);
          break;
      }
    } else if (!isNaN(value) && value > 1) {
      setDefaultCurveSegments(value);
    }

    if (getDefaultCurveSegments() >= 50) {
      roundValues(false);
    } else {
      roundValues(true);
    }
  }

  function inBrowser() {
    return typeof navigator !== 'undefined';
  }

  function installPlugin(type, plugin) {
    if (type === 'expressions') {
      setExpressionsPlugin(plugin);
    }
  }

  function getFactory(name) {
    switch (name) {
      case 'propertyFactory':
        return PropertyFactory;

      case 'shapePropertyFactory':
        return ShapePropertyFactory;

      case 'matrix':
        return Matrix;

      default:
        return null;
    }
  }

  lottie.play = animationManager.play;
  lottie.pause = animationManager.pause;
  lottie.setLocationHref = setLocation;
  lottie.togglePause = animationManager.togglePause;
  lottie.setSpeed = animationManager.setSpeed;
  lottie.setDirection = animationManager.setDirection;
  lottie.stop = animationManager.stop;
  lottie.searchAnimations = searchAnimations;
  lottie.registerAnimation = animationManager.registerAnimation;
  lottie.loadAnimation = loadAnimation;
  lottie.setSubframeRendering = setSubframeRendering;
  lottie.resize = animationManager.resize; // lottie.start = start;

  lottie.goToAndStop = animationManager.goToAndStop;
  lottie.destroy = animationManager.destroy;
  lottie.setQuality = setQuality;
  lottie.inBrowser = inBrowser;
  lottie.installPlugin = installPlugin;
  lottie.freeze = animationManager.freeze;
  lottie.unfreeze = animationManager.unfreeze;
  lottie.setVolume = animationManager.setVolume;
  lottie.mute = animationManager.mute;
  lottie.unmute = animationManager.unmute;
  lottie.getRegisteredAnimations = animationManager.getRegisteredAnimations;
  lottie.useWebWorker = setWebWorker;
  lottie.setIDPrefix = setPrefix;
  lottie.__getFactory = getFactory;
  lottie.version = '5.9.1';

  function checkReady() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      searchAnimations();
    }
  }

  function getQueryVariable(variable) {
    var vars = queryString.split('&');

    for (var i = 0; i < vars.length; i += 1) {
      var pair = vars[i].split('=');

      if (decodeURIComponent(pair[0]) == variable) {
        // eslint-disable-line eqeqeq
        return decodeURIComponent(pair[1]);
      }
    }

    return null;
  }

  var queryString;

  if (standalone) {
    var scripts = document.getElementsByTagName('script');
    var index = scripts.length - 1;
    var myScript = scripts[index] || {
      src: ''
    };
    queryString = myScript.src.replace(/^[^\?]+\??/, ''); // eslint-disable-line no-useless-escape

    renderer = getQueryVariable('renderer');
  }

  var readyStateCheckInterval = setInterval(checkReady, 100); // this adds bodymovin to the window object for backwards compatibility

  try {
    if (!((typeof exports === "undefined" ? "undefined" : _typeof$3(exports)) === 'object' && typeof module !== 'undefined') && !(typeof define === 'function' && define.amd) // eslint-disable-line no-undef
    ) {
      window.bodymovin = lottie;
    }
  } catch (err) {//
  }

  var ShapeModifiers = function () {
    var ob = {};
    var modifiers = {};
    ob.registerModifier = registerModifier;
    ob.getModifier = getModifier;

    function registerModifier(nm, factory) {
      if (!modifiers[nm]) {
        modifiers[nm] = factory;
      }
    }

    function getModifier(nm, elem, data) {
      return new modifiers[nm](elem, data);
    }

    return ob;
  }();

  function ShapeModifier() {}

  ShapeModifier.prototype.initModifierProperties = function () {};

  ShapeModifier.prototype.addShapeToModifier = function () {};

  ShapeModifier.prototype.addShape = function (data) {
    if (!this.closed) {
      // Adding shape to dynamic properties. It covers the case where a shape has no effects applied, to reset it's _mdf state on every tick.
      data.sh.container.addDynamicProperty(data.sh);
      var shapeData = {
        shape: data.sh,
        data: data,
        localShapeCollection: shapeCollectionPool.newShapeCollection()
      };
      this.shapes.push(shapeData);
      this.addShapeToModifier(shapeData);

      if (this._isAnimated) {
        data.setAsAnimated();
      }
    }
  };

  ShapeModifier.prototype.init = function (elem, data) {
    this.shapes = [];
    this.elem = elem;
    this.initDynamicPropertyContainer(elem);
    this.initModifierProperties(elem, data);
    this.frameId = initialDefaultFrame;
    this.closed = false;
    this.k = false;

    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.getValue(true);
    }
  };

  ShapeModifier.prototype.processKeys = function () {
    if (this.elem.globalData.frameId === this.frameId) {
      return;
    }

    this.frameId = this.elem.globalData.frameId;
    this.iterateDynamicProperties();
  };

  extendPrototype([DynamicPropertyContainer], ShapeModifier);

  function TrimModifier() {}

  extendPrototype([ShapeModifier], TrimModifier);

  TrimModifier.prototype.initModifierProperties = function (elem, data) {
    this.s = PropertyFactory.getProp(elem, data.s, 0, 0.01, this);
    this.e = PropertyFactory.getProp(elem, data.e, 0, 0.01, this);
    this.o = PropertyFactory.getProp(elem, data.o, 0, 0, this);
    this.sValue = 0;
    this.eValue = 0;
    this.getValue = this.processKeys;
    this.m = data.m;
    this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
  };

  TrimModifier.prototype.addShapeToModifier = function (shapeData) {
    shapeData.pathsData = [];
  };

  TrimModifier.prototype.calculateShapeEdges = function (s, e, shapeLength, addedLength, totalModifierLength) {
    var segments = [];

    if (e <= 1) {
      segments.push({
        s: s,
        e: e
      });
    } else if (s >= 1) {
      segments.push({
        s: s - 1,
        e: e - 1
      });
    } else {
      segments.push({
        s: s,
        e: 1
      });
      segments.push({
        s: 0,
        e: e - 1
      });
    }

    var shapeSegments = [];
    var i;
    var len = segments.length;
    var segmentOb;

    for (i = 0; i < len; i += 1) {
      segmentOb = segments[i];

      if (!(segmentOb.e * totalModifierLength < addedLength || segmentOb.s * totalModifierLength > addedLength + shapeLength)) {
        var shapeS;
        var shapeE;

        if (segmentOb.s * totalModifierLength <= addedLength) {
          shapeS = 0;
        } else {
          shapeS = (segmentOb.s * totalModifierLength - addedLength) / shapeLength;
        }

        if (segmentOb.e * totalModifierLength >= addedLength + shapeLength) {
          shapeE = 1;
        } else {
          shapeE = (segmentOb.e * totalModifierLength - addedLength) / shapeLength;
        }

        shapeSegments.push([shapeS, shapeE]);
      }
    }

    if (!shapeSegments.length) {
      shapeSegments.push([0, 0]);
    }

    return shapeSegments;
  };

  TrimModifier.prototype.releasePathsData = function (pathsData) {
    var i;
    var len = pathsData.length;

    for (i = 0; i < len; i += 1) {
      segmentsLengthPool.release(pathsData[i]);
    }

    pathsData.length = 0;
    return pathsData;
  };

  TrimModifier.prototype.processShapes = function (_isFirstFrame) {
    var s;
    var e;

    if (this._mdf || _isFirstFrame) {
      var o = this.o.v % 360 / 360;

      if (o < 0) {
        o += 1;
      }

      if (this.s.v > 1) {
        s = 1 + o;
      } else if (this.s.v < 0) {
        s = 0 + o;
      } else {
        s = this.s.v + o;
      }

      if (this.e.v > 1) {
        e = 1 + o;
      } else if (this.e.v < 0) {
        e = 0 + o;
      } else {
        e = this.e.v + o;
      }

      if (s > e) {
        var _s = s;
        s = e;
        e = _s;
      }

      s = Math.round(s * 10000) * 0.0001;
      e = Math.round(e * 10000) * 0.0001;
      this.sValue = s;
      this.eValue = e;
    } else {
      s = this.sValue;
      e = this.eValue;
    }

    var shapePaths;
    var i;
    var len = this.shapes.length;
    var j;
    var jLen;
    var pathsData;
    var pathData;
    var totalShapeLength;
    var totalModifierLength = 0;

    if (e === s) {
      for (i = 0; i < len; i += 1) {
        this.shapes[i].localShapeCollection.releaseShapes();
        this.shapes[i].shape._mdf = true;
        this.shapes[i].shape.paths = this.shapes[i].localShapeCollection;

        if (this._mdf) {
          this.shapes[i].pathsData.length = 0;
        }
      }
    } else if (!(e === 1 && s === 0 || e === 0 && s === 1)) {
      var segments = [];
      var shapeData;
      var localShapeCollection;

      for (i = 0; i < len; i += 1) {
        shapeData = this.shapes[i]; // if shape hasn't changed and trim properties haven't changed, cached previous path can be used

        if (!shapeData.shape._mdf && !this._mdf && !_isFirstFrame && this.m !== 2) {
          shapeData.shape.paths = shapeData.localShapeCollection;
        } else {
          shapePaths = shapeData.shape.paths;
          jLen = shapePaths._length;
          totalShapeLength = 0;

          if (!shapeData.shape._mdf && shapeData.pathsData.length) {
            totalShapeLength = shapeData.totalShapeLength;
          } else {
            pathsData = this.releasePathsData(shapeData.pathsData);

            for (j = 0; j < jLen; j += 1) {
              pathData = bez.getSegmentsLength(shapePaths.shapes[j]);
              pathsData.push(pathData);
              totalShapeLength += pathData.totalLength;
            }

            shapeData.totalShapeLength = totalShapeLength;
            shapeData.pathsData = pathsData;
          }

          totalModifierLength += totalShapeLength;
          shapeData.shape._mdf = true;
        }
      }

      var shapeS = s;
      var shapeE = e;
      var addedLength = 0;
      var edges;

      for (i = len - 1; i >= 0; i -= 1) {
        shapeData = this.shapes[i];

        if (shapeData.shape._mdf) {
          localShapeCollection = shapeData.localShapeCollection;
          localShapeCollection.releaseShapes(); // if m === 2 means paths are trimmed individually so edges need to be found for this specific shape relative to whoel group

          if (this.m === 2 && len > 1) {
            edges = this.calculateShapeEdges(s, e, shapeData.totalShapeLength, addedLength, totalModifierLength);
            addedLength += shapeData.totalShapeLength;
          } else {
            edges = [[shapeS, shapeE]];
          }

          jLen = edges.length;

          for (j = 0; j < jLen; j += 1) {
            shapeS = edges[j][0];
            shapeE = edges[j][1];
            segments.length = 0;

            if (shapeE <= 1) {
              segments.push({
                s: shapeData.totalShapeLength * shapeS,
                e: shapeData.totalShapeLength * shapeE
              });
            } else if (shapeS >= 1) {
              segments.push({
                s: shapeData.totalShapeLength * (shapeS - 1),
                e: shapeData.totalShapeLength * (shapeE - 1)
              });
            } else {
              segments.push({
                s: shapeData.totalShapeLength * shapeS,
                e: shapeData.totalShapeLength
              });
              segments.push({
                s: 0,
                e: shapeData.totalShapeLength * (shapeE - 1)
              });
            }

            var newShapesData = this.addShapes(shapeData, segments[0]);

            if (segments[0].s !== segments[0].e) {
              if (segments.length > 1) {
                var lastShapeInCollection = shapeData.shape.paths.shapes[shapeData.shape.paths._length - 1];

                if (lastShapeInCollection.c) {
                  var lastShape = newShapesData.pop();
                  this.addPaths(newShapesData, localShapeCollection);
                  newShapesData = this.addShapes(shapeData, segments[1], lastShape);
                } else {
                  this.addPaths(newShapesData, localShapeCollection);
                  newShapesData = this.addShapes(shapeData, segments[1]);
                }
              }

              this.addPaths(newShapesData, localShapeCollection);
            }
          }

          shapeData.shape.paths = localShapeCollection;
        }
      }
    } else if (this._mdf) {
      for (i = 0; i < len; i += 1) {
        // Releasign Trim Cached paths data when no trim applied in case shapes are modified inbetween.
        // Don't remove this even if it's losing cached info.
        this.shapes[i].pathsData.length = 0;
        this.shapes[i].shape._mdf = true;
      }
    }
  };

  TrimModifier.prototype.addPaths = function (newPaths, localShapeCollection) {
    var i;
    var len = newPaths.length;

    for (i = 0; i < len; i += 1) {
      localShapeCollection.addShape(newPaths[i]);
    }
  };

  TrimModifier.prototype.addSegment = function (pt1, pt2, pt3, pt4, shapePath, pos, newShape) {
    shapePath.setXYAt(pt2[0], pt2[1], 'o', pos);
    shapePath.setXYAt(pt3[0], pt3[1], 'i', pos + 1);

    if (newShape) {
      shapePath.setXYAt(pt1[0], pt1[1], 'v', pos);
    }

    shapePath.setXYAt(pt4[0], pt4[1], 'v', pos + 1);
  };

  TrimModifier.prototype.addSegmentFromArray = function (points, shapePath, pos, newShape) {
    shapePath.setXYAt(points[1], points[5], 'o', pos);
    shapePath.setXYAt(points[2], points[6], 'i', pos + 1);

    if (newShape) {
      shapePath.setXYAt(points[0], points[4], 'v', pos);
    }

    shapePath.setXYAt(points[3], points[7], 'v', pos + 1);
  };

  TrimModifier.prototype.addShapes = function (shapeData, shapeSegment, shapePath) {
    var pathsData = shapeData.pathsData;
    var shapePaths = shapeData.shape.paths.shapes;
    var i;
    var len = shapeData.shape.paths._length;
    var j;
    var jLen;
    var addedLength = 0;
    var currentLengthData;
    var segmentCount;
    var lengths;
    var segment;
    var shapes = [];
    var initPos;
    var newShape = true;

    if (!shapePath) {
      shapePath = shapePool.newElement();
      segmentCount = 0;
      initPos = 0;
    } else {
      segmentCount = shapePath._length;
      initPos = shapePath._length;
    }

    shapes.push(shapePath);

    for (i = 0; i < len; i += 1) {
      lengths = pathsData[i].lengths;
      shapePath.c = shapePaths[i].c;
      jLen = shapePaths[i].c ? lengths.length : lengths.length + 1;

      for (j = 1; j < jLen; j += 1) {
        currentLengthData = lengths[j - 1];

        if (addedLength + currentLengthData.addedLength < shapeSegment.s) {
          addedLength += currentLengthData.addedLength;
          shapePath.c = false;
        } else if (addedLength > shapeSegment.e) {
          shapePath.c = false;
          break;
        } else {
          if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + currentLengthData.addedLength) {
            this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[j], shapePaths[i].v[j], shapePath, segmentCount, newShape);
            newShape = false;
          } else {
            segment = bez.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[j], shapePaths[i].o[j - 1], shapePaths[i].i[j], (shapeSegment.s - addedLength) / currentLengthData.addedLength, (shapeSegment.e - addedLength) / currentLengthData.addedLength, lengths[j - 1]);
            this.addSegmentFromArray(segment, shapePath, segmentCount, newShape); // this.addSegment(segment.pt1, segment.pt3, segment.pt4, segment.pt2, shapePath, segmentCount, newShape);

            newShape = false;
            shapePath.c = false;
          }

          addedLength += currentLengthData.addedLength;
          segmentCount += 1;
        }
      }

      if (shapePaths[i].c && lengths.length) {
        currentLengthData = lengths[j - 1];

        if (addedLength <= shapeSegment.e) {
          var segmentLength = lengths[j - 1].addedLength;

          if (shapeSegment.s <= addedLength && shapeSegment.e >= addedLength + segmentLength) {
            this.addSegment(shapePaths[i].v[j - 1], shapePaths[i].o[j - 1], shapePaths[i].i[0], shapePaths[i].v[0], shapePath, segmentCount, newShape);
            newShape = false;
          } else {
            segment = bez.getNewSegment(shapePaths[i].v[j - 1], shapePaths[i].v[0], shapePaths[i].o[j - 1], shapePaths[i].i[0], (shapeSegment.s - addedLength) / segmentLength, (shapeSegment.e - addedLength) / segmentLength, lengths[j - 1]);
            this.addSegmentFromArray(segment, shapePath, segmentCount, newShape); // this.addSegment(segment.pt1, segment.pt3, segment.pt4, segment.pt2, shapePath, segmentCount, newShape);

            newShape = false;
            shapePath.c = false;
          }
        } else {
          shapePath.c = false;
        }

        addedLength += currentLengthData.addedLength;
        segmentCount += 1;
      }

      if (shapePath._length) {
        shapePath.setXYAt(shapePath.v[initPos][0], shapePath.v[initPos][1], 'i', initPos);
        shapePath.setXYAt(shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1], 'o', shapePath._length - 1);
      }

      if (addedLength > shapeSegment.e) {
        break;
      }

      if (i < len - 1) {
        shapePath = shapePool.newElement();
        newShape = true;
        shapes.push(shapePath);
        segmentCount = 0;
      }
    }

    return shapes;
  };

  function PuckerAndBloatModifier() {}

  extendPrototype([ShapeModifier], PuckerAndBloatModifier);

  PuckerAndBloatModifier.prototype.initModifierProperties = function (elem, data) {
    this.getValue = this.processKeys;
    this.amount = PropertyFactory.getProp(elem, data.a, 0, null, this);
    this._isAnimated = !!this.amount.effectsSequence.length;
  };

  PuckerAndBloatModifier.prototype.processPath = function (path, amount) {
    var percent = amount / 100;
    var centerPoint = [0, 0];
    var pathLength = path._length;
    var i = 0;

    for (i = 0; i < pathLength; i += 1) {
      centerPoint[0] += path.v[i][0];
      centerPoint[1] += path.v[i][1];
    }

    centerPoint[0] /= pathLength;
    centerPoint[1] /= pathLength;
    var clonedPath = shapePool.newElement();
    clonedPath.c = path.c;
    var vX;
    var vY;
    var oX;
    var oY;
    var iX;
    var iY;

    for (i = 0; i < pathLength; i += 1) {
      vX = path.v[i][0] + (centerPoint[0] - path.v[i][0]) * percent;
      vY = path.v[i][1] + (centerPoint[1] - path.v[i][1]) * percent;
      oX = path.o[i][0] + (centerPoint[0] - path.o[i][0]) * -percent;
      oY = path.o[i][1] + (centerPoint[1] - path.o[i][1]) * -percent;
      iX = path.i[i][0] + (centerPoint[0] - path.i[i][0]) * -percent;
      iY = path.i[i][1] + (centerPoint[1] - path.i[i][1]) * -percent;
      clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, i);
    }

    return clonedPath;
  };

  PuckerAndBloatModifier.prototype.processShapes = function (_isFirstFrame) {
    var shapePaths;
    var i;
    var len = this.shapes.length;
    var j;
    var jLen;
    var amount = this.amount.v;

    if (amount !== 0) {
      var shapeData;
      var localShapeCollection;

      for (i = 0; i < len; i += 1) {
        shapeData = this.shapes[i];
        localShapeCollection = shapeData.localShapeCollection;

        if (!(!shapeData.shape._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection.releaseShapes();
          shapeData.shape._mdf = true;
          shapePaths = shapeData.shape.paths.shapes;
          jLen = shapeData.shape.paths._length;

          for (j = 0; j < jLen; j += 1) {
            localShapeCollection.addShape(this.processPath(shapePaths[j], amount));
          }
        }

        shapeData.shape.paths = shapeData.localShapeCollection;
      }
    }

    if (!this.dynamicProperties.length) {
      this._mdf = false;
    }
  };

  var TransformPropertyFactory = function () {
    var defaultVector = [0, 0];

    function applyToMatrix(mat) {
      var _mdf = this._mdf;
      this.iterateDynamicProperties();
      this._mdf = this._mdf || _mdf;

      if (this.a) {
        mat.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
      }

      if (this.s) {
        mat.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
      }

      if (this.sk) {
        mat.skewFromAxis(-this.sk.v, this.sa.v);
      }

      if (this.r) {
        mat.rotate(-this.r.v);
      } else {
        mat.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
      }

      if (this.data.p.s) {
        if (this.data.p.z) {
          mat.translate(this.px.v, this.py.v, -this.pz.v);
        } else {
          mat.translate(this.px.v, this.py.v, 0);
        }
      } else {
        mat.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
      }
    }

    function processKeys(forceRender) {
      if (this.elem.globalData.frameId === this.frameId) {
        return;
      }

      if (this._isDirty) {
        this.precalculateMatrix();
        this._isDirty = false;
      }

      this.iterateDynamicProperties();

      if (this._mdf || forceRender) {
        var frameRate;
        this.v.cloneFromProps(this.pre.props);

        if (this.appliedTransformations < 1) {
          this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
        }

        if (this.appliedTransformations < 2) {
          this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
        }

        if (this.sk && this.appliedTransformations < 3) {
          this.v.skewFromAxis(-this.sk.v, this.sa.v);
        }

        if (this.r && this.appliedTransformations < 4) {
          this.v.rotate(-this.r.v);
        } else if (!this.r && this.appliedTransformations < 4) {
          this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
        }

        if (this.autoOriented) {
          var v1;
          var v2;
          frameRate = this.elem.globalData.frameRate;

          if (this.p && this.p.keyframes && this.p.getValueAtTime) {
            if (this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t) {
              v1 = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / frameRate, 0);
              v2 = this.p.getValueAtTime(this.p.keyframes[0].t / frameRate, 0);
            } else if (this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t) {
              v1 = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / frameRate, 0);
              v2 = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - 0.05) / frameRate, 0);
            } else {
              v1 = this.p.pv;
              v2 = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - 0.01) / frameRate, this.p.offsetTime);
            }
          } else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
            v1 = [];
            v2 = [];
            var px = this.px;
            var py = this.py;

            if (px._caching.lastFrame + px.offsetTime <= px.keyframes[0].t) {
              v1[0] = px.getValueAtTime((px.keyframes[0].t + 0.01) / frameRate, 0);
              v1[1] = py.getValueAtTime((py.keyframes[0].t + 0.01) / frameRate, 0);
              v2[0] = px.getValueAtTime(px.keyframes[0].t / frameRate, 0);
              v2[1] = py.getValueAtTime(py.keyframes[0].t / frameRate, 0);
            } else if (px._caching.lastFrame + px.offsetTime >= px.keyframes[px.keyframes.length - 1].t) {
              v1[0] = px.getValueAtTime(px.keyframes[px.keyframes.length - 1].t / frameRate, 0);
              v1[1] = py.getValueAtTime(py.keyframes[py.keyframes.length - 1].t / frameRate, 0);
              v2[0] = px.getValueAtTime((px.keyframes[px.keyframes.length - 1].t - 0.01) / frameRate, 0);
              v2[1] = py.getValueAtTime((py.keyframes[py.keyframes.length - 1].t - 0.01) / frameRate, 0);
            } else {
              v1 = [px.pv, py.pv];
              v2[0] = px.getValueAtTime((px._caching.lastFrame + px.offsetTime - 0.01) / frameRate, px.offsetTime);
              v2[1] = py.getValueAtTime((py._caching.lastFrame + py.offsetTime - 0.01) / frameRate, py.offsetTime);
            }
          } else {
            v2 = defaultVector;
            v1 = v2;
          }

          this.v.rotate(-Math.atan2(v1[1] - v2[1], v1[0] - v2[0]));
        }

        if (this.data.p && this.data.p.s) {
          if (this.data.p.z) {
            this.v.translate(this.px.v, this.py.v, -this.pz.v);
          } else {
            this.v.translate(this.px.v, this.py.v, 0);
          }
        } else {
          this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
        }
      }

      this.frameId = this.elem.globalData.frameId;
    }

    function precalculateMatrix() {
      if (!this.a.k) {
        this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]);
        this.appliedTransformations = 1;
      } else {
        return;
      }

      if (!this.s.effectsSequence.length) {
        this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]);
        this.appliedTransformations = 2;
      } else {
        return;
      }

      if (this.sk) {
        if (!this.sk.effectsSequence.length && !this.sa.effectsSequence.length) {
          this.pre.skewFromAxis(-this.sk.v, this.sa.v);
          this.appliedTransformations = 3;
        } else {
          return;
        }
      }

      if (this.r) {
        if (!this.r.effectsSequence.length) {
          this.pre.rotate(-this.r.v);
          this.appliedTransformations = 4;
        }
      } else if (!this.rz.effectsSequence.length && !this.ry.effectsSequence.length && !this.rx.effectsSequence.length && !this.or.effectsSequence.length) {
        this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]);
        this.appliedTransformations = 4;
      }
    }

    function autoOrient() {//
      // var prevP = this.getValueAtTime();
    }

    function addDynamicProperty(prop) {
      this._addDynamicProperty(prop);

      this.elem.addDynamicProperty(prop);
      this._isDirty = true;
    }

    function TransformProperty(elem, data, container) {
      this.elem = elem;
      this.frameId = -1;
      this.propType = 'transform';
      this.data = data;
      this.v = new Matrix(); // Precalculated matrix with non animated properties

      this.pre = new Matrix();
      this.appliedTransformations = 0;
      this.initDynamicPropertyContainer(container || elem);

      if (data.p && data.p.s) {
        this.px = PropertyFactory.getProp(elem, data.p.x, 0, 0, this);
        this.py = PropertyFactory.getProp(elem, data.p.y, 0, 0, this);

        if (data.p.z) {
          this.pz = PropertyFactory.getProp(elem, data.p.z, 0, 0, this);
        }
      } else {
        this.p = PropertyFactory.getProp(elem, data.p || {
          k: [0, 0, 0]
        }, 1, 0, this);
      }

      if (data.rx) {
        this.rx = PropertyFactory.getProp(elem, data.rx, 0, degToRads, this);
        this.ry = PropertyFactory.getProp(elem, data.ry, 0, degToRads, this);
        this.rz = PropertyFactory.getProp(elem, data.rz, 0, degToRads, this);

        if (data.or.k[0].ti) {
          var i;
          var len = data.or.k.length;

          for (i = 0; i < len; i += 1) {
            data.or.k[i].to = null;
            data.or.k[i].ti = null;
          }
        }

        this.or = PropertyFactory.getProp(elem, data.or, 1, degToRads, this); // sh Indicates it needs to be capped between -180 and 180

        this.or.sh = true;
      } else {
        this.r = PropertyFactory.getProp(elem, data.r || {
          k: 0
        }, 0, degToRads, this);
      }

      if (data.sk) {
        this.sk = PropertyFactory.getProp(elem, data.sk, 0, degToRads, this);
        this.sa = PropertyFactory.getProp(elem, data.sa, 0, degToRads, this);
      }

      this.a = PropertyFactory.getProp(elem, data.a || {
        k: [0, 0, 0]
      }, 1, 0, this);
      this.s = PropertyFactory.getProp(elem, data.s || {
        k: [100, 100, 100]
      }, 1, 0.01, this); // Opacity is not part of the transform properties, that's why it won't use this.dynamicProperties. That way transforms won't get updated if opacity changes.

      if (data.o) {
        this.o = PropertyFactory.getProp(elem, data.o, 0, 0.01, elem);
      } else {
        this.o = {
          _mdf: false,
          v: 1
        };
      }

      this._isDirty = true;

      if (!this.dynamicProperties.length) {
        this.getValue(true);
      }
    }

    TransformProperty.prototype = {
      applyToMatrix: applyToMatrix,
      getValue: processKeys,
      precalculateMatrix: precalculateMatrix,
      autoOrient: autoOrient
    };
    extendPrototype([DynamicPropertyContainer], TransformProperty);
    TransformProperty.prototype.addDynamicProperty = addDynamicProperty;
    TransformProperty.prototype._addDynamicProperty = DynamicPropertyContainer.prototype.addDynamicProperty;

    function getTransformProperty(elem, data, container) {
      return new TransformProperty(elem, data, container);
    }

    return {
      getTransformProperty: getTransformProperty
    };
  }();

  function RepeaterModifier() {}

  extendPrototype([ShapeModifier], RepeaterModifier);

  RepeaterModifier.prototype.initModifierProperties = function (elem, data) {
    this.getValue = this.processKeys;
    this.c = PropertyFactory.getProp(elem, data.c, 0, null, this);
    this.o = PropertyFactory.getProp(elem, data.o, 0, null, this);
    this.tr = TransformPropertyFactory.getTransformProperty(elem, data.tr, this);
    this.so = PropertyFactory.getProp(elem, data.tr.so, 0, 0.01, this);
    this.eo = PropertyFactory.getProp(elem, data.tr.eo, 0, 0.01, this);
    this.data = data;

    if (!this.dynamicProperties.length) {
      this.getValue(true);
    }

    this._isAnimated = !!this.dynamicProperties.length;
    this.pMatrix = new Matrix();
    this.rMatrix = new Matrix();
    this.sMatrix = new Matrix();
    this.tMatrix = new Matrix();
    this.matrix = new Matrix();
  };

  RepeaterModifier.prototype.applyTransforms = function (pMatrix, rMatrix, sMatrix, transform, perc, inv) {
    var dir = inv ? -1 : 1;
    var scaleX = transform.s.v[0] + (1 - transform.s.v[0]) * (1 - perc);
    var scaleY = transform.s.v[1] + (1 - transform.s.v[1]) * (1 - perc);
    pMatrix.translate(transform.p.v[0] * dir * perc, transform.p.v[1] * dir * perc, transform.p.v[2]);
    rMatrix.translate(-transform.a.v[0], -transform.a.v[1], transform.a.v[2]);
    rMatrix.rotate(-transform.r.v * dir * perc);
    rMatrix.translate(transform.a.v[0], transform.a.v[1], transform.a.v[2]);
    sMatrix.translate(-transform.a.v[0], -transform.a.v[1], transform.a.v[2]);
    sMatrix.scale(inv ? 1 / scaleX : scaleX, inv ? 1 / scaleY : scaleY);
    sMatrix.translate(transform.a.v[0], transform.a.v[1], transform.a.v[2]);
  };

  RepeaterModifier.prototype.init = function (elem, arr, pos, elemsData) {
    this.elem = elem;
    this.arr = arr;
    this.pos = pos;
    this.elemsData = elemsData;
    this._currentCopies = 0;
    this._elements = [];
    this._groups = [];
    this.frameId = -1;
    this.initDynamicPropertyContainer(elem);
    this.initModifierProperties(elem, arr[pos]);

    while (pos > 0) {
      pos -= 1; // this._elements.unshift(arr.splice(pos,1)[0]);

      this._elements.unshift(arr[pos]);
    }

    if (this.dynamicProperties.length) {
      this.k = true;
    } else {
      this.getValue(true);
    }
  };

  RepeaterModifier.prototype.resetElements = function (elements) {
    var i;
    var len = elements.length;

    for (i = 0; i < len; i += 1) {
      elements[i]._processed = false;

      if (elements[i].ty === 'gr') {
        this.resetElements(elements[i].it);
      }
    }
  };

  RepeaterModifier.prototype.cloneElements = function (elements) {
    var newElements = JSON.parse(JSON.stringify(elements));
    this.resetElements(newElements);
    return newElements;
  };

  RepeaterModifier.prototype.changeGroupRender = function (elements, renderFlag) {
    var i;
    var len = elements.length;

    for (i = 0; i < len; i += 1) {
      elements[i]._render = renderFlag;

      if (elements[i].ty === 'gr') {
        this.changeGroupRender(elements[i].it, renderFlag);
      }
    }
  };

  RepeaterModifier.prototype.processShapes = function (_isFirstFrame) {
    var items;
    var itemsTransform;
    var i;
    var dir;
    var cont;
    var hasReloaded = false;

    if (this._mdf || _isFirstFrame) {
      var copies = Math.ceil(this.c.v);

      if (this._groups.length < copies) {
        while (this._groups.length < copies) {
          var group = {
            it: this.cloneElements(this._elements),
            ty: 'gr'
          };
          group.it.push({
            a: {
              a: 0,
              ix: 1,
              k: [0, 0]
            },
            nm: 'Transform',
            o: {
              a: 0,
              ix: 7,
              k: 100
            },
            p: {
              a: 0,
              ix: 2,
              k: [0, 0]
            },
            r: {
              a: 1,
              ix: 6,
              k: [{
                s: 0,
                e: 0,
                t: 0
              }, {
                s: 0,
                e: 0,
                t: 1
              }]
            },
            s: {
              a: 0,
              ix: 3,
              k: [100, 100]
            },
            sa: {
              a: 0,
              ix: 5,
              k: 0
            },
            sk: {
              a: 0,
              ix: 4,
              k: 0
            },
            ty: 'tr'
          });
          this.arr.splice(0, 0, group);

          this._groups.splice(0, 0, group);

          this._currentCopies += 1;
        }

        this.elem.reloadShapes();
        hasReloaded = true;
      }

      cont = 0;
      var renderFlag;

      for (i = 0; i <= this._groups.length - 1; i += 1) {
        renderFlag = cont < copies;
        this._groups[i]._render = renderFlag;
        this.changeGroupRender(this._groups[i].it, renderFlag);

        if (!renderFlag) {
          var elems = this.elemsData[i].it;
          var transformData = elems[elems.length - 1];

          if (transformData.transform.op.v !== 0) {
            transformData.transform.op._mdf = true;
            transformData.transform.op.v = 0;
          } else {
            transformData.transform.op._mdf = false;
          }
        }

        cont += 1;
      }

      this._currentCopies = copies; /// /

      var offset = this.o.v;
      var offsetModulo = offset % 1;
      var roundOffset = offset > 0 ? Math.floor(offset) : Math.ceil(offset);
      var pProps = this.pMatrix.props;
      var rProps = this.rMatrix.props;
      var sProps = this.sMatrix.props;
      this.pMatrix.reset();
      this.rMatrix.reset();
      this.sMatrix.reset();
      this.tMatrix.reset();
      this.matrix.reset();
      var iteration = 0;

      if (offset > 0) {
        while (iteration < roundOffset) {
          this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false);
          iteration += 1;
        }

        if (offsetModulo) {
          this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, offsetModulo, false);
          iteration += offsetModulo;
        }
      } else if (offset < 0) {
        while (iteration > roundOffset) {
          this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, true);
          iteration -= 1;
        }

        if (offsetModulo) {
          this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -offsetModulo, true);
          iteration -= offsetModulo;
        }
      }

      i = this.data.m === 1 ? 0 : this._currentCopies - 1;
      dir = this.data.m === 1 ? 1 : -1;
      cont = this._currentCopies;
      var j;
      var jLen;

      while (cont) {
        items = this.elemsData[i].it;
        itemsTransform = items[items.length - 1].transform.mProps.v.props;
        jLen = itemsTransform.length;
        items[items.length - 1].transform.mProps._mdf = true;
        items[items.length - 1].transform.op._mdf = true;
        items[items.length - 1].transform.op.v = this._currentCopies === 1 ? this.so.v : this.so.v + (this.eo.v - this.so.v) * (i / (this._currentCopies - 1));

        if (iteration !== 0) {
          if (i !== 0 && dir === 1 || i !== this._currentCopies - 1 && dir === -1) {
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, false);
          }

          this.matrix.transform(rProps[0], rProps[1], rProps[2], rProps[3], rProps[4], rProps[5], rProps[6], rProps[7], rProps[8], rProps[9], rProps[10], rProps[11], rProps[12], rProps[13], rProps[14], rProps[15]);
          this.matrix.transform(sProps[0], sProps[1], sProps[2], sProps[3], sProps[4], sProps[5], sProps[6], sProps[7], sProps[8], sProps[9], sProps[10], sProps[11], sProps[12], sProps[13], sProps[14], sProps[15]);
          this.matrix.transform(pProps[0], pProps[1], pProps[2], pProps[3], pProps[4], pProps[5], pProps[6], pProps[7], pProps[8], pProps[9], pProps[10], pProps[11], pProps[12], pProps[13], pProps[14], pProps[15]);

          for (j = 0; j < jLen; j += 1) {
            itemsTransform[j] = this.matrix.props[j];
          }

          this.matrix.reset();
        } else {
          this.matrix.reset();

          for (j = 0; j < jLen; j += 1) {
            itemsTransform[j] = this.matrix.props[j];
          }
        }

        iteration += 1;
        cont -= 1;
        i += dir;
      }
    } else {
      cont = this._currentCopies;
      i = 0;
      dir = 1;

      while (cont) {
        items = this.elemsData[i].it;
        itemsTransform = items[items.length - 1].transform.mProps.v.props;
        items[items.length - 1].transform.mProps._mdf = false;
        items[items.length - 1].transform.op._mdf = false;
        cont -= 1;
        i += dir;
      }
    }

    return hasReloaded;
  };

  RepeaterModifier.prototype.addShape = function () {};

  function RoundCornersModifier() {}

  extendPrototype([ShapeModifier], RoundCornersModifier);

  RoundCornersModifier.prototype.initModifierProperties = function (elem, data) {
    this.getValue = this.processKeys;
    this.rd = PropertyFactory.getProp(elem, data.r, 0, null, this);
    this._isAnimated = !!this.rd.effectsSequence.length;
  };

  RoundCornersModifier.prototype.processPath = function (path, round) {
    var clonedPath = shapePool.newElement();
    clonedPath.c = path.c;
    var i;
    var len = path._length;
    var currentV;
    var currentI;
    var currentO;
    var closerV;
    var distance;
    var newPosPerc;
    var index = 0;
    var vX;
    var vY;
    var oX;
    var oY;
    var iX;
    var iY;

    for (i = 0; i < len; i += 1) {
      currentV = path.v[i];
      currentO = path.o[i];
      currentI = path.i[i];

      if (currentV[0] === currentO[0] && currentV[1] === currentO[1] && currentV[0] === currentI[0] && currentV[1] === currentI[1]) {
        if ((i === 0 || i === len - 1) && !path.c) {
          clonedPath.setTripleAt(currentV[0], currentV[1], currentO[0], currentO[1], currentI[0], currentI[1], index);
          /* clonedPath.v[index] = currentV;
                  clonedPath.o[index] = currentO;
                  clonedPath.i[index] = currentI; */

          index += 1;
        } else {
          if (i === 0) {
            closerV = path.v[len - 1];
          } else {
            closerV = path.v[i - 1];
          }

          distance = Math.sqrt(Math.pow(currentV[0] - closerV[0], 2) + Math.pow(currentV[1] - closerV[1], 2));
          newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0;
          iX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc;
          vX = iX;
          iY = currentV[1] - (currentV[1] - closerV[1]) * newPosPerc;
          vY = iY;
          oX = vX - (vX - currentV[0]) * roundCorner;
          oY = vY - (vY - currentV[1]) * roundCorner;
          clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, index);
          index += 1;

          if (i === len - 1) {
            closerV = path.v[0];
          } else {
            closerV = path.v[i + 1];
          }

          distance = Math.sqrt(Math.pow(currentV[0] - closerV[0], 2) + Math.pow(currentV[1] - closerV[1], 2));
          newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0;
          oX = currentV[0] + (closerV[0] - currentV[0]) * newPosPerc;
          vX = oX;
          oY = currentV[1] + (closerV[1] - currentV[1]) * newPosPerc;
          vY = oY;
          iX = vX - (vX - currentV[0]) * roundCorner;
          iY = vY - (vY - currentV[1]) * roundCorner;
          clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, index);
          index += 1;
        }
      } else {
        clonedPath.setTripleAt(path.v[i][0], path.v[i][1], path.o[i][0], path.o[i][1], path.i[i][0], path.i[i][1], index);
        index += 1;
      }
    }

    return clonedPath;
  };

  RoundCornersModifier.prototype.processShapes = function (_isFirstFrame) {
    var shapePaths;
    var i;
    var len = this.shapes.length;
    var j;
    var jLen;
    var rd = this.rd.v;

    if (rd !== 0) {
      var shapeData;
      var localShapeCollection;

      for (i = 0; i < len; i += 1) {
        shapeData = this.shapes[i];
        localShapeCollection = shapeData.localShapeCollection;

        if (!(!shapeData.shape._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection.releaseShapes();
          shapeData.shape._mdf = true;
          shapePaths = shapeData.shape.paths.shapes;
          jLen = shapeData.shape.paths._length;

          for (j = 0; j < jLen; j += 1) {
            localShapeCollection.addShape(this.processPath(shapePaths[j], rd));
          }
        }

        shapeData.shape.paths = shapeData.localShapeCollection;
      }
    }

    if (!this.dynamicProperties.length) {
      this._mdf = false;
    }
  };

  function getFontProperties(fontData) {
    var styles = fontData.fStyle ? fontData.fStyle.split(' ') : [];
    var fWeight = 'normal';
    var fStyle = 'normal';
    var len = styles.length;
    var styleName;

    for (var i = 0; i < len; i += 1) {
      styleName = styles[i].toLowerCase();

      switch (styleName) {
        case 'italic':
          fStyle = 'italic';
          break;

        case 'bold':
          fWeight = '700';
          break;

        case 'black':
          fWeight = '900';
          break;

        case 'medium':
          fWeight = '500';
          break;

        case 'regular':
        case 'normal':
          fWeight = '400';
          break;

        case 'light':
        case 'thin':
          fWeight = '200';
          break;

        default:
          break;
      }
    }

    return {
      style: fStyle,
      weight: fontData.fWeight || fWeight
    };
  }

  var FontManager = function () {
    var maxWaitingTime = 5000;
    var emptyChar = {
      w: 0,
      size: 0,
      shapes: [],
      data: {
        shapes: []
      }
    };
    var combinedCharacters = []; // Hindi characters

    combinedCharacters = combinedCharacters.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);
    var surrogateModifiers = ['d83cdffb', 'd83cdffc', 'd83cdffd', 'd83cdffe', 'd83cdfff'];
    var zeroWidthJoiner = [65039, 8205];

    function trimFontOptions(font) {
      var familyArray = font.split(',');
      var i;
      var len = familyArray.length;
      var enabledFamilies = [];

      for (i = 0; i < len; i += 1) {
        if (familyArray[i] !== 'sans-serif' && familyArray[i] !== 'monospace') {
          enabledFamilies.push(familyArray[i]);
        }
      }

      return enabledFamilies.join(',');
    }

    function setUpNode(font, family) {
      var parentNode = createTag('span'); // Node is invisible to screen readers.

      parentNode.setAttribute('aria-hidden', true);
      parentNode.style.fontFamily = family;
      var node = createTag('span'); // Characters that vary significantly among different fonts

      node.innerText = 'giItT1WQy@!-/#'; // Visible - so we can measure it - but not on the screen

      parentNode.style.position = 'absolute';
      parentNode.style.left = '-10000px';
      parentNode.style.top = '-10000px'; // Large font size makes even subtle changes obvious

      parentNode.style.fontSize = '300px'; // Reset any font properties

      parentNode.style.fontVariant = 'normal';
      parentNode.style.fontStyle = 'normal';
      parentNode.style.fontWeight = 'normal';
      parentNode.style.letterSpacing = '0';
      parentNode.appendChild(node);
      document.body.appendChild(parentNode); // Remember width with no applied web font

      var width = node.offsetWidth;
      node.style.fontFamily = trimFontOptions(font) + ', ' + family;
      return {
        node: node,
        w: width,
        parent: parentNode
      };
    }

    function checkLoadedFonts() {
      var i;
      var len = this.fonts.length;
      var node;
      var w;
      var loadedCount = len;

      for (i = 0; i < len; i += 1) {
        if (this.fonts[i].loaded) {
          loadedCount -= 1;
        } else if (this.fonts[i].fOrigin === 'n' || this.fonts[i].origin === 0) {
          this.fonts[i].loaded = true;
        } else {
          node = this.fonts[i].monoCase.node;
          w = this.fonts[i].monoCase.w;

          if (node.offsetWidth !== w) {
            loadedCount -= 1;
            this.fonts[i].loaded = true;
          } else {
            node = this.fonts[i].sansCase.node;
            w = this.fonts[i].sansCase.w;

            if (node.offsetWidth !== w) {
              loadedCount -= 1;
              this.fonts[i].loaded = true;
            }
          }

          if (this.fonts[i].loaded) {
            this.fonts[i].sansCase.parent.parentNode.removeChild(this.fonts[i].sansCase.parent);
            this.fonts[i].monoCase.parent.parentNode.removeChild(this.fonts[i].monoCase.parent);
          }
        }
      }

      if (loadedCount !== 0 && Date.now() - this.initTime < maxWaitingTime) {
        setTimeout(this.checkLoadedFontsBinded, 20);
      } else {
        setTimeout(this.setIsLoadedBinded, 10);
      }
    }

    function createHelper(def, fontData) {
      var tHelper = createNS('text');
      tHelper.style.fontSize = '100px'; // tHelper.style.fontFamily = fontData.fFamily;

      var fontProps = getFontProperties(fontData);
      tHelper.setAttribute('font-family', fontData.fFamily);
      tHelper.setAttribute('font-style', fontProps.style);
      tHelper.setAttribute('font-weight', fontProps.weight);
      tHelper.textContent = '1';

      if (fontData.fClass) {
        tHelper.style.fontFamily = 'inherit';
        tHelper.setAttribute('class', fontData.fClass);
      } else {
        tHelper.style.fontFamily = fontData.fFamily;
      }

      def.appendChild(tHelper);
      var tCanvasHelper = createTag('canvas').getContext('2d');
      tCanvasHelper.font = fontData.fWeight + ' ' + fontData.fStyle + ' 100px ' + fontData.fFamily; // tCanvasHelper.font = ' 100px '+ fontData.fFamily;

      return tHelper;
    }

    function addFonts(fontData, defs) {
      if (!fontData) {
        this.isLoaded = true;
        return;
      }

      if (this.chars) {
        this.isLoaded = true;
        this.fonts = fontData.list;
        return;
      }

      var fontArr = fontData.list;
      var i;
      var len = fontArr.length;
      var _pendingFonts = len;

      for (i = 0; i < len; i += 1) {
        var shouldLoadFont = true;
        var loadedSelector;
        var j;
        fontArr[i].loaded = false;
        fontArr[i].monoCase = setUpNode(fontArr[i].fFamily, 'monospace');
        fontArr[i].sansCase = setUpNode(fontArr[i].fFamily, 'sans-serif');

        if (!fontArr[i].fPath) {
          fontArr[i].loaded = true;
          _pendingFonts -= 1;
        } else if (fontArr[i].fOrigin === 'p' || fontArr[i].origin === 3) {
          loadedSelector = document.querySelectorAll('style[f-forigin="p"][f-family="' + fontArr[i].fFamily + '"], style[f-origin="3"][f-family="' + fontArr[i].fFamily + '"]');

          if (loadedSelector.length > 0) {
            shouldLoadFont = false;
          }

          if (shouldLoadFont) {
            var s = createTag('style');
            s.setAttribute('f-forigin', fontArr[i].fOrigin);
            s.setAttribute('f-origin', fontArr[i].origin);
            s.setAttribute('f-family', fontArr[i].fFamily);
            s.type = 'text/css';
            s.innerText = '@font-face {font-family: ' + fontArr[i].fFamily + "; font-style: normal; src: url('" + fontArr[i].fPath + "');}";
            defs.appendChild(s);
          }
        } else if (fontArr[i].fOrigin === 'g' || fontArr[i].origin === 1) {
          loadedSelector = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]');

          for (j = 0; j < loadedSelector.length; j += 1) {
            if (loadedSelector[j].href.indexOf(fontArr[i].fPath) !== -1) {
              // Font is already loaded
              shouldLoadFont = false;
            }
          }

          if (shouldLoadFont) {
            var l = createTag('link');
            l.setAttribute('f-forigin', fontArr[i].fOrigin);
            l.setAttribute('f-origin', fontArr[i].origin);
            l.type = 'text/css';
            l.rel = 'stylesheet';
            l.href = fontArr[i].fPath;
            document.body.appendChild(l);
          }
        } else if (fontArr[i].fOrigin === 't' || fontArr[i].origin === 2) {
          loadedSelector = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]');

          for (j = 0; j < loadedSelector.length; j += 1) {
            if (fontArr[i].fPath === loadedSelector[j].src) {
              // Font is already loaded
              shouldLoadFont = false;
            }
          }

          if (shouldLoadFont) {
            var sc = createTag('link');
            sc.setAttribute('f-forigin', fontArr[i].fOrigin);
            sc.setAttribute('f-origin', fontArr[i].origin);
            sc.setAttribute('rel', 'stylesheet');
            sc.setAttribute('href', fontArr[i].fPath);
            defs.appendChild(sc);
          }
        }

        fontArr[i].helper = createHelper(defs, fontArr[i]);
        fontArr[i].cache = {};
        this.fonts.push(fontArr[i]);
      }

      if (_pendingFonts === 0) {
        this.isLoaded = true;
      } else {
        // On some cases even if the font is loaded, it won't load correctly when measuring text on canvas.
        // Adding this timeout seems to fix it
        setTimeout(this.checkLoadedFonts.bind(this), 100);
      }
    }

    function addChars(chars) {
      if (!chars) {
        return;
      }

      if (!this.chars) {
        this.chars = [];
      }

      var i;
      var len = chars.length;
      var j;
      var jLen = this.chars.length;
      var found;

      for (i = 0; i < len; i += 1) {
        j = 0;
        found = false;

        while (j < jLen) {
          if (this.chars[j].style === chars[i].style && this.chars[j].fFamily === chars[i].fFamily && this.chars[j].ch === chars[i].ch) {
            found = true;
          }

          j += 1;
        }

        if (!found) {
          this.chars.push(chars[i]);
          jLen += 1;
        }
      }
    }

    function getCharData(_char, style, font) {
      var i = 0;
      var len = this.chars.length;

      while (i < len) {
        if (this.chars[i].ch === _char && this.chars[i].style === style && this.chars[i].fFamily === font) {
          return this.chars[i];
        }

        i += 1;
      }

      if ((typeof _char === 'string' && _char.charCodeAt(0) !== 13 || !_char) && console && console.warn // eslint-disable-line no-console
      && !this._warned) {
        this._warned = true;
        console.warn('Missing character from exported characters list: ', _char, style, font); // eslint-disable-line no-console
      }

      return emptyChar;
    }

    function measureText(_char2, fontName, size) {
      var fontData = this.getFontByName(fontName);

      var index = _char2.charCodeAt(0);

      if (!fontData.cache[index + 1]) {
        var tHelper = fontData.helper; // Canvas version
        // fontData.cache[index] = tHelper.measureText(char).width / 100;
        // SVG version
        // console.log(tHelper.getBBox().width)

        if (_char2 === ' ') {
          tHelper.textContent = '|' + _char2 + '|';
          var doubleSize = tHelper.getComputedTextLength();
          tHelper.textContent = '||';
          var singleSize = tHelper.getComputedTextLength();
          fontData.cache[index + 1] = (doubleSize - singleSize) / 100;
        } else {
          tHelper.textContent = _char2;
          fontData.cache[index + 1] = tHelper.getComputedTextLength() / 100;
        }
      }

      return fontData.cache[index + 1] * size;
    }

    function getFontByName(name) {
      var i = 0;
      var len = this.fonts.length;

      while (i < len) {
        if (this.fonts[i].fName === name) {
          return this.fonts[i];
        }

        i += 1;
      }

      return this.fonts[0];
    }

    function isModifier(firstCharCode, secondCharCode) {
      var sum = firstCharCode.toString(16) + secondCharCode.toString(16);
      return surrogateModifiers.indexOf(sum) !== -1;
    }

    function isZeroWidthJoiner(firstCharCode, secondCharCode) {
      if (!secondCharCode) {
        return firstCharCode === zeroWidthJoiner[1];
      }

      return firstCharCode === zeroWidthJoiner[0] && secondCharCode === zeroWidthJoiner[1];
    }

    function isCombinedCharacter(_char3) {
      return combinedCharacters.indexOf(_char3) !== -1;
    }

    function setIsLoaded() {
      this.isLoaded = true;
    }

    var Font = function Font() {
      this.fonts = [];
      this.chars = null;
      this.typekitLoaded = 0;
      this.isLoaded = false;
      this._warned = false;
      this.initTime = Date.now();
      this.setIsLoadedBinded = this.setIsLoaded.bind(this);
      this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this);
    };

    Font.isModifier = isModifier;
    Font.isZeroWidthJoiner = isZeroWidthJoiner;
    Font.isCombinedCharacter = isCombinedCharacter;
    var fontPrototype = {
      addChars: addChars,
      addFonts: addFonts,
      getCharData: getCharData,
      getFontByName: getFontByName,
      measureText: measureText,
      checkLoadedFonts: checkLoadedFonts,
      setIsLoaded: setIsLoaded
    };
    Font.prototype = fontPrototype;
    return Font;
  }();

  function RenderableElement() {}

  RenderableElement.prototype = {
    initRenderable: function initRenderable() {
      // layer's visibility related to inpoint and outpoint. Rename isVisible to isInRange
      this.isInRange = false; // layer's display state

      this.hidden = false; // If layer's transparency equals 0, it can be hidden

      this.isTransparent = false; // list of animated components

      this.renderableComponents = [];
    },
    addRenderableComponent: function addRenderableComponent(component) {
      if (this.renderableComponents.indexOf(component) === -1) {
        this.renderableComponents.push(component);
      }
    },
    removeRenderableComponent: function removeRenderableComponent(component) {
      if (this.renderableComponents.indexOf(component) !== -1) {
        this.renderableComponents.splice(this.renderableComponents.indexOf(component), 1);
      }
    },
    prepareRenderableFrame: function prepareRenderableFrame(num) {
      this.checkLayerLimits(num);
    },
    checkTransparency: function checkTransparency() {
      if (this.finalTransform.mProp.o.v <= 0) {
        if (!this.isTransparent && this.globalData.renderConfig.hideOnTransparent) {
          this.isTransparent = true;
          this.hide();
        }
      } else if (this.isTransparent) {
        this.isTransparent = false;
        this.show();
      }
    },

    /**
       * @function
       * Initializes frame related properties.
       *
       * @param {number} num
       * current frame number in Layer's time
       *
       */
    checkLayerLimits: function checkLayerLimits(num) {
      if (this.data.ip - this.data.st <= num && this.data.op - this.data.st > num) {
        if (this.isInRange !== true) {
          this.globalData._mdf = true;
          this._mdf = true;
          this.isInRange = true;
          this.show();
        }
      } else if (this.isInRange !== false) {
        this.globalData._mdf = true;
        this.isInRange = false;
        this.hide();
      }
    },
    renderRenderable: function renderRenderable() {
      var i;
      var len = this.renderableComponents.length;

      for (i = 0; i < len; i += 1) {
        this.renderableComponents[i].renderFrame(this._isFirstFrame);
      }
      /* this.maskManager.renderFrame(this.finalTransform.mat);
          this.renderableEffectsManager.renderFrame(this._isFirstFrame); */

    },
    sourceRectAtTime: function sourceRectAtTime() {
      return {
        top: 0,
        left: 0,
        width: 100,
        height: 100
      };
    },
    getLayerSize: function getLayerSize() {
      if (this.data.ty === 5) {
        return {
          w: this.data.textData.width,
          h: this.data.textData.height
        };
      }

      return {
        w: this.data.width,
        h: this.data.height
      };
    }
  };

  var MaskManagerInterface = function () {
    function MaskInterface(mask, data) {
      this._mask = mask;
      this._data = data;
    }

    Object.defineProperty(MaskInterface.prototype, 'maskPath', {
      get: function get() {
        if (this._mask.prop.k) {
          this._mask.prop.getValue();
        }

        return this._mask.prop;
      }
    });
    Object.defineProperty(MaskInterface.prototype, 'maskOpacity', {
      get: function get() {
        if (this._mask.op.k) {
          this._mask.op.getValue();
        }

        return this._mask.op.v * 100;
      }
    });

    var MaskManager = function MaskManager(maskManager) {
      var _masksInterfaces = createSizedArray(maskManager.viewData.length);

      var i;
      var len = maskManager.viewData.length;

      for (i = 0; i < len; i += 1) {
        _masksInterfaces[i] = new MaskInterface(maskManager.viewData[i], maskManager.masksProperties[i]);
      }

      var maskFunction = function maskFunction(name) {
        i = 0;

        while (i < len) {
          if (maskManager.masksProperties[i].nm === name) {
            return _masksInterfaces[i];
          }

          i += 1;
        }

        return null;
      };

      return maskFunction;
    };

    return MaskManager;
  }();

  var ExpressionPropertyInterface = function () {
    var defaultUnidimensionalValue = {
      pv: 0,
      v: 0,
      mult: 1
    };
    var defaultMultidimensionalValue = {
      pv: [0, 0, 0],
      v: [0, 0, 0],
      mult: 1
    };

    function completeProperty(expressionValue, property, type) {
      Object.defineProperty(expressionValue, 'velocity', {
        get: function get() {
          return property.getVelocityAtTime(property.comp.currentFrame);
        }
      });
      expressionValue.numKeys = property.keyframes ? property.keyframes.length : 0;

      expressionValue.key = function (pos) {
        if (!expressionValue.numKeys) {
          return 0;
        }

        var value = '';

        if ('s' in property.keyframes[pos - 1]) {
          value = property.keyframes[pos - 1].s;
        } else if ('e' in property.keyframes[pos - 2]) {
          value = property.keyframes[pos - 2].e;
        } else {
          value = property.keyframes[pos - 2].s;
        }

        var valueProp = type === 'unidimensional' ? new Number(value) : Object.assign({}, value); // eslint-disable-line no-new-wrappers

        valueProp.time = property.keyframes[pos - 1].t / property.elem.comp.globalData.frameRate;
        valueProp.value = type === 'unidimensional' ? value[0] : value;
        return valueProp;
      };

      expressionValue.valueAtTime = property.getValueAtTime;
      expressionValue.speedAtTime = property.getSpeedAtTime;
      expressionValue.velocityAtTime = property.getVelocityAtTime;
      expressionValue.propertyGroup = property.propertyGroup;
    }

    function UnidimensionalPropertyInterface(property) {
      if (!property || !('pv' in property)) {
        property = defaultUnidimensionalValue;
      }

      var mult = 1 / property.mult;
      var val = property.pv * mult;
      var expressionValue = new Number(val); // eslint-disable-line no-new-wrappers

      expressionValue.value = val;
      completeProperty(expressionValue, property, 'unidimensional');
      return function () {
        if (property.k) {
          property.getValue();
        }

        val = property.v * mult;

        if (expressionValue.value !== val) {
          expressionValue = new Number(val); // eslint-disable-line no-new-wrappers

          expressionValue.value = val;
          completeProperty(expressionValue, property, 'unidimensional');
        }

        return expressionValue;
      };
    }

    function MultidimensionalPropertyInterface(property) {
      if (!property || !('pv' in property)) {
        property = defaultMultidimensionalValue;
      }

      var mult = 1 / property.mult;
      var len = property.data && property.data.l || property.pv.length;
      var expressionValue = createTypedArray('float32', len);
      var arrValue = createTypedArray('float32', len);
      expressionValue.value = arrValue;
      completeProperty(expressionValue, property, 'multidimensional');
      return function () {
        if (property.k) {
          property.getValue();
        }

        for (var i = 0; i < len; i += 1) {
          arrValue[i] = property.v[i] * mult;
          expressionValue[i] = arrValue[i];
        }

        return expressionValue;
      };
    } // TODO: try to avoid using this getter


    function defaultGetter() {
      return defaultUnidimensionalValue;
    }

    return function (property) {
      if (!property) {
        return defaultGetter;
      }

      if (property.propType === 'unidimensional') {
        return UnidimensionalPropertyInterface(property);
      }

      return MultidimensionalPropertyInterface(property);
    };
  }();

  var TransformExpressionInterface = function () {
    return function (transform) {
      function _thisFunction(name) {
        switch (name) {
          case 'scale':
          case 'Scale':
          case 'ADBE Scale':
          case 6:
            return _thisFunction.scale;

          case 'rotation':
          case 'Rotation':
          case 'ADBE Rotation':
          case 'ADBE Rotate Z':
          case 10:
            return _thisFunction.rotation;

          case 'ADBE Rotate X':
            return _thisFunction.xRotation;

          case 'ADBE Rotate Y':
            return _thisFunction.yRotation;

          case 'position':
          case 'Position':
          case 'ADBE Position':
          case 2:
            return _thisFunction.position;

          case 'ADBE Position_0':
            return _thisFunction.xPosition;

          case 'ADBE Position_1':
            return _thisFunction.yPosition;

          case 'ADBE Position_2':
            return _thisFunction.zPosition;

          case 'anchorPoint':
          case 'AnchorPoint':
          case 'Anchor Point':
          case 'ADBE AnchorPoint':
          case 1:
            return _thisFunction.anchorPoint;

          case 'opacity':
          case 'Opacity':
          case 11:
            return _thisFunction.opacity;

          default:
            return null;
        }
      }

      Object.defineProperty(_thisFunction, 'rotation', {
        get: ExpressionPropertyInterface(transform.r || transform.rz)
      });
      Object.defineProperty(_thisFunction, 'zRotation', {
        get: ExpressionPropertyInterface(transform.rz || transform.r)
      });
      Object.defineProperty(_thisFunction, 'xRotation', {
        get: ExpressionPropertyInterface(transform.rx)
      });
      Object.defineProperty(_thisFunction, 'yRotation', {
        get: ExpressionPropertyInterface(transform.ry)
      });
      Object.defineProperty(_thisFunction, 'scale', {
        get: ExpressionPropertyInterface(transform.s)
      });

      var _px;

      var _py;

      var _pz;

      var _transformFactory;

      if (transform.p) {
        _transformFactory = ExpressionPropertyInterface(transform.p);
      } else {
        _px = ExpressionPropertyInterface(transform.px);
        _py = ExpressionPropertyInterface(transform.py);

        if (transform.pz) {
          _pz = ExpressionPropertyInterface(transform.pz);
        }
      }

      Object.defineProperty(_thisFunction, 'position', {
        get: function get() {
          if (transform.p) {
            return _transformFactory();
          }

          return [_px(), _py(), _pz ? _pz() : 0];
        }
      });
      Object.defineProperty(_thisFunction, 'xPosition', {
        get: ExpressionPropertyInterface(transform.px)
      });
      Object.defineProperty(_thisFunction, 'yPosition', {
        get: ExpressionPropertyInterface(transform.py)
      });
      Object.defineProperty(_thisFunction, 'zPosition', {
        get: ExpressionPropertyInterface(transform.pz)
      });
      Object.defineProperty(_thisFunction, 'anchorPoint', {
        get: ExpressionPropertyInterface(transform.a)
      });
      Object.defineProperty(_thisFunction, 'opacity', {
        get: ExpressionPropertyInterface(transform.o)
      });
      Object.defineProperty(_thisFunction, 'skew', {
        get: ExpressionPropertyInterface(transform.sk)
      });
      Object.defineProperty(_thisFunction, 'skewAxis', {
        get: ExpressionPropertyInterface(transform.sa)
      });
      Object.defineProperty(_thisFunction, 'orientation', {
        get: ExpressionPropertyInterface(transform.or)
      });
      return _thisFunction;
    };
  }();

  var LayerExpressionInterface = function () {
    function getMatrix(time) {
      var toWorldMat = new Matrix();

      if (time !== undefined) {
        var propMatrix = this._elem.finalTransform.mProp.getValueAtTime(time);

        propMatrix.clone(toWorldMat);
      } else {
        var transformMat = this._elem.finalTransform.mProp;
        transformMat.applyToMatrix(toWorldMat);
      }

      return toWorldMat;
    }

    function toWorldVec(arr, time) {
      var toWorldMat = this.getMatrix(time);
      toWorldMat.props[12] = 0;
      toWorldMat.props[13] = 0;
      toWorldMat.props[14] = 0;
      return this.applyPoint(toWorldMat, arr);
    }

    function toWorld(arr, time) {
      var toWorldMat = this.getMatrix(time);
      return this.applyPoint(toWorldMat, arr);
    }

    function fromWorldVec(arr, time) {
      var toWorldMat = this.getMatrix(time);
      toWorldMat.props[12] = 0;
      toWorldMat.props[13] = 0;
      toWorldMat.props[14] = 0;
      return this.invertPoint(toWorldMat, arr);
    }

    function fromWorld(arr, time) {
      var toWorldMat = this.getMatrix(time);
      return this.invertPoint(toWorldMat, arr);
    }

    function applyPoint(matrix, arr) {
      if (this._elem.hierarchy && this._elem.hierarchy.length) {
        var i;
        var len = this._elem.hierarchy.length;

        for (i = 0; i < len; i += 1) {
          this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(matrix);
        }
      }

      return matrix.applyToPointArray(arr[0], arr[1], arr[2] || 0);
    }

    function invertPoint(matrix, arr) {
      if (this._elem.hierarchy && this._elem.hierarchy.length) {
        var i;
        var len = this._elem.hierarchy.length;

        for (i = 0; i < len; i += 1) {
          this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(matrix);
        }
      }

      return matrix.inversePoint(arr);
    }

    function fromComp(arr) {
      var toWorldMat = new Matrix();
      toWorldMat.reset();

      this._elem.finalTransform.mProp.applyToMatrix(toWorldMat);

      if (this._elem.hierarchy && this._elem.hierarchy.length) {
        var i;
        var len = this._elem.hierarchy.length;

        for (i = 0; i < len; i += 1) {
          this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat);
        }

        return toWorldMat.inversePoint(arr);
      }

      return toWorldMat.inversePoint(arr);
    }

    function sampleImage() {
      return [1, 1, 1, 1];
    }

    return function (elem) {
      var transformInterface;

      function _registerMaskInterface(maskManager) {
        _thisLayerFunction.mask = new MaskManagerInterface(maskManager, elem);
      }

      function _registerEffectsInterface(effects) {
        _thisLayerFunction.effect = effects;
      }

      function _thisLayerFunction(name) {
        switch (name) {
          case 'ADBE Root Vectors Group':
          case 'Contents':
          case 2:
            return _thisLayerFunction.shapeInterface;

          case 1:
          case 6:
          case 'Transform':
          case 'transform':
          case 'ADBE Transform Group':
            return transformInterface;

          case 4:
          case 'ADBE Effect Parade':
          case 'effects':
          case 'Effects':
            return _thisLayerFunction.effect;

          case 'ADBE Text Properties':
            return _thisLayerFunction.textInterface;

          default:
            return null;
        }
      }

      _thisLayerFunction.getMatrix = getMatrix;
      _thisLayerFunction.invertPoint = invertPoint;
      _thisLayerFunction.applyPoint = applyPoint;
      _thisLayerFunction.toWorld = toWorld;
      _thisLayerFunction.toWorldVec = toWorldVec;
      _thisLayerFunction.fromWorld = fromWorld;
      _thisLayerFunction.fromWorldVec = fromWorldVec;
      _thisLayerFunction.toComp = toWorld;
      _thisLayerFunction.fromComp = fromComp;
      _thisLayerFunction.sampleImage = sampleImage;
      _thisLayerFunction.sourceRectAtTime = elem.sourceRectAtTime.bind(elem);
      _thisLayerFunction._elem = elem;
      transformInterface = TransformExpressionInterface(elem.finalTransform.mProp);
      var anchorPointDescriptor = getDescriptor(transformInterface, 'anchorPoint');
      Object.defineProperties(_thisLayerFunction, {
        hasParent: {
          get: function get() {
            return elem.hierarchy.length;
          }
        },
        parent: {
          get: function get() {
            return elem.hierarchy[0].layerInterface;
          }
        },
        rotation: getDescriptor(transformInterface, 'rotation'),
        scale: getDescriptor(transformInterface, 'scale'),
        position: getDescriptor(transformInterface, 'position'),
        opacity: getDescriptor(transformInterface, 'opacity'),
        anchorPoint: anchorPointDescriptor,
        anchor_point: anchorPointDescriptor,
        transform: {
          get: function get() {
            return transformInterface;
          }
        },
        active: {
          get: function get() {
            return elem.isInRange;
          }
        }
      });
      _thisLayerFunction.startTime = elem.data.st;
      _thisLayerFunction.index = elem.data.ind;
      _thisLayerFunction.source = elem.data.refId;
      _thisLayerFunction.height = elem.data.ty === 0 ? elem.data.h : 100;
      _thisLayerFunction.width = elem.data.ty === 0 ? elem.data.w : 100;
      _thisLayerFunction.inPoint = elem.data.ip / elem.comp.globalData.frameRate;
      _thisLayerFunction.outPoint = elem.data.op / elem.comp.globalData.frameRate;
      _thisLayerFunction._name = elem.data.nm;
      _thisLayerFunction.registerMaskInterface = _registerMaskInterface;
      _thisLayerFunction.registerEffectsInterface = _registerEffectsInterface;
      return _thisLayerFunction;
    };
  }();

  var propertyGroupFactory = function () {
    return function (interfaceFunction, parentPropertyGroup) {
      return function (val) {
        val = val === undefined ? 1 : val;

        if (val <= 0) {
          return interfaceFunction;
        }

        return parentPropertyGroup(val - 1);
      };
    };
  }();

  var PropertyInterface = function () {
    return function (propertyName, propertyGroup) {
      var interfaceFunction = {
        _name: propertyName
      };

      function _propertyGroup(val) {
        val = val === undefined ? 1 : val;

        if (val <= 0) {
          return interfaceFunction;
        }

        return propertyGroup(val - 1);
      }

      return _propertyGroup;
    };
  }();

  var EffectsExpressionInterface = function () {
    var ob = {
      createEffectsInterface: createEffectsInterface
    };

    function createEffectsInterface(elem, propertyGroup) {
      if (elem.effectsManager) {
        var effectElements = [];
        var effectsData = elem.data.ef;
        var i;
        var len = elem.effectsManager.effectElements.length;

        for (i = 0; i < len; i += 1) {
          effectElements.push(createGroupInterface(effectsData[i], elem.effectsManager.effectElements[i], propertyGroup, elem));
        }

        var effects = elem.data.ef || [];

        var groupInterface = function groupInterface(name) {
          i = 0;
          len = effects.length;

          while (i < len) {
            if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
              return effectElements[i];
            }

            i += 1;
          }

          return null;
        };

        Object.defineProperty(groupInterface, 'numProperties', {
          get: function get() {
            return effects.length;
          }
        });
        return groupInterface;
      }

      return null;
    }

    function createGroupInterface(data, elements, propertyGroup, elem) {
      function groupInterface(name) {
        var effects = data.ef;
        var i = 0;
        var len = effects.length;

        while (i < len) {
          if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
            if (effects[i].ty === 5) {
              return effectElements[i];
            }

            return effectElements[i]();
          }

          i += 1;
        }

        throw new Error();
      }

      var _propertyGroup = propertyGroupFactory(groupInterface, propertyGroup);

      var effectElements = [];
      var i;
      var len = data.ef.length;

      for (i = 0; i < len; i += 1) {
        if (data.ef[i].ty === 5) {
          effectElements.push(createGroupInterface(data.ef[i], elements.effectElements[i], elements.effectElements[i].propertyGroup, elem));
        } else {
          effectElements.push(createValueInterface(elements.effectElements[i], data.ef[i].ty, elem, _propertyGroup));
        }
      }

      if (data.mn === 'ADBE Color Control') {
        Object.defineProperty(groupInterface, 'color', {
          get: function get() {
            return effectElements[0]();
          }
        });
      }

      Object.defineProperties(groupInterface, {
        numProperties: {
          get: function get() {
            return data.np;
          }
        },
        _name: {
          value: data.nm
        },
        propertyGroup: {
          value: _propertyGroup
        }
      });
      groupInterface.enabled = data.en !== 0;
      groupInterface.active = groupInterface.enabled;
      return groupInterface;
    }

    function createValueInterface(element, type, elem, propertyGroup) {
      var expressionProperty = ExpressionPropertyInterface(element.p);

      function interfaceFunction() {
        if (type === 10) {
          return elem.comp.compInterface(element.p.v);
        }

        return expressionProperty();
      }

      if (element.p.setGroupProperty) {
        element.p.setGroupProperty(PropertyInterface('', propertyGroup));
      }

      return interfaceFunction;
    }

    return ob;
  }();

  var CompExpressionInterface = function () {
    return function (comp) {
      function _thisLayerFunction(name) {
        var i = 0;
        var len = comp.layers.length;

        while (i < len) {
          if (comp.layers[i].nm === name || comp.layers[i].ind === name) {
            return comp.elements[i].layerInterface;
          }

          i += 1;
        }

        return null; // return {active:false};
      }

      Object.defineProperty(_thisLayerFunction, '_name', {
        value: comp.data.nm
      });
      _thisLayerFunction.layer = _thisLayerFunction;
      _thisLayerFunction.pixelAspect = 1;
      _thisLayerFunction.height = comp.data.h || comp.globalData.compSize.h;
      _thisLayerFunction.width = comp.data.w || comp.globalData.compSize.w;
      _thisLayerFunction.pixelAspect = 1;
      _thisLayerFunction.frameDuration = 1 / comp.globalData.frameRate;
      _thisLayerFunction.displayStartTime = 0;
      _thisLayerFunction.numLayers = comp.layers.length;
      return _thisLayerFunction;
    };
  }();

  var ShapePathInterface = function () {
    return function pathInterfaceFactory(shape, view, propertyGroup) {
      var prop = view.sh;

      function interfaceFunction(val) {
        if (val === 'Shape' || val === 'shape' || val === 'Path' || val === 'path' || val === 'ADBE Vector Shape' || val === 2) {
          return interfaceFunction.path;
        }

        return null;
      }

      var _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);

      prop.setGroupProperty(PropertyInterface('Path', _propertyGroup));
      Object.defineProperties(interfaceFunction, {
        path: {
          get: function get() {
            if (prop.k) {
              prop.getValue();
            }

            return prop;
          }
        },
        shape: {
          get: function get() {
            if (prop.k) {
              prop.getValue();
            }

            return prop;
          }
        },
        _name: {
          value: shape.nm
        },
        ix: {
          value: shape.ix
        },
        propertyIndex: {
          value: shape.ix
        },
        mn: {
          value: shape.mn
        },
        propertyGroup: {
          value: propertyGroup
        }
      });
      return interfaceFunction;
    };
  }();

  var ShapeExpressionInterface = function () {
    function iterateElements(shapes, view, propertyGroup) {
      var arr = [];
      var i;
      var len = shapes ? shapes.length : 0;

      for (i = 0; i < len; i += 1) {
        if (shapes[i].ty === 'gr') {
          arr.push(groupInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'fl') {
          arr.push(fillInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'st') {
          arr.push(strokeInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'tm') {
          arr.push(trimInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'tr') {// arr.push(transformInterfaceFactory(shapes[i],view[i],propertyGroup));
        } else if (shapes[i].ty === 'el') {
          arr.push(ellipseInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'sr') {
          arr.push(starInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'sh') {
          arr.push(ShapePathInterface(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'rc') {
          arr.push(rectInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'rd') {
          arr.push(roundedInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'rp') {
          arr.push(repeaterInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else if (shapes[i].ty === 'gf') {
          arr.push(gradientFillInterfaceFactory(shapes[i], view[i], propertyGroup));
        } else {
          arr.push(defaultInterfaceFactory(shapes[i], view[i], propertyGroup));
        }
      }

      return arr;
    }

    function contentsInterfaceFactory(shape, view, propertyGroup) {
      var interfaces;

      var interfaceFunction = function _interfaceFunction(value) {
        var i = 0;
        var len = interfaces.length;

        while (i < len) {
          if (interfaces[i]._name === value || interfaces[i].mn === value || interfaces[i].propertyIndex === value || interfaces[i].ix === value || interfaces[i].ind === value) {
            return interfaces[i];
          }

          i += 1;
        }

        if (typeof value === 'number') {
          return interfaces[value - 1];
        }

        return null;
      };

      interfaceFunction.propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);
      interfaces = iterateElements(shape.it, view.it, interfaceFunction.propertyGroup);
      interfaceFunction.numProperties = interfaces.length;
      var transformInterface = transformInterfaceFactory(shape.it[shape.it.length - 1], view.it[view.it.length - 1], interfaceFunction.propertyGroup);
      interfaceFunction.transform = transformInterface;
      interfaceFunction.propertyIndex = shape.cix;
      interfaceFunction._name = shape.nm;
      return interfaceFunction;
    }

    function groupInterfaceFactory(shape, view, propertyGroup) {
      var interfaceFunction = function _interfaceFunction(value) {
        switch (value) {
          case 'ADBE Vectors Group':
          case 'Contents':
          case 2:
            return interfaceFunction.content;
          // Not necessary for now. Keeping them here in case a new case appears
          // case 'ADBE Vector Transform Group':
          // case 3:

          default:
            return interfaceFunction.transform;
        }
      };

      interfaceFunction.propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);
      var content = contentsInterfaceFactory(shape, view, interfaceFunction.propertyGroup);
      var transformInterface = transformInterfaceFactory(shape.it[shape.it.length - 1], view.it[view.it.length - 1], interfaceFunction.propertyGroup);
      interfaceFunction.content = content;
      interfaceFunction.transform = transformInterface;
      Object.defineProperty(interfaceFunction, '_name', {
        get: function get() {
          return shape.nm;
        }
      }); // interfaceFunction.content = interfaceFunction;

      interfaceFunction.numProperties = shape.np;
      interfaceFunction.propertyIndex = shape.ix;
      interfaceFunction.nm = shape.nm;
      interfaceFunction.mn = shape.mn;
      return interfaceFunction;
    }

    function fillInterfaceFactory(shape, view, propertyGroup) {
      function interfaceFunction(val) {
        if (val === 'Color' || val === 'color') {
          return interfaceFunction.color;
        }

        if (val === 'Opacity' || val === 'opacity') {
          return interfaceFunction.opacity;
        }

        return null;
      }

      Object.defineProperties(interfaceFunction, {
        color: {
          get: ExpressionPropertyInterface(view.c)
        },
        opacity: {
          get: ExpressionPropertyInterface(view.o)
        },
        _name: {
          value: shape.nm
        },
        mn: {
          value: shape.mn
        }
      });
      view.c.setGroupProperty(PropertyInterface('Color', propertyGroup));
      view.o.setGroupProperty(PropertyInterface('Opacity', propertyGroup));
      return interfaceFunction;
    }

    function gradientFillInterfaceFactory(shape, view, propertyGroup) {
      function interfaceFunction(val) {
        if (val === 'Start Point' || val === 'start point') {
          return interfaceFunction.startPoint;
        }

        if (val === 'End Point' || val === 'end point') {
          return interfaceFunction.endPoint;
        }

        if (val === 'Opacity' || val === 'opacity') {
          return interfaceFunction.opacity;
        }

        return null;
      }

      Object.defineProperties(interfaceFunction, {
        startPoint: {
          get: ExpressionPropertyInterface(view.s)
        },
        endPoint: {
          get: ExpressionPropertyInterface(view.e)
        },
        opacity: {
          get: ExpressionPropertyInterface(view.o)
        },
        type: {
          get: function get() {
            return 'a';
          }
        },
        _name: {
          value: shape.nm
        },
        mn: {
          value: shape.mn
        }
      });
      view.s.setGroupProperty(PropertyInterface('Start Point', propertyGroup));
      view.e.setGroupProperty(PropertyInterface('End Point', propertyGroup));
      view.o.setGroupProperty(PropertyInterface('Opacity', propertyGroup));
      return interfaceFunction;
    }

    function defaultInterfaceFactory() {
      function interfaceFunction() {
        return null;
      }

      return interfaceFunction;
    }

    function strokeInterfaceFactory(shape, view, propertyGroup) {
      var _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);

      var _dashPropertyGroup = propertyGroupFactory(dashOb, _propertyGroup);

      function addPropertyToDashOb(i) {
        Object.defineProperty(dashOb, shape.d[i].nm, {
          get: ExpressionPropertyInterface(view.d.dataProps[i].p)
        });
      }

      var i;
      var len = shape.d ? shape.d.length : 0;
      var dashOb = {};

      for (i = 0; i < len; i += 1) {
        addPropertyToDashOb(i);
        view.d.dataProps[i].p.setGroupProperty(_dashPropertyGroup);
      }

      function interfaceFunction(val) {
        if (val === 'Color' || val === 'color') {
          return interfaceFunction.color;
        }

        if (val === 'Opacity' || val === 'opacity') {
          return interfaceFunction.opacity;
        }

        if (val === 'Stroke Width' || val === 'stroke width') {
          return interfaceFunction.strokeWidth;
        }

        return null;
      }

      Object.defineProperties(interfaceFunction, {
        color: {
          get: ExpressionPropertyInterface(view.c)
        },
        opacity: {
          get: ExpressionPropertyInterface(view.o)
        },
        strokeWidth: {
          get: ExpressionPropertyInterface(view.w)
        },
        dash: {
          get: function get() {
            return dashOb;
          }
        },
        _name: {
          value: shape.nm
        },
        mn: {
          value: shape.mn
        }
      });
      view.c.setGroupProperty(PropertyInterface('Color', _propertyGroup));
      view.o.setGroupProperty(PropertyInterface('Opacity', _propertyGroup));
      view.w.setGroupProperty(PropertyInterface('Stroke Width', _propertyGroup));
      return interfaceFunction;
    }

    function trimInterfaceFactory(shape, view, propertyGroup) {
      function interfaceFunction(val) {
        if (val === shape.e.ix || val === 'End' || val === 'end') {
          return interfaceFunction.end;
        }

        if (val === shape.s.ix) {
          return interfaceFunction.start;
        }

        if (val === shape.o.ix) {
          return interfaceFunction.offset;
        }

        return null;
      }

      var _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);

      interfaceFunction.propertyIndex = shape.ix;
      view.s.setGroupProperty(PropertyInterface('Start', _propertyGroup));
      view.e.setGroupProperty(PropertyInterface('End', _propertyGroup));
      view.o.setGroupProperty(PropertyInterface('Offset', _propertyGroup));
      interfaceFunction.propertyIndex = shape.ix;
      interfaceFunction.propertyGroup = propertyGroup;
      Object.defineProperties(interfaceFunction, {
        start: {
          get: ExpressionPropertyInterface(view.s)
        },
        end: {
          get: ExpressionPropertyInterface(view.e)
        },
        offset: {
          get: ExpressionPropertyInterface(view.o)
        },
        _name: {
          value: shape.nm
        }
      });
      interfaceFunction.mn = shape.mn;
      return interfaceFunction;
    }

    function transformInterfaceFactory(shape, view, propertyGroup) {
      function interfaceFunction(value) {
        if (shape.a.ix === value || value === 'Anchor Point') {
          return interfaceFunction.anchorPoint;
        }

        if (shape.o.ix === value || value === 'Opacity') {
          return interfaceFunction.opacity;
        }

        if (shape.p.ix === value || value === 'Position') {
          return interfaceFunction.position;
        }

        if (shape.r.ix === value || value === 'Rotation' || value === 'ADBE Vector Rotation') {
          return interfaceFunction.rotation;
        }

        if (shape.s.ix === value || value === 'Scale') {
          return interfaceFunction.scale;
        }

        if (shape.sk && shape.sk.ix === value || value === 'Skew') {
          return interfaceFunction.skew;
        }

        if (shape.sa && shape.sa.ix === value || value === 'Skew Axis') {
          return interfaceFunction.skewAxis;
        }

        return null;
      }

      var _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);

      view.transform.mProps.o.setGroupProperty(PropertyInterface('Opacity', _propertyGroup));
      view.transform.mProps.p.setGroupProperty(PropertyInterface('Position', _propertyGroup));
      view.transform.mProps.a.setGroupProperty(PropertyInterface('Anchor Point', _propertyGroup));
      view.transform.mProps.s.setGroupProperty(PropertyInterface('Scale', _propertyGroup));
      view.transform.mProps.r.setGroupProperty(PropertyInterface('Rotation', _propertyGroup));

      if (view.transform.mProps.sk) {
        view.transform.mProps.sk.setGroupProperty(PropertyInterface('Skew', _propertyGroup));
        view.transform.mProps.sa.setGroupProperty(PropertyInterface('Skew Angle', _propertyGroup));
      }

      view.transform.op.setGroupProperty(PropertyInterface('Opacity', _propertyGroup));
      Object.defineProperties(interfaceFunction, {
        opacity: {
          get: ExpressionPropertyInterface(view.transform.mProps.o)
        },
        position: {
          get: ExpressionPropertyInterface(view.transform.mProps.p)
        },
        anchorPoint: {
          get: ExpressionPropertyInterface(view.transform.mProps.a)
        },
        scale: {
          get: ExpressionPropertyInterface(view.transform.mProps.s)
        },
        rotation: {
          get: ExpressionPropertyInterface(view.transform.mProps.r)
        },
        skew: {
          get: ExpressionPropertyInterface(view.transform.mProps.sk)
        },
        skewAxis: {
          get: ExpressionPropertyInterface(view.transform.mProps.sa)
        },
        _name: {
          value: shape.nm
        }
      });
      interfaceFunction.ty = 'tr';
      interfaceFunction.mn = shape.mn;
      interfaceFunction.propertyGroup = propertyGroup;
      return interfaceFunction;
    }

    function ellipseInterfaceFactory(shape, view, propertyGroup) {
      function interfaceFunction(value) {
        if (shape.p.ix === value) {
          return interfaceFunction.position;
        }

        if (shape.s.ix === value) {
          return interfaceFunction.size;
        }

        return null;
      }

      var _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);

      interfaceFunction.propertyIndex = shape.ix;
      var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
      prop.s.setGroupProperty(PropertyInterface('Size', _propertyGroup));
      prop.p.setGroupProperty(PropertyInterface('Position', _propertyGroup));
      Object.defineProperties(interfaceFunction, {
        size: {
          get: ExpressionPropertyInterface(prop.s)
        },
        position: {
          get: ExpressionPropertyInterface(prop.p)
        },
        _name: {
          value: shape.nm
        }
      });
      interfaceFunction.mn = shape.mn;
      return interfaceFunction;
    }

    function starInterfaceFactory(shape, view, propertyGroup) {
      function interfaceFunction(value) {
        if (shape.p.ix === value) {
          return interfaceFunction.position;
        }

        if (shape.r.ix === value) {
          return interfaceFunction.rotation;
        }

        if (shape.pt.ix === value) {
          return interfaceFunction.points;
        }

        if (shape.or.ix === value || value === 'ADBE Vector Star Outer Radius') {
          return interfaceFunction.outerRadius;
        }

        if (shape.os.ix === value) {
          return interfaceFunction.outerRoundness;
        }

        if (shape.ir && (shape.ir.ix === value || value === 'ADBE Vector Star Inner Radius')) {
          return interfaceFunction.innerRadius;
        }

        if (shape.is && shape.is.ix === value) {
          return interfaceFunction.innerRoundness;
        }

        return null;
      }

      var _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);

      var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
      interfaceFunction.propertyIndex = shape.ix;
      prop.or.setGroupProperty(PropertyInterface('Outer Radius', _propertyGroup));
      prop.os.setGroupProperty(PropertyInterface('Outer Roundness', _propertyGroup));
      prop.pt.setGroupProperty(PropertyInterface('Points', _propertyGroup));
      prop.p.setGroupProperty(PropertyInterface('Position', _propertyGroup));
      prop.r.setGroupProperty(PropertyInterface('Rotation', _propertyGroup));

      if (shape.ir) {
        prop.ir.setGroupProperty(PropertyInterface('Inner Radius', _propertyGroup));
        prop.is.setGroupProperty(PropertyInterface('Inner Roundness', _propertyGroup));
      }

      Object.defineProperties(interfaceFunction, {
        position: {
          get: ExpressionPropertyInterface(prop.p)
        },
        rotation: {
          get: ExpressionPropertyInterface(prop.r)
        },
        points: {
          get: ExpressionPropertyInterface(prop.pt)
        },
        outerRadius: {
          get: ExpressionPropertyInterface(prop.or)
        },
        outerRoundness: {
          get: ExpressionPropertyInterface(prop.os)
        },
        innerRadius: {
          get: ExpressionPropertyInterface(prop.ir)
        },
        innerRoundness: {
          get: ExpressionPropertyInterface(prop.is)
        },
        _name: {
          value: shape.nm
        }
      });
      interfaceFunction.mn = shape.mn;
      return interfaceFunction;
    }

    function rectInterfaceFactory(shape, view, propertyGroup) {
      function interfaceFunction(value) {
        if (shape.p.ix === value) {
          return interfaceFunction.position;
        }

        if (shape.r.ix === value) {
          return interfaceFunction.roundness;
        }

        if (shape.s.ix === value || value === 'Size' || value === 'ADBE Vector Rect Size') {
          return interfaceFunction.size;
        }

        return null;
      }

      var _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);

      var prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh;
      interfaceFunction.propertyIndex = shape.ix;
      prop.p.setGroupProperty(PropertyInterface('Position', _propertyGroup));
      prop.s.setGroupProperty(PropertyInterface('Size', _propertyGroup));
      prop.r.setGroupProperty(PropertyInterface('Rotation', _propertyGroup));
      Object.defineProperties(interfaceFunction, {
        position: {
          get: ExpressionPropertyInterface(prop.p)
        },
        roundness: {
          get: ExpressionPropertyInterface(prop.r)
        },
        size: {
          get: ExpressionPropertyInterface(prop.s)
        },
        _name: {
          value: shape.nm
        }
      });
      interfaceFunction.mn = shape.mn;
      return interfaceFunction;
    }

    function roundedInterfaceFactory(shape, view, propertyGroup) {
      function interfaceFunction(value) {
        if (shape.r.ix === value || value === 'Round Corners 1') {
          return interfaceFunction.radius;
        }

        return null;
      }

      var _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);

      var prop = view;
      interfaceFunction.propertyIndex = shape.ix;
      prop.rd.setGroupProperty(PropertyInterface('Radius', _propertyGroup));
      Object.defineProperties(interfaceFunction, {
        radius: {
          get: ExpressionPropertyInterface(prop.rd)
        },
        _name: {
          value: shape.nm
        }
      });
      interfaceFunction.mn = shape.mn;
      return interfaceFunction;
    }

    function repeaterInterfaceFactory(shape, view, propertyGroup) {
      function interfaceFunction(value) {
        if (shape.c.ix === value || value === 'Copies') {
          return interfaceFunction.copies;
        }

        if (shape.o.ix === value || value === 'Offset') {
          return interfaceFunction.offset;
        }

        return null;
      }

      var _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup);

      var prop = view;
      interfaceFunction.propertyIndex = shape.ix;
      prop.c.setGroupProperty(PropertyInterface('Copies', _propertyGroup));
      prop.o.setGroupProperty(PropertyInterface('Offset', _propertyGroup));
      Object.defineProperties(interfaceFunction, {
        copies: {
          get: ExpressionPropertyInterface(prop.c)
        },
        offset: {
          get: ExpressionPropertyInterface(prop.o)
        },
        _name: {
          value: shape.nm
        }
      });
      interfaceFunction.mn = shape.mn;
      return interfaceFunction;
    }

    return function (shapes, view, propertyGroup) {
      var interfaces;

      function _interfaceFunction(value) {
        if (typeof value === 'number') {
          value = value === undefined ? 1 : value;

          if (value === 0) {
            return propertyGroup;
          }

          return interfaces[value - 1];
        }

        var i = 0;
        var len = interfaces.length;

        while (i < len) {
          if (interfaces[i]._name === value) {
            return interfaces[i];
          }

          i += 1;
        }

        return null;
      }

      function parentGroupWrapper() {
        return propertyGroup;
      }

      _interfaceFunction.propertyGroup = propertyGroupFactory(_interfaceFunction, parentGroupWrapper);
      interfaces = iterateElements(shapes, view, _interfaceFunction.propertyGroup);
      _interfaceFunction.numProperties = interfaces.length;
      _interfaceFunction._name = 'Contents';
      return _interfaceFunction;
    };
  }();

  var TextExpressionInterface = function () {
    return function (elem) {
      var _prevValue;

      var _sourceText;

      function _thisLayerFunction(name) {
        switch (name) {
          case 'ADBE Text Document':
            return _thisLayerFunction.sourceText;

          default:
            return null;
        }
      }

      Object.defineProperty(_thisLayerFunction, 'sourceText', {
        get: function get() {
          elem.textProperty.getValue();
          var stringValue = elem.textProperty.currentData.t;

          if (stringValue !== _prevValue) {
            elem.textProperty.currentData.t = _prevValue;
            _sourceText = new String(stringValue); // eslint-disable-line no-new-wrappers
            // If stringValue is an empty string, eval returns undefined, so it has to be returned as a String primitive

            _sourceText.value = stringValue || new String(stringValue); // eslint-disable-line no-new-wrappers
          }

          return _sourceText;
        }
      });
      return _thisLayerFunction;
    };
  }();

  var getBlendMode = function () {
    var blendModeEnums = {
      0: 'source-over',
      1: 'multiply',
      2: 'screen',
      3: 'overlay',
      4: 'darken',
      5: 'lighten',
      6: 'color-dodge',
      7: 'color-burn',
      8: 'hard-light',
      9: 'soft-light',
      10: 'difference',
      11: 'exclusion',
      12: 'hue',
      13: 'saturation',
      14: 'color',
      15: 'luminosity'
    };
    return function (mode) {
      return blendModeEnums[mode] || '';
    };
  }();

  function SliderEffect(data, elem, container) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container);
  }

  function AngleEffect(data, elem, container) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container);
  }

  function ColorEffect(data, elem, container) {
    this.p = PropertyFactory.getProp(elem, data.v, 1, 0, container);
  }

  function PointEffect(data, elem, container) {
    this.p = PropertyFactory.getProp(elem, data.v, 1, 0, container);
  }

  function LayerIndexEffect(data, elem, container) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container);
  }

  function MaskIndexEffect(data, elem, container) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container);
  }

  function CheckboxEffect(data, elem, container) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container);
  }

  function NoValueEffect() {
    this.p = {};
  }

  function EffectsManager(data, element) {
    var effects = data.ef || [];
    this.effectElements = [];
    var i;
    var len = effects.length;
    var effectItem;

    for (i = 0; i < len; i += 1) {
      effectItem = new GroupEffect(effects[i], element);
      this.effectElements.push(effectItem);
    }
  }

  function GroupEffect(data, element) {
    this.init(data, element);
  }

  extendPrototype([DynamicPropertyContainer], GroupEffect);
  GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties;

  GroupEffect.prototype.init = function (data, element) {
    this.data = data;
    this.effectElements = [];
    this.initDynamicPropertyContainer(element);
    var i;
    var len = this.data.ef.length;
    var eff;
    var effects = this.data.ef;

    for (i = 0; i < len; i += 1) {
      eff = null;

      switch (effects[i].ty) {
        case 0:
          eff = new SliderEffect(effects[i], element, this);
          break;

        case 1:
          eff = new AngleEffect(effects[i], element, this);
          break;

        case 2:
          eff = new ColorEffect(effects[i], element, this);
          break;

        case 3:
          eff = new PointEffect(effects[i], element, this);
          break;

        case 4:
        case 7:
          eff = new CheckboxEffect(effects[i], element, this);
          break;

        case 10:
          eff = new LayerIndexEffect(effects[i], element, this);
          break;

        case 11:
          eff = new MaskIndexEffect(effects[i], element, this);
          break;

        case 5:
          eff = new EffectsManager(effects[i], element, this);
          break;
        // case 6:

        default:
          eff = new NoValueEffect(effects[i], element, this);
          break;
      }

      if (eff) {
        this.effectElements.push(eff);
      }
    }
  };

  function BaseElement() {}

  BaseElement.prototype = {
    checkMasks: function checkMasks() {
      if (!this.data.hasMask) {
        return false;
      }

      var i = 0;
      var len = this.data.masksProperties.length;

      while (i < len) {
        if (this.data.masksProperties[i].mode !== 'n' && this.data.masksProperties[i].cl !== false) {
          return true;
        }

        i += 1;
      }

      return false;
    },
    initExpressions: function initExpressions() {
      this.layerInterface = LayerExpressionInterface(this);

      if (this.data.hasMask && this.maskManager) {
        this.layerInterface.registerMaskInterface(this.maskManager);
      }

      var effectsInterface = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
      this.layerInterface.registerEffectsInterface(effectsInterface);

      if (this.data.ty === 0 || this.data.xt) {
        this.compInterface = CompExpressionInterface(this);
      } else if (this.data.ty === 4) {
        this.layerInterface.shapeInterface = ShapeExpressionInterface(this.shapesData, this.itemsData, this.layerInterface);
        this.layerInterface.content = this.layerInterface.shapeInterface;
      } else if (this.data.ty === 5) {
        this.layerInterface.textInterface = TextExpressionInterface(this);
        this.layerInterface.text = this.layerInterface.textInterface;
      }
    },
    setBlendMode: function setBlendMode() {
      var blendModeValue = getBlendMode(this.data.bm);
      var elem = this.baseElement || this.layerElement;
      elem.style['mix-blend-mode'] = blendModeValue;
    },
    initBaseData: function initBaseData(data, globalData, comp) {
      this.globalData = globalData;
      this.comp = comp;
      this.data = data;
      this.layerId = createElementID(); // Stretch factor for old animations missing this property.

      if (!this.data.sr) {
        this.data.sr = 1;
      } // effects manager


      this.effectsManager = new EffectsManager(this.data, this, this.dynamicProperties);
    },
    getType: function getType() {
      return this.type;
    },
    sourceRectAtTime: function sourceRectAtTime() {}
  };

  /**
   * @file
   * Handles element's layer frame update.
   * Checks layer in point and out point
   *
   */
  function FrameElement() {}

  FrameElement.prototype = {
    /**
       * @function
       * Initializes frame related properties.
       *
       */
    initFrame: function initFrame() {
      // set to true when inpoint is rendered
      this._isFirstFrame = false; // list of animated properties

      this.dynamicProperties = []; // If layer has been modified in current tick this will be true

      this._mdf = false;
    },

    /**
       * @function
       * Calculates all dynamic values
       *
       * @param {number} num
       * current frame number in Layer's time
       * @param {boolean} isVisible
       * if layers is currently in range
       *
       */
    prepareProperties: function prepareProperties(num, isVisible) {
      var i;
      var len = this.dynamicProperties.length;

      for (i = 0; i < len; i += 1) {
        if (isVisible || this._isParent && this.dynamicProperties[i].propType === 'transform') {
          this.dynamicProperties[i].getValue();

          if (this.dynamicProperties[i]._mdf) {
            this.globalData._mdf = true;
            this._mdf = true;
          }
        }
      }
    },
    addDynamicProperty: function addDynamicProperty(prop) {
      if (this.dynamicProperties.indexOf(prop) === -1) {
        this.dynamicProperties.push(prop);
      }
    }
  };

  function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }

  var FootageInterface = function () {
    var outlineInterfaceFactory = function outlineInterfaceFactory(elem) {
      var currentPropertyName = '';
      var currentProperty = elem.getFootageData();

      function init() {
        currentPropertyName = '';
        currentProperty = elem.getFootageData();
        return searchProperty;
      }

      function searchProperty(value) {
        if (currentProperty[value]) {
          currentPropertyName = value;
          currentProperty = currentProperty[value];

          if (_typeof$2(currentProperty) === 'object') {
            return searchProperty;
          }

          return currentProperty;
        }

        var propertyNameIndex = value.indexOf(currentPropertyName);

        if (propertyNameIndex !== -1) {
          var index = parseInt(value.substr(propertyNameIndex + currentPropertyName.length), 10);
          currentProperty = currentProperty[index];

          if (_typeof$2(currentProperty) === 'object') {
            return searchProperty;
          }

          return currentProperty;
        }

        return '';
      }

      return init;
    };

    var dataInterfaceFactory = function dataInterfaceFactory(elem) {
      function interfaceFunction(value) {
        if (value === 'Outline') {
          return interfaceFunction.outlineInterface();
        }

        return null;
      }

      interfaceFunction._name = 'Outline';
      interfaceFunction.outlineInterface = outlineInterfaceFactory(elem);
      return interfaceFunction;
    };

    return function (elem) {
      function _interfaceFunction(value) {
        if (value === 'Data') {
          return _interfaceFunction.dataInterface;
        }

        return null;
      }

      _interfaceFunction._name = 'Data';
      _interfaceFunction.dataInterface = dataInterfaceFactory(elem);
      return _interfaceFunction;
    };
  }();

  function FootageElement(data, globalData, comp) {
    this.initFrame();
    this.initRenderable();
    this.assetData = globalData.getAssetData(data.refId);
    this.footageData = globalData.imageLoader.getAsset(this.assetData);
    this.initBaseData(data, globalData, comp);
  }

  FootageElement.prototype.prepareFrame = function () {};

  extendPrototype([RenderableElement, BaseElement, FrameElement], FootageElement);

  FootageElement.prototype.getBaseElement = function () {
    return null;
  };

  FootageElement.prototype.renderFrame = function () {};

  FootageElement.prototype.destroy = function () {};

  FootageElement.prototype.initExpressions = function () {
    this.layerInterface = FootageInterface(this);
  };

  FootageElement.prototype.getFootageData = function () {
    return this.footageData;
  };

  function AudioElement(data, globalData, comp) {
    this.initFrame();
    this.initRenderable();
    this.assetData = globalData.getAssetData(data.refId);
    this.initBaseData(data, globalData, comp);
    this._isPlaying = false;
    this._canPlay = false;
    var assetPath = this.globalData.getAssetsPath(this.assetData);
    this.audio = this.globalData.audioController.createAudio(assetPath);
    this._currentTime = 0;
    this.globalData.audioController.addAudio(this);
    this.tm = data.tm ? PropertyFactory.getProp(this, data.tm, 0, globalData.frameRate, this) : {
      _placeholder: true
    };
  }

  AudioElement.prototype.prepareFrame = function (num) {
    this.prepareRenderableFrame(num, true);
    this.prepareProperties(num, true);

    if (!this.tm._placeholder) {
      var timeRemapped = this.tm.v;
      this._currentTime = timeRemapped;
    } else {
      this._currentTime = num / this.data.sr;
    }
  };

  extendPrototype([RenderableElement, BaseElement, FrameElement], AudioElement);

  AudioElement.prototype.renderFrame = function () {
    if (this.isInRange && this._canPlay) {
      if (!this._isPlaying) {
        this.audio.play();
        this.audio.seek(this._currentTime / this.globalData.frameRate);
        this._isPlaying = true;
      } else if (!this.audio.playing() || Math.abs(this._currentTime / this.globalData.frameRate - this.audio.seek()) > 0.1) {
        this.audio.seek(this._currentTime / this.globalData.frameRate);
      }
    }
  };

  AudioElement.prototype.show = function () {// this.audio.play()
  };

  AudioElement.prototype.hide = function () {
    this.audio.pause();
    this._isPlaying = false;
  };

  AudioElement.prototype.pause = function () {
    this.audio.pause();
    this._isPlaying = false;
    this._canPlay = false;
  };

  AudioElement.prototype.resume = function () {
    this._canPlay = true;
  };

  AudioElement.prototype.setRate = function (rateValue) {
    this.audio.rate(rateValue);
  };

  AudioElement.prototype.volume = function (volumeValue) {
    this.audio.volume(volumeValue);
  };

  AudioElement.prototype.getBaseElement = function () {
    return null;
  };

  AudioElement.prototype.destroy = function () {};

  AudioElement.prototype.sourceRectAtTime = function () {};

  AudioElement.prototype.initExpressions = function () {};

  function BaseRenderer() {}

  BaseRenderer.prototype.checkLayers = function (num) {
    var i;
    var len = this.layers.length;
    var data;
    this.completeLayers = true;

    for (i = len - 1; i >= 0; i -= 1) {
      if (!this.elements[i]) {
        data = this.layers[i];

        if (data.ip - data.st <= num - this.layers[i].st && data.op - data.st > num - this.layers[i].st) {
          this.buildItem(i);
        }
      }

      this.completeLayers = this.elements[i] ? this.completeLayers : false;
    }

    this.checkPendingElements();
  };

  BaseRenderer.prototype.createItem = function (layer) {
    switch (layer.ty) {
      case 2:
        return this.createImage(layer);

      case 0:
        return this.createComp(layer);

      case 1:
        return this.createSolid(layer);

      case 3:
        return this.createNull(layer);

      case 4:
        return this.createShape(layer);

      case 5:
        return this.createText(layer);

      case 6:
        return this.createAudio(layer);

      case 13:
        return this.createCamera(layer);

      case 15:
        return this.createFootage(layer);

      default:
        return this.createNull(layer);
    }
  };

  BaseRenderer.prototype.createCamera = function () {
    throw new Error('You\'re using a 3d camera. Try the html renderer.');
  };

  BaseRenderer.prototype.createAudio = function (data) {
    return new AudioElement(data, this.globalData, this);
  };

  BaseRenderer.prototype.createFootage = function (data) {
    return new FootageElement(data, this.globalData, this);
  };

  BaseRenderer.prototype.buildAllItems = function () {
    var i;
    var len = this.layers.length;

    for (i = 0; i < len; i += 1) {
      this.buildItem(i);
    }

    this.checkPendingElements();
  };

  BaseRenderer.prototype.includeLayers = function (newLayers) {
    this.completeLayers = false;
    var i;
    var len = newLayers.length;
    var j;
    var jLen = this.layers.length;

    for (i = 0; i < len; i += 1) {
      j = 0;

      while (j < jLen) {
        if (this.layers[j].id === newLayers[i].id) {
          this.layers[j] = newLayers[i];
          break;
        }

        j += 1;
      }
    }
  };

  BaseRenderer.prototype.setProjectInterface = function (pInterface) {
    this.globalData.projectInterface = pInterface;
  };

  BaseRenderer.prototype.initItems = function () {
    if (!this.globalData.progressiveLoad) {
      this.buildAllItems();
    }
  };

  BaseRenderer.prototype.buildElementParenting = function (element, parentName, hierarchy) {
    var elements = this.elements;
    var layers = this.layers;
    var i = 0;
    var len = layers.length;

    while (i < len) {
      if (layers[i].ind == parentName) {
        // eslint-disable-line eqeqeq
        if (!elements[i] || elements[i] === true) {
          this.buildItem(i);
          this.addPendingElement(element);
        } else {
          hierarchy.push(elements[i]);
          elements[i].setAsParent();

          if (layers[i].parent !== undefined) {
            this.buildElementParenting(element, layers[i].parent, hierarchy);
          } else {
            element.setHierarchy(hierarchy);
          }
        }
      }

      i += 1;
    }
  };

  BaseRenderer.prototype.addPendingElement = function (element) {
    this.pendingElements.push(element);
  };

  BaseRenderer.prototype.searchExtraCompositions = function (assets) {
    var i;
    var len = assets.length;

    for (i = 0; i < len; i += 1) {
      if (assets[i].xt) {
        var comp = this.createComp(assets[i]);
        comp.initExpressions();
        this.globalData.projectInterface.registerComposition(comp);
      }
    }
  };

  BaseRenderer.prototype.setupGlobalData = function (animData, fontsContainer) {
    this.globalData.fontManager = new FontManager();
    this.globalData.fontManager.addChars(animData.chars);
    this.globalData.fontManager.addFonts(animData.fonts, fontsContainer);
    this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem);
    this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem);
    this.globalData.imageLoader = this.animationItem.imagePreloader;
    this.globalData.audioController = this.animationItem.audioController;
    this.globalData.frameId = 0;
    this.globalData.frameRate = animData.fr;
    this.globalData.nm = animData.nm;
    this.globalData.compSize = {
      w: animData.w,
      h: animData.h
    };
  };

  function TransformElement() {}

  TransformElement.prototype = {
    initTransform: function initTransform() {
      this.finalTransform = {
        mProp: this.data.ks ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this) : {
          o: 0
        },
        _matMdf: false,
        _opMdf: false,
        mat: new Matrix()
      };

      if (this.data.ao) {
        this.finalTransform.mProp.autoOriented = true;
      } // TODO: check TYPE 11: Guided elements


      if (this.data.ty !== 11) {// this.createElements();
      }
    },
    renderTransform: function renderTransform() {
      this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame;
      this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame;

      if (this.hierarchy) {
        var mat;
        var finalMat = this.finalTransform.mat;
        var i = 0;
        var len = this.hierarchy.length; // Checking if any of the transformation matrices in the hierarchy chain has changed.

        if (!this.finalTransform._matMdf) {
          while (i < len) {
            if (this.hierarchy[i].finalTransform.mProp._mdf) {
              this.finalTransform._matMdf = true;
              break;
            }

            i += 1;
          }
        }

        if (this.finalTransform._matMdf) {
          mat = this.finalTransform.mProp.v.props;
          finalMat.cloneFromProps(mat);

          for (i = 0; i < len; i += 1) {
            mat = this.hierarchy[i].finalTransform.mProp.v.props;
            finalMat.transform(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5], mat[6], mat[7], mat[8], mat[9], mat[10], mat[11], mat[12], mat[13], mat[14], mat[15]);
          }
        }
      }
    },
    globalToLocal: function globalToLocal(pt) {
      var transforms = [];
      transforms.push(this.finalTransform);
      var flag = true;
      var comp = this.comp;

      while (flag) {
        if (comp.finalTransform) {
          if (comp.data.hasMask) {
            transforms.splice(0, 0, comp.finalTransform);
          }

          comp = comp.comp;
        } else {
          flag = false;
        }
      }

      var i;
      var len = transforms.length;
      var ptNew;

      for (i = 0; i < len; i += 1) {
        ptNew = transforms[i].mat.applyToPointArray(0, 0, 0); // ptNew = transforms[i].mat.applyToPointArray(pt[0],pt[1],pt[2]);

        pt = [pt[0] - ptNew[0], pt[1] - ptNew[1], 0];
      }

      return pt;
    },
    mHelper: new Matrix()
  };

  function MaskElement(data, element, globalData) {
    this.data = data;
    this.element = element;
    this.globalData = globalData;
    this.storedData = [];
    this.masksProperties = this.data.masksProperties || [];
    this.maskElement = null;
    var defs = this.globalData.defs;
    var i;
    var len = this.masksProperties ? this.masksProperties.length : 0;
    this.viewData = createSizedArray(len);
    this.solidPath = '';
    var path;
    var properties = this.masksProperties;
    var count = 0;
    var currentMasks = [];
    var j;
    var jLen;
    var layerId = createElementID();
    var rect;
    var expansor;
    var feMorph;
    var x;
    var maskType = 'clipPath';
    var maskRef = 'clip-path';

    for (i = 0; i < len; i += 1) {
      if (properties[i].mode !== 'a' && properties[i].mode !== 'n' || properties[i].inv || properties[i].o.k !== 100 || properties[i].o.x) {
        maskType = 'mask';
        maskRef = 'mask';
      }

      if ((properties[i].mode === 's' || properties[i].mode === 'i') && count === 0) {
        rect = createNS('rect');
        rect.setAttribute('fill', '#ffffff');
        rect.setAttribute('width', this.element.comp.data.w || 0);
        rect.setAttribute('height', this.element.comp.data.h || 0);
        currentMasks.push(rect);
      } else {
        rect = null;
      }

      path = createNS('path');

      if (properties[i].mode === 'n') {
        // TODO move this to a factory or to a constructor
        this.viewData[i] = {
          op: PropertyFactory.getProp(this.element, properties[i].o, 0, 0.01, this.element),
          prop: ShapePropertyFactory.getShapeProp(this.element, properties[i], 3),
          elem: path,
          lastPath: ''
        };
        defs.appendChild(path);
      } else {
        count += 1;
        path.setAttribute('fill', properties[i].mode === 's' ? '#000000' : '#ffffff');
        path.setAttribute('clip-rule', 'nonzero');
        var filterID;

        if (properties[i].x.k !== 0) {
          maskType = 'mask';
          maskRef = 'mask';
          x = PropertyFactory.getProp(this.element, properties[i].x, 0, null, this.element);
          filterID = createElementID();
          expansor = createNS('filter');
          expansor.setAttribute('id', filterID);
          feMorph = createNS('feMorphology');
          feMorph.setAttribute('operator', 'erode');
          feMorph.setAttribute('in', 'SourceGraphic');
          feMorph.setAttribute('radius', '0');
          expansor.appendChild(feMorph);
          defs.appendChild(expansor);
          path.setAttribute('stroke', properties[i].mode === 's' ? '#000000' : '#ffffff');
        } else {
          feMorph = null;
          x = null;
        } // TODO move this to a factory or to a constructor


        this.storedData[i] = {
          elem: path,
          x: x,
          expan: feMorph,
          lastPath: '',
          lastOperator: '',
          filterId: filterID,
          lastRadius: 0
        };

        if (properties[i].mode === 'i') {
          jLen = currentMasks.length;
          var g = createNS('g');

          for (j = 0; j < jLen; j += 1) {
            g.appendChild(currentMasks[j]);
          }

          var mask = createNS('mask');
          mask.setAttribute('mask-type', 'alpha');
          mask.setAttribute('id', layerId + '_' + count);
          mask.appendChild(path);
          defs.appendChild(mask);
          g.setAttribute('mask', 'url(' + getLocationHref() + '#' + layerId + '_' + count + ')');
          currentMasks.length = 0;
          currentMasks.push(g);
        } else {
          currentMasks.push(path);
        }

        if (properties[i].inv && !this.solidPath) {
          this.solidPath = this.createLayerSolidPath();
        } // TODO move this to a factory or to a constructor


        this.viewData[i] = {
          elem: path,
          lastPath: '',
          op: PropertyFactory.getProp(this.element, properties[i].o, 0, 0.01, this.element),
          prop: ShapePropertyFactory.getShapeProp(this.element, properties[i], 3),
          invRect: rect
        };

        if (!this.viewData[i].prop.k) {
          this.drawPath(properties[i], this.viewData[i].prop.v, this.viewData[i]);
        }
      }
    }

    this.maskElement = createNS(maskType);
    len = currentMasks.length;

    for (i = 0; i < len; i += 1) {
      this.maskElement.appendChild(currentMasks[i]);
    }

    if (count > 0) {
      this.maskElement.setAttribute('id', layerId);
      this.element.maskedElement.setAttribute(maskRef, 'url(' + getLocationHref() + '#' + layerId + ')');
      defs.appendChild(this.maskElement);
    }

    if (this.viewData.length) {
      this.element.addRenderableComponent(this);
    }
  }

  MaskElement.prototype.getMaskProperty = function (pos) {
    return this.viewData[pos].prop;
  };

  MaskElement.prototype.renderFrame = function (isFirstFrame) {
    var finalMat = this.element.finalTransform.mat;
    var i;
    var len = this.masksProperties.length;

    for (i = 0; i < len; i += 1) {
      if (this.viewData[i].prop._mdf || isFirstFrame) {
        this.drawPath(this.masksProperties[i], this.viewData[i].prop.v, this.viewData[i]);
      }

      if (this.viewData[i].op._mdf || isFirstFrame) {
        this.viewData[i].elem.setAttribute('fill-opacity', this.viewData[i].op.v);
      }

      if (this.masksProperties[i].mode !== 'n') {
        if (this.viewData[i].invRect && (this.element.finalTransform.mProp._mdf || isFirstFrame)) {
          this.viewData[i].invRect.setAttribute('transform', finalMat.getInverseMatrix().to2dCSS());
        }

        if (this.storedData[i].x && (this.storedData[i].x._mdf || isFirstFrame)) {
          var feMorph = this.storedData[i].expan;

          if (this.storedData[i].x.v < 0) {
            if (this.storedData[i].lastOperator !== 'erode') {
              this.storedData[i].lastOperator = 'erode';
              this.storedData[i].elem.setAttribute('filter', 'url(' + getLocationHref() + '#' + this.storedData[i].filterId + ')');
            }

            feMorph.setAttribute('radius', -this.storedData[i].x.v);
          } else {
            if (this.storedData[i].lastOperator !== 'dilate') {
              this.storedData[i].lastOperator = 'dilate';
              this.storedData[i].elem.setAttribute('filter', null);
            }

            this.storedData[i].elem.setAttribute('stroke-width', this.storedData[i].x.v * 2);
          }
        }
      }
    }
  };

  MaskElement.prototype.getMaskelement = function () {
    return this.maskElement;
  };

  MaskElement.prototype.createLayerSolidPath = function () {
    var path = 'M0,0 ';
    path += ' h' + this.globalData.compSize.w;
    path += ' v' + this.globalData.compSize.h;
    path += ' h-' + this.globalData.compSize.w;
    path += ' v-' + this.globalData.compSize.h + ' ';
    return path;
  };

  MaskElement.prototype.drawPath = function (pathData, pathNodes, viewData) {
    var pathString = ' M' + pathNodes.v[0][0] + ',' + pathNodes.v[0][1];
    var i;
    var len;
    len = pathNodes._length;

    for (i = 1; i < len; i += 1) {
      // pathString += " C"+pathNodes.o[i-1][0]+','+pathNodes.o[i-1][1] + " "+pathNodes.i[i][0]+','+pathNodes.i[i][1] + " "+pathNodes.v[i][0]+','+pathNodes.v[i][1];
      pathString += ' C' + pathNodes.o[i - 1][0] + ',' + pathNodes.o[i - 1][1] + ' ' + pathNodes.i[i][0] + ',' + pathNodes.i[i][1] + ' ' + pathNodes.v[i][0] + ',' + pathNodes.v[i][1];
    } // pathString += " C"+pathNodes.o[i-1][0]+','+pathNodes.o[i-1][1] + " "+pathNodes.i[0][0]+','+pathNodes.i[0][1] + " "+pathNodes.v[0][0]+','+pathNodes.v[0][1];


    if (pathNodes.c && len > 1) {
      pathString += ' C' + pathNodes.o[i - 1][0] + ',' + pathNodes.o[i - 1][1] + ' ' + pathNodes.i[0][0] + ',' + pathNodes.i[0][1] + ' ' + pathNodes.v[0][0] + ',' + pathNodes.v[0][1];
    } // pathNodes.__renderedString = pathString;


    if (viewData.lastPath !== pathString) {
      var pathShapeValue = '';

      if (viewData.elem) {
        if (pathNodes.c) {
          pathShapeValue = pathData.inv ? this.solidPath + pathString : pathString;
        }

        viewData.elem.setAttribute('d', pathShapeValue);
      }

      viewData.lastPath = pathString;
    }
  };

  MaskElement.prototype.destroy = function () {
    this.element = null;
    this.globalData = null;
    this.maskElement = null;
    this.data = null;
    this.masksProperties = null;
  };

  var filtersFactory = function () {
    var ob = {};
    ob.createFilter = createFilter;
    ob.createAlphaToLuminanceFilter = createAlphaToLuminanceFilter;

    function createFilter(filId, skipCoordinates) {
      var fil = createNS('filter');
      fil.setAttribute('id', filId);

      if (skipCoordinates !== true) {
        fil.setAttribute('filterUnits', 'objectBoundingBox');
        fil.setAttribute('x', '0%');
        fil.setAttribute('y', '0%');
        fil.setAttribute('width', '100%');
        fil.setAttribute('height', '100%');
      }

      return fil;
    }

    function createAlphaToLuminanceFilter() {
      var feColorMatrix = createNS('feColorMatrix');
      feColorMatrix.setAttribute('type', 'matrix');
      feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
      feColorMatrix.setAttribute('values', '0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1');
      return feColorMatrix;
    }

    return ob;
  }();

  var featureSupport = function () {
    var ob = {
      maskType: true
    };

    if (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) {
      ob.maskType = false;
    }

    return ob;
  }();

  function SVGTintFilter(filter, filterManager) {
    this.filterManager = filterManager;
    var feColorMatrix = createNS('feColorMatrix');
    feColorMatrix.setAttribute('type', 'matrix');
    feColorMatrix.setAttribute('color-interpolation-filters', 'linearRGB');
    feColorMatrix.setAttribute('values', '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0');
    feColorMatrix.setAttribute('result', 'f1');
    filter.appendChild(feColorMatrix);
    feColorMatrix = createNS('feColorMatrix');
    feColorMatrix.setAttribute('type', 'matrix');
    feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
    feColorMatrix.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0');
    feColorMatrix.setAttribute('result', 'f2');
    filter.appendChild(feColorMatrix);
    this.matrixFilter = feColorMatrix;

    if (filterManager.effectElements[2].p.v !== 100 || filterManager.effectElements[2].p.k) {
      var feMerge = createNS('feMerge');
      filter.appendChild(feMerge);
      var feMergeNode;
      feMergeNode = createNS('feMergeNode');
      feMergeNode.setAttribute('in', 'SourceGraphic');
      feMerge.appendChild(feMergeNode);
      feMergeNode = createNS('feMergeNode');
      feMergeNode.setAttribute('in', 'f2');
      feMerge.appendChild(feMergeNode);
    }
  }

  SVGTintFilter.prototype.renderFrame = function (forceRender) {
    if (forceRender || this.filterManager._mdf) {
      var colorBlack = this.filterManager.effectElements[0].p.v;
      var colorWhite = this.filterManager.effectElements[1].p.v;
      var opacity = this.filterManager.effectElements[2].p.v / 100;
      this.matrixFilter.setAttribute('values', colorWhite[0] - colorBlack[0] + ' 0 0 0 ' + colorBlack[0] + ' ' + (colorWhite[1] - colorBlack[1]) + ' 0 0 0 ' + colorBlack[1] + ' ' + (colorWhite[2] - colorBlack[2]) + ' 0 0 0 ' + colorBlack[2] + ' 0 0 0 ' + opacity + ' 0');
    }
  };

  function SVGFillFilter(filter, filterManager) {
    this.filterManager = filterManager;
    var feColorMatrix = createNS('feColorMatrix');
    feColorMatrix.setAttribute('type', 'matrix');
    feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
    feColorMatrix.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0');
    filter.appendChild(feColorMatrix);
    this.matrixFilter = feColorMatrix;
  }

  SVGFillFilter.prototype.renderFrame = function (forceRender) {
    if (forceRender || this.filterManager._mdf) {
      var color = this.filterManager.effectElements[2].p.v;
      var opacity = this.filterManager.effectElements[6].p.v;
      this.matrixFilter.setAttribute('values', '0 0 0 0 ' + color[0] + ' 0 0 0 0 ' + color[1] + ' 0 0 0 0 ' + color[2] + ' 0 0 0 ' + opacity + ' 0');
    }
  };

  function SVGStrokeEffect(elem, filterManager) {
    this.initialized = false;
    this.filterManager = filterManager;
    this.elem = elem;
    this.paths = [];
  }

  SVGStrokeEffect.prototype.initialize = function () {
    var elemChildren = this.elem.layerElement.children || this.elem.layerElement.childNodes;
    var path;
    var groupPath;
    var i;
    var len;

    if (this.filterManager.effectElements[1].p.v === 1) {
      len = this.elem.maskManager.masksProperties.length;
      i = 0;
    } else {
      i = this.filterManager.effectElements[0].p.v - 1;
      len = i + 1;
    }

    groupPath = createNS('g');
    groupPath.setAttribute('fill', 'none');
    groupPath.setAttribute('stroke-linecap', 'round');
    groupPath.setAttribute('stroke-dashoffset', 1);

    for (i; i < len; i += 1) {
      path = createNS('path');
      groupPath.appendChild(path);
      this.paths.push({
        p: path,
        m: i
      });
    }

    if (this.filterManager.effectElements[10].p.v === 3) {
      var mask = createNS('mask');
      var id = createElementID();
      mask.setAttribute('id', id);
      mask.setAttribute('mask-type', 'alpha');
      mask.appendChild(groupPath);
      this.elem.globalData.defs.appendChild(mask);
      var g = createNS('g');
      g.setAttribute('mask', 'url(' + getLocationHref() + '#' + id + ')');

      while (elemChildren[0]) {
        g.appendChild(elemChildren[0]);
      }

      this.elem.layerElement.appendChild(g);
      this.masker = mask;
      groupPath.setAttribute('stroke', '#fff');
    } else if (this.filterManager.effectElements[10].p.v === 1 || this.filterManager.effectElements[10].p.v === 2) {
      if (this.filterManager.effectElements[10].p.v === 2) {
        elemChildren = this.elem.layerElement.children || this.elem.layerElement.childNodes;

        while (elemChildren.length) {
          this.elem.layerElement.removeChild(elemChildren[0]);
        }
      }

      this.elem.layerElement.appendChild(groupPath);
      this.elem.layerElement.removeAttribute('mask');
      groupPath.setAttribute('stroke', '#fff');
    }

    this.initialized = true;
    this.pathMasker = groupPath;
  };

  SVGStrokeEffect.prototype.renderFrame = function (forceRender) {
    if (!this.initialized) {
      this.initialize();
    }

    var i;
    var len = this.paths.length;
    var mask;
    var path;

    for (i = 0; i < len; i += 1) {
      if (this.paths[i].m !== -1) {
        mask = this.elem.maskManager.viewData[this.paths[i].m];
        path = this.paths[i].p;

        if (forceRender || this.filterManager._mdf || mask.prop._mdf) {
          path.setAttribute('d', mask.lastPath);
        }

        if (forceRender || this.filterManager.effectElements[9].p._mdf || this.filterManager.effectElements[4].p._mdf || this.filterManager.effectElements[7].p._mdf || this.filterManager.effectElements[8].p._mdf || mask.prop._mdf) {
          var dasharrayValue;

          if (this.filterManager.effectElements[7].p.v !== 0 || this.filterManager.effectElements[8].p.v !== 100) {
            var s = Math.min(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) * 0.01;
            var e = Math.max(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) * 0.01;
            var l = path.getTotalLength();
            dasharrayValue = '0 0 0 ' + l * s + ' ';
            var lineLength = l * (e - s);
            var segment = 1 + this.filterManager.effectElements[4].p.v * 2 * this.filterManager.effectElements[9].p.v * 0.01;
            var units = Math.floor(lineLength / segment);
            var j;

            for (j = 0; j < units; j += 1) {
              dasharrayValue += '1 ' + this.filterManager.effectElements[4].p.v * 2 * this.filterManager.effectElements[9].p.v * 0.01 + ' ';
            }

            dasharrayValue += '0 ' + l * 10 + ' 0 0';
          } else {
            dasharrayValue = '1 ' + this.filterManager.effectElements[4].p.v * 2 * this.filterManager.effectElements[9].p.v * 0.01;
          }

          path.setAttribute('stroke-dasharray', dasharrayValue);
        }
      }
    }

    if (forceRender || this.filterManager.effectElements[4].p._mdf) {
      this.pathMasker.setAttribute('stroke-width', this.filterManager.effectElements[4].p.v * 2);
    }

    if (forceRender || this.filterManager.effectElements[6].p._mdf) {
      this.pathMasker.setAttribute('opacity', this.filterManager.effectElements[6].p.v);
    }

    if (this.filterManager.effectElements[10].p.v === 1 || this.filterManager.effectElements[10].p.v === 2) {
      if (forceRender || this.filterManager.effectElements[3].p._mdf) {
        var color = this.filterManager.effectElements[3].p.v;
        this.pathMasker.setAttribute('stroke', 'rgb(' + bmFloor(color[0] * 255) + ',' + bmFloor(color[1] * 255) + ',' + bmFloor(color[2] * 255) + ')');
      }
    }
  };

  function SVGTritoneFilter(filter, filterManager) {
    this.filterManager = filterManager;
    var feColorMatrix = createNS('feColorMatrix');
    feColorMatrix.setAttribute('type', 'matrix');
    feColorMatrix.setAttribute('color-interpolation-filters', 'linearRGB');
    feColorMatrix.setAttribute('values', '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0');
    feColorMatrix.setAttribute('result', 'f1');
    filter.appendChild(feColorMatrix);
    var feComponentTransfer = createNS('feComponentTransfer');
    feComponentTransfer.setAttribute('color-interpolation-filters', 'sRGB');
    filter.appendChild(feComponentTransfer);
    this.matrixFilter = feComponentTransfer;
    var feFuncR = createNS('feFuncR');
    feFuncR.setAttribute('type', 'table');
    feComponentTransfer.appendChild(feFuncR);
    this.feFuncR = feFuncR;
    var feFuncG = createNS('feFuncG');
    feFuncG.setAttribute('type', 'table');
    feComponentTransfer.appendChild(feFuncG);
    this.feFuncG = feFuncG;
    var feFuncB = createNS('feFuncB');
    feFuncB.setAttribute('type', 'table');
    feComponentTransfer.appendChild(feFuncB);
    this.feFuncB = feFuncB;
  }

  SVGTritoneFilter.prototype.renderFrame = function (forceRender) {
    if (forceRender || this.filterManager._mdf) {
      var color1 = this.filterManager.effectElements[0].p.v;
      var color2 = this.filterManager.effectElements[1].p.v;
      var color3 = this.filterManager.effectElements[2].p.v;
      var tableR = color3[0] + ' ' + color2[0] + ' ' + color1[0];
      var tableG = color3[1] + ' ' + color2[1] + ' ' + color1[1];
      var tableB = color3[2] + ' ' + color2[2] + ' ' + color1[2];
      this.feFuncR.setAttribute('tableValues', tableR);
      this.feFuncG.setAttribute('tableValues', tableG);
      this.feFuncB.setAttribute('tableValues', tableB); // var opacity = this.filterManager.effectElements[2].p.v/100;
      // this.matrixFilter.setAttribute('values',(colorWhite[0]- colorBlack[0])+' 0 0 0 '+ colorBlack[0] +' '+ (colorWhite[1]- colorBlack[1]) +' 0 0 0 '+ colorBlack[1] +' '+ (colorWhite[2]- colorBlack[2]) +' 0 0 0 '+ colorBlack[2] +' 0 0 0 ' + opacity + ' 0');
    }
  };

  function SVGProLevelsFilter(filter, filterManager) {
    this.filterManager = filterManager;
    var effectElements = this.filterManager.effectElements;
    var feComponentTransfer = createNS('feComponentTransfer');

    if (effectElements[10].p.k || effectElements[10].p.v !== 0 || effectElements[11].p.k || effectElements[11].p.v !== 1 || effectElements[12].p.k || effectElements[12].p.v !== 1 || effectElements[13].p.k || effectElements[13].p.v !== 0 || effectElements[14].p.k || effectElements[14].p.v !== 1) {
      this.feFuncR = this.createFeFunc('feFuncR', feComponentTransfer);
    }

    if (effectElements[17].p.k || effectElements[17].p.v !== 0 || effectElements[18].p.k || effectElements[18].p.v !== 1 || effectElements[19].p.k || effectElements[19].p.v !== 1 || effectElements[20].p.k || effectElements[20].p.v !== 0 || effectElements[21].p.k || effectElements[21].p.v !== 1) {
      this.feFuncG = this.createFeFunc('feFuncG', feComponentTransfer);
    }

    if (effectElements[24].p.k || effectElements[24].p.v !== 0 || effectElements[25].p.k || effectElements[25].p.v !== 1 || effectElements[26].p.k || effectElements[26].p.v !== 1 || effectElements[27].p.k || effectElements[27].p.v !== 0 || effectElements[28].p.k || effectElements[28].p.v !== 1) {
      this.feFuncB = this.createFeFunc('feFuncB', feComponentTransfer);
    }

    if (effectElements[31].p.k || effectElements[31].p.v !== 0 || effectElements[32].p.k || effectElements[32].p.v !== 1 || effectElements[33].p.k || effectElements[33].p.v !== 1 || effectElements[34].p.k || effectElements[34].p.v !== 0 || effectElements[35].p.k || effectElements[35].p.v !== 1) {
      this.feFuncA = this.createFeFunc('feFuncA', feComponentTransfer);
    }

    if (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) {
      feComponentTransfer.setAttribute('color-interpolation-filters', 'sRGB');
      filter.appendChild(feComponentTransfer);
      feComponentTransfer = createNS('feComponentTransfer');
    }

    if (effectElements[3].p.k || effectElements[3].p.v !== 0 || effectElements[4].p.k || effectElements[4].p.v !== 1 || effectElements[5].p.k || effectElements[5].p.v !== 1 || effectElements[6].p.k || effectElements[6].p.v !== 0 || effectElements[7].p.k || effectElements[7].p.v !== 1) {
      feComponentTransfer.setAttribute('color-interpolation-filters', 'sRGB');
      filter.appendChild(feComponentTransfer);
      this.feFuncRComposed = this.createFeFunc('feFuncR', feComponentTransfer);
      this.feFuncGComposed = this.createFeFunc('feFuncG', feComponentTransfer);
      this.feFuncBComposed = this.createFeFunc('feFuncB', feComponentTransfer);
    }
  }

  SVGProLevelsFilter.prototype.createFeFunc = function (type, feComponentTransfer) {
    var feFunc = createNS(type);
    feFunc.setAttribute('type', 'table');
    feComponentTransfer.appendChild(feFunc);
    return feFunc;
  };

  SVGProLevelsFilter.prototype.getTableValue = function (inputBlack, inputWhite, gamma, outputBlack, outputWhite) {
    var cnt = 0;
    var segments = 256;
    var perc;
    var min = Math.min(inputBlack, inputWhite);
    var max = Math.max(inputBlack, inputWhite);
    var table = Array.call(null, {
      length: segments
    });
    var colorValue;
    var pos = 0;
    var outputDelta = outputWhite - outputBlack;
    var inputDelta = inputWhite - inputBlack;

    while (cnt <= 256) {
      perc = cnt / 256;

      if (perc <= min) {
        colorValue = inputDelta < 0 ? outputWhite : outputBlack;
      } else if (perc >= max) {
        colorValue = inputDelta < 0 ? outputBlack : outputWhite;
      } else {
        colorValue = outputBlack + outputDelta * Math.pow((perc - inputBlack) / inputDelta, 1 / gamma);
      }

      table[pos] = colorValue;
      pos += 1;
      cnt += 256 / (segments - 1);
    }

    return table.join(' ');
  };

  SVGProLevelsFilter.prototype.renderFrame = function (forceRender) {
    if (forceRender || this.filterManager._mdf) {
      var val;
      var effectElements = this.filterManager.effectElements;

      if (this.feFuncRComposed && (forceRender || effectElements[3].p._mdf || effectElements[4].p._mdf || effectElements[5].p._mdf || effectElements[6].p._mdf || effectElements[7].p._mdf)) {
        val = this.getTableValue(effectElements[3].p.v, effectElements[4].p.v, effectElements[5].p.v, effectElements[6].p.v, effectElements[7].p.v);
        this.feFuncRComposed.setAttribute('tableValues', val);
        this.feFuncGComposed.setAttribute('tableValues', val);
        this.feFuncBComposed.setAttribute('tableValues', val);
      }

      if (this.feFuncR && (forceRender || effectElements[10].p._mdf || effectElements[11].p._mdf || effectElements[12].p._mdf || effectElements[13].p._mdf || effectElements[14].p._mdf)) {
        val = this.getTableValue(effectElements[10].p.v, effectElements[11].p.v, effectElements[12].p.v, effectElements[13].p.v, effectElements[14].p.v);
        this.feFuncR.setAttribute('tableValues', val);
      }

      if (this.feFuncG && (forceRender || effectElements[17].p._mdf || effectElements[18].p._mdf || effectElements[19].p._mdf || effectElements[20].p._mdf || effectElements[21].p._mdf)) {
        val = this.getTableValue(effectElements[17].p.v, effectElements[18].p.v, effectElements[19].p.v, effectElements[20].p.v, effectElements[21].p.v);
        this.feFuncG.setAttribute('tableValues', val);
      }

      if (this.feFuncB && (forceRender || effectElements[24].p._mdf || effectElements[25].p._mdf || effectElements[26].p._mdf || effectElements[27].p._mdf || effectElements[28].p._mdf)) {
        val = this.getTableValue(effectElements[24].p.v, effectElements[25].p.v, effectElements[26].p.v, effectElements[27].p.v, effectElements[28].p.v);
        this.feFuncB.setAttribute('tableValues', val);
      }

      if (this.feFuncA && (forceRender || effectElements[31].p._mdf || effectElements[32].p._mdf || effectElements[33].p._mdf || effectElements[34].p._mdf || effectElements[35].p._mdf)) {
        val = this.getTableValue(effectElements[31].p.v, effectElements[32].p.v, effectElements[33].p.v, effectElements[34].p.v, effectElements[35].p.v);
        this.feFuncA.setAttribute('tableValues', val);
      }
    }
  };

  function SVGDropShadowEffect(filter, filterManager) {
    var filterSize = filterManager.container.globalData.renderConfig.filterSize;
    filter.setAttribute('x', filterSize.x);
    filter.setAttribute('y', filterSize.y);
    filter.setAttribute('width', filterSize.width);
    filter.setAttribute('height', filterSize.height);
    this.filterManager = filterManager;
    var feGaussianBlur = createNS('feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceAlpha');
    feGaussianBlur.setAttribute('result', 'drop_shadow_1');
    feGaussianBlur.setAttribute('stdDeviation', '0');
    this.feGaussianBlur = feGaussianBlur;
    filter.appendChild(feGaussianBlur);
    var feOffset = createNS('feOffset');
    feOffset.setAttribute('dx', '25');
    feOffset.setAttribute('dy', '0');
    feOffset.setAttribute('in', 'drop_shadow_1');
    feOffset.setAttribute('result', 'drop_shadow_2');
    this.feOffset = feOffset;
    filter.appendChild(feOffset);
    var feFlood = createNS('feFlood');
    feFlood.setAttribute('flood-color', '#00ff00');
    feFlood.setAttribute('flood-opacity', '1');
    feFlood.setAttribute('result', 'drop_shadow_3');
    this.feFlood = feFlood;
    filter.appendChild(feFlood);
    var feComposite = createNS('feComposite');
    feComposite.setAttribute('in', 'drop_shadow_3');
    feComposite.setAttribute('in2', 'drop_shadow_2');
    feComposite.setAttribute('operator', 'in');
    feComposite.setAttribute('result', 'drop_shadow_4');
    filter.appendChild(feComposite);
    var feMerge = createNS('feMerge');
    filter.appendChild(feMerge);
    var feMergeNode;
    feMergeNode = createNS('feMergeNode');
    feMerge.appendChild(feMergeNode);
    feMergeNode = createNS('feMergeNode');
    feMergeNode.setAttribute('in', 'SourceGraphic');
    this.feMergeNode = feMergeNode;
    this.feMerge = feMerge;
    this.originalNodeAdded = false;
    feMerge.appendChild(feMergeNode);
  }

  SVGDropShadowEffect.prototype.renderFrame = function (forceRender) {
    if (forceRender || this.filterManager._mdf) {
      if (forceRender || this.filterManager.effectElements[4].p._mdf) {
        this.feGaussianBlur.setAttribute('stdDeviation', this.filterManager.effectElements[4].p.v / 4);
      }

      if (forceRender || this.filterManager.effectElements[0].p._mdf) {
        var col = this.filterManager.effectElements[0].p.v;
        this.feFlood.setAttribute('flood-color', rgbToHex(Math.round(col[0] * 255), Math.round(col[1] * 255), Math.round(col[2] * 255)));
      }

      if (forceRender || this.filterManager.effectElements[1].p._mdf) {
        this.feFlood.setAttribute('flood-opacity', this.filterManager.effectElements[1].p.v / 255);
      }

      if (forceRender || this.filterManager.effectElements[2].p._mdf || this.filterManager.effectElements[3].p._mdf) {
        var distance = this.filterManager.effectElements[3].p.v;
        var angle = (this.filterManager.effectElements[2].p.v - 90) * degToRads;
        var x = distance * Math.cos(angle);
        var y = distance * Math.sin(angle);
        this.feOffset.setAttribute('dx', x);
        this.feOffset.setAttribute('dy', y);
      }
      /* if(forceRender || this.filterManager.effectElements[5].p._mdf){
              if(this.filterManager.effectElements[5].p.v === 1 && this.originalNodeAdded) {
                  this.feMerge.removeChild(this.feMergeNode);
                  this.originalNodeAdded = false;
              } else if(this.filterManager.effectElements[5].p.v === 0 && !this.originalNodeAdded) {
                  this.feMerge.appendChild(this.feMergeNode);
                  this.originalNodeAdded = true;
              }
          } */

    }
  };

  var _svgMatteSymbols = [];

  function SVGMatte3Effect(filterElem, filterManager, elem) {
    this.initialized = false;
    this.filterManager = filterManager;
    this.filterElem = filterElem;
    this.elem = elem;
    elem.matteElement = createNS('g');
    elem.matteElement.appendChild(elem.layerElement);
    elem.matteElement.appendChild(elem.transformedElement);
    elem.baseElement = elem.matteElement;
  }

  SVGMatte3Effect.prototype.findSymbol = function (mask) {
    var i = 0;
    var len = _svgMatteSymbols.length;

    while (i < len) {
      if (_svgMatteSymbols[i] === mask) {
        return _svgMatteSymbols[i];
      }

      i += 1;
    }

    return null;
  };

  SVGMatte3Effect.prototype.replaceInParent = function (mask, symbolId) {
    var parentNode = mask.layerElement.parentNode;

    if (!parentNode) {
      return;
    }

    var children = parentNode.children;
    var i = 0;
    var len = children.length;

    while (i < len) {
      if (children[i] === mask.layerElement) {
        break;
      }

      i += 1;
    }

    var nextChild;

    if (i <= len - 2) {
      nextChild = children[i + 1];
    }

    var useElem = createNS('use');
    useElem.setAttribute('href', '#' + symbolId);

    if (nextChild) {
      parentNode.insertBefore(useElem, nextChild);
    } else {
      parentNode.appendChild(useElem);
    }
  };

  SVGMatte3Effect.prototype.setElementAsMask = function (elem, mask) {
    if (!this.findSymbol(mask)) {
      var symbolId = createElementID();
      var masker = createNS('mask');
      masker.setAttribute('id', mask.layerId);
      masker.setAttribute('mask-type', 'alpha');

      _svgMatteSymbols.push(mask);

      var defs = elem.globalData.defs;
      defs.appendChild(masker);
      var symbol = createNS('symbol');
      symbol.setAttribute('id', symbolId);
      this.replaceInParent(mask, symbolId);
      symbol.appendChild(mask.layerElement);
      defs.appendChild(symbol);
      var useElem = createNS('use');
      useElem.setAttribute('href', '#' + symbolId);
      masker.appendChild(useElem);
      mask.data.hd = false;
      mask.show();
    }

    elem.setMatte(mask.layerId);
  };

  SVGMatte3Effect.prototype.initialize = function () {
    var ind = this.filterManager.effectElements[0].p.v;
    var elements = this.elem.comp.elements;
    var i = 0;
    var len = elements.length;

    while (i < len) {
      if (elements[i] && elements[i].data.ind === ind) {
        this.setElementAsMask(this.elem, elements[i]);
      }

      i += 1;
    }

    this.initialized = true;
  };

  SVGMatte3Effect.prototype.renderFrame = function () {
    if (!this.initialized) {
      this.initialize();
    }
  };

  function SVGGaussianBlurEffect(filter, filterManager) {
    // Outset the filter region by 100% on all sides to accommodate blur expansion.
    filter.setAttribute('x', '-100%');
    filter.setAttribute('y', '-100%');
    filter.setAttribute('width', '300%');
    filter.setAttribute('height', '300%');
    this.filterManager = filterManager;
    var feGaussianBlur = createNS('feGaussianBlur');
    filter.appendChild(feGaussianBlur);
    this.feGaussianBlur = feGaussianBlur;
  }

  SVGGaussianBlurEffect.prototype.renderFrame = function (forceRender) {
    if (forceRender || this.filterManager._mdf) {
      // Empirical value, matching AE's blur appearance.
      var kBlurrinessToSigma = 0.3;
      var sigma = this.filterManager.effectElements[0].p.v * kBlurrinessToSigma; // Dimensions mapping:
      //
      //   1 -> horizontal & vertical
      //   2 -> horizontal only
      //   3 -> vertical only
      //

      var dimensions = this.filterManager.effectElements[1].p.v;
      var sigmaX = dimensions == 3 ? 0 : sigma; // eslint-disable-line eqeqeq

      var sigmaY = dimensions == 2 ? 0 : sigma; // eslint-disable-line eqeqeq

      this.feGaussianBlur.setAttribute('stdDeviation', sigmaX + ' ' + sigmaY); // Repeat edges mapping:
      //
      //   0 -> off -> duplicate
      //   1 -> on  -> wrap

      var edgeMode = this.filterManager.effectElements[2].p.v == 1 ? 'wrap' : 'duplicate'; // eslint-disable-line eqeqeq

      this.feGaussianBlur.setAttribute('edgeMode', edgeMode);
    }
  };

  var registeredEffects = {};

  function SVGEffects(elem) {
    var i;
    var len = elem.data.ef ? elem.data.ef.length : 0;
    var filId = createElementID();
    var fil = filtersFactory.createFilter(filId, true);
    var count = 0;
    this.filters = [];
    var filterManager;

    for (i = 0; i < len; i += 1) {
      filterManager = null;
      var type = elem.data.ef[i].ty;

      if (registeredEffects[type]) {
        var Effect = registeredEffects[type].effect;
        filterManager = new Effect(fil, elem.effectsManager.effectElements[i], elem);

        if (registeredEffects[type].countsAsEffect) {
          count += 1;
        }
      }

      if (elem.data.ef[i].ty === 20) {
        count += 1;
        filterManager = new SVGTintFilter(fil, elem.effectsManager.effectElements[i]);
      } else if (elem.data.ef[i].ty === 21) {
        count += 1;
        filterManager = new SVGFillFilter(fil, elem.effectsManager.effectElements[i]);
      } else if (elem.data.ef[i].ty === 22) {
        filterManager = new SVGStrokeEffect(elem, elem.effectsManager.effectElements[i]);
      } else if (elem.data.ef[i].ty === 23) {
        count += 1;
        filterManager = new SVGTritoneFilter(fil, elem.effectsManager.effectElements[i]);
      } else if (elem.data.ef[i].ty === 24) {
        count += 1;
        filterManager = new SVGProLevelsFilter(fil, elem.effectsManager.effectElements[i]);
      } else if (elem.data.ef[i].ty === 25) {
        count += 1;
        filterManager = new SVGDropShadowEffect(fil, elem.effectsManager.effectElements[i]);
      } else if (elem.data.ef[i].ty === 28) {
        // count += 1;
        filterManager = new SVGMatte3Effect(fil, elem.effectsManager.effectElements[i], elem);
      } else if (elem.data.ef[i].ty === 29) {
        count += 1;
        filterManager = new SVGGaussianBlurEffect(fil, elem.effectsManager.effectElements[i]);
      }

      if (filterManager) {
        this.filters.push(filterManager);
      }
    }

    if (count) {
      elem.globalData.defs.appendChild(fil);
      elem.layerElement.setAttribute('filter', 'url(' + getLocationHref() + '#' + filId + ')');
    }

    if (this.filters.length) {
      elem.addRenderableComponent(this);
    }
  }

  SVGEffects.prototype.renderFrame = function (_isFirstFrame) {
    var i;
    var len = this.filters.length;

    for (i = 0; i < len; i += 1) {
      this.filters[i].renderFrame(_isFirstFrame);
    }
  };

  function registerEffect(id, effect, countsAsEffect) {
    registeredEffects[id] = {
      effect: effect,
      countsAsEffect: countsAsEffect
    };
  }

  function SVGBaseElement() {}

  SVGBaseElement.prototype = {
    initRendererElement: function initRendererElement() {
      this.layerElement = createNS('g');
    },
    createContainerElements: function createContainerElements() {
      this.matteElement = createNS('g');
      this.transformedElement = this.layerElement;
      this.maskedElement = this.layerElement;
      this._sizeChanged = false;
      var layerElementParent = null; // If this layer acts as a mask for the following layer

      var filId;
      var fil;
      var gg;

      if (this.data.td) {
        if (this.data.td == 3 || this.data.td == 1) {
          // eslint-disable-line eqeqeq
          var masker = createNS('mask');
          masker.setAttribute('id', this.layerId);
          masker.setAttribute('mask-type', this.data.td == 3 ? 'luminance' : 'alpha'); // eslint-disable-line eqeqeq

          masker.appendChild(this.layerElement);
          layerElementParent = masker;
          this.globalData.defs.appendChild(masker); // This is only for IE and Edge when mask if of type alpha

          if (!featureSupport.maskType && this.data.td == 1) {
            // eslint-disable-line eqeqeq
            masker.setAttribute('mask-type', 'luminance');
            filId = createElementID();
            fil = filtersFactory.createFilter(filId);
            this.globalData.defs.appendChild(fil);
            fil.appendChild(filtersFactory.createAlphaToLuminanceFilter());
            gg = createNS('g');
            gg.appendChild(this.layerElement);
            layerElementParent = gg;
            masker.appendChild(gg);
            gg.setAttribute('filter', 'url(' + getLocationHref() + '#' + filId + ')');
          }
        } else if (this.data.td == 2) {
          // eslint-disable-line eqeqeq
          var maskGroup = createNS('mask');
          maskGroup.setAttribute('id', this.layerId);
          maskGroup.setAttribute('mask-type', 'alpha');
          var maskGrouper = createNS('g');
          maskGroup.appendChild(maskGrouper);
          filId = createElementID();
          fil = filtersFactory.createFilter(filId); /// /
          // This solution doesn't work on Android when meta tag with viewport attribute is set

          /* var feColorMatrix = createNS('feColorMatrix');
                  feColorMatrix.setAttribute('type', 'matrix');
                  feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB');
                  feColorMatrix.setAttribute('values','1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 -1 1');
                  fil.appendChild(feColorMatrix); */
          /// /

          var feCTr = createNS('feComponentTransfer');
          feCTr.setAttribute('in', 'SourceGraphic');
          fil.appendChild(feCTr);
          var feFunc = createNS('feFuncA');
          feFunc.setAttribute('type', 'table');
          feFunc.setAttribute('tableValues', '1.0 0.0');
          feCTr.appendChild(feFunc); /// /

          this.globalData.defs.appendChild(fil);
          var alphaRect = createNS('rect');
          alphaRect.setAttribute('width', this.comp.data.w);
          alphaRect.setAttribute('height', this.comp.data.h);
          alphaRect.setAttribute('x', '0');
          alphaRect.setAttribute('y', '0');
          alphaRect.setAttribute('fill', '#ffffff');
          alphaRect.setAttribute('opacity', '0');
          maskGrouper.setAttribute('filter', 'url(' + getLocationHref() + '#' + filId + ')');
          maskGrouper.appendChild(alphaRect);
          maskGrouper.appendChild(this.layerElement);
          layerElementParent = maskGrouper;

          if (!featureSupport.maskType) {
            maskGroup.setAttribute('mask-type', 'luminance');
            fil.appendChild(filtersFactory.createAlphaToLuminanceFilter());
            gg = createNS('g');
            maskGrouper.appendChild(alphaRect);
            gg.appendChild(this.layerElement);
            layerElementParent = gg;
            maskGrouper.appendChild(gg);
          }

          this.globalData.defs.appendChild(maskGroup);
        }
      } else if (this.data.tt) {
        this.matteElement.appendChild(this.layerElement);
        layerElementParent = this.matteElement;
        this.baseElement = this.matteElement;
      } else {
        this.baseElement = this.layerElement;
      }

      if (this.data.ln) {
        this.layerElement.setAttribute('id', this.data.ln);
      }

      if (this.data.cl) {
        this.layerElement.setAttribute('class', this.data.cl);
      } // Clipping compositions to hide content that exceeds boundaries. If collapsed transformations is on, component should not be clipped


      if (this.data.ty === 0 && !this.data.hd) {
        var cp = createNS('clipPath');
        var pt = createNS('path');
        pt.setAttribute('d', 'M0,0 L' + this.data.w + ',0 L' + this.data.w + ',' + this.data.h + ' L0,' + this.data.h + 'z');
        var clipId = createElementID();
        cp.setAttribute('id', clipId);
        cp.appendChild(pt);
        this.globalData.defs.appendChild(cp);

        if (this.checkMasks()) {
          var cpGroup = createNS('g');
          cpGroup.setAttribute('clip-path', 'url(' + getLocationHref() + '#' + clipId + ')');
          cpGroup.appendChild(this.layerElement);
          this.transformedElement = cpGroup;

          if (layerElementParent) {
            layerElementParent.appendChild(this.transformedElement);
          } else {
            this.baseElement = this.transformedElement;
          }
        } else {
          this.layerElement.setAttribute('clip-path', 'url(' + getLocationHref() + '#' + clipId + ')');
        }
      }

      if (this.data.bm !== 0) {
        this.setBlendMode();
      }
    },
    renderElement: function renderElement() {
      if (this.finalTransform._matMdf) {
        this.transformedElement.setAttribute('transform', this.finalTransform.mat.to2dCSS());
      }

      if (this.finalTransform._opMdf) {
        this.transformedElement.setAttribute('opacity', this.finalTransform.mProp.o.v);
      }
    },
    destroyBaseElement: function destroyBaseElement() {
      this.layerElement = null;
      this.matteElement = null;
      this.maskManager.destroy();
    },
    getBaseElement: function getBaseElement() {
      if (this.data.hd) {
        return null;
      }

      return this.baseElement;
    },
    createRenderableComponents: function createRenderableComponents() {
      this.maskManager = new MaskElement(this.data, this, this.globalData);
      this.renderableEffectsManager = new SVGEffects(this);
    },
    setMatte: function setMatte(id) {
      if (!this.matteElement) {
        return;
      }

      this.matteElement.setAttribute('mask', 'url(' + getLocationHref() + '#' + id + ')');
    }
  };

  /**
   * @file
   * Handles AE's layer parenting property.
   *
   */
  function HierarchyElement() {}

  HierarchyElement.prototype = {
    /**
       * @function
       * Initializes hierarchy properties
       *
       */
    initHierarchy: function initHierarchy() {
      // element's parent list
      this.hierarchy = []; // if element is parent of another layer _isParent will be true

      this._isParent = false;
      this.checkParenting();
    },

    /**
       * @function
       * Sets layer's hierarchy.
       * @param {array} hierarch
       * layer's parent list
       *
       */
    setHierarchy: function setHierarchy(hierarchy) {
      this.hierarchy = hierarchy;
    },

    /**
       * @function
       * Sets layer as parent.
       *
       */
    setAsParent: function setAsParent() {
      this._isParent = true;
    },

    /**
       * @function
       * Searches layer's parenting chain
       *
       */
    checkParenting: function checkParenting() {
      if (this.data.parent !== undefined) {
        this.comp.buildElementParenting(this, this.data.parent, []);
      }
    }
  };

  function RenderableDOMElement() {}

  (function () {
    var _prototype = {
      initElement: function initElement(data, globalData, comp) {
        this.initFrame();
        this.initBaseData(data, globalData, comp);
        this.initTransform(data, globalData, comp);
        this.initHierarchy();
        this.initRenderable();
        this.initRendererElement();
        this.createContainerElements();
        this.createRenderableComponents();
        this.createContent();
        this.hide();
      },
      hide: function hide() {
        // console.log('HIDE', this);
        if (!this.hidden && (!this.isInRange || this.isTransparent)) {
          var elem = this.baseElement || this.layerElement;
          elem.style.display = 'none';
          this.hidden = true;
        }
      },
      show: function show() {
        // console.log('SHOW', this);
        if (this.isInRange && !this.isTransparent) {
          if (!this.data.hd) {
            var elem = this.baseElement || this.layerElement;
            elem.style.display = 'block';
          }

          this.hidden = false;
          this._isFirstFrame = true;
        }
      },
      renderFrame: function renderFrame() {
        // If it is exported as hidden (data.hd === true) no need to render
        // If it is not visible no need to render
        if (this.data.hd || this.hidden) {
          return;
        }

        this.renderTransform();
        this.renderRenderable();
        this.renderElement();
        this.renderInnerContent();

        if (this._isFirstFrame) {
          this._isFirstFrame = false;
        }
      },
      renderInnerContent: function renderInnerContent() {},
      prepareFrame: function prepareFrame(num) {
        this._mdf = false;
        this.prepareRenderableFrame(num);
        this.prepareProperties(num, this.isInRange);
        this.checkTransparency();
      },
      destroy: function destroy() {
        this.innerElem = null;
        this.destroyBaseElement();
      }
    };
    extendPrototype([RenderableElement, createProxyFunction(_prototype)], RenderableDOMElement);
  })();

  function IImageElement(data, globalData, comp) {
    this.assetData = globalData.getAssetData(data.refId);
    this.initElement(data, globalData, comp);
    this.sourceRect = {
      top: 0,
      left: 0,
      width: this.assetData.w,
      height: this.assetData.h
    };
  }

  extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], IImageElement);

  IImageElement.prototype.createContent = function () {
    var assetPath = this.globalData.getAssetsPath(this.assetData);
    this.innerElem = createNS('image');
    this.innerElem.setAttribute('width', this.assetData.w + 'px');
    this.innerElem.setAttribute('height', this.assetData.h + 'px');
    this.innerElem.setAttribute('preserveAspectRatio', this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio);
    this.innerElem.setAttributeNS('http://www.w3.org/1999/xlink', 'href', assetPath);
    this.layerElement.appendChild(this.innerElem);
  };

  IImageElement.prototype.sourceRectAtTime = function () {
    return this.sourceRect;
  };

  function ProcessedElement(element, position) {
    this.elem = element;
    this.pos = position;
  }

  function IShapeElement() {}

  IShapeElement.prototype = {
    addShapeToModifiers: function addShapeToModifiers(data) {
      var i;
      var len = this.shapeModifiers.length;

      for (i = 0; i < len; i += 1) {
        this.shapeModifiers[i].addShape(data);
      }
    },
    isShapeInAnimatedModifiers: function isShapeInAnimatedModifiers(data) {
      var i = 0;
      var len = this.shapeModifiers.length;

      while (i < len) {
        if (this.shapeModifiers[i].isAnimatedWithShape(data)) {
          return true;
        }
      }

      return false;
    },
    renderModifiers: function renderModifiers() {
      if (!this.shapeModifiers.length) {
        return;
      }

      var i;
      var len = this.shapes.length;

      for (i = 0; i < len; i += 1) {
        this.shapes[i].sh.reset();
      }

      len = this.shapeModifiers.length;
      var shouldBreakProcess;

      for (i = len - 1; i >= 0; i -= 1) {
        shouldBreakProcess = this.shapeModifiers[i].processShapes(this._isFirstFrame); // workaround to fix cases where a repeater resets the shape so the following processes get called twice
        // TODO: find a better solution for this

        if (shouldBreakProcess) {
          break;
        }
      }
    },
    searchProcessedElement: function searchProcessedElement(elem) {
      var elements = this.processedElements;
      var i = 0;
      var len = elements.length;

      while (i < len) {
        if (elements[i].elem === elem) {
          return elements[i].pos;
        }

        i += 1;
      }

      return 0;
    },
    addProcessedElement: function addProcessedElement(elem, pos) {
      var elements = this.processedElements;
      var i = elements.length;

      while (i) {
        i -= 1;

        if (elements[i].elem === elem) {
          elements[i].pos = pos;
          return;
        }
      }

      elements.push(new ProcessedElement(elem, pos));
    },
    prepareFrame: function prepareFrame(num) {
      this.prepareRenderableFrame(num);
      this.prepareProperties(num, this.isInRange);
    }
  };

  var lineCapEnum = {
    1: 'butt',
    2: 'round',
    3: 'square'
  };
  var lineJoinEnum = {
    1: 'miter',
    2: 'round',
    3: 'bevel'
  };

  function SVGShapeData(transformers, level, shape) {
    this.caches = [];
    this.styles = [];
    this.transformers = transformers;
    this.lStr = '';
    this.sh = shape;
    this.lvl = level; // TODO find if there are some cases where _isAnimated can be false.
    // For now, since shapes add up with other shapes. They have to be calculated every time.
    // One way of finding out is checking if all styles associated to this shape depend only of this shape

    this._isAnimated = !!shape.k; // TODO: commenting this for now since all shapes are animated

    var i = 0;
    var len = transformers.length;

    while (i < len) {
      if (transformers[i].mProps.dynamicProperties.length) {
        this._isAnimated = true;
        break;
      }

      i += 1;
    }
  }

  SVGShapeData.prototype.setAsAnimated = function () {
    this._isAnimated = true;
  };

  function SVGStyleData(data, level) {
    this.data = data;
    this.type = data.ty;
    this.d = '';
    this.lvl = level;
    this._mdf = false;
    this.closed = data.hd === true;
    this.pElem = createNS('path');
    this.msElem = null;
  }

  SVGStyleData.prototype.reset = function () {
    this.d = '';
    this._mdf = false;
  };

  function DashProperty(elem, data, renderer, container) {
    this.elem = elem;
    this.frameId = -1;
    this.dataProps = createSizedArray(data.length);
    this.renderer = renderer;
    this.k = false;
    this.dashStr = '';
    this.dashArray = createTypedArray('float32', data.length ? data.length - 1 : 0);
    this.dashoffset = createTypedArray('float32', 1);
    this.initDynamicPropertyContainer(container);
    var i;
    var len = data.length || 0;
    var prop;

    for (i = 0; i < len; i += 1) {
      prop = PropertyFactory.getProp(elem, data[i].v, 0, 0, this);
      this.k = prop.k || this.k;
      this.dataProps[i] = {
        n: data[i].n,
        p: prop
      };
    }

    if (!this.k) {
      this.getValue(true);
    }

    this._isAnimated = this.k;
  }

  DashProperty.prototype.getValue = function (forceRender) {
    if (this.elem.globalData.frameId === this.frameId && !forceRender) {
      return;
    }

    this.frameId = this.elem.globalData.frameId;
    this.iterateDynamicProperties();
    this._mdf = this._mdf || forceRender;

    if (this._mdf) {
      var i = 0;
      var len = this.dataProps.length;

      if (this.renderer === 'svg') {
        this.dashStr = '';
      }

      for (i = 0; i < len; i += 1) {
        if (this.dataProps[i].n !== 'o') {
          if (this.renderer === 'svg') {
            this.dashStr += ' ' + this.dataProps[i].p.v;
          } else {
            this.dashArray[i] = this.dataProps[i].p.v;
          }
        } else {
          this.dashoffset[0] = this.dataProps[i].p.v;
        }
      }
    }
  };

  extendPrototype([DynamicPropertyContainer], DashProperty);

  function SVGStrokeStyleData(elem, data, styleOb) {
    this.initDynamicPropertyContainer(elem);
    this.getValue = this.iterateDynamicProperties;
    this.o = PropertyFactory.getProp(elem, data.o, 0, 0.01, this);
    this.w = PropertyFactory.getProp(elem, data.w, 0, null, this);
    this.d = new DashProperty(elem, data.d || {}, 'svg', this);
    this.c = PropertyFactory.getProp(elem, data.c, 1, 255, this);
    this.style = styleOb;
    this._isAnimated = !!this._isAnimated;
  }

  extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData);

  function SVGFillStyleData(elem, data, styleOb) {
    this.initDynamicPropertyContainer(elem);
    this.getValue = this.iterateDynamicProperties;
    this.o = PropertyFactory.getProp(elem, data.o, 0, 0.01, this);
    this.c = PropertyFactory.getProp(elem, data.c, 1, 255, this);
    this.style = styleOb;
  }

  extendPrototype([DynamicPropertyContainer], SVGFillStyleData);

  function SVGNoStyleData(elem, data, styleOb) {
    this.initDynamicPropertyContainer(elem);
    this.getValue = this.iterateDynamicProperties;
    this.style = styleOb;
  }

  extendPrototype([DynamicPropertyContainer], SVGNoStyleData);

  function GradientProperty(elem, data, container) {
    this.data = data;
    this.c = createTypedArray('uint8c', data.p * 4);
    var cLength = data.k.k[0].s ? data.k.k[0].s.length - data.p * 4 : data.k.k.length - data.p * 4;
    this.o = createTypedArray('float32', cLength);
    this._cmdf = false;
    this._omdf = false;
    this._collapsable = this.checkCollapsable();
    this._hasOpacity = cLength;
    this.initDynamicPropertyContainer(container);
    this.prop = PropertyFactory.getProp(elem, data.k, 1, null, this);
    this.k = this.prop.k;
    this.getValue(true);
  }

  GradientProperty.prototype.comparePoints = function (values, points) {
    var i = 0;
    var len = this.o.length / 2;
    var diff;

    while (i < len) {
      diff = Math.abs(values[i * 4] - values[points * 4 + i * 2]);

      if (diff > 0.01) {
        return false;
      }

      i += 1;
    }

    return true;
  };

  GradientProperty.prototype.checkCollapsable = function () {
    if (this.o.length / 2 !== this.c.length / 4) {
      return false;
    }

    if (this.data.k.k[0].s) {
      var i = 0;
      var len = this.data.k.k.length;

      while (i < len) {
        if (!this.comparePoints(this.data.k.k[i].s, this.data.p)) {
          return false;
        }

        i += 1;
      }
    } else if (!this.comparePoints(this.data.k.k, this.data.p)) {
      return false;
    }

    return true;
  };

  GradientProperty.prototype.getValue = function (forceRender) {
    this.prop.getValue();
    this._mdf = false;
    this._cmdf = false;
    this._omdf = false;

    if (this.prop._mdf || forceRender) {
      var i;
      var len = this.data.p * 4;
      var mult;
      var val;

      for (i = 0; i < len; i += 1) {
        mult = i % 4 === 0 ? 100 : 255;
        val = Math.round(this.prop.v[i] * mult);

        if (this.c[i] !== val) {
          this.c[i] = val;
          this._cmdf = !forceRender;
        }
      }

      if (this.o.length) {
        len = this.prop.v.length;

        for (i = this.data.p * 4; i < len; i += 1) {
          mult = i % 2 === 0 ? 100 : 1;
          val = i % 2 === 0 ? Math.round(this.prop.v[i] * 100) : this.prop.v[i];

          if (this.o[i - this.data.p * 4] !== val) {
            this.o[i - this.data.p * 4] = val;
            this._omdf = !forceRender;
          }
        }
      }

      this._mdf = !forceRender;
    }
  };

  extendPrototype([DynamicPropertyContainer], GradientProperty);

  function SVGGradientFillStyleData(elem, data, styleOb) {
    this.initDynamicPropertyContainer(elem);
    this.getValue = this.iterateDynamicProperties;
    this.initGradientData(elem, data, styleOb);
  }

  SVGGradientFillStyleData.prototype.initGradientData = function (elem, data, styleOb) {
    this.o = PropertyFactory.getProp(elem, data.o, 0, 0.01, this);
    this.s = PropertyFactory.getProp(elem, data.s, 1, null, this);
    this.e = PropertyFactory.getProp(elem, data.e, 1, null, this);
    this.h = PropertyFactory.getProp(elem, data.h || {
      k: 0
    }, 0, 0.01, this);
    this.a = PropertyFactory.getProp(elem, data.a || {
      k: 0
    }, 0, degToRads, this);
    this.g = new GradientProperty(elem, data.g, this);
    this.style = styleOb;
    this.stops = [];
    this.setGradientData(styleOb.pElem, data);
    this.setGradientOpacity(data, styleOb);
    this._isAnimated = !!this._isAnimated;
  };

  SVGGradientFillStyleData.prototype.setGradientData = function (pathElement, data) {
    var gradientId = createElementID();
    var gfill = createNS(data.t === 1 ? 'linearGradient' : 'radialGradient');
    gfill.setAttribute('id', gradientId);
    gfill.setAttribute('spreadMethod', 'pad');
    gfill.setAttribute('gradientUnits', 'userSpaceOnUse');
    var stops = [];
    var stop;
    var j;
    var jLen;
    jLen = data.g.p * 4;

    for (j = 0; j < jLen; j += 4) {
      stop = createNS('stop');
      gfill.appendChild(stop);
      stops.push(stop);
    }

    pathElement.setAttribute(data.ty === 'gf' ? 'fill' : 'stroke', 'url(' + getLocationHref() + '#' + gradientId + ')');
    this.gf = gfill;
    this.cst = stops;
  };

  SVGGradientFillStyleData.prototype.setGradientOpacity = function (data, styleOb) {
    if (this.g._hasOpacity && !this.g._collapsable) {
      var stop;
      var j;
      var jLen;
      var mask = createNS('mask');
      var maskElement = createNS('path');
      mask.appendChild(maskElement);
      var opacityId = createElementID();
      var maskId = createElementID();
      mask.setAttribute('id', maskId);
      var opFill = createNS(data.t === 1 ? 'linearGradient' : 'radialGradient');
      opFill.setAttribute('id', opacityId);
      opFill.setAttribute('spreadMethod', 'pad');
      opFill.setAttribute('gradientUnits', 'userSpaceOnUse');
      jLen = data.g.k.k[0].s ? data.g.k.k[0].s.length : data.g.k.k.length;
      var stops = this.stops;

      for (j = data.g.p * 4; j < jLen; j += 2) {
        stop = createNS('stop');
        stop.setAttribute('stop-color', 'rgb(255,255,255)');
        opFill.appendChild(stop);
        stops.push(stop);
      }

      maskElement.setAttribute(data.ty === 'gf' ? 'fill' : 'stroke', 'url(' + getLocationHref() + '#' + opacityId + ')');

      if (data.ty === 'gs') {
        maskElement.setAttribute('stroke-linecap', lineCapEnum[data.lc || 2]);
        maskElement.setAttribute('stroke-linejoin', lineJoinEnum[data.lj || 2]);

        if (data.lj === 1) {
          maskElement.setAttribute('stroke-miterlimit', data.ml);
        }
      }

      this.of = opFill;
      this.ms = mask;
      this.ost = stops;
      this.maskId = maskId;
      styleOb.msElem = maskElement;
    }
  };

  extendPrototype([DynamicPropertyContainer], SVGGradientFillStyleData);

  function SVGGradientStrokeStyleData(elem, data, styleOb) {
    this.initDynamicPropertyContainer(elem);
    this.getValue = this.iterateDynamicProperties;
    this.w = PropertyFactory.getProp(elem, data.w, 0, null, this);
    this.d = new DashProperty(elem, data.d || {}, 'svg', this);
    this.initGradientData(elem, data, styleOb);
    this._isAnimated = !!this._isAnimated;
  }

  extendPrototype([SVGGradientFillStyleData, DynamicPropertyContainer], SVGGradientStrokeStyleData);

  function ShapeGroupData() {
    this.it = [];
    this.prevViewData = [];
    this.gr = createNS('g');
  }

  function SVGTransformData(mProps, op, container) {
    this.transform = {
      mProps: mProps,
      op: op,
      container: container
    };
    this.elements = [];
    this._isAnimated = this.transform.mProps.dynamicProperties.length || this.transform.op.effectsSequence.length;
  }

  var buildShapeString = function buildShapeString(pathNodes, length, closed, mat) {
    if (length === 0) {
      return '';
    }

    var _o = pathNodes.o;
    var _i = pathNodes.i;
    var _v = pathNodes.v;
    var i;
    var shapeString = ' M' + mat.applyToPointStringified(_v[0][0], _v[0][1]);

    for (i = 1; i < length; i += 1) {
      shapeString += ' C' + mat.applyToPointStringified(_o[i - 1][0], _o[i - 1][1]) + ' ' + mat.applyToPointStringified(_i[i][0], _i[i][1]) + ' ' + mat.applyToPointStringified(_v[i][0], _v[i][1]);
    }

    if (closed && length) {
      shapeString += ' C' + mat.applyToPointStringified(_o[i - 1][0], _o[i - 1][1]) + ' ' + mat.applyToPointStringified(_i[0][0], _i[0][1]) + ' ' + mat.applyToPointStringified(_v[0][0], _v[0][1]);
      shapeString += 'z';
    }

    return shapeString;
  };

  var SVGElementsRenderer = function () {
    var _identityMatrix = new Matrix();

    var _matrixHelper = new Matrix();

    var ob = {
      createRenderFunction: createRenderFunction
    };

    function createRenderFunction(data) {
      switch (data.ty) {
        case 'fl':
          return renderFill;

        case 'gf':
          return renderGradient;

        case 'gs':
          return renderGradientStroke;

        case 'st':
          return renderStroke;

        case 'sh':
        case 'el':
        case 'rc':
        case 'sr':
          return renderPath;

        case 'tr':
          return renderContentTransform;

        case 'no':
          return renderNoop;

        default:
          return null;
      }
    }

    function renderContentTransform(styleData, itemData, isFirstFrame) {
      if (isFirstFrame || itemData.transform.op._mdf) {
        itemData.transform.container.setAttribute('opacity', itemData.transform.op.v);
      }

      if (isFirstFrame || itemData.transform.mProps._mdf) {
        itemData.transform.container.setAttribute('transform', itemData.transform.mProps.v.to2dCSS());
      }
    }

    function renderNoop() {}

    function renderPath(styleData, itemData, isFirstFrame) {
      var j;
      var jLen;
      var pathStringTransformed;
      var redraw;
      var pathNodes;
      var l;
      var lLen = itemData.styles.length;
      var lvl = itemData.lvl;
      var paths;
      var mat;
      var props;
      var iterations;
      var k;

      for (l = 0; l < lLen; l += 1) {
        redraw = itemData.sh._mdf || isFirstFrame;

        if (itemData.styles[l].lvl < lvl) {
          mat = _matrixHelper.reset();
          iterations = lvl - itemData.styles[l].lvl;
          k = itemData.transformers.length - 1;

          while (!redraw && iterations > 0) {
            redraw = itemData.transformers[k].mProps._mdf || redraw;
            iterations -= 1;
            k -= 1;
          }

          if (redraw) {
            iterations = lvl - itemData.styles[l].lvl;
            k = itemData.transformers.length - 1;

            while (iterations > 0) {
              props = itemData.transformers[k].mProps.v.props;
              mat.transform(props[0], props[1], props[2], props[3], props[4], props[5], props[6], props[7], props[8], props[9], props[10], props[11], props[12], props[13], props[14], props[15]);
              iterations -= 1;
              k -= 1;
            }
          }
        } else {
          mat = _identityMatrix;
        }

        paths = itemData.sh.paths;
        jLen = paths._length;

        if (redraw) {
          pathStringTransformed = '';

          for (j = 0; j < jLen; j += 1) {
            pathNodes = paths.shapes[j];

            if (pathNodes && pathNodes._length) {
              pathStringTransformed += buildShapeString(pathNodes, pathNodes._length, pathNodes.c, mat);
            }
          }

          itemData.caches[l] = pathStringTransformed;
        } else {
          pathStringTransformed = itemData.caches[l];
        }

        itemData.styles[l].d += styleData.hd === true ? '' : pathStringTransformed;
        itemData.styles[l]._mdf = redraw || itemData.styles[l]._mdf;
      }
    }

    function renderFill(styleData, itemData, isFirstFrame) {
      var styleElem = itemData.style;

      if (itemData.c._mdf || isFirstFrame) {
        styleElem.pElem.setAttribute('fill', 'rgb(' + bmFloor(itemData.c.v[0]) + ',' + bmFloor(itemData.c.v[1]) + ',' + bmFloor(itemData.c.v[2]) + ')');
      }

      if (itemData.o._mdf || isFirstFrame) {
        styleElem.pElem.setAttribute('fill-opacity', itemData.o.v);
      }
    }

    function renderGradientStroke(styleData, itemData, isFirstFrame) {
      renderGradient(styleData, itemData, isFirstFrame);
      renderStroke(styleData, itemData, isFirstFrame);
    }

    function renderGradient(styleData, itemData, isFirstFrame) {
      var gfill = itemData.gf;
      var hasOpacity = itemData.g._hasOpacity;
      var pt1 = itemData.s.v;
      var pt2 = itemData.e.v;

      if (itemData.o._mdf || isFirstFrame) {
        var attr = styleData.ty === 'gf' ? 'fill-opacity' : 'stroke-opacity';
        itemData.style.pElem.setAttribute(attr, itemData.o.v);
      }

      if (itemData.s._mdf || isFirstFrame) {
        var attr1 = styleData.t === 1 ? 'x1' : 'cx';
        var attr2 = attr1 === 'x1' ? 'y1' : 'cy';
        gfill.setAttribute(attr1, pt1[0]);
        gfill.setAttribute(attr2, pt1[1]);

        if (hasOpacity && !itemData.g._collapsable) {
          itemData.of.setAttribute(attr1, pt1[0]);
          itemData.of.setAttribute(attr2, pt1[1]);
        }
      }

      var stops;
      var i;
      var len;
      var stop;

      if (itemData.g._cmdf || isFirstFrame) {
        stops = itemData.cst;
        var cValues = itemData.g.c;
        len = stops.length;

        for (i = 0; i < len; i += 1) {
          stop = stops[i];
          stop.setAttribute('offset', cValues[i * 4] + '%');
          stop.setAttribute('stop-color', 'rgb(' + cValues[i * 4 + 1] + ',' + cValues[i * 4 + 2] + ',' + cValues[i * 4 + 3] + ')');
        }
      }

      if (hasOpacity && (itemData.g._omdf || isFirstFrame)) {
        var oValues = itemData.g.o;

        if (itemData.g._collapsable) {
          stops = itemData.cst;
        } else {
          stops = itemData.ost;
        }

        len = stops.length;

        for (i = 0; i < len; i += 1) {
          stop = stops[i];

          if (!itemData.g._collapsable) {
            stop.setAttribute('offset', oValues[i * 2] + '%');
          }

          stop.setAttribute('stop-opacity', oValues[i * 2 + 1]);
        }
      }

      if (styleData.t === 1) {
        if (itemData.e._mdf || isFirstFrame) {
          gfill.setAttribute('x2', pt2[0]);
          gfill.setAttribute('y2', pt2[1]);

          if (hasOpacity && !itemData.g._collapsable) {
            itemData.of.setAttribute('x2', pt2[0]);
            itemData.of.setAttribute('y2', pt2[1]);
          }
        }
      } else {
        var rad;

        if (itemData.s._mdf || itemData.e._mdf || isFirstFrame) {
          rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
          gfill.setAttribute('r', rad);

          if (hasOpacity && !itemData.g._collapsable) {
            itemData.of.setAttribute('r', rad);
          }
        }

        if (itemData.e._mdf || itemData.h._mdf || itemData.a._mdf || isFirstFrame) {
          if (!rad) {
            rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
          }

          var ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0]);
          var percent = itemData.h.v;

          if (percent >= 1) {
            percent = 0.99;
          } else if (percent <= -1) {
            percent = -0.99;
          }

          var dist = rad * percent;
          var x = Math.cos(ang + itemData.a.v) * dist + pt1[0];
          var y = Math.sin(ang + itemData.a.v) * dist + pt1[1];
          gfill.setAttribute('fx', x);
          gfill.setAttribute('fy', y);

          if (hasOpacity && !itemData.g._collapsable) {
            itemData.of.setAttribute('fx', x);
            itemData.of.setAttribute('fy', y);
          }
        } // gfill.setAttribute('fy','200');

      }
    }

    function renderStroke(styleData, itemData, isFirstFrame) {
      var styleElem = itemData.style;
      var d = itemData.d;

      if (d && (d._mdf || isFirstFrame) && d.dashStr) {
        styleElem.pElem.setAttribute('stroke-dasharray', d.dashStr);
        styleElem.pElem.setAttribute('stroke-dashoffset', d.dashoffset[0]);
      }

      if (itemData.c && (itemData.c._mdf || isFirstFrame)) {
        styleElem.pElem.setAttribute('stroke', 'rgb(' + bmFloor(itemData.c.v[0]) + ',' + bmFloor(itemData.c.v[1]) + ',' + bmFloor(itemData.c.v[2]) + ')');
      }

      if (itemData.o._mdf || isFirstFrame) {
        styleElem.pElem.setAttribute('stroke-opacity', itemData.o.v);
      }

      if (itemData.w._mdf || isFirstFrame) {
        styleElem.pElem.setAttribute('stroke-width', itemData.w.v);

        if (styleElem.msElem) {
          styleElem.msElem.setAttribute('stroke-width', itemData.w.v);
        }
      }
    }

    return ob;
  }();

  function SVGShapeElement(data, globalData, comp) {
    // List of drawable elements
    this.shapes = []; // Full shape data

    this.shapesData = data.shapes; // List of styles that will be applied to shapes

    this.stylesList = []; // List of modifiers that will be applied to shapes

    this.shapeModifiers = []; // List of items in shape tree

    this.itemsData = []; // List of items in previous shape tree

    this.processedElements = []; // List of animated components

    this.animatedContents = [];
    this.initElement(data, globalData, comp); // Moving any property that doesn't get too much access after initialization because of v8 way of handling more than 10 properties.
    // List of elements that have been created

    this.prevViewData = []; // Moving any property that doesn't get too much access after initialization because of v8 way of handling more than 10 properties.
  }

  extendPrototype([BaseElement, TransformElement, SVGBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableDOMElement], SVGShapeElement);

  SVGShapeElement.prototype.initSecondaryElement = function () {};

  SVGShapeElement.prototype.identityMatrix = new Matrix();

  SVGShapeElement.prototype.buildExpressionInterface = function () {};

  SVGShapeElement.prototype.createContent = function () {
    this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], true);
    this.filterUniqueShapes();
  };
  /*
  This method searches for multiple shapes that affect a single element and one of them is animated
  */


  SVGShapeElement.prototype.filterUniqueShapes = function () {
    var i;
    var len = this.shapes.length;
    var shape;
    var j;
    var jLen = this.stylesList.length;
    var style;
    var tempShapes = [];
    var areAnimated = false;

    for (j = 0; j < jLen; j += 1) {
      style = this.stylesList[j];
      areAnimated = false;
      tempShapes.length = 0;

      for (i = 0; i < len; i += 1) {
        shape = this.shapes[i];

        if (shape.styles.indexOf(style) !== -1) {
          tempShapes.push(shape);
          areAnimated = shape._isAnimated || areAnimated;
        }
      }

      if (tempShapes.length > 1 && areAnimated) {
        this.setShapesAsAnimated(tempShapes);
      }
    }
  };

  SVGShapeElement.prototype.setShapesAsAnimated = function (shapes) {
    var i;
    var len = shapes.length;

    for (i = 0; i < len; i += 1) {
      shapes[i].setAsAnimated();
    }
  };

  SVGShapeElement.prototype.createStyleElement = function (data, level) {
    // TODO: prevent drawing of hidden styles
    var elementData;
    var styleOb = new SVGStyleData(data, level);
    var pathElement = styleOb.pElem;

    if (data.ty === 'st') {
      elementData = new SVGStrokeStyleData(this, data, styleOb);
    } else if (data.ty === 'fl') {
      elementData = new SVGFillStyleData(this, data, styleOb);
    } else if (data.ty === 'gf' || data.ty === 'gs') {
      var GradientConstructor = data.ty === 'gf' ? SVGGradientFillStyleData : SVGGradientStrokeStyleData;
      elementData = new GradientConstructor(this, data, styleOb);
      this.globalData.defs.appendChild(elementData.gf);

      if (elementData.maskId) {
        this.globalData.defs.appendChild(elementData.ms);
        this.globalData.defs.appendChild(elementData.of);
        pathElement.setAttribute('mask', 'url(' + getLocationHref() + '#' + elementData.maskId + ')');
      }
    } else if (data.ty === 'no') {
      elementData = new SVGNoStyleData(this, data, styleOb);
    }

    if (data.ty === 'st' || data.ty === 'gs') {
      pathElement.setAttribute('stroke-linecap', lineCapEnum[data.lc || 2]);
      pathElement.setAttribute('stroke-linejoin', lineJoinEnum[data.lj || 2]);
      pathElement.setAttribute('fill-opacity', '0');

      if (data.lj === 1) {
        pathElement.setAttribute('stroke-miterlimit', data.ml);
      }
    }

    if (data.r === 2) {
      pathElement.setAttribute('fill-rule', 'evenodd');
    }

    if (data.ln) {
      pathElement.setAttribute('id', data.ln);
    }

    if (data.cl) {
      pathElement.setAttribute('class', data.cl);
    }

    if (data.bm) {
      pathElement.style['mix-blend-mode'] = getBlendMode(data.bm);
    }

    this.stylesList.push(styleOb);
    this.addToAnimatedContents(data, elementData);
    return elementData;
  };

  SVGShapeElement.prototype.createGroupElement = function (data) {
    var elementData = new ShapeGroupData();

    if (data.ln) {
      elementData.gr.setAttribute('id', data.ln);
    }

    if (data.cl) {
      elementData.gr.setAttribute('class', data.cl);
    }

    if (data.bm) {
      elementData.gr.style['mix-blend-mode'] = getBlendMode(data.bm);
    }

    return elementData;
  };

  SVGShapeElement.prototype.createTransformElement = function (data, container) {
    var transformProperty = TransformPropertyFactory.getTransformProperty(this, data, this);
    var elementData = new SVGTransformData(transformProperty, transformProperty.o, container);
    this.addToAnimatedContents(data, elementData);
    return elementData;
  };

  SVGShapeElement.prototype.createShapeElement = function (data, ownTransformers, level) {
    var ty = 4;

    if (data.ty === 'rc') {
      ty = 5;
    } else if (data.ty === 'el') {
      ty = 6;
    } else if (data.ty === 'sr') {
      ty = 7;
    }

    var shapeProperty = ShapePropertyFactory.getShapeProp(this, data, ty, this);
    var elementData = new SVGShapeData(ownTransformers, level, shapeProperty);
    this.shapes.push(elementData);
    this.addShapeToModifiers(elementData);
    this.addToAnimatedContents(data, elementData);
    return elementData;
  };

  SVGShapeElement.prototype.addToAnimatedContents = function (data, element) {
    var i = 0;
    var len = this.animatedContents.length;

    while (i < len) {
      if (this.animatedContents[i].element === element) {
        return;
      }

      i += 1;
    }

    this.animatedContents.push({
      fn: SVGElementsRenderer.createRenderFunction(data),
      element: element,
      data: data
    });
  };

  SVGShapeElement.prototype.setElementStyles = function (elementData) {
    var arr = elementData.styles;
    var j;
    var jLen = this.stylesList.length;

    for (j = 0; j < jLen; j += 1) {
      if (!this.stylesList[j].closed) {
        arr.push(this.stylesList[j]);
      }
    }
  };

  SVGShapeElement.prototype.reloadShapes = function () {
    this._isFirstFrame = true;
    var i;
    var len = this.itemsData.length;

    for (i = 0; i < len; i += 1) {
      this.prevViewData[i] = this.itemsData[i];
    }

    this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], true);
    this.filterUniqueShapes();
    len = this.dynamicProperties.length;

    for (i = 0; i < len; i += 1) {
      this.dynamicProperties[i].getValue();
    }

    this.renderModifiers();
  };

  SVGShapeElement.prototype.searchShapes = function (arr, itemsData, prevViewData, container, level, transformers, render) {
    var ownTransformers = [].concat(transformers);
    var i;
    var len = arr.length - 1;
    var j;
    var jLen;
    var ownStyles = [];
    var ownModifiers = [];
    var currentTransform;
    var modifier;
    var processedPos;

    for (i = len; i >= 0; i -= 1) {
      processedPos = this.searchProcessedElement(arr[i]);

      if (!processedPos) {
        arr[i]._render = render;
      } else {
        itemsData[i] = prevViewData[processedPos - 1];
      }

      if (arr[i].ty === 'fl' || arr[i].ty === 'st' || arr[i].ty === 'gf' || arr[i].ty === 'gs' || arr[i].ty === 'no') {
        if (!processedPos) {
          itemsData[i] = this.createStyleElement(arr[i], level);
        } else {
          itemsData[i].style.closed = false;
        }

        if (arr[i]._render) {
          if (itemsData[i].style.pElem.parentNode !== container) {
            container.appendChild(itemsData[i].style.pElem);
          }
        }

        ownStyles.push(itemsData[i].style);
      } else if (arr[i].ty === 'gr') {
        if (!processedPos) {
          itemsData[i] = this.createGroupElement(arr[i]);
        } else {
          jLen = itemsData[i].it.length;

          for (j = 0; j < jLen; j += 1) {
            itemsData[i].prevViewData[j] = itemsData[i].it[j];
          }
        }

        this.searchShapes(arr[i].it, itemsData[i].it, itemsData[i].prevViewData, itemsData[i].gr, level + 1, ownTransformers, render);

        if (arr[i]._render) {
          if (itemsData[i].gr.parentNode !== container) {
            container.appendChild(itemsData[i].gr);
          }
        }
      } else if (arr[i].ty === 'tr') {
        if (!processedPos) {
          itemsData[i] = this.createTransformElement(arr[i], container);
        }

        currentTransform = itemsData[i].transform;
        ownTransformers.push(currentTransform);
      } else if (arr[i].ty === 'sh' || arr[i].ty === 'rc' || arr[i].ty === 'el' || arr[i].ty === 'sr') {
        if (!processedPos) {
          itemsData[i] = this.createShapeElement(arr[i], ownTransformers, level);
        }

        this.setElementStyles(itemsData[i]);
      } else if (arr[i].ty === 'tm' || arr[i].ty === 'rd' || arr[i].ty === 'ms' || arr[i].ty === 'pb') {
        if (!processedPos) {
          modifier = ShapeModifiers.getModifier(arr[i].ty);
          modifier.init(this, arr[i]);
          itemsData[i] = modifier;
          this.shapeModifiers.push(modifier);
        } else {
          modifier = itemsData[i];
          modifier.closed = false;
        }

        ownModifiers.push(modifier);
      } else if (arr[i].ty === 'rp') {
        if (!processedPos) {
          modifier = ShapeModifiers.getModifier(arr[i].ty);
          itemsData[i] = modifier;
          modifier.init(this, arr, i, itemsData);
          this.shapeModifiers.push(modifier);
          render = false;
        } else {
          modifier = itemsData[i];
          modifier.closed = true;
        }

        ownModifiers.push(modifier);
      }

      this.addProcessedElement(arr[i], i + 1);
    }

    len = ownStyles.length;

    for (i = 0; i < len; i += 1) {
      ownStyles[i].closed = true;
    }

    len = ownModifiers.length;

    for (i = 0; i < len; i += 1) {
      ownModifiers[i].closed = true;
    }
  };

  SVGShapeElement.prototype.renderInnerContent = function () {
    this.renderModifiers();
    var i;
    var len = this.stylesList.length;

    for (i = 0; i < len; i += 1) {
      this.stylesList[i].reset();
    }

    this.renderShape();

    for (i = 0; i < len; i += 1) {
      if (this.stylesList[i]._mdf || this._isFirstFrame) {
        if (this.stylesList[i].msElem) {
          this.stylesList[i].msElem.setAttribute('d', this.stylesList[i].d); // Adding M0 0 fixes same mask bug on all browsers

          this.stylesList[i].d = 'M0 0' + this.stylesList[i].d;
        }

        this.stylesList[i].pElem.setAttribute('d', this.stylesList[i].d || 'M0 0');
      }
    }
  };

  SVGShapeElement.prototype.renderShape = function () {
    var i;
    var len = this.animatedContents.length;
    var animatedContent;

    for (i = 0; i < len; i += 1) {
      animatedContent = this.animatedContents[i];

      if ((this._isFirstFrame || animatedContent.element._isAnimated) && animatedContent.data !== true) {
        animatedContent.fn(animatedContent.data, animatedContent.element, this._isFirstFrame);
      }
    }
  };

  SVGShapeElement.prototype.destroy = function () {
    this.destroyBaseElement();
    this.shapesData = null;
    this.itemsData = null;
  };

  function LetterProps(o, sw, sc, fc, m, p) {
    this.o = o;
    this.sw = sw;
    this.sc = sc;
    this.fc = fc;
    this.m = m;
    this.p = p;
    this._mdf = {
      o: true,
      sw: !!sw,
      sc: !!sc,
      fc: !!fc,
      m: true,
      p: true
    };
  }

  LetterProps.prototype.update = function (o, sw, sc, fc, m, p) {
    this._mdf.o = false;
    this._mdf.sw = false;
    this._mdf.sc = false;
    this._mdf.fc = false;
    this._mdf.m = false;
    this._mdf.p = false;
    var updated = false;

    if (this.o !== o) {
      this.o = o;
      this._mdf.o = true;
      updated = true;
    }

    if (this.sw !== sw) {
      this.sw = sw;
      this._mdf.sw = true;
      updated = true;
    }

    if (this.sc !== sc) {
      this.sc = sc;
      this._mdf.sc = true;
      updated = true;
    }

    if (this.fc !== fc) {
      this.fc = fc;
      this._mdf.fc = true;
      updated = true;
    }

    if (this.m !== m) {
      this.m = m;
      this._mdf.m = true;
      updated = true;
    }

    if (p.length && (this.p[0] !== p[0] || this.p[1] !== p[1] || this.p[4] !== p[4] || this.p[5] !== p[5] || this.p[12] !== p[12] || this.p[13] !== p[13])) {
      this.p = p;
      this._mdf.p = true;
      updated = true;
    }

    return updated;
  };

  function TextProperty(elem, data) {
    this._frameId = initialDefaultFrame;
    this.pv = '';
    this.v = '';
    this.kf = false;
    this._isFirstFrame = true;
    this._mdf = false;
    this.data = data;
    this.elem = elem;
    this.comp = this.elem.comp;
    this.keysIndex = 0;
    this.canResize = false;
    this.minimumFontSize = 1;
    this.effectsSequence = [];
    this.currentData = {
      ascent: 0,
      boxWidth: this.defaultBoxWidth,
      f: '',
      fStyle: '',
      fWeight: '',
      fc: '',
      j: '',
      justifyOffset: '',
      l: [],
      lh: 0,
      lineWidths: [],
      ls: '',
      of: '',
      s: '',
      sc: '',
      sw: 0,
      t: 0,
      tr: 0,
      sz: 0,
      ps: null,
      fillColorAnim: false,
      strokeColorAnim: false,
      strokeWidthAnim: false,
      yOffset: 0,
      finalSize: 0,
      finalText: [],
      finalLineHeight: 0,
      __complete: false
    };
    this.copyData(this.currentData, this.data.d.k[0].s);

    if (!this.searchProperty()) {
      this.completeTextData(this.currentData);
    }
  }

  TextProperty.prototype.defaultBoxWidth = [0, 0];

  TextProperty.prototype.copyData = function (obj, data) {
    for (var s in data) {
      if (Object.prototype.hasOwnProperty.call(data, s)) {
        obj[s] = data[s];
      }
    }

    return obj;
  };

  TextProperty.prototype.setCurrentData = function (data) {
    if (!data.__complete) {
      this.completeTextData(data);
    }

    this.currentData = data;
    this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth;
    this._mdf = true;
  };

  TextProperty.prototype.searchProperty = function () {
    return this.searchKeyframes();
  };

  TextProperty.prototype.searchKeyframes = function () {
    this.kf = this.data.d.k.length > 1;

    if (this.kf) {
      this.addEffect(this.getKeyframeValue.bind(this));
    }

    return this.kf;
  };

  TextProperty.prototype.addEffect = function (effectFunction) {
    this.effectsSequence.push(effectFunction);
    this.elem.addDynamicProperty(this);
  };

  TextProperty.prototype.getValue = function (_finalValue) {
    if ((this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length) && !_finalValue) {
      return;
    }

    this.currentData.t = this.data.d.k[this.keysIndex].s.t;
    var currentValue = this.currentData;
    var currentIndex = this.keysIndex;

    if (this.lock) {
      this.setCurrentData(this.currentData);
      return;
    }

    this.lock = true;
    this._mdf = false;
    var i;
    var len = this.effectsSequence.length;
    var finalValue = _finalValue || this.data.d.k[this.keysIndex].s;

    for (i = 0; i < len; i += 1) {
      // Checking if index changed to prevent creating a new object every time the expression updates.
      if (currentIndex !== this.keysIndex) {
        finalValue = this.effectsSequence[i](finalValue, finalValue.t);
      } else {
        finalValue = this.effectsSequence[i](this.currentData, finalValue.t);
      }
    }

    if (currentValue !== finalValue) {
      this.setCurrentData(finalValue);
    }

    this.v = this.currentData;
    this.pv = this.v;
    this.lock = false;
    this.frameId = this.elem.globalData.frameId;
  };

  TextProperty.prototype.getKeyframeValue = function () {
    var textKeys = this.data.d.k;
    var frameNum = this.elem.comp.renderedFrame;
    var i = 0;
    var len = textKeys.length;

    while (i <= len - 1) {
      if (i === len - 1 || textKeys[i + 1].t > frameNum) {
        break;
      }

      i += 1;
    }

    if (this.keysIndex !== i) {
      this.keysIndex = i;
    }

    return this.data.d.k[this.keysIndex].s;
  };

  TextProperty.prototype.buildFinalText = function (text) {
    var charactersArray = [];
    var i = 0;
    var len = text.length;
    var charCode;
    var secondCharCode;
    var shouldCombine = false;

    while (i < len) {
      charCode = text.charCodeAt(i);

      if (FontManager.isCombinedCharacter(charCode)) {
        charactersArray[charactersArray.length - 1] += text.charAt(i);
      } else if (charCode >= 0xD800 && charCode <= 0xDBFF) {
        secondCharCode = text.charCodeAt(i + 1);

        if (secondCharCode >= 0xDC00 && secondCharCode <= 0xDFFF) {
          if (shouldCombine || FontManager.isModifier(charCode, secondCharCode)) {
            charactersArray[charactersArray.length - 1] += text.substr(i, 2);
            shouldCombine = false;
          } else {
            charactersArray.push(text.substr(i, 2));
          }

          i += 1;
        } else {
          charactersArray.push(text.charAt(i));
        }
      } else if (charCode > 0xDBFF) {
        secondCharCode = text.charCodeAt(i + 1);

        if (FontManager.isZeroWidthJoiner(charCode, secondCharCode)) {
          shouldCombine = true;
          charactersArray[charactersArray.length - 1] += text.substr(i, 2);
          i += 1;
        } else {
          charactersArray.push(text.charAt(i));
        }
      } else if (FontManager.isZeroWidthJoiner(charCode)) {
        charactersArray[charactersArray.length - 1] += text.charAt(i);
        shouldCombine = true;
      } else {
        charactersArray.push(text.charAt(i));
      }

      i += 1;
    }

    return charactersArray;
  };

  TextProperty.prototype.completeTextData = function (documentData) {
    documentData.__complete = true;
    var fontManager = this.elem.globalData.fontManager;
    var data = this.data;
    var letters = [];
    var i;
    var len;
    var newLineFlag;
    var index = 0;
    var val;
    var anchorGrouping = data.m.g;
    var currentSize = 0;
    var currentPos = 0;
    var currentLine = 0;
    var lineWidths = [];
    var lineWidth = 0;
    var maxLineWidth = 0;
    var j;
    var jLen;
    var fontData = fontManager.getFontByName(documentData.f);
    var charData;
    var cLength = 0;
    var fontProps = getFontProperties(fontData);
    documentData.fWeight = fontProps.weight;
    documentData.fStyle = fontProps.style;
    documentData.finalSize = documentData.s;
    documentData.finalText = this.buildFinalText(documentData.t);
    len = documentData.finalText.length;
    documentData.finalLineHeight = documentData.lh;
    var trackingOffset = documentData.tr / 1000 * documentData.finalSize;
    var charCode;

    if (documentData.sz) {
      var flag = true;
      var boxWidth = documentData.sz[0];
      var boxHeight = documentData.sz[1];
      var currentHeight;
      var finalText;

      while (flag) {
        finalText = this.buildFinalText(documentData.t);
        currentHeight = 0;
        lineWidth = 0;
        len = finalText.length;
        trackingOffset = documentData.tr / 1000 * documentData.finalSize;
        var lastSpaceIndex = -1;

        for (i = 0; i < len; i += 1) {
          charCode = finalText[i].charCodeAt(0);
          newLineFlag = false;

          if (finalText[i] === ' ') {
            lastSpaceIndex = i;
          } else if (charCode === 13 || charCode === 3) {
            lineWidth = 0;
            newLineFlag = true;
            currentHeight += documentData.finalLineHeight || documentData.finalSize * 1.2;
          }

          if (fontManager.chars) {
            charData = fontManager.getCharData(finalText[i], fontData.fStyle, fontData.fFamily);
            cLength = newLineFlag ? 0 : charData.w * documentData.finalSize / 100;
          } else {
            // tCanvasHelper.font = documentData.s + 'px '+ fontData.fFamily;
            cLength = fontManager.measureText(finalText[i], documentData.f, documentData.finalSize);
          }

          if (lineWidth + cLength > boxWidth && finalText[i] !== ' ') {
            if (lastSpaceIndex === -1) {
              len += 1;
            } else {
              i = lastSpaceIndex;
            }

            currentHeight += documentData.finalLineHeight || documentData.finalSize * 1.2;
            finalText.splice(i, lastSpaceIndex === i ? 1 : 0, '\r'); // finalText = finalText.substr(0,i) + "\r" + finalText.substr(i === lastSpaceIndex ? i + 1 : i);

            lastSpaceIndex = -1;
            lineWidth = 0;
          } else {
            lineWidth += cLength;
            lineWidth += trackingOffset;
          }
        }

        currentHeight += fontData.ascent * documentData.finalSize / 100;

        if (this.canResize && documentData.finalSize > this.minimumFontSize && boxHeight < currentHeight) {
          documentData.finalSize -= 1;
          documentData.finalLineHeight = documentData.finalSize * documentData.lh / documentData.s;
        } else {
          documentData.finalText = finalText;
          len = documentData.finalText.length;
          flag = false;
        }
      }
    }

    lineWidth = -trackingOffset;
    cLength = 0;
    var uncollapsedSpaces = 0;
    var currentChar;

    for (i = 0; i < len; i += 1) {
      newLineFlag = false;
      currentChar = documentData.finalText[i];
      charCode = currentChar.charCodeAt(0);

      if (charCode === 13 || charCode === 3) {
        uncollapsedSpaces = 0;
        lineWidths.push(lineWidth);
        maxLineWidth = lineWidth > maxLineWidth ? lineWidth : maxLineWidth;
        lineWidth = -2 * trackingOffset;
        val = '';
        newLineFlag = true;
        currentLine += 1;
      } else {
        val = currentChar;
      }

      if (fontManager.chars) {
        charData = fontManager.getCharData(currentChar, fontData.fStyle, fontManager.getFontByName(documentData.f).fFamily);
        cLength = newLineFlag ? 0 : charData.w * documentData.finalSize / 100;
      } else {
        // var charWidth = fontManager.measureText(val, documentData.f, documentData.finalSize);
        // tCanvasHelper.font = documentData.finalSize + 'px '+ fontManager.getFontByName(documentData.f).fFamily;
        cLength = fontManager.measureText(val, documentData.f, documentData.finalSize);
      } //


      if (currentChar === ' ') {
        uncollapsedSpaces += cLength + trackingOffset;
      } else {
        lineWidth += cLength + trackingOffset + uncollapsedSpaces;
        uncollapsedSpaces = 0;
      }

      letters.push({
        l: cLength,
        an: cLength,
        add: currentSize,
        n: newLineFlag,
        anIndexes: [],
        val: val,
        line: currentLine,
        animatorJustifyOffset: 0
      });

      if (anchorGrouping == 2) {
        // eslint-disable-line eqeqeq
        currentSize += cLength;

        if (val === '' || val === ' ' || i === len - 1) {
          if (val === '' || val === ' ') {
            currentSize -= cLength;
          }

          while (currentPos <= i) {
            letters[currentPos].an = currentSize;
            letters[currentPos].ind = index;
            letters[currentPos].extra = cLength;
            currentPos += 1;
          }

          index += 1;
          currentSize = 0;
        }
      } else if (anchorGrouping == 3) {
        // eslint-disable-line eqeqeq
        currentSize += cLength;

        if (val === '' || i === len - 1) {
          if (val === '') {
            currentSize -= cLength;
          }

          while (currentPos <= i) {
            letters[currentPos].an = currentSize;
            letters[currentPos].ind = index;
            letters[currentPos].extra = cLength;
            currentPos += 1;
          }

          currentSize = 0;
          index += 1;
        }
      } else {
        letters[index].ind = index;
        letters[index].extra = 0;
        index += 1;
      }
    }

    documentData.l = letters;
    maxLineWidth = lineWidth > maxLineWidth ? lineWidth : maxLineWidth;
    lineWidths.push(lineWidth);

    if (documentData.sz) {
      documentData.boxWidth = documentData.sz[0];
      documentData.justifyOffset = 0;
    } else {
      documentData.boxWidth = maxLineWidth;

      switch (documentData.j) {
        case 1:
          documentData.justifyOffset = -documentData.boxWidth;
          break;

        case 2:
          documentData.justifyOffset = -documentData.boxWidth / 2;
          break;

        default:
          documentData.justifyOffset = 0;
      }
    }

    documentData.lineWidths = lineWidths;
    var animators = data.a;
    var animatorData;
    var letterData;
    jLen = animators.length;
    var based;
    var ind;
    var indexes = [];

    for (j = 0; j < jLen; j += 1) {
      animatorData = animators[j];

      if (animatorData.a.sc) {
        documentData.strokeColorAnim = true;
      }

      if (animatorData.a.sw) {
        documentData.strokeWidthAnim = true;
      }

      if (animatorData.a.fc || animatorData.a.fh || animatorData.a.fs || animatorData.a.fb) {
        documentData.fillColorAnim = true;
      }

      ind = 0;
      based = animatorData.s.b;

      for (i = 0; i < len; i += 1) {
        letterData = letters[i];
        letterData.anIndexes[j] = ind;

        if (based == 1 && letterData.val !== '' || based == 2 && letterData.val !== '' && letterData.val !== ' ' || based == 3 && (letterData.n || letterData.val == ' ' || i == len - 1) || based == 4 && (letterData.n || i == len - 1)) {
          // eslint-disable-line eqeqeq
          if (animatorData.s.rn === 1) {
            indexes.push(ind);
          }

          ind += 1;
        }
      }

      data.a[j].s.totalChars = ind;
      var currentInd = -1;
      var newInd;

      if (animatorData.s.rn === 1) {
        for (i = 0; i < len; i += 1) {
          letterData = letters[i];

          if (currentInd != letterData.anIndexes[j]) {
            // eslint-disable-line eqeqeq
            currentInd = letterData.anIndexes[j];
            newInd = indexes.splice(Math.floor(Math.random() * indexes.length), 1)[0];
          }

          letterData.anIndexes[j] = newInd;
        }
      }
    }

    documentData.yOffset = documentData.finalLineHeight || documentData.finalSize * 1.2;
    documentData.ls = documentData.ls || 0;
    documentData.ascent = fontData.ascent * documentData.finalSize / 100;
  };

  TextProperty.prototype.updateDocumentData = function (newData, index) {
    index = index === undefined ? this.keysIndex : index;
    var dData = this.copyData({}, this.data.d.k[index].s);
    dData = this.copyData(dData, newData);
    this.data.d.k[index].s = dData;
    this.recalculate(index);
    this.elem.addDynamicProperty(this);
  };

  TextProperty.prototype.recalculate = function (index) {
    var dData = this.data.d.k[index].s;
    dData.__complete = false;
    this.keysIndex = 0;
    this._isFirstFrame = true;
    this.getValue(dData);
  };

  TextProperty.prototype.canResizeFont = function (_canResize) {
    this.canResize = _canResize;
    this.recalculate(this.keysIndex);
    this.elem.addDynamicProperty(this);
  };

  TextProperty.prototype.setMinimumFontSize = function (_fontValue) {
    this.minimumFontSize = Math.floor(_fontValue) || 1;
    this.recalculate(this.keysIndex);
    this.elem.addDynamicProperty(this);
  };

  var TextSelectorProp = function () {
    var max = Math.max;
    var min = Math.min;
    var floor = Math.floor;

    function TextSelectorPropFactory(elem, data) {
      this._currentTextLength = -1;
      this.k = false;
      this.data = data;
      this.elem = elem;
      this.comp = elem.comp;
      this.finalS = 0;
      this.finalE = 0;
      this.initDynamicPropertyContainer(elem);
      this.s = PropertyFactory.getProp(elem, data.s || {
        k: 0
      }, 0, 0, this);

      if ('e' in data) {
        this.e = PropertyFactory.getProp(elem, data.e, 0, 0, this);
      } else {
        this.e = {
          v: 100
        };
      }

      this.o = PropertyFactory.getProp(elem, data.o || {
        k: 0
      }, 0, 0, this);
      this.xe = PropertyFactory.getProp(elem, data.xe || {
        k: 0
      }, 0, 0, this);
      this.ne = PropertyFactory.getProp(elem, data.ne || {
        k: 0
      }, 0, 0, this);
      this.sm = PropertyFactory.getProp(elem, data.sm || {
        k: 100
      }, 0, 0, this);
      this.a = PropertyFactory.getProp(elem, data.a, 0, 0.01, this);

      if (!this.dynamicProperties.length) {
        this.getValue();
      }
    }

    TextSelectorPropFactory.prototype = {
      getMult: function getMult(ind) {
        if (this._currentTextLength !== this.elem.textProperty.currentData.l.length) {
          this.getValue();
        }

        var x1 = 0;
        var y1 = 0;
        var x2 = 1;
        var y2 = 1;

        if (this.ne.v > 0) {
          x1 = this.ne.v / 100.0;
        } else {
          y1 = -this.ne.v / 100.0;
        }

        if (this.xe.v > 0) {
          x2 = 1.0 - this.xe.v / 100.0;
        } else {
          y2 = 1.0 + this.xe.v / 100.0;
        }

        var easer = BezierFactory.getBezierEasing(x1, y1, x2, y2).get;
        var mult = 0;
        var s = this.finalS;
        var e = this.finalE;
        var type = this.data.sh;

        if (type === 2) {
          if (e === s) {
            mult = ind >= e ? 1 : 0;
          } else {
            mult = max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1));
          }

          mult = easer(mult);
        } else if (type === 3) {
          if (e === s) {
            mult = ind >= e ? 0 : 1;
          } else {
            mult = 1 - max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1));
          }

          mult = easer(mult);
        } else if (type === 4) {
          if (e === s) {
            mult = 0;
          } else {
            mult = max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1));

            if (mult < 0.5) {
              mult *= 2;
            } else {
              mult = 1 - 2 * (mult - 0.5);
            }
          }

          mult = easer(mult);
        } else if (type === 5) {
          if (e === s) {
            mult = 0;
          } else {
            var tot = e - s;
            /* ind += 0.5;
                      mult = -4/(tot*tot)*(ind*ind)+(4/tot)*ind; */

            ind = min(max(0, ind + 0.5 - s), e - s);
            var x = -tot / 2 + ind;
            var a = tot / 2;
            mult = Math.sqrt(1 - x * x / (a * a));
          }

          mult = easer(mult);
        } else if (type === 6) {
          if (e === s) {
            mult = 0;
          } else {
            ind = min(max(0, ind + 0.5 - s), e - s);
            mult = (1 + Math.cos(Math.PI + Math.PI * 2 * ind / (e - s))) / 2; // eslint-disable-line
          }

          mult = easer(mult);
        } else {
          if (ind >= floor(s)) {
            if (ind - s < 0) {
              mult = max(0, min(min(e, 1) - (s - ind), 1));
            } else {
              mult = max(0, min(e - ind, 1));
            }
          }

          mult = easer(mult);
        } // Smoothness implementation.
        // The smoothness represents a reduced range of the original [0; 1] range.
        // if smoothness is 25%, the new range will be [0.375; 0.625]
        // Steps are:
        // - find the lower value of the new range (threshold)
        // - if multiplier is smaller than that value, floor it to 0
        // - if it is larger,
        //     - subtract the threshold
        //     - divide it by the smoothness (this will return the range to [0; 1])
        // Note: If it doesn't work on some scenarios, consider applying it before the easer.


        if (this.sm.v !== 100) {
          var smoothness = this.sm.v * 0.01;

          if (smoothness === 0) {
            smoothness = 0.00000001;
          }

          var threshold = 0.5 - smoothness * 0.5;

          if (mult < threshold) {
            mult = 0;
          } else {
            mult = (mult - threshold) / smoothness;

            if (mult > 1) {
              mult = 1;
            }
          }
        }

        return mult * this.a.v;
      },
      getValue: function getValue(newCharsFlag) {
        this.iterateDynamicProperties();
        this._mdf = newCharsFlag || this._mdf;
        this._currentTextLength = this.elem.textProperty.currentData.l.length || 0;

        if (newCharsFlag && this.data.r === 2) {
          this.e.v = this._currentTextLength;
        }

        var divisor = this.data.r === 2 ? 1 : 100 / this.data.totalChars;
        var o = this.o.v / divisor;
        var s = this.s.v / divisor + o;
        var e = this.e.v / divisor + o;

        if (s > e) {
          var _s = s;
          s = e;
          e = _s;
        }

        this.finalS = s;
        this.finalE = e;
      }
    };
    extendPrototype([DynamicPropertyContainer], TextSelectorPropFactory);

    function getTextSelectorProp(elem, data, arr) {
      return new TextSelectorPropFactory(elem, data, arr);
    }

    return {
      getTextSelectorProp: getTextSelectorProp
    };
  }();

  function TextAnimatorDataProperty(elem, animatorProps, container) {
    var defaultData = {
      propType: false
    };
    var getProp = PropertyFactory.getProp;
    var textAnimatorAnimatables = animatorProps.a;
    this.a = {
      r: textAnimatorAnimatables.r ? getProp(elem, textAnimatorAnimatables.r, 0, degToRads, container) : defaultData,
      rx: textAnimatorAnimatables.rx ? getProp(elem, textAnimatorAnimatables.rx, 0, degToRads, container) : defaultData,
      ry: textAnimatorAnimatables.ry ? getProp(elem, textAnimatorAnimatables.ry, 0, degToRads, container) : defaultData,
      sk: textAnimatorAnimatables.sk ? getProp(elem, textAnimatorAnimatables.sk, 0, degToRads, container) : defaultData,
      sa: textAnimatorAnimatables.sa ? getProp(elem, textAnimatorAnimatables.sa, 0, degToRads, container) : defaultData,
      s: textAnimatorAnimatables.s ? getProp(elem, textAnimatorAnimatables.s, 1, 0.01, container) : defaultData,
      a: textAnimatorAnimatables.a ? getProp(elem, textAnimatorAnimatables.a, 1, 0, container) : defaultData,
      o: textAnimatorAnimatables.o ? getProp(elem, textAnimatorAnimatables.o, 0, 0.01, container) : defaultData,
      p: textAnimatorAnimatables.p ? getProp(elem, textAnimatorAnimatables.p, 1, 0, container) : defaultData,
      sw: textAnimatorAnimatables.sw ? getProp(elem, textAnimatorAnimatables.sw, 0, 0, container) : defaultData,
      sc: textAnimatorAnimatables.sc ? getProp(elem, textAnimatorAnimatables.sc, 1, 0, container) : defaultData,
      fc: textAnimatorAnimatables.fc ? getProp(elem, textAnimatorAnimatables.fc, 1, 0, container) : defaultData,
      fh: textAnimatorAnimatables.fh ? getProp(elem, textAnimatorAnimatables.fh, 0, 0, container) : defaultData,
      fs: textAnimatorAnimatables.fs ? getProp(elem, textAnimatorAnimatables.fs, 0, 0.01, container) : defaultData,
      fb: textAnimatorAnimatables.fb ? getProp(elem, textAnimatorAnimatables.fb, 0, 0.01, container) : defaultData,
      t: textAnimatorAnimatables.t ? getProp(elem, textAnimatorAnimatables.t, 0, 0, container) : defaultData
    };
    this.s = TextSelectorProp.getTextSelectorProp(elem, animatorProps.s, container);
    this.s.t = animatorProps.s.t;
  }

  function TextAnimatorProperty(textData, renderType, elem) {
    this._isFirstFrame = true;
    this._hasMaskedPath = false;
    this._frameId = -1;
    this._textData = textData;
    this._renderType = renderType;
    this._elem = elem;
    this._animatorsData = createSizedArray(this._textData.a.length);
    this._pathData = {};
    this._moreOptions = {
      alignment: {}
    };
    this.renderedLetters = [];
    this.lettersChangedFlag = false;
    this.initDynamicPropertyContainer(elem);
  }

  TextAnimatorProperty.prototype.searchProperties = function () {
    var i;
    var len = this._textData.a.length;
    var animatorProps;
    var getProp = PropertyFactory.getProp;

    for (i = 0; i < len; i += 1) {
      animatorProps = this._textData.a[i];
      this._animatorsData[i] = new TextAnimatorDataProperty(this._elem, animatorProps, this);
    }

    if (this._textData.p && 'm' in this._textData.p) {
      this._pathData = {
        a: getProp(this._elem, this._textData.p.a, 0, 0, this),
        f: getProp(this._elem, this._textData.p.f, 0, 0, this),
        l: getProp(this._elem, this._textData.p.l, 0, 0, this),
        r: getProp(this._elem, this._textData.p.r, 0, 0, this),
        p: getProp(this._elem, this._textData.p.p, 0, 0, this),
        m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
      };
      this._hasMaskedPath = true;
    } else {
      this._hasMaskedPath = false;
    }

    this._moreOptions.alignment = getProp(this._elem, this._textData.m.a, 1, 0, this);
  };

  TextAnimatorProperty.prototype.getMeasures = function (documentData, lettersChangedFlag) {
    this.lettersChangedFlag = lettersChangedFlag;

    if (!this._mdf && !this._isFirstFrame && !lettersChangedFlag && (!this._hasMaskedPath || !this._pathData.m._mdf)) {
      return;
    }

    this._isFirstFrame = false;
    var alignment = this._moreOptions.alignment.v;
    var animators = this._animatorsData;
    var textData = this._textData;
    var matrixHelper = this.mHelper;
    var renderType = this._renderType;
    var renderedLettersCount = this.renderedLetters.length;
    var xPos;
    var yPos;
    var i;
    var len;
    var letters = documentData.l;
    var pathInfo;
    var currentLength;
    var currentPoint;
    var segmentLength;
    var flag;
    var pointInd;
    var segmentInd;
    var prevPoint;
    var points;
    var segments;
    var partialLength;
    var totalLength;
    var perc;
    var tanAngle;
    var mask;

    if (this._hasMaskedPath) {
      mask = this._pathData.m;

      if (!this._pathData.n || this._pathData._mdf) {
        var paths = mask.v;

        if (this._pathData.r.v) {
          paths = paths.reverse();
        } // TODO: release bezier data cached from previous pathInfo: this._pathData.pi


        pathInfo = {
          tLength: 0,
          segments: []
        };
        len = paths._length - 1;
        var bezierData;
        totalLength = 0;

        for (i = 0; i < len; i += 1) {
          bezierData = bez.buildBezierData(paths.v[i], paths.v[i + 1], [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]], [paths.i[i + 1][0] - paths.v[i + 1][0], paths.i[i + 1][1] - paths.v[i + 1][1]]);
          pathInfo.tLength += bezierData.segmentLength;
          pathInfo.segments.push(bezierData);
          totalLength += bezierData.segmentLength;
        }

        i = len;

        if (mask.v.c) {
          bezierData = bez.buildBezierData(paths.v[i], paths.v[0], [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]], [paths.i[0][0] - paths.v[0][0], paths.i[0][1] - paths.v[0][1]]);
          pathInfo.tLength += bezierData.segmentLength;
          pathInfo.segments.push(bezierData);
          totalLength += bezierData.segmentLength;
        }

        this._pathData.pi = pathInfo;
      }

      pathInfo = this._pathData.pi;
      currentLength = this._pathData.f.v;
      segmentInd = 0;
      pointInd = 1;
      segmentLength = 0;
      flag = true;
      segments = pathInfo.segments;

      if (currentLength < 0 && mask.v.c) {
        if (pathInfo.tLength < Math.abs(currentLength)) {
          currentLength = -Math.abs(currentLength) % pathInfo.tLength;
        }

        segmentInd = segments.length - 1;
        points = segments[segmentInd].points;
        pointInd = points.length - 1;

        while (currentLength < 0) {
          currentLength += points[pointInd].partialLength;
          pointInd -= 1;

          if (pointInd < 0) {
            segmentInd -= 1;
            points = segments[segmentInd].points;
            pointInd = points.length - 1;
          }
        }
      }

      points = segments[segmentInd].points;
      prevPoint = points[pointInd - 1];
      currentPoint = points[pointInd];
      partialLength = currentPoint.partialLength;
    }

    len = letters.length;
    xPos = 0;
    yPos = 0;
    var yOff = documentData.finalSize * 1.2 * 0.714;
    var firstLine = true;
    var animatorProps;
    var animatorSelector;
    var j;
    var jLen;
    var letterValue;
    jLen = animators.length;
    var mult;
    var ind = -1;
    var offf;
    var xPathPos;
    var yPathPos;
    var initPathPos = currentLength;
    var initSegmentInd = segmentInd;
    var initPointInd = pointInd;
    var currentLine = -1;
    var elemOpacity;
    var sc;
    var sw;
    var fc;
    var k;
    var letterSw;
    var letterSc;
    var letterFc;
    var letterM = '';
    var letterP = this.defaultPropsArray;
    var letterO; //

    if (documentData.j === 2 || documentData.j === 1) {
      var animatorJustifyOffset = 0;
      var animatorFirstCharOffset = 0;
      var justifyOffsetMult = documentData.j === 2 ? -0.5 : -1;
      var lastIndex = 0;
      var isNewLine = true;

      for (i = 0; i < len; i += 1) {
        if (letters[i].n) {
          if (animatorJustifyOffset) {
            animatorJustifyOffset += animatorFirstCharOffset;
          }

          while (lastIndex < i) {
            letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset;
            lastIndex += 1;
          }

          animatorJustifyOffset = 0;
          isNewLine = true;
        } else {
          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;

            if (animatorProps.t.propType) {
              if (isNewLine && documentData.j === 2) {
                animatorFirstCharOffset += animatorProps.t.v * justifyOffsetMult;
              }

              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

              if (mult.length) {
                animatorJustifyOffset += animatorProps.t.v * mult[0] * justifyOffsetMult;
              } else {
                animatorJustifyOffset += animatorProps.t.v * mult * justifyOffsetMult;
              }
            }
          }

          isNewLine = false;
        }
      }

      if (animatorJustifyOffset) {
        animatorJustifyOffset += animatorFirstCharOffset;
      }

      while (lastIndex < i) {
        letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset;
        lastIndex += 1;
      }
    } //


    for (i = 0; i < len; i += 1) {
      matrixHelper.reset();
      elemOpacity = 1;

      if (letters[i].n) {
        xPos = 0;
        yPos += documentData.yOffset;
        yPos += firstLine ? 1 : 0;
        currentLength = initPathPos;
        firstLine = false;

        if (this._hasMaskedPath) {
          segmentInd = initSegmentInd;
          pointInd = initPointInd;
          points = segments[segmentInd].points;
          prevPoint = points[pointInd - 1];
          currentPoint = points[pointInd];
          partialLength = currentPoint.partialLength;
          segmentLength = 0;
        }

        letterM = '';
        letterFc = '';
        letterSw = '';
        letterO = '';
        letterP = this.defaultPropsArray;
      } else {
        if (this._hasMaskedPath) {
          if (currentLine !== letters[i].line) {
            switch (documentData.j) {
              case 1:
                currentLength += totalLength - documentData.lineWidths[letters[i].line];
                break;

              case 2:
                currentLength += (totalLength - documentData.lineWidths[letters[i].line]) / 2;
                break;

              default:
                break;
            }

            currentLine = letters[i].line;
          }

          if (ind !== letters[i].ind) {
            if (letters[ind]) {
              currentLength += letters[ind].extra;
            }

            currentLength += letters[i].an / 2;
            ind = letters[i].ind;
          }

          currentLength += alignment[0] * letters[i].an * 0.005;
          var animatorOffset = 0;

          for (j = 0; j < jLen; j += 1) {
            animatorProps = animators[j].a;

            if (animatorProps.p.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

              if (mult.length) {
                animatorOffset += animatorProps.p.v[0] * mult[0];
              } else {
                animatorOffset += animatorProps.p.v[0] * mult;
              }
            }

            if (animatorProps.a.propType) {
              animatorSelector = animators[j].s;
              mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

              if (mult.length) {
                animatorOffset += animatorProps.a.v[0] * mult[0];
              } else {
                animatorOffset += animatorProps.a.v[0] * mult;
              }
            }
          }

          flag = true; // Force alignment only works with a single line for now

          if (this._pathData.a.v) {
            currentLength = letters[0].an * 0.5 + (totalLength - this._pathData.f.v - letters[0].an * 0.5 - letters[letters.length - 1].an * 0.5) * ind / (len - 1);
            currentLength += this._pathData.f.v;
          }

          while (flag) {
            if (segmentLength + partialLength >= currentLength + animatorOffset || !points) {
              perc = (currentLength + animatorOffset - segmentLength) / currentPoint.partialLength;
              xPathPos = prevPoint.point[0] + (currentPoint.point[0] - prevPoint.point[0]) * perc;
              yPathPos = prevPoint.point[1] + (currentPoint.point[1] - prevPoint.point[1]) * perc;
              matrixHelper.translate(-alignment[0] * letters[i].an * 0.005, -(alignment[1] * yOff) * 0.01);
              flag = false;
            } else if (points) {
              segmentLength += currentPoint.partialLength;
              pointInd += 1;

              if (pointInd >= points.length) {
                pointInd = 0;
                segmentInd += 1;

                if (!segments[segmentInd]) {
                  if (mask.v.c) {
                    pointInd = 0;
                    segmentInd = 0;
                    points = segments[segmentInd].points;
                  } else {
                    segmentLength -= currentPoint.partialLength;
                    points = null;
                  }
                } else {
                  points = segments[segmentInd].points;
                }
              }

              if (points) {
                prevPoint = currentPoint;
                currentPoint = points[pointInd];
                partialLength = currentPoint.partialLength;
              }
            }
          }

          offf = letters[i].an / 2 - letters[i].add;
          matrixHelper.translate(-offf, 0, 0);
        } else {
          offf = letters[i].an / 2 - letters[i].add;
          matrixHelper.translate(-offf, 0, 0); // Grouping alignment

          matrixHelper.translate(-alignment[0] * letters[i].an * 0.005, -alignment[1] * yOff * 0.01, 0);
        }

        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;

          if (animatorProps.t.propType) {
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars); // This condition is to prevent applying tracking to first character in each line. Might be better to use a boolean "isNewLine"

            if (xPos !== 0 || documentData.j !== 0) {
              if (this._hasMaskedPath) {
                if (mult.length) {
                  currentLength += animatorProps.t.v * mult[0];
                } else {
                  currentLength += animatorProps.t.v * mult;
                }
              } else if (mult.length) {
                xPos += animatorProps.t.v * mult[0];
              } else {
                xPos += animatorProps.t.v * mult;
              }
            }
          }
        }

        if (documentData.strokeWidthAnim) {
          sw = documentData.sw || 0;
        }

        if (documentData.strokeColorAnim) {
          if (documentData.sc) {
            sc = [documentData.sc[0], documentData.sc[1], documentData.sc[2]];
          } else {
            sc = [0, 0, 0];
          }
        }

        if (documentData.fillColorAnim && documentData.fc) {
          fc = [documentData.fc[0], documentData.fc[1], documentData.fc[2]];
        }

        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;

          if (animatorProps.a.propType) {
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

            if (mult.length) {
              matrixHelper.translate(-animatorProps.a.v[0] * mult[0], -animatorProps.a.v[1] * mult[1], animatorProps.a.v[2] * mult[2]);
            } else {
              matrixHelper.translate(-animatorProps.a.v[0] * mult, -animatorProps.a.v[1] * mult, animatorProps.a.v[2] * mult);
            }
          }
        }

        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;

          if (animatorProps.s.propType) {
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

            if (mult.length) {
              matrixHelper.scale(1 + (animatorProps.s.v[0] - 1) * mult[0], 1 + (animatorProps.s.v[1] - 1) * mult[1], 1);
            } else {
              matrixHelper.scale(1 + (animatorProps.s.v[0] - 1) * mult, 1 + (animatorProps.s.v[1] - 1) * mult, 1);
            }
          }
        }

        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;
          animatorSelector = animators[j].s;
          mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

          if (animatorProps.sk.propType) {
            if (mult.length) {
              matrixHelper.skewFromAxis(-animatorProps.sk.v * mult[0], animatorProps.sa.v * mult[1]);
            } else {
              matrixHelper.skewFromAxis(-animatorProps.sk.v * mult, animatorProps.sa.v * mult);
            }
          }

          if (animatorProps.r.propType) {
            if (mult.length) {
              matrixHelper.rotateZ(-animatorProps.r.v * mult[2]);
            } else {
              matrixHelper.rotateZ(-animatorProps.r.v * mult);
            }
          }

          if (animatorProps.ry.propType) {
            if (mult.length) {
              matrixHelper.rotateY(animatorProps.ry.v * mult[1]);
            } else {
              matrixHelper.rotateY(animatorProps.ry.v * mult);
            }
          }

          if (animatorProps.rx.propType) {
            if (mult.length) {
              matrixHelper.rotateX(animatorProps.rx.v * mult[0]);
            } else {
              matrixHelper.rotateX(animatorProps.rx.v * mult);
            }
          }

          if (animatorProps.o.propType) {
            if (mult.length) {
              elemOpacity += (animatorProps.o.v * mult[0] - elemOpacity) * mult[0];
            } else {
              elemOpacity += (animatorProps.o.v * mult - elemOpacity) * mult;
            }
          }

          if (documentData.strokeWidthAnim && animatorProps.sw.propType) {
            if (mult.length) {
              sw += animatorProps.sw.v * mult[0];
            } else {
              sw += animatorProps.sw.v * mult;
            }
          }

          if (documentData.strokeColorAnim && animatorProps.sc.propType) {
            for (k = 0; k < 3; k += 1) {
              if (mult.length) {
                sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult[0];
              } else {
                sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult;
              }
            }
          }

          if (documentData.fillColorAnim && documentData.fc) {
            if (animatorProps.fc.propType) {
              for (k = 0; k < 3; k += 1) {
                if (mult.length) {
                  fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult[0];
                } else {
                  fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult;
                }
              }
            }

            if (animatorProps.fh.propType) {
              if (mult.length) {
                fc = addHueToRGB(fc, animatorProps.fh.v * mult[0]);
              } else {
                fc = addHueToRGB(fc, animatorProps.fh.v * mult);
              }
            }

            if (animatorProps.fs.propType) {
              if (mult.length) {
                fc = addSaturationToRGB(fc, animatorProps.fs.v * mult[0]);
              } else {
                fc = addSaturationToRGB(fc, animatorProps.fs.v * mult);
              }
            }

            if (animatorProps.fb.propType) {
              if (mult.length) {
                fc = addBrightnessToRGB(fc, animatorProps.fb.v * mult[0]);
              } else {
                fc = addBrightnessToRGB(fc, animatorProps.fb.v * mult);
              }
            }
          }
        }

        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a;

          if (animatorProps.p.propType) {
            animatorSelector = animators[j].s;
            mult = animatorSelector.getMult(letters[i].anIndexes[j], textData.a[j].s.totalChars);

            if (this._hasMaskedPath) {
              if (mult.length) {
                matrixHelper.translate(0, animatorProps.p.v[1] * mult[0], -animatorProps.p.v[2] * mult[1]);
              } else {
                matrixHelper.translate(0, animatorProps.p.v[1] * mult, -animatorProps.p.v[2] * mult);
              }
            } else if (mult.length) {
              matrixHelper.translate(animatorProps.p.v[0] * mult[0], animatorProps.p.v[1] * mult[1], -animatorProps.p.v[2] * mult[2]);
            } else {
              matrixHelper.translate(animatorProps.p.v[0] * mult, animatorProps.p.v[1] * mult, -animatorProps.p.v[2] * mult);
            }
          }
        }

        if (documentData.strokeWidthAnim) {
          letterSw = sw < 0 ? 0 : sw;
        }

        if (documentData.strokeColorAnim) {
          letterSc = 'rgb(' + Math.round(sc[0] * 255) + ',' + Math.round(sc[1] * 255) + ',' + Math.round(sc[2] * 255) + ')';
        }

        if (documentData.fillColorAnim && documentData.fc) {
          letterFc = 'rgb(' + Math.round(fc[0] * 255) + ',' + Math.round(fc[1] * 255) + ',' + Math.round(fc[2] * 255) + ')';
        }

        if (this._hasMaskedPath) {
          matrixHelper.translate(0, -documentData.ls);
          matrixHelper.translate(0, alignment[1] * yOff * 0.01 + yPos, 0);

          if (this._pathData.p.v) {
            tanAngle = (currentPoint.point[1] - prevPoint.point[1]) / (currentPoint.point[0] - prevPoint.point[0]);
            var rot = Math.atan(tanAngle) * 180 / Math.PI;

            if (currentPoint.point[0] < prevPoint.point[0]) {
              rot += 180;
            }

            matrixHelper.rotate(-rot * Math.PI / 180);
          }

          matrixHelper.translate(xPathPos, yPathPos, 0);
          currentLength -= alignment[0] * letters[i].an * 0.005;

          if (letters[i + 1] && ind !== letters[i + 1].ind) {
            currentLength += letters[i].an / 2;
            currentLength += documentData.tr * 0.001 * documentData.finalSize;
          }
        } else {
          matrixHelper.translate(xPos, yPos, 0);

          if (documentData.ps) {
            // matrixHelper.translate(documentData.ps[0],documentData.ps[1],0);
            matrixHelper.translate(documentData.ps[0], documentData.ps[1] + documentData.ascent, 0);
          }

          switch (documentData.j) {
            case 1:
              matrixHelper.translate(letters[i].animatorJustifyOffset + documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[letters[i].line]), 0, 0);
              break;

            case 2:
              matrixHelper.translate(letters[i].animatorJustifyOffset + documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[letters[i].line]) / 2, 0, 0);
              break;

            default:
              break;
          }

          matrixHelper.translate(0, -documentData.ls);
          matrixHelper.translate(offf, 0, 0);
          matrixHelper.translate(alignment[0] * letters[i].an * 0.005, alignment[1] * yOff * 0.01, 0);
          xPos += letters[i].l + documentData.tr * 0.001 * documentData.finalSize;
        }

        if (renderType === 'html') {
          letterM = matrixHelper.toCSS();
        } else if (renderType === 'svg') {
          letterM = matrixHelper.to2dCSS();
        } else {
          letterP = [matrixHelper.props[0], matrixHelper.props[1], matrixHelper.props[2], matrixHelper.props[3], matrixHelper.props[4], matrixHelper.props[5], matrixHelper.props[6], matrixHelper.props[7], matrixHelper.props[8], matrixHelper.props[9], matrixHelper.props[10], matrixHelper.props[11], matrixHelper.props[12], matrixHelper.props[13], matrixHelper.props[14], matrixHelper.props[15]];
        }

        letterO = elemOpacity;
      }

      if (renderedLettersCount <= i) {
        letterValue = new LetterProps(letterO, letterSw, letterSc, letterFc, letterM, letterP);
        this.renderedLetters.push(letterValue);
        renderedLettersCount += 1;
        this.lettersChangedFlag = true;
      } else {
        letterValue = this.renderedLetters[i];
        this.lettersChangedFlag = letterValue.update(letterO, letterSw, letterSc, letterFc, letterM, letterP) || this.lettersChangedFlag;
      }
    }
  };

  TextAnimatorProperty.prototype.getValue = function () {
    if (this._elem.globalData.frameId === this._frameId) {
      return;
    }

    this._frameId = this._elem.globalData.frameId;
    this.iterateDynamicProperties();
  };

  TextAnimatorProperty.prototype.mHelper = new Matrix();
  TextAnimatorProperty.prototype.defaultPropsArray = [];
  extendPrototype([DynamicPropertyContainer], TextAnimatorProperty);

  function ITextElement() {}

  ITextElement.prototype.initElement = function (data, globalData, comp) {
    this.lettersChangedFlag = true;
    this.initFrame();
    this.initBaseData(data, globalData, comp);
    this.textProperty = new TextProperty(this, data.t, this.dynamicProperties);
    this.textAnimator = new TextAnimatorProperty(data.t, this.renderType, this);
    this.initTransform(data, globalData, comp);
    this.initHierarchy();
    this.initRenderable();
    this.initRendererElement();
    this.createContainerElements();
    this.createRenderableComponents();
    this.createContent();
    this.hide();
    this.textAnimator.searchProperties(this.dynamicProperties);
  };

  ITextElement.prototype.prepareFrame = function (num) {
    this._mdf = false;
    this.prepareRenderableFrame(num);
    this.prepareProperties(num, this.isInRange);

    if (this.textProperty._mdf || this.textProperty._isFirstFrame) {
      this.buildNewText();
      this.textProperty._isFirstFrame = false;
      this.textProperty._mdf = false;
    }
  };

  ITextElement.prototype.createPathShape = function (matrixHelper, shapes) {
    var j;
    var jLen = shapes.length;
    var pathNodes;
    var shapeStr = '';

    for (j = 0; j < jLen; j += 1) {
      if (shapes[j].ty === 'sh') {
        pathNodes = shapes[j].ks.k;
        shapeStr += buildShapeString(pathNodes, pathNodes.i.length, true, matrixHelper);
      }
    }

    return shapeStr;
  };

  ITextElement.prototype.updateDocumentData = function (newData, index) {
    this.textProperty.updateDocumentData(newData, index);
  };

  ITextElement.prototype.canResizeFont = function (_canResize) {
    this.textProperty.canResizeFont(_canResize);
  };

  ITextElement.prototype.setMinimumFontSize = function (_fontSize) {
    this.textProperty.setMinimumFontSize(_fontSize);
  };

  ITextElement.prototype.applyTextPropertiesToMatrix = function (documentData, matrixHelper, lineNumber, xPos, yPos) {
    if (documentData.ps) {
      matrixHelper.translate(documentData.ps[0], documentData.ps[1] + documentData.ascent, 0);
    }

    matrixHelper.translate(0, -documentData.ls, 0);

    switch (documentData.j) {
      case 1:
        matrixHelper.translate(documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[lineNumber]), 0, 0);
        break;

      case 2:
        matrixHelper.translate(documentData.justifyOffset + (documentData.boxWidth - documentData.lineWidths[lineNumber]) / 2, 0, 0);
        break;

      default:
        break;
    }

    matrixHelper.translate(xPos, yPos, 0);
  };

  ITextElement.prototype.buildColor = function (colorData) {
    return 'rgb(' + Math.round(colorData[0] * 255) + ',' + Math.round(colorData[1] * 255) + ',' + Math.round(colorData[2] * 255) + ')';
  };

  ITextElement.prototype.emptyProp = new LetterProps();

  ITextElement.prototype.destroy = function () {};

  var emptyShapeData = {
    shapes: []
  };

  function SVGTextLottieElement(data, globalData, comp) {
    this.textSpans = [];
    this.renderType = 'svg';
    this.initElement(data, globalData, comp);
  }

  extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, ITextElement], SVGTextLottieElement);

  SVGTextLottieElement.prototype.createContent = function () {
    if (this.data.singleShape && !this.globalData.fontManager.chars) {
      this.textContainer = createNS('text');
    }
  };

  SVGTextLottieElement.prototype.buildTextContents = function (textArray) {
    var i = 0;
    var len = textArray.length;
    var textContents = [];
    var currentTextContent = '';

    while (i < len) {
      if (textArray[i] === String.fromCharCode(13) || textArray[i] === String.fromCharCode(3)) {
        textContents.push(currentTextContent);
        currentTextContent = '';
      } else {
        currentTextContent += textArray[i];
      }

      i += 1;
    }

    textContents.push(currentTextContent);
    return textContents;
  };

  SVGTextLottieElement.prototype.buildNewText = function () {
    this.addDynamicProperty(this);
    var i;
    var len;
    var documentData = this.textProperty.currentData;
    this.renderedLetters = createSizedArray(documentData ? documentData.l.length : 0);

    if (documentData.fc) {
      this.layerElement.setAttribute('fill', this.buildColor(documentData.fc));
    } else {
      this.layerElement.setAttribute('fill', 'rgba(0,0,0,0)');
    }

    if (documentData.sc) {
      this.layerElement.setAttribute('stroke', this.buildColor(documentData.sc));
      this.layerElement.setAttribute('stroke-width', documentData.sw);
    }

    this.layerElement.setAttribute('font-size', documentData.finalSize);
    var fontData = this.globalData.fontManager.getFontByName(documentData.f);

    if (fontData.fClass) {
      this.layerElement.setAttribute('class', fontData.fClass);
    } else {
      this.layerElement.setAttribute('font-family', fontData.fFamily);
      var fWeight = documentData.fWeight;
      var fStyle = documentData.fStyle;
      this.layerElement.setAttribute('font-style', fStyle);
      this.layerElement.setAttribute('font-weight', fWeight);
    }

    this.layerElement.setAttribute('aria-label', documentData.t);
    var letters = documentData.l || [];
    var usesGlyphs = !!this.globalData.fontManager.chars;
    len = letters.length;
    var tSpan;
    var matrixHelper = this.mHelper;
    var shapeStr = '';
    var singleShape = this.data.singleShape;
    var xPos = 0;
    var yPos = 0;
    var firstLine = true;
    var trackingOffset = documentData.tr * 0.001 * documentData.finalSize;

    if (singleShape && !usesGlyphs && !documentData.sz) {
      var tElement = this.textContainer;
      var justify = 'start';

      switch (documentData.j) {
        case 1:
          justify = 'end';
          break;

        case 2:
          justify = 'middle';
          break;

        default:
          justify = 'start';
          break;
      }

      tElement.setAttribute('text-anchor', justify);
      tElement.setAttribute('letter-spacing', trackingOffset);
      var textContent = this.buildTextContents(documentData.finalText);
      len = textContent.length;
      yPos = documentData.ps ? documentData.ps[1] + documentData.ascent : 0;

      for (i = 0; i < len; i += 1) {
        tSpan = this.textSpans[i].span || createNS('tspan');
        tSpan.textContent = textContent[i];
        tSpan.setAttribute('x', 0);
        tSpan.setAttribute('y', yPos);
        tSpan.style.display = 'inherit';
        tElement.appendChild(tSpan);

        if (!this.textSpans[i]) {
          this.textSpans[i] = {
            span: null,
            glyph: null
          };
        }

        this.textSpans[i].span = tSpan;
        yPos += documentData.finalLineHeight;
      }

      this.layerElement.appendChild(tElement);
    } else {
      var cachedSpansLength = this.textSpans.length;
      var charData;

      for (i = 0; i < len; i += 1) {
        if (!this.textSpans[i]) {
          this.textSpans[i] = {
            span: null,
            childSpan: null,
            glyph: null
          };
        }

        if (!usesGlyphs || !singleShape || i === 0) {
          tSpan = cachedSpansLength > i ? this.textSpans[i].span : createNS(usesGlyphs ? 'g' : 'text');

          if (cachedSpansLength <= i) {
            tSpan.setAttribute('stroke-linecap', 'butt');
            tSpan.setAttribute('stroke-linejoin', 'round');
            tSpan.setAttribute('stroke-miterlimit', '4');
            this.textSpans[i].span = tSpan;

            if (usesGlyphs) {
              var childSpan = createNS('g');
              tSpan.appendChild(childSpan);
              this.textSpans[i].childSpan = childSpan;
            }

            this.textSpans[i].span = tSpan;
            this.layerElement.appendChild(tSpan);
          }

          tSpan.style.display = 'inherit';
        }

        matrixHelper.reset();
        matrixHelper.scale(documentData.finalSize / 100, documentData.finalSize / 100);

        if (singleShape) {
          if (letters[i].n) {
            xPos = -trackingOffset;
            yPos += documentData.yOffset;
            yPos += firstLine ? 1 : 0;
            firstLine = false;
          }

          this.applyTextPropertiesToMatrix(documentData, matrixHelper, letters[i].line, xPos, yPos);
          xPos += letters[i].l || 0; // xPos += letters[i].val === ' ' ? 0 : trackingOffset;

          xPos += trackingOffset;
        }

        if (usesGlyphs) {
          charData = this.globalData.fontManager.getCharData(documentData.finalText[i], fontData.fStyle, this.globalData.fontManager.getFontByName(documentData.f).fFamily);
          var glyphElement;

          if (charData.t === 1) {
            glyphElement = new SVGCompElement(charData.data, this.globalData, this);
          } else {
            var data = emptyShapeData;

            if (charData.data && charData.data.shapes) {
              data = charData.data;
            }

            glyphElement = new SVGShapeElement(data, this.globalData, this);
          }

          this.textSpans[i].glyph = glyphElement;
          glyphElement._debug = true;
          glyphElement.prepareFrame(0);
          glyphElement.renderFrame();
          this.textSpans[i].childSpan.appendChild(glyphElement.layerElement);
          this.textSpans[i].childSpan.setAttribute('transform', 'scale(' + documentData.finalSize / 100 + ',' + documentData.finalSize / 100 + ')');
        } else {
          if (singleShape) {
            tSpan.setAttribute('transform', 'translate(' + matrixHelper.props[12] + ',' + matrixHelper.props[13] + ')');
          }

          tSpan.textContent = letters[i].val;
          tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
        } //

      }

      if (singleShape && tSpan) {
        tSpan.setAttribute('d', shapeStr);
      }
    }

    while (i < this.textSpans.length) {
      this.textSpans[i].span.style.display = 'none';
      i += 1;
    }

    this._sizeChanged = true;
  };

  SVGTextLottieElement.prototype.sourceRectAtTime = function () {
    this.prepareFrame(this.comp.renderedFrame - this.data.st);
    this.renderInnerContent();

    if (this._sizeChanged) {
      this._sizeChanged = false;
      var textBox = this.layerElement.getBBox();
      this.bbox = {
        top: textBox.y,
        left: textBox.x,
        width: textBox.width,
        height: textBox.height
      };
    }

    return this.bbox;
  };

  SVGTextLottieElement.prototype.getValue = function () {
    var i;
    var len = this.textSpans.length;
    var glyphElement;
    this.renderedFrame = this.comp.renderedFrame;

    for (i = 0; i < len; i += 1) {
      glyphElement = this.textSpans[i].glyph;

      if (glyphElement) {
        glyphElement.prepareFrame(this.comp.renderedFrame - this.data.st);

        if (glyphElement._mdf) {
          this._mdf = true;
        }
      }
    }
  };

  SVGTextLottieElement.prototype.renderInnerContent = function () {
    if (!this.data.singleShape || this._mdf) {
      this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);

      if (this.lettersChangedFlag || this.textAnimator.lettersChangedFlag) {
        this._sizeChanged = true;
        var i;
        var len;
        var renderedLetters = this.textAnimator.renderedLetters;
        var letters = this.textProperty.currentData.l;
        len = letters.length;
        var renderedLetter;
        var textSpan;
        var glyphElement;

        for (i = 0; i < len; i += 1) {
          if (!letters[i].n) {
            renderedLetter = renderedLetters[i];
            textSpan = this.textSpans[i].span;
            glyphElement = this.textSpans[i].glyph;

            if (glyphElement) {
              glyphElement.renderFrame();
            }

            if (renderedLetter._mdf.m) {
              textSpan.setAttribute('transform', renderedLetter.m);
            }

            if (renderedLetter._mdf.o) {
              textSpan.setAttribute('opacity', renderedLetter.o);
            }

            if (renderedLetter._mdf.sw) {
              textSpan.setAttribute('stroke-width', renderedLetter.sw);
            }

            if (renderedLetter._mdf.sc) {
              textSpan.setAttribute('stroke', renderedLetter.sc);
            }

            if (renderedLetter._mdf.fc) {
              textSpan.setAttribute('fill', renderedLetter.fc);
            }
          }
        }
      }
    }
  };

  function ISolidElement(data, globalData, comp) {
    this.initElement(data, globalData, comp);
  }

  extendPrototype([IImageElement], ISolidElement);

  ISolidElement.prototype.createContent = function () {
    var rect = createNS('rect'); /// /rect.style.width = this.data.sw;
    /// /rect.style.height = this.data.sh;
    /// /rect.style.fill = this.data.sc;

    rect.setAttribute('width', this.data.sw);
    rect.setAttribute('height', this.data.sh);
    rect.setAttribute('fill', this.data.sc);
    this.layerElement.appendChild(rect);
  };

  function NullElement(data, globalData, comp) {
    this.initFrame();
    this.initBaseData(data, globalData, comp);
    this.initFrame();
    this.initTransform(data, globalData, comp);
    this.initHierarchy();
  }

  NullElement.prototype.prepareFrame = function (num) {
    this.prepareProperties(num, true);
  };

  NullElement.prototype.renderFrame = function () {};

  NullElement.prototype.getBaseElement = function () {
    return null;
  };

  NullElement.prototype.destroy = function () {};

  NullElement.prototype.sourceRectAtTime = function () {};

  NullElement.prototype.hide = function () {};

  extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement], NullElement);

  function SVGRendererBase() {}

  extendPrototype([BaseRenderer], SVGRendererBase);

  SVGRendererBase.prototype.createNull = function (data) {
    return new NullElement(data, this.globalData, this);
  };

  SVGRendererBase.prototype.createShape = function (data) {
    return new SVGShapeElement(data, this.globalData, this);
  };

  SVGRendererBase.prototype.createText = function (data) {
    return new SVGTextLottieElement(data, this.globalData, this);
  };

  SVGRendererBase.prototype.createImage = function (data) {
    return new IImageElement(data, this.globalData, this);
  };

  SVGRendererBase.prototype.createSolid = function (data) {
    return new ISolidElement(data, this.globalData, this);
  };

  SVGRendererBase.prototype.configAnimation = function (animData) {
    this.svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    if (this.renderConfig.viewBoxSize) {
      this.svgElement.setAttribute('viewBox', this.renderConfig.viewBoxSize);
    } else {
      this.svgElement.setAttribute('viewBox', '0 0 ' + animData.w + ' ' + animData.h);
    }

    if (!this.renderConfig.viewBoxOnly) {
      this.svgElement.setAttribute('width', animData.w);
      this.svgElement.setAttribute('height', animData.h);
      this.svgElement.style.width = '100%';
      this.svgElement.style.height = '100%';
      this.svgElement.style.transform = 'translate3d(0,0,0)';
      this.svgElement.style.contentVisibility = this.renderConfig.contentVisibility;
    }

    if (this.renderConfig.className) {
      this.svgElement.setAttribute('class', this.renderConfig.className);
    }

    if (this.renderConfig.id) {
      this.svgElement.setAttribute('id', this.renderConfig.id);
    }

    if (this.renderConfig.focusable !== undefined) {
      this.svgElement.setAttribute('focusable', this.renderConfig.focusable);
    }

    this.svgElement.setAttribute('preserveAspectRatio', this.renderConfig.preserveAspectRatio); // this.layerElement.style.transform = 'translate3d(0,0,0)';
    // this.layerElement.style.transformOrigin = this.layerElement.style.mozTransformOrigin = this.layerElement.style.webkitTransformOrigin = this.layerElement.style['-webkit-transform'] = "0px 0px 0px";

    this.animationItem.wrapper.appendChild(this.svgElement); // Mask animation

    var defs = this.globalData.defs;
    this.setupGlobalData(animData, defs);
    this.globalData.progressiveLoad = this.renderConfig.progressiveLoad;
    this.data = animData;
    var maskElement = createNS('clipPath');
    var rect = createNS('rect');
    rect.setAttribute('width', animData.w);
    rect.setAttribute('height', animData.h);
    rect.setAttribute('x', 0);
    rect.setAttribute('y', 0);
    var maskId = createElementID();
    maskElement.setAttribute('id', maskId);
    maskElement.appendChild(rect);
    this.layerElement.setAttribute('clip-path', 'url(' + getLocationHref() + '#' + maskId + ')');
    defs.appendChild(maskElement);
    this.layers = animData.layers;
    this.elements = createSizedArray(animData.layers.length);
  };

  SVGRendererBase.prototype.destroy = function () {
    if (this.animationItem.wrapper) {
      this.animationItem.wrapper.innerText = '';
    }

    this.layerElement = null;
    this.globalData.defs = null;
    var i;
    var len = this.layers ? this.layers.length : 0;

    for (i = 0; i < len; i += 1) {
      if (this.elements[i]) {
        this.elements[i].destroy();
      }
    }

    this.elements.length = 0;
    this.destroyed = true;
    this.animationItem = null;
  };

  SVGRendererBase.prototype.updateContainerSize = function () {};

  SVGRendererBase.prototype.buildItem = function (pos) {
    var elements = this.elements;

    if (elements[pos] || this.layers[pos].ty === 99) {
      return;
    }

    elements[pos] = true;
    var element = this.createItem(this.layers[pos]);
    elements[pos] = element;

    if (getExpressionsPlugin()) {
      if (this.layers[pos].ty === 0) {
        this.globalData.projectInterface.registerComposition(element);
      }

      element.initExpressions();
    }

    this.appendElementInPos(element, pos);

    if (this.layers[pos].tt) {
      if (!this.elements[pos - 1] || this.elements[pos - 1] === true) {
        this.buildItem(pos - 1);
        this.addPendingElement(element);
      } else {
        element.setMatte(elements[pos - 1].layerId);
      }
    }
  };

  SVGRendererBase.prototype.checkPendingElements = function () {
    while (this.pendingElements.length) {
      var element = this.pendingElements.pop();
      element.checkParenting();

      if (element.data.tt) {
        var i = 0;
        var len = this.elements.length;

        while (i < len) {
          if (this.elements[i] === element) {
            element.setMatte(this.elements[i - 1].layerId);
            break;
          }

          i += 1;
        }
      }
    }
  };

  SVGRendererBase.prototype.renderFrame = function (num) {
    if (this.renderedFrame === num || this.destroyed) {
      return;
    }

    if (num === null) {
      num = this.renderedFrame;
    } else {
      this.renderedFrame = num;
    } // console.log('-------');
    // console.log('FRAME ',num);


    this.globalData.frameNum = num;
    this.globalData.frameId += 1;
    this.globalData.projectInterface.currentFrame = num;
    this.globalData._mdf = false;
    var i;
    var len = this.layers.length;

    if (!this.completeLayers) {
      this.checkLayers(num);
    }

    for (i = len - 1; i >= 0; i -= 1) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].prepareFrame(num - this.layers[i].st);
      }
    }

    if (this.globalData._mdf) {
      for (i = 0; i < len; i += 1) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].renderFrame();
        }
      }
    }
  };

  SVGRendererBase.prototype.appendElementInPos = function (element, pos) {
    var newElement = element.getBaseElement();

    if (!newElement) {
      return;
    }

    var i = 0;
    var nextElement;

    while (i < pos) {
      if (this.elements[i] && this.elements[i] !== true && this.elements[i].getBaseElement()) {
        nextElement = this.elements[i].getBaseElement();
      }

      i += 1;
    }

    if (nextElement) {
      this.layerElement.insertBefore(newElement, nextElement);
    } else {
      this.layerElement.appendChild(newElement);
    }
  };

  SVGRendererBase.prototype.hide = function () {
    this.layerElement.style.display = 'none';
  };

  SVGRendererBase.prototype.show = function () {
    this.layerElement.style.display = 'block';
  };

  function ICompElement() {}

  extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement, RenderableDOMElement], ICompElement);

  ICompElement.prototype.initElement = function (data, globalData, comp) {
    this.initFrame();
    this.initBaseData(data, globalData, comp);
    this.initTransform(data, globalData, comp);
    this.initRenderable();
    this.initHierarchy();
    this.initRendererElement();
    this.createContainerElements();
    this.createRenderableComponents();

    if (this.data.xt || !globalData.progressiveLoad) {
      this.buildAllItems();
    }

    this.hide();
  };
  /* ICompElement.prototype.hide = function(){
      if(!this.hidden){
          this.hideElement();
          var i,len = this.elements.length;
          for( i = 0; i < len; i+=1 ){
              if(this.elements[i]){
                  this.elements[i].hide();
              }
          }
      }
  }; */


  ICompElement.prototype.prepareFrame = function (num) {
    this._mdf = false;
    this.prepareRenderableFrame(num);
    this.prepareProperties(num, this.isInRange);

    if (!this.isInRange && !this.data.xt) {
      return;
    }

    if (!this.tm._placeholder) {
      var timeRemapped = this.tm.v;

      if (timeRemapped === this.data.op) {
        timeRemapped = this.data.op - 1;
      }

      this.renderedFrame = timeRemapped;
    } else {
      this.renderedFrame = num / this.data.sr;
    }

    var i;
    var len = this.elements.length;

    if (!this.completeLayers) {
      this.checkLayers(this.renderedFrame);
    } // This iteration needs to be backwards because of how expressions connect between each other


    for (i = len - 1; i >= 0; i -= 1) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st);

        if (this.elements[i]._mdf) {
          this._mdf = true;
        }
      }
    }
  };

  ICompElement.prototype.renderInnerContent = function () {
    var i;
    var len = this.layers.length;

    for (i = 0; i < len; i += 1) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].renderFrame();
      }
    }
  };

  ICompElement.prototype.setElements = function (elems) {
    this.elements = elems;
  };

  ICompElement.prototype.getElements = function () {
    return this.elements;
  };

  ICompElement.prototype.destroyElements = function () {
    var i;
    var len = this.layers.length;

    for (i = 0; i < len; i += 1) {
      if (this.elements[i]) {
        this.elements[i].destroy();
      }
    }
  };

  ICompElement.prototype.destroy = function () {
    this.destroyElements();
    this.destroyBaseElement();
  };

  function SVGCompElement(data, globalData, comp) {
    this.layers = data.layers;
    this.supports3d = true;
    this.completeLayers = false;
    this.pendingElements = [];
    this.elements = this.layers ? createSizedArray(this.layers.length) : [];
    this.initElement(data, globalData, comp);
    this.tm = data.tm ? PropertyFactory.getProp(this, data.tm, 0, globalData.frameRate, this) : {
      _placeholder: true
    };
  }

  extendPrototype([SVGRendererBase, ICompElement, SVGBaseElement], SVGCompElement);

  SVGCompElement.prototype.createComp = function (data) {
    return new SVGCompElement(data, this.globalData, this);
  };

  function SVGRenderer(animationItem, config) {
    this.animationItem = animationItem;
    this.layers = null;
    this.renderedFrame = -1;
    this.svgElement = createNS('svg');
    var ariaLabel = '';

    if (config && config.title) {
      var titleElement = createNS('title');
      var titleId = createElementID();
      titleElement.setAttribute('id', titleId);
      titleElement.textContent = config.title;
      this.svgElement.appendChild(titleElement);
      ariaLabel += titleId;
    }

    if (config && config.description) {
      var descElement = createNS('desc');
      var descId = createElementID();
      descElement.setAttribute('id', descId);
      descElement.textContent = config.description;
      this.svgElement.appendChild(descElement);
      ariaLabel += ' ' + descId;
    }

    if (ariaLabel) {
      this.svgElement.setAttribute('aria-labelledby', ariaLabel);
    }

    var defs = createNS('defs');
    this.svgElement.appendChild(defs);
    var maskElement = createNS('g');
    this.svgElement.appendChild(maskElement);
    this.layerElement = maskElement;
    this.renderConfig = {
      preserveAspectRatio: config && config.preserveAspectRatio || 'xMidYMid meet',
      imagePreserveAspectRatio: config && config.imagePreserveAspectRatio || 'xMidYMid slice',
      contentVisibility: config && config.contentVisibility || 'visible',
      progressiveLoad: config && config.progressiveLoad || false,
      hideOnTransparent: !(config && config.hideOnTransparent === false),
      viewBoxOnly: config && config.viewBoxOnly || false,
      viewBoxSize: config && config.viewBoxSize || false,
      className: config && config.className || '',
      id: config && config.id || '',
      focusable: config && config.focusable,
      filterSize: {
        width: config && config.filterSize && config.filterSize.width || '100%',
        height: config && config.filterSize && config.filterSize.height || '100%',
        x: config && config.filterSize && config.filterSize.x || '0%',
        y: config && config.filterSize && config.filterSize.y || '0%'
      }
    };
    this.globalData = {
      _mdf: false,
      frameNum: -1,
      defs: defs,
      renderConfig: this.renderConfig
    };
    this.elements = [];
    this.pendingElements = [];
    this.destroyed = false;
    this.rendererType = 'svg';
  }

  extendPrototype([SVGRendererBase], SVGRenderer);

  SVGRenderer.prototype.createComp = function (data) {
    return new SVGCompElement(data, this.globalData, this);
  };

  function CVContextData() {
    this.saved = [];
    this.cArrPos = 0;
    this.cTr = new Matrix();
    this.cO = 1;
    var i;
    var len = 15;
    this.savedOp = createTypedArray('float32', len);

    for (i = 0; i < len; i += 1) {
      this.saved[i] = createTypedArray('float32', 16);
    }

    this._length = len;
  }

  CVContextData.prototype.duplicate = function () {
    var newLength = this._length * 2;
    var currentSavedOp = this.savedOp;
    this.savedOp = createTypedArray('float32', newLength);
    this.savedOp.set(currentSavedOp);
    var i = 0;

    for (i = this._length; i < newLength; i += 1) {
      this.saved[i] = createTypedArray('float32', 16);
    }

    this._length = newLength;
  };

  CVContextData.prototype.reset = function () {
    this.cArrPos = 0;
    this.cTr.reset();
    this.cO = 1;
  };

  function ShapeTransformManager() {
    this.sequences = {};
    this.sequenceList = [];
    this.transform_key_count = 0;
  }

  ShapeTransformManager.prototype = {
    addTransformSequence: function addTransformSequence(transforms) {
      var i;
      var len = transforms.length;
      var key = '_';

      for (i = 0; i < len; i += 1) {
        key += transforms[i].transform.key + '_';
      }

      var sequence = this.sequences[key];

      if (!sequence) {
        sequence = {
          transforms: [].concat(transforms),
          finalTransform: new Matrix(),
          _mdf: false
        };
        this.sequences[key] = sequence;
        this.sequenceList.push(sequence);
      }

      return sequence;
    },
    processSequence: function processSequence(sequence, isFirstFrame) {
      var i = 0;
      var len = sequence.transforms.length;
      var _mdf = isFirstFrame;

      while (i < len && !isFirstFrame) {
        if (sequence.transforms[i].transform.mProps._mdf) {
          _mdf = true;
          break;
        }

        i += 1;
      }

      if (_mdf) {
        var props;
        sequence.finalTransform.reset();

        for (i = len - 1; i >= 0; i -= 1) {
          props = sequence.transforms[i].transform.mProps.v.props;
          sequence.finalTransform.transform(props[0], props[1], props[2], props[3], props[4], props[5], props[6], props[7], props[8], props[9], props[10], props[11], props[12], props[13], props[14], props[15]);
        }
      }

      sequence._mdf = _mdf;
    },
    processSequences: function processSequences(isFirstFrame) {
      var i;
      var len = this.sequenceList.length;

      for (i = 0; i < len; i += 1) {
        this.processSequence(this.sequenceList[i], isFirstFrame);
      }
    },
    getNewKey: function getNewKey() {
      this.transform_key_count += 1;
      return '_' + this.transform_key_count;
    }
  };

  function CVEffects() {}

  CVEffects.prototype.renderFrame = function () {};

  function CVMaskElement(data, element) {
    this.data = data;
    this.element = element;
    this.masksProperties = this.data.masksProperties || [];
    this.viewData = createSizedArray(this.masksProperties.length);
    var i;
    var len = this.masksProperties.length;
    var hasMasks = false;

    for (i = 0; i < len; i += 1) {
      if (this.masksProperties[i].mode !== 'n') {
        hasMasks = true;
      }

      this.viewData[i] = ShapePropertyFactory.getShapeProp(this.element, this.masksProperties[i], 3);
    }

    this.hasMasks = hasMasks;

    if (hasMasks) {
      this.element.addRenderableComponent(this);
    }
  }

  CVMaskElement.prototype.renderFrame = function () {
    if (!this.hasMasks) {
      return;
    }

    var transform = this.element.finalTransform.mat;
    var ctx = this.element.canvasContext;
    var i;
    var len = this.masksProperties.length;
    var pt;
    var pts;
    var data;
    ctx.beginPath();

    for (i = 0; i < len; i += 1) {
      if (this.masksProperties[i].mode !== 'n') {
        if (this.masksProperties[i].inv) {
          ctx.moveTo(0, 0);
          ctx.lineTo(this.element.globalData.compSize.w, 0);
          ctx.lineTo(this.element.globalData.compSize.w, this.element.globalData.compSize.h);
          ctx.lineTo(0, this.element.globalData.compSize.h);
          ctx.lineTo(0, 0);
        }

        data = this.viewData[i].v;
        pt = transform.applyToPointArray(data.v[0][0], data.v[0][1], 0);
        ctx.moveTo(pt[0], pt[1]);
        var j;
        var jLen = data._length;

        for (j = 1; j < jLen; j += 1) {
          pts = transform.applyToTriplePoints(data.o[j - 1], data.i[j], data.v[j]);
          ctx.bezierCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
        }

        pts = transform.applyToTriplePoints(data.o[j - 1], data.i[0], data.v[0]);
        ctx.bezierCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
      }
    }

    this.element.globalData.renderer.save(true);
    ctx.clip();
  };

  CVMaskElement.prototype.getMaskProperty = MaskElement.prototype.getMaskProperty;

  CVMaskElement.prototype.destroy = function () {
    this.element = null;
  };

  function CVBaseElement() {}

  CVBaseElement.prototype = {
    createElements: function createElements() {},
    initRendererElement: function initRendererElement() {},
    createContainerElements: function createContainerElements() {
      this.canvasContext = this.globalData.canvasContext;
      this.renderableEffectsManager = new CVEffects(this);
    },
    createContent: function createContent() {},
    setBlendMode: function setBlendMode() {
      var globalData = this.globalData;

      if (globalData.blendMode !== this.data.bm) {
        globalData.blendMode = this.data.bm;
        var blendModeValue = getBlendMode(this.data.bm);
        globalData.canvasContext.globalCompositeOperation = blendModeValue;
      }
    },
    createRenderableComponents: function createRenderableComponents() {
      this.maskManager = new CVMaskElement(this.data, this);
    },
    hideElement: function hideElement() {
      if (!this.hidden && (!this.isInRange || this.isTransparent)) {
        this.hidden = true;
      }
    },
    showElement: function showElement() {
      if (this.isInRange && !this.isTransparent) {
        this.hidden = false;
        this._isFirstFrame = true;
        this.maskManager._isFirstFrame = true;
      }
    },
    renderFrame: function renderFrame() {
      if (this.hidden || this.data.hd) {
        return;
      }

      this.renderTransform();
      this.renderRenderable();
      this.setBlendMode();
      var forceRealStack = this.data.ty === 0;
      this.globalData.renderer.save(forceRealStack);
      this.globalData.renderer.ctxTransform(this.finalTransform.mat.props);
      this.globalData.renderer.ctxOpacity(this.finalTransform.mProp.o.v);
      this.renderInnerContent();
      this.globalData.renderer.restore(forceRealStack);

      if (this.maskManager.hasMasks) {
        this.globalData.renderer.restore(true);
      }

      if (this._isFirstFrame) {
        this._isFirstFrame = false;
      }
    },
    destroy: function destroy() {
      this.canvasContext = null;
      this.data = null;
      this.globalData = null;
      this.maskManager.destroy();
    },
    mHelper: new Matrix()
  };
  CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement;
  CVBaseElement.prototype.show = CVBaseElement.prototype.showElement;

  function CVShapeData(element, data, styles, transformsManager) {
    this.styledShapes = [];
    this.tr = [0, 0, 0, 0, 0, 0];
    var ty = 4;

    if (data.ty === 'rc') {
      ty = 5;
    } else if (data.ty === 'el') {
      ty = 6;
    } else if (data.ty === 'sr') {
      ty = 7;
    }

    this.sh = ShapePropertyFactory.getShapeProp(element, data, ty, element);
    var i;
    var len = styles.length;
    var styledShape;

    for (i = 0; i < len; i += 1) {
      if (!styles[i].closed) {
        styledShape = {
          transforms: transformsManager.addTransformSequence(styles[i].transforms),
          trNodes: []
        };
        this.styledShapes.push(styledShape);
        styles[i].elements.push(styledShape);
      }
    }
  }

  CVShapeData.prototype.setAsAnimated = SVGShapeData.prototype.setAsAnimated;

  function CVShapeElement(data, globalData, comp) {
    this.shapes = [];
    this.shapesData = data.shapes;
    this.stylesList = [];
    this.itemsData = [];
    this.prevViewData = [];
    this.shapeModifiers = [];
    this.processedElements = [];
    this.transformsManager = new ShapeTransformManager();
    this.initElement(data, globalData, comp);
  }

  extendPrototype([BaseElement, TransformElement, CVBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableElement], CVShapeElement);
  CVShapeElement.prototype.initElement = RenderableDOMElement.prototype.initElement;
  CVShapeElement.prototype.transformHelper = {
    opacity: 1,
    _opMdf: false
  };
  CVShapeElement.prototype.dashResetter = [];

  CVShapeElement.prototype.createContent = function () {
    this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []);
  };

  CVShapeElement.prototype.createStyleElement = function (data, transforms) {
    var styleElem = {
      data: data,
      type: data.ty,
      preTransforms: this.transformsManager.addTransformSequence(transforms),
      transforms: [],
      elements: [],
      closed: data.hd === true
    };
    var elementData = {};

    if (data.ty === 'fl' || data.ty === 'st') {
      elementData.c = PropertyFactory.getProp(this, data.c, 1, 255, this);

      if (!elementData.c.k) {
        styleElem.co = 'rgb(' + bmFloor(elementData.c.v[0]) + ',' + bmFloor(elementData.c.v[1]) + ',' + bmFloor(elementData.c.v[2]) + ')';
      }
    } else if (data.ty === 'gf' || data.ty === 'gs') {
      elementData.s = PropertyFactory.getProp(this, data.s, 1, null, this);
      elementData.e = PropertyFactory.getProp(this, data.e, 1, null, this);
      elementData.h = PropertyFactory.getProp(this, data.h || {
        k: 0
      }, 0, 0.01, this);
      elementData.a = PropertyFactory.getProp(this, data.a || {
        k: 0
      }, 0, degToRads, this);
      elementData.g = new GradientProperty(this, data.g, this);
    }

    elementData.o = PropertyFactory.getProp(this, data.o, 0, 0.01, this);

    if (data.ty === 'st' || data.ty === 'gs') {
      styleElem.lc = lineCapEnum[data.lc || 2];
      styleElem.lj = lineJoinEnum[data.lj || 2];

      if (data.lj == 1) {
        // eslint-disable-line eqeqeq
        styleElem.ml = data.ml;
      }

      elementData.w = PropertyFactory.getProp(this, data.w, 0, null, this);

      if (!elementData.w.k) {
        styleElem.wi = elementData.w.v;
      }

      if (data.d) {
        var d = new DashProperty(this, data.d, 'canvas', this);
        elementData.d = d;

        if (!elementData.d.k) {
          styleElem.da = elementData.d.dashArray;
          styleElem["do"] = elementData.d.dashoffset[0];
        }
      }
    } else {
      styleElem.r = data.r === 2 ? 'evenodd' : 'nonzero';
    }

    this.stylesList.push(styleElem);
    elementData.style = styleElem;
    return elementData;
  };

  CVShapeElement.prototype.createGroupElement = function () {
    var elementData = {
      it: [],
      prevViewData: []
    };
    return elementData;
  };

  CVShapeElement.prototype.createTransformElement = function (data) {
    var elementData = {
      transform: {
        opacity: 1,
        _opMdf: false,
        key: this.transformsManager.getNewKey(),
        op: PropertyFactory.getProp(this, data.o, 0, 0.01, this),
        mProps: TransformPropertyFactory.getTransformProperty(this, data, this)
      }
    };
    return elementData;
  };

  CVShapeElement.prototype.createShapeElement = function (data) {
    var elementData = new CVShapeData(this, data, this.stylesList, this.transformsManager);
    this.shapes.push(elementData);
    this.addShapeToModifiers(elementData);
    return elementData;
  };

  CVShapeElement.prototype.reloadShapes = function () {
    this._isFirstFrame = true;
    var i;
    var len = this.itemsData.length;

    for (i = 0; i < len; i += 1) {
      this.prevViewData[i] = this.itemsData[i];
    }

    this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, true, []);
    len = this.dynamicProperties.length;

    for (i = 0; i < len; i += 1) {
      this.dynamicProperties[i].getValue();
    }

    this.renderModifiers();
    this.transformsManager.processSequences(this._isFirstFrame);
  };

  CVShapeElement.prototype.addTransformToStyleList = function (transform) {
    var i;
    var len = this.stylesList.length;

    for (i = 0; i < len; i += 1) {
      if (!this.stylesList[i].closed) {
        this.stylesList[i].transforms.push(transform);
      }
    }
  };

  CVShapeElement.prototype.removeTransformFromStyleList = function () {
    var i;
    var len = this.stylesList.length;

    for (i = 0; i < len; i += 1) {
      if (!this.stylesList[i].closed) {
        this.stylesList[i].transforms.pop();
      }
    }
  };

  CVShapeElement.prototype.closeStyles = function (styles) {
    var i;
    var len = styles.length;

    for (i = 0; i < len; i += 1) {
      styles[i].closed = true;
    }
  };

  CVShapeElement.prototype.searchShapes = function (arr, itemsData, prevViewData, shouldRender, transforms) {
    var i;
    var len = arr.length - 1;
    var j;
    var jLen;
    var ownStyles = [];
    var ownModifiers = [];
    var processedPos;
    var modifier;
    var currentTransform;
    var ownTransforms = [].concat(transforms);

    for (i = len; i >= 0; i -= 1) {
      processedPos = this.searchProcessedElement(arr[i]);

      if (!processedPos) {
        arr[i]._shouldRender = shouldRender;
      } else {
        itemsData[i] = prevViewData[processedPos - 1];
      }

      if (arr[i].ty === 'fl' || arr[i].ty === 'st' || arr[i].ty === 'gf' || arr[i].ty === 'gs') {
        if (!processedPos) {
          itemsData[i] = this.createStyleElement(arr[i], ownTransforms);
        } else {
          itemsData[i].style.closed = false;
        }

        ownStyles.push(itemsData[i].style);
      } else if (arr[i].ty === 'gr') {
        if (!processedPos) {
          itemsData[i] = this.createGroupElement(arr[i]);
        } else {
          jLen = itemsData[i].it.length;

          for (j = 0; j < jLen; j += 1) {
            itemsData[i].prevViewData[j] = itemsData[i].it[j];
          }
        }

        this.searchShapes(arr[i].it, itemsData[i].it, itemsData[i].prevViewData, shouldRender, ownTransforms);
      } else if (arr[i].ty === 'tr') {
        if (!processedPos) {
          currentTransform = this.createTransformElement(arr[i]);
          itemsData[i] = currentTransform;
        }

        ownTransforms.push(itemsData[i]);
        this.addTransformToStyleList(itemsData[i]);
      } else if (arr[i].ty === 'sh' || arr[i].ty === 'rc' || arr[i].ty === 'el' || arr[i].ty === 'sr') {
        if (!processedPos) {
          itemsData[i] = this.createShapeElement(arr[i]);
        }
      } else if (arr[i].ty === 'tm' || arr[i].ty === 'rd' || arr[i].ty === 'pb') {
        if (!processedPos) {
          modifier = ShapeModifiers.getModifier(arr[i].ty);
          modifier.init(this, arr[i]);
          itemsData[i] = modifier;
          this.shapeModifiers.push(modifier);
        } else {
          modifier = itemsData[i];
          modifier.closed = false;
        }

        ownModifiers.push(modifier);
      } else if (arr[i].ty === 'rp') {
        if (!processedPos) {
          modifier = ShapeModifiers.getModifier(arr[i].ty);
          itemsData[i] = modifier;
          modifier.init(this, arr, i, itemsData);
          this.shapeModifiers.push(modifier);
          shouldRender = false;
        } else {
          modifier = itemsData[i];
          modifier.closed = true;
        }

        ownModifiers.push(modifier);
      }

      this.addProcessedElement(arr[i], i + 1);
    }

    this.removeTransformFromStyleList();
    this.closeStyles(ownStyles);
    len = ownModifiers.length;

    for (i = 0; i < len; i += 1) {
      ownModifiers[i].closed = true;
    }
  };

  CVShapeElement.prototype.renderInnerContent = function () {
    this.transformHelper.opacity = 1;
    this.transformHelper._opMdf = false;
    this.renderModifiers();
    this.transformsManager.processSequences(this._isFirstFrame);
    this.renderShape(this.transformHelper, this.shapesData, this.itemsData, true);
  };

  CVShapeElement.prototype.renderShapeTransform = function (parentTransform, groupTransform) {
    if (parentTransform._opMdf || groupTransform.op._mdf || this._isFirstFrame) {
      groupTransform.opacity = parentTransform.opacity;
      groupTransform.opacity *= groupTransform.op.v;
      groupTransform._opMdf = true;
    }
  };

  CVShapeElement.prototype.drawLayer = function () {
    var i;
    var len = this.stylesList.length;
    var j;
    var jLen;
    var k;
    var kLen;
    var elems;
    var nodes;
    var renderer = this.globalData.renderer;
    var ctx = this.globalData.canvasContext;
    var type;
    var currentStyle;

    for (i = 0; i < len; i += 1) {
      currentStyle = this.stylesList[i];
      type = currentStyle.type; // Skipping style when
      // Stroke width equals 0
      // style should not be rendered (extra unused repeaters)
      // current opacity equals 0
      // global opacity equals 0

      if (!((type === 'st' || type === 'gs') && currentStyle.wi === 0 || !currentStyle.data._shouldRender || currentStyle.coOp === 0 || this.globalData.currentGlobalAlpha === 0)) {
        renderer.save();
        elems = currentStyle.elements;

        if (type === 'st' || type === 'gs') {
          ctx.strokeStyle = type === 'st' ? currentStyle.co : currentStyle.grd;
          ctx.lineWidth = currentStyle.wi;
          ctx.lineCap = currentStyle.lc;
          ctx.lineJoin = currentStyle.lj;
          ctx.miterLimit = currentStyle.ml || 0;
        } else {
          ctx.fillStyle = type === 'fl' ? currentStyle.co : currentStyle.grd;
        }

        renderer.ctxOpacity(currentStyle.coOp);

        if (type !== 'st' && type !== 'gs') {
          ctx.beginPath();
        }

        renderer.ctxTransform(currentStyle.preTransforms.finalTransform.props);
        jLen = elems.length;

        for (j = 0; j < jLen; j += 1) {
          if (type === 'st' || type === 'gs') {
            ctx.beginPath();

            if (currentStyle.da) {
              ctx.setLineDash(currentStyle.da);
              ctx.lineDashOffset = currentStyle["do"];
            }
          }

          nodes = elems[j].trNodes;
          kLen = nodes.length;

          for (k = 0; k < kLen; k += 1) {
            if (nodes[k].t === 'm') {
              ctx.moveTo(nodes[k].p[0], nodes[k].p[1]);
            } else if (nodes[k].t === 'c') {
              ctx.bezierCurveTo(nodes[k].pts[0], nodes[k].pts[1], nodes[k].pts[2], nodes[k].pts[3], nodes[k].pts[4], nodes[k].pts[5]);
            } else {
              ctx.closePath();
            }
          }

          if (type === 'st' || type === 'gs') {
            ctx.stroke();

            if (currentStyle.da) {
              ctx.setLineDash(this.dashResetter);
            }
          }
        }

        if (type !== 'st' && type !== 'gs') {
          ctx.fill(currentStyle.r);
        }

        renderer.restore();
      }
    }
  };

  CVShapeElement.prototype.renderShape = function (parentTransform, items, data, isMain) {
    var i;
    var len = items.length - 1;
    var groupTransform;
    groupTransform = parentTransform;

    for (i = len; i >= 0; i -= 1) {
      if (items[i].ty === 'tr') {
        groupTransform = data[i].transform;
        this.renderShapeTransform(parentTransform, groupTransform);
      } else if (items[i].ty === 'sh' || items[i].ty === 'el' || items[i].ty === 'rc' || items[i].ty === 'sr') {
        this.renderPath(items[i], data[i]);
      } else if (items[i].ty === 'fl') {
        this.renderFill(items[i], data[i], groupTransform);
      } else if (items[i].ty === 'st') {
        this.renderStroke(items[i], data[i], groupTransform);
      } else if (items[i].ty === 'gf' || items[i].ty === 'gs') {
        this.renderGradientFill(items[i], data[i], groupTransform);
      } else if (items[i].ty === 'gr') {
        this.renderShape(groupTransform, items[i].it, data[i].it);
      } else if (items[i].ty === 'tm') {//
      }
    }

    if (isMain) {
      this.drawLayer();
    }
  };

  CVShapeElement.prototype.renderStyledShape = function (styledShape, shape) {
    if (this._isFirstFrame || shape._mdf || styledShape.transforms._mdf) {
      var shapeNodes = styledShape.trNodes;
      var paths = shape.paths;
      var i;
      var len;
      var j;
      var jLen = paths._length;
      shapeNodes.length = 0;
      var groupTransformMat = styledShape.transforms.finalTransform;

      for (j = 0; j < jLen; j += 1) {
        var pathNodes = paths.shapes[j];

        if (pathNodes && pathNodes.v) {
          len = pathNodes._length;

          for (i = 1; i < len; i += 1) {
            if (i === 1) {
              shapeNodes.push({
                t: 'm',
                p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
              });
            }

            shapeNodes.push({
              t: 'c',
              pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[i], pathNodes.v[i])
            });
          }

          if (len === 1) {
            shapeNodes.push({
              t: 'm',
              p: groupTransformMat.applyToPointArray(pathNodes.v[0][0], pathNodes.v[0][1], 0)
            });
          }

          if (pathNodes.c && len) {
            shapeNodes.push({
              t: 'c',
              pts: groupTransformMat.applyToTriplePoints(pathNodes.o[i - 1], pathNodes.i[0], pathNodes.v[0])
            });
            shapeNodes.push({
              t: 'z'
            });
          }
        }
      }

      styledShape.trNodes = shapeNodes;
    }
  };

  CVShapeElement.prototype.renderPath = function (pathData, itemData) {
    if (pathData.hd !== true && pathData._shouldRender) {
      var i;
      var len = itemData.styledShapes.length;

      for (i = 0; i < len; i += 1) {
        this.renderStyledShape(itemData.styledShapes[i], itemData.sh);
      }
    }
  };

  CVShapeElement.prototype.renderFill = function (styleData, itemData, groupTransform) {
    var styleElem = itemData.style;

    if (itemData.c._mdf || this._isFirstFrame) {
      styleElem.co = 'rgb(' + bmFloor(itemData.c.v[0]) + ',' + bmFloor(itemData.c.v[1]) + ',' + bmFloor(itemData.c.v[2]) + ')';
    }

    if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
      styleElem.coOp = itemData.o.v * groupTransform.opacity;
    }
  };

  CVShapeElement.prototype.renderGradientFill = function (styleData, itemData, groupTransform) {
    var styleElem = itemData.style;
    var grd;

    if (!styleElem.grd || itemData.g._mdf || itemData.s._mdf || itemData.e._mdf || styleData.t !== 1 && (itemData.h._mdf || itemData.a._mdf)) {
      var ctx = this.globalData.canvasContext;
      var pt1 = itemData.s.v;
      var pt2 = itemData.e.v;

      if (styleData.t === 1) {
        grd = ctx.createLinearGradient(pt1[0], pt1[1], pt2[0], pt2[1]);
      } else {
        var rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
        var ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0]);
        var percent = itemData.h.v;

        if (percent >= 1) {
          percent = 0.99;
        } else if (percent <= -1) {
          percent = -0.99;
        }

        var dist = rad * percent;
        var x = Math.cos(ang + itemData.a.v) * dist + pt1[0];
        var y = Math.sin(ang + itemData.a.v) * dist + pt1[1];
        grd = ctx.createRadialGradient(x, y, 0, pt1[0], pt1[1], rad);
      }

      var i;
      var len = styleData.g.p;
      var cValues = itemData.g.c;
      var opacity = 1;

      for (i = 0; i < len; i += 1) {
        if (itemData.g._hasOpacity && itemData.g._collapsable) {
          opacity = itemData.g.o[i * 2 + 1];
        }

        grd.addColorStop(cValues[i * 4] / 100, 'rgba(' + cValues[i * 4 + 1] + ',' + cValues[i * 4 + 2] + ',' + cValues[i * 4 + 3] + ',' + opacity + ')');
      }

      styleElem.grd = grd;
    }

    styleElem.coOp = itemData.o.v * groupTransform.opacity;
  };

  CVShapeElement.prototype.renderStroke = function (styleData, itemData, groupTransform) {
    var styleElem = itemData.style;
    var d = itemData.d;

    if (d && (d._mdf || this._isFirstFrame)) {
      styleElem.da = d.dashArray;
      styleElem["do"] = d.dashoffset[0];
    }

    if (itemData.c._mdf || this._isFirstFrame) {
      styleElem.co = 'rgb(' + bmFloor(itemData.c.v[0]) + ',' + bmFloor(itemData.c.v[1]) + ',' + bmFloor(itemData.c.v[2]) + ')';
    }

    if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
      styleElem.coOp = itemData.o.v * groupTransform.opacity;
    }

    if (itemData.w._mdf || this._isFirstFrame) {
      styleElem.wi = itemData.w.v;
    }
  };

  CVShapeElement.prototype.destroy = function () {
    this.shapesData = null;
    this.globalData = null;
    this.canvasContext = null;
    this.stylesList.length = 0;
    this.itemsData.length = 0;
  };

  function CVTextElement(data, globalData, comp) {
    this.textSpans = [];
    this.yOffset = 0;
    this.fillColorAnim = false;
    this.strokeColorAnim = false;
    this.strokeWidthAnim = false;
    this.stroke = false;
    this.fill = false;
    this.justifyOffset = 0;
    this.currentRender = null;
    this.renderType = 'canvas';
    this.values = {
      fill: 'rgba(0,0,0,0)',
      stroke: 'rgba(0,0,0,0)',
      sWidth: 0,
      fValue: ''
    };
    this.initElement(data, globalData, comp);
  }

  extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement, ITextElement], CVTextElement);
  CVTextElement.prototype.tHelper = createTag('canvas').getContext('2d');

  CVTextElement.prototype.buildNewText = function () {
    var documentData = this.textProperty.currentData;
    this.renderedLetters = createSizedArray(documentData.l ? documentData.l.length : 0);
    var hasFill = false;

    if (documentData.fc) {
      hasFill = true;
      this.values.fill = this.buildColor(documentData.fc);
    } else {
      this.values.fill = 'rgba(0,0,0,0)';
    }

    this.fill = hasFill;
    var hasStroke = false;

    if (documentData.sc) {
      hasStroke = true;
      this.values.stroke = this.buildColor(documentData.sc);
      this.values.sWidth = documentData.sw;
    }

    var fontData = this.globalData.fontManager.getFontByName(documentData.f);
    var i;
    var len;
    var letters = documentData.l;
    var matrixHelper = this.mHelper;
    this.stroke = hasStroke;
    this.values.fValue = documentData.finalSize + 'px ' + this.globalData.fontManager.getFontByName(documentData.f).fFamily;
    len = documentData.finalText.length; // this.tHelper.font = this.values.fValue;

    var charData;
    var shapeData;
    var k;
    var kLen;
    var shapes;
    var j;
    var jLen;
    var pathNodes;
    var commands;
    var pathArr;
    var singleShape = this.data.singleShape;
    var trackingOffset = documentData.tr * 0.001 * documentData.finalSize;
    var xPos = 0;
    var yPos = 0;
    var firstLine = true;
    var cnt = 0;

    for (i = 0; i < len; i += 1) {
      charData = this.globalData.fontManager.getCharData(documentData.finalText[i], fontData.fStyle, this.globalData.fontManager.getFontByName(documentData.f).fFamily);
      shapeData = charData && charData.data || {};
      matrixHelper.reset();

      if (singleShape && letters[i].n) {
        xPos = -trackingOffset;
        yPos += documentData.yOffset;
        yPos += firstLine ? 1 : 0;
        firstLine = false;
      }

      shapes = shapeData.shapes ? shapeData.shapes[0].it : [];
      jLen = shapes.length;
      matrixHelper.scale(documentData.finalSize / 100, documentData.finalSize / 100);

      if (singleShape) {
        this.applyTextPropertiesToMatrix(documentData, matrixHelper, letters[i].line, xPos, yPos);
      }

      commands = createSizedArray(jLen - 1);
      var commandsCounter = 0;

      for (j = 0; j < jLen; j += 1) {
        if (shapes[j].ty === 'sh') {
          kLen = shapes[j].ks.k.i.length;
          pathNodes = shapes[j].ks.k;
          pathArr = [];

          for (k = 1; k < kLen; k += 1) {
            if (k === 1) {
              pathArr.push(matrixHelper.applyToX(pathNodes.v[0][0], pathNodes.v[0][1], 0), matrixHelper.applyToY(pathNodes.v[0][0], pathNodes.v[0][1], 0));
            }

            pathArr.push(matrixHelper.applyToX(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToY(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToX(pathNodes.i[k][0], pathNodes.i[k][1], 0), matrixHelper.applyToY(pathNodes.i[k][0], pathNodes.i[k][1], 0), matrixHelper.applyToX(pathNodes.v[k][0], pathNodes.v[k][1], 0), matrixHelper.applyToY(pathNodes.v[k][0], pathNodes.v[k][1], 0));
          }

          pathArr.push(matrixHelper.applyToX(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToY(pathNodes.o[k - 1][0], pathNodes.o[k - 1][1], 0), matrixHelper.applyToX(pathNodes.i[0][0], pathNodes.i[0][1], 0), matrixHelper.applyToY(pathNodes.i[0][0], pathNodes.i[0][1], 0), matrixHelper.applyToX(pathNodes.v[0][0], pathNodes.v[0][1], 0), matrixHelper.applyToY(pathNodes.v[0][0], pathNodes.v[0][1], 0));
          commands[commandsCounter] = pathArr;
          commandsCounter += 1;
        }
      }

      if (singleShape) {
        xPos += letters[i].l;
        xPos += trackingOffset;
      }

      if (this.textSpans[cnt]) {
        this.textSpans[cnt].elem = commands;
      } else {
        this.textSpans[cnt] = {
          elem: commands
        };
      }

      cnt += 1;
    }
  };

  CVTextElement.prototype.renderInnerContent = function () {
    var ctx = this.canvasContext;
    ctx.font = this.values.fValue;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 4;

    if (!this.data.singleShape) {
      this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);
    }

    var i;
    var len;
    var j;
    var jLen;
    var k;
    var kLen;
    var renderedLetters = this.textAnimator.renderedLetters;
    var letters = this.textProperty.currentData.l;
    len = letters.length;
    var renderedLetter;
    var lastFill = null;
    var lastStroke = null;
    var lastStrokeW = null;
    var commands;
    var pathArr;

    for (i = 0; i < len; i += 1) {
      if (!letters[i].n) {
        renderedLetter = renderedLetters[i];

        if (renderedLetter) {
          this.globalData.renderer.save();
          this.globalData.renderer.ctxTransform(renderedLetter.p);
          this.globalData.renderer.ctxOpacity(renderedLetter.o);
        }

        if (this.fill) {
          if (renderedLetter && renderedLetter.fc) {
            if (lastFill !== renderedLetter.fc) {
              lastFill = renderedLetter.fc;
              ctx.fillStyle = renderedLetter.fc;
            }
          } else if (lastFill !== this.values.fill) {
            lastFill = this.values.fill;
            ctx.fillStyle = this.values.fill;
          }

          commands = this.textSpans[i].elem;
          jLen = commands.length;
          this.globalData.canvasContext.beginPath();

          for (j = 0; j < jLen; j += 1) {
            pathArr = commands[j];
            kLen = pathArr.length;
            this.globalData.canvasContext.moveTo(pathArr[0], pathArr[1]);

            for (k = 2; k < kLen; k += 6) {
              this.globalData.canvasContext.bezierCurveTo(pathArr[k], pathArr[k + 1], pathArr[k + 2], pathArr[k + 3], pathArr[k + 4], pathArr[k + 5]);
            }
          }

          this.globalData.canvasContext.closePath();
          this.globalData.canvasContext.fill(); /// ctx.fillText(this.textSpans[i].val,0,0);
        }

        if (this.stroke) {
          if (renderedLetter && renderedLetter.sw) {
            if (lastStrokeW !== renderedLetter.sw) {
              lastStrokeW = renderedLetter.sw;
              ctx.lineWidth = renderedLetter.sw;
            }
          } else if (lastStrokeW !== this.values.sWidth) {
            lastStrokeW = this.values.sWidth;
            ctx.lineWidth = this.values.sWidth;
          }

          if (renderedLetter && renderedLetter.sc) {
            if (lastStroke !== renderedLetter.sc) {
              lastStroke = renderedLetter.sc;
              ctx.strokeStyle = renderedLetter.sc;
            }
          } else if (lastStroke !== this.values.stroke) {
            lastStroke = this.values.stroke;
            ctx.strokeStyle = this.values.stroke;
          }

          commands = this.textSpans[i].elem;
          jLen = commands.length;
          this.globalData.canvasContext.beginPath();

          for (j = 0; j < jLen; j += 1) {
            pathArr = commands[j];
            kLen = pathArr.length;
            this.globalData.canvasContext.moveTo(pathArr[0], pathArr[1]);

            for (k = 2; k < kLen; k += 6) {
              this.globalData.canvasContext.bezierCurveTo(pathArr[k], pathArr[k + 1], pathArr[k + 2], pathArr[k + 3], pathArr[k + 4], pathArr[k + 5]);
            }
          }

          this.globalData.canvasContext.closePath();
          this.globalData.canvasContext.stroke(); /// ctx.strokeText(letters[i].val,0,0);
        }

        if (renderedLetter) {
          this.globalData.renderer.restore();
        }
      }
    }
  };

  function CVImageElement(data, globalData, comp) {
    this.assetData = globalData.getAssetData(data.refId);
    this.img = globalData.imageLoader.getAsset(this.assetData);
    this.initElement(data, globalData, comp);
  }

  extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVImageElement);
  CVImageElement.prototype.initElement = SVGShapeElement.prototype.initElement;
  CVImageElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame;

  CVImageElement.prototype.createContent = function () {
    if (this.img.width && (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)) {
      var canvas = createTag('canvas');
      canvas.width = this.assetData.w;
      canvas.height = this.assetData.h;
      var ctx = canvas.getContext('2d');
      var imgW = this.img.width;
      var imgH = this.img.height;
      var imgRel = imgW / imgH;
      var canvasRel = this.assetData.w / this.assetData.h;
      var widthCrop;
      var heightCrop;
      var par = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio;

      if (imgRel > canvasRel && par === 'xMidYMid slice' || imgRel < canvasRel && par !== 'xMidYMid slice') {
        heightCrop = imgH;
        widthCrop = heightCrop * canvasRel;
      } else {
        widthCrop = imgW;
        heightCrop = widthCrop / canvasRel;
      }

      ctx.drawImage(this.img, (imgW - widthCrop) / 2, (imgH - heightCrop) / 2, widthCrop, heightCrop, 0, 0, this.assetData.w, this.assetData.h);
      this.img = canvas;
    }
  };

  CVImageElement.prototype.renderInnerContent = function () {
    this.canvasContext.drawImage(this.img, 0, 0);
  };

  CVImageElement.prototype.destroy = function () {
    this.img = null;
  };

  function CVSolidElement(data, globalData, comp) {
    this.initElement(data, globalData, comp);
  }

  extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVSolidElement);
  CVSolidElement.prototype.initElement = SVGShapeElement.prototype.initElement;
  CVSolidElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame;

  CVSolidElement.prototype.renderInnerContent = function () {
    var ctx = this.canvasContext;
    ctx.fillStyle = this.data.sc;
    ctx.fillRect(0, 0, this.data.sw, this.data.sh); //
  };

  function CanvasRendererBase(animationItem, config) {
    this.animationItem = animationItem;
    this.renderConfig = {
      clearCanvas: config && config.clearCanvas !== undefined ? config.clearCanvas : true,
      context: config && config.context || null,
      progressiveLoad: config && config.progressiveLoad || false,
      preserveAspectRatio: config && config.preserveAspectRatio || 'xMidYMid meet',
      imagePreserveAspectRatio: config && config.imagePreserveAspectRatio || 'xMidYMid slice',
      contentVisibility: config && config.contentVisibility || 'visible',
      className: config && config.className || '',
      id: config && config.id || ''
    };
    this.renderConfig.dpr = config && config.dpr || 1;

    if (this.animationItem.wrapper) {
      this.renderConfig.dpr = config && config.dpr || window.devicePixelRatio || 1;
    }

    this.renderedFrame = -1;
    this.globalData = {
      frameNum: -1,
      _mdf: false,
      renderConfig: this.renderConfig,
      currentGlobalAlpha: -1
    };
    this.contextData = new CVContextData();
    this.elements = [];
    this.pendingElements = [];
    this.transformMat = new Matrix();
    this.completeLayers = false;
    this.rendererType = 'canvas';
  }

  extendPrototype([BaseRenderer], CanvasRendererBase);

  CanvasRendererBase.prototype.createShape = function (data) {
    return new CVShapeElement(data, this.globalData, this);
  };

  CanvasRendererBase.prototype.createText = function (data) {
    return new CVTextElement(data, this.globalData, this);
  };

  CanvasRendererBase.prototype.createImage = function (data) {
    return new CVImageElement(data, this.globalData, this);
  };

  CanvasRendererBase.prototype.createSolid = function (data) {
    return new CVSolidElement(data, this.globalData, this);
  };

  CanvasRendererBase.prototype.createNull = SVGRenderer.prototype.createNull;

  CanvasRendererBase.prototype.ctxTransform = function (props) {
    if (props[0] === 1 && props[1] === 0 && props[4] === 0 && props[5] === 1 && props[12] === 0 && props[13] === 0) {
      return;
    }

    if (!this.renderConfig.clearCanvas) {
      this.canvasContext.transform(props[0], props[1], props[4], props[5], props[12], props[13]);
      return;
    }

    this.transformMat.cloneFromProps(props);
    var cProps = this.contextData.cTr.props;
    this.transformMat.transform(cProps[0], cProps[1], cProps[2], cProps[3], cProps[4], cProps[5], cProps[6], cProps[7], cProps[8], cProps[9], cProps[10], cProps[11], cProps[12], cProps[13], cProps[14], cProps[15]); // this.contextData.cTr.transform(props[0],props[1],props[2],props[3],props[4],props[5],props[6],props[7],props[8],props[9],props[10],props[11],props[12],props[13],props[14],props[15]);

    this.contextData.cTr.cloneFromProps(this.transformMat.props);
    var trProps = this.contextData.cTr.props;
    this.canvasContext.setTransform(trProps[0], trProps[1], trProps[4], trProps[5], trProps[12], trProps[13]);
  };

  CanvasRendererBase.prototype.ctxOpacity = function (op) {
    /* if(op === 1){
          return;
      } */
    if (!this.renderConfig.clearCanvas) {
      this.canvasContext.globalAlpha *= op < 0 ? 0 : op;
      this.globalData.currentGlobalAlpha = this.contextData.cO;
      return;
    }

    this.contextData.cO *= op < 0 ? 0 : op;

    if (this.globalData.currentGlobalAlpha !== this.contextData.cO) {
      this.canvasContext.globalAlpha = this.contextData.cO;
      this.globalData.currentGlobalAlpha = this.contextData.cO;
    }
  };

  CanvasRendererBase.prototype.reset = function () {
    if (!this.renderConfig.clearCanvas) {
      this.canvasContext.restore();
      return;
    }

    this.contextData.reset();
  };

  CanvasRendererBase.prototype.save = function (actionFlag) {
    if (!this.renderConfig.clearCanvas) {
      this.canvasContext.save();
      return;
    }

    if (actionFlag) {
      this.canvasContext.save();
    }

    var props = this.contextData.cTr.props;

    if (this.contextData._length <= this.contextData.cArrPos) {
      this.contextData.duplicate();
    }

    var i;
    var arr = this.contextData.saved[this.contextData.cArrPos];

    for (i = 0; i < 16; i += 1) {
      arr[i] = props[i];
    }

    this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO;
    this.contextData.cArrPos += 1;
  };

  CanvasRendererBase.prototype.restore = function (actionFlag) {
    if (!this.renderConfig.clearCanvas) {
      this.canvasContext.restore();
      return;
    }

    if (actionFlag) {
      this.canvasContext.restore();
      this.globalData.blendMode = 'source-over';
    }

    this.contextData.cArrPos -= 1;
    var popped = this.contextData.saved[this.contextData.cArrPos];
    var i;
    var arr = this.contextData.cTr.props;

    for (i = 0; i < 16; i += 1) {
      arr[i] = popped[i];
    }

    this.canvasContext.setTransform(popped[0], popped[1], popped[4], popped[5], popped[12], popped[13]);
    popped = this.contextData.savedOp[this.contextData.cArrPos];
    this.contextData.cO = popped;

    if (this.globalData.currentGlobalAlpha !== popped) {
      this.canvasContext.globalAlpha = popped;
      this.globalData.currentGlobalAlpha = popped;
    }
  };

  CanvasRendererBase.prototype.configAnimation = function (animData) {
    if (this.animationItem.wrapper) {
      this.animationItem.container = createTag('canvas');
      var containerStyle = this.animationItem.container.style;
      containerStyle.width = '100%';
      containerStyle.height = '100%';
      var origin = '0px 0px 0px';
      containerStyle.transformOrigin = origin;
      containerStyle.mozTransformOrigin = origin;
      containerStyle.webkitTransformOrigin = origin;
      containerStyle['-webkit-transform'] = origin;
      containerStyle.contentVisibility = this.renderConfig.contentVisibility;
      this.animationItem.wrapper.appendChild(this.animationItem.container);
      this.canvasContext = this.animationItem.container.getContext('2d');

      if (this.renderConfig.className) {
        this.animationItem.container.setAttribute('class', this.renderConfig.className);
      }

      if (this.renderConfig.id) {
        this.animationItem.container.setAttribute('id', this.renderConfig.id);
      }
    } else {
      this.canvasContext = this.renderConfig.context;
    }

    this.data = animData;
    this.layers = animData.layers;
    this.transformCanvas = {
      w: animData.w,
      h: animData.h,
      sx: 0,
      sy: 0,
      tx: 0,
      ty: 0
    };
    this.setupGlobalData(animData, document.body);
    this.globalData.canvasContext = this.canvasContext;
    this.globalData.renderer = this;
    this.globalData.isDashed = false;
    this.globalData.progressiveLoad = this.renderConfig.progressiveLoad;
    this.globalData.transformCanvas = this.transformCanvas;
    this.elements = createSizedArray(animData.layers.length);
    this.updateContainerSize();
  };

  CanvasRendererBase.prototype.updateContainerSize = function () {
    this.reset();
    var elementWidth;
    var elementHeight;

    if (this.animationItem.wrapper && this.animationItem.container) {
      elementWidth = this.animationItem.wrapper.offsetWidth;
      elementHeight = this.animationItem.wrapper.offsetHeight;
      this.animationItem.container.setAttribute('width', elementWidth * this.renderConfig.dpr);
      this.animationItem.container.setAttribute('height', elementHeight * this.renderConfig.dpr);
    } else {
      elementWidth = this.canvasContext.canvas.width * this.renderConfig.dpr;
      elementHeight = this.canvasContext.canvas.height * this.renderConfig.dpr;
    }

    var elementRel;
    var animationRel;

    if (this.renderConfig.preserveAspectRatio.indexOf('meet') !== -1 || this.renderConfig.preserveAspectRatio.indexOf('slice') !== -1) {
      var par = this.renderConfig.preserveAspectRatio.split(' ');
      var fillType = par[1] || 'meet';
      var pos = par[0] || 'xMidYMid';
      var xPos = pos.substr(0, 4);
      var yPos = pos.substr(4);
      elementRel = elementWidth / elementHeight;
      animationRel = this.transformCanvas.w / this.transformCanvas.h;

      if (animationRel > elementRel && fillType === 'meet' || animationRel < elementRel && fillType === 'slice') {
        this.transformCanvas.sx = elementWidth / (this.transformCanvas.w / this.renderConfig.dpr);
        this.transformCanvas.sy = elementWidth / (this.transformCanvas.w / this.renderConfig.dpr);
      } else {
        this.transformCanvas.sx = elementHeight / (this.transformCanvas.h / this.renderConfig.dpr);
        this.transformCanvas.sy = elementHeight / (this.transformCanvas.h / this.renderConfig.dpr);
      }

      if (xPos === 'xMid' && (animationRel < elementRel && fillType === 'meet' || animationRel > elementRel && fillType === 'slice')) {
        this.transformCanvas.tx = (elementWidth - this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) / 2 * this.renderConfig.dpr;
      } else if (xPos === 'xMax' && (animationRel < elementRel && fillType === 'meet' || animationRel > elementRel && fillType === 'slice')) {
        this.transformCanvas.tx = (elementWidth - this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) * this.renderConfig.dpr;
      } else {
        this.transformCanvas.tx = 0;
      }

      if (yPos === 'YMid' && (animationRel > elementRel && fillType === 'meet' || animationRel < elementRel && fillType === 'slice')) {
        this.transformCanvas.ty = (elementHeight - this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) / 2 * this.renderConfig.dpr;
      } else if (yPos === 'YMax' && (animationRel > elementRel && fillType === 'meet' || animationRel < elementRel && fillType === 'slice')) {
        this.transformCanvas.ty = (elementHeight - this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) * this.renderConfig.dpr;
      } else {
        this.transformCanvas.ty = 0;
      }
    } else if (this.renderConfig.preserveAspectRatio === 'none') {
      this.transformCanvas.sx = elementWidth / (this.transformCanvas.w / this.renderConfig.dpr);
      this.transformCanvas.sy = elementHeight / (this.transformCanvas.h / this.renderConfig.dpr);
      this.transformCanvas.tx = 0;
      this.transformCanvas.ty = 0;
    } else {
      this.transformCanvas.sx = this.renderConfig.dpr;
      this.transformCanvas.sy = this.renderConfig.dpr;
      this.transformCanvas.tx = 0;
      this.transformCanvas.ty = 0;
    }

    this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, 0, 0, this.transformCanvas.sy, 0, 0, 0, 0, 1, 0, this.transformCanvas.tx, this.transformCanvas.ty, 0, 1];
    /* var i, len = this.elements.length;
      for(i=0;i<len;i+=1){
          if(this.elements[i] && this.elements[i].data.ty === 0){
              this.elements[i].resize(this.globalData.transformCanvas);
          }
      } */

    this.ctxTransform(this.transformCanvas.props);
    this.canvasContext.beginPath();
    this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h);
    this.canvasContext.closePath();
    this.canvasContext.clip();
    this.renderFrame(this.renderedFrame, true);
  };

  CanvasRendererBase.prototype.destroy = function () {
    if (this.renderConfig.clearCanvas && this.animationItem.wrapper) {
      this.animationItem.wrapper.innerText = '';
    }

    var i;
    var len = this.layers ? this.layers.length : 0;

    for (i = len - 1; i >= 0; i -= 1) {
      if (this.elements[i]) {
        this.elements[i].destroy();
      }
    }

    this.elements.length = 0;
    this.globalData.canvasContext = null;
    this.animationItem.container = null;
    this.destroyed = true;
  };

  CanvasRendererBase.prototype.renderFrame = function (num, forceRender) {
    if (this.renderedFrame === num && this.renderConfig.clearCanvas === true && !forceRender || this.destroyed || num === -1) {
      return;
    }

    this.renderedFrame = num;
    this.globalData.frameNum = num - this.animationItem._isFirstFrame;
    this.globalData.frameId += 1;
    this.globalData._mdf = !this.renderConfig.clearCanvas || forceRender;
    this.globalData.projectInterface.currentFrame = num; // console.log('--------');
    // console.log('NEW: ',num);

    var i;
    var len = this.layers.length;

    if (!this.completeLayers) {
      this.checkLayers(num);
    }

    for (i = 0; i < len; i += 1) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].prepareFrame(num - this.layers[i].st);
      }
    }

    if (this.globalData._mdf) {
      if (this.renderConfig.clearCanvas === true) {
        this.canvasContext.clearRect(0, 0, this.transformCanvas.w, this.transformCanvas.h);
      } else {
        this.save();
      }

      for (i = len - 1; i >= 0; i -= 1) {
        if (this.completeLayers || this.elements[i]) {
          this.elements[i].renderFrame();
        }
      }

      if (this.renderConfig.clearCanvas !== true) {
        this.restore();
      }
    }
  };

  CanvasRendererBase.prototype.buildItem = function (pos) {
    var elements = this.elements;

    if (elements[pos] || this.layers[pos].ty === 99) {
      return;
    }

    var element = this.createItem(this.layers[pos], this, this.globalData);
    elements[pos] = element;
    element.initExpressions();
    /* if(this.layers[pos].ty === 0){
          element.resize(this.globalData.transformCanvas);
      } */
  };

  CanvasRendererBase.prototype.checkPendingElements = function () {
    while (this.pendingElements.length) {
      var element = this.pendingElements.pop();
      element.checkParenting();
    }
  };

  CanvasRendererBase.prototype.hide = function () {
    this.animationItem.container.style.display = 'none';
  };

  CanvasRendererBase.prototype.show = function () {
    this.animationItem.container.style.display = 'block';
  };

  function CVCompElement(data, globalData, comp) {
    this.completeLayers = false;
    this.layers = data.layers;
    this.pendingElements = [];
    this.elements = createSizedArray(this.layers.length);
    this.initElement(data, globalData, comp);
    this.tm = data.tm ? PropertyFactory.getProp(this, data.tm, 0, globalData.frameRate, this) : {
      _placeholder: true
    };
  }

  extendPrototype([CanvasRendererBase, ICompElement, CVBaseElement], CVCompElement);

  CVCompElement.prototype.renderInnerContent = function () {
    var ctx = this.canvasContext;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.data.w, 0);
    ctx.lineTo(this.data.w, this.data.h);
    ctx.lineTo(0, this.data.h);
    ctx.lineTo(0, 0);
    ctx.clip();
    var i;
    var len = this.layers.length;

    for (i = len - 1; i >= 0; i -= 1) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].renderFrame();
      }
    }
  };

  CVCompElement.prototype.destroy = function () {
    var i;
    var len = this.layers.length;

    for (i = len - 1; i >= 0; i -= 1) {
      if (this.elements[i]) {
        this.elements[i].destroy();
      }
    }

    this.layers = null;
    this.elements = null;
  };

  CVCompElement.prototype.createComp = function (data) {
    return new CVCompElement(data, this.globalData, this);
  };

  function CanvasRenderer(animationItem, config) {
    this.animationItem = animationItem;
    this.renderConfig = {
      clearCanvas: config && config.clearCanvas !== undefined ? config.clearCanvas : true,
      context: config && config.context || null,
      progressiveLoad: config && config.progressiveLoad || false,
      preserveAspectRatio: config && config.preserveAspectRatio || 'xMidYMid meet',
      imagePreserveAspectRatio: config && config.imagePreserveAspectRatio || 'xMidYMid slice',
      contentVisibility: config && config.contentVisibility || 'visible',
      className: config && config.className || '',
      id: config && config.id || ''
    };
    this.renderConfig.dpr = config && config.dpr || 1;

    if (this.animationItem.wrapper) {
      this.renderConfig.dpr = config && config.dpr || window.devicePixelRatio || 1;
    }

    this.renderedFrame = -1;
    this.globalData = {
      frameNum: -1,
      _mdf: false,
      renderConfig: this.renderConfig,
      currentGlobalAlpha: -1
    };
    this.contextData = new CVContextData();
    this.elements = [];
    this.pendingElements = [];
    this.transformMat = new Matrix();
    this.completeLayers = false;
    this.rendererType = 'canvas';
  }

  extendPrototype([CanvasRendererBase], CanvasRenderer);

  CanvasRenderer.prototype.createComp = function (data) {
    return new CVCompElement(data, this.globalData, this);
  };

  function HBaseElement() {}

  HBaseElement.prototype = {
    checkBlendMode: function checkBlendMode() {},
    initRendererElement: function initRendererElement() {
      this.baseElement = createTag(this.data.tg || 'div');

      if (this.data.hasMask) {
        this.svgElement = createNS('svg');
        this.layerElement = createNS('g');
        this.maskedElement = this.layerElement;
        this.svgElement.appendChild(this.layerElement);
        this.baseElement.appendChild(this.svgElement);
      } else {
        this.layerElement = this.baseElement;
      }

      styleDiv(this.baseElement);
    },
    createContainerElements: function createContainerElements() {
      this.renderableEffectsManager = new CVEffects(this);
      this.transformedElement = this.baseElement;
      this.maskedElement = this.layerElement;

      if (this.data.ln) {
        this.layerElement.setAttribute('id', this.data.ln);
      }

      if (this.data.cl) {
        this.layerElement.setAttribute('class', this.data.cl);
      }

      if (this.data.bm !== 0) {
        this.setBlendMode();
      }
    },
    renderElement: function renderElement() {
      var transformedElementStyle = this.transformedElement ? this.transformedElement.style : {};

      if (this.finalTransform._matMdf) {
        var matrixValue = this.finalTransform.mat.toCSS();
        transformedElementStyle.transform = matrixValue;
        transformedElementStyle.webkitTransform = matrixValue;
      }

      if (this.finalTransform._opMdf) {
        transformedElementStyle.opacity = this.finalTransform.mProp.o.v;
      }
    },
    renderFrame: function renderFrame() {
      // If it is exported as hidden (data.hd === true) no need to render
      // If it is not visible no need to render
      if (this.data.hd || this.hidden) {
        return;
      }

      this.renderTransform();
      this.renderRenderable();
      this.renderElement();
      this.renderInnerContent();

      if (this._isFirstFrame) {
        this._isFirstFrame = false;
      }
    },
    destroy: function destroy() {
      this.layerElement = null;
      this.transformedElement = null;

      if (this.matteElement) {
        this.matteElement = null;
      }

      if (this.maskManager) {
        this.maskManager.destroy();
        this.maskManager = null;
      }
    },
    createRenderableComponents: function createRenderableComponents() {
      this.maskManager = new MaskElement(this.data, this, this.globalData);
    },
    addEffects: function addEffects() {},
    setMatte: function setMatte() {}
  };
  HBaseElement.prototype.getBaseElement = SVGBaseElement.prototype.getBaseElement;
  HBaseElement.prototype.destroyBaseElement = HBaseElement.prototype.destroy;
  HBaseElement.prototype.buildElementParenting = BaseRenderer.prototype.buildElementParenting;

  function HSolidElement(data, globalData, comp) {
    this.initElement(data, globalData, comp);
  }

  extendPrototype([BaseElement, TransformElement, HBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], HSolidElement);

  HSolidElement.prototype.createContent = function () {
    var rect;

    if (this.data.hasMask) {
      rect = createNS('rect');
      rect.setAttribute('width', this.data.sw);
      rect.setAttribute('height', this.data.sh);
      rect.setAttribute('fill', this.data.sc);
      this.svgElement.setAttribute('width', this.data.sw);
      this.svgElement.setAttribute('height', this.data.sh);
    } else {
      rect = createTag('div');
      rect.style.width = this.data.sw + 'px';
      rect.style.height = this.data.sh + 'px';
      rect.style.backgroundColor = this.data.sc;
    }

    this.layerElement.appendChild(rect);
  };

  function HShapeElement(data, globalData, comp) {
    // List of drawable elements
    this.shapes = []; // Full shape data

    this.shapesData = data.shapes; // List of styles that will be applied to shapes

    this.stylesList = []; // List of modifiers that will be applied to shapes

    this.shapeModifiers = []; // List of items in shape tree

    this.itemsData = []; // List of items in previous shape tree

    this.processedElements = []; // List of animated components

    this.animatedContents = [];
    this.shapesContainer = createNS('g');
    this.initElement(data, globalData, comp); // Moving any property that doesn't get too much access after initialization because of v8 way of handling more than 10 properties.
    // List of elements that have been created

    this.prevViewData = [];
    this.currentBBox = {
      x: 999999,
      y: -999999,
      h: 0,
      w: 0
    };
  }

  extendPrototype([BaseElement, TransformElement, HSolidElement, SVGShapeElement, HBaseElement, HierarchyElement, FrameElement, RenderableElement], HShapeElement);
  HShapeElement.prototype._renderShapeFrame = HShapeElement.prototype.renderInnerContent;

  HShapeElement.prototype.createContent = function () {
    var cont;
    this.baseElement.style.fontSize = 0;

    if (this.data.hasMask) {
      this.layerElement.appendChild(this.shapesContainer);
      cont = this.svgElement;
    } else {
      cont = createNS('svg');
      var size = this.comp.data ? this.comp.data : this.globalData.compSize;
      cont.setAttribute('width', size.w);
      cont.setAttribute('height', size.h);
      cont.appendChild(this.shapesContainer);
      this.layerElement.appendChild(cont);
    }

    this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.shapesContainer, 0, [], true);
    this.filterUniqueShapes();
    this.shapeCont = cont;
  };

  HShapeElement.prototype.getTransformedPoint = function (transformers, point) {
    var i;
    var len = transformers.length;

    for (i = 0; i < len; i += 1) {
      point = transformers[i].mProps.v.applyToPointArray(point[0], point[1], 0);
    }

    return point;
  };

  HShapeElement.prototype.calculateShapeBoundingBox = function (item, boundingBox) {
    var shape = item.sh.v;
    var transformers = item.transformers;
    var i;
    var len = shape._length;
    var vPoint;
    var oPoint;
    var nextIPoint;
    var nextVPoint;

    if (len <= 1) {
      return;
    }

    for (i = 0; i < len - 1; i += 1) {
      vPoint = this.getTransformedPoint(transformers, shape.v[i]);
      oPoint = this.getTransformedPoint(transformers, shape.o[i]);
      nextIPoint = this.getTransformedPoint(transformers, shape.i[i + 1]);
      nextVPoint = this.getTransformedPoint(transformers, shape.v[i + 1]);
      this.checkBounds(vPoint, oPoint, nextIPoint, nextVPoint, boundingBox);
    }

    if (shape.c) {
      vPoint = this.getTransformedPoint(transformers, shape.v[i]);
      oPoint = this.getTransformedPoint(transformers, shape.o[i]);
      nextIPoint = this.getTransformedPoint(transformers, shape.i[0]);
      nextVPoint = this.getTransformedPoint(transformers, shape.v[0]);
      this.checkBounds(vPoint, oPoint, nextIPoint, nextVPoint, boundingBox);
    }
  };

  HShapeElement.prototype.checkBounds = function (vPoint, oPoint, nextIPoint, nextVPoint, boundingBox) {
    this.getBoundsOfCurve(vPoint, oPoint, nextIPoint, nextVPoint);
    var bounds = this.shapeBoundingBox;
    boundingBox.x = bmMin(bounds.left, boundingBox.x);
    boundingBox.xMax = bmMax(bounds.right, boundingBox.xMax);
    boundingBox.y = bmMin(bounds.top, boundingBox.y);
    boundingBox.yMax = bmMax(bounds.bottom, boundingBox.yMax);
  };

  HShapeElement.prototype.shapeBoundingBox = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };
  HShapeElement.prototype.tempBoundingBox = {
    x: 0,
    xMax: 0,
    y: 0,
    yMax: 0,
    width: 0,
    height: 0
  };

  HShapeElement.prototype.getBoundsOfCurve = function (p0, p1, p2, p3) {
    var bounds = [[p0[0], p3[0]], [p0[1], p3[1]]];

    for (var a, b, c, t, b2ac, t1, t2, i = 0; i < 2; ++i) {
      // eslint-disable-line no-plusplus
      b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
      a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
      c = 3 * p1[i] - 3 * p0[i];
      b |= 0; // eslint-disable-line no-bitwise

      a |= 0; // eslint-disable-line no-bitwise

      c |= 0; // eslint-disable-line no-bitwise

      if (a === 0 && b === 0) {//
      } else if (a === 0) {
        t = -c / b;

        if (t > 0 && t < 1) {
          bounds[i].push(this.calculateF(t, p0, p1, p2, p3, i));
        }
      } else {
        b2ac = b * b - 4 * c * a;

        if (b2ac >= 0) {
          t1 = (-b + bmSqrt(b2ac)) / (2 * a);
          if (t1 > 0 && t1 < 1) bounds[i].push(this.calculateF(t1, p0, p1, p2, p3, i));
          t2 = (-b - bmSqrt(b2ac)) / (2 * a);
          if (t2 > 0 && t2 < 1) bounds[i].push(this.calculateF(t2, p0, p1, p2, p3, i));
        }
      }
    }

    this.shapeBoundingBox.left = bmMin.apply(null, bounds[0]);
    this.shapeBoundingBox.top = bmMin.apply(null, bounds[1]);
    this.shapeBoundingBox.right = bmMax.apply(null, bounds[0]);
    this.shapeBoundingBox.bottom = bmMax.apply(null, bounds[1]);
  };

  HShapeElement.prototype.calculateF = function (t, p0, p1, p2, p3, i) {
    return bmPow(1 - t, 3) * p0[i] + 3 * bmPow(1 - t, 2) * t * p1[i] + 3 * (1 - t) * bmPow(t, 2) * p2[i] + bmPow(t, 3) * p3[i];
  };

  HShapeElement.prototype.calculateBoundingBox = function (itemsData, boundingBox) {
    var i;
    var len = itemsData.length;

    for (i = 0; i < len; i += 1) {
      if (itemsData[i] && itemsData[i].sh) {
        this.calculateShapeBoundingBox(itemsData[i], boundingBox);
      } else if (itemsData[i] && itemsData[i].it) {
        this.calculateBoundingBox(itemsData[i].it, boundingBox);
      }
    }
  };

  HShapeElement.prototype.currentBoxContains = function (box) {
    return this.currentBBox.x <= box.x && this.currentBBox.y <= box.y && this.currentBBox.width + this.currentBBox.x >= box.x + box.width && this.currentBBox.height + this.currentBBox.y >= box.y + box.height;
  };

  HShapeElement.prototype.renderInnerContent = function () {
    this._renderShapeFrame();

    if (!this.hidden && (this._isFirstFrame || this._mdf)) {
      var tempBoundingBox = this.tempBoundingBox;
      var max = 999999;
      tempBoundingBox.x = max;
      tempBoundingBox.xMax = -max;
      tempBoundingBox.y = max;
      tempBoundingBox.yMax = -max;
      this.calculateBoundingBox(this.itemsData, tempBoundingBox);
      tempBoundingBox.width = tempBoundingBox.xMax < tempBoundingBox.x ? 0 : tempBoundingBox.xMax - tempBoundingBox.x;
      tempBoundingBox.height = tempBoundingBox.yMax < tempBoundingBox.y ? 0 : tempBoundingBox.yMax - tempBoundingBox.y; // var tempBoundingBox = this.shapeCont.getBBox();

      if (this.currentBoxContains(tempBoundingBox)) {
        return;
      }

      var changed = false;

      if (this.currentBBox.w !== tempBoundingBox.width) {
        this.currentBBox.w = tempBoundingBox.width;
        this.shapeCont.setAttribute('width', tempBoundingBox.width);
        changed = true;
      }

      if (this.currentBBox.h !== tempBoundingBox.height) {
        this.currentBBox.h = tempBoundingBox.height;
        this.shapeCont.setAttribute('height', tempBoundingBox.height);
        changed = true;
      }

      if (changed || this.currentBBox.x !== tempBoundingBox.x || this.currentBBox.y !== tempBoundingBox.y) {
        this.currentBBox.w = tempBoundingBox.width;
        this.currentBBox.h = tempBoundingBox.height;
        this.currentBBox.x = tempBoundingBox.x;
        this.currentBBox.y = tempBoundingBox.y;
        this.shapeCont.setAttribute('viewBox', this.currentBBox.x + ' ' + this.currentBBox.y + ' ' + this.currentBBox.w + ' ' + this.currentBBox.h);
        var shapeStyle = this.shapeCont.style;
        var shapeTransform = 'translate(' + this.currentBBox.x + 'px,' + this.currentBBox.y + 'px)';
        shapeStyle.transform = shapeTransform;
        shapeStyle.webkitTransform = shapeTransform;
      }
    }
  };

  function HTextElement(data, globalData, comp) {
    this.textSpans = [];
    this.textPaths = [];
    this.currentBBox = {
      x: 999999,
      y: -999999,
      h: 0,
      w: 0
    };
    this.renderType = 'svg';
    this.isMasked = false;
    this.initElement(data, globalData, comp);
  }

  extendPrototype([BaseElement, TransformElement, HBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, ITextElement], HTextElement);

  HTextElement.prototype.createContent = function () {
    this.isMasked = this.checkMasks();

    if (this.isMasked) {
      this.renderType = 'svg';
      this.compW = this.comp.data.w;
      this.compH = this.comp.data.h;
      this.svgElement.setAttribute('width', this.compW);
      this.svgElement.setAttribute('height', this.compH);
      var g = createNS('g');
      this.maskedElement.appendChild(g);
      this.innerElem = g;
    } else {
      this.renderType = 'html';
      this.innerElem = this.layerElement;
    }

    this.checkParenting();
  };

  HTextElement.prototype.buildNewText = function () {
    var documentData = this.textProperty.currentData;
    this.renderedLetters = createSizedArray(documentData.l ? documentData.l.length : 0);
    var innerElemStyle = this.innerElem.style;
    var textColor = documentData.fc ? this.buildColor(documentData.fc) : 'rgba(0,0,0,0)';
    innerElemStyle.fill = textColor;
    innerElemStyle.color = textColor;

    if (documentData.sc) {
      innerElemStyle.stroke = this.buildColor(documentData.sc);
      innerElemStyle.strokeWidth = documentData.sw + 'px';
    }

    var fontData = this.globalData.fontManager.getFontByName(documentData.f);

    if (!this.globalData.fontManager.chars) {
      innerElemStyle.fontSize = documentData.finalSize + 'px';
      innerElemStyle.lineHeight = documentData.finalSize + 'px';

      if (fontData.fClass) {
        this.innerElem.className = fontData.fClass;
      } else {
        innerElemStyle.fontFamily = fontData.fFamily;
        var fWeight = documentData.fWeight;
        var fStyle = documentData.fStyle;
        innerElemStyle.fontStyle = fStyle;
        innerElemStyle.fontWeight = fWeight;
      }
    }

    var i;
    var len;
    var letters = documentData.l;
    len = letters.length;
    var tSpan;
    var tParent;
    var tCont;
    var matrixHelper = this.mHelper;
    var shapes;
    var shapeStr = '';
    var cnt = 0;

    for (i = 0; i < len; i += 1) {
      if (this.globalData.fontManager.chars) {
        if (!this.textPaths[cnt]) {
          tSpan = createNS('path');
          tSpan.setAttribute('stroke-linecap', lineCapEnum[1]);
          tSpan.setAttribute('stroke-linejoin', lineJoinEnum[2]);
          tSpan.setAttribute('stroke-miterlimit', '4');
        } else {
          tSpan = this.textPaths[cnt];
        }

        if (!this.isMasked) {
          if (this.textSpans[cnt]) {
            tParent = this.textSpans[cnt];
            tCont = tParent.children[0];
          } else {
            tParent = createTag('div');
            tParent.style.lineHeight = 0;
            tCont = createNS('svg');
            tCont.appendChild(tSpan);
            styleDiv(tParent);
          }
        }
      } else if (!this.isMasked) {
        if (this.textSpans[cnt]) {
          tParent = this.textSpans[cnt];
          tSpan = this.textPaths[cnt];
        } else {
          tParent = createTag('span');
          styleDiv(tParent);
          tSpan = createTag('span');
          styleDiv(tSpan);
          tParent.appendChild(tSpan);
        }
      } else {
        tSpan = this.textPaths[cnt] ? this.textPaths[cnt] : createNS('text');
      } // tSpan.setAttribute('visibility', 'hidden');


      if (this.globalData.fontManager.chars) {
        var charData = this.globalData.fontManager.getCharData(documentData.finalText[i], fontData.fStyle, this.globalData.fontManager.getFontByName(documentData.f).fFamily);
        var shapeData;

        if (charData) {
          shapeData = charData.data;
        } else {
          shapeData = null;
        }

        matrixHelper.reset();

        if (shapeData && shapeData.shapes && shapeData.shapes.length) {
          shapes = shapeData.shapes[0].it;
          matrixHelper.scale(documentData.finalSize / 100, documentData.finalSize / 100);
          shapeStr = this.createPathShape(matrixHelper, shapes);
          tSpan.setAttribute('d', shapeStr);
        }

        if (!this.isMasked) {
          this.innerElem.appendChild(tParent);

          if (shapeData && shapeData.shapes) {
            // document.body.appendChild is needed to get exact measure of shape
            document.body.appendChild(tCont);
            var boundingBox = tCont.getBBox();
            tCont.setAttribute('width', boundingBox.width + 2);
            tCont.setAttribute('height', boundingBox.height + 2);
            tCont.setAttribute('viewBox', boundingBox.x - 1 + ' ' + (boundingBox.y - 1) + ' ' + (boundingBox.width + 2) + ' ' + (boundingBox.height + 2));
            var tContStyle = tCont.style;
            var tContTranslation = 'translate(' + (boundingBox.x - 1) + 'px,' + (boundingBox.y - 1) + 'px)';
            tContStyle.transform = tContTranslation;
            tContStyle.webkitTransform = tContTranslation;
            letters[i].yOffset = boundingBox.y - 1;
          } else {
            tCont.setAttribute('width', 1);
            tCont.setAttribute('height', 1);
          }

          tParent.appendChild(tCont);
        } else {
          this.innerElem.appendChild(tSpan);
        }
      } else {
        tSpan.textContent = letters[i].val;
        tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');

        if (!this.isMasked) {
          this.innerElem.appendChild(tParent); //

          var tStyle = tSpan.style;
          var tSpanTranslation = 'translate3d(0,' + -documentData.finalSize / 1.2 + 'px,0)';
          tStyle.transform = tSpanTranslation;
          tStyle.webkitTransform = tSpanTranslation;
        } else {
          this.innerElem.appendChild(tSpan);
        }
      } //


      if (!this.isMasked) {
        this.textSpans[cnt] = tParent;
      } else {
        this.textSpans[cnt] = tSpan;
      }

      this.textSpans[cnt].style.display = 'block';
      this.textPaths[cnt] = tSpan;
      cnt += 1;
    }

    while (cnt < this.textSpans.length) {
      this.textSpans[cnt].style.display = 'none';
      cnt += 1;
    }
  };

  HTextElement.prototype.renderInnerContent = function () {
    var svgStyle;

    if (this.data.singleShape) {
      if (!this._isFirstFrame && !this.lettersChangedFlag) {
        return;
      }

      if (this.isMasked && this.finalTransform._matMdf) {
        // Todo Benchmark if using this is better than getBBox
        this.svgElement.setAttribute('viewBox', -this.finalTransform.mProp.p.v[0] + ' ' + -this.finalTransform.mProp.p.v[1] + ' ' + this.compW + ' ' + this.compH);
        svgStyle = this.svgElement.style;
        var translation = 'translate(' + -this.finalTransform.mProp.p.v[0] + 'px,' + -this.finalTransform.mProp.p.v[1] + 'px)';
        svgStyle.transform = translation;
        svgStyle.webkitTransform = translation;
      }
    }

    this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);

    if (!this.lettersChangedFlag && !this.textAnimator.lettersChangedFlag) {
      return;
    }

    var i;
    var len;
    var count = 0;
    var renderedLetters = this.textAnimator.renderedLetters;
    var letters = this.textProperty.currentData.l;
    len = letters.length;
    var renderedLetter;
    var textSpan;
    var textPath;

    for (i = 0; i < len; i += 1) {
      if (letters[i].n) {
        count += 1;
      } else {
        textSpan = this.textSpans[i];
        textPath = this.textPaths[i];
        renderedLetter = renderedLetters[count];
        count += 1;

        if (renderedLetter._mdf.m) {
          if (!this.isMasked) {
            textSpan.style.webkitTransform = renderedLetter.m;
            textSpan.style.transform = renderedLetter.m;
          } else {
            textSpan.setAttribute('transform', renderedLetter.m);
          }
        } /// /textSpan.setAttribute('opacity',renderedLetter.o);


        textSpan.style.opacity = renderedLetter.o;

        if (renderedLetter.sw && renderedLetter._mdf.sw) {
          textPath.setAttribute('stroke-width', renderedLetter.sw);
        }

        if (renderedLetter.sc && renderedLetter._mdf.sc) {
          textPath.setAttribute('stroke', renderedLetter.sc);
        }

        if (renderedLetter.fc && renderedLetter._mdf.fc) {
          textPath.setAttribute('fill', renderedLetter.fc);
          textPath.style.color = renderedLetter.fc;
        }
      }
    }

    if (this.innerElem.getBBox && !this.hidden && (this._isFirstFrame || this._mdf)) {
      var boundingBox = this.innerElem.getBBox();

      if (this.currentBBox.w !== boundingBox.width) {
        this.currentBBox.w = boundingBox.width;
        this.svgElement.setAttribute('width', boundingBox.width);
      }

      if (this.currentBBox.h !== boundingBox.height) {
        this.currentBBox.h = boundingBox.height;
        this.svgElement.setAttribute('height', boundingBox.height);
      }

      var margin = 1;

      if (this.currentBBox.w !== boundingBox.width + margin * 2 || this.currentBBox.h !== boundingBox.height + margin * 2 || this.currentBBox.x !== boundingBox.x - margin || this.currentBBox.y !== boundingBox.y - margin) {
        this.currentBBox.w = boundingBox.width + margin * 2;
        this.currentBBox.h = boundingBox.height + margin * 2;
        this.currentBBox.x = boundingBox.x - margin;
        this.currentBBox.y = boundingBox.y - margin;
        this.svgElement.setAttribute('viewBox', this.currentBBox.x + ' ' + this.currentBBox.y + ' ' + this.currentBBox.w + ' ' + this.currentBBox.h);
        svgStyle = this.svgElement.style;
        var svgTransform = 'translate(' + this.currentBBox.x + 'px,' + this.currentBBox.y + 'px)';
        svgStyle.transform = svgTransform;
        svgStyle.webkitTransform = svgTransform;
      }
    }
  };

  function HCameraElement(data, globalData, comp) {
    this.initFrame();
    this.initBaseData(data, globalData, comp);
    this.initHierarchy();
    var getProp = PropertyFactory.getProp;
    this.pe = getProp(this, data.pe, 0, 0, this);

    if (data.ks.p.s) {
      this.px = getProp(this, data.ks.p.x, 1, 0, this);
      this.py = getProp(this, data.ks.p.y, 1, 0, this);
      this.pz = getProp(this, data.ks.p.z, 1, 0, this);
    } else {
      this.p = getProp(this, data.ks.p, 1, 0, this);
    }

    if (data.ks.a) {
      this.a = getProp(this, data.ks.a, 1, 0, this);
    }

    if (data.ks.or.k.length && data.ks.or.k[0].to) {
      var i;
      var len = data.ks.or.k.length;

      for (i = 0; i < len; i += 1) {
        data.ks.or.k[i].to = null;
        data.ks.or.k[i].ti = null;
      }
    }

    this.or = getProp(this, data.ks.or, 1, degToRads, this);
    this.or.sh = true;
    this.rx = getProp(this, data.ks.rx, 0, degToRads, this);
    this.ry = getProp(this, data.ks.ry, 0, degToRads, this);
    this.rz = getProp(this, data.ks.rz, 0, degToRads, this);
    this.mat = new Matrix();
    this._prevMat = new Matrix();
    this._isFirstFrame = true; // TODO: find a better way to make the HCamera element to be compatible with the LayerInterface and TransformInterface.

    this.finalTransform = {
      mProp: this
    };
  }

  extendPrototype([BaseElement, FrameElement, HierarchyElement], HCameraElement);

  HCameraElement.prototype.setup = function () {
    var i;
    var len = this.comp.threeDElements.length;
    var comp;
    var perspectiveStyle;
    var containerStyle;

    for (i = 0; i < len; i += 1) {
      // [perspectiveElem,container]
      comp = this.comp.threeDElements[i];

      if (comp.type === '3d') {
        perspectiveStyle = comp.perspectiveElem.style;
        containerStyle = comp.container.style;
        var perspective = this.pe.v + 'px';
        var origin = '0px 0px 0px';
        var matrix = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
        perspectiveStyle.perspective = perspective;
        perspectiveStyle.webkitPerspective = perspective;
        containerStyle.transformOrigin = origin;
        containerStyle.mozTransformOrigin = origin;
        containerStyle.webkitTransformOrigin = origin;
        perspectiveStyle.transform = matrix;
        perspectiveStyle.webkitTransform = matrix;
      }
    }
  };

  HCameraElement.prototype.createElements = function () {};

  HCameraElement.prototype.hide = function () {};

  HCameraElement.prototype.renderFrame = function () {
    var _mdf = this._isFirstFrame;
    var i;
    var len;

    if (this.hierarchy) {
      len = this.hierarchy.length;

      for (i = 0; i < len; i += 1) {
        _mdf = this.hierarchy[i].finalTransform.mProp._mdf || _mdf;
      }
    }

    if (_mdf || this.pe._mdf || this.p && this.p._mdf || this.px && (this.px._mdf || this.py._mdf || this.pz._mdf) || this.rx._mdf || this.ry._mdf || this.rz._mdf || this.or._mdf || this.a && this.a._mdf) {
      this.mat.reset();

      if (this.hierarchy) {
        len = this.hierarchy.length - 1;

        for (i = len; i >= 0; i -= 1) {
          var mTransf = this.hierarchy[i].finalTransform.mProp;
          this.mat.translate(-mTransf.p.v[0], -mTransf.p.v[1], mTransf.p.v[2]);
          this.mat.rotateX(-mTransf.or.v[0]).rotateY(-mTransf.or.v[1]).rotateZ(mTransf.or.v[2]);
          this.mat.rotateX(-mTransf.rx.v).rotateY(-mTransf.ry.v).rotateZ(mTransf.rz.v);
          this.mat.scale(1 / mTransf.s.v[0], 1 / mTransf.s.v[1], 1 / mTransf.s.v[2]);
          this.mat.translate(mTransf.a.v[0], mTransf.a.v[1], mTransf.a.v[2]);
        }
      }

      if (this.p) {
        this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2]);
      } else {
        this.mat.translate(-this.px.v, -this.py.v, this.pz.v);
      }

      if (this.a) {
        var diffVector;

        if (this.p) {
          diffVector = [this.p.v[0] - this.a.v[0], this.p.v[1] - this.a.v[1], this.p.v[2] - this.a.v[2]];
        } else {
          diffVector = [this.px.v - this.a.v[0], this.py.v - this.a.v[1], this.pz.v - this.a.v[2]];
        }

        var mag = Math.sqrt(Math.pow(diffVector[0], 2) + Math.pow(diffVector[1], 2) + Math.pow(diffVector[2], 2)); // var lookDir = getNormalizedPoint(getDiffVector(this.a.v,this.p.v));

        var lookDir = [diffVector[0] / mag, diffVector[1] / mag, diffVector[2] / mag];
        var lookLengthOnXZ = Math.sqrt(lookDir[2] * lookDir[2] + lookDir[0] * lookDir[0]);
        var mRotationX = Math.atan2(lookDir[1], lookLengthOnXZ);
        var mRotationY = Math.atan2(lookDir[0], -lookDir[2]);
        this.mat.rotateY(mRotationY).rotateX(-mRotationX);
      }

      this.mat.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v);
      this.mat.rotateX(-this.or.v[0]).rotateY(-this.or.v[1]).rotateZ(this.or.v[2]);
      this.mat.translate(this.globalData.compSize.w / 2, this.globalData.compSize.h / 2, 0);
      this.mat.translate(0, 0, this.pe.v);
      var hasMatrixChanged = !this._prevMat.equals(this.mat);

      if ((hasMatrixChanged || this.pe._mdf) && this.comp.threeDElements) {
        len = this.comp.threeDElements.length;
        var comp;
        var perspectiveStyle;
        var containerStyle;

        for (i = 0; i < len; i += 1) {
          comp = this.comp.threeDElements[i];

          if (comp.type === '3d') {
            if (hasMatrixChanged) {
              var matValue = this.mat.toCSS();
              containerStyle = comp.container.style;
              containerStyle.transform = matValue;
              containerStyle.webkitTransform = matValue;
            }

            if (this.pe._mdf) {
              perspectiveStyle = comp.perspectiveElem.style;
              perspectiveStyle.perspective = this.pe.v + 'px';
              perspectiveStyle.webkitPerspective = this.pe.v + 'px';
            }
          }
        }

        this.mat.clone(this._prevMat);
      }
    }

    this._isFirstFrame = false;
  };

  HCameraElement.prototype.prepareFrame = function (num) {
    this.prepareProperties(num, true);
  };

  HCameraElement.prototype.destroy = function () {};

  HCameraElement.prototype.getBaseElement = function () {
    return null;
  };

  function HImageElement(data, globalData, comp) {
    this.assetData = globalData.getAssetData(data.refId);
    this.initElement(data, globalData, comp);
  }

  extendPrototype([BaseElement, TransformElement, HBaseElement, HSolidElement, HierarchyElement, FrameElement, RenderableElement], HImageElement);

  HImageElement.prototype.createContent = function () {
    var assetPath = this.globalData.getAssetsPath(this.assetData);
    var img = new Image();

    if (this.data.hasMask) {
      this.imageElem = createNS('image');
      this.imageElem.setAttribute('width', this.assetData.w + 'px');
      this.imageElem.setAttribute('height', this.assetData.h + 'px');
      this.imageElem.setAttributeNS('http://www.w3.org/1999/xlink', 'href', assetPath);
      this.layerElement.appendChild(this.imageElem);
      this.baseElement.setAttribute('width', this.assetData.w);
      this.baseElement.setAttribute('height', this.assetData.h);
    } else {
      this.layerElement.appendChild(img);
    }

    img.crossOrigin = 'anonymous';
    img.src = assetPath;

    if (this.data.ln) {
      this.baseElement.setAttribute('id', this.data.ln);
    }
  };

  function HybridRendererBase(animationItem, config) {
    this.animationItem = animationItem;
    this.layers = null;
    this.renderedFrame = -1;
    this.renderConfig = {
      className: config && config.className || '',
      imagePreserveAspectRatio: config && config.imagePreserveAspectRatio || 'xMidYMid slice',
      hideOnTransparent: !(config && config.hideOnTransparent === false),
      filterSize: {
        width: config && config.filterSize && config.filterSize.width || '400%',
        height: config && config.filterSize && config.filterSize.height || '400%',
        x: config && config.filterSize && config.filterSize.x || '-100%',
        y: config && config.filterSize && config.filterSize.y || '-100%'
      }
    };
    this.globalData = {
      _mdf: false,
      frameNum: -1,
      renderConfig: this.renderConfig
    };
    this.pendingElements = [];
    this.elements = [];
    this.threeDElements = [];
    this.destroyed = false;
    this.camera = null;
    this.supports3d = true;
    this.rendererType = 'html';
  }

  extendPrototype([BaseRenderer], HybridRendererBase);
  HybridRendererBase.prototype.buildItem = SVGRenderer.prototype.buildItem;

  HybridRendererBase.prototype.checkPendingElements = function () {
    while (this.pendingElements.length) {
      var element = this.pendingElements.pop();
      element.checkParenting();
    }
  };

  HybridRendererBase.prototype.appendElementInPos = function (element, pos) {
    var newDOMElement = element.getBaseElement();

    if (!newDOMElement) {
      return;
    }

    var layer = this.layers[pos];

    if (!layer.ddd || !this.supports3d) {
      if (this.threeDElements) {
        this.addTo3dContainer(newDOMElement, pos);
      } else {
        var i = 0;
        var nextDOMElement;
        var nextLayer;
        var tmpDOMElement;

        while (i < pos) {
          if (this.elements[i] && this.elements[i] !== true && this.elements[i].getBaseElement) {
            nextLayer = this.elements[i];
            tmpDOMElement = this.layers[i].ddd ? this.getThreeDContainerByPos(i) : nextLayer.getBaseElement();
            nextDOMElement = tmpDOMElement || nextDOMElement;
          }

          i += 1;
        }

        if (nextDOMElement) {
          if (!layer.ddd || !this.supports3d) {
            this.layerElement.insertBefore(newDOMElement, nextDOMElement);
          }
        } else if (!layer.ddd || !this.supports3d) {
          this.layerElement.appendChild(newDOMElement);
        }
      }
    } else {
      this.addTo3dContainer(newDOMElement, pos);
    }
  };

  HybridRendererBase.prototype.createShape = function (data) {
    if (!this.supports3d) {
      return new SVGShapeElement(data, this.globalData, this);
    }

    return new HShapeElement(data, this.globalData, this);
  };

  HybridRendererBase.prototype.createText = function (data) {
    if (!this.supports3d) {
      return new SVGTextLottieElement(data, this.globalData, this);
    }

    return new HTextElement(data, this.globalData, this);
  };

  HybridRendererBase.prototype.createCamera = function (data) {
    this.camera = new HCameraElement(data, this.globalData, this);
    return this.camera;
  };

  HybridRendererBase.prototype.createImage = function (data) {
    if (!this.supports3d) {
      return new IImageElement(data, this.globalData, this);
    }

    return new HImageElement(data, this.globalData, this);
  };

  HybridRendererBase.prototype.createSolid = function (data) {
    if (!this.supports3d) {
      return new ISolidElement(data, this.globalData, this);
    }

    return new HSolidElement(data, this.globalData, this);
  };

  HybridRendererBase.prototype.createNull = SVGRenderer.prototype.createNull;

  HybridRendererBase.prototype.getThreeDContainerByPos = function (pos) {
    var i = 0;
    var len = this.threeDElements.length;

    while (i < len) {
      if (this.threeDElements[i].startPos <= pos && this.threeDElements[i].endPos >= pos) {
        return this.threeDElements[i].perspectiveElem;
      }

      i += 1;
    }

    return null;
  };

  HybridRendererBase.prototype.createThreeDContainer = function (pos, type) {
    var perspectiveElem = createTag('div');
    var style;
    var containerStyle;
    styleDiv(perspectiveElem);
    var container = createTag('div');
    styleDiv(container);

    if (type === '3d') {
      style = perspectiveElem.style;
      style.width = this.globalData.compSize.w + 'px';
      style.height = this.globalData.compSize.h + 'px';
      var center = '50% 50%';
      style.webkitTransformOrigin = center;
      style.mozTransformOrigin = center;
      style.transformOrigin = center;
      containerStyle = container.style;
      var matrix = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
      containerStyle.transform = matrix;
      containerStyle.webkitTransform = matrix;
    }

    perspectiveElem.appendChild(container); // this.resizerElem.appendChild(perspectiveElem);

    var threeDContainerData = {
      container: container,
      perspectiveElem: perspectiveElem,
      startPos: pos,
      endPos: pos,
      type: type
    };
    this.threeDElements.push(threeDContainerData);
    return threeDContainerData;
  };

  HybridRendererBase.prototype.build3dContainers = function () {
    var i;
    var len = this.layers.length;
    var lastThreeDContainerData;
    var currentContainer = '';

    for (i = 0; i < len; i += 1) {
      if (this.layers[i].ddd && this.layers[i].ty !== 3) {
        if (currentContainer !== '3d') {
          currentContainer = '3d';
          lastThreeDContainerData = this.createThreeDContainer(i, '3d');
        }

        lastThreeDContainerData.endPos = Math.max(lastThreeDContainerData.endPos, i);
      } else {
        if (currentContainer !== '2d') {
          currentContainer = '2d';
          lastThreeDContainerData = this.createThreeDContainer(i, '2d');
        }

        lastThreeDContainerData.endPos = Math.max(lastThreeDContainerData.endPos, i);
      }
    }

    len = this.threeDElements.length;

    for (i = len - 1; i >= 0; i -= 1) {
      this.resizerElem.appendChild(this.threeDElements[i].perspectiveElem);
    }
  };

  HybridRendererBase.prototype.addTo3dContainer = function (elem, pos) {
    var i = 0;
    var len = this.threeDElements.length;

    while (i < len) {
      if (pos <= this.threeDElements[i].endPos) {
        var j = this.threeDElements[i].startPos;
        var nextElement;

        while (j < pos) {
          if (this.elements[j] && this.elements[j].getBaseElement) {
            nextElement = this.elements[j].getBaseElement();
          }

          j += 1;
        }

        if (nextElement) {
          this.threeDElements[i].container.insertBefore(elem, nextElement);
        } else {
          this.threeDElements[i].container.appendChild(elem);
        }

        break;
      }

      i += 1;
    }
  };

  HybridRendererBase.prototype.configAnimation = function (animData) {
    var resizerElem = createTag('div');
    var wrapper = this.animationItem.wrapper;
    var style = resizerElem.style;
    style.width = animData.w + 'px';
    style.height = animData.h + 'px';
    this.resizerElem = resizerElem;
    styleDiv(resizerElem);
    style.transformStyle = 'flat';
    style.mozTransformStyle = 'flat';
    style.webkitTransformStyle = 'flat';

    if (this.renderConfig.className) {
      resizerElem.setAttribute('class', this.renderConfig.className);
    }

    wrapper.appendChild(resizerElem);
    style.overflow = 'hidden';
    var svg = createNS('svg');
    svg.setAttribute('width', '1');
    svg.setAttribute('height', '1');
    styleDiv(svg);
    this.resizerElem.appendChild(svg);
    var defs = createNS('defs');
    svg.appendChild(defs);
    this.data = animData; // Mask animation

    this.setupGlobalData(animData, svg);
    this.globalData.defs = defs;
    this.layers = animData.layers;
    this.layerElement = this.resizerElem;
    this.build3dContainers();
    this.updateContainerSize();
  };

  HybridRendererBase.prototype.destroy = function () {
    if (this.animationItem.wrapper) {
      this.animationItem.wrapper.innerText = '';
    }

    this.animationItem.container = null;
    this.globalData.defs = null;
    var i;
    var len = this.layers ? this.layers.length : 0;

    for (i = 0; i < len; i += 1) {
      this.elements[i].destroy();
    }

    this.elements.length = 0;
    this.destroyed = true;
    this.animationItem = null;
  };

  HybridRendererBase.prototype.updateContainerSize = function () {
    var elementWidth = this.animationItem.wrapper.offsetWidth;
    var elementHeight = this.animationItem.wrapper.offsetHeight;
    var elementRel = elementWidth / elementHeight;
    var animationRel = this.globalData.compSize.w / this.globalData.compSize.h;
    var sx;
    var sy;
    var tx;
    var ty;

    if (animationRel > elementRel) {
      sx = elementWidth / this.globalData.compSize.w;
      sy = elementWidth / this.globalData.compSize.w;
      tx = 0;
      ty = (elementHeight - this.globalData.compSize.h * (elementWidth / this.globalData.compSize.w)) / 2;
    } else {
      sx = elementHeight / this.globalData.compSize.h;
      sy = elementHeight / this.globalData.compSize.h;
      tx = (elementWidth - this.globalData.compSize.w * (elementHeight / this.globalData.compSize.h)) / 2;
      ty = 0;
    }

    var style = this.resizerElem.style;
    style.webkitTransform = 'matrix3d(' + sx + ',0,0,0,0,' + sy + ',0,0,0,0,1,0,' + tx + ',' + ty + ',0,1)';
    style.transform = style.webkitTransform;
  };

  HybridRendererBase.prototype.renderFrame = SVGRenderer.prototype.renderFrame;

  HybridRendererBase.prototype.hide = function () {
    this.resizerElem.style.display = 'none';
  };

  HybridRendererBase.prototype.show = function () {
    this.resizerElem.style.display = 'block';
  };

  HybridRendererBase.prototype.initItems = function () {
    this.buildAllItems();

    if (this.camera) {
      this.camera.setup();
    } else {
      var cWidth = this.globalData.compSize.w;
      var cHeight = this.globalData.compSize.h;
      var i;
      var len = this.threeDElements.length;

      for (i = 0; i < len; i += 1) {
        var style = this.threeDElements[i].perspectiveElem.style;
        style.webkitPerspective = Math.sqrt(Math.pow(cWidth, 2) + Math.pow(cHeight, 2)) + 'px';
        style.perspective = style.webkitPerspective;
      }
    }
  };

  HybridRendererBase.prototype.searchExtraCompositions = function (assets) {
    var i;
    var len = assets.length;
    var floatingContainer = createTag('div');

    for (i = 0; i < len; i += 1) {
      if (assets[i].xt) {
        var comp = this.createComp(assets[i], floatingContainer, this.globalData.comp, null);
        comp.initExpressions();
        this.globalData.projectInterface.registerComposition(comp);
      }
    }
  };

  function HCompElement(data, globalData, comp) {
    this.layers = data.layers;
    this.supports3d = !data.hasMask;
    this.completeLayers = false;
    this.pendingElements = [];
    this.elements = this.layers ? createSizedArray(this.layers.length) : [];
    this.initElement(data, globalData, comp);
    this.tm = data.tm ? PropertyFactory.getProp(this, data.tm, 0, globalData.frameRate, this) : {
      _placeholder: true
    };
  }

  extendPrototype([HybridRendererBase, ICompElement, HBaseElement], HCompElement);
  HCompElement.prototype._createBaseContainerElements = HCompElement.prototype.createContainerElements;

  HCompElement.prototype.createContainerElements = function () {
    this._createBaseContainerElements(); // divElement.style.clip = 'rect(0px, '+this.data.w+'px, '+this.data.h+'px, 0px)';


    if (this.data.hasMask) {
      this.svgElement.setAttribute('width', this.data.w);
      this.svgElement.setAttribute('height', this.data.h);
      this.transformedElement = this.baseElement;
    } else {
      this.transformedElement = this.layerElement;
    }
  };

  HCompElement.prototype.addTo3dContainer = function (elem, pos) {
    var j = 0;
    var nextElement;

    while (j < pos) {
      if (this.elements[j] && this.elements[j].getBaseElement) {
        nextElement = this.elements[j].getBaseElement();
      }

      j += 1;
    }

    if (nextElement) {
      this.layerElement.insertBefore(elem, nextElement);
    } else {
      this.layerElement.appendChild(elem);
    }
  };

  HCompElement.prototype.createComp = function (data) {
    if (!this.supports3d) {
      return new SVGCompElement(data, this.globalData, this);
    }

    return new HCompElement(data, this.globalData, this);
  };

  function HybridRenderer(animationItem, config) {
    this.animationItem = animationItem;
    this.layers = null;
    this.renderedFrame = -1;
    this.renderConfig = {
      className: config && config.className || '',
      imagePreserveAspectRatio: config && config.imagePreserveAspectRatio || 'xMidYMid slice',
      hideOnTransparent: !(config && config.hideOnTransparent === false),
      filterSize: {
        width: config && config.filterSize && config.filterSize.width || '400%',
        height: config && config.filterSize && config.filterSize.height || '400%',
        x: config && config.filterSize && config.filterSize.x || '-100%',
        y: config && config.filterSize && config.filterSize.y || '-100%'
      }
    };
    this.globalData = {
      _mdf: false,
      frameNum: -1,
      renderConfig: this.renderConfig
    };
    this.pendingElements = [];
    this.elements = [];
    this.threeDElements = [];
    this.destroyed = false;
    this.camera = null;
    this.supports3d = true;
    this.rendererType = 'html';
  }

  extendPrototype([HybridRendererBase], HybridRenderer);

  HybridRenderer.prototype.createComp = function (data) {
    if (!this.supports3d) {
      return new SVGCompElement(data, this.globalData, this);
    }

    return new HCompElement(data, this.globalData, this);
  };

  var Expressions = function () {
    var ob = {};
    ob.initExpressions = initExpressions;

    function initExpressions(animation) {
      var stackCount = 0;
      var registers = [];

      function pushExpression() {
        stackCount += 1;
      }

      function popExpression() {
        stackCount -= 1;

        if (stackCount === 0) {
          releaseInstances();
        }
      }

      function registerExpressionProperty(expression) {
        if (registers.indexOf(expression) === -1) {
          registers.push(expression);
        }
      }

      function releaseInstances() {
        var i;
        var len = registers.length;

        for (i = 0; i < len; i += 1) {
          registers[i].release();
        }

        registers.length = 0;
      }

      animation.renderer.compInterface = CompExpressionInterface(animation.renderer);
      animation.renderer.globalData.projectInterface.registerComposition(animation.renderer);
      animation.renderer.globalData.pushExpression = pushExpression;
      animation.renderer.globalData.popExpression = popExpression;
      animation.renderer.globalData.registerExpressionProperty = registerExpressionProperty;
    }

    return ob;
  }();

  function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

  /* eslint-disable */

  /*
   Copyright 2014 David Bau.

   Permission is hereby granted, free of charge, to any person obtaining
   a copy of this software and associated documentation files (the
   "Software"), to deal in the Software without restriction, including
   without limitation the rights to use, copy, modify, merge, publish,
   distribute, sublicense, and/or sell copies of the Software, and to
   permit persons to whom the Software is furnished to do so, subject to
   the following conditions:

   The above copyright notice and this permission notice shall be
   included in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
   IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
   CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
   TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

   */
  function seedRandom(pool, math) {
    //
    // The following constants are related to IEEE 754 limits.
    //
    var global = this,
        width = 256,
        // each RC4 output is 0 <= x < 256
    chunks = 6,
        // at least six RC4 outputs for each double
    digits = 52,
        // there are 52 significant digits in a double
    rngname = 'random',
        // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
        significance = math.pow(2, digits),
        overflow = significance * 2,
        mask = width - 1,
        nodecrypto; // node.js crypto module, initialized at the bottom.
    //
    // seedrandom()
    // This is the seedrandom function described above.
    //

    function seedrandom(seed, options, callback) {
      var key = [];
      options = options === true ? {
        entropy: true
      } : options || {}; // Flatten the seed string or build one from local entropy if needed.

      var shortseed = mixkey(flatten(options.entropy ? [seed, tostring(pool)] : seed === null ? autoseed() : seed, 3), key); // Use the seed to initialize an ARC4 generator.

      var arc4 = new ARC4(key); // This function returns a random double in [0, 1) that contains
      // randomness in every bit of the mantissa of the IEEE 754 value.

      var prng = function prng() {
        var n = arc4.g(chunks),
            // Start with a numerator n < 2 ^ 48
        d = startdenom,
            //   and denominator d = 2 ^ 48.
        x = 0; //   and no 'extra last byte'.

        while (n < significance) {
          // Fill up all significant digits by
          n = (n + x) * width; //   shifting numerator and

          d *= width; //   denominator and generating a

          x = arc4.g(1); //   new least-significant-byte.
        }

        while (n >= overflow) {
          // To avoid rounding up, before adding
          n /= 2; //   last byte, shift everything

          d /= 2; //   right using integer math until

          x >>>= 1; //   we have exactly the desired bits.
        }

        return (n + x) / d; // Form the number within [0, 1).
      };

      prng.int32 = function () {
        return arc4.g(4) | 0;
      };

      prng.quick = function () {
        return arc4.g(4) / 0x100000000;
      };

      prng["double"] = prng; // Mix the randomness into accumulated entropy.

      mixkey(tostring(arc4.S), pool); // Calling convention: what to return as a function of prng, seed, is_math.

      return (options.pass || callback || function (prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) {
            copy(state, arc4);
          } // Only provide the .state method if requested via options.state.


          prng.state = function () {
            return copy(arc4, {});
          };
        } // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.


        if (is_math_call) {
          math[rngname] = prng;
          return seed;
        } // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(prng, shortseed, 'global' in options ? options.global : this == math, options.state);
    }

    math['seed' + rngname] = seedrandom; //
    // ARC4
    //
    // An ARC4 implementation.  The constructor takes a key in the form of
    // an array of at most (width) integers that should be 0 <= x < (width).
    //
    // The g(count) method returns a pseudorandom integer that concatenates
    // the next (count) outputs from ARC4.  Its return value is a number x
    // that is in the range 0 <= x < (width ^ count).
    //

    function ARC4(key) {
      var t,
          keylen = key.length,
          me = this,
          i = 0,
          j = me.i = me.j = 0,
          s = me.S = []; // The empty key [] is treated as [0].

      if (!keylen) {
        key = [keylen++];
      } // Set up S using the standard key scheduling algorithm.


      while (i < width) {
        s[i] = i++;
      }

      for (i = 0; i < width; i++) {
        s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])];
        s[j] = t;
      } // The "g" method returns the next (count) outputs as one number.


      me.g = function (count) {
        // Using instance members instead of closure state nearly doubles speed.
        var t,
            r = 0,
            i = me.i,
            j = me.j,
            s = me.S;

        while (count--) {
          t = s[i = mask & i + 1];
          r = r * width + s[mask & (s[i] = s[j = mask & j + t]) + (s[j] = t)];
        }

        me.i = i;
        me.j = j;
        return r; // For robust unpredictability, the function call below automatically
        // discards an initial batch of values.  This is called RC4-drop[256].
        // See http://google.com/search?q=rsa+fluhrer+response&btnI
      };
    } //
    // copy()
    // Copies internal state of ARC4 to or from a plain object.
    //


    function copy(f, t) {
      t.i = f.i;
      t.j = f.j;
      t.S = f.S.slice();
      return t;
    } //
    // flatten()
    // Converts an object tree to nested arrays of strings.
    //


    function flatten(obj, depth) {
      var result = [],
          typ = _typeof$1(obj),
          prop;

      if (depth && typ == 'object') {
        for (prop in obj) {
          try {
            result.push(flatten(obj[prop], depth - 1));
          } catch (e) {}
        }
      }

      return result.length ? result : typ == 'string' ? obj : obj + '\0';
    } //
    // mixkey()
    // Mixes a string seed into a key that is an array of integers, and
    // returns a shortened string seed that is equivalent to the result key.
    //


    function mixkey(seed, key) {
      var stringseed = seed + '',
          smear,
          j = 0;

      while (j < stringseed.length) {
        key[mask & j] = mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++);
      }

      return tostring(key);
    } //
    // autoseed()
    // Returns an object for autoseeding, using window.crypto and Node crypto
    // module if available.
    //


    function autoseed() {
      try {
        if (nodecrypto) {
          return tostring(nodecrypto.randomBytes(width));
        }

        var out = new Uint8Array(width);
        (global.crypto || global.msCrypto).getRandomValues(out);
        return tostring(out);
      } catch (e) {
        var browser = global.navigator,
            plugins = browser && browser.plugins;
        return [+new Date(), global, plugins, global.screen, tostring(pool)];
      }
    } //
    // tostring()
    // Converts an array of charcodes to a string
    //


    function tostring(a) {
      return String.fromCharCode.apply(0, a);
    } //
    // When seedrandom.js is loaded, we immediately mix a few bits
    // from the built-in RNG into the entropy pool.  Because we do
    // not want to interfere with deterministic PRNG state later,
    // seedrandom will not call math.random on its own again after
    // initialization.
    //


    mixkey(math.random(), pool); //
    // Nodejs and AMD support: export the implementation as a module using
    // either convention.
    //
    // End anonymous scope, and pass initial values.
  }

  ;

  function initialize$2(BMMath) {
    seedRandom([], BMMath);
  }

  var propTypes = {
    SHAPE: 'shape'
  };

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var ExpressionManager = function () {
    'use strict';

    var ob = {};
    var Math = BMMath;
    var window = null;
    var document = null;
    var XMLHttpRequest = null;
    var fetch = null;
    var frames = null;
    initialize$2(BMMath);

    function $bm_isInstanceOfArray(arr) {
      return arr.constructor === Array || arr.constructor === Float32Array;
    }

    function isNumerable(tOfV, v) {
      return tOfV === 'number' || tOfV === 'boolean' || tOfV === 'string' || v instanceof Number;
    }

    function $bm_neg(a) {
      var tOfA = _typeof(a);

      if (tOfA === 'number' || tOfA === 'boolean' || a instanceof Number) {
        return -a;
      }

      if ($bm_isInstanceOfArray(a)) {
        var i;
        var lenA = a.length;
        var retArr = [];

        for (i = 0; i < lenA; i += 1) {
          retArr[i] = -a[i];
        }

        return retArr;
      }

      if (a.propType) {
        return a.v;
      }

      return -a;
    }

    var easeInBez = BezierFactory.getBezierEasing(0.333, 0, 0.833, 0.833, 'easeIn').get;
    var easeOutBez = BezierFactory.getBezierEasing(0.167, 0.167, 0.667, 1, 'easeOut').get;
    var easeInOutBez = BezierFactory.getBezierEasing(0.33, 0, 0.667, 1, 'easeInOut').get;

    function sum(a, b) {
      var tOfA = _typeof(a);

      var tOfB = _typeof(b);

      if (tOfA === 'string' || tOfB === 'string') {
        return a + b;
      }

      if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
        return a + b;
      }

      if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
        a = a.slice(0);
        a[0] += b;
        return a;
      }

      if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
        b = b.slice(0);
        b[0] = a + b[0];
        return b;
      }

      if ($bm_isInstanceOfArray(a) && $bm_isInstanceOfArray(b)) {
        var i = 0;
        var lenA = a.length;
        var lenB = b.length;
        var retArr = [];

        while (i < lenA || i < lenB) {
          if ((typeof a[i] === 'number' || a[i] instanceof Number) && (typeof b[i] === 'number' || b[i] instanceof Number)) {
            retArr[i] = a[i] + b[i];
          } else {
            retArr[i] = b[i] === undefined ? a[i] : a[i] || b[i];
          }

          i += 1;
        }

        return retArr;
      }

      return 0;
    }

    var add = sum;

    function sub(a, b) {
      var tOfA = _typeof(a);

      var tOfB = _typeof(b);

      if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
        if (tOfA === 'string') {
          a = parseInt(a, 10);
        }

        if (tOfB === 'string') {
          b = parseInt(b, 10);
        }

        return a - b;
      }

      if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
        a = a.slice(0);
        a[0] -= b;
        return a;
      }

      if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
        b = b.slice(0);
        b[0] = a - b[0];
        return b;
      }

      if ($bm_isInstanceOfArray(a) && $bm_isInstanceOfArray(b)) {
        var i = 0;
        var lenA = a.length;
        var lenB = b.length;
        var retArr = [];

        while (i < lenA || i < lenB) {
          if ((typeof a[i] === 'number' || a[i] instanceof Number) && (typeof b[i] === 'number' || b[i] instanceof Number)) {
            retArr[i] = a[i] - b[i];
          } else {
            retArr[i] = b[i] === undefined ? a[i] : a[i] || b[i];
          }

          i += 1;
        }

        return retArr;
      }

      return 0;
    }

    function mul(a, b) {
      var tOfA = _typeof(a);

      var tOfB = _typeof(b);

      var arr;

      if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
        return a * b;
      }

      var i;
      var len;

      if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
        len = a.length;
        arr = createTypedArray('float32', len);

        for (i = 0; i < len; i += 1) {
          arr[i] = a[i] * b;
        }

        return arr;
      }

      if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
        len = b.length;
        arr = createTypedArray('float32', len);

        for (i = 0; i < len; i += 1) {
          arr[i] = a * b[i];
        }

        return arr;
      }

      return 0;
    }

    function div(a, b) {
      var tOfA = _typeof(a);

      var tOfB = _typeof(b);

      var arr;

      if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
        return a / b;
      }

      var i;
      var len;

      if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
        len = a.length;
        arr = createTypedArray('float32', len);

        for (i = 0; i < len; i += 1) {
          arr[i] = a[i] / b;
        }

        return arr;
      }

      if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
        len = b.length;
        arr = createTypedArray('float32', len);

        for (i = 0; i < len; i += 1) {
          arr[i] = a / b[i];
        }

        return arr;
      }

      return 0;
    }

    function mod(a, b) {
      if (typeof a === 'string') {
        a = parseInt(a, 10);
      }

      if (typeof b === 'string') {
        b = parseInt(b, 10);
      }

      return a % b;
    }

    var $bm_sum = sum;
    var $bm_sub = sub;
    var $bm_mul = mul;
    var $bm_div = div;
    var $bm_mod = mod;

    function clamp(num, min, max) {
      if (min > max) {
        var mm = max;
        max = min;
        min = mm;
      }

      return Math.min(Math.max(num, min), max);
    }

    function radiansToDegrees(val) {
      return val / degToRads;
    }

    var radians_to_degrees = radiansToDegrees;

    function degreesToRadians(val) {
      return val * degToRads;
    }

    var degrees_to_radians = radiansToDegrees;
    var helperLengthArray = [0, 0, 0, 0, 0, 0];

    function length(arr1, arr2) {
      if (typeof arr1 === 'number' || arr1 instanceof Number) {
        arr2 = arr2 || 0;
        return Math.abs(arr1 - arr2);
      }

      if (!arr2) {
        arr2 = helperLengthArray;
      }

      var i;
      var len = Math.min(arr1.length, arr2.length);
      var addedLength = 0;

      for (i = 0; i < len; i += 1) {
        addedLength += Math.pow(arr2[i] - arr1[i], 2);
      }

      return Math.sqrt(addedLength);
    }

    function normalize(vec) {
      return div(vec, length(vec));
    }

    function rgbToHsl(val) {
      var r = val[0];
      var g = val[1];
      var b = val[2];
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h;
      var s;
      var l = (max + min) / 2;

      if (max === min) {
        h = 0; // achromatic

        s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
            break;

          default:
            break;
        }

        h /= 6;
      }

      return [h, s, l, val[3]];
    }

    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    function hslToRgb(val) {
      var h = val[0];
      var s = val[1];
      var l = val[2];
      var r;
      var g;
      var b;

      if (s === 0) {
        r = l; // achromatic

        b = l; // achromatic

        g = l; // achromatic
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [r, g, b, val[3]];
    }

    function linear(t, tMin, tMax, value1, value2) {
      if (value1 === undefined || value2 === undefined) {
        value1 = tMin;
        value2 = tMax;
        tMin = 0;
        tMax = 1;
      }

      if (tMax < tMin) {
        var _tMin = tMax;
        tMax = tMin;
        tMin = _tMin;
      }

      if (t <= tMin) {
        return value1;
      }

      if (t >= tMax) {
        return value2;
      }

      var perc = tMax === tMin ? 0 : (t - tMin) / (tMax - tMin);

      if (!value1.length) {
        return value1 + (value2 - value1) * perc;
      }

      var i;
      var len = value1.length;
      var arr = createTypedArray('float32', len);

      for (i = 0; i < len; i += 1) {
        arr[i] = value1[i] + (value2[i] - value1[i]) * perc;
      }

      return arr;
    }

    function random(min, max) {
      if (max === undefined) {
        if (min === undefined) {
          min = 0;
          max = 1;
        } else {
          max = min;
          min = undefined;
        }
      }

      if (max.length) {
        var i;
        var len = max.length;

        if (!min) {
          min = createTypedArray('float32', len);
        }

        var arr = createTypedArray('float32', len);
        var rnd = BMMath.random();

        for (i = 0; i < len; i += 1) {
          arr[i] = min[i] + rnd * (max[i] - min[i]);
        }

        return arr;
      }

      if (min === undefined) {
        min = 0;
      }

      var rndm = BMMath.random();
      return min + rndm * (max - min);
    }

    function createPath(points, inTangents, outTangents, closed) {
      var i;
      var len = points.length;
      var path = shapePool.newElement();
      path.setPathData(!!closed, len);
      var arrPlaceholder = [0, 0];
      var inVertexPoint;
      var outVertexPoint;

      for (i = 0; i < len; i += 1) {
        inVertexPoint = inTangents && inTangents[i] ? inTangents[i] : arrPlaceholder;
        outVertexPoint = outTangents && outTangents[i] ? outTangents[i] : arrPlaceholder;
        path.setTripleAt(points[i][0], points[i][1], outVertexPoint[0] + points[i][0], outVertexPoint[1] + points[i][1], inVertexPoint[0] + points[i][0], inVertexPoint[1] + points[i][1], i, true);
      }

      return path;
    }

    function initiateExpression(elem, data, property) {
      var val = data.x;
      var needsVelocity = /velocity(?![\w\d])/.test(val);

      var _needsRandom = val.indexOf('random') !== -1;

      var elemType = elem.data.ty;
      var transform;
      var $bm_transform;
      var content;
      var effect;
      var thisProperty = property;
      thisProperty.valueAtTime = thisProperty.getValueAtTime;
      Object.defineProperty(thisProperty, 'value', {
        get: function get() {
          return thisProperty.v;
        }
      });
      elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate;
      elem.comp.displayStartTime = 0;
      var inPoint = elem.data.ip / elem.comp.globalData.frameRate;
      var outPoint = elem.data.op / elem.comp.globalData.frameRate;
      var width = elem.data.sw ? elem.data.sw : 0;
      var height = elem.data.sh ? elem.data.sh : 0;
      var name = elem.data.nm;
      var loopIn;
      var loop_in;
      var loopOut;
      var loop_out;
      var smooth;
      var toWorld;
      var fromWorld;
      var fromComp;
      var toComp;
      var fromCompToSurface;
      var position;
      var rotation;
      var anchorPoint;
      var scale;
      var thisLayer;
      var thisComp;
      var mask;
      var valueAtTime;
      var velocityAtTime;
      var scoped_bm_rt; // val = val.replace(/(\\?"|')((http)(s)?(:\/))?\/.*?(\\?"|')/g, "\"\""); // deter potential network calls

      var expression_function = eval('[function _expression_function(){' + val + ';scoped_bm_rt=$bm_rt}]')[0]; // eslint-disable-line no-eval

      var numKeys = property.kf ? data.k.length : 0;
      var active = !this.data || this.data.hd !== true;

      var wiggle = function wiggle(freq, amp) {
        var iWiggle;
        var j;
        var lenWiggle = this.pv.length ? this.pv.length : 1;
        var addedAmps = createTypedArray('float32', lenWiggle);
        freq = 5;
        var iterations = Math.floor(time * freq);
        iWiggle = 0;
        j = 0;

        while (iWiggle < iterations) {
          // var rnd = BMMath.random();
          for (j = 0; j < lenWiggle; j += 1) {
            addedAmps[j] += -amp + amp * 2 * BMMath.random(); // addedAmps[j] += -amp + amp*2*rnd;
          }

          iWiggle += 1;
        } // var rnd2 = BMMath.random();


        var periods = time * freq;
        var perc = periods - Math.floor(periods);
        var arr = createTypedArray('float32', lenWiggle);

        if (lenWiggle > 1) {
          for (j = 0; j < lenWiggle; j += 1) {
            arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp * 2 * BMMath.random()) * perc; // arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp*2*rnd)*perc;
            // arr[i] = this.pv[i] + addedAmp + amp1*perc + amp2*(1-perc);
          }

          return arr;
        }

        return this.pv + addedAmps[0] + (-amp + amp * 2 * BMMath.random()) * perc;
      }.bind(this);

      if (thisProperty.loopIn) {
        loopIn = thisProperty.loopIn.bind(thisProperty);
        loop_in = loopIn;
      }

      if (thisProperty.loopOut) {
        loopOut = thisProperty.loopOut.bind(thisProperty);
        loop_out = loopOut;
      }

      if (thisProperty.smooth) {
        smooth = thisProperty.smooth.bind(thisProperty);
      }

      function loopInDuration(type, duration) {
        return loopIn(type, duration, true);
      }

      function loopOutDuration(type, duration) {
        return loopOut(type, duration, true);
      }

      if (this.getValueAtTime) {
        valueAtTime = this.getValueAtTime.bind(this);
      }

      if (this.getVelocityAtTime) {
        velocityAtTime = this.getVelocityAtTime.bind(this);
      }

      var comp = elem.comp.globalData.projectInterface.bind(elem.comp.globalData.projectInterface);

      function lookAt(elem1, elem2) {
        var fVec = [elem2[0] - elem1[0], elem2[1] - elem1[1], elem2[2] - elem1[2]];
        var pitch = Math.atan2(fVec[0], Math.sqrt(fVec[1] * fVec[1] + fVec[2] * fVec[2])) / degToRads;
        var yaw = -Math.atan2(fVec[1], fVec[2]) / degToRads;
        return [yaw, pitch, 0];
      }

      function easeOut(t, tMin, tMax, val1, val2) {
        return applyEase(easeOutBez, t, tMin, tMax, val1, val2);
      }

      function easeIn(t, tMin, tMax, val1, val2) {
        return applyEase(easeInBez, t, tMin, tMax, val1, val2);
      }

      function ease(t, tMin, tMax, val1, val2) {
        return applyEase(easeInOutBez, t, tMin, tMax, val1, val2);
      }

      function applyEase(fn, t, tMin, tMax, val1, val2) {
        if (val1 === undefined) {
          val1 = tMin;
          val2 = tMax;
        } else {
          t = (t - tMin) / (tMax - tMin);
        }

        if (t > 1) {
          t = 1;
        } else if (t < 0) {
          t = 0;
        }

        var mult = fn(t);

        if ($bm_isInstanceOfArray(val1)) {
          var iKey;
          var lenKey = val1.length;
          var arr = createTypedArray('float32', lenKey);

          for (iKey = 0; iKey < lenKey; iKey += 1) {
            arr[iKey] = (val2[iKey] - val1[iKey]) * mult + val1[iKey];
          }

          return arr;
        }

        return (val2 - val1) * mult + val1;
      }

      function nearestKey(time) {
        var iKey;
        var lenKey = data.k.length;
        var index;
        var keyTime;

        if (!data.k.length || typeof data.k[0] === 'number') {
          index = 0;
          keyTime = 0;
        } else {
          index = -1;
          time *= elem.comp.globalData.frameRate;

          if (time < data.k[0].t) {
            index = 1;
            keyTime = data.k[0].t;
          } else {
            for (iKey = 0; iKey < lenKey - 1; iKey += 1) {
              if (time === data.k[iKey].t) {
                index = iKey + 1;
                keyTime = data.k[iKey].t;
                break;
              } else if (time > data.k[iKey].t && time < data.k[iKey + 1].t) {
                if (time - data.k[iKey].t > data.k[iKey + 1].t - time) {
                  index = iKey + 2;
                  keyTime = data.k[iKey + 1].t;
                } else {
                  index = iKey + 1;
                  keyTime = data.k[iKey].t;
                }

                break;
              }
            }

            if (index === -1) {
              index = iKey + 1;
              keyTime = data.k[iKey].t;
            }
          }
        }

        var obKey = {};
        obKey.index = index;
        obKey.time = keyTime / elem.comp.globalData.frameRate;
        return obKey;
      }

      function key(ind) {
        var obKey;
        var iKey;
        var lenKey;

        if (!data.k.length || typeof data.k[0] === 'number') {
          throw new Error('The property has no keyframe at index ' + ind);
        }

        ind -= 1;
        obKey = {
          time: data.k[ind].t / elem.comp.globalData.frameRate,
          value: []
        };
        var arr = Object.prototype.hasOwnProperty.call(data.k[ind], 's') ? data.k[ind].s : data.k[ind - 1].e;
        lenKey = arr.length;

        for (iKey = 0; iKey < lenKey; iKey += 1) {
          obKey[iKey] = arr[iKey];
          obKey.value[iKey] = arr[iKey];
        }

        return obKey;
      }

      function framesToTime(fr, fps) {
        if (!fps) {
          fps = elem.comp.globalData.frameRate;
        }

        return fr / fps;
      }

      function timeToFrames(t, fps) {
        if (!t && t !== 0) {
          t = time;
        }

        if (!fps) {
          fps = elem.comp.globalData.frameRate;
        }

        return t * fps;
      }

      function seedRandom(seed) {
        BMMath.seedrandom(randSeed + seed);
      }

      function sourceRectAtTime() {
        return elem.sourceRectAtTime();
      }

      function substring(init, end) {
        if (typeof value === 'string') {
          if (end === undefined) {
            return value.substring(init);
          }

          return value.substring(init, end);
        }

        return '';
      }

      function substr(init, end) {
        if (typeof value === 'string') {
          if (end === undefined) {
            return value.substr(init);
          }

          return value.substr(init, end);
        }

        return '';
      }

      function posterizeTime(framesPerSecond) {
        time = framesPerSecond === 0 ? 0 : Math.floor(time * framesPerSecond) / framesPerSecond;
        value = valueAtTime(time);
      }

      var time;
      var velocity;
      var value;
      var text;
      var textIndex;
      var textTotal;
      var selectorValue;
      var index = elem.data.ind;
      var hasParent = !!(elem.hierarchy && elem.hierarchy.length);
      var parent;
      var randSeed = Math.floor(Math.random() * 1000000);
      var globalData = elem.globalData;

      function executeExpression(_value) {
        // globalData.pushExpression();
        value = _value;

        if (this.frameExpressionId === elem.globalData.frameId && this.propType !== 'textSelector') {
          return value;
        }

        if (this.propType === 'textSelector') {
          textIndex = this.textIndex;
          textTotal = this.textTotal;
          selectorValue = this.selectorValue;
        }

        if (!thisLayer) {
          text = elem.layerInterface.text;
          thisLayer = elem.layerInterface;
          thisComp = elem.comp.compInterface;
          toWorld = thisLayer.toWorld.bind(thisLayer);
          fromWorld = thisLayer.fromWorld.bind(thisLayer);
          fromComp = thisLayer.fromComp.bind(thisLayer);
          toComp = thisLayer.toComp.bind(thisLayer);
          mask = thisLayer.mask ? thisLayer.mask.bind(thisLayer) : null;
          fromCompToSurface = fromComp;
        }

        if (!transform) {
          transform = elem.layerInterface('ADBE Transform Group');
          $bm_transform = transform;

          if (transform) {
            anchorPoint = transform.anchorPoint;
            /* position = transform.position;
                      rotation = transform.rotation;
                      scale = transform.scale; */
          }
        }

        if (elemType === 4 && !content) {
          content = thisLayer('ADBE Root Vectors Group');
        }

        if (!effect) {
          effect = thisLayer(4);
        }

        hasParent = !!(elem.hierarchy && elem.hierarchy.length);

        if (hasParent && !parent) {
          parent = elem.hierarchy[0].layerInterface;
        }

        time = this.comp.renderedFrame / this.comp.globalData.frameRate;

        if (_needsRandom) {
          seedRandom(randSeed + time);
        }

        if (needsVelocity) {
          velocity = velocityAtTime(time);
        }

        expression_function();
        this.frameExpressionId = elem.globalData.frameId; // TODO: Check if it's possible to return on ShapeInterface the .v value
        // Changed this to a ternary operation because Rollup failed compiling it correctly

        scoped_bm_rt = scoped_bm_rt.propType === propTypes.SHAPE ? scoped_bm_rt.v : scoped_bm_rt;
        return scoped_bm_rt;
      } // Bundlers will see these as dead code and unless we reference them


      executeExpression.__preventDeadCodeRemoval = [$bm_transform, anchorPoint, velocity, inPoint, outPoint, width, height, name, loop_in, loop_out, smooth, toComp, fromCompToSurface, toWorld, fromWorld, mask, position, rotation, scale, thisComp, numKeys, active, wiggle, loopInDuration, loopOutDuration, comp, lookAt, easeOut, easeIn, ease, nearestKey, key, text, textIndex, textTotal, selectorValue, framesToTime, timeToFrames, sourceRectAtTime, substring, substr, posterizeTime, index, globalData];
      return executeExpression;
    }

    ob.initiateExpression = initiateExpression;
    ob.__preventDeadCodeRemoval = [window, document, XMLHttpRequest, fetch, frames, $bm_neg, add, $bm_sum, $bm_sub, $bm_mul, $bm_div, $bm_mod, clamp, radians_to_degrees, degreesToRadians, degrees_to_radians, normalize, rgbToHsl, hslToRgb, linear, random, createPath];
    return ob;
  }();

  var expressionHelpers = function () {
    function searchExpressions(elem, data, prop) {
      if (data.x) {
        prop.k = true;
        prop.x = true;
        prop.initiateExpression = ExpressionManager.initiateExpression;
        prop.effectsSequence.push(prop.initiateExpression(elem, data, prop).bind(prop));
      }
    }

    function getValueAtTime(frameNum) {
      frameNum *= this.elem.globalData.frameRate;
      frameNum -= this.offsetTime;

      if (frameNum !== this._cachingAtTime.lastFrame) {
        this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < frameNum ? this._cachingAtTime.lastIndex : 0;
        this._cachingAtTime.value = this.interpolateValue(frameNum, this._cachingAtTime);
        this._cachingAtTime.lastFrame = frameNum;
      }

      return this._cachingAtTime.value;
    }

    function getSpeedAtTime(frameNum) {
      var delta = -0.01;
      var v1 = this.getValueAtTime(frameNum);
      var v2 = this.getValueAtTime(frameNum + delta);
      var speed = 0;

      if (v1.length) {
        var i;

        for (i = 0; i < v1.length; i += 1) {
          speed += Math.pow(v2[i] - v1[i], 2);
        }

        speed = Math.sqrt(speed) * 100;
      } else {
        speed = 0;
      }

      return speed;
    }

    function getVelocityAtTime(frameNum) {
      if (this.vel !== undefined) {
        return this.vel;
      }

      var delta = -0.001; // frameNum += this.elem.data.st;

      var v1 = this.getValueAtTime(frameNum);
      var v2 = this.getValueAtTime(frameNum + delta);
      var velocity;

      if (v1.length) {
        velocity = createTypedArray('float32', v1.length);
        var i;

        for (i = 0; i < v1.length; i += 1) {
          // removing frameRate
          // if needed, don't add it here
          // velocity[i] = this.elem.globalData.frameRate*((v2[i] - v1[i])/delta);
          velocity[i] = (v2[i] - v1[i]) / delta;
        }
      } else {
        velocity = (v2 - v1) / delta;
      }

      return velocity;
    }

    function getStaticValueAtTime() {
      return this.pv;
    }

    function setGroupProperty(propertyGroup) {
      this.propertyGroup = propertyGroup;
    }

    return {
      searchExpressions: searchExpressions,
      getSpeedAtTime: getSpeedAtTime,
      getVelocityAtTime: getVelocityAtTime,
      getValueAtTime: getValueAtTime,
      getStaticValueAtTime: getStaticValueAtTime,
      setGroupProperty: setGroupProperty
    };
  }();

  function addPropertyDecorator() {
    function loopOut(type, duration, durationFlag) {
      if (!this.k || !this.keyframes) {
        return this.pv;
      }

      type = type ? type.toLowerCase() : '';
      var currentFrame = this.comp.renderedFrame;
      var keyframes = this.keyframes;
      var lastKeyFrame = keyframes[keyframes.length - 1].t;

      if (currentFrame <= lastKeyFrame) {
        return this.pv;
      }

      var cycleDuration;
      var firstKeyFrame;

      if (!durationFlag) {
        if (!duration || duration > keyframes.length - 1) {
          duration = keyframes.length - 1;
        }

        firstKeyFrame = keyframes[keyframes.length - 1 - duration].t;
        cycleDuration = lastKeyFrame - firstKeyFrame;
      } else {
        if (!duration) {
          cycleDuration = Math.max(0, lastKeyFrame - this.elem.data.ip);
        } else {
          cycleDuration = Math.abs(lastKeyFrame - this.elem.comp.globalData.frameRate * duration);
        }

        firstKeyFrame = lastKeyFrame - cycleDuration;
      }

      var i;
      var len;
      var ret;

      if (type === 'pingpong') {
        var iterations = Math.floor((currentFrame - firstKeyFrame) / cycleDuration);

        if (iterations % 2 !== 0) {
          return this.getValueAtTime((cycleDuration - (currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0); // eslint-disable-line
        }
      } else if (type === 'offset') {
        var initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
        var endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
        var current = this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0); // eslint-disable-line

        var repeats = Math.floor((currentFrame - firstKeyFrame) / cycleDuration);

        if (this.pv.length) {
          ret = new Array(initV.length);
          len = ret.length;

          for (i = 0; i < len; i += 1) {
            ret[i] = (endV[i] - initV[i]) * repeats + current[i];
          }

          return ret;
        }

        return (endV - initV) * repeats + current;
      } else if (type === 'continue') {
        var lastValue = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
        var nextLastValue = this.getValueAtTime((lastKeyFrame - 0.001) / this.comp.globalData.frameRate, 0);

        if (this.pv.length) {
          ret = new Array(lastValue.length);
          len = ret.length;

          for (i = 0; i < len; i += 1) {
            ret[i] = lastValue[i] + (lastValue[i] - nextLastValue[i]) * ((currentFrame - lastKeyFrame) / this.comp.globalData.frameRate) / 0.0005; // eslint-disable-line
          }

          return ret;
        }

        return lastValue + (lastValue - nextLastValue) * ((currentFrame - lastKeyFrame) / 0.001);
      }

      return this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0); // eslint-disable-line
    }

    function loopIn(type, duration, durationFlag) {
      if (!this.k) {
        return this.pv;
      }

      type = type ? type.toLowerCase() : '';
      var currentFrame = this.comp.renderedFrame;
      var keyframes = this.keyframes;
      var firstKeyFrame = keyframes[0].t;

      if (currentFrame >= firstKeyFrame) {
        return this.pv;
      }

      var cycleDuration;
      var lastKeyFrame;

      if (!durationFlag) {
        if (!duration || duration > keyframes.length - 1) {
          duration = keyframes.length - 1;
        }

        lastKeyFrame = keyframes[duration].t;
        cycleDuration = lastKeyFrame - firstKeyFrame;
      } else {
        if (!duration) {
          cycleDuration = Math.max(0, this.elem.data.op - firstKeyFrame);
        } else {
          cycleDuration = Math.abs(this.elem.comp.globalData.frameRate * duration);
        }

        lastKeyFrame = firstKeyFrame + cycleDuration;
      }

      var i;
      var len;
      var ret;

      if (type === 'pingpong') {
        var iterations = Math.floor((firstKeyFrame - currentFrame) / cycleDuration);

        if (iterations % 2 === 0) {
          return this.getValueAtTime(((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0); // eslint-disable-line
        }
      } else if (type === 'offset') {
        var initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
        var endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
        var current = this.getValueAtTime((cycleDuration - (firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0);
        var repeats = Math.floor((firstKeyFrame - currentFrame) / cycleDuration) + 1;

        if (this.pv.length) {
          ret = new Array(initV.length);
          len = ret.length;

          for (i = 0; i < len; i += 1) {
            ret[i] = current[i] - (endV[i] - initV[i]) * repeats;
          }

          return ret;
        }

        return current - (endV - initV) * repeats;
      } else if (type === 'continue') {
        var firstValue = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
        var nextFirstValue = this.getValueAtTime((firstKeyFrame + 0.001) / this.comp.globalData.frameRate, 0);

        if (this.pv.length) {
          ret = new Array(firstValue.length);
          len = ret.length;

          for (i = 0; i < len; i += 1) {
            ret[i] = firstValue[i] + (firstValue[i] - nextFirstValue[i]) * (firstKeyFrame - currentFrame) / 0.001;
          }

          return ret;
        }

        return firstValue + (firstValue - nextFirstValue) * (firstKeyFrame - currentFrame) / 0.001;
      }

      return this.getValueAtTime((cycleDuration - ((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame)) / this.comp.globalData.frameRate, 0); // eslint-disable-line
    }

    function smooth(width, samples) {
      if (!this.k) {
        return this.pv;
      }

      width = (width || 0.4) * 0.5;
      samples = Math.floor(samples || 5);

      if (samples <= 1) {
        return this.pv;
      }

      var currentTime = this.comp.renderedFrame / this.comp.globalData.frameRate;
      var initFrame = currentTime - width;
      var endFrame = currentTime + width;
      var sampleFrequency = samples > 1 ? (endFrame - initFrame) / (samples - 1) : 1;
      var i = 0;
      var j = 0;
      var value;

      if (this.pv.length) {
        value = createTypedArray('float32', this.pv.length);
      } else {
        value = 0;
      }

      var sampleValue;

      while (i < samples) {
        sampleValue = this.getValueAtTime(initFrame + i * sampleFrequency);

        if (this.pv.length) {
          for (j = 0; j < this.pv.length; j += 1) {
            value[j] += sampleValue[j];
          }
        } else {
          value += sampleValue;
        }

        i += 1;
      }

      if (this.pv.length) {
        for (j = 0; j < this.pv.length; j += 1) {
          value[j] /= samples;
        }
      } else {
        value /= samples;
      }

      return value;
    }

    function getTransformValueAtTime(time) {
      if (!this._transformCachingAtTime) {
        this._transformCachingAtTime = {
          v: new Matrix()
        };
      } /// /


      var matrix = this._transformCachingAtTime.v;
      matrix.cloneFromProps(this.pre.props);

      if (this.appliedTransformations < 1) {
        var anchor = this.a.getValueAtTime(time);
        matrix.translate(-anchor[0] * this.a.mult, -anchor[1] * this.a.mult, anchor[2] * this.a.mult);
      }

      if (this.appliedTransformations < 2) {
        var scale = this.s.getValueAtTime(time);
        matrix.scale(scale[0] * this.s.mult, scale[1] * this.s.mult, scale[2] * this.s.mult);
      }

      if (this.sk && this.appliedTransformations < 3) {
        var skew = this.sk.getValueAtTime(time);
        var skewAxis = this.sa.getValueAtTime(time);
        matrix.skewFromAxis(-skew * this.sk.mult, skewAxis * this.sa.mult);
      }

      if (this.r && this.appliedTransformations < 4) {
        var rotation = this.r.getValueAtTime(time);
        matrix.rotate(-rotation * this.r.mult);
      } else if (!this.r && this.appliedTransformations < 4) {
        var rotationZ = this.rz.getValueAtTime(time);
        var rotationY = this.ry.getValueAtTime(time);
        var rotationX = this.rx.getValueAtTime(time);
        var orientation = this.or.getValueAtTime(time);
        matrix.rotateZ(-rotationZ * this.rz.mult).rotateY(rotationY * this.ry.mult).rotateX(rotationX * this.rx.mult).rotateZ(-orientation[2] * this.or.mult).rotateY(orientation[1] * this.or.mult).rotateX(orientation[0] * this.or.mult);
      }

      if (this.data.p && this.data.p.s) {
        var positionX = this.px.getValueAtTime(time);
        var positionY = this.py.getValueAtTime(time);

        if (this.data.p.z) {
          var positionZ = this.pz.getValueAtTime(time);
          matrix.translate(positionX * this.px.mult, positionY * this.py.mult, -positionZ * this.pz.mult);
        } else {
          matrix.translate(positionX * this.px.mult, positionY * this.py.mult, 0);
        }
      } else {
        var position = this.p.getValueAtTime(time);
        matrix.translate(position[0] * this.p.mult, position[1] * this.p.mult, -position[2] * this.p.mult);
      }

      return matrix; /// /
    }

    function getTransformStaticValueAtTime() {
      return this.v.clone(new Matrix());
    }

    var getTransformProperty = TransformPropertyFactory.getTransformProperty;

    TransformPropertyFactory.getTransformProperty = function (elem, data, container) {
      var prop = getTransformProperty(elem, data, container);

      if (prop.dynamicProperties.length) {
        prop.getValueAtTime = getTransformValueAtTime.bind(prop);
      } else {
        prop.getValueAtTime = getTransformStaticValueAtTime.bind(prop);
      }

      prop.setGroupProperty = expressionHelpers.setGroupProperty;
      return prop;
    };

    var propertyGetProp = PropertyFactory.getProp;

    PropertyFactory.getProp = function (elem, data, type, mult, container) {
      var prop = propertyGetProp(elem, data, type, mult, container); // prop.getVelocityAtTime = getVelocityAtTime;
      // prop.loopOut = loopOut;
      // prop.loopIn = loopIn;

      if (prop.kf) {
        prop.getValueAtTime = expressionHelpers.getValueAtTime.bind(prop);
      } else {
        prop.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(prop);
      }

      prop.setGroupProperty = expressionHelpers.setGroupProperty;
      prop.loopOut = loopOut;
      prop.loopIn = loopIn;
      prop.smooth = smooth;
      prop.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(prop);
      prop.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(prop);
      prop.numKeys = data.a === 1 ? data.k.length : 0;
      prop.propertyIndex = data.ix;
      var value = 0;

      if (type !== 0) {
        value = createTypedArray('float32', data.a === 1 ? data.k[0].s.length : data.k.length);
      }

      prop._cachingAtTime = {
        lastFrame: initialDefaultFrame,
        lastIndex: 0,
        value: value
      };
      expressionHelpers.searchExpressions(elem, data, prop);

      if (prop.k) {
        container.addDynamicProperty(prop);
      }

      return prop;
    };

    function getShapeValueAtTime(frameNum) {
      // For now this caching object is created only when needed instead of creating it when the shape is initialized.
      if (!this._cachingAtTime) {
        this._cachingAtTime = {
          shapeValue: shapePool.clone(this.pv),
          lastIndex: 0,
          lastTime: initialDefaultFrame
        };
      }

      frameNum *= this.elem.globalData.frameRate;
      frameNum -= this.offsetTime;

      if (frameNum !== this._cachingAtTime.lastTime) {
        this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < frameNum ? this._caching.lastIndex : 0;
        this._cachingAtTime.lastTime = frameNum;
        this.interpolateShape(frameNum, this._cachingAtTime.shapeValue, this._cachingAtTime);
      }

      return this._cachingAtTime.shapeValue;
    }

    var ShapePropertyConstructorFunction = ShapePropertyFactory.getConstructorFunction();
    var KeyframedShapePropertyConstructorFunction = ShapePropertyFactory.getKeyframedConstructorFunction();

    function ShapeExpressions() {}

    ShapeExpressions.prototype = {
      vertices: function vertices(prop, time) {
        if (this.k) {
          this.getValue();
        }

        var shapePath = this.v;

        if (time !== undefined) {
          shapePath = this.getValueAtTime(time, 0);
        }

        var i;
        var len = shapePath._length;
        var vertices = shapePath[prop];
        var points = shapePath.v;
        var arr = createSizedArray(len);

        for (i = 0; i < len; i += 1) {
          if (prop === 'i' || prop === 'o') {
            arr[i] = [vertices[i][0] - points[i][0], vertices[i][1] - points[i][1]];
          } else {
            arr[i] = [vertices[i][0], vertices[i][1]];
          }
        }

        return arr;
      },
      points: function points(time) {
        return this.vertices('v', time);
      },
      inTangents: function inTangents(time) {
        return this.vertices('i', time);
      },
      outTangents: function outTangents(time) {
        return this.vertices('o', time);
      },
      isClosed: function isClosed() {
        return this.v.c;
      },
      pointOnPath: function pointOnPath(perc, time) {
        var shapePath = this.v;

        if (time !== undefined) {
          shapePath = this.getValueAtTime(time, 0);
        }

        if (!this._segmentsLength) {
          this._segmentsLength = bez.getSegmentsLength(shapePath);
        }

        var segmentsLength = this._segmentsLength;
        var lengths = segmentsLength.lengths;
        var lengthPos = segmentsLength.totalLength * perc;
        var i = 0;
        var len = lengths.length;
        var accumulatedLength = 0;
        var pt;

        while (i < len) {
          if (accumulatedLength + lengths[i].addedLength > lengthPos) {
            var initIndex = i;
            var endIndex = shapePath.c && i === len - 1 ? 0 : i + 1;
            var segmentPerc = (lengthPos - accumulatedLength) / lengths[i].addedLength;
            pt = bez.getPointInSegment(shapePath.v[initIndex], shapePath.v[endIndex], shapePath.o[initIndex], shapePath.i[endIndex], segmentPerc, lengths[i]);
            break;
          } else {
            accumulatedLength += lengths[i].addedLength;
          }

          i += 1;
        }

        if (!pt) {
          pt = shapePath.c ? [shapePath.v[0][0], shapePath.v[0][1]] : [shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1]];
        }

        return pt;
      },
      vectorOnPath: function vectorOnPath(perc, time, vectorType) {
        // perc doesn't use triple equality because it can be a Number object as well as a primitive.
        if (perc == 1) {
          // eslint-disable-line eqeqeq
          perc = this.v.c;
        } else if (perc == 0) {
          // eslint-disable-line eqeqeq
          perc = 0.999;
        }

        var pt1 = this.pointOnPath(perc, time);
        var pt2 = this.pointOnPath(perc + 0.001, time);
        var xLength = pt2[0] - pt1[0];
        var yLength = pt2[1] - pt1[1];
        var magnitude = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));

        if (magnitude === 0) {
          return [0, 0];
        }

        var unitVector = vectorType === 'tangent' ? [xLength / magnitude, yLength / magnitude] : [-yLength / magnitude, xLength / magnitude];
        return unitVector;
      },
      tangentOnPath: function tangentOnPath(perc, time) {
        return this.vectorOnPath(perc, time, 'tangent');
      },
      normalOnPath: function normalOnPath(perc, time) {
        return this.vectorOnPath(perc, time, 'normal');
      },
      setGroupProperty: expressionHelpers.setGroupProperty,
      getValueAtTime: expressionHelpers.getStaticValueAtTime
    };
    extendPrototype([ShapeExpressions], ShapePropertyConstructorFunction);
    extendPrototype([ShapeExpressions], KeyframedShapePropertyConstructorFunction);
    KeyframedShapePropertyConstructorFunction.prototype.getValueAtTime = getShapeValueAtTime;
    KeyframedShapePropertyConstructorFunction.prototype.initiateExpression = ExpressionManager.initiateExpression;
    var propertyGetShapeProp = ShapePropertyFactory.getShapeProp;

    ShapePropertyFactory.getShapeProp = function (elem, data, type, arr, trims) {
      var prop = propertyGetShapeProp(elem, data, type, arr, trims);
      prop.propertyIndex = data.ix;
      prop.lock = false;

      if (type === 3) {
        expressionHelpers.searchExpressions(elem, data.pt, prop);
      } else if (type === 4) {
        expressionHelpers.searchExpressions(elem, data.ks, prop);
      }

      if (prop.k) {
        elem.addDynamicProperty(prop);
      }

      return prop;
    };
  }

  function initialize$1() {
    addPropertyDecorator();
  }

  function addDecorator() {
    function searchExpressions() {
      if (this.data.d.x) {
        this.calculateExpression = ExpressionManager.initiateExpression.bind(this)(this.elem, this.data.d, this);
        this.addEffect(this.getExpressionValue.bind(this));
        return true;
      }

      return null;
    }

    TextProperty.prototype.getExpressionValue = function (currentValue, text) {
      var newValue = this.calculateExpression(text);

      if (currentValue.t !== newValue) {
        var newData = {};
        this.copyData(newData, currentValue);
        newData.t = newValue.toString();
        newData.__complete = false;
        return newData;
      }

      return currentValue;
    };

    TextProperty.prototype.searchProperty = function () {
      var isKeyframed = this.searchKeyframes();
      var hasExpressions = this.searchExpressions();
      this.kf = isKeyframed || hasExpressions;
      return this.kf;
    };

    TextProperty.prototype.searchExpressions = searchExpressions;
  }

  function initialize() {
    addDecorator();
  }

  registerRenderer('canvas', CanvasRenderer);
  registerRenderer('html', HybridRenderer);
  registerRenderer('svg', SVGRenderer); // Registering shape modifiers

  ShapeModifiers.registerModifier('tm', TrimModifier);
  ShapeModifiers.registerModifier('pb', PuckerAndBloatModifier);
  ShapeModifiers.registerModifier('rp', RepeaterModifier);
  ShapeModifiers.registerModifier('rd', RoundCornersModifier); // Registering expression plugin

  setExpressionsPlugin(Expressions);
  initialize$1();
  initialize(); // Registering svg effects

  registerEffect(20, SVGTintFilter, true);
  registerEffect(21, SVGFillFilter, true);
  registerEffect(22, SVGStrokeEffect, false);
  registerEffect(23, SVGTritoneFilter, true);
  registerEffect(24, SVGProLevelsFilter, true);
  registerEffect(25, SVGDropShadowEffect, true);
  registerEffect(28, SVGMatte3Effect, false);
  registerEffect(29, SVGGaussianBlurEffect, true);

  return lottie;

}));

},{"process":"node_modules/process/browser.js"}],"js/lib/invitation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/values"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Airtable = require("airtable");

var lottie = require("lottie-web");

var FormHandler = /*#__PURE__*/function () {
  function FormHandler() {
    var _this = this;

    (0, _classCallCheck2.default)(this, FormHandler);
    (0, _defineProperty2.default)(this, "inputState", {
      nom: "invalid",
      prenom: "invalid",
      number: "invalid",
      mail: "invalid",
      day: "invalid"
    });
    (0, _defineProperty2.default)(this, "anim", void 0);
    (0, _defineProperty2.default)(this, "clickHandler", function () {
      if (_this.checkInputState()) {
        _this.sendData();

        document.querySelectorAll("input").forEach(function (node) {
          return node.classList.add("fadeOut");
        });
        document.querySelector(".radioContainer").classList.add("fadeOut");
        document.querySelector(".button").classList.add("fadeOut");
        document.querySelector(".successGGG").style.opacity = 1;
        setTimeout(function () {
          document.querySelectorAll("input").forEach(function (node) {
            node.style.visibility = "hidden";
            node.style.pointerEvents = "none";
          });
          document.querySelector(".radioContainer").style.pointerEvents = "none";
          document.querySelector(".radioContainer").style.visibility = "hidden";
          document.querySelector(".button").style.pointerEvents = "none";
          document.querySelector(".button").style.visibility = "hidden";
        });

        _this.anim.play();

        anim.play();
        document.querySelector(".button").removeEventListener("click", _this.clickHandler);
        document.querySelector(".button").classList.add("isSubmitted");
      } else alert("Merci de vérifier que : \n - Ton nom est rempli \n - Ton prénom est bien indiqué \n - Ton mail est valide \n - Ton numéro de téléphone est valide \n - Tu nous as bien indiqué si tu venais le 23 Juillet");
    });
    document.querySelectorAll("input").forEach(function (node) {
      return _this.watch(node);
    });
    document.querySelector(".button").addEventListener("click", this.clickHandler);
    Airtable.configure({
      endpointUrl: "https://api.airtable.com",
      apiKey: "keynxJ5aRc7cWp5cv"
    });
    this.base = Airtable.base("appcfQ0ZWuwuSayr4");
    this.anim = lottie.loadAnimation({
      container: document.querySelector(".successGGG"),
      renderer: "svg",
      autoplay: false,
      loop: false,
      path: "https://assets6.lottiefiles.com/packages/lf20_0upeqcrr.json" // the path to the animation json

    });
  }

  (0, _createClass2.default)(FormHandler, [{
    key: "watch",
    value: function watch(target) {
      var _this2 = this;

      target.oninput = function (e) {
        _this2.isValid(e.target);
      };
    }
  }, {
    key: "isValid",
    value: function isValid(target) {
      var _this3 = this;

      var validate = function validate() {
        _this3.inputState[id] = "valid";
      };

      var id = target.getAttribute("id");

      switch (id) {
        case "nom":
          if (this.textMatch(target.value)) validate();else {
            this.inputState[id] = "Ton nom n'est pas valide";
          }
          break;

        case "prenom":
          if (this.textMatch(target.value)) validate();else {
            this.inputState[id] = "invalid";
          }
          break;

        case "number":
          if (this.numberMatch(target.value)) validate();else {
            this.inputState[id] = "invalid";
          }
          break;

        case "mail":
          if (this.mailMatch(target.value)) validate();else {
            this.inputState[id] = "invalid";
          }
          break;
      }

      this.inputState.day = document.querySelector(".checked") != null ? "valid" : "invalid";
      this.checkInputState();
    }
  }, {
    key: "checkInputState",
    value: function checkInputState() {
      var button = document.querySelector(".button");
      var test = (0, _values.default)(this.inputState).every(function (input) {
        return input == "valid";
      });

      if (test) {
        button.classList.remove("disabled");
        return true;
      } else {
        button.classList.add("disabled");
        return this.error;
      }
    }
  }, {
    key: "textMatch",
    value: function textMatch(string) {
      return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}$/.test(string);
    }
  }, {
    key: "numberMatch",
    value: function numberMatch(string) {
      return true;
    }
  }, {
    key: "mailMatch",
    value: function mailMatch(string) {
      return true;
    }
  }, {
    key: "sendData",
    value: function sendData() {
      var dataToSend = {
        nom: "",
        prenom: "",
        number: "",
        mail: "",
        day: ""
      };
      var day = [];
      (0, _keys.default)(this.inputState).forEach(function (key) {
        var node = document.getElementById(key);
        if (node) dataToSend[key] = node.value;
      });
      document.querySelectorAll(".radio").forEach(function (radio) {
        if (radio.classList.contains("checked")) {
          day.push(radio.dataset.value);
        }
      });
      dataToSend.day = day.join(" ");
      this.base("Coming").create([{
        fields: dataToSend
      }], function (err, records) {
        console.log(records);

        if (err) {
          console.log(err);
          return;
        }
      });
    }
  }]);
  return FormHandler;
}();

exports.default = FormHandler;
},{"@babel/runtime-corejs2/core-js/object/keys":"node_modules/@babel/runtime-corejs2/core-js/object/keys.js","@babel/runtime-corejs2/core-js/object/values":"node_modules/@babel/runtime-corejs2/core-js/object/values.js","@babel/runtime-corejs2/helpers/classCallCheck":"node_modules/@babel/runtime-corejs2/helpers/classCallCheck.js","@babel/runtime-corejs2/helpers/createClass":"node_modules/@babel/runtime-corejs2/helpers/createClass.js","@babel/runtime-corejs2/helpers/defineProperty":"node_modules/@babel/runtime-corejs2/helpers/defineProperty.js","airtable":"node_modules/airtable/lib/airtable.js","lottie-web":"node_modules/lottie-web/build/player/lottie.js"}],"js/index.js":[function(require,module,exports) {
"use strict";

var animations = _interopRequireWildcard(require("./lib/animations.js"));

var _invitation = _interopRequireDefault(require("./lib/invitation.js"));

var _lottieWeb = _interopRequireDefault(require("lottie-web"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

(function () {
  _lottieWeb.default.loadAnimation({
    container: document.querySelector(".loader"),
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "https://assets10.lottiefiles.com/packages/lf20_0yes5qep.json"
  });

  function dismissLoader() {
    document.querySelector(".loader").style.pointerEvents = "none";
    document.querySelector(".loader").style.opacity = 0;
  }

  var img = new Image();

  img.onload = function () {
    dismissLoader();
  };

  img.src = "http://www.lolo-et-lolo.com/foreground.8c2999fe.png";
  setTimeout(function () {
    dismissLoader();
  }, 2500);
  document.addEventListener("click", function () {
    return animations.section0Away().then(function () {
      return animations.section1In();
    });
  }, {
    once: true
  });
  document.querySelector("#switch").addEventListener("click", function () {
    document.querySelector(".inscription").classList.toggle("inscription--open");
    document.querySelector(".ctaContainer").style.display = "none";
    document.querySelector("#switch").remove();
  });
  document.querySelector(".programme").addEventListener("click", animations.programIn);
  document.querySelector(".programmeFirst").addEventListener("click", animations.programIn);
  var formHandler = new _invitation.default();
  document.querySelectorAll("div.radio").forEach(function (radio) {
    return radio.onclick = function (e) {
      document.querySelectorAll("div.radio").forEach(function (radio) {
        return radio.classList.remove("checked");
      });
      e.target.classList.toggle("checked");
      formHandler.isValid(radio);
    };
  }); // Program display

  var program = document.getElementById("program");
  var navButtons = document.querySelectorAll("#program nav p");
  navButtons.forEach(function (node) {
    node.addEventListener("click", function (e) {
      navButtons.forEach(function (node) {
        return node.classList.remove("day--selected");
      });
      e.target.classList.add("day--selected");
      var day = e.target.dataset.day;
      program.querySelector(".program--content").innerHTML = document.querySelector("." + day).innerHTML;
    });
  }); // mobile height
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit

  var vh = window.innerHeight * 0.01; // Then we set the value in the --vh custom property to the root of the document

  document.documentElement.style.setProperty("--vh", "".concat(vh, "px"));
})();
},{"./lib/animations.js":"js/lib/animations.js","./lib/invitation.js":"js/lib/invitation.js","lottie-web":"node_modules/lottie-web/build/player/lottie.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62092" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map