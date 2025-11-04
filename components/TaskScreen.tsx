import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { db, User, CrawlTask, customizableTaskIds } from '../lib/mockDatabase';
import { TaskLoadingAnimation } from './TaskLoadingAnimation';
import { CrawlTaskModal } from './CrawlTaskModal';
import { ClockIcon, HeadsetIcon, EnvelopeIcon, PlusCircleIcon } from './icons';

// Reusable Task Card component based on the new design
const NewTaskCard: React.FC<{ imageSrc: string; name: string; price: number; income: number; timestamp?: string; onClick?: () => void }> = ({ imageSrc, name, price, income, timestamp, onClick }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-[#f0ead6] text-black rounded-lg p-3">
            <div className="flex gap-3 items-center">
                <img src={imageSrc} alt={name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow flex justify-between items-center w-full min-w-0">
                    <div className="flex-grow min-w-0">
                         <p className="font-semibold text-sm leading-tight mb-2 truncate">{name}</p>
                         <div className="flex gap-4">
                             <div>
                                 <p className="text-xs text-gray-600">{t('taskPrice')}</p>
                                 <p className="font-bold text-black">${price.toFixed(2)}</p>
                             </div>
                             <div>
                                 <p className="text-xs text-gray-600">{t('taskIncome')}</p>
                                 <p className="font-bold text-black">${income.toFixed(2)}</p>
                             </div>
                         </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                        {onClick ? (
                            <button onClick={onClick} className="bg-[#2e194a] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md hover:bg-[#4a2e73] transition-colors">
                                {t('toComplete')}
                            </button>
                        ) : (
                            <div className="text-right">
                                <p className="text-xs text-gray-600">{t('completionTime')}</p>
                                <p className="font-bold text-black text-xs">{timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CrawlControlBox: React.FC<{
    user: User;
    tasks: { inProgress: CrawlTask[], completed: {task: CrawlTask, timestamp: string}[] };
    onCrawl: () => void;
}> = ({ user, tasks, onCrawl }) => {
    const { t } = useTranslation();
    const totalBalance = user.mainBalance + user.withdrawalBalance;
    const completedCount = tasks.completed.length;
    const inProgressCount = tasks.inProgress.length;
    
    const activeCrawlSetIndex = [1, 2, 3].find(index => user.crawlSets?.[index]?.enabled);
    const totalCount = activeCrawlSetIndex ? customizableTaskIds[activeCrawlSetIndex].length : 0;

    return (
        <div className="bg-[#2e194a] rounded-lg p-4 mb-4 text-white">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs text-gray-400">{t('totalBalance')}</p>
                    <p className="text-2xl font-bold">{totalBalance.toFixed(2)} <span className="text-lg">USDT</span></p>
                </div>
            </div>
            <div className="grid grid-cols-3 text-center mb-4 py-2">
                <div>
                    <p className="text-xl font-bold">{completedCount}</p>
                    <p className="text-xs text-gray-400">{t('completed')}</p>
                </div>
                <div>
                    <p className="text-xl font-bold">{totalCount}</p>
                    <p className="text-xs text-gray-400">{t('crawlTotal')}</p>
                </div>
                <div className="relative flex flex-col items-center justify-center">
                     <div className="absolute w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse"></div>
                    <div className="relative">
                        <p className="text-xl font-bold">{inProgressCount}</p>
                        <p className="text-xs text-gray-400">{t('inProgress')}</p>
                    </div>
                </div>
            </div>
            <button
                onClick={onCrawl}
                className="w-full bg-black text-white font-bold py-3 rounded-full text-lg shadow-lg hover:bg-gray-800 transition-colors"
            >
                {t('crawlButton')}
            </button>
        </div>
    );
};


// --- Component for Daily VIP Tasks (when Crawling is disabled) ---
const DailyVipTaskScreen: React.FC<{ user: User; showInfoModal: (title: string, message: string, type: 'success' | 'error' | 'info') => void; }> = ({ user: initialUser, showInfoModal }) => {
    const { t } = useTranslation();
    const [user, setUser] = useState(initialUser);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'inProgress' | 'completed'>('inProgress');

    const forceUserUpdate = () => {
        const updatedUser = db.findUserById(initialUser.id);
        if (updatedUser) {
            setUser({ ...updatedUser });
        }
    };
    
    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    const activeVipLevel = useMemo(() => {
        return db.getVipLevels(user.id).find(level => level.status === 'active');
    }, [user.id, user.vipLevel]);

    const isTaskAvailable = !user.taskNextAvailableAt || Date.now() >= user.taskNextAvailableAt;
    const tasksRemaining = isTaskAvailable ? (activeVipLevel?.tasks || 0) : 0;
    const totalTasks = activeVipLevel?.tasks || 0;

    const [timeLeft, setTimeLeft] = useState(() => {
        if (user.taskNextAvailableAt && user.taskNextAvailableAt > Date.now()) {
            return Math.floor((user.taskNextAvailableAt - Date.now()) / 1000);
        }
        return 24 * 3600; // Default to 24h if no task completed yet
    });

    useEffect(() => {
        if (timeLeft <= 0) {
            forceUserUpdate();
            setTimeLeft(24 * 3600); // Reset for next day
        }
        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime > 0 ? prevTime - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const handleCompleteTask = () => {
        setIsLoading(true);
        setTimeout(() => {
            const result = db.completeTask(user.id);
            if (result.success) {
                forceUserUpdate(); 
            } else if (result.message) {
                showInfoModal(t('errorTitle'), t(result.message as any) || result.message, 'error');
            }
            setIsLoading(false);
        }, 2000);
    };
    
    const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
        <button
            type="button"
            onClick={onClick}
            className={`w-1/2 py-2 text-center text-sm font-semibold rounded-md transition-colors ${
                active ? 'bg-[#1c0f3b] text-white' : 'bg-transparent text-gray-400 hover:text-white'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="space-y-4 relative">
             {isLoading && <TaskLoadingAnimation />}
            <div className="bg-[#63d5c4] text-black font-bold p-3 rounded-lg flex items-center justify-center gap-2 shadow-lg">
                <ClockIcon className="w-6 h-6" />
                <span>{formatTime(timeLeft)}</span>
                <span className="flex-grow text-center">{t('taskReset')}</span>
            </div>
            <div className="bg-[#2e194a] rounded-lg p-4 grid grid-cols-2 text-center text-white">
                 <div>
                    <p className="font-bold text-lg">{totalTasks}</p>
                    <p className="text-xs text-gray-300">{t('totalTasksToday')}</p>
                </div>
                <div>
                    <p className="font-bold text-lg">{tasksRemaining}</p>
                    <p className="text-xs text-gray-300">{t('remainingTasksToday')}</p>
                </div>
            </div>

            <div className="bg-[#2e194a] rounded-lg p-1">
                <div className="flex">
                    <TabButton active={activeTab === 'inProgress'} onClick={() => setActiveTab('inProgress')}>{t('inProgress')}</TabButton>
                    <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>{t('completed')}</TabButton>
                </div>
            </div>
            <div className="p-1 min-h-[40vh] space-y-3">
                {activeTab === 'inProgress' && (
                    isTaskAvailable && activeVipLevel && tasksRemaining > 0 ? (
                        Array.from({ length: tasksRemaining }).map((_, i) => 
                            <NewTaskCard 
                                key={i}
                                imageSrc={activeVipLevel.imageSrc}
                                name={t('taskCompanyName')}
                                price={0.00}
                                income={activeVipLevel.benefit}
                                onClick={handleCompleteTask}
                            />
                        )
                    ) : (
                        <div className="text-center text-gray-400 pt-16">
                            <p>{t('noTasksAvailable')}</p>
                        </div>
                    )
                )}
                {activeTab === 'completed' && (
                    !isTaskAvailable || tasksRemaining === 0 && totalTasks > 0 ? (
                        <NewTaskCard 
                            imageSrc={activeVipLevel?.imageSrc || ''}
                            name={t('taskCompanyName')}
                            price={0.00}
                            income={activeVipLevel?.benefit || 0}
                            timestamp={new Date(user.taskNextAvailableAt! - (24 * 60 * 60 * 1000)).toISOString()}
                        />
                    ) : (
                         <div className="text-center text-gray-400 pt-16">
                            <p>{t('noCompletedTasksToday')}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

// --- Components for Crawling Tasks (when Crawling is enabled) ---
const CrawlingTaskScreen: React.FC<{ user: User; navigateTo: (view: string) => void; setIndex: number; showInfoModal: (title: string, message: string, type: 'success' | 'error' | 'info') => void; }> = ({ user, navigateTo, setIndex, showInfoModal }) => {
    const { t } = useTranslation();
    const [localUser, setLocalUser] = useState(user);
    const [tasks, setTasks] = useState<{inProgress: CrawlTask[], completed: {task: CrawlTask, timestamp: string}[]}>({ inProgress: [], completed: [] });
    const [selectedTask, setSelectedTask] = useState<CrawlTask | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'inProgress' | 'completed'>('inProgress');
    const [timeLeft, setTimeLeft] = useState(24 * 3600); // Cosmetic timer

    const forceUserUpdate = () => {
        const updatedUser = db.findUserById(user.id);
        if (updatedUser) {
            setLocalUser({ ...updatedUser });
        }
    };
    
    useEffect(() => {
        setLocalUser(user);
    }, [user]);

    useEffect(() => {
        const crawlSet = localUser.crawlSets?.[setIndex];
        if (!crawlSet) return;

        const inProgress = (crawlSet.activeTaskIds || [])
            .map(id => db.getCrawlTaskForUser(localUser.id, id, setIndex))
            .filter((t): t is CrawlTask => t !== undefined);
        
        const completed = (crawlSet.completedTasks || [])
            .map(c => ({ task: db.getCrawlTaskForUser(localUser.id, c.taskId, setIndex), timestamp: c.timestamp }))
            .filter((c): c is {task: CrawlTask, timestamp: string} => c.task !== undefined)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setTasks({ inProgress, completed });
    }, [localUser, setIndex]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 24 * 3600));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const handleCrawlClick = () => {
        if (tasks.inProgress.length > 0) {
            showInfoModal(t('hint'), t('taskInProgressError'), 'info');
            return;
        }
        const nextTask = db.getNextCrawlTask(localUser.id, setIndex);
        if (nextTask) {
            forceUserUpdate();
        } else {
            showInfoModal(t('hint'), t('noTasksAvailable'), 'info');
        }
    };

    const handleCompleteTask = (taskId: string) => {
        setIsLoading(true);
        setTimeout(() => {
            const result = db.completeCrawlTask(localUser.id, taskId, setIndex);
            setSelectedTask(null); // Close the completion modal first
            if (result.success) {
                forceUserUpdate();
            } else {
                showInfoModal(t('insufficientBalanceTitle'), t(result.message as any) || result.message, 'error');
            }
            setIsLoading(false);
        }, 2000);
    };

    const handleRecharge = () => {
        setSelectedTask(null);
        navigateTo('recharge_select');
    };

    const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
        <button
            type="button"
            onClick={onClick}
            className={`w-1/2 py-2 text-center text-sm font-semibold rounded-md transition-colors ${
                active ? 'bg-[#1c0f3b] text-white' : 'bg-transparent text-gray-400 hover:text-white'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="space-y-4 relative">
            {isLoading && <TaskLoadingAnimation />}
            
            <CrawlControlBox user={localUser} tasks={tasks} onCrawl={handleCrawlClick} />

            <div className="bg-[#2e194a] rounded-lg p-1">
                <div className="flex">
                    <TabButton active={activeTab === 'inProgress'} onClick={() => setActiveTab('inProgress')}>
                        {t('inProgress')}
                    </TabButton>
                    <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
                        {t('completed')}
                    </TabButton>
                </div>
            </div>

            <div className="p-1 min-h-[40vh] space-y-3">
                {activeTab === 'inProgress' && (
                    tasks.inProgress.length > 0 ? (
                        tasks.inProgress.map(task => (
                             <NewTaskCard 
                                key={task.id}
                                imageSrc={task.imageSrc}
                                name={task.name}
                                price={task.price}
                                income={task.income}
                                onClick={() => setSelectedTask(task)}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-400 py-16">
                            <p>{t('getCrawlTaskPrompt')}</p>
                        </div>
                    )
                )}
                
                {activeTab === 'completed' && (
                    tasks.completed.length > 0 ? (
                        tasks.completed.map(item => (
                            <NewTaskCard 
                                key={`${item.task.id}-${item.timestamp}`}
                                imageSrc={item.task.imageSrc}
                                name={item.task.name}
                                price={item.task.price}
                                income={item.task.income}
                                timestamp={item.timestamp}
                            />
                        ))
                    ) : (
                         <div className="text-center text-gray-400 py-16">
                            <p>{t('noCompletedTasks')}</p>
                        </div>
                    )
                )}
            </div>

            {selectedTask && (
                <CrawlTaskModal 
                    task={selectedTask}
                    user={localUser}
                    onClose={() => setSelectedTask(null)}
                    onComplete={handleCompleteTask}
                    onRecharge={handleRecharge}
                />
            )}
        </div>
    );
};


// --- Main TaskScreen Component (Conditional Renderer) ---

interface TaskScreenProps {
    user: User;
    navigateTo: (view: string) => void;
    showInfoModal: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const TaskScreen: React.FC<TaskScreenProps> = ({ user, navigateTo, showInfoModal }) => {
    const activeCrawlSetIndex = [1, 2, 3].find(index => user.crawlSets?.[index]?.enabled);

    return (
        <div className="px-4 relative">
            {activeCrawlSetIndex ? (
                <CrawlingTaskScreen user={user} navigateTo={navigateTo} setIndex={activeCrawlSetIndex} showInfoModal={showInfoModal} />
            ) : (
                <DailyVipTaskScreen user={user} showInfoModal={showInfoModal} />
            )}
        </div>
    );
};