import * as React from 'react';
import { Settings as SettingsIcon, Database, Shield, Info } from 'lucide-react';
import { Icon } from '@/components/Icon';

export const Settings = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            <header>
                <h1 className="text-4xl">Einstellungen</h1>
                <p className="text-neutral-500">Verwalte die App und das Curriculum.</p>
            </header>

            <div className="grid gap-6">
                <SettingsOption
                    icon={Database}
                    title="Datenbank verwalten"
                    desc="Fortschritte exportieren oder zurücksetzen."
                />
                <SettingsOption
                    icon={Shield}
                    title="Kindersicherung"
                    desc="Zugriff auf den Lehrer-Bereich einschränken."
                />
                <SettingsOption
                    icon={Info}
                    title="Über LernHeld"
                    desc="Version 0.1.0 - Entwicklungspreview."
                />
            </div>
        </div>
    );
};

const SettingsOption = ({ icon, title, desc }: any) => (
    <button
        onClick={() => alert(`${title} ist in Arbeit und kommt bald!`)}
        className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-soft hover:scale-[1.02] active:scale-95 transition-all text-left border-2 border-transparent hover:border-primary/20"
    >
        <div className="p-4 rounded-2xl bg-neutral-soft text-primary">
            <Icon icon={icon} size={32} />
        </div>
        <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-neutral-500">{desc}</p>
        </div>
    </button>
);
