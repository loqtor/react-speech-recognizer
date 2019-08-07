"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Recognizer = exports.RecognizerStatus = void 0;

var _react = _interopRequireWildcard(require("react"));

var _speechRecognizer = require("./util/speech-recognizer");

var _temp;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

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
var RecognizerStatus = {
  INACTIVE: 0,
  RECOGNIZING: 1,
  STOPPED: 2,
  FAILED: 3
};
exports.RecognizerStatus = RecognizerStatus;
var Recognizer = (_temp =
/*#__PURE__*/
function (_Component) {
  _inherits(Recognizer, _Component);

  function Recognizer(props) {
    var _this;

    _classCallCheck(this, Recognizer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Recognizer).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onStart", function (event) {
      _this.setState({
        status: RecognizerStatus.RECOGNIZING
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
      var transcripts = (0, _speechRecognizer.extractTranscripts)(results);

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
        status: RecognizerStatus.FAILED
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

    var startSpeechRecognition = props.startSpeechRecognition,
        grammars = props.grammars,
        continuous = props.continuous,
        interimResults = props.interimResults,
        maxAlternatives = props.maxAlternatives,
        lang = props.lang; // @ts-ignore -- For now...

    var speechRecognitionConstructor = window.webkitSpeechRecognition || window.SpeechRecognition;
    var speechRecognizer = new speechRecognitionConstructor();

    if (grammars) {
      // @ts-ignore -- For now...
      var speechGrammarListConstructor = window.SpeechGrammarList || window.webkitSpeechGrammarList;
      var speechGrammarList = new speechGrammarListConstructor();
      speechGrammarList.addFromString(grammars, 10000000);
      speechRecognizer.grammars = speechGrammarList;
    }

    speechRecognizer.continuous = continuous || DEFAULT_CONFIG.continuous;
    speechRecognizer.interimResults = interimResults || DEFAULT_CONFIG.interimResults;
    speechRecognizer.maxAlternatives = maxAlternatives || DEFAULT_CONFIG.maxAlternatives;
    speechRecognizer.lang = lang || DEFAULT_CONFIG;

    speechRecognizer.onstart = function (event) {
      return _this.onStart(event);
    };

    speechRecognizer.onresult = function (event) {
      return _this.onResult(event);
    };

    speechRecognizer.onerror = function (error) {
      return _this.onError(error);
    };

    _this.state = {
      speechRecognizer: speechRecognizer,
      status: startSpeechRecognition ? RecognizerStatus.RECOGNIZING : RecognizerStatus.INACTIVE,
      results: null,
      formattedResults: null,
      transcripts: []
    };
    return _this;
  }

  _createClass(Recognizer, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var status = this.state.status;

      if (status === RecognizerStatus.FAILED) {
        return;
      }

      var startSpeechRecognition = this.props.startSpeechRecognition;
      var speechRecognizer = this.state.speechRecognizer;

      if (startSpeechRecognition && status !== RecognizerStatus.RECOGNIZING) {
        speechRecognizer.start();
        return;
      }

      if (!startSpeechRecognition && status === RecognizerStatus.RECOGNIZING) {
        speechRecognizer.stop();
        this.setState({
          status: RecognizerStatus.STOPPED
        });
      }
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

      if (status === RecognizerStatus.FAILED) {
        console.error('There has been an error trying to start recognizing: ', error);
        return null;
      }

      if (status === RecognizerStatus.INACTIVE) {
        return this.renderInactiveStatus();
      }

      if (status === RecognizerStatus.RECOGNIZING) {
        return this.renderRecognizingStatus();
      }

      return this.renderStoppedStatus();
    }
  }]);

  return Recognizer;
}(_react.Component), _temp);
exports.Recognizer = Recognizer;