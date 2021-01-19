"use strict";

var _object = _interopRequireDefault(require("object.assign"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _reactShallowRenderer = _interopRequireDefault(require("react-shallow-renderer"));

var _package = require("react-shallow-renderer/package.json");

var _testUtils = _interopRequireDefault(require("react-dom/test-utils"));

var _semver = _interopRequireDefault(require("semver"));

var _checkPropTypes2 = _interopRequireDefault(require("prop-types/checkPropTypes"));

var _has = _interopRequireDefault(require("has"));

var _enableEffects = _interopRequireDefault(require("./enableEffects"));

var _reactIs = require("react-is");

var _enzyme = require("enzyme");

var _Utils = require("enzyme/build/Utils");

var _enzymeShallowEqual = _interopRequireDefault(require("enzyme-shallow-equal"));

var _enzymeAdapterUtils = require("enzyme-adapter-utils");

var _findCurrentFiberUsingSlowPath = _interopRequireDefault(require("./findCurrentFiberUsingSlowPath"));

var _detectFiberTags = _interopRequireDefault(require("./detectFiberTags"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var is164 = !!_testUtils["default"].Simulate.touchStart; // 16.4+

var is165 = !!_testUtils["default"].Simulate.auxClick; // 16.5+

var is166 = is165 && !_react["default"].unstable_AsyncMode; // 16.6+

var is168 = is166 && typeof _testUtils["default"].act === 'function';

var hasShouldComponentUpdateBug = _semver["default"].satisfies(_package.version, '< 16.8'); // Lazily populated if DOM is available.


var FiberTags = null;

function nodeAndSiblingsArray(nodeWithSibling) {
  var array = [];
  var node = nodeWithSibling;

  while (node != null) {
    array.push(node);
    node = node.sibling;
  }

  return array;
}

function flatten(arr) {
  var result = [];
  var stack = [{
    i: 0,
    array: arr
  }];

  while (stack.length) {
    var n = stack.pop();

    while (n.i < n.array.length) {
      var el = n.array[n.i];
      n.i += 1;

      if (Array.isArray(el)) {
        stack.push(n);
        stack.push({
          i: 0,
          array: el
        });
        break;
      }

      result.push(el);
    }
  }

  return result;
}

function nodeTypeFromType(type) {
  if (type === _reactIs.Portal) {
    return 'portal';
  }

  return (0, _enzymeAdapterUtils.nodeTypeFromType)(type);
}

function isMemo(type) {
  return (0, _enzymeAdapterUtils.compareNodeTypeOf)(type, _reactIs.Memo);
}

function isLazy(type) {
  return (0, _enzymeAdapterUtils.compareNodeTypeOf)(type, _reactIs.Lazy);
}

function unmemoType(type) {
  return isMemo(type) ? type.type : type;
}

function checkIsSuspenseAndCloneElement(el, _ref) {
  var suspenseFallback = _ref.suspenseFallback;

  if (!(0, _reactIs.isSuspense)(el)) {
    return el;
  }

  var children = el.props.children;

  if (suspenseFallback) {
    var fallback = el.props.fallback;
    children = replaceLazyWithFallback(children, fallback);
  }

  var FakeSuspenseWrapper = function FakeSuspenseWrapper(props) {
    return /*#__PURE__*/_react["default"].createElement(el.type, _objectSpread(_objectSpread({}, el.props), props), children);
  };

  return /*#__PURE__*/_react["default"].createElement(FakeSuspenseWrapper, null, children);
}

function elementToTree(el) {
  if (!(0, _reactIs.isPortal)(el)) {
    return (0, _enzymeAdapterUtils.elementToTree)(el, elementToTree);
  }

  var children = el.children,
      containerInfo = el.containerInfo;
  var props = {
    children: children,
    containerInfo: containerInfo
  };
  return {
    nodeType: 'portal',
    type: _reactIs.Portal,
    props: props,
    key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(el.key),
    ref: el.ref || null,
    instance: null,
    rendered: elementToTree(el.children)
  };
}

function _toTree(vnode) {
  if (vnode == null) {
    return null;
  } // TODO(lmr): I'm not really sure I understand whether or not this is what
  // i should be doing, or if this is a hack for something i'm doing wrong
  // somewhere else. Should talk to sebastian about this perhaps


  var node = (0, _findCurrentFiberUsingSlowPath["default"])(vnode);

  switch (node.tag) {
    case FiberTags.HostRoot:
      return childrenToTree(node.child);

    case FiberTags.HostPortal:
      {
        var containerInfo = node.stateNode.containerInfo,
            children = node.memoizedProps;
        var props = {
          containerInfo: containerInfo,
          children: children
        };
        return {
          nodeType: 'portal',
          type: _reactIs.Portal,
          props: props,
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: childrenToTree(node.child)
        };
      }

    case FiberTags.ClassComponent:
      return {
        nodeType: 'class',
        type: node.type,
        props: _objectSpread({}, node.memoizedProps),
        key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
        ref: node.ref,
        instance: node.stateNode,
        rendered: childrenToTree(node.child)
      };

    case FiberTags.FunctionalComponent:
      return {
        nodeType: 'function',
        type: node.type,
        props: _objectSpread({}, node.memoizedProps),
        key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
        ref: node.ref,
        instance: null,
        rendered: childrenToTree(node.child)
      };

    case FiberTags.MemoClass:
      return {
        nodeType: 'class',
        type: node.elementType.type,
        props: _objectSpread({}, node.memoizedProps),
        key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
        ref: node.ref,
        instance: node.stateNode,
        rendered: childrenToTree(node.child.child)
      };

    case FiberTags.MemoSFC:
      {
        var renderedNodes = flatten(nodeAndSiblingsArray(node.child).map(_toTree));

        if (renderedNodes.length === 0) {
          renderedNodes = [node.memoizedProps.children];
        }

        return {
          nodeType: 'function',
          type: node.elementType,
          props: _objectSpread({}, node.memoizedProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: renderedNodes
        };
      }

    case FiberTags.HostComponent:
      {
        var _renderedNodes = flatten(nodeAndSiblingsArray(node.child).map(_toTree));

        if (_renderedNodes.length === 0) {
          _renderedNodes = [node.memoizedProps.children];
        }

        return {
          nodeType: 'host',
          type: node.type,
          props: _objectSpread({}, node.memoizedProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: node.stateNode,
          rendered: _renderedNodes
        };
      }

    case FiberTags.HostText:
      return node.memoizedProps;

    case FiberTags.Fragment:
    case FiberTags.Mode:
    case FiberTags.ContextProvider:
    case FiberTags.ContextConsumer:
      return childrenToTree(node.child);

    case FiberTags.Profiler:
    case FiberTags.ForwardRef:
      {
        return {
          nodeType: 'function',
          type: node.type,
          props: _objectSpread({}, node.pendingProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: childrenToTree(node.child)
        };
      }

    case FiberTags.Suspense:
      {
        return {
          nodeType: 'function',
          type: _reactIs.Suspense,
          props: _objectSpread({}, node.memoizedProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: childrenToTree(node.child)
        };
      }

    case FiberTags.Lazy:
      return childrenToTree(node.child);

    default:
      throw new Error("Enzyme Internal Error: unknown node with tag ".concat(node.tag));
  }
}

function childrenToTree(node) {
  if (!node) {
    return null;
  }

  var children = nodeAndSiblingsArray(node);

  if (children.length === 0) {
    return null;
  }

  if (children.length === 1) {
    return _toTree(children[0]);
  }

  return flatten(children.map(_toTree));
}

function _nodeToHostNode(_node) {
  // NOTE(lmr): node could be a function component
  // which wont have an instance prop, but we can get the
  // host node associated with its return value at that point.
  // Although this breaks down if the return value is an array,
  // as is possible with React 16.
  var node = _node;

  while (node && !Array.isArray(node) && node.instance === null) {
    node = node.rendered;
  } // if the SFC returned null effectively, there is no host node.


  if (!node) {
    return null;
  }

  var mapper = function mapper(item) {
    if (item && item.instance) return _reactDom["default"].findDOMNode(item.instance);
    return null;
  };

  if (Array.isArray(node)) {
    return node.map(mapper);
  }

  if (Array.isArray(node.rendered) && node.nodeType === 'class') {
    return node.rendered.map(mapper);
  }

  return mapper(node);
}

function replaceLazyWithFallback(node, fallback) {
  if (!node) {
    return null;
  }

  if (Array.isArray(node)) {
    return node.map(function (el) {
      return replaceLazyWithFallback(el, fallback);
    });
  }

  if (isLazy(node.type)) {
    return fallback;
  }

  return _objectSpread(_objectSpread({}, node), {}, {
    props: _objectSpread(_objectSpread({}, node.props), {}, {
      children: replaceLazyWithFallback(node.props.children, fallback)
    })
  });
}

var eventOptions = {
  animation: true,
  pointerEvents: is164,
  auxClick: is165
};

function getEmptyStateValue() {
  // this handles a bug in React 16.0 - 16.2
  // see https://github.com/facebook/react/commit/39be83565c65f9c522150e52375167568a2a1459
  // also see https://github.com/facebook/react/pull/11965
  // eslint-disable-next-line react/prefer-stateless-function
  var EmptyState = /*#__PURE__*/function (_React$Component) {
    _inherits(EmptyState, _React$Component);

    var _super = _createSuper(EmptyState);

    function EmptyState() {
      _classCallCheck(this, EmptyState);

      return _super.apply(this, arguments);
    }

    _createClass(EmptyState, [{
      key: "render",
      value: function render() {
        return null;
      }
    }]);

    return EmptyState;
  }(_react["default"].Component);

  var testRenderer = new _reactShallowRenderer["default"]();
  testRenderer.render( /*#__PURE__*/_react["default"].createElement(EmptyState));
  return testRenderer._instance.state;
}

function wrapAct(fn) {
  if (!is168) {
    return fn();
  }

  var returnVal;

  _testUtils["default"].act(function () {
    returnVal = fn();
  });

  return returnVal;
}

function getProviderDefaultValue(Provider) {
  // React stores references to the Provider's defaultValue differently across versions.
  if ('_defaultValue' in Provider._context) {
    return Provider._context._defaultValue;
  }

  if ('_currentValue' in Provider._context) {
    return Provider._context._currentValue;
  }

  throw new Error('Enzyme Internal Error: can’t figure out how to get Provider’s default value');
}

function makeFakeElement(type) {
  return {
    $$typeof: _reactIs.Element,
    type: type
  };
}

function isStateful(Component) {
  return Component.prototype && (Component.prototype.isReactComponent || Array.isArray(Component.__reactAutoBindPairs) // fallback for createClass components
  );
}

var ReactSixteenAdapter = /*#__PURE__*/function (_EnzymeAdapter) {
  _inherits(ReactSixteenAdapter, _EnzymeAdapter);

  var _super2 = _createSuper(ReactSixteenAdapter);

  function ReactSixteenAdapter() {
    var _this;

    _classCallCheck(this, ReactSixteenAdapter);

    _this = _super2.call(this);
    var lifecycles = _this.options.lifecycles;
    _this.options = _objectSpread(_objectSpread({}, _this.options), {}, {
      enableComponentDidUpdateOnSetState: true,
      // TODO: remove, semver-major
      legacyContextMode: 'parent',
      lifecycles: _objectSpread(_objectSpread({}, lifecycles), {}, {
        componentDidUpdate: {
          onSetState: true
        },
        getDerivedStateFromProps: {
          hasShouldComponentUpdateBug: hasShouldComponentUpdateBug
        },
        getSnapshotBeforeUpdate: true,
        setState: {
          skipsComponentDidUpdateOnNullish: true
        },
        getChildContext: {
          calledByRenderer: false
        },
        getDerivedStateFromError: is166
      })
    });
    return _this;
  }

  _createClass(ReactSixteenAdapter, [{
    key: "createMountRenderer",
    value: function createMountRenderer(options) {
      (0, _enzymeAdapterUtils.assertDomAvailable)('mount');

      if ((0, _has["default"])(options, 'suspenseFallback')) {
        throw new TypeError('`suspenseFallback` is not supported by the `mount` renderer');
      }

      if (FiberTags === null) {
        // Requires DOM.
        FiberTags = (0, _detectFiberTags["default"])();
      }

      var attachTo = options.attachTo,
          hydrateIn = options.hydrateIn,
          wrappingComponentProps = options.wrappingComponentProps;
      var domNode = hydrateIn || attachTo || global.document.createElement('div');
      var instance = null;
      var adapter = this;
      return _objectSpread({
        render: function render(el, context, callback) {
          return wrapAct(function () {
            if (instance === null) {
              var type = el.type,
                  props = el.props,
                  ref = el.ref;

              var wrapperProps = _objectSpread({
                Component: type,
                props: props,
                wrappingComponentProps: wrappingComponentProps,
                context: context
              }, ref && {
                refProp: ref
              });

              var ReactWrapperComponent = (0, _enzymeAdapterUtils.createMountWrapper)(el, _objectSpread(_objectSpread({}, options), {}, {
                adapter: adapter
              }));

              var wrappedEl = /*#__PURE__*/_react["default"].createElement(ReactWrapperComponent, wrapperProps);

              instance = hydrateIn ? _reactDom["default"].hydrate(wrappedEl, domNode) : _reactDom["default"].render(wrappedEl, domNode);

              if (typeof callback === 'function') {
                callback();
              }
            } else {
              instance.setChildProps(el.props, context, callback);
            }
          });
        },
        unmount: function unmount() {
          _reactDom["default"].unmountComponentAtNode(domNode);

          instance = null;
        },
        getNode: function getNode() {
          if (!instance) {
            return null;
          }

          return (0, _enzymeAdapterUtils.getNodeFromRootFinder)(adapter.isCustomComponent, _toTree(instance._reactInternalFiber), options);
        },
        simulateError: function simulateError(nodeHierarchy, rootNode, error) {
          var isErrorBoundary = function isErrorBoundary(_ref2) {
            var elInstance = _ref2.instance,
                type = _ref2.type;

            if (is166 && type && type.getDerivedStateFromError) {
              return true;
            }

            return elInstance && elInstance.componentDidCatch;
          };

          var _ref3 = nodeHierarchy.find(isErrorBoundary) || {},
              catchingInstance = _ref3.instance,
              catchingType = _ref3.type;

          (0, _enzymeAdapterUtils.simulateError)(error, catchingInstance, rootNode, nodeHierarchy, nodeTypeFromType, adapter.displayNameOfNode, is166 ? catchingType : undefined);
        },
        simulateEvent: function simulateEvent(node, event, mock) {
          var mappedEvent = (0, _enzymeAdapterUtils.mapNativeEventNames)(event, eventOptions);
          var eventFn = _testUtils["default"].Simulate[mappedEvent];

          if (!eventFn) {
            throw new TypeError("ReactWrapper::simulate() event '".concat(event, "' does not exist"));
          }

          wrapAct(function () {
            eventFn(adapter.nodeToHostNode(node), mock);
          });
        },
        batchedUpdates: function batchedUpdates(fn) {
          return fn(); // return ReactDOM.unstable_batchedUpdates(fn);
        },
        getWrappingComponentRenderer: function getWrappingComponentRenderer() {
          return _objectSpread(_objectSpread({}, this), (0, _enzymeAdapterUtils.getWrappingComponentMountRenderer)({
            toTree: function toTree(inst) {
              return _toTree(inst._reactInternalFiber);
            },
            getMountWrapperInstance: function getMountWrapperInstance() {
              return instance;
            }
          }));
        }
      }, is168 && {
        wrapInvoke: wrapAct
      });
    }
  }, {
    key: "createShallowRenderer",
    value: function createShallowRenderer() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var adapter = this;
      var renderer = new _reactShallowRenderer["default"]();
      (0, _enableEffects["default"])(renderer);
      var suspenseFallback = options.suspenseFallback;

      if (typeof suspenseFallback !== 'undefined' && typeof suspenseFallback !== 'boolean') {
        throw TypeError('`options.suspenseFallback` should be boolean or undefined');
      }

      var isDOM = false;
      var cachedNode = null;
      var lastComponent = null;
      var wrappedComponent = null;
      var sentinel = {}; // wrap memo components with a PureComponent, or a class component with sCU

      var wrapPureComponent = function wrapPureComponent(Component, compare) {
        if (!is166) {
          throw new RangeError('this function should not be called in React < 16.6. Please report this!');
        }

        if (lastComponent !== Component) {
          if (isStateful(Component)) {
            wrappedComponent = /*#__PURE__*/function (_Component) {
              _inherits(wrappedComponent, _Component);

              var _super3 = _createSuper(wrappedComponent);

              function wrappedComponent() {
                _classCallCheck(this, wrappedComponent);

                return _super3.apply(this, arguments);
              }

              return wrappedComponent;
            }(Component); // eslint-disable-line react/prefer-stateless-function


            if (compare) {
              wrappedComponent.prototype.shouldComponentUpdate = function (nextProps) {
                return !compare(_this2.props, nextProps);
              };
            } else {
              wrappedComponent.prototype.isPureReactComponent = true;
            }
          } else {
            var memoized = sentinel;
            var prevProps;

            wrappedComponent = function wrappedComponent(props) {
              var shouldUpdate = memoized === sentinel || (compare ? !compare(prevProps, props) : !(0, _enzymeShallowEqual["default"])(prevProps, props));

              if (shouldUpdate) {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }

                memoized = Component.apply(void 0, [_objectSpread(_objectSpread({}, Component.defaultProps), props)].concat(args));
                prevProps = props;
              }

              return memoized;
            };
          }

          (0, _object["default"])(wrappedComponent, Component, {
            displayName: adapter.displayNameOfNode({
              type: Component
            })
          });
          lastComponent = Component;
        }

        return wrappedComponent;
      }; // Wrap functional components on versions prior to 16.5,
      // to avoid inadvertently pass a `this` instance to it.


      var wrapFunctionalComponent = function wrapFunctionalComponent(Component) {
        if (is166 && (0, _has["default"])(Component, 'defaultProps')) {
          if (lastComponent !== Component) {
            wrappedComponent = (0, _object["default"])( // eslint-disable-next-line new-cap
            function (props) {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }

              return Component.apply(void 0, [_objectSpread(_objectSpread({}, Component.defaultProps), props)].concat(args));
            }, Component, {
              displayName: adapter.displayNameOfNode({
                type: Component
              })
            });
            lastComponent = Component;
          }

          return wrappedComponent;
        }

        if (is165) {
          return Component;
        }

        if (lastComponent !== Component) {
          wrappedComponent = (0, _object["default"])(function () {
            return Component.apply(void 0, arguments);
          }, // eslint-disable-line new-cap
          Component);
          lastComponent = Component;
        }

        return wrappedComponent;
      };

      var renderElement = function renderElement(elConfig) {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          rest[_key3 - 1] = arguments[_key3];
        }

        var renderedEl = renderer.render.apply(renderer, [elConfig].concat(rest));
        var typeIsExisted = !!(renderedEl && renderedEl.type);

        if (is166 && typeIsExisted) {
          var clonedEl = checkIsSuspenseAndCloneElement(renderedEl, {
            suspenseFallback: suspenseFallback
          });
          var elementIsChanged = clonedEl.type !== renderedEl.type;

          if (elementIsChanged) {
            return renderer.render.apply(renderer, [_objectSpread(_objectSpread({}, elConfig), {}, {
              type: clonedEl.type
            })].concat(rest));
          }
        }

        return renderedEl;
      };

      return {
        render: function render(el, unmaskedContext) {
          var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
              _ref4$providerValues = _ref4.providerValues,
              providerValues = _ref4$providerValues === void 0 ? new Map() : _ref4$providerValues;

          cachedNode = el;
          /* eslint consistent-return: 0 */

          if (typeof el.type === 'string') {
            isDOM = true;
          } else if ((0, _reactIs.isContextProvider)(el)) {
            providerValues.set(el.type, el.props.value);
            var MockProvider = (0, _object["default"])(function (props) {
              return props.children;
            }, el.type);
            return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              return renderElement(_objectSpread(_objectSpread({}, el), {}, {
                type: MockProvider
              }));
            });
          } else if ((0, _reactIs.isContextConsumer)(el)) {
            var Provider = adapter.getProviderFromConsumer(el.type);
            var value = providerValues.has(Provider) ? providerValues.get(Provider) : getProviderDefaultValue(Provider);
            var MockConsumer = (0, _object["default"])(function (props) {
              return props.children(value);
            }, el.type);
            return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              return renderElement(_objectSpread(_objectSpread({}, el), {}, {
                type: MockConsumer
              }));
            });
          } else {
            isDOM = false;
            var renderedEl = el;

            if (isLazy(renderedEl)) {
              throw TypeError('`React.lazy` is not supported by shallow rendering.');
            }

            renderedEl = checkIsSuspenseAndCloneElement(renderedEl, {
              suspenseFallback: suspenseFallback
            });
            var _renderedEl = renderedEl,
                Component = _renderedEl.type;
            var context = (0, _enzymeAdapterUtils.getMaskedContext)(Component.contextTypes, unmaskedContext);

            if (isMemo(el.type)) {
              var _el$type = el.type,
                  InnerComp = _el$type.type,
                  compare = _el$type.compare;
              return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
                return renderElement(_objectSpread(_objectSpread({}, el), {}, {
                  type: wrapPureComponent(InnerComp, compare)
                }), context);
              });
            }

            if (!isStateful(Component) && typeof Component === 'function') {
              return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
                return renderElement(_objectSpread(_objectSpread({}, renderedEl), {}, {
                  type: wrapFunctionalComponent(Component)
                }), context);
              });
            }

            if (isStateful) {
              // fix react bug; see implementation of `getEmptyStateValue`
              var emptyStateValue = getEmptyStateValue();

              if (emptyStateValue) {
                Object.defineProperty(Component.prototype, 'state', {
                  configurable: true,
                  enumerable: true,
                  get: function get() {
                    return null;
                  },
                  set: function set(value) {
                    if (value !== emptyStateValue) {
                      Object.defineProperty(this, 'state', {
                        configurable: true,
                        enumerable: true,
                        value: value,
                        writable: true
                      });
                    }

                    return true;
                  }
                });
              }
            }

            return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              return renderElement(renderedEl, context);
            });
          }
        },
        unmount: function unmount() {
          renderer._dispatcher.cleanupEffects();

          renderer.unmount();
        },
        getNode: function getNode() {
          if (isDOM) {
            return elementToTree(cachedNode);
          }

          var output = renderer.getRenderOutput();
          return {
            nodeType: nodeTypeFromType(cachedNode.type),
            type: cachedNode.type,
            props: cachedNode.props,
            key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(cachedNode.key),
            ref: cachedNode.ref,
            instance: renderer._instance,
            rendered: Array.isArray(output) ? flatten(output).map(function (el) {
              return elementToTree(el);
            }) : elementToTree(output)
          };
        },
        simulateError: function simulateError(nodeHierarchy, rootNode, error) {
          (0, _enzymeAdapterUtils.simulateError)(error, renderer._instance, cachedNode, nodeHierarchy.concat(cachedNode), nodeTypeFromType, adapter.displayNameOfNode, is166 ? cachedNode.type : undefined);
        },
        simulateEvent: function simulateEvent(node, event) {
          for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
            args[_key4 - 2] = arguments[_key4];
          }

          var handler = node.props[(0, _enzymeAdapterUtils.propFromEvent)(event, eventOptions)];

          if (handler) {
            (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              // TODO(lmr): create/use synthetic events
              // TODO(lmr): emulate React's event propagation
              // ReactDOM.unstable_batchedUpdates(() => {
              handler.apply(void 0, args); // });
            });
          }
        },
        batchedUpdates: function batchedUpdates(fn) {
          return fn(); // return ReactDOM.unstable_batchedUpdates(fn);
        },
        checkPropTypes: function checkPropTypes(typeSpecs, values, location, hierarchy) {
          return (0, _checkPropTypes2["default"])(typeSpecs, values, location, (0, _enzymeAdapterUtils.displayNameOfNode)(cachedNode), function () {
            return (0, _enzymeAdapterUtils.getComponentStack)(hierarchy.concat([cachedNode]));
          });
        }
      };
    }
  }, {
    key: "createStringRenderer",
    value: function createStringRenderer(options) {
      if ((0, _has["default"])(options, 'suspenseFallback')) {
        throw new TypeError('`suspenseFallback` should not be specified in options of string renderer');
      }

      return {
        render: function render(el, context) {
          if (options.context && (el.type.contextTypes || options.childContextTypes)) {
            var childContextTypes = _objectSpread(_objectSpread({}, el.type.contextTypes || {}), options.childContextTypes);

            var ContextWrapper = (0, _enzymeAdapterUtils.createRenderWrapper)(el, context, childContextTypes);
            return _server["default"].renderToStaticMarkup( /*#__PURE__*/_react["default"].createElement(ContextWrapper));
          }

          return _server["default"].renderToStaticMarkup(el);
        }
      };
    } // Provided a bag of options, return an `EnzymeRenderer`. Some options can be implementation
    // specific, like `attach` etc. for React, but not part of this interface explicitly.
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: "createRenderer",
    value: function createRenderer(options) {
      switch (options.mode) {
        case _enzyme.EnzymeAdapter.MODES.MOUNT:
          return this.createMountRenderer(options);

        case _enzyme.EnzymeAdapter.MODES.SHALLOW:
          return this.createShallowRenderer(options);

        case _enzyme.EnzymeAdapter.MODES.STRING:
          return this.createStringRenderer(options);

        default:
          throw new Error("Enzyme Internal Error: Unrecognized mode: ".concat(options.mode));
      }
    }
  }, {
    key: "wrap",
    value: function wrap(element) {
      return (0, _enzymeAdapterUtils.wrap)(element);
    } // converts an RSTNode to the corresponding JSX Pragma Element. This will be needed
    // in order to implement the `Wrapper.mount()` and `Wrapper.shallow()` methods, but should
    // be pretty straightforward for people to implement.
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: "nodeToElement",
    value: function nodeToElement(node) {
      if (!node || _typeof(node) !== 'object') return null;
      var type = node.type;
      return /*#__PURE__*/_react["default"].createElement(unmemoType(type), (0, _enzymeAdapterUtils.propsWithKeysAndRef)(node));
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "matchesElementType",
    value: function matchesElementType(node, matchingType) {
      if (!node) {
        return node;
      }

      var type = node.type;
      return unmemoType(type) === unmemoType(matchingType);
    }
  }, {
    key: "elementToNode",
    value: function elementToNode(element) {
      return elementToTree(element);
    }
  }, {
    key: "nodeToHostNode",
    value: function nodeToHostNode(node) {
      var supportsArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var nodes = _nodeToHostNode(node);

      if (Array.isArray(nodes) && !supportsArray) {
        return nodes[0];
      }

      return nodes;
    }
  }, {
    key: "displayNameOfNode",
    value: function displayNameOfNode(node) {
      if (!node) return null;
      var type = node.type,
          $$typeof = node.$$typeof;
      var nodeType = type || $$typeof; // newer node types may be undefined, so only test if the nodeType exists

      if (nodeType) {
        switch (nodeType) {
          case (is166 ? _reactIs.ConcurrentMode : _reactIs.AsyncMode) || NaN:
            return is166 ? 'ConcurrentMode' : 'AsyncMode';

          case _reactIs.Fragment || NaN:
            return 'Fragment';

          case _reactIs.StrictMode || NaN:
            return 'StrictMode';

          case _reactIs.Profiler || NaN:
            return 'Profiler';

          case _reactIs.Portal || NaN:
            return 'Portal';

          case _reactIs.Suspense || NaN:
            return 'Suspense';

          default:
        }
      }

      var $$typeofType = type && type.$$typeof;

      switch ($$typeofType) {
        case _reactIs.ContextConsumer || NaN:
          return 'ContextConsumer';

        case _reactIs.ContextProvider || NaN:
          return 'ContextProvider';

        case _reactIs.Memo || NaN:
          {
            var nodeName = (0, _enzymeAdapterUtils.displayNameOfNode)(node);
            return typeof nodeName === 'string' ? nodeName : "Memo(".concat((0, _enzymeAdapterUtils.displayNameOfNode)(type), ")");
          }

        case _reactIs.ForwardRef || NaN:
          {
            if (type.displayName) {
              return type.displayName;
            }

            var name = (0, _enzymeAdapterUtils.displayNameOfNode)({
              type: type.render
            });
            return name ? "ForwardRef(".concat(name, ")") : 'ForwardRef';
          }

        case _reactIs.Lazy || NaN:
          {
            return 'lazy';
          }

        default:
          return (0, _enzymeAdapterUtils.displayNameOfNode)(node);
      }
    }
  }, {
    key: "isValidElement",
    value: function isValidElement(element) {
      return (0, _reactIs.isElement)(element);
    }
  }, {
    key: "isValidElementType",
    value: function isValidElementType(object) {
      return !!object && (0, _reactIs.isValidElementType)(object);
    }
  }, {
    key: "isFragment",
    value: function isFragment(fragment) {
      return (0, _Utils.typeOfNode)(fragment) === _reactIs.Fragment;
    }
  }, {
    key: "isCustomComponent",
    value: function isCustomComponent(type) {
      var fakeElement = makeFakeElement(type);
      return !!type && (typeof type === 'function' || (0, _reactIs.isForwardRef)(fakeElement) || (0, _reactIs.isContextProvider)(fakeElement) || (0, _reactIs.isContextConsumer)(fakeElement) || (0, _reactIs.isSuspense)(fakeElement));
    }
  }, {
    key: "isContextConsumer",
    value: function isContextConsumer(type) {
      return !!type && (0, _reactIs.isContextConsumer)(makeFakeElement(type));
    }
  }, {
    key: "isCustomComponentElement",
    value: function isCustomComponentElement(inst) {
      if (!inst || !this.isValidElement(inst)) {
        return false;
      }

      return this.isCustomComponent(inst.type);
    }
  }, {
    key: "getProviderFromConsumer",
    value: function getProviderFromConsumer(Consumer) {
      // React stores references to the Provider on a Consumer differently across versions.
      if (Consumer) {
        var Provider;

        if (Consumer._context) {
          // check this first, to avoid a deprecation warning
          Provider = Consumer._context.Provider;
        } else if (Consumer.Provider) {
          Provider = Consumer.Provider;
        }

        if (Provider) {
          return Provider;
        }
      }

      throw new Error('Enzyme Internal Error: can’t figure out how to get Provider from Consumer');
    }
  }, {
    key: "createElement",
    value: function createElement() {
      return /*#__PURE__*/_react["default"].createElement.apply(_react["default"], arguments);
    }
  }, {
    key: "wrapWithWrappingComponent",
    value: function wrapWithWrappingComponent(node, options) {
      return {
        RootFinder: _enzymeAdapterUtils.RootFinder,
        node: (0, _enzymeAdapterUtils.wrapWithWrappingComponent)(_react["default"].createElement, node, options)
      };
    }
  }]);

  return ReactSixteenAdapter;
}(_enzyme.EnzymeAdapter);

