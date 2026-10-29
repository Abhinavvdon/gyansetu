/**
 * GyanSetu Bilingual & Transliteration Utilities
 * Ensures accurate, uniform Hindi / English conversion across the application.
 */

// Comprehensive Indian name transliteration map for 100% accurate conversion
const NAME_MAP: Record<string, string> = {
  // First Names
  'abhinav': 'अभिनव',
  'Abhinav': 'अभिनव',
  'ABHINAV': 'अभिनव',
  'dongre': 'डोंगरे',
  'Dongre': 'डोंगरे',
  'DONGRE': 'डोंगरे',
  'aarav': 'आरव',
  'Aarav': 'आरव',
  'sharma': 'शर्मा',
  'Sharma': 'शर्मा',
  'rahul': 'राहुल',
  'Rahul': 'राहुल',
  'verma': 'वर्मा',
  'Verma': 'वर्मा',
  'priya': 'प्रिया',
  'Priya': 'प्रिया',
  'singh': 'सिंह',
  'Singh': 'सिंह',
  'rohan': 'रोहन',
  'Rohan': 'रोहन',
  'gupta': 'गुप्ता',
  'Gupta': 'गुप्ता',
  'pooja': 'पूजा',
  'Pooja': 'पूजा',
  'patel': 'पटेल',
  'Patel': 'पटेल',
  'ananya': 'अनन्या',
  'Ananya': 'अनन्या',
  'mishra': 'मिश्रा',
  'Mishra': 'मिश्रा',
  'kumar': 'कुमार',
  'Kumar': 'कुमार',
  'yadav': 'यादव',
  'Yadav': 'यादव',
  'amit': 'अमित',
  'Amit': 'अमित',
  'sneha': 'स्नेहा',
  'Sneha': 'स्नेहा',
  'student': 'छात्र',
  'Student': 'छात्र'
};

/**
 * Phonetic rule-based transliterator for any English name not in the exact dictionary
 */
function phoneticTransliterate(word: string): string {
  if (!word) return '';

  const w = word.trim();
  if (NAME_MAP[w]) return NAME_MAP[w];

  // Common phoneme substitutions
  let res = w
    .replace(/sh/gi, 'श')
    .replace(/ch/gi, 'च')
    .replace(/th/gi, 'थ')
    .replace(/dh/gi, 'ध')
    .replace(/bh/gi, 'भ')
    .replace(/kh/gi, 'ख')
    .replace(/gh/gi, 'घ')
    .replace(/ph/gi, 'फ')
    .replace(/ee/gi, 'ी')
    .replace(/oo/gi, 'ू')
    .replace(/aa/gi, 'ा')
    .replace(/ai/gi, 'ै')
    .replace(/au/gi, 'ौ')
    .replace(/a/gi, 'ा')
    .replace(/b/gi, 'ब')
    .replace(/c/gi, 'क')
    .replace(/d/gi, 'द')
    .replace(/e/gi, 'े')
    .replace(/f/gi, 'फ')
    .replace(/g/gi, 'ग')
    .replace(/h/gi, 'ह')
    .replace(/i/gi, 'ि')
    .replace(/j/gi, 'ज')
    .replace(/k/gi, 'क')
    .replace(/l/gi, 'ल')
    .replace(/m/gi, 'म')
    .replace(/n/gi, 'न')
    .replace(/o/gi, 'ो')
    .replace(/p/gi, 'प')
    .replace(/r/gi, 'र')
    .replace(/s/gi, 'स')
    .replace(/t/gi, 'त')
    .replace(/u/gi, 'ु')
    .replace(/v/gi, 'व')
    .replace(/w/gi, 'व')
    .replace(/y/gi, 'य')
    .replace(/z/gi, 'ज़');

  return res;
}

/**
 * Formats a student's name into clean Hindi when lang is 'hi', or returns the original in English.
 */
export function formatStudentName(name: string | undefined | null, lang: 'en' | 'hi'): string {
  if (!name || !name.trim()) {
    return lang === 'hi' ? 'छात्र' : 'Student';
  }

  if (lang !== 'hi') {
    return name.trim();
  }

  const trimmed = name.trim();

  // Full name check first
  if (NAME_MAP[trimmed]) {
    return NAME_MAP[trimmed];
  }

  // Tokenize words
  const parts = trimmed.split(/\s+/);
  const converted = parts.map((part) => {
    if (NAME_MAP[part]) return NAME_MAP[part];
    const capitalized = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    if (NAME_MAP[capitalized]) return NAME_MAP[capitalized];
    return phoneticTransliterate(capitalized);
  });

  return converted.join(' ');
}

/**
 * Converts English digits to Devanagari numerals if desired, or returns standard digits
 */
export function formatHindiNumber(num: number | string, lang: 'en' | 'hi'): string {
  const str = String(num);
  if (lang !== 'hi') return str;
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return str.replace(/[0-9]/g, (d) => devanagariDigits[parseInt(d, 10)] || d);
}
