import curriculumConfig from '../config/curriculum-config.json';

export type Task = {
    id: string;
    question: string;
    answer: string | number;
    options?: (string | number)[];
    metadata?: any;
};

export function countSyllables(word: string): number {
    if (!word) return 1;
    const lower = word.toLowerCase();
    // Remove non-letters but keep German umlauts
    const cleaned = lower.replace(/[^a-zäöüy]/g, '');
    if (cleaned.length === 0) return 1;

    // Replace German diphthongs with placeholder
    const replaced = cleaned.replace(/ei|ai|ey|ay|au|eu|äu|ou/gi, '#');

    // Count diphthong placeholders
    const diphthongCount = (replaced.match(/#/g) || []).length;

    // Remove placeholders and count vowel groups
    const withoutDiphthongs = replaced.replace(/#/g, '');
    const vowelGroups = withoutDiphthongs.match(/[aeiouäöüy]+/g);
    const vowelGroupCount = vowelGroups ? vowelGroups.length : 0;

    return diphthongCount + vowelGroupCount;
}

const VOWEL_REGEX = /[aeiouäöüy]/i;
const failedWordsByPhase = new Map<string, string[]>();

const normalizeWord = (word: string): string => word.toLowerCase().trim();

export const splitIntoSyllables = (word: string): string[] => {
    const text = normalizeWord(word).replace(/[^a-zäöüß]/g, '');
    if (!text) return [word];

    const parts: string[] = [];
    let current = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        current += char;

        const next = text[i + 1];
        if (!next) continue;

        const charIsVowel = VOWEL_REGEX.test(char);
        const nextIsVowel = VOWEL_REGEX.test(next);
        if (charIsVowel && !nextIsVowel) {
            parts.push(current);
            current = '';
        }
    }

    if (current) parts.push(current);
    return parts.length > 0 ? parts : [word];
};

const trackFailedWord = (phaseId: string, word: string) => {
    const failed = failedWordsByPhase.get(phaseId) || [];
    if (!failed.includes(word)) {
        failed.push(word);
    }
    failedWordsByPhase.set(phaseId, failed);
};

const clearFailedWord = (phaseId: string, word: string) => {
    const failed = failedWordsByPhase.get(phaseId) || [];
    failedWordsByPhase.set(phaseId, failed.filter(w => w !== word));
};

export const recordTaskResult = (task: Task, phaseId: string, success: boolean) => {
    const word = task.metadata?.word;
    if (!word || typeof word !== 'string') return;

    if (success) {
        clearFailedWord(phaseId, word);
    } else {
        trackFailedWord(phaseId, word);
    }
};

const pickWord = (phaseId: string, words: string[]): string => {
    const failed = failedWordsByPhase.get(phaseId) || [];
    if (failed.length > 0 && Math.random() < 0.65) {
        return failed[Math.floor(Math.random() * failed.length)];
    }

    return words[Math.floor(Math.random() * words.length)];
};

const createWordBuildTask = (id: string, phaseId: string, word: string): Task => {
    const cleanWord = normalizeWord(word);
    const alphabet = 'abcdefghijklmnopqrstuvwxyzäöüß';
    const extras: string[] = [];
    while (extras.length < Math.min(3, cleanWord.length)) {
        const candidate = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!cleanWord.includes(candidate) && !extras.includes(candidate)) {
            extras.push(candidate);
        }
    }

    const letters = [...cleanWord.split(''), ...extras].sort(() => Math.random() - 0.5);
    const label = phaseId === 'd_merkwort' ? 'Merkwort' : 'Sichtwort';
    return {
        id,
        question: `${label}: Baue das Wort.`,
        answer: cleanWord,
        metadata: {
            type: 'word_build',
            word: cleanWord,
            letters
        }
    };
};

export const generateMathTask = (phaseId: string): Task => {
    const id = Math.random().toString(36).substr(2, 9);

    if (phaseId.startsWith('m1x1_')) {
        const series = parseInt(phaseId.split('_')[1]);
        const a = Math.floor(Math.random() * 11); // 0-10
        const focus = curriculumConfig.math_1x1.progression.find(p => p.series.includes(series))?.focus || '';
        return {
            id,
            question: `${a} x ${series}`,
            answer: a * series,
            metadata: { strategy: focus }
        };
    }

    switch (phaseId) {
        case 'm1': { // Addition ZR 10
            const a = Math.floor(Math.random() * 6);
            const b = Math.floor(Math.random() * (11 - a));
            return { id, question: `${a} + ${b}`, answer: a + b };
        }
        case 'm2': { // Addition ZR 20 (no crossing)
            let a: number;
            let b: number;
            let attempts = 0;
            do {
                a = Math.floor(Math.random() * 11) + 5; // 5-15
                b = Math.floor(Math.random() * (21 - a));
                attempts++;
            } while ((a % 10) + b >= 10 && attempts < 50);
            if ((a % 10) + b >= 10) {
                a = 5;
                b = 3;
            } // Safe fallback
            return { id, question: `${a} + ${b}`, answer: a + b };
        }
        case 'm3': { // Zehnerübergang (Transition ZR 20)
            const a = Math.floor(Math.random() * 5) + 6; // 6-10
            const b = Math.floor(Math.random() * 5) + (11 - a); // ensures a+b > 10
            return { id, question: `${a} + ${b}`, answer: a + b, metadata: { step: 10 - a } };
        }
        case 'm4': { // ZR 100 (even)
            const a = (Math.floor(Math.random() * 9) + 1) * 10;
            const b = (Math.floor(Math.random() * (10 - (a / 10)))) * 10;
            return { id, question: `${a} + ${b}`, answer: a + b };
        }
        case 'm5': { // ZR 100 with carrying
            const a = Math.floor(Math.random() * 80) + 11;
            const b = Math.floor(Math.random() * 9) + (10 - (a % 10)); // ensures cross 10
            return { id, question: `${a} + ${b}`, answer: a + b, metadata: { step: 10 - (a % 10) } };
        }
        case 's3': { // Subtraction with crossing
            const a = Math.floor(Math.random() * 5) + 11; // 11-15
            const b = Math.floor(Math.random() * 5) + (a - 10) + 1; // b > a-10
            return { id, question: `${a} - ${b}`, answer: a - b, metadata: { step: a - 10 } };
        }
        default:
            return { id, question: '2 + 2', answer: 4 };
    }
};

export const generateGermanTask = (phaseId: string): Task => {
    const id = Math.random().toString(36).substr(2, 9);

    // Unified word loading: always read from config first
    const configPhase = curriculumConfig.german.find(p => p.id === phaseId);
    let words: string[] = (configPhase as any)?.words || [];
    if (words.length === 0) {
        words = ['APFEL', 'BAUM', 'SONNE', 'BLUME', 'KATZE'];
    }

    const word = pickWord(phaseId, words);

    switch (phaseId) {
        case 'd1': { // Vokale
            return {
                id,
                question: `Klicke alle Vokale in "${word}" an!`,
                answer: word.match(/[AEIOUäöü]/gi)?.length || 0,
                metadata: { word, type: 'vowel_click' }
            };
        }
        case 'd2': {
            const count = countSyllables(word);
            const correctAnswer = count;
            const allOptions = [1, 2, 3, 4];
            const options = allOptions.includes(correctAnswer)
                ? allOptions
                : [...allOptions.filter(n => n !== 4), correctAnswer].sort((a, b) => a - b);
            return {
                id,
                question: `Wie viele Silben hat "${word}"?`,
                answer: count,
                options,
                metadata: { word, type: 'syllable_count', syllables: splitIntoSyllables(word) }
            };
        }
        case 'd3': { // Anlaute
            const correct = word[0].toUpperCase();
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ'.split('');
            const wrongCandidates = alphabet.filter(c => c !== correct);
            const shuffled = wrongCandidates.sort(() => Math.random() - 0.5);
            const wrong = shuffled.slice(0, 3);
            const options = [correct, ...wrong].sort(() => Math.random() - 0.5);
            return { id, question: `Was ist der erste Buchstabe von "${word}"?`, answer: correct, options };
        }
        case 'd4': {
            // Lesewörter – pick the correct word from options
            const otherWords = words.filter(w => w !== word);
            const shuffled = otherWords.sort(() => Math.random() - 0.5);
            const distractors = shuffled.slice(0, 3);
            const options = [word, ...distractors].sort(() => Math.random() - 0.5);
            return { id, question: 'Welches Wort siehst du? Lies genau!', answer: word, options, metadata: { word, type: 'reading' } };
        }
        case 'd5': { // Sätze bauen – use real sentences from config
            const sentences: string[] = (configPhase as any)?.sentences || [];
            let sentence: string;
            if (sentences.length > 0) {
                sentence = sentences[Math.floor(Math.random() * sentences.length)];
            } else {
                sentence = `Das ist ein ${word}`;
            }
            // Remove trailing period for the answer comparison
            const cleanSentence = sentence.replace(/\.$/, '');
            // Split into words and scramble
            const parts = cleanSentence.split(' ').sort(() => Math.random() - 0.5);
            return {
                id,
                question: 'Bau den Satz:',
                answer: cleanSentence,
                metadata: { parts, type: 'sentence_build' }
            };
        }
        case 'd_merkwort':
        case 'd_sichtwort': {
            return createWordBuildTask(id, phaseId, word);
        }
        default:
            return { id, question: 'A oder B?', answer: 'A', options: ['A', 'B'] };
    }
};
