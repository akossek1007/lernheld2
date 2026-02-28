import curriculumConfig from '../config/curriculum-config.json';

export type Task = {
    id: string;
    question: string;
    answer: string | number;
    options?: (string | number)[];
    metadata?: any;
};

// Simple Spaced Repetition Mock: track failed tasks to prioritize them
let failedTaskHistory: string[] = [];

export const recordTaskResult = (taskId: string, success: boolean) => {
    if (!success) {
        failedTaskHistory.push(taskId);
    }
};

export const generateMathTask = (phaseId: string): Task => {
    const id = Math.random().toString(36).substr(2, 9);

    // Prioritize failed tasks (Spaced Repetition Simulation)
    if (failedTaskHistory.length > 0 && Math.random() < 0.3) {
        // In a real app, we'd fetch the actual task data for this ID
        // For now, we'll just generate a fresh one and clear the history item
        failedTaskHistory.shift();
    }

    if (phaseId.startsWith('m1x1_')) {
        const series = parseInt(phaseId.split('_')[1]);
        const a = Math.floor(Math.random() * 11); // 0-10
        const focus = curriculumConfig.math_1x1.progression.find(p => p.series.includes(series))?.focus || "";
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
            let a: number, b: number;
            let attempts = 0;
            do {
                a = Math.floor(Math.random() * 11) + 5; // 5-15
                b = Math.floor(Math.random() * (21 - a));
                attempts++;
            } while ((a % 10) + b >= 10 && attempts < 50);
            if ((a % 10) + b >= 10) { a = 5; b = 3; } // Safe fallback
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
            return { id, question: "2 + 2", answer: 4 };
    }
};

export const generateGermanTask = (phaseId: string): Task => {
    const id = Math.random().toString(36).substr(2, 9);

    let words: string[] = [];
    if (phaseId === 'd_merkwort') {
        const configPhase = curriculumConfig.german.find(p => p.id === 'd_merkwort');
        words = (configPhase as any).words || [];
    } else if (phaseId === 'd_sichtwort') {
        const configPhase = curriculumConfig.german.find(p => p.id === 'd_sichtwort');
        words = (configPhase as any).words || [];
    } else {
        words = ["ROBOT", "APFEL", "BAUM", "SONNE", "LERNHELD"];
    }

    const word = words[Math.floor(Math.random() * words.length)];

    switch (phaseId) {
        case 'd1': // Vokale
            return {
                id,
                question: `Klicke alle Vokale in "${word}" an!`,
                answer: word.match(/[AEIOUäöü]/gi)?.length || 0,
                metadata: { word, type: 'vowel_click' }
            };
        case 'd2': {
            // In a real app, use a syllable splitting library
            const answer = word.length > 5 ? 2 : 1;
            return { id, question: `Wie viele Silben hat "${word}"?`, answer };
        }
        case 'd3': // Anlaute
            return { id, question: `Was ist der erste Buchstabe von "${word}"?`, answer: word[0].toUpperCase(), options: [word[0].toUpperCase(), "B", "M", "S"] };
        case 'd4': // Lesewörter (2 Silben)
            return { id, question: `Lies das Wort:`, answer: word, options: [word, "ANDERS", "FALSCH", "TEST"] };
        case 'd5': // Sätze bauen
            const sentence = `Das ist ein ${word}`;
            // Scramble parts
            const parts = ["Das", "ist", "ein", word].sort(() => Math.random() - 0.5);
            return {
                id,
                question: `Bau den Satz:`,
                answer: sentence,
                metadata: { parts, type: 'sentence_build' }
            };
        case 'd_merkwort':
        case 'd_sichtwort':
            return { id, question: `Blitzlesen: Welches Wort ist das?`, answer: word, options: [word, "FEHLER", "TEST"] };
        default:
            return { id, question: "A oder B?", answer: "A", options: ["A", "B"] };
    }
};
