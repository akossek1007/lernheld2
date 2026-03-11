import React, { useEffect, useMemo, useState } from 'react';
import { FileDown, GraduationCap, TrendingUp, Award, AlertCircle, ListChecks } from 'lucide-react';
import { Icon } from '@/components/Icon';

interface Attempt {
    id: number;
    user_id: string;
    phase_id: string;
    subject: string;
    task_type: string;
    prompt: string;
    expected_answer: string;
    learner_answer: string;
    is_correct: number;
    target_word: string | null;
    attempted_at: string;
}

export const Dashboard = () => {
    const [attempts, setAttempts] = useState<Attempt[]>([]);

    useEffect(() => {
        fetch('/api/attempts')
            .then(res => res.json())
            .then(data => setAttempts(data))
            .catch(() => {
                console.warn('Aufgabenversuche konnten nicht geladen werden.');
            });
    }, []);

    const stats = useMemo(() => {
        if (attempts.length === 0) {
            return {
                total: 0,
                accuracy: 0,
                uniqueWords: 0,
                latest: null as Attempt | null
            };
        }

        const total = attempts.length;
        const correct = attempts.filter(a => a.is_correct === 1).length;
        const words = attempts.map(a => a.target_word).filter(Boolean) as string[];
        const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
        return {
            total,
            accuracy: Math.round((correct / total) * 100),
            uniqueWords,
            latest: attempts[0]
        };
    }, [attempts]);

    const weakWords = useMemo(() => {
        const map = new Map<string, { total: number; correct: number }>();
        attempts.forEach(a => {
            if (!a.target_word) return;
            const key = a.target_word.toLowerCase();
            const entry = map.get(key) || { total: 0, correct: 0 };
            entry.total += 1;
            entry.correct += a.is_correct === 1 ? 1 : 0;
            map.set(key, entry);
        });

        return Array.from(map.entries())
            .filter(([, v]) => v.total >= 3)
            .map(([word, v]) => ({
                word,
                accuracy: Math.round((v.correct / v.total) * 100),
                attempts: v.total
            }))
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 8);
    }, [attempts]);

    const exportPDF = async () => {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('LernHeld - Fortschrittsbericht', 20, 20);
        doc.setFontSize(12);
        doc.text(`Versuche gesamt: ${stats.total}`, 20, 35);
        doc.text(`Genauigkeit: ${stats.accuracy}%`, 20, 45);
        doc.text(`Einzigartige Wörter: ${stats.uniqueWords}`, 20, 55);
        doc.save('LernHeld_Report.pdf');
    };

    const stuckArea = weakWords.length > 0
        ? {
            subject: weakWords[0].word,
            reason: `nur ${weakWords[0].accuracy}% korrekt bei ${weakWords[0].attempts} Versuchen`,
            suggestion: 'Wort gezielt wiederholen (3x aktiv schreiben).'
        }
        : {
            subject: 'Keine Auffälligkeit',
            reason: 'noch zu wenig Daten',
            suggestion: 'mehr Versuche sammeln.'
        };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl">Lehrer-Bereich</h1>
                    <p className="text-neutral-500">Übersicht über den Lernfortschritt</p>
                </div>
                <button
                    onClick={exportPDF}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl shadow-soft hover:scale-105 transition-transform"
                >
                    <Icon icon={FileDown} size={20} />
                    PDF Export
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={ListChecks} title="Versuche gesamt" value={stats.total.toString()} color="text-primary" />
                <StatCard icon={TrendingUp} title="Genauigkeit" value={`${stats.accuracy}%`} color="text-accent" />
                <StatCard icon={GraduationCap} title="Wörter" value={stats.uniqueWords.toString()} color="text-secondary" />
            </div>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-3 bg-red-100 text-red-500 rounded-xl">
                    <Icon icon={AlertCircle} size={24} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-red-900 font-bold">Fokuswort: {stuckArea.subject}</h3>
                    <p className="text-red-700 text-sm">{stuckArea.reason}. {stuckArea.suggestion}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h2 className="text-2xl mb-4 text-primary">Schwache Wörter</h2>
                    {weakWords.length === 0 ? (
                        <p className="text-neutral-500">Noch keine verlässlichen Daten.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-soft text-neutral-400 uppercase text-sm">
                                    <th className="py-2">Wort</th>
                                    <th>Genauigkeit</th>
                                    <th>Versuche</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weakWords.map(word => (
                                    <tr key={word.word} className="border-b border-neutral-soft">
                                        <td className="py-3 font-bold text-primary">{word.word}</td>
                                        <td>{word.accuracy}%</td>
                                        <td>{word.attempts}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h2 className="text-2xl mb-4 text-primary">Letzte Versuche</h2>
                    {attempts.length === 0 ? (
                        <p className="text-neutral-500">Noch keine Versuche.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-soft text-neutral-400 uppercase text-sm">
                                    <th className="py-2">Zeit</th>
                                    <th>Wort</th>
                                    <th>Ergebnis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.slice(0, 8).map(attempt => (
                                    <tr key={attempt.id} className="border-b border-neutral-soft">
                                        <td className="py-3 text-sm text-neutral-500">{new Date(attempt.attempted_at).toLocaleString()}</td>
                                        <td className="font-medium">{attempt.target_word || '-'}</td>
                                        <td className={attempt.is_correct ? 'text-accent font-bold' : 'text-red-500 font-bold'}>
                                            {attempt.is_correct ? 'richtig' : 'falsch'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-soft flex items-center gap-4">
        <div className={`p-4 rounded-xl bg-neutral-soft ${color}`}>
            <Icon icon={icon} size={32} />
        </div>
        <div>
            <p className="text-neutral-500 font-medium">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    </div>
);