module.exports = ReactSixteenAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWFjdFNpeHRlZW5BZGFwdGVyLmpzIl0sIm5hbWVzIjpbImlzMTY0IiwiVGVzdFV0aWxzIiwiU2ltdWxhdGUiLCJ0b3VjaFN0YXJ0IiwiaXMxNjUiLCJhdXhDbGljayIsImlzMTY2IiwiUmVhY3QiLCJ1bnN0YWJsZV9Bc3luY01vZGUiLCJpczE2OCIsImFjdCIsImhhc1Nob3VsZENvbXBvbmVudFVwZGF0ZUJ1ZyIsInNlbXZlciIsInNhdGlzZmllcyIsInRlc3RSZW5kZXJlclZlcnNpb24iLCJGaWJlclRhZ3MiLCJub2RlQW5kU2libGluZ3NBcnJheSIsIm5vZGVXaXRoU2libGluZyIsImFycmF5Iiwibm9kZSIsInB1c2giLCJzaWJsaW5nIiwiZmxhdHRlbiIsImFyciIsInJlc3VsdCIsInN0YWNrIiwiaSIsImxlbmd0aCIsIm4iLCJwb3AiLCJlbCIsIkFycmF5IiwiaXNBcnJheSIsIm5vZGVUeXBlRnJvbVR5cGUiLCJ0eXBlIiwiUG9ydGFsIiwiaXNNZW1vIiwiTWVtbyIsImlzTGF6eSIsIkxhenkiLCJ1bm1lbW9UeXBlIiwiY2hlY2tJc1N1c3BlbnNlQW5kQ2xvbmVFbGVtZW50Iiwic3VzcGVuc2VGYWxsYmFjayIsImNoaWxkcmVuIiwicHJvcHMiLCJmYWxsYmFjayIsInJlcGxhY2VMYXp5V2l0aEZhbGxiYWNrIiwiRmFrZVN1c3BlbnNlV3JhcHBlciIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50VG9UcmVlIiwiY29udGFpbmVySW5mbyIsIm5vZGVUeXBlIiwia2V5IiwicmVmIiwiaW5zdGFuY2UiLCJyZW5kZXJlZCIsInRvVHJlZSIsInZub2RlIiwidGFnIiwiSG9zdFJvb3QiLCJjaGlsZHJlblRvVHJlZSIsImNoaWxkIiwiSG9zdFBvcnRhbCIsInN0YXRlTm9kZSIsIm1lbW9pemVkUHJvcHMiLCJDbGFzc0NvbXBvbmVudCIsIkZ1bmN0aW9uYWxDb21wb25lbnQiLCJNZW1vQ2xhc3MiLCJlbGVtZW50VHlwZSIsIk1lbW9TRkMiLCJyZW5kZXJlZE5vZGVzIiwibWFwIiwiSG9zdENvbXBvbmVudCIsIkhvc3RUZXh0IiwiRnJhZ21lbnQiLCJNb2RlIiwiQ29udGV4dFByb3ZpZGVyIiwiQ29udGV4dENvbnN1bWVyIiwiUHJvZmlsZXIiLCJGb3J3YXJkUmVmIiwicGVuZGluZ1Byb3BzIiwiU3VzcGVuc2UiLCJFcnJvciIsIm5vZGVUb0hvc3ROb2RlIiwiX25vZGUiLCJtYXBwZXIiLCJpdGVtIiwiUmVhY3RET00iLCJmaW5kRE9NTm9kZSIsImV2ZW50T3B0aW9ucyIsImFuaW1hdGlvbiIsInBvaW50ZXJFdmVudHMiLCJnZXRFbXB0eVN0YXRlVmFsdWUiLCJFbXB0eVN0YXRlIiwiQ29tcG9uZW50IiwidGVzdFJlbmRlcmVyIiwiU2hhbGxvd1JlbmRlcmVyIiwicmVuZGVyIiwiX2luc3RhbmNlIiwic3RhdGUiLCJ3cmFwQWN0IiwiZm4iLCJyZXR1cm5WYWwiLCJnZXRQcm92aWRlckRlZmF1bHRWYWx1ZSIsIlByb3ZpZGVyIiwiX2NvbnRleHQiLCJfZGVmYXVsdFZhbHVlIiwiX2N1cnJlbnRWYWx1ZSIsIm1ha2VGYWtlRWxlbWVudCIsIiQkdHlwZW9mIiwiRWxlbWVudCIsImlzU3RhdGVmdWwiLCJwcm90b3R5cGUiLCJpc1JlYWN0Q29tcG9uZW50IiwiX19yZWFjdEF1dG9CaW5kUGFpcnMiLCJSZWFjdFNpeHRlZW5BZGFwdGVyIiwibGlmZWN5Y2xlcyIsIm9wdGlvbnMiLCJlbmFibGVDb21wb25lbnREaWRVcGRhdGVPblNldFN0YXRlIiwibGVnYWN5Q29udGV4dE1vZGUiLCJjb21wb25lbnREaWRVcGRhdGUiLCJvblNldFN0YXRlIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzIiwiZ2V0U25hcHNob3RCZWZvcmVVcGRhdGUiLCJzZXRTdGF0ZSIsInNraXBzQ29tcG9uZW50RGlkVXBkYXRlT25OdWxsaXNoIiwiZ2V0Q2hpbGRDb250ZXh0IiwiY2FsbGVkQnlSZW5kZXJlciIsImdldERlcml2ZWRTdGF0ZUZyb21FcnJvciIsIlR5cGVFcnJvciIsImF0dGFjaFRvIiwiaHlkcmF0ZUluIiwid3JhcHBpbmdDb21wb25lbnRQcm9wcyIsImRvbU5vZGUiLCJnbG9iYWwiLCJkb2N1bWVudCIsImFkYXB0ZXIiLCJjb250ZXh0IiwiY2FsbGJhY2siLCJ3cmFwcGVyUHJvcHMiLCJyZWZQcm9wIiwiUmVhY3RXcmFwcGVyQ29tcG9uZW50Iiwid3JhcHBlZEVsIiwiaHlkcmF0ZSIsInNldENoaWxkUHJvcHMiLCJ1bm1vdW50IiwidW5tb3VudENvbXBvbmVudEF0Tm9kZSIsImdldE5vZGUiLCJpc0N1c3RvbUNvbXBvbmVudCIsIl9yZWFjdEludGVybmFsRmliZXIiLCJzaW11bGF0ZUVycm9yIiwibm9kZUhpZXJhcmNoeSIsInJvb3ROb2RlIiwiZXJyb3IiLCJpc0Vycm9yQm91bmRhcnkiLCJlbEluc3RhbmNlIiwiY29tcG9uZW50RGlkQ2F0Y2giLCJmaW5kIiwiY2F0Y2hpbmdJbnN0YW5jZSIsImNhdGNoaW5nVHlwZSIsImRpc3BsYXlOYW1lT2ZOb2RlIiwidW5kZWZpbmVkIiwic2ltdWxhdGVFdmVudCIsImV2ZW50IiwibW9jayIsIm1hcHBlZEV2ZW50IiwiZXZlbnRGbiIsImJhdGNoZWRVcGRhdGVzIiwiZ2V0V3JhcHBpbmdDb21wb25lbnRSZW5kZXJlciIsImluc3QiLCJnZXRNb3VudFdyYXBwZXJJbnN0YW5jZSIsIndyYXBJbnZva2UiLCJyZW5kZXJlciIsImlzRE9NIiwiY2FjaGVkTm9kZSIsImxhc3RDb21wb25lbnQiLCJ3cmFwcGVkQ29tcG9uZW50Iiwic2VudGluZWwiLCJ3cmFwUHVyZUNvbXBvbmVudCIsImNvbXBhcmUiLCJSYW5nZUVycm9yIiwic2hvdWxkQ29tcG9uZW50VXBkYXRlIiwibmV4dFByb3BzIiwiaXNQdXJlUmVhY3RDb21wb25lbnQiLCJtZW1vaXplZCIsInByZXZQcm9wcyIsInNob3VsZFVwZGF0ZSIsImFyZ3MiLCJkZWZhdWx0UHJvcHMiLCJkaXNwbGF5TmFtZSIsIndyYXBGdW5jdGlvbmFsQ29tcG9uZW50IiwicmVuZGVyRWxlbWVudCIsImVsQ29uZmlnIiwicmVzdCIsInJlbmRlcmVkRWwiLCJ0eXBlSXNFeGlzdGVkIiwiY2xvbmVkRWwiLCJlbGVtZW50SXNDaGFuZ2VkIiwidW5tYXNrZWRDb250ZXh0IiwicHJvdmlkZXJWYWx1ZXMiLCJNYXAiLCJzZXQiLCJ2YWx1ZSIsIk1vY2tQcm92aWRlciIsImdldFByb3ZpZGVyRnJvbUNvbnN1bWVyIiwiaGFzIiwiZ2V0IiwiTW9ja0NvbnN1bWVyIiwiY29udGV4dFR5cGVzIiwiSW5uZXJDb21wIiwiZW1wdHlTdGF0ZVZhbHVlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwid3JpdGFibGUiLCJfZGlzcGF0Y2hlciIsImNsZWFudXBFZmZlY3RzIiwib3V0cHV0IiwiZ2V0UmVuZGVyT3V0cHV0IiwiY29uY2F0IiwiaGFuZGxlciIsImNoZWNrUHJvcFR5cGVzIiwidHlwZVNwZWNzIiwidmFsdWVzIiwibG9jYXRpb24iLCJoaWVyYXJjaHkiLCJjaGlsZENvbnRleHRUeXBlcyIsIkNvbnRleHRXcmFwcGVyIiwiUmVhY3RET01TZXJ2ZXIiLCJyZW5kZXJUb1N0YXRpY01hcmt1cCIsIm1vZGUiLCJFbnp5bWVBZGFwdGVyIiwiTU9ERVMiLCJNT1VOVCIsImNyZWF0ZU1vdW50UmVuZGVyZXIiLCJTSEFMTE9XIiwiY3JlYXRlU2hhbGxvd1JlbmRlcmVyIiwiU1RSSU5HIiwiY3JlYXRlU3RyaW5nUmVuZGVyZXIiLCJlbGVtZW50IiwibWF0Y2hpbmdUeXBlIiwic3VwcG9ydHNBcnJheSIsIm5vZGVzIiwiQ29uY3VycmVudE1vZGUiLCJBc3luY01vZGUiLCJOYU4iLCJTdHJpY3RNb2RlIiwiJCR0eXBlb2ZUeXBlIiwibm9kZU5hbWUiLCJuYW1lIiwib2JqZWN0IiwiZnJhZ21lbnQiLCJmYWtlRWxlbWVudCIsImlzVmFsaWRFbGVtZW50IiwiQ29uc3VtZXIiLCJSb290RmluZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUNBOztB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QUFGLElBQVUsZ0NBQWtCMEUsZUFBZSxDQUFDMUUsSUFBRCxDQUFqQyxDQUFqQjtBQUNEOzs7NkNBRXdCdUksSSxFQUFNO0FBQzdCLFVBQUksQ0FBQ0EsSUFBRCxJQUFTLENBQUMsS0FBS3FGLGNBQUwsQ0FBb0JyRixJQUFwQixDQUFkLEVBQXlDO0FBQ3ZDLGVBQU8sS0FBUDtBQUNEOztBQUNELGFBQU8sS0FBS3JCLGlCQUFMLENBQXVCcUIsSUFBSSxDQUFDdkksSUFBNUIsQ0FBUDtBQUNEOzs7NENBRXVCNk4sUSxFQUFVO0FBQ2hDO0FBQ0EsVUFBSUEsUUFBSixFQUFjO0FBQ1osWUFBSXZKLFFBQUo7O0FBQ0EsWUFBSXVKLFFBQVEsQ0FBQ3RKLFFBQWIsRUFBdUI7QUFBRTtBQUNwQkQsVUFBQUEsUUFEa0IsR0FDTHVKLFFBQVEsQ0FBQ3RKLFFBREosQ0FDbEJELFFBRGtCO0FBRXRCLFNBRkQsTUFFTyxJQUFJdUosUUFBUSxDQUFDdkosUUFBYixFQUF1QjtBQUN6QkEsVUFBQUEsUUFEeUIsR0FDWnVKLFFBRFksQ0FDekJ2SixRQUR5QjtBQUU3Qjs7QUFDRCxZQUFJQSxRQUFKLEVBQWM7QUFDWixpQkFBT0EsUUFBUDtBQUNEO0FBQ0Y7O0FBQ0QsWUFBTSxJQUFJdEIsS0FBSixDQUFVLDJFQUFWLENBQU47QUFDRDs7O29DQUVzQjtBQUNyQiwwQkFBTzNFLGtCQUFNeUMsYUFBTixvQ0FBUDtBQUNEOzs7OENBRXlCN0IsSSxFQUFNa0csTyxFQUFTO0FBQ3ZDLGFBQU87QUFDTDJJLFFBQUFBLFVBQVUsRUFBVkEsOEJBREs7QUFFTDdPLFFBQUFBLElBQUksRUFBRSxtREFBMEJaLGtCQUFNeUMsYUFBaEMsRUFBK0M3QixJQUEvQyxFQUFxRGtHLE9BQXJEO0FBRkQsT0FBUDtBQUlEOzs7O0VBMWhCK0JtSCxxQjs7QUE2aEJsQ3lCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQi9JLG1CQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludCBuby11c2UtYmVmb3JlLWRlZmluZTogMCAqL1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgUmVhY3RET01TZXJ2ZXIgZnJvbSAncmVhY3QtZG9tL3NlcnZlcic7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcbmltcG9ydCBTaGFsbG93UmVuZGVyZXIgZnJvbSAncmVhY3Qtc2hhbGxvdy1yZW5kZXJlcic7XG5pbXBvcnQgeyB2ZXJzaW9uIGFzIHRlc3RSZW5kZXJlclZlcnNpb24gfSBmcm9tICdyZWFjdC1zaGFsbG93LXJlbmRlcmVyL3BhY2thZ2UuanNvbic7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcbmltcG9ydCBUZXN0VXRpbHMgZnJvbSAncmVhY3QtZG9tL3Rlc3QtdXRpbHMnO1xuaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IGNoZWNrUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMnO1xuaW1wb3J0IGhhcyBmcm9tICdoYXMnO1xuaW1wb3J0IGVuYWJsZUVmZmVjdHMgZnJvbSAnLi9lbmFibGVFZmZlY3RzJ1xuaW1wb3J0IHtcbiAgQXN5bmNNb2RlLFxuICBDb25jdXJyZW50TW9kZSxcbiAgQ29udGV4dENvbnN1bWVyLFxuICBDb250ZXh0UHJvdmlkZXIsXG4gIEVsZW1lbnQsXG4gIEZvcndhcmRSZWYsXG4gIEZyYWdtZW50LFxuICBpc0NvbnRleHRDb25zdW1lcixcbiAgaXNDb250ZXh0UHJvdmlkZXIsXG4gIGlzRWxlbWVudCxcbiAgaXNGb3J3YXJkUmVmLFxuICBpc1BvcnRhbCxcbiAgaXNTdXNwZW5zZSxcbiAgaXNWYWxpZEVsZW1lbnRUeXBlLFxuICBMYXp5LFxuICBNZW1vLFxuICBQb3J0YWwsXG4gIFByb2ZpbGVyLFxuICBTdHJpY3RNb2RlLFxuICBTdXNwZW5zZSxcbn0gZnJvbSAncmVhY3QtaXMnO1xuaW1wb3J0IHsgRW56eW1lQWRhcHRlciB9IGZyb20gJ2VuenltZSc7XG5pbXBvcnQgeyB0eXBlT2ZOb2RlIH0gZnJvbSAnZW56eW1lL2J1aWxkL1V0aWxzJztcbmltcG9ydCBzaGFsbG93RXF1YWwgZnJvbSAnZW56eW1lLXNoYWxsb3ctZXF1YWwnO1xuaW1wb3J0IHtcbiAgZGlzcGxheU5hbWVPZk5vZGUsXG4gIGVsZW1lbnRUb1RyZWUgYXMgdXRpbEVsZW1lbnRUb1RyZWUsXG4gIG5vZGVUeXBlRnJvbVR5cGUgYXMgdXRpbE5vZGVUeXBlRnJvbVR5cGUsXG4gIG1hcE5hdGl2ZUV2ZW50TmFtZXMsXG4gIHByb3BGcm9tRXZlbnQsXG4gIGFzc2VydERvbUF2YWlsYWJsZSxcbiAgd2l0aFNldFN0YXRlQWxsb3dlZCxcbiAgY3JlYXRlUmVuZGVyV3JhcHBlcixcbiAgY3JlYXRlTW91bnRXcmFwcGVyLFxuICBwcm9wc1dpdGhLZXlzQW5kUmVmLFxuICBlbnN1cmVLZXlPclVuZGVmaW5lZCxcbiAgc2ltdWxhdGVFcnJvcixcbiAgd3JhcCxcbiAgZ2V0TWFza2VkQ29udGV4dCxcbiAgZ2V0Q29tcG9uZW50U3RhY2ssXG4gIFJvb3RGaW5kZXIsXG4gIGdldE5vZGVGcm9tUm9vdEZpbmRlcixcbiAgd3JhcFdpdGhXcmFwcGluZ0NvbXBvbmVudCxcbiAgZ2V0V3JhcHBpbmdDb21wb25lbnRNb3VudFJlbmRlcmVyLFxuICBjb21wYXJlTm9kZVR5cGVPZixcbn0gZnJvbSAnZW56eW1lLWFkYXB0ZXItdXRpbHMnO1xuaW1wb3J0IGZpbmRDdXJyZW50RmliZXJVc2luZ1Nsb3dQYXRoIGZyb20gJy4vZmluZEN1cnJlbnRGaWJlclVzaW5nU2xvd1BhdGgnO1xuaW1wb3J0IGRldGVjdEZpYmVyVGFncyBmcm9tICcuL2RldGVjdEZpYmVyVGFncyc7XG5cbmNvbnN0IGlzMTY0ID0gISFUZXN0VXRpbHMuU2ltdWxhdGUudG91Y2hTdGFydDsgLy8gMTYuNCtcbmNvbnN0IGlzMTY1ID0gISFUZXN0VXRpbHMuU2ltdWxhdGUuYXV4Q2xpY2s7IC8vIDE2LjUrXG5jb25zdCBpczE2NiA9IGlzMTY1ICYmICFSZWFjdC51bnN0YWJsZV9Bc3luY01vZGU7IC8vIDE2LjYrXG5jb25zdCBpczE2OCA9IGlzMTY2ICYmIHR5cGVvZiBUZXN0VXRpbHMuYWN0ID09PSAnZnVuY3Rpb24nO1xuXG5jb25zdCBoYXNTaG91bGRDb21wb25lbnRVcGRhdGVCdWcgPSBzZW12ZXIuc2F0aXNmaWVzKHRlc3RSZW5kZXJlclZlcnNpb24sICc8IDE2LjgnKTtcblxuLy8gTGF6aWx5IHBvcHVsYXRlZCBpZiBET00gaXMgYXZhaWxhYmxlLlxubGV0IEZpYmVyVGFncyA9IG51bGw7XG5cbmZ1bmN0aW9uIG5vZGVBbmRTaWJsaW5nc0FycmF5KG5vZGVXaXRoU2libGluZykge1xuICBjb25zdCBhcnJheSA9IFtdO1xuICBsZXQgbm9kZSA9IG5vZGVXaXRoU2libGluZztcbiAgd2hpbGUgKG5vZGUgIT0gbnVsbCkge1xuICAgIGFycmF5LnB1c2gobm9kZSk7XG4gICAgbm9kZSA9IG5vZGUuc2libGluZztcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyKSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBjb25zdCBzdGFjayA9IFt7IGk6IDAsIGFycmF5OiBhcnIgfV07XG4gIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICBjb25zdCBuID0gc3RhY2sucG9wKCk7XG4gICAgd2hpbGUgKG4uaSA8IG4uYXJyYXkubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlbCA9IG4uYXJyYXlbbi5pXTtcbiAgICAgIG4uaSArPSAxO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZWwpKSB7XG4gICAgICAgIHN0YWNrLnB1c2gobik7XG4gICAgICAgIHN0YWNrLnB1c2goeyBpOiAwLCBhcnJheTogZWwgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2goZWwpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBub2RlVHlwZUZyb21UeXBlKHR5cGUpIHtcbiAgaWYgKHR5cGUgPT09IFBvcnRhbCkge1xuICAgIHJldHVybiAncG9ydGFsJztcbiAgfVxuXG4gIHJldHVybiB1dGlsTm9kZVR5cGVGcm9tVHlwZSh0eXBlKTtcbn1cblxuZnVuY3Rpb24gaXNNZW1vKHR5cGUpIHtcbiAgcmV0dXJuIGNvbXBhcmVOb2RlVHlwZU9mKHR5cGUsIE1lbW8pO1xufVxuXG5mdW5jdGlvbiBpc0xhenkodHlwZSkge1xuICByZXR1cm4gY29tcGFyZU5vZGVUeXBlT2YodHlwZSwgTGF6eSk7XG59XG5cbmZ1bmN0aW9uIHVubWVtb1R5cGUodHlwZSkge1xuICByZXR1cm4gaXNNZW1vKHR5cGUpID8gdHlwZS50eXBlIDogdHlwZTtcbn1cblxuZnVuY3Rpb24gY2hlY2tJc1N1c3BlbnNlQW5kQ2xvbmVFbGVtZW50KGVsLCB7IHN1c3BlbnNlRmFsbGJhY2sgfSkge1xuICBpZiAoIWlzU3VzcGVuc2UoZWwpKSB7XG4gICAgcmV0dXJuIGVsO1xuICB9XG5cbiAgbGV0IHsgY2hpbGRyZW4gfSA9IGVsLnByb3BzO1xuXG4gIGlmIChzdXNwZW5zZUZhbGxiYWNrKSB7XG4gICAgY29uc3QgeyBmYWxsYmFjayB9ID0gZWwucHJvcHM7XG4gICAgY2hpbGRyZW4gPSByZXBsYWNlTGF6eVdpdGhGYWxsYmFjayhjaGlsZHJlbiwgZmFsbGJhY2spO1xuICB9XG5cbiAgY29uc3QgRmFrZVN1c3BlbnNlV3JhcHBlciA9IChwcm9wcykgPT4gUmVhY3QuY3JlYXRlRWxlbWVudChlbC50eXBlLCB7IC4uLmVsLnByb3BzLCAuLi5wcm9wcyB9LCBjaGlsZHJlbik7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZha2VTdXNwZW5zZVdyYXBwZXIsIG51bGwsIGNoaWxkcmVuKTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudFRvVHJlZShlbCkge1xuICBpZiAoIWlzUG9ydGFsKGVsKSkge1xuICAgIHJldHVybiB1dGlsRWxlbWVudFRvVHJlZShlbCwgZWxlbWVudFRvVHJlZSk7XG4gIH1cblxuICBjb25zdCB7IGNoaWxkcmVuLCBjb250YWluZXJJbmZvIH0gPSBlbDtcbiAgY29uc3QgcHJvcHMgPSB7IGNoaWxkcmVuLCBjb250YWluZXJJbmZvIH07XG5cbiAgcmV0dXJuIHtcbiAgICBub2RlVHlwZTogJ3BvcnRhbCcsXG4gICAgdHlwZTogUG9ydGFsLFxuICAgIHByb3BzLFxuICAgIGtleTogZW5zdXJlS2V5T3JVbmRlZmluZWQoZWwua2V5KSxcbiAgICByZWY6IGVsLnJlZiB8fCBudWxsLFxuICAgIGluc3RhbmNlOiBudWxsLFxuICAgIHJlbmRlcmVkOiBlbGVtZW50VG9UcmVlKGVsLmNoaWxkcmVuKSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9UcmVlKHZub2RlKSB7XG4gIGlmICh2bm9kZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgLy8gVE9ETyhsbXIpOiBJJ20gbm90IHJlYWxseSBzdXJlIEkgdW5kZXJzdGFuZCB3aGV0aGVyIG9yIG5vdCB0aGlzIGlzIHdoYXRcbiAgLy8gaSBzaG91bGQgYmUgZG9pbmcsIG9yIGlmIHRoaXMgaXMgYSBoYWNrIGZvciBzb21ldGhpbmcgaSdtIGRvaW5nIHdyb25nXG4gIC8vIHNvbWV3aGVyZSBlbHNlLiBTaG91bGQgdGFsayB0byBzZWJhc3RpYW4gYWJvdXQgdGhpcyBwZXJoYXBzXG4gIGNvbnN0IG5vZGUgPSBmaW5kQ3VycmVudEZpYmVyVXNpbmdTbG93UGF0aCh2bm9kZSk7XG4gIHN3aXRjaCAobm9kZS50YWcpIHtcbiAgICBjYXNlIEZpYmVyVGFncy5Ib3N0Um9vdDpcbiAgICAgIHJldHVybiBjaGlsZHJlblRvVHJlZShub2RlLmNoaWxkKTtcbiAgICBjYXNlIEZpYmVyVGFncy5Ib3N0UG9ydGFsOiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHN0YXRlTm9kZTogeyBjb250YWluZXJJbmZvIH0sXG4gICAgICAgIG1lbW9pemVkUHJvcHM6IGNoaWxkcmVuLFxuICAgICAgfSA9IG5vZGU7XG4gICAgICBjb25zdCBwcm9wcyA9IHsgY29udGFpbmVySW5mbywgY2hpbGRyZW4gfTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5vZGVUeXBlOiAncG9ydGFsJyxcbiAgICAgICAgdHlwZTogUG9ydGFsLFxuICAgICAgICBwcm9wcyxcbiAgICAgICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChub2RlLmtleSksXG4gICAgICAgIHJlZjogbm9kZS5yZWYsXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgICByZW5kZXJlZDogY2hpbGRyZW5Ub1RyZWUobm9kZS5jaGlsZCksXG4gICAgICB9O1xuICAgIH1cbiAgICBjYXNlIEZpYmVyVGFncy5DbGFzc0NvbXBvbmVudDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5vZGVUeXBlOiAnY2xhc3MnLFxuICAgICAgICB0eXBlOiBub2RlLnR5cGUsXG4gICAgICAgIHByb3BzOiB7IC4uLm5vZGUubWVtb2l6ZWRQcm9wcyB9LFxuICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKG5vZGUua2V5KSxcbiAgICAgICAgcmVmOiBub2RlLnJlZixcbiAgICAgICAgaW5zdGFuY2U6IG5vZGUuc3RhdGVOb2RlLFxuICAgICAgICByZW5kZXJlZDogY2hpbGRyZW5Ub1RyZWUobm9kZS5jaGlsZCksXG4gICAgICB9O1xuICAgIGNhc2UgRmliZXJUYWdzLkZ1bmN0aW9uYWxDb21wb25lbnQ6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2RlVHlwZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgdHlwZTogbm9kZS50eXBlLFxuICAgICAgICBwcm9wczogeyAuLi5ub2RlLm1lbW9pemVkUHJvcHMgfSxcbiAgICAgICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChub2RlLmtleSksXG4gICAgICAgIHJlZjogbm9kZS5yZWYsXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgICByZW5kZXJlZDogY2hpbGRyZW5Ub1RyZWUobm9kZS5jaGlsZCksXG4gICAgICB9O1xuICAgIGNhc2UgRmliZXJUYWdzLk1lbW9DbGFzczpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5vZGVUeXBlOiAnY2xhc3MnLFxuICAgICAgICB0eXBlOiBub2RlLmVsZW1lbnRUeXBlLnR5cGUsXG4gICAgICAgIHByb3BzOiB7IC4uLm5vZGUubWVtb2l6ZWRQcm9wcyB9LFxuICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKG5vZGUua2V5KSxcbiAgICAgICAgcmVmOiBub2RlLnJlZixcbiAgICAgICAgaW5zdGFuY2U6IG5vZGUuc3RhdGVOb2RlLFxuICAgICAgICByZW5kZXJlZDogY2hpbGRyZW5Ub1RyZWUobm9kZS5jaGlsZC5jaGlsZCksXG4gICAgICB9O1xuICAgIGNhc2UgRmliZXJUYWdzLk1lbW9TRkM6IHtcbiAgICAgIGxldCByZW5kZXJlZE5vZGVzID0gZmxhdHRlbihub2RlQW5kU2libGluZ3NBcnJheShub2RlLmNoaWxkKS5tYXAodG9UcmVlKSk7XG4gICAgICBpZiAocmVuZGVyZWROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmVuZGVyZWROb2RlcyA9IFtub2RlLm1lbW9pemVkUHJvcHMuY2hpbGRyZW5dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZVR5cGU6ICdmdW5jdGlvbicsXG4gICAgICAgIHR5cGU6IG5vZGUuZWxlbWVudFR5cGUsXG4gICAgICAgIHByb3BzOiB7IC4uLm5vZGUubWVtb2l6ZWRQcm9wcyB9LFxuICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKG5vZGUua2V5KSxcbiAgICAgICAgcmVmOiBub2RlLnJlZixcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICAgIHJlbmRlcmVkOiByZW5kZXJlZE5vZGVzLFxuICAgICAgfTtcbiAgICB9XG4gICAgY2FzZSBGaWJlclRhZ3MuSG9zdENvbXBvbmVudDoge1xuICAgICAgbGV0IHJlbmRlcmVkTm9kZXMgPSBmbGF0dGVuKG5vZGVBbmRTaWJsaW5nc0FycmF5KG5vZGUuY2hpbGQpLm1hcCh0b1RyZWUpKTtcbiAgICAgIGlmIChyZW5kZXJlZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZW5kZXJlZE5vZGVzID0gW25vZGUubWVtb2l6ZWRQcm9wcy5jaGlsZHJlbl07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2RlVHlwZTogJ2hvc3QnLFxuICAgICAgICB0eXBlOiBub2RlLnR5cGUsXG4gICAgICAgIHByb3BzOiB7IC4uLm5vZGUubWVtb2l6ZWRQcm9wcyB9LFxuICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKG5vZGUua2V5KSxcbiAgICAgICAgcmVmOiBub2RlLnJlZixcbiAgICAgICAgaW5zdGFuY2U6IG5vZGUuc3RhdGVOb2RlLFxuICAgICAgICByZW5kZXJlZDogcmVuZGVyZWROb2RlcyxcbiAgICAgIH07XG4gICAgfVxuICAgIGNhc2UgRmliZXJUYWdzLkhvc3RUZXh0OlxuICAgICAgcmV0dXJuIG5vZGUubWVtb2l6ZWRQcm9wcztcbiAgICBjYXNlIEZpYmVyVGFncy5GcmFnbWVudDpcbiAgICBjYXNlIEZpYmVyVGFncy5Nb2RlOlxuICAgIGNhc2UgRmliZXJUYWdzLkNvbnRleHRQcm92aWRlcjpcbiAgICBjYXNlIEZpYmVyVGFncy5Db250ZXh0Q29uc3VtZXI6XG4gICAgICByZXR1cm4gY2hpbGRyZW5Ub1RyZWUobm9kZS5jaGlsZCk7XG4gICAgY2FzZSBGaWJlclRhZ3MuUHJvZmlsZXI6XG4gICAgY2FzZSBGaWJlclRhZ3MuRm9yd2FyZFJlZjoge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZVR5cGU6ICdmdW5jdGlvbicsXG4gICAgICAgIHR5cGU6IG5vZGUudHlwZSxcbiAgICAgICAgcHJvcHM6IHsgLi4ubm9kZS5wZW5kaW5nUHJvcHMgfSxcbiAgICAgICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChub2RlLmtleSksXG4gICAgICAgIHJlZjogbm9kZS5yZWYsXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgICByZW5kZXJlZDogY2hpbGRyZW5Ub1RyZWUobm9kZS5jaGlsZCksXG4gICAgICB9O1xuICAgIH1cbiAgICBjYXNlIEZpYmVyVGFncy5TdXNwZW5zZToge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZVR5cGU6ICdmdW5jdGlvbicsXG4gICAgICAgIHR5cGU6IFN1c3BlbnNlLFxuICAgICAgICBwcm9wczogeyAuLi5ub2RlLm1lbW9pemVkUHJvcHMgfSxcbiAgICAgICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChub2RlLmtleSksXG4gICAgICAgIHJlZjogbm9kZS5yZWYsXG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgICByZW5kZXJlZDogY2hpbGRyZW5Ub1RyZWUobm9kZS5jaGlsZCksXG4gICAgICB9O1xuICAgIH1cbiAgICBjYXNlIEZpYmVyVGFncy5MYXp5OlxuICAgICAgcmV0dXJuIGNoaWxkcmVuVG9UcmVlKG5vZGUuY2hpbGQpO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuenltZSBJbnRlcm5hbCBFcnJvcjogdW5rbm93biBub2RlIHdpdGggdGFnICR7bm9kZS50YWd9YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hpbGRyZW5Ub1RyZWUobm9kZSkge1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBjaGlsZHJlbiA9IG5vZGVBbmRTaWJsaW5nc0FycmF5KG5vZGUpO1xuICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiB0b1RyZWUoY2hpbGRyZW5bMF0pO1xuICB9XG4gIHJldHVybiBmbGF0dGVuKGNoaWxkcmVuLm1hcCh0b1RyZWUpKTtcbn1cblxuZnVuY3Rpb24gbm9kZVRvSG9zdE5vZGUoX25vZGUpIHtcbiAgLy8gTk9URShsbXIpOiBub2RlIGNvdWxkIGJlIGEgZnVuY3Rpb24gY29tcG9uZW50XG4gIC8vIHdoaWNoIHdvbnQgaGF2ZSBhbiBpbnN0YW5jZSBwcm9wLCBidXQgd2UgY2FuIGdldCB0aGVcbiAgLy8gaG9zdCBub2RlIGFzc29jaWF0ZWQgd2l0aCBpdHMgcmV0dXJuIHZhbHVlIGF0IHRoYXQgcG9pbnQuXG4gIC8vIEFsdGhvdWdoIHRoaXMgYnJlYWtzIGRvd24gaWYgdGhlIHJldHVybiB2YWx1ZSBpcyBhbiBhcnJheSxcbiAgLy8gYXMgaXMgcG9zc2libGUgd2l0aCBSZWFjdCAxNi5cbiAgbGV0IG5vZGUgPSBfbm9kZTtcbiAgd2hpbGUgKG5vZGUgJiYgIUFycmF5LmlzQXJyYXkobm9kZSkgJiYgbm9kZS5pbnN0YW5jZSA9PT0gbnVsbCkge1xuICAgIG5vZGUgPSBub2RlLnJlbmRlcmVkO1xuICB9XG4gIC8vIGlmIHRoZSBTRkMgcmV0dXJuZWQgbnVsbCBlZmZlY3RpdmVseSwgdGhlcmUgaXMgbm8gaG9zdCBub2RlLlxuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IG1hcHBlciA9IChpdGVtKSA9PiB7XG4gICAgaWYgKGl0ZW0gJiYgaXRlbS5pbnN0YW5jZSkgcmV0dXJuIFJlYWN0RE9NLmZpbmRET01Ob2RlKGl0ZW0uaW5zdGFuY2UpO1xuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIHJldHVybiBub2RlLm1hcChtYXBwZXIpO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUucmVuZGVyZWQpICYmIG5vZGUubm9kZVR5cGUgPT09ICdjbGFzcycpIHtcbiAgICByZXR1cm4gbm9kZS5yZW5kZXJlZC5tYXAobWFwcGVyKTtcbiAgfVxuICByZXR1cm4gbWFwcGVyKG5vZGUpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlTGF6eVdpdGhGYWxsYmFjayhub2RlLCBmYWxsYmFjaykge1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIHJldHVybiBub2RlLm1hcCgoZWwpID0+IHJlcGxhY2VMYXp5V2l0aEZhbGxiYWNrKGVsLCBmYWxsYmFjaykpO1xuICB9XG4gIGlmIChpc0xhenkobm9kZS50eXBlKSkge1xuICAgIHJldHVybiBmYWxsYmFjaztcbiAgfVxuICByZXR1cm4ge1xuICAgIC4uLm5vZGUsXG4gICAgcHJvcHM6IHtcbiAgICAgIC4uLm5vZGUucHJvcHMsXG4gICAgICBjaGlsZHJlbjogcmVwbGFjZUxhenlXaXRoRmFsbGJhY2sobm9kZS5wcm9wcy5jaGlsZHJlbiwgZmFsbGJhY2spLFxuICAgIH0sXG4gIH07XG59XG5cbmNvbnN0IGV2ZW50T3B0aW9ucyA9IHtcbiAgYW5pbWF0aW9uOiB0cnVlLFxuICBwb2ludGVyRXZlbnRzOiBpczE2NCxcbiAgYXV4Q2xpY2s6IGlzMTY1LFxufTtcblxuZnVuY3Rpb24gZ2V0RW1wdHlTdGF0ZVZhbHVlKCkge1xuICAvLyB0aGlzIGhhbmRsZXMgYSBidWcgaW4gUmVhY3QgMTYuMCAtIDE2LjJcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9jb21taXQvMzliZTgzNTY1YzY1ZjljNTIyMTUwZTUyMzc1MTY3NTY4YTJhMTQ1OVxuICAvLyBhbHNvIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvcHVsbC8xMTk2NVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9wcmVmZXItc3RhdGVsZXNzLWZ1bmN0aW9uXG4gIGNsYXNzIEVtcHR5U3RhdGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBjb25zdCB0ZXN0UmVuZGVyZXIgPSBuZXcgU2hhbGxvd1JlbmRlcmVyKCk7XG4gIHRlc3RSZW5kZXJlci5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChFbXB0eVN0YXRlKSk7XG4gIHJldHVybiB0ZXN0UmVuZGVyZXIuX2luc3RhbmNlLnN0YXRlO1xufVxuXG5mdW5jdGlvbiB3cmFwQWN0KGZuKSB7XG4gIGlmICghaXMxNjgpIHtcbiAgICByZXR1cm4gZm4oKTtcbiAgfVxuICBsZXQgcmV0dXJuVmFsO1xuICBUZXN0VXRpbHMuYWN0KCgpID0+IHsgcmV0dXJuVmFsID0gZm4oKTsgfSk7XG4gIHJldHVybiByZXR1cm5WYWw7XG59XG5cbmZ1bmN0aW9uIGdldFByb3ZpZGVyRGVmYXVsdFZhbHVlKFByb3ZpZGVyKSB7XG4gIC8vIFJlYWN0IHN0b3JlcyByZWZlcmVuY2VzIHRvIHRoZSBQcm92aWRlcidzIGRlZmF1bHRWYWx1ZSBkaWZmZXJlbnRseSBhY3Jvc3MgdmVyc2lvbnMuXG4gIGlmICgnX2RlZmF1bHRWYWx1ZScgaW4gUHJvdmlkZXIuX2NvbnRleHQpIHtcbiAgICByZXR1cm4gUHJvdmlkZXIuX2NvbnRleHQuX2RlZmF1bHRWYWx1ZTtcbiAgfVxuICBpZiAoJ19jdXJyZW50VmFsdWUnIGluIFByb3ZpZGVyLl9jb250ZXh0KSB7XG4gICAgcmV0dXJuIFByb3ZpZGVyLl9jb250ZXh0Ll9jdXJyZW50VmFsdWU7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdFbnp5bWUgSW50ZXJuYWwgRXJyb3I6IGNhbuKAmXQgZmlndXJlIG91dCBob3cgdG8gZ2V0IFByb3ZpZGVy4oCZcyBkZWZhdWx0IHZhbHVlJyk7XG59XG5cbmZ1bmN0aW9uIG1ha2VGYWtlRWxlbWVudCh0eXBlKSB7XG4gIHJldHVybiB7ICQkdHlwZW9mOiBFbGVtZW50LCB0eXBlIH07XG59XG5cbmZ1bmN0aW9uIGlzU3RhdGVmdWwoQ29tcG9uZW50KSB7XG4gIHJldHVybiBDb21wb25lbnQucHJvdG90eXBlICYmIChcbiAgICBDb21wb25lbnQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnRcbiAgICB8fCBBcnJheS5pc0FycmF5KENvbXBvbmVudC5fX3JlYWN0QXV0b0JpbmRQYWlycykgLy8gZmFsbGJhY2sgZm9yIGNyZWF0ZUNsYXNzIGNvbXBvbmVudHNcbiAgKTtcbn1cblxuY2xhc3MgUmVhY3RTaXh0ZWVuQWRhcHRlciBleHRlbmRzIEVuenltZUFkYXB0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIGNvbnN0IHsgbGlmZWN5Y2xlcyB9ID0gdGhpcy5vcHRpb25zO1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgIGVuYWJsZUNvbXBvbmVudERpZFVwZGF0ZU9uU2V0U3RhdGU6IHRydWUsIC8vIFRPRE86IHJlbW92ZSwgc2VtdmVyLW1ham9yXG4gICAgICBsZWdhY3lDb250ZXh0TW9kZTogJ3BhcmVudCcsXG4gICAgICBsaWZlY3ljbGVzOiB7XG4gICAgICAgIC4uLmxpZmVjeWNsZXMsXG4gICAgICAgIGNvbXBvbmVudERpZFVwZGF0ZToge1xuICAgICAgICAgIG9uU2V0U3RhdGU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wczoge1xuICAgICAgICAgIGhhc1Nob3VsZENvbXBvbmVudFVwZGF0ZUJ1ZyxcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0U25hcHNob3RCZWZvcmVVcGRhdGU6IHRydWUsXG4gICAgICAgIHNldFN0YXRlOiB7XG4gICAgICAgICAgc2tpcHNDb21wb25lbnREaWRVcGRhdGVPbk51bGxpc2g6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIGdldENoaWxkQ29udGV4dDoge1xuICAgICAgICAgIGNhbGxlZEJ5UmVuZGVyZXI6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBnZXREZXJpdmVkU3RhdGVGcm9tRXJyb3I6IGlzMTY2LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlTW91bnRSZW5kZXJlcihvcHRpb25zKSB7XG4gICAgYXNzZXJ0RG9tQXZhaWxhYmxlKCdtb3VudCcpO1xuICAgIGlmIChoYXMob3B0aW9ucywgJ3N1c3BlbnNlRmFsbGJhY2snKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYHN1c3BlbnNlRmFsbGJhY2tgIGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBtb3VudGAgcmVuZGVyZXInKTtcbiAgICB9XG4gICAgaWYgKEZpYmVyVGFncyA9PT0gbnVsbCkge1xuICAgICAgLy8gUmVxdWlyZXMgRE9NLlxuICAgICAgRmliZXJUYWdzID0gZGV0ZWN0RmliZXJUYWdzKCk7XG4gICAgfVxuICAgIGNvbnN0IHsgYXR0YWNoVG8sIGh5ZHJhdGVJbiwgd3JhcHBpbmdDb21wb25lbnRQcm9wcyB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBkb21Ob2RlID0gaHlkcmF0ZUluIHx8IGF0dGFjaFRvIHx8IGdsb2JhbC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsZXQgaW5zdGFuY2UgPSBudWxsO1xuICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzO1xuICAgIHJldHVybiB7XG4gICAgICByZW5kZXIoZWwsIGNvbnRleHQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB3cmFwQWN0KCgpID0+IHtcbiAgICAgICAgICBpZiAoaW5zdGFuY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgcHJvcHMsIHJlZiB9ID0gZWw7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVyUHJvcHMgPSB7XG4gICAgICAgICAgICAgIENvbXBvbmVudDogdHlwZSxcbiAgICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgICAgIHdyYXBwaW5nQ29tcG9uZW50UHJvcHMsXG4gICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgIC4uLihyZWYgJiYgeyByZWZQcm9wOiByZWYgfSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgUmVhY3RXcmFwcGVyQ29tcG9uZW50ID0gY3JlYXRlTW91bnRXcmFwcGVyKGVsLCB7IC4uLm9wdGlvbnMsIGFkYXB0ZXIgfSk7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVkRWwgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0V3JhcHBlckNvbXBvbmVudCwgd3JhcHBlclByb3BzKTtcbiAgICAgICAgICAgIGluc3RhbmNlID0gaHlkcmF0ZUluXG4gICAgICAgICAgICAgID8gUmVhY3RET00uaHlkcmF0ZSh3cmFwcGVkRWwsIGRvbU5vZGUpXG4gICAgICAgICAgICAgIDogUmVhY3RET00ucmVuZGVyKHdyYXBwZWRFbCwgZG9tTm9kZSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnNldENoaWxkUHJvcHMoZWwucHJvcHMsIGNvbnRleHQsIGNhbGxiYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVubW91bnQoKSB7XG4gICAgICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUoZG9tTm9kZSk7XG4gICAgICAgIGluc3RhbmNlID0gbnVsbDtcbiAgICAgIH0sXG4gICAgICBnZXROb2RlKCkge1xuICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdldE5vZGVGcm9tUm9vdEZpbmRlcihcbiAgICAgICAgICBhZGFwdGVyLmlzQ3VzdG9tQ29tcG9uZW50LFxuICAgICAgICAgIHRvVHJlZShpbnN0YW5jZS5fcmVhY3RJbnRlcm5hbEZpYmVyKSxcbiAgICAgICAgICBvcHRpb25zLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIHNpbXVsYXRlRXJyb3Iobm9kZUhpZXJhcmNoeSwgcm9vdE5vZGUsIGVycm9yKSB7XG4gICAgICAgIGNvbnN0IGlzRXJyb3JCb3VuZGFyeSA9ICh7IGluc3RhbmNlOiBlbEluc3RhbmNlLCB0eXBlIH0pID0+IHtcbiAgICAgICAgICBpZiAoaXMxNjYgJiYgdHlwZSAmJiB0eXBlLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlbEluc3RhbmNlICYmIGVsSW5zdGFuY2UuY29tcG9uZW50RGlkQ2F0Y2g7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGluc3RhbmNlOiBjYXRjaGluZ0luc3RhbmNlLFxuICAgICAgICAgIHR5cGU6IGNhdGNoaW5nVHlwZSxcbiAgICAgICAgfSA9IG5vZGVIaWVyYXJjaHkuZmluZChpc0Vycm9yQm91bmRhcnkpIHx8IHt9O1xuXG4gICAgICAgIHNpbXVsYXRlRXJyb3IoXG4gICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgY2F0Y2hpbmdJbnN0YW5jZSxcbiAgICAgICAgICByb290Tm9kZSxcbiAgICAgICAgICBub2RlSGllcmFyY2h5LFxuICAgICAgICAgIG5vZGVUeXBlRnJvbVR5cGUsXG4gICAgICAgICAgYWRhcHRlci5kaXNwbGF5TmFtZU9mTm9kZSxcbiAgICAgICAgICBpczE2NiA/IGNhdGNoaW5nVHlwZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBzaW11bGF0ZUV2ZW50KG5vZGUsIGV2ZW50LCBtb2NrKSB7XG4gICAgICAgIGNvbnN0IG1hcHBlZEV2ZW50ID0gbWFwTmF0aXZlRXZlbnROYW1lcyhldmVudCwgZXZlbnRPcHRpb25zKTtcbiAgICAgICAgY29uc3QgZXZlbnRGbiA9IFRlc3RVdGlscy5TaW11bGF0ZVttYXBwZWRFdmVudF07XG4gICAgICAgIGlmICghZXZlbnRGbikge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFJlYWN0V3JhcHBlcjo6c2ltdWxhdGUoKSBldmVudCAnJHtldmVudH0nIGRvZXMgbm90IGV4aXN0YCk7XG4gICAgICAgIH1cbiAgICAgICAgd3JhcEFjdCgoKSA9PiB7XG4gICAgICAgICAgZXZlbnRGbihhZGFwdGVyLm5vZGVUb0hvc3ROb2RlKG5vZGUpLCBtb2NrKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgYmF0Y2hlZFVwZGF0ZXMoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgIC8vIHJldHVybiBSZWFjdERPTS51bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyhmbik7XG4gICAgICB9LFxuICAgICAgZ2V0V3JhcHBpbmdDb21wb25lbnRSZW5kZXJlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi50aGlzLFxuICAgICAgICAgIC4uLmdldFdyYXBwaW5nQ29tcG9uZW50TW91bnRSZW5kZXJlcih7XG4gICAgICAgICAgICB0b1RyZWU6IChpbnN0KSA9PiB0b1RyZWUoaW5zdC5fcmVhY3RJbnRlcm5hbEZpYmVyKSxcbiAgICAgICAgICAgIGdldE1vdW50V3JhcHBlckluc3RhbmNlOiAoKSA9PiBpbnN0YW5jZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICAuLi4oaXMxNjggJiYgeyB3cmFwSW52b2tlOiB3cmFwQWN0IH0pLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVTaGFsbG93UmVuZGVyZXIob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYWRhcHRlciA9IHRoaXM7XG4gICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgU2hhbGxvd1JlbmRlcmVyKCk7XG5cbiAgICBlbmFibGVFZmZlY3RzKHJlbmRlcmVyKTtcblxuICAgIGNvbnN0IHsgc3VzcGVuc2VGYWxsYmFjayB9ID0gb3B0aW9ucztcbiAgICBpZiAodHlwZW9mIHN1c3BlbnNlRmFsbGJhY2sgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBzdXNwZW5zZUZhbGxiYWNrICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignYG9wdGlvbnMuc3VzcGVuc2VGYWxsYmFja2Agc2hvdWxkIGJlIGJvb2xlYW4gb3IgdW5kZWZpbmVkJyk7XG4gICAgfVxuICAgIGxldCBpc0RPTSA9IGZhbHNlO1xuICAgIGxldCBjYWNoZWROb2RlID0gbnVsbDtcblxuICAgIGxldCBsYXN0Q29tcG9uZW50ID0gbnVsbDtcbiAgICBsZXQgd3JhcHBlZENvbXBvbmVudCA9IG51bGw7XG4gICAgY29uc3Qgc2VudGluZWwgPSB7fTtcblxuICAgIC8vIHdyYXAgbWVtbyBjb21wb25lbnRzIHdpdGggYSBQdXJlQ29tcG9uZW50LCBvciBhIGNsYXNzIGNvbXBvbmVudCB3aXRoIHNDVVxuICAgIGNvbnN0IHdyYXBQdXJlQ29tcG9uZW50ID0gKENvbXBvbmVudCwgY29tcGFyZSkgPT4ge1xuICAgICAgaWYgKCFpczE2Nikge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGhpcyBmdW5jdGlvbiBzaG91bGQgbm90IGJlIGNhbGxlZCBpbiBSZWFjdCA8IDE2LjYuIFBsZWFzZSByZXBvcnQgdGhpcyEnKTtcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0Q29tcG9uZW50ICE9PSBDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGlzU3RhdGVmdWwoQ29tcG9uZW50KSkge1xuICAgICAgICAgIHdyYXBwZWRDb21wb25lbnQgPSBjbGFzcyBleHRlbmRzIENvbXBvbmVudCB7fTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSByZWFjdC9wcmVmZXItc3RhdGVsZXNzLWZ1bmN0aW9uXG4gICAgICAgICAgaWYgKGNvbXBhcmUpIHtcbiAgICAgICAgICAgIHdyYXBwZWRDb21wb25lbnQucHJvdG90eXBlLnNob3VsZENvbXBvbmVudFVwZGF0ZSA9IChuZXh0UHJvcHMpID0+ICFjb21wYXJlKHRoaXMucHJvcHMsIG5leHRQcm9wcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdyYXBwZWRDb21wb25lbnQucHJvdG90eXBlLmlzUHVyZVJlYWN0Q29tcG9uZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IG1lbW9pemVkID0gc2VudGluZWw7XG4gICAgICAgICAgbGV0IHByZXZQcm9wcztcbiAgICAgICAgICB3cmFwcGVkQ29tcG9uZW50ID0gZnVuY3Rpb24gKHByb3BzLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRVcGRhdGUgPSBtZW1vaXplZCA9PT0gc2VudGluZWwgfHwgKGNvbXBhcmVcbiAgICAgICAgICAgICAgPyAhY29tcGFyZShwcmV2UHJvcHMsIHByb3BzKVxuICAgICAgICAgICAgICA6ICFzaGFsbG93RXF1YWwocHJldlByb3BzLCBwcm9wcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoc2hvdWxkVXBkYXRlKSB7XG4gICAgICAgICAgICAgIG1lbW9pemVkID0gQ29tcG9uZW50KHsgLi4uQ29tcG9uZW50LmRlZmF1bHRQcm9wcywgLi4ucHJvcHMgfSwgLi4uYXJncyk7XG4gICAgICAgICAgICAgIHByZXZQcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lbW9pemVkO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICB3cmFwcGVkQ29tcG9uZW50LFxuICAgICAgICAgIENvbXBvbmVudCxcbiAgICAgICAgICB7IGRpc3BsYXlOYW1lOiBhZGFwdGVyLmRpc3BsYXlOYW1lT2ZOb2RlKHsgdHlwZTogQ29tcG9uZW50IH0pIH0sXG4gICAgICAgICk7XG4gICAgICAgIGxhc3RDb21wb25lbnQgPSBDb21wb25lbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gd3JhcHBlZENvbXBvbmVudDtcbiAgICB9O1xuXG4gICAgLy8gV3JhcCBmdW5jdGlvbmFsIGNvbXBvbmVudHMgb24gdmVyc2lvbnMgcHJpb3IgdG8gMTYuNSxcbiAgICAvLyB0byBhdm9pZCBpbmFkdmVydGVudGx5IHBhc3MgYSBgdGhpc2AgaW5zdGFuY2UgdG8gaXQuXG4gICAgY29uc3Qgd3JhcEZ1bmN0aW9uYWxDb21wb25lbnQgPSAoQ29tcG9uZW50KSA9PiB7XG4gICAgICBpZiAoaXMxNjYgJiYgaGFzKENvbXBvbmVudCwgJ2RlZmF1bHRQcm9wcycpKSB7XG4gICAgICAgIGlmIChsYXN0Q29tcG9uZW50ICE9PSBDb21wb25lbnQpIHtcbiAgICAgICAgICB3cmFwcGVkQ29tcG9uZW50ID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG4gICAgICAgICAgICAocHJvcHMsIC4uLmFyZ3MpID0+IENvbXBvbmVudCh7IC4uLkNvbXBvbmVudC5kZWZhdWx0UHJvcHMsIC4uLnByb3BzIH0sIC4uLmFyZ3MpLFxuICAgICAgICAgICAgQ29tcG9uZW50LFxuICAgICAgICAgICAgeyBkaXNwbGF5TmFtZTogYWRhcHRlci5kaXNwbGF5TmFtZU9mTm9kZSh7IHR5cGU6IENvbXBvbmVudCB9KSB9LFxuICAgICAgICAgICk7XG4gICAgICAgICAgbGFzdENvbXBvbmVudCA9IENvbXBvbmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd3JhcHBlZENvbXBvbmVudDtcbiAgICAgIH1cbiAgICAgIGlmIChpczE2NSkge1xuICAgICAgICByZXR1cm4gQ29tcG9uZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAobGFzdENvbXBvbmVudCAhPT0gQ29tcG9uZW50KSB7XG4gICAgICAgIHdyYXBwZWRDb21wb25lbnQgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICguLi5hcmdzKSA9PiBDb21wb25lbnQoLi4uYXJncyksIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbmV3LWNhcFxuICAgICAgICAgIENvbXBvbmVudCxcbiAgICAgICAgKTtcbiAgICAgICAgbGFzdENvbXBvbmVudCA9IENvbXBvbmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB3cmFwcGVkQ29tcG9uZW50O1xuICAgIH07XG5cbiAgICBjb25zdCByZW5kZXJFbGVtZW50ID0gKGVsQ29uZmlnLCAuLi5yZXN0KSA9PiB7XG4gICAgICBjb25zdCByZW5kZXJlZEVsID0gcmVuZGVyZXIucmVuZGVyKGVsQ29uZmlnLCAuLi5yZXN0KTtcblxuICAgICAgY29uc3QgdHlwZUlzRXhpc3RlZCA9ICEhKHJlbmRlcmVkRWwgJiYgcmVuZGVyZWRFbC50eXBlKTtcbiAgICAgIGlmIChpczE2NiAmJiB0eXBlSXNFeGlzdGVkKSB7XG4gICAgICAgIGNvbnN0IGNsb25lZEVsID0gY2hlY2tJc1N1c3BlbnNlQW5kQ2xvbmVFbGVtZW50KHJlbmRlcmVkRWwsIHsgc3VzcGVuc2VGYWxsYmFjayB9KTtcblxuICAgICAgICBjb25zdCBlbGVtZW50SXNDaGFuZ2VkID0gY2xvbmVkRWwudHlwZSAhPT0gcmVuZGVyZWRFbC50eXBlO1xuICAgICAgICBpZiAoZWxlbWVudElzQ2hhbmdlZCkge1xuICAgICAgICAgIHJldHVybiByZW5kZXJlci5yZW5kZXIoeyAuLi5lbENvbmZpZywgdHlwZTogY2xvbmVkRWwudHlwZSB9LCAuLi5yZXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVuZGVyZWRFbDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlbmRlcihlbCwgdW5tYXNrZWRDb250ZXh0LCB7XG4gICAgICAgIHByb3ZpZGVyVmFsdWVzID0gbmV3IE1hcCgpLFxuICAgICAgfSA9IHt9KSB7XG4gICAgICAgIGNhY2hlZE5vZGUgPSBlbDtcbiAgICAgICAgLyogZXNsaW50IGNvbnNpc3RlbnQtcmV0dXJuOiAwICovXG4gICAgICAgIGlmICh0eXBlb2YgZWwudHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpc0RPTSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNDb250ZXh0UHJvdmlkZXIoZWwpKSB7XG4gICAgICAgICAgcHJvdmlkZXJWYWx1ZXMuc2V0KGVsLnR5cGUsIGVsLnByb3BzLnZhbHVlKTtcbiAgICAgICAgICBjb25zdCBNb2NrUHJvdmlkZXIgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgKHByb3BzKSA9PiBwcm9wcy5jaGlsZHJlbixcbiAgICAgICAgICAgIGVsLnR5cGUsXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gd2l0aFNldFN0YXRlQWxsb3dlZCgoKSA9PiByZW5kZXJFbGVtZW50KHsgLi4uZWwsIHR5cGU6IE1vY2tQcm92aWRlciB9KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNDb250ZXh0Q29uc3VtZXIoZWwpKSB7XG4gICAgICAgICAgY29uc3QgUHJvdmlkZXIgPSBhZGFwdGVyLmdldFByb3ZpZGVyRnJvbUNvbnN1bWVyKGVsLnR5cGUpO1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gcHJvdmlkZXJWYWx1ZXMuaGFzKFByb3ZpZGVyKVxuICAgICAgICAgICAgPyBwcm92aWRlclZhbHVlcy5nZXQoUHJvdmlkZXIpXG4gICAgICAgICAgICA6IGdldFByb3ZpZGVyRGVmYXVsdFZhbHVlKFByb3ZpZGVyKTtcbiAgICAgICAgICBjb25zdCBNb2NrQ29uc3VtZXIgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgKHByb3BzKSA9PiBwcm9wcy5jaGlsZHJlbih2YWx1ZSksXG4gICAgICAgICAgICBlbC50eXBlLFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHdpdGhTZXRTdGF0ZUFsbG93ZWQoKCkgPT4gcmVuZGVyRWxlbWVudCh7IC4uLmVsLCB0eXBlOiBNb2NrQ29uc3VtZXIgfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzRE9NID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHJlbmRlcmVkRWwgPSBlbDtcbiAgICAgICAgICBpZiAoaXNMYXp5KHJlbmRlcmVkRWwpKSB7XG4gICAgICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ2BSZWFjdC5sYXp5YCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHNoYWxsb3cgcmVuZGVyaW5nLicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlbmRlcmVkRWwgPSBjaGVja0lzU3VzcGVuc2VBbmRDbG9uZUVsZW1lbnQocmVuZGVyZWRFbCwgeyBzdXNwZW5zZUZhbGxiYWNrIH0pO1xuICAgICAgICAgIGNvbnN0IHsgdHlwZTogQ29tcG9uZW50IH0gPSByZW5kZXJlZEVsO1xuXG4gICAgICAgICAgY29uc3QgY29udGV4dCA9IGdldE1hc2tlZENvbnRleHQoQ29tcG9uZW50LmNvbnRleHRUeXBlcywgdW5tYXNrZWRDb250ZXh0KTtcblxuICAgICAgICAgIGlmIChpc01lbW8oZWwudHlwZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZTogSW5uZXJDb21wLCBjb21wYXJlIH0gPSBlbC50eXBlO1xuXG4gICAgICAgICAgICByZXR1cm4gd2l0aFNldFN0YXRlQWxsb3dlZCgoKSA9PiByZW5kZXJFbGVtZW50KFxuICAgICAgICAgICAgICB7IC4uLmVsLCB0eXBlOiB3cmFwUHVyZUNvbXBvbmVudChJbm5lckNvbXAsIGNvbXBhcmUpIH0sXG4gICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWlzU3RhdGVmdWwoQ29tcG9uZW50KSAmJiB0eXBlb2YgQ29tcG9uZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gd2l0aFNldFN0YXRlQWxsb3dlZCgoKSA9PiByZW5kZXJFbGVtZW50KFxuICAgICAgICAgICAgICB7IC4uLnJlbmRlcmVkRWwsIHR5cGU6IHdyYXBGdW5jdGlvbmFsQ29tcG9uZW50KENvbXBvbmVudCkgfSxcbiAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc1N0YXRlZnVsKSB7XG4gICAgICAgICAgICAvLyBmaXggcmVhY3QgYnVnOyBzZWUgaW1wbGVtZW50YXRpb24gb2YgYGdldEVtcHR5U3RhdGVWYWx1ZWBcbiAgICAgICAgICAgIGNvbnN0IGVtcHR5U3RhdGVWYWx1ZSA9IGdldEVtcHR5U3RhdGVWYWx1ZSgpO1xuICAgICAgICAgICAgaWYgKGVtcHR5U3RhdGVWYWx1ZSkge1xuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29tcG9uZW50LnByb3RvdHlwZSwgJ3N0YXRlJywge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IGVtcHR5U3RhdGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3N0YXRlJywge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gd2l0aFNldFN0YXRlQWxsb3dlZCgoKSA9PiByZW5kZXJFbGVtZW50KHJlbmRlcmVkRWwsIGNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVubW91bnQoKSB7XG4gICAgICAgIHJlbmRlcmVyLl9kaXNwYXRjaGVyLmNsZWFudXBFZmZlY3RzKCk7XG4gICAgICAgIHJlbmRlcmVyLnVubW91bnQoKTtcbiAgICAgIH0sXG4gICAgICBnZXROb2RlKCkge1xuICAgICAgICBpZiAoaXNET00pIHtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudFRvVHJlZShjYWNoZWROb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvdXRwdXQgPSByZW5kZXJlci5nZXRSZW5kZXJPdXRwdXQoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBub2RlVHlwZTogbm9kZVR5cGVGcm9tVHlwZShjYWNoZWROb2RlLnR5cGUpLFxuICAgICAgICAgIHR5cGU6IGNhY2hlZE5vZGUudHlwZSxcbiAgICAgICAgICBwcm9wczogY2FjaGVkTm9kZS5wcm9wcyxcbiAgICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKGNhY2hlZE5vZGUua2V5KSxcbiAgICAgICAgICByZWY6IGNhY2hlZE5vZGUucmVmLFxuICAgICAgICAgIGluc3RhbmNlOiByZW5kZXJlci5faW5zdGFuY2UsXG4gICAgICAgICAgcmVuZGVyZWQ6IEFycmF5LmlzQXJyYXkob3V0cHV0KVxuICAgICAgICAgICAgPyBmbGF0dGVuKG91dHB1dCkubWFwKChlbCkgPT4gZWxlbWVudFRvVHJlZShlbCkpXG4gICAgICAgICAgICA6IGVsZW1lbnRUb1RyZWUob3V0cHV0KSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzaW11bGF0ZUVycm9yKG5vZGVIaWVyYXJjaHksIHJvb3ROb2RlLCBlcnJvcikge1xuICAgICAgICBzaW11bGF0ZUVycm9yKFxuICAgICAgICAgIGVycm9yLFxuICAgICAgICAgIHJlbmRlcmVyLl9pbnN0YW5jZSxcbiAgICAgICAgICBjYWNoZWROb2RlLFxuICAgICAgICAgIG5vZGVIaWVyYXJjaHkuY29uY2F0KGNhY2hlZE5vZGUpLFxuICAgICAgICAgIG5vZGVUeXBlRnJvbVR5cGUsXG4gICAgICAgICAgYWRhcHRlci5kaXNwbGF5TmFtZU9mTm9kZSxcbiAgICAgICAgICBpczE2NiA/IGNhY2hlZE5vZGUudHlwZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBzaW11bGF0ZUV2ZW50KG5vZGUsIGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBub2RlLnByb3BzW3Byb3BGcm9tRXZlbnQoZXZlbnQsIGV2ZW50T3B0aW9ucyldO1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgIHdpdGhTZXRTdGF0ZUFsbG93ZWQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETyhsbXIpOiBjcmVhdGUvdXNlIHN5bnRoZXRpYyBldmVudHNcbiAgICAgICAgICAgIC8vIFRPRE8obG1yKTogZW11bGF0ZSBSZWFjdCdzIGV2ZW50IHByb3BhZ2F0aW9uXG4gICAgICAgICAgICAvLyBSZWFjdERPTS51bnN0YWJsZV9iYXRjaGVkVXBkYXRlcygoKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBiYXRjaGVkVXBkYXRlcyhmbikge1xuICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgICAgLy8gcmV0dXJuIFJlYWN0RE9NLnVuc3RhYmxlX2JhdGNoZWRVcGRhdGVzKGZuKTtcbiAgICAgIH0sXG4gICAgICBjaGVja1Byb3BUeXBlcyh0eXBlU3BlY3MsIHZhbHVlcywgbG9jYXRpb24sIGhpZXJhcmNoeSkge1xuICAgICAgICByZXR1cm4gY2hlY2tQcm9wVHlwZXMoXG4gICAgICAgICAgdHlwZVNwZWNzLFxuICAgICAgICAgIHZhbHVlcyxcbiAgICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgICBkaXNwbGF5TmFtZU9mTm9kZShjYWNoZWROb2RlKSxcbiAgICAgICAgICAoKSA9PiBnZXRDb21wb25lbnRTdGFjayhoaWVyYXJjaHkuY29uY2F0KFtjYWNoZWROb2RlXSkpLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlU3RyaW5nUmVuZGVyZXIob3B0aW9ucykge1xuICAgIGlmIChoYXMob3B0aW9ucywgJ3N1c3BlbnNlRmFsbGJhY2snKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYHN1c3BlbnNlRmFsbGJhY2tgIHNob3VsZCBub3QgYmUgc3BlY2lmaWVkIGluIG9wdGlvbnMgb2Ygc3RyaW5nIHJlbmRlcmVyJyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICByZW5kZXIoZWwsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuY29udGV4dCAmJiAoZWwudHlwZS5jb250ZXh0VHlwZXMgfHwgb3B0aW9ucy5jaGlsZENvbnRleHRUeXBlcykpIHtcbiAgICAgICAgICBjb25zdCBjaGlsZENvbnRleHRUeXBlcyA9IHtcbiAgICAgICAgICAgIC4uLihlbC50eXBlLmNvbnRleHRUeXBlcyB8fCB7fSksXG4gICAgICAgICAgICAuLi5vcHRpb25zLmNoaWxkQ29udGV4dFR5cGVzLFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3QgQ29udGV4dFdyYXBwZXIgPSBjcmVhdGVSZW5kZXJXcmFwcGVyKGVsLCBjb250ZXh0LCBjaGlsZENvbnRleHRUeXBlcyk7XG4gICAgICAgICAgcmV0dXJuIFJlYWN0RE9NU2VydmVyLnJlbmRlclRvU3RhdGljTWFya3VwKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29udGV4dFdyYXBwZXIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUmVhY3RET01TZXJ2ZXIucmVuZGVyVG9TdGF0aWNNYXJrdXAoZWwpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLy8gUHJvdmlkZWQgYSBiYWcgb2Ygb3B0aW9ucywgcmV0dXJuIGFuIGBFbnp5bWVSZW5kZXJlcmAuIFNvbWUgb3B0aW9ucyBjYW4gYmUgaW1wbGVtZW50YXRpb25cbiAgLy8gc3BlY2lmaWMsIGxpa2UgYGF0dGFjaGAgZXRjLiBmb3IgUmVhY3QsIGJ1dCBub3QgcGFydCBvZiB0aGlzIGludGVyZmFjZSBleHBsaWNpdGx5LlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2xhc3MtbWV0aG9kcy11c2UtdGhpc1xuICBjcmVhdGVSZW5kZXJlcihvcHRpb25zKSB7XG4gICAgc3dpdGNoIChvcHRpb25zLm1vZGUpIHtcbiAgICAgIGNhc2UgRW56eW1lQWRhcHRlci5NT0RFUy5NT1VOVDogcmV0dXJuIHRoaXMuY3JlYXRlTW91bnRSZW5kZXJlcihvcHRpb25zKTtcbiAgICAgIGNhc2UgRW56eW1lQWRhcHRlci5NT0RFUy5TSEFMTE9XOiByZXR1cm4gdGhpcy5jcmVhdGVTaGFsbG93UmVuZGVyZXIob3B0aW9ucyk7XG4gICAgICBjYXNlIEVuenltZUFkYXB0ZXIuTU9ERVMuU1RSSU5HOiByZXR1cm4gdGhpcy5jcmVhdGVTdHJpbmdSZW5kZXJlcihvcHRpb25zKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRW56eW1lIEludGVybmFsIEVycm9yOiBVbnJlY29nbml6ZWQgbW9kZTogJHtvcHRpb25zLm1vZGV9YCk7XG4gICAgfVxuICB9XG5cbiAgd3JhcChlbGVtZW50KSB7XG4gICAgcmV0dXJuIHdyYXAoZWxlbWVudCk7XG4gIH1cblxuICAvLyBjb252ZXJ0cyBhbiBSU1ROb2RlIHRvIHRoZSBjb3JyZXNwb25kaW5nIEpTWCBQcmFnbWEgRWxlbWVudC4gVGhpcyB3aWxsIGJlIG5lZWRlZFxuICAvLyBpbiBvcmRlciB0byBpbXBsZW1lbnQgdGhlIGBXcmFwcGVyLm1vdW50KClgIGFuZCBgV3JhcHBlci5zaGFsbG93KClgIG1ldGhvZHMsIGJ1dCBzaG91bGRcbiAgLy8gYmUgcHJldHR5IHN0cmFpZ2h0Zm9yd2FyZCBmb3IgcGVvcGxlIHRvIGltcGxlbWVudC5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgbm9kZVRvRWxlbWVudChub2RlKSB7XG4gICAgaWYgKCFub2RlIHx8IHR5cGVvZiBub2RlICE9PSAnb2JqZWN0JykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgeyB0eXBlIH0gPSBub2RlO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KHVubWVtb1R5cGUodHlwZSksIHByb3BzV2l0aEtleXNBbmRSZWYobm9kZSkpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgbWF0Y2hlc0VsZW1lbnRUeXBlKG5vZGUsIG1hdGNoaW5nVHlwZSkge1xuICAgIGlmICghbm9kZSkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGNvbnN0IHsgdHlwZSB9ID0gbm9kZTtcbiAgICByZXR1cm4gdW5tZW1vVHlwZSh0eXBlKSA9PT0gdW5tZW1vVHlwZShtYXRjaGluZ1R5cGUpO1xuICB9XG5cbiAgZWxlbWVudFRvTm9kZShlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnRUb1RyZWUoZWxlbWVudCk7XG4gIH1cblxuICBub2RlVG9Ib3N0Tm9kZShub2RlLCBzdXBwb3J0c0FycmF5ID0gZmFsc2UpIHtcbiAgICBjb25zdCBub2RlcyA9IG5vZGVUb0hvc3ROb2RlKG5vZGUpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGVzKSAmJiAhc3VwcG9ydHNBcnJheSkge1xuICAgICAgcmV0dXJuIG5vZGVzWzBdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZXM7XG4gIH1cblxuICBkaXNwbGF5TmFtZU9mTm9kZShub2RlKSB7XG4gICAgaWYgKCFub2RlKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCB7IHR5cGUsICQkdHlwZW9mIH0gPSBub2RlO1xuXG4gICAgY29uc3Qgbm9kZVR5cGUgPSB0eXBlIHx8ICQkdHlwZW9mO1xuXG4gICAgLy8gbmV3ZXIgbm9kZSB0eXBlcyBtYXkgYmUgdW5kZWZpbmVkLCBzbyBvbmx5IHRlc3QgaWYgdGhlIG5vZGVUeXBlIGV4aXN0c1xuICAgIGlmIChub2RlVHlwZSkge1xuICAgICAgc3dpdGNoIChub2RlVHlwZSkge1xuICAgICAgICBjYXNlIChpczE2NiA/IENvbmN1cnJlbnRNb2RlIDogQXN5bmNNb2RlKSB8fCBOYU46IHJldHVybiBpczE2NiA/ICdDb25jdXJyZW50TW9kZScgOiAnQXN5bmNNb2RlJztcbiAgICAgICAgY2FzZSBGcmFnbWVudCB8fCBOYU46IHJldHVybiAnRnJhZ21lbnQnO1xuICAgICAgICBjYXNlIFN0cmljdE1vZGUgfHwgTmFOOiByZXR1cm4gJ1N0cmljdE1vZGUnO1xuICAgICAgICBjYXNlIFByb2ZpbGVyIHx8IE5hTjogcmV0dXJuICdQcm9maWxlcic7XG4gICAgICAgIGNhc2UgUG9ydGFsIHx8IE5hTjogcmV0dXJuICdQb3J0YWwnO1xuICAgICAgICBjYXNlIFN1c3BlbnNlIHx8IE5hTjogcmV0dXJuICdTdXNwZW5zZSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuXG4gICAgc3dpdGNoICgkJHR5cGVvZlR5cGUpIHtcbiAgICAgIGNhc2UgQ29udGV4dENvbnN1bWVyIHx8IE5hTjogcmV0dXJuICdDb250ZXh0Q29uc3VtZXInO1xuICAgICAgY2FzZSBDb250ZXh0UHJvdmlkZXIgfHwgTmFOOiByZXR1cm4gJ0NvbnRleHRQcm92aWRlcic7XG4gICAgICBjYXNlIE1lbW8gfHwgTmFOOiB7XG4gICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZGlzcGxheU5hbWVPZk5vZGUobm9kZSk7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygbm9kZU5hbWUgPT09ICdzdHJpbmcnID8gbm9kZU5hbWUgOiBgTWVtbygke2Rpc3BsYXlOYW1lT2ZOb2RlKHR5cGUpfSlgO1xuICAgICAgfVxuICAgICAgY2FzZSBGb3J3YXJkUmVmIHx8IE5hTjoge1xuICAgICAgICBpZiAodHlwZS5kaXNwbGF5TmFtZSkge1xuICAgICAgICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSBkaXNwbGF5TmFtZU9mTm9kZSh7IHR5cGU6IHR5cGUucmVuZGVyIH0pO1xuICAgICAgICByZXR1cm4gbmFtZSA/IGBGb3J3YXJkUmVmKCR7bmFtZX0pYCA6ICdGb3J3YXJkUmVmJztcbiAgICAgIH1cbiAgICAgIGNhc2UgTGF6eSB8fCBOYU46IHtcbiAgICAgICAgcmV0dXJuICdsYXp5JztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHJldHVybiBkaXNwbGF5TmFtZU9mTm9kZShub2RlKTtcbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkRWxlbWVudChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGlzRWxlbWVudChlbGVtZW50KTtcbiAgfVxuXG4gIGlzVmFsaWRFbGVtZW50VHlwZShvYmplY3QpIHtcbiAgICByZXR1cm4gISFvYmplY3QgJiYgaXNWYWxpZEVsZW1lbnRUeXBlKG9iamVjdCk7XG4gIH1cblxuICBpc0ZyYWdtZW50KGZyYWdtZW50KSB7XG4gICAgcmV0dXJuIHR5cGVPZk5vZGUoZnJhZ21lbnQpID09PSBGcmFnbWVudDtcbiAgfVxuXG4gIGlzQ3VzdG9tQ29tcG9uZW50KHR5cGUpIHtcbiAgICBjb25zdCBmYWtlRWxlbWVudCA9IG1ha2VGYWtlRWxlbWVudCh0eXBlKTtcbiAgICByZXR1cm4gISF0eXBlICYmIChcbiAgICAgIHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nXG4gICAgICB8fCBpc0ZvcndhcmRSZWYoZmFrZUVsZW1lbnQpXG4gICAgICB8fCBpc0NvbnRleHRQcm92aWRlcihmYWtlRWxlbWVudClcbiAgICAgIHx8IGlzQ29udGV4dENvbnN1bWVyKGZha2VFbGVtZW50KVxuICAgICAgfHwgaXNTdXNwZW5zZShmYWtlRWxlbWVudClcbiAgICApO1xuICB9XG5cbiAgaXNDb250ZXh0Q29uc3VtZXIodHlwZSkge1xuICAgIHJldHVybiAhIXR5cGUgJiYgaXNDb250ZXh0Q29uc3VtZXIobWFrZUZha2VFbGVtZW50KHR5cGUpKTtcbiAgfVxuXG4gIGlzQ3VzdG9tQ29tcG9uZW50RWxlbWVudChpbnN0KSB7XG4gICAgaWYgKCFpbnN0IHx8ICF0aGlzLmlzVmFsaWRFbGVtZW50KGluc3QpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmlzQ3VzdG9tQ29tcG9uZW50KGluc3QudHlwZSk7XG4gIH1cblxuICBnZXRQcm92aWRlckZyb21Db25zdW1lcihDb25zdW1lcikge1xuICAgIC8vIFJlYWN0IHN0b3JlcyByZWZlcmVuY2VzIHRvIHRoZSBQcm92aWRlciBvbiBhIENvbnN1bWVyIGRpZmZlcmVudGx5IGFjcm9zcyB2ZXJzaW9ucy5cbiAgICBpZiAoQ29uc3VtZXIpIHtcbiAgICAgIGxldCBQcm92aWRlcjtcbiAgICAgIGlmIChDb25zdW1lci5fY29udGV4dCkgeyAvLyBjaGVjayB0aGlzIGZpcnN0LCB0byBhdm9pZCBhIGRlcHJlY2F0aW9uIHdhcm5pbmdcbiAgICAgICAgKHsgUHJvdmlkZXIgfSA9IENvbnN1bWVyLl9jb250ZXh0KTtcbiAgICAgIH0gZWxzZSBpZiAoQ29uc3VtZXIuUHJvdmlkZXIpIHtcbiAgICAgICAgKHsgUHJvdmlkZXIgfSA9IENvbnN1bWVyKTtcbiAgICAgIH1cbiAgICAgIGlmIChQcm92aWRlcikge1xuICAgICAgICByZXR1cm4gUHJvdmlkZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignRW56eW1lIEludGVybmFsIEVycm9yOiBjYW7igJl0IGZpZ3VyZSBvdXQgaG93IHRvIGdldCBQcm92aWRlciBmcm9tIENvbnN1bWVyJyk7XG4gIH1cblxuICBjcmVhdGVFbGVtZW50KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCguLi5hcmdzKTtcbiAgfVxuXG4gIHdyYXBXaXRoV3JhcHBpbmdDb21wb25lbnQobm9kZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB7XG4gICAgICBSb290RmluZGVyLFxuICAgICAgbm9kZTogd3JhcFdpdGhXcmFwcGluZ0NvbXBvbmVudChSZWFjdC5jcmVhdGVFbGVtZW50LCBub2RlLCBvcHRpb25zKSxcbiAgICB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RTaXh0ZWVuQWRhcHRlcjtcbiJdfQ==
//# sourceMappingURL=ReactSixteenAdapter.js.map