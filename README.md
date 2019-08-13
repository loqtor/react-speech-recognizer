# `react-speech-recognizer`

## React Component for Speech Recognition.

Place this component anywhere in your app to get Speech Recognition capabilities, when supported.

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <SpeechRecognizer />
      </header>
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
- `onResult`: Callback run on the `onresult` event of the `SpeechRecognizer` instance.
- `onError`: Callback run on the `onerror` event of the `SpeechRecognizer` instance. One of the cases when this is executed when `SpeechRecognition` is not supported by the browser.

It also allows customizing what's render per status:

- `renderInactiveStatus`: Function that returns the what's to be rendered when `SpeechRecognizer.status === SpeechRecognizerStatus.INACTIVE`. This is the default status, before starting recognition (`startSpeechRecognition` hasn't been `true` yet).
- `renderRecognizingStatus`: Function that returns the what's to be rendered when `SpeechRecognizer.status === SpeechRecognizerStatus.RECOGNIZING`.
- `renderStoppedStatus`: Function that returns the what's to be rendered when `SpeechRecognizer.status === SpeechRecognizerStatus.STOPPED`. By default, this status prints what was _recognized_.

There's also the option to render nothing and just use the callbacks and get that _sweet recognition_ in your component.

- `dontRender`: if set to `true`, the component will not render but will still generate the instance of `SpeechRecognition` instance and give you that callback goodness.

## Next steps

1. Expose all of the `SpeechRecognition` events.
2. Try to put this in TypeScript. I already have a branch in the repo where the entire thing is typed, but I could not get it to properly build into an npm Module.
3. Actually, perhaps... Redesign the whole thing? I think this could be an Enhancer. More like an HOC and take it from there. But for now, I think it's cool. :)

