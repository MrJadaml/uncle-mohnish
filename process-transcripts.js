const fs = require('fs');
const natural = require('natural');
const nlp = require('compromise');

const stopWords = new Set(natural.stopwords.words);

// Tokenizer instances (reuse to avoid re-instantiation)
const sentenceTokenizer = new natural.SentenceTokenizer();
const wordTokenizer = new natural.WordTokenizer();

function tokenizeAndClean(sentence) {
    const tokens = wordTokenizer.tokenize(sentence);
    return tokens.map(cleanToken).filter(Boolean).join(' ');
}

function cleanToken(token) {
    if (token.match(/[a-zA-Z]+-[a-zA-Z]+/)) return token;

    if (token.includes("'")) {
        const parts = token.split(/'(?=[tsmd]|ll|re|ve|LL|RE|VE|TSMD|$)/i);
        return parts.join('');
    }

    const lowercasedToken = token.toLowerCase();
    return stopWords.has(lowercasedToken) ? null : lowercasedToken;
}

function normalizeContractions(text) {
    let nextText = nlp(text).normalize({
      possessives: false,
      plurals: true,
      contractions: true,
      whitespace: true
    }).out('text');

    // Correcting misplaced possessive forms
    nextText = nextText.replace(/(\b\w+) s /g, "$1's ");

    return nextText
}

function preprocessText(text) {
    const normalizedContractions = normalizeContractions(text)
    const sentences = sentenceTokenizer.tokenize(normalizedContractions);
    return sentences.map(tokenizeAndClean).join('\n');
}

function loadTextFromFile(filePath) {
    return fs.promises.readFile(filePath, 'utf-8');
}

function savePreprocessedText(outputPath, text) {
    return fs.promises.writeFile(outputPath, text);
}

async function main() {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error('Please provide the path to the input TXT file.');
        return;
    }

    try {
        const text = await loadTextFromFile(filePath);
        const preprocessedText = preprocessText(text);
        const outputPath = `knowledge/${filePath.split('/').pop()}`;
        await savePreprocessedText(outputPath, preprocessedText);
        console.log(`Preprocessed text saved to ${outputPath}`);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

main();
