import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';
import { generateMathTask, generateGermanTask, recordTaskResult, Task } from '../lib/engine';
import { Icon } from './Icon';
import { Robot, RobotState } from './Robot';
import { Zehnerstopp } from './animations/Zehnerstopp';
import { SyllableHighlight } from './animations/SyllableHighlight';

interface GameplayProps {
    subject: 'math' | 'german';
    phaseId: string;
    userId: string;
    onClose: () => void;
}

export const Gameplay: React.FC<GameplayProps> = ({ subject, phaseId, userId, onClose }) => {
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [score, setScore] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [robotState, setRobotState] = useState<RobotState>('neutral');
    const [gameOver, setGameOver] = useState(false);

    // Interactive states for specific tasks
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [sentenceParts, setSentenceParts] = useState<string[]>([]);
    const [wordLetters, setWordLetters] = useState<string[]>([]);

    useEffect(() => {
        nextTask();
    }, []);

    const nextTask = () => {
        if (totalTasks >= 10) {
            setGameOver(true);
            saveProgress();
            return;
        }
        const task = subject === 'math' ? generateMathTask(phaseId) : generateGermanTask(phaseId);
        setCurrentTask(task);
        setInput('');
        setFeedback(null);
        setRobotState('neutral');
        setSelectedIndices([]);
        setSentenceParts([]);
        setWordLetters([]);
    };

    const saveProgress = () => {
        fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                phase_id: phaseId,
                subject,
                score
            })
        }).catch(() => {
            console.warn('Fortschritt konnte nicht gespeichert werden (Server offline?).');
        });
    };

    const saveAttempt = (task: Task, isCorrect: boolean, learnerAnswer: string) => {
        fetch('/api/attempt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                phase_id: phaseId,
                subject,
                task_id: task.id,
                task_type: task.metadata?.type || 'generic',
                prompt: task.question,
                expected_answer: task.answer.toString(),
                learner_answer: learnerAnswer,
                is_correct: isCorrect ? 1 : 0,
                target_word: task.metadata?.word || null
            })
        }).catch(() => {
            console.warn('Aufgabenversuch konnte nicht gespeichert werden.');
        });
    };

    const handleAnswer = (val: string | number) => {
        if (feedback || !currentTask) return;

        const learnerAnswer = val.toString();
        const isCorrect = learnerAnswer.toLowerCase() === currentTask.answer.toString().toLowerCase();
        recordTaskResult(currentTask, phaseId, isCorrect);
        saveAttempt(currentTask, isCorrect, learnerAnswer);
        setFeedback(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            setScore(s => s + 1);
            setRobotState('jubelnd');
        } else {
            setRobotState('hilfsbereit');
        }

        setTotalTasks(t => t + 1);

        setTimeout(() => {
            nextTask();
        }, 1500);
    };

    const handleNumpad = (num: string) => {
        const nextInput = input + num;
        setInput(nextInput);

        // Auto-submit if length matches answer length
        if (currentTask && nextInput.length === currentTask.answer.toString().length) {
            handleAnswer(nextInput);
        }
    };

    if (gameOver) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <Robot state="jubelnd" />
                <h2 className="text-5xl font-display">Super gemacht!</h2>
                <div className="flex items-center gap-4 text-3xl font-bold bg-white px-8 py-4 rounded-3xl shadow-soft">
                    <Icon icon={Star} className="text-secondary" size={40} />
                    <span>{score} / 10 richtig</span>
                </div>
                <button
                    onClick={onClose}
                    className="bg-primary text-white text-2xl font-bold px-12 py-6 rounded-3xl shadow-lg hover:scale-105 transition-transform"
                >
                    Weiter
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-paper p-6">
            <header className="flex justify-between items-center mb-12">
                <button onClick={onClose} className="p-4 hover:bg-neutral-soft rounded-2xl transition-colors">
                    <Icon icon={X} size={32} />
                </button>
                <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-inner font-bold text-xl">
                    <Star className="text-secondary fill-secondary" size={24} />
                    <span>{score}</span>
                </div>
                <div className="text-neutral-400 font-medium">Aufgabe {totalTasks + 1} / 10</div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full space-y-12">
                <div className="relative">
                    <Robot state={robotState} className="w-56 h-56" />
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 1 }}
                                exit={{ scale: 2, opacity: 0 }}
                                className={`absolute inset-0 flex items-center justify-center ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
                            >
                                <Icon icon={feedback === 'correct' ? Check : X} size={80} strokeWidth={4} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="text-center space-y-4 w-full">
                    {currentTask?.metadata?.step !== undefined && subject === 'math' && currentTask.question.includes('+') ? (
                        <div className="w-full max-w-lg mx-auto">
                            <Zehnerstopp
                                start={parseInt(currentTask.question.split(' + ')[0])}
                                middle={parseInt(currentTask.question.split(' + ')[0]) + currentTask.metadata.step}
                                end={parseInt(currentTask.question.split(' + ')[0]) + parseInt(currentTask.question.split(' + ')[1])}
                            />
                        </div>
                    ) : subject === 'german' && currentTask?.metadata?.type === 'syllable_count' ? (
                        <div className="flex justify-center">
                            <SyllableHighlight word={currentTask.metadata.word || ''} syllables={currentTask.metadata.syllables || [currentTask.metadata.word || '']} />
                        </div>
                    ) : (
                        <div className="text-7xl font-display text-primary bg-white px-12 py-8 rounded-[40px] shadow-soft min-w-[300px]">
                            {currentTask?.question}
                        </div>
                    )}
                </div>

                {(subject === 'math' && !currentTask?.options) || (typeof currentTask?.answer === 'number' && !currentTask?.options && currentTask?.metadata?.type !== 'vowel_click') ? (
                    <div className="grid grid-cols-3 gap-4 max-w-sm w-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                            <button
                                key={n}
                                onClick={() => handleNumpad(n.toString())}
                                className="aspect-square text-3xl font-bold rounded-2xl shadow-soft transition-all active:scale-95 bg-white hover:bg-primary/5"
                            >
                                {n}
                            </button>
                        ))}
                        <div />
                        <button
                            onClick={() => handleNumpad('0')}
                            className="aspect-square text-3xl font-bold rounded-2xl shadow-soft transition-all active:scale-95 bg-white hover:bg-primary/5"
                        >
                            0
                        </button>
                        <div />
                    </div>
                ) : currentTask?.metadata?.type === 'vowel_click' ? (
                    <div className="flex flex-wrap justify-center gap-4">
                        {currentTask.metadata.word.split('').map((char: string, i: number) => {
                            const isVowel = /[AEIOUäöü]/i.test(char);
                            const isSelected = selectedIndices.includes(i);
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (isSelected || feedback) return;
                                        const newIndices = [...selectedIndices, i];
                                        setSelectedIndices(newIndices);
                                        const vowelCount = newIndices.filter(idx => /[AEIOUäöü]/i.test(currentTask.metadata.word[idx])).length;
                                        const consonantCount = newIndices.length - vowelCount;
                                        if (consonantCount >= 2) {
                                            // Allow 1 mistake, fail after 2
                                            handleAnswer('WRONG');
                                        } else if (vowelCount === currentTask.answer) {
                                            handleAnswer(currentTask.answer);
                                        }
                                    }}
                                    className={`w-20 h-24 text-4xl font-bold rounded-2xl shadow-soft flex items-center justify-center transition-all ${isSelected ? (isVowel ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600') : 'bg-white hover:bg-neutral-50'}`}
                                >
                                    {char}
                                </button>
                            );
                        })}
                    </div>
                ) : currentTask?.metadata?.type === 'sentence_build' ? (
                    <div className="space-y-8 w-full max-w-2xl">
                        <div className="min-h-[100px] p-6 bg-white rounded-3xl border-4 border-dashed border-neutral-soft flex flex-wrap gap-4 items-center justify-center text-3xl font-bold">
                            {sentenceParts.map((part, i) => (
                                <span key={i} className="text-primary">{part}</span>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {currentTask.metadata.parts.map((part: string, i: number) => (
                                <button
                                    key={i}
                                    disabled={sentenceParts.includes(part)}
                                    onClick={() => {
                                        const newParts = [...sentenceParts, part];
                                        setSentenceParts(newParts);
                                        if (newParts.length === currentTask.metadata.parts.length) {
                                            handleAnswer(newParts.join(' '));
                                        }
                                    }}
                                    className={`px-8 py-4 bg-white rounded-2xl shadow-soft text-2xl font-bold transition-all ${sentenceParts.includes(part) ? 'opacity-30' : 'hover:scale-105 active:scale-95'}`}
                                >
                                    {part}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : currentTask?.metadata?.type === 'word_build' ? (
                    <div className="space-y-8 w-full max-w-2xl">
                        <div className="min-h-[100px] p-6 bg-white rounded-3xl border-4 border-dashed border-neutral-soft flex flex-wrap gap-3 items-center justify-center text-4xl font-bold tracking-wide">
                            {wordLetters.length > 0 ? wordLetters.map((letter, i) => (
                                <span key={`${letter}-${i}`} className="text-primary">{letter}</span>
                            )) : (
                                <span className="text-neutral-300">...</span>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {currentTask.metadata.letters.map((letter: string, i: number) => (
                                <button
                                    key={`${letter}-${i}`}
                                    disabled={feedback !== null}
                                    onClick={() => {
                                        const nextLetters = [...wordLetters, letter];
                                        setWordLetters(nextLetters);
                                        if (nextLetters.length === currentTask.answer.toString().length) {
                                            handleAnswer(nextLetters.join(''));
                                        }
                                    }}
                                    className="w-14 h-14 bg-white rounded-xl shadow-soft text-2xl font-bold hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setWordLetters(prev => prev.slice(0, -1))}
                                disabled={wordLetters.length === 0 || feedback !== null}
                                className="px-5 py-3 bg-white rounded-xl shadow-soft text-lg font-bold disabled:opacity-40"
                            >
                                Zurück
                            </button>
                            <button
                                onClick={() => setWordLetters([])}
                                disabled={wordLetters.length === 0 || feedback !== null}
                                className="px-5 py-3 bg-white rounded-xl shadow-soft text-lg font-bold disabled:opacity-40"
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl text-2xl font-bold">
                        {currentTask?.options?.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className="p-6 bg-white rounded-3xl shadow-soft border-4 border-transparent hover:border-primary transition-all text-center"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
