"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractTranscripts = void 0;

var extractTranscripts = function extractTranscripts(results) {
  var transcripts = [];
  var totalResults = results.length;
  var resultsIndex = 0;

  while (resultsIndex < totalResults) {
    var result = results.item(resultsIndex);
    var totalAlternatives = result.length;
    var alternativesIndex = 0;

    while (alternativesIndex < totalAlternatives) {
      var alternative = result.item(0);
      transcripts.push(alternative.transcript);
      alternativesIndex++;
    }

    resultsIndex++;
  }

  return transcripts;
};

exports.extractTranscripts = extractTranscripts;