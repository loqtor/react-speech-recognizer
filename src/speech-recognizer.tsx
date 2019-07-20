import React, { Component, Fragment } from 'react';
import { RecognizerStatus, IRecognizerProps, IRecognizerState } from '../index';
import { extractTranscripts } from './util/speech-recognizer';

const DEFAULT_CONFIG = {
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  lang: 'en-NZ',
};

export const Recognizer = class Recognizer extends Component<IRecognizerProps, IRecognizerState> {
  constructor(props: IRecognizerProps) {
    super(props);

    const {
      startSpeechRecognition,
      grammars,
      continuous,
      interimResults,
      maxAlternatives,
      lang,
    } = props;

    // @ts-ignore -- For now...
    const speechRecognitionConstructor = window.webkitSpeechRecognition || window.SpeechRecognition;
    const speechRecognizer = new speechRecognitionConstructor();

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

    speechRecognizer.onstart = (e: SpeechRecognitionEvent) => this.onStart(e);
    speechRecognizer.onresult = (e: SpeechRecognitionEvent) => this.onResult(e);
    speechRecognizer.onerror = (e: SpeechRecognitionError) => this.onError(e);
    
    this.state = {
      speechRecognizer,
      status: startSpeechRecognition ? RecognizerStatus.RECOGNIZING : RecognizerStatus.INACTIVE,
      results: null,
      formattedResults: null,
      transcripts: [],
    }
  }

  onStart = (event: SpeechRecognitionEvent) => {
    this.setState({
      status: RecognizerStatus.RECOGNIZING,
    }, () => {
      const { onStart } = this.props;

      if (onStart) {
        onStart(event, this.props, this.state);
      }
    });
  }

  onResult = (event: SpeechRecognitionEvent) => {
    const { results } = event;
    const { formatResults, onResult } = this.props;
    const formattedResults = formatResults ? formatResults(results) : results;
    const transcripts = extractTranscripts(results);

    this.setState({
      results,
      formattedResults,
      transcripts,
    }, () => {
      if (!onResult) {
        return;
      }

      onResult(results, formattedResults, transcripts);
    });
  }

  onError = (error: SpeechRecognitionError) => {
    this.setState({
      error,
      status: RecognizerStatus.FAILED,
    }, () => {
      const { onError } = this.props;

      if (onError) {
        onError(error);
      }
    });
  }

  renderInactiveStatus = () => {
    const { renderInactiveStatus } = this.props;

    if (renderInactiveStatus) {
      return renderInactiveStatus(this.props, this.state);
    }

    return <h2>Ready to start...</h2>;
  }

  renderRecognizingStatus = () => {
    const { renderRecognizingStatus } = this.props;

    if (renderRecognizingStatus) {
      return renderRecognizingStatus(this.props, this.state);
    }

    return <h2>Recording tags...</h2>;
  }

  renderStoppedStatus = () => {
    const { renderStoppedStatus } = this.props;

    if (renderStoppedStatus) {
      return renderStoppedStatus(this.props, this.state);
    }

    const { transcripts } = this.state;

    if (!transcripts.length) {
      return <h2>No transcripts found in speech.</h2>;
    }

    return (
      <Fragment>
        <h2>Transcripts from speech:</h2>
        <ul>
          {transcripts.map((transcript: string, i: number) => {
            return (
              <li key={`transcript-${i}`}>{transcript}</li>
            )
          })}
        </ul>
      </Fragment>
    )
  }

  componentDidUpdate() {
    const { status } = this.state;

    if (status === RecognizerStatus.FAILED) {
      return;
    }

    const { startSpeechRecognition } = this.props;
    const { speechRecognizer } = this.state;

    if (startSpeechRecognition && status !== RecognizerStatus.RECOGNIZING) {
      speechRecognizer.start();

      return;
    }

    if (!startSpeechRecognition && status === RecognizerStatus.RECOGNIZING) {
      speechRecognizer.stop();

      this.setState({
        status: RecognizerStatus.STOPPED,
      });
    }
  }

  render() {
    const { dontRender } = this.props;
    const { error, status } = this.state;

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
}