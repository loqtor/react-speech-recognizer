# `react-speech-recognizer`

## React Component for Speech Recognition.

This HOC component allows to get Speech Recognition capabilities into your app. By wrapping your component on it, you can have it changing depending on the transcripts you get back or the `SpeechRecognizer.status`.

It relies on the [Web Speech Recognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) and if it's not supported in the browser, it logs a `warn`, renders nothing and calls the `onError` prop (if provided).

It creates a `SpeechRecognition` instance internally and exposes its events through `props` in the component.

Use it like:

```
import React from 'react';
import logo from './logo.svg';
import './App.css';

import { SpeechRecognizer } from 'react-speech-recognizer-component';

function App() {
  return (
    <div className="App">
      <h1>Speech to text test with React Speech Recognizer</h1>
      <SpeechRecognizer
        startSpeechRecognition={true}
        onError={this.onError}
      >
          {({status, results, formattedResults, transcripts, error}) => {
            return (
              <>
                {transcripts && transcripts.length && <p>{transcripts.join(', ')}</p>}
              </>
            );
          }}
      </SpeechRecognizer>
    </div>
  );
}

export default App;
```

### `props`

Same as the ones that the `SpeechRecognition` object would accept, plus the one that says _start recognizing, yo!_.

- `startSpeechRecognition`: flag that if `true` the recoznizer starts attempting to listen on your microphone.
- `grammars`: Accepts a string in the (beautiful!) [JSGF Format](https://www.w3.org/TR/2000/NOTE-jsgf-20000605/).
- `continuous`: Flag that if `true` more than one result _per recognition_ is returned.
- `interimResults`: Flag that if `true` returns results that are not final.
- `maxAlternatives`: Yup, the most alternatives that can be returned. Keep in mind that setting `continous` to `false` (which is the default value)
- `lang`: ISO string with the language.

(Some) of the `SpeechRecognition` events are also exposed as `props`.

- `onStart`: Callback run on the `onstart` event of the `SpeechRecognizer` instance.
- `onError`: Callback run on the `onerror` event of the `SpeechRecognizer` instance. One of the cases when this is executed when `SpeechRecognition` is not supported by the browser.

### Next steps

1. Probably start over with a different idea in mind, based on what I learn while working on [Guess The Movie](https://guess-the-movie-dev.netlify.com/) (repo [here](https://github.com/loqtor/guess-the-movie)). It'd be a [`VoiceCommandRecognizer`](https://github.com/loqtor/voice-command-recognizer) instead. :)