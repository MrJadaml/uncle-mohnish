// Topics

// Transcript Snippets
interface Passage {
  // Brief description of the setting or background
  context: string
  summary: '',
  question: '',
  dialouge: '',
  date: '',
  topics: Array<String>,
  // Summaries of specific actions, strategies, or recommendations,
  // Provide direct value to users seeking actionable advice.
  recommendations: Array<String>
  // Specific books, articles, case studies, visual aids or other resources mentioned.
  // Invaluable for users who wish to delve deeper into the topic.
  references: Array<String>
  // Notable quotes or key phrases within the dialogue.
  // Useful to highlight core essence of advice in a concise way.
  quotes: Array<String>
  visual_aid: Array<String>
  source: String
}
