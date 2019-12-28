"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpeechRecognizer = exports.SpeechRecognizerStatus = void 0;

var _react = _interopRequireWildcard(require("react"));

var _speechRecognizer2 = require("./util/speech-recognizer");

var _temp;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_CONFIG = {
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  lang: 'en-NZ'
};
var SpeechRecognizerStatus = {
  INACTIVE: 0,
  RECOGNIZING: 1,
  STOPPED: 2,
  FAILED: 3,
  UNSUPPORTED: 4
};
exports.SpeechRecognizerStatus = SpeechRecognizerStatus;
var SpeechRecognizer = (_temp =
/*#__PURE__*/
function (_Component) {
  _inherits(SpeechRecognizer, _Component);

  function SpeechRecognizer(props) {
    var _this;

    _classCallCheck(this, SpeechRecognizer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpeechRecognizer).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onStart", function (event) {
      _this.setState({
        status: SpeechRecognizerStatus.RECOGNIZING
      }, function () {
        var onStart = _this.props.onStart;

        if (onStart) {
          onStart(event, _this.props, _this.state);
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onResult", function (event) {
      var results = event.results;
      var _this$props = _this.props,
          formatResults = _this$props.formatResults,
          onResult = _this$props.onResult;
      var formattedResults = formatResults ? formatResults(results) : results;
      var transcripts = (0, _speechRecognizer2.extractTranscripts)(results);

      _this.setState({
        results: results,
        formattedResults: formattedResults,
        transcripts: transcripts
      }, function () {
        if (!onResult) {
          return;
        }

        onResult(results, formattedResults, transcripts);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onError", function (error) {
      _this.setState({
        error: error,
        status: SpeechRecognizerStatus.FAILED
      }, function () {
        var onError = _this.props.onError;

        if (onError) {
          onError(error);
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "renderInactiveStatus", function () {
      var renderInactiveStatus = _this.props.renderInactiveStatus;

      if (renderInactiveStatus) {
        return renderInactiveStatus(_this.props, _this.state);
      }

      return _react["default"].createElement("h2", null, "Ready to start...");
    });

    _defineProperty(_assertThisInitialized(_this), "renderRecognizingStatus", function () {
      var renderRecognizingStatus = _this.props.renderRecognizingStatus;

      if (renderRecognizingStatus) {
        return renderRecognizingStatus(_this.props, _this.state);
      }

      return _react["default"].createElement("h2", null, "Recording tags...");
    });

    _defineProperty(_assertThisInitialized(_this), "renderStoppedStatus", function () {
      var renderStoppedStatus = _this.props.renderStoppedStatus;

      if (renderStoppedStatus) {
        return renderStoppedStatus(_this.props, _this.state);
      }

      var transcripts = _this.state.transcripts;

      if (!transcripts.length) {
        return _react["default"].createElement("h2", null, "No transcripts found in speech.");
      }

      return _react["default"].createElement(_react.Fragment, null, _react["default"].createElement("h2", null, "Transcripts from speech:"), _react["default"].createElement("ul", null, transcripts.map(function (transcript, i) {
        return _react["default"].createElement("li", {
          key: "transcript-".concat(i)
        }, transcript);
      })));
    });

    _defineProperty(_assertThisInitialized(_this), "verifyStatus", function () {
      var status = _this.state.status;

      if (status === SpeechRecognizerStatus.FAILED) {
        return;
      }

      var startSpeechRecognition = _this.props.startSpeechRecognition;
      var speechRecognizer = _this.state.speechRecognizer;

      if (startSpeechRecognition && status !== SpeechRecognizerStatus.RECOGNIZING) {
        speechRecognizer.start();
        return;
      }

      if (!startSpeechRecognition && status === SpeechRecognizerStatus.RECOGNIZING) {
        speechRecognizer.stop();

        _this.setState({
          status: SpeechRecognizerStatus.STOPPED
        });
      }
    });

    var grammars = props.grammars,
        continuous = props.continuous,
        interimResults = props.interimResults,
        maxAlternatives = props.maxAlternatives,
        lang = props.lang;
    _this.state = {
      status: SpeechRecognizerStatus.INACTIVE,
      results: null,
      formattedResults: null,
      transcripts: [],
      error: null
    }; // @ts-ignore -- For now...

    var speechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;

    if (!speechRecognitionConstructor) {
      _this.state.status = SpeechRecognizerStatus.UNSUPPORTED;
      return _possibleConstructorReturn(_this);
    }

    var _speechRecognizer = new speechRecognitionConstructor();

    if (grammars) {
      // @ts-ignore -- For now...
      var speechGrammarListConstructor = window.SpeechGrammarList || window.webkitSpeechGrammarList;
      var speechGrammarList = new speechGrammarListConstructor();
      speechGrammarList.addFromString(grammars, 10000000);
      _speechRecognizer.grammars = speechGrammarList;
    }

    _speechRecognizer.continuous = continuous || DEFAULT_CONFIG.continuous;
    _speechRecognizer.interimResults = interimResults || DEFAULT_CONFIG.interimResults;
    _speechRecognizer.maxAlternatives = maxAlternatives || DEFAULT_CONFIG.maxAlternatives;
    _speechRecognizer.lang = lang || DEFAULT_CONFIG;

    _speechRecognizer.onstart = function (event) {
      return _this.onStart(event);
    };

    _speechRecognizer.onresult = function (event) {
      return _this.onResult(event);
    };

    _speechRecognizer.onerror = function (error) {
      return _this.onError(error);
    };

    _this.state.speechRecognizer = _speechRecognizer;
    return _this;
  }

  _createClass(SpeechRecognizer, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.verifyStatus();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var status = this.state.status; // This can only happen during initialization, so no need to have it as part of `verifyStatus`.

      if (status === SpeechRecognizerStatus.UNSUPPORTED) {
        console.error("There was an error at initialisation. \n        Most likely related to SpeechRecognition not being supported by the current browser.\n        Check https://caniuse.com/#feat=speech-recognition for more info");
        this.onError(null);
        return;
      }

      this.verifyStatus();
    }
  }, {
    key: "render",
    value: function render() {
      var dontRender = this.props.dontRender;
      var _this$state = this.state,
          error = _this$state.error,
          status = _this$state.status;

      if (dontRender) {
        return null;
      }

      if (status === SpeechRecognizerStatus.FAILED) {
        console.error('There has been an error trying to start recognizing: ', error);
        return null;
      }

      if (status === SpeechRecognizerStatus.INACTIVE) {
        return this.renderInactiveStatus();
      }

      if (status === SpeechRecognizerStatus.RECOGNIZING) {
        return this.renderRecognizingStatus();
      }

      return this.renderStoppedStatus();
    }
  }]);

  return SpeechRecognizer;
}(_react.Component), _temp);
exports.SpeechRecognizer = SpeechRecognizer;