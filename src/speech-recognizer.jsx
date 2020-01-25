import React, { Component, Fragment } from 'react';
import { extractTranscripts } from './util/speech-recognizer';

const DEFAULT_CONFIG = {
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  lang: 'en-NZ',
};

export const SpeechRecognizerStatus = {
  INACTIVE: 0,
  RECOGNIZING: 1,
  STOPPED: 2,
  FAILED: 3,
  UNSUPPORTED: 4,
}

export const SpeechRecognizer = class SpeechRecognizer extends Component {
  constructor(props) {
    super(props);

    const {
      grammars,
      continuous,
      interimResults,
      maxAlternatives,
      lang,
    } = props;

    this.state = {
      status: SpeechRecognizerStatus.INACTIVE,
      results: null,
      formattedResults: null,
      transcripts: [],
      error: null,
    }

    // @ts-ignore -- For now...
    const speechRecognitionConstructor = window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition ||
      window.oSpeechRecognition;

    if (!speechRecognitionConstructor) {
      this.state.status = SpeechRecognizerStatus.UNSUPPORTED;
      return;
    }

    let speechRecognizer = new speechRecognitionConstructor();

    if (grammars) {
      // @ts-ignore -- For now...
      const speechGrammarListConstructor = window.SpeechGrammarList || window.webkitSpeechGrammarList;

      const speechGrammarList = new speechGrammarListConstructor();
      speechGrammarList.addFromString(grammars, 10000000);

      speechRecognizer.grammars = speechGrammarList;
    }

    speechRecognizer.continuous = continuous || DEFAULT_CONFIG.continuous;
    speechRecognizer.interimResults = interimResults || DEFAULT_CONFIG.interimResults;
    speechRecognizer.maxAlternatives = maxAlternatives || DEFAULT_CONFIG.maxAlternatives;
    speechRecognizer.lang = lang || DEFAULT_CONFIG;

    speechRecognizer.onstart = (event) => this.onStart(event);
    speechRecognizer.onresult = (event) => this.onResult(event);
    speechRecognizer.onerror = (error) => this.onError(error);
    
    this.state.speechRecognizer = speechRecognizer;
  }

  onStart = (event) => {
    this.setState({
      status: SpeechRecognizerStatus.RECOGNIZING,
    }, () => {
      const { onStart } = this.props;

      if (onStart) {
        onStart(event, this.props, this.state);
      }
    });
  }

  onResult = (event) => {
    const { results } = event;
    const { formatResults, onResult } = this.props;
    const formattedResults = formatResults ? formatResults(results) : results;
    const transcripts = extractTranscripts(results);

    this.setState({
      results,
      formattedResults,
      transcripts,
    });
  }

  onError = (error) => {
    this.setState({
      error,
      status: SpeechRecognizerStatus.FAILED,
    }, () => {
      const { onError } = this.props;

      if (onError) {
        onError(error);
      }
    });
  }

  verifyStatus = () => {
    const { status } = this.state;

    if (status === SpeechRecognizerStatus.FAILED) {
      return;
    }

    const { startSpeechRecognition } = this.props;
    const { speechRecognizer } = this.state;

    if (startSpeechRecognition && status !== SpeechRecognizerStatus.RECOGNIZING) {
      speechRecognizer.start();

      return;
    }

    if (!startSpeechRecognition && status === SpeechRecognizerStatus.RECOGNIZING) {
      speechRecognizer.stop();

      this.setState({
        status: SpeechRecognizerStatus.STOPPED,
      });
    }
  }

  componentDidUpdate() {
    this.verifyStatus();
  }

  componentDidMount() {
    const { status } = this.state;

    // This can only happen during initialization, so no need to have it as part of `verifyStatus`.
    if (status === SpeechRecognizerStatus.UNSUPPORTED) {
      console.error(
        `There was an error at initialisation. 
        Most likely related to SpeechRecognition not being supported by the current browser.
        Check https://caniuse.com/#feat=speech-recognition for more info`
      );

      this.onError(null);
      return;
    }

    this.verifyStatus();
  }

  componentWillUnmount() {
    this.speechRecognizer && this.speechRecognizer.stop();
  }

  render() {
    const { children } = this.props;
    const { error, formattedResults, results, status, transcripts } = this.state;

    return <>{children({status, results, formattedResults, transcripts, error})}</>
  }
}