const natural = require('natural')
const fs = require('fs')

const stopWords = new Set(natural.stopwords.words)

function preprocessText(text) {
    const tokenizer = new natural.SentenceTokenizer()
    const sentences = tokenizer.tokenize(text)
    const lemmatizer = new natural.Lemmatizer()

    // Tokenize each sentence and preprocess individual tokens
    const preprocessedSentences = sentences.map(sentence => {
        const tokens = new natural.WordTokenizer().tokenize(sentence)
        const preprocessedTokens = tokens.map(token => {

            // Preserve tokens with apostrophes or hyphens
            if (token.match(/[a-zA-Z]+'[a-zA-Z]+/) || token.match(/[a-zA-Z]+-[a-zA-Z]+/)) {
                return token
            }

            // Lemmatize tokens
            const lemmatizedToken = lemmatizer.lemmatize(token.toLowerCase())

            // Remove stopwords
            if (!stopWords.has(lemmatizedToken)) {
                return lemmatizedToken
            }
        }).filter(Boolean) // Filter out undefined tokens

        // Reconstruct the preprocessed sentence
        return preprocessedTokens.join(' ')
    })

    // Reconstruct the preprocessed text with sentence boundaries
    return preprocessedSentences.join('\n')
}

function loadTextFromFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8')
}

function main() {
    const filePath = process.argv[2]

    if (!filePath) {
        console.error('Please provide the path to the input TXT file.')
        process.exit(1)
    }

    const text = loadTextFromFile(filePath)
    const preprocessedText = preprocessText(text)

    // Write preprocessed text to a new file in the processed-docs directory
    const outputPath = `processed-transcripts/${filePath.split('/').pop()}`

    fs.writeFileSync(outputPath, preprocessedText)
    console.log(`Preprocessed text saved to ${outputPath}`)
}

main();
