import { useState, useRef, useEffect } from 'react';
import DragHandle from './components/DragHandle';
import { IconEditPencil } from './components/icons';

interface DateRangeCustomRangeProps {
  /** Whether the bottom sheet is visible */
  isVisible: boolean;
  /** Initial start date */
  initialStartDate?: Date | null;
  /** Initial end date */
  initialEndDate?: Date | null;
  /** Callback when dates are selected */
  onSelectDates?: (startDate: Date | null, endDate: Date | null) => void;
  /** Callback when the sheet is dismissed */
  onDismiss?: () => void;
  /** Callback when Save button is pressed */
  onSave?: () => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DateRangeCustomRange = ({
  isVisible,
  initialStartDate = null,
  initialEndDate = null,
  onSelectDates,
  onDismiss,
  onSave,
}: DateRangeCustomRangeProps) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentMonthRef = useRef<HTMLDivElement>(null);

  // Drag to scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (isVisible && currentMonthRef.current) {
      currentMonthRef.current.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const colors = {
    primary: '#1d7883',
    textDark: '#0f2b4d',
    textMuted: '#60758f',
    textDisabled: '#b8c0ca',
    white: '#ffffff',
    borderLight: '#f7f3f2',
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5;
    scrollRef.current.scrollTop = scrollTop - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Generate months from Jan 2020 to current month
  const generateMonths = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const months: { year: number; month: number }[] = [];
    for (let year = 2020; year <= currentYear; year++) {
      const lastMonth = year === currentYear ? currentMonth : 11;
      for (let month = 0; month <= lastMonth; month++) {
        months.push({ year, month });
      }
    }
    return months;
  };

  // Get days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the day of week the month starts on (0 = Sunday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if a date is the same as another date
  const isSameDay = (d1: Date | null, d2: Date) => {
    if (!d1) return false;
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  };

  // Check if a date is between start and end
  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  // Handle day click
  const handleDayClick = (year: number, month: number, day: number) => {
    const clickedDate = new Date(year, month, day);
    
    if (!startDate || (startDate && endDate)) {
      // First selection or reset
      setStartDate(clickedDate);
      setEndDate(null);
      onSelectDates?.(clickedDate, null);
    } else {
      // Second selection
      if (clickedDate < startDate) {
        // If clicked date is before start, swap them
        setEndDate(startDate);
        setStartDate(clickedDate);
        onSelectDates?.(clickedDate, startDate);
      } else {
        setEndDate(clickedDate);
        onSelectDates?.(startDate, clickedDate);
      }
    }
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const months = generateMonths();
  const today = new Date();

  // Generate calendar grid for a month
  const renderMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const weeks: number[][] = [];
    
    let currentWeek: number[] = [];
    
    // Fill in days from previous month
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(prevMonthDays - firstDay + 1 + i - 100); // Negative to mark as prev month
    }
    
    // Fill in days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill in days from next month
    if (currentWeek.length > 0) {
      let nextDay = 1;
      while (currentWeek.length < 7) {
        currentWeek.push(nextDay + 100); // Mark as next month
        nextDay++;
      }
      weeks.push(currentWeek);
    }

    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

    return (
      <div
        key={`${year}-${month}`}
        ref={isCurrentMonth ? currentMonthRef : undefined}
        style={{ marginBottom: 56 }}
      >
        {/* Month header */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 15 }}>
          <span style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 15,
            fontWeight: 400,
            color: colors.textDark,
            lineHeight: '22.5px',
          }}>
            {MONTHS[month]}
          </span>
          <span style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 15,
            fontWeight: 400,
            color: colors.textDark,
            lineHeight: '22.5px',
          }}>
            {year}
          </span>
        </div>

        {/* Days grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', justifyContent: 'space-between' }}>
              {week.map((day, di) => {
                const isOutside = day < 1 || day > 100;
                const actualDay = day < 1 ? day + 100 : day > 100 ? day - 100 : day;
                const currentDate = new Date(year, month, day);
                const isStart = !isOutside && isSameDay(startDate, currentDate);
                const isEnd = !isOutside && isSameDay(endDate, currentDate);
                const inRange = !isOutside && isInRange(currentDate);

                return (
                  <button
                    key={di}
                    onClick={() => !isOutside && handleDayClick(year, month, day)}
                    disabled={isOutside}
                    style={{
                      width: 37,
                      height: 37,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      borderRadius: isStart || isEnd ? 18.5 : 0,
                      backgroundColor: isStart || isEnd
                        ? colors.primary
                        : inRange
                        ? 'rgba(29, 120, 131, 0.1)'
                        : 'transparent',
                      cursor: isOutside ? 'default' : 'pointer',
                      padding: 0,
                    }}
                  >
                    <span style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: 15,
                      fontWeight: isStart || isEnd ? 500 : 400,
                      color: isStart || isEnd
                        ? colors.white
                        : isOutside
                        ? colors.textDisabled
                        : colors.textDark,
                      lineHeight: '22.5px',
                    }}>
                      {actualDay}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        onClick={onDismiss}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 393,
          height: '81%',
          backgroundColor: colors.white,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: '0px -2px 8px rgba(31, 45, 61, 0.07)',
        }}
      >
        {/* Drag Handle */}
        <div onClick={onDismiss} style={{ cursor: 'pointer' }}>
          <DragHandle />
        </div>

        {/* Select Period Header */}
        <div style={{ padding: '0 24px', marginBottom: 24 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: 15,
                fontWeight: 400,
                color: colors.textMuted,
                lineHeight: '22.5px',
              }}>
                Select Period
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 26,
                  fontWeight: 400,
                  color: colors.textDark,
                  letterSpacing: -0.52,
                }}>
                  {formatDate(startDate) || 'startDate'}
                </span>
                <span style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 26,
                  fontWeight: 400,
                  color: colors.textDark,
                  letterSpacing: -0.52,
                }}>
                  -
                </span>
                <span style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 26,
                  fontWeight: 400,
                  color: colors.textDark,
                  letterSpacing: -0.52,
                }}>
                  {formatDate(endDate) || 'endDate'}
                </span>
              </div>
            </div>
            <div style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 16,
            }}>
              <IconEditPencil size={24} color={colors.textMuted} />
            </div>
          </div>
        </div>

        {/* Calendar scroll area */}
        <div
          ref={scrollRef}
          className="hide-scrollbar"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 24px',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          {months.map(({ year, month }) => renderMonth(year, month))}
        </div>

        {/* Save button bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            width: '100%',
            backgroundColor: colors.white,
          }}
        >
          <div style={{ padding: '16px 16px 6px' }}>
            <button
              type="button"
              onClick={onSave}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: colors.primary,
                border: `2px solid ${colors.primary}`,
                borderRadius: 6,
                color: colors.white,
                fontFamily: 'Roboto, sans-serif',
                fontSize: 15,
                fontWeight: 400,
                lineHeight: '21px',
                letterSpacing: '-0.15px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
          {/* iOS home indicator */}
          <div
            style={{
              height: 34,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 8,
            }}
          >
            <div
              style={{
                width: 134,
                height: 5,
                backgroundColor: 'black',
                borderRadius: 100,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeCustomRange;