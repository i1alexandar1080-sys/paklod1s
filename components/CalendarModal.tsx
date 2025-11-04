import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from './icons';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (date: Date) => void;
    initialDate: Date | null;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, onSelect, initialDate }) => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleDateClick = (day: number, date: Date) => {
        const newDate = new Date(date.getFullYear(), date.getMonth(), day);
        setSelectedDate(newDate);
    };

    const handleConfirm = () => {
        onSelect(selectedDate);
        onClose();
    };

    const generateMonths = () => {
        const months = [];
        const today = new Date();
        // Generate a range of months around today for the user to select from
        for (let i = -6; i <= 6; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
            months.push(date);
        }
        return months;
    };

    const monthsToRender = useMemo(generateMonths, []);
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Scroll to the initial month when opened, or the current month if initial is null
            const dateToScroll = initialDate || new Date();
            const targetId = `${dateToScroll.getFullYear()}-${dateToScroll.getMonth()}`;
            setTimeout(() => {
                const currentMonthEl = scrollContainerRef.current?.querySelector(`[data-month-id="${targetId}"]`);
                if (currentMonthEl) {
                  currentMonthEl.scrollIntoView({ block: 'center' });
                }
            }, 100);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen, initialDate]);

    if (!isOpen) return null;
    
    const MonthView: React.FC<{date: Date}> = ({ date }) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        // Sunday is 0, Monday is 1, ...
        const firstDayOfWeek = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        const days = [];
        // Add empty cells for days before the 1st of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
             const isSelected = selectedDate.getFullYear() === year &&
                               selectedDate.getMonth() === month &&
                               selectedDate.getDate() === day;
            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day, date)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md text-sm ${
                        isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="mb-6" data-month-id={`${year}-${month}`}>
                <h3 className="text-center font-semibold mb-3">{`${year}/${(month + 1).toString().padStart(2, '0')}`}</h3>
                <div className="grid grid-cols-7 gap-1 justify-items-center">
                    {dayHeaders.map(d => <div key={d} className="w-10 h-10 flex items-center justify-center text-xs text-gray-500 font-bold">{d}</div>)}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-sm flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b relative flex-shrink-0">
                    <h2 className="text-center font-bold text-black">{t('selectionPeriod')}</h2>
                    <button onClick={onClose} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-black">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-4 text-black">
                    {monthsToRender.map(month => (
                       <MonthView key={month.toISOString()} date={month} />
                    ))}
                </div>
                 <div className="p-4 border-t flex-shrink-0">
                    <button onClick={handleConfirm} className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors">
                        {t('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};