import { Component, ReactNode } from 'react';

export enum RecognizerStatus {
  INACTIVE = 0,
  RECOGNIZING = 1,
  STOPPED = 2,
  FAILED = 3,
}

export interface IRecognizerProps {
  startSpeechRecognition?: boolean;
  dontRender?: boolean;

  grammars?: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;

  renderInactiveStatus?: (props: IRecognizerProps, state: IRecognizerState) => {};
  renderRecognizingStatus?: (props: IRecognizerProps, state: IRecognizerState) => {};
  renderStoppedStatus?: (props: IRecognizerProps, state: IRecognizerState) => {};

  formatResults?: (results: SpeechRecognitionResultList) => {};
  
  onStart?: (event: SpeechRecognitionEvent, props: IRecognizerProps, state: IRecognizerState) => {}
  onResult?: (results: SpeechRecognitionResultList, formattedResults: any, transcripts: string[]) => {};
  onError?: (error: SpeechRecognitionError) => {};
}

export interface IRecognizerState {
  speechRecognizer: SpeechRecognition;
  status: RecognizerStatus;
  results: SpeechRecognitionResultList | null;
  formattedResults: any;
  transcripts: string[];
  error?: SpeechRecognitionError;
}

declare class SpeechRecognizer extends Component<IRecognizerProps, IRecognizerState> {
  onStart(event: SpeechRecognitionEvent): void;
  onResult(event: SpeechRecognitionEvent): void;
  onError(event: SpeechRecognitionEvent): void;

  renderInactiveStatus(): ReactNode;
  renderRecognizingStatus(): ReactNode;
  renderStoppedStatus(): ReactNode;
}

declare module 'speech-recognizer' {
  export = SpeechRecognizer;
}