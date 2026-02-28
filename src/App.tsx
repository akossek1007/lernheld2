import * as React from 'react';
import { useState } from 'react';
import { AppWindow as Home, GraduationCap, Settings, User } from 'lucide-react';
import { Icon } from './components/Icon';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Settings as SettingsPage } from './pages/Settings';
import { ExerciseSelection } from './components/ExerciseSelection';
import { Gameplay } from './components/Gameplay';
import { Zehnerstopp } from './components/animations/Zehnerstopp';
import { SyllableHighlight } from './components/animations/SyllableHighlight';

import { Robot, RobotState } from './components/Robot';

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [robotState, setRobotState] = useState<RobotState>('neutral');
    const [activeUser, setActiveUser] = useState<any>(null);
    const [selectedExercise, setSelectedExercise] = useState<any>(null);

    const cycleRobot = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent bubbling issues
        const states: RobotState[] = ['neutral', 'jubelnd', 'hilfsbereit'];
        const next = states[(states.indexOf(robotState) + 1) % states.length];
        setRobotState(next);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 overflow-y-auto pb-24">
                {activeTab === 'home' && (
                    <div className="p-8 space-y-12">
                        <section className="text-center space-y-4">
                            <div className="flex justify-center mb-8 interactive-robot-container p-12 -m-12 cursor-pointer" onClick={(e) => cycleRobot(e)}>
                                <Robot state={robotState} className="w-64 h-64 drop-shadow-2xl" />
                            </div>
                            <h1 className="text-6xl mb-4">Hallo Lernheld!</h1>
                            <p className="text-xl text-neutral-500">Klicke auf den Robot oder wähle eine Aufgabe!</p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div
                                className="space-y-4 cursor-pointer hover:scale-[1.02] transition-transform"
                                onClick={() => {
                                    if (!activeUser) { setActiveTab('profile'); return; }
                                    setSelectedExercise({ subject: 'math', id: 'm3' }); // Zehnerübergang
                                    setActiveTab('game');
                                }}
                            >
                                <h2 className="text-2xl text-primary font-bold">Mathe-Trick: Zehnerstopp</h2>
                                <Zehnerstopp start={7} middle={10} end={12} />
                            </div>
                            <div
                                className="space-y-4 cursor-pointer hover:scale-[1.02] transition-transform"
                                onClick={() => {
                                    if (!activeUser) { setActiveTab('profile'); return; }
                                    setSelectedExercise({ subject: 'german', id: 'd2' }); // Silben
                                    setActiveTab('game');
                                }}
                            >
                                <h2 className="text-2xl text-primary font-bold">Deutsch-Trick: Silben</h2>
                                <div className="h-32 flex items-center justify-center bg-white rounded-xl shadow-inner">
                                    <SyllableHighlight word="ROBOT" syllables={['RO', 'BOT']} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'learning' && (
                    <ExerciseSelection onSelect={(subject, id) => {
                        if (!activeUser) {
                            alert('Bitte wähle zuerst ein Profil aus!');
                            setActiveTab('profile');
                            return;
                        }
                        setSelectedExercise({ subject, id });
                        setActiveTab('game');
                    }} />
                )}

                {activeTab === 'game' && selectedExercise && (
                    <Gameplay
                        subject={selectedExercise.subject}
                        phaseId={selectedExercise.id}
                        userId={activeUser?.id}
                        onClose={() => {
                            setSelectedExercise(null);
                            setActiveTab('learning');
                        }}
                    />
                )}

                {activeTab === 'dashboard' && <Dashboard />}

                {activeTab === 'profile' && (
                    <Profile
                        activeUser={activeUser}
                        onUserSelect={(user) => {
                            setActiveUser(user);
                            setActiveTab('home');
                        }}
                    />
                )}

                {activeTab === 'settings' && <SettingsPage />}
            </main>

            {/* Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-soft p-4 flex justify-around items-center z-50">
                <NavButton
                    active={activeTab === 'home'}
                    onClick={() => setActiveTab('home')}
                    icon={Home}
                    label="Start"
                />
                <NavButton
                    active={activeTab === 'learning'}
                    onClick={() => setActiveTab('learning')}
                    icon={GraduationCap}
                    label="Lernen"
                />
                <NavButton
                    active={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                    icon={User}
                    label="Profil"
                />
                <NavButton
                    active={activeTab === 'dashboard'}
                    onClick={() => setActiveTab('dashboard')}
                    icon={Settings}
                    label="Admin"
                />
            </nav>
        </div>
    );
}

const NavButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] gap-1 transition-all ${active ? 'text-primary scale-110' : 'text-neutral-400 opacity-60'}`}
    >
        <Icon icon={icon} size={28} />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
);

export default App;
