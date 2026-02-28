import React from 'react';
import { FileDown, GraduationCap, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { Icon } from '@/components/Icon';

export const Dashboard = () => {
    const exportPDF = async () => {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('LernHeld - Fortschrittsbericht', 20, 20);
        doc.setFontSize(12);
        doc.text('Schüler: Test-User', 20, 35);
        doc.text('Mathe: Phase 3 (Zehnerübergang) - Erledigt', 20, 45);
        doc.text('Deutsch: Phase 2 (Silben zählen) - Erledigt', 20, 55);
        doc.save('LernHeld_Report.pdf');
    };

    const badges = [
        { id: 1, name: 'Zehner-Sprinter', earned: true, icon: Award },
        { id: 2, name: 'Blitz-Leser', earned: true, icon: Award },
        { id: 3, name: '1x1-Meister', earned: false, icon: Award },
    ];

    const stuckArea = {
        subject: "Zahlzerlegung 10",
        reason: "Plateau erreicht",
        suggestion: "Prüfe Voraussetzung: Zahlzerlegung bis 5"
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
                <StatCard icon={GraduationCap} title="Gelernte Phasen" value="5" color="text-primary" />
                <StatCard icon={TrendingUp} title="Genauigkeit" value="92%" color="text-accent" />
                <StatCard icon={Award} title="Sterne gesammelt" value="124" color="text-secondary" />
            </div>

            {/* Stuck-Flag Analysis */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-3 bg-red-100 text-red-500 rounded-xl">
                    <Icon icon={AlertCircle} size={24} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-red-900 font-bold">Stuck-Flag: {stuckArea.subject}</h3>
                    <p className="text-red-700 text-sm">{stuckArea.reason}. {stuckArea.suggestion}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h2 className="text-2xl mb-4 text-primary">Letzte Aktivitäten</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-neutral-soft text-neutral-400 uppercase text-sm">
                                <th className="py-2">Datum</th>
                                <th>Thema</th>
                                <th>Ergebnis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-neutral-soft">
                                <td className="py-4">23.02.2026</td>
                                <td>Zehnerübergang</td>
                                <td className="text-accent font-bold">10/10</td>
                            </tr>
                            <tr className="border-b border-neutral-soft">
                                <td className="py-4">22.02.2026</td>
                                <td>Silbenleser</td>
                                <td className="text-accent font-bold">8/10</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h2 className="text-2xl mb-4 text-primary">Meilensteine</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {badges.map(badge => (
                            <div key={badge.id} className={`p-4 rounded-xl border flex items-center gap-3 ${badge.earned ? 'bg-green-50 border-green-100 text-green-700' : 'bg-neutral-50 border-neutral-100 text-neutral-400 grayscale'}`}>
                                <Icon icon={badge.icon} size={20} />
                                <span className="font-medium">{badge.name}</span>
                            </div>
                        ))}
                    </div>
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
