export const extractTranscripts = (results: SpeechRecognitionResultList): string[] => {
  const transcripts: string[] = [];
  
  const totalResults = results.length;
  let resultsIndex: number = 0;

  while (resultsIndex < totalResults) {
    const result: SpeechRecognitionResult = results.item(resultsIndex);
    const totalAlternatives = result.length;
    let alternativesIndex = 0;

    while (alternativesIndex < totalAlternatives) {
      const alternative: SpeechRecognitionAlternative = result.item(0);

      transcripts.push(alternative.transcript);

      alternativesIndex++;
    }

    resultsIndex++;
  }

  return transcripts;
}