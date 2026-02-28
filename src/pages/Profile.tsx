import React, { useState, useEffect } from 'react';
import { UserPlus, User as UserIcon, CheckCircle } from 'lucide-react';
import { Icon } from '@/components/Icon';

interface User {
    id: string;
    name: string;
    avatar?: string;
}

export const Profile = ({ onUserSelect, activeUser }: { onUserSelect: (user: User) => void, activeUser: User | null }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(() => {
                console.warn('Benutzer konnten nicht geladen werden (Server offline?).');
            });
    }, []);

    const createUser = () => {
        if (!newName) return;
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, avatar: 'default' })
        })
            .then(res => res.json())
            .then(user => {
                setUsers([...users, user]);
                setNewName('');
            })
            .catch(() => {
                alert('Profil konnte nicht erstellt werden. Ist der Server gestartet?');
            });
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            <header className="text-center">
                <h1 className="text-4xl">Wer lernt heute?</h1>
                <p className="text-neutral-500">Wähle dein Profil oder erstelle ein neues.</p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {users.map(user => (
                    <button
                        key={user.id}
                        onClick={() => onUserSelect(user)}
                        className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-4 ${activeUser?.id === user.id ? 'border-primary bg-primary/5' : 'border-neutral-soft bg-white hover:border-primary/50'}`}
                    >
                        <div className={`p-4 rounded-2xl ${activeUser?.id === user.id ? 'bg-primary text-white' : 'bg-neutral-soft text-neutral-400'}`}>
                            <Icon icon={UserIcon} size={48} />
                        </div>
                        <span className="font-bold text-xl">{user.name}</span>
                        {activeUser?.id === user.id && <Icon icon={CheckCircle} className="text-primary" size={20} />}
                    </button>
                ))}

                <div className="p-6 rounded-3xl border-4 border-dashed border-neutral-soft flex flex-col items-center gap-4 bg-white/50">
                    <div className="p-4 rounded-2xl bg-neutral-soft text-neutral-400">
                        <Icon icon={UserPlus} size={48} />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <input
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="Dein Name..."
                            className="bg-neutral-soft px-4 py-2 rounded-xl border-none text-center focus:ring-2 ring-primary"
                        />
                        <button
                            onClick={createUser}
                            className="bg-primary text-white py-2 rounded-xl font-bold hover:scale-105 transition-transform"
                        >
                            Hinzufügen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
