import React from 'react';
import curriculumConfig from '../config/curriculum-config.json';
import { Icon } from './Icon';
import { Calculator, BookOpen, ChevronRight } from 'lucide-react';

export const ExerciseSelection = ({ onSelect }: { onSelect: (subject: string, phaseId: string) => void }) => {
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12">
            <header className="text-center">
                <h1 className="text-4xl text-primary underline decoration-secondary decoration-8 underline-offset-8">Was möchtest du üben?</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Math Section */}
                <SubjectCard
                    title="Mathematik"
                    icon={Calculator}
                    color="bg-primary text-white"
                    phases={curriculumConfig.math}
                    onSelect={(id: string) => onSelect('math', id)}
                />

                {/* German Section */}
                <SubjectCard
                    title="Deutsch"
                    icon={BookOpen}
                    color="bg-accent text-white"
                    phases={curriculumConfig.german}
                    onSelect={(id: string) => onSelect('german', id)}
                />
            </div>
        </div>
    );
};

const SubjectCard = ({ title, icon, color, phases, onSelect }: any) => (
    <div className="bg-white rounded-3xl p-8 shadow-soft space-y-6">
        <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${color}`}>
                <Icon icon={icon} size={32} />
            </div>
            <h2 className="text-3xl font-display">{title}</h2>
        </div>

        <div className="space-y-4">
            {phases.map((phase: any) => (
                <button
                    key={phase.id}
                    onClick={() => onSelect(phase.id)}
                    className="w-full group flex items-center justify-between p-5 rounded-2xl border-2 border-neutral-soft hover:border-primary hover:bg-primary/5 transition-all"
                >
                    <div className="text-left">
                        <p className="font-bold text-lg group-hover:text-primary">{phase.name}</p>
                        <p className="text-sm text-neutral-400 uppercase tracking-widest">{phase.type}</p>
                    </div>
                    <Icon icon={ChevronRight} className="text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
            ))}
        </div>
    </div>
);
