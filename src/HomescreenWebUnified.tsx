import { useState, useRef, useEffect } from 'react';
import healthWalletLogoSvg from './assets/HealthWalletLogo.svg';
import SideNav, { healthWalletNavItemsEn, healthWalletNavItemsEs } from './components/SideNav';
import WalletTransactionListItemWeb from './components/WalletTransactionListItemWeb';
import Button from './components/Button';
import BenefitIconDuo from './components/BenefitIconDuo';
import { IconArrowRight, IconChevronRight, IconPlus, IconHelpCircle, IconFilter, IconCalendar, IconLogIn, IconLogOut, IconCheckCircle, IconWaiting } from './components/icons';
import Input from './components/Input';
import Chip from './components/Chip';
import DateRangeCustomRange from './DateRangeCustomRange';
import CommsIcon from './components/commsIcon';
import { clearedTransactions, pendingTransactions } from './data/transactions';
import type { Transaction } from './data/transactions';

// ============ Colors ============

const colors = {
  textDark: '#0f2b4d',
  textMuted: '#60758f',
  primary: '#1d7883',
  bg: '#f9f7f6',
  white: '#ffffff',
  border: '#f7f3f2',
  borderDark: '#cfd6de',
};

// ============ Local helpers ============


const HealthWalletLogo = () => (
  <img src={healthWalletLogoSvg} alt="Health Wallet" style={{ height: 35, width: 'auto' }} />
);

// ============ NotificationBanner ============

interface NotificationBannerProps {
  title: string;
  body: string;
  date: string;
  onMarkRead?: () => void;
  onViewStatement?: () => void;
}

const NotificationBanner = ({
  title,
  body,
  date,
  onMarkRead,
  onViewStatement,
}: NotificationBannerProps) => (
  <div
    style={{
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}
  >
    {/* Icon */}
    <div style={{ flexShrink: 0 }}>
      <CommsIcon variant="account" size={48} />
    </div>

    {/* Text */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 500, color: colors.textDark, margin: 0 }}>
        {title}
      </p>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 400, color: colors.textMuted, margin: '2px 0 0' }}>
        {body}
      </p>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 11, fontWeight: 400, color: colors.textMuted, margin: '4px 0 0' }}>
        {date}
      </p>
    </div>

    {/* Actions */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
      <button
        onClick={onMarkRead}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Roboto, sans-serif',
          fontSize: 13,
          color: colors.textMuted,
          padding: 0,
        }}
      >
        Mark as Read
      </button>
      <Button variant="fill" size="small" onClick={onViewStatement}>
        View Statement
      </Button>
    </div>
  </div>
);

// ============ AccountCard ============

interface AccountCardProps {
  icon: React.ReactNode;
  name: string;
  badge?: string;
  amount: string;
  limit?: string;
  subtitle: string;
  onClick?: () => void;
}

const AccountCard = ({ icon, name, badge, amount, limit, subtitle, onClick }: AccountCardProps) => (
  <div
    onClick={onClick}
    style={{
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      padding: '20px 24px',
      cursor: 'pointer',
      boxShadow: '0px 3px 4px 0px rgba(99,99,102,0.05)',
    }}
  >
    {/* Title row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      {icon}
      <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, fontWeight: 500, color: colors.textDark, flex: 1 }}>
        {name}
      </span>
      {badge && (
        <span
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 10,
            fontWeight: 500,
            color: colors.primary,
            border: `1px solid ${colors.primary}`,
            borderRadius: 4,
            padding: '1px 5px',
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
      <IconArrowRight size={16} color={colors.primary} />
    </div>

    {/* Amount */}
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 26, fontWeight: 700, color: colors.textDark, letterSpacing: -0.52 }}>
        ${amount}
      </span>
      {limit && (
        <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, fontWeight: 400, color: colors.textMuted }}>
          {' '}/ ${limit}
        </span>
      )}
    </div>

    {/* Subtitle */}
    <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 400, color: colors.textMuted, margin: 0 }}>
      {subtitle}
    </p>
  </div>
);

// ============ SectionLabel ============

const SectionLabel = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '20px 0 8px' }}>
    <span
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: 10,
        fontWeight: 500,
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
      }}
    >
      {label}
    </span>
    <IconHelpCircle size={14} />
  </div>
);

// ============ Type helper ============

type WalletBenefitType = 'HSA_FSA' | 'HRA' | 'DCFSA' | 'LPFSA' | 'RemoteWork' | 'Transit' | 'LSA' | 'Parking' | 'Rewards' | 'Funding';

const toBenefit = (b: Transaction['benefit']): WalletBenefitType => b;

// ============ FilterPanel ============

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDateRange = (start: Date, end: Date): string => {
  const sy = start.getFullYear(), ey = end.getFullYear();
  const sm = start.getMonth(), em = end.getMonth();
  const sd = start.getDate(), ed = end.getDate();
  const sameYear = sy === ey;
  const startStr = `${MONTHS_SHORT[sm]} ${sd}${sameYear ? '' : `, ${sy}`}`;
  const endStr = `${MONTHS_SHORT[em]} ${ed}, ${ey}`;
  return `${startStr} – ${endStr}`;
};

const BENEFIT_OPTIONS = ['Health Savings', 'HRA', 'DCFSA', 'LPFSA', 'Remote Work', 'Transit', 'LSA', 'Parking', 'Rewards'];
const TYPE_OPTIONS = ['Money In', 'Money Out'];
const STATUS_OPTIONS = ['Cleared', 'Pending'];
const DATE_RANGE_OPTIONS = ['Last 24 Hours', 'Last 3 days', 'Last 7 days', 'Last 14 days', 'Last 30 days'];

const typeIcons: Record<string, React.ReactNode> = {
  'Money In': <IconLogIn size={16} />,
  'Money Out': <IconLogOut size={16} />,
};

const statusIcons: Record<string, React.ReactNode> = {
  'Cleared': <IconCheckCircle size={16} />,
  'Pending': <IconWaiting size={16} />,
};

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  icons?: Record<string, React.ReactNode>;
  borderBottom?: boolean;
}

const filterActionBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Roboto, sans-serif',
  fontSize: 13,
  color: colors.primary,
  padding: '4px 12px',
};

const FilterSection = ({ title, options, selected, onToggle, onSelectAll, onClearAll, icons, borderBottom = true }: FilterSectionProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      paddingBottom: borderBottom ? 16 : 8,
      borderBottom: borderBottom ? '1px solid #f7f3f2' : 'none',
    }}
  >
    {/* Section header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingLeft: 8 }}>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, fontWeight: 500, color: colors.textDark, letterSpacing: '-0.15px' }}>
        {title}
      </span>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <button onClick={onSelectAll} style={filterActionBtnStyle}>Select All</button>
        {selected.length > 0 && (
          <>
            <div style={{ width: 0.5, backgroundColor: colors.borderDark, alignSelf: 'stretch' }} />
            <button onClick={onClearAll} style={filterActionBtnStyle}>Clear All</button>
          </>
        )}
      </div>
    </div>

    {/* Chips */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingLeft: 8 }}>
      {options.map(option => (
        <Chip
          key={option}
          label={option}
          size="Small"
          selected={selected.includes(option)}
          onClick={() => onToggle(option)}
          leftIcon={!!icons?.[option]}
          icon={icons?.[option] ?? null}
        />
      ))}
    </div>
  </div>
);

interface CustomDateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface FilterPanelProps {
  selectedBenefits: string[];
  setSelectedBenefits: (v: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (v: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (v: string[]) => void;
  selectedDateRange: string | null;
  setSelectedDateRange: (v: string | null) => void;
  customDateRange: CustomDateRange;
  setCustomDateRange: (v: CustomDateRange) => void;
}

const FilterPanel = ({
  selectedBenefits, setSelectedBenefits,
  selectedTypes, setSelectedTypes,
  selectedStatuses, setSelectedStatuses,
  selectedDateRange, setSelectedDateRange,
  customDateRange, setCustomDateRange,
}: FilterPanelProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pendingRange, setPendingRange] = useState<CustomDateRange>({ startDate: null, endDate: null });

  const toggle = (arr: string[], item: string, set: (v: string[]) => void) =>
    set(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);

  const openDatePicker = () => {
    setPendingRange(customDateRange);
    setShowDatePicker(true);
  };

  const hasCustomRange = !!(customDateRange.startDate && customDateRange.endDate);

  return (
    <div
      style={{
        position: 'absolute',
        top: 44,
        right: 0,
        width: 321,
        backgroundColor: colors.white,
        border: `1px solid ${colors.borderDark}`,
        borderRadius: 8,
        padding: 8,
        boxShadow: '0px 8px 20px 0px rgba(99,99,102,0.1)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <FilterSection
        title="Benefit Account"
        options={BENEFIT_OPTIONS}
        selected={selectedBenefits}
        onToggle={opt => toggle(selectedBenefits, opt, setSelectedBenefits)}
        onSelectAll={() => setSelectedBenefits(selectedBenefits.length === BENEFIT_OPTIONS.length ? [] : [...BENEFIT_OPTIONS])}
        onClearAll={() => setSelectedBenefits([])}
      />
      <FilterSection
        title="Type"
        options={TYPE_OPTIONS}
        selected={selectedTypes}
        onToggle={opt => toggle(selectedTypes, opt, setSelectedTypes)}
        onSelectAll={() => setSelectedTypes(selectedTypes.length === TYPE_OPTIONS.length ? [] : [...TYPE_OPTIONS])}
        onClearAll={() => setSelectedTypes([])}
        icons={typeIcons}
      />
      <FilterSection
        title="Status"
        options={STATUS_OPTIONS}
        selected={selectedStatuses}
        onToggle={opt => toggle(selectedStatuses, opt, setSelectedStatuses)}
        onSelectAll={() => setSelectedStatuses(selectedStatuses.length === STATUS_OPTIONS.length ? [] : [...STATUS_OPTIONS])}
        onClearAll={() => setSelectedStatuses([])}
        icons={statusIcons}
      />

      {/* Date Range — no bottom border, no Select All */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingLeft: 8, minHeight: 36, boxSizing: 'border-box' }}>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, fontWeight: 500, color: colors.textDark, letterSpacing: '-0.15px' }}>
            Date Range
          </span>
          {(selectedDateRange !== null || hasCustomRange) && (
            <button
              onClick={() => { setSelectedDateRange(null); setCustomDateRange({ startDate: null, endDate: null }); }}
              style={filterActionBtnStyle}
            >
              Clear
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingLeft: 8 }}>
          {DATE_RANGE_OPTIONS.map(opt => (
            <Chip
              key={opt}
              label={opt}
              size="Small"
              selected={selectedDateRange === opt}
              onClick={() => {
                setSelectedDateRange(selectedDateRange === opt ? null : opt);
                setCustomDateRange({ startDate: null, endDate: null });
              }}
            />
          ))}
        </div>
        <div style={{ paddingLeft: 8, paddingRight: 8 }} onClick={openDatePicker}>
          <Input
            readOnly
            startIcon={<IconCalendar size={16} color={colors.textMuted} />}
            placeholder="_ _/_ _/_ _ _ _"
            value={hasCustomRange ? formatDateRange(customDateRange.startDate!, customDateRange.endDate!) : ''}
            containerClassName="cursor-pointer"
          />
        </div>
      </div>

      {/* Date picker — floats to the left of the panel */}
      {showDatePicker && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 'calc(100% + 8px)',
            width: 360,
            height: 540,
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0px 8px 20px 0px rgba(99,99,102,0.1)',
            zIndex: 101,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <DateRangeCustomRange
              isVisible={true}
              hideOverlay
              fullHeight
              hideDragHandle
              simpleButton
              disableAutoScroll
              headerPaddingTop={24}
              initialStartDate={pendingRange.startDate}
              initialEndDate={pendingRange.endDate}
              onSelectDates={(startDate, endDate) => setPendingRange({ startDate, endDate })}
              onDismiss={() => setShowDatePicker(false)}
              onSave={() => {
                setCustomDateRange(pendingRange);
                setSelectedDateRange(null);
                setShowDatePicker(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ============ HomescreenWebUnified ============

interface HomescreenWebUnifiedProps {
  userName?: string;
}

const HomescreenWebUnified = ({ userName = 'Frank' }: HomescreenWebUnifiedProps) => {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [activeNav, setActiveNav] = useState('Wallet');
  const [notifPage, setNotifPage] = useState(1);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null);
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({ startDate: null, endDate: null });
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterPanelOpen(false);
      }
    };
    if (filterPanelOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterPanelOpen]);

  const allTransactions = [...pendingTransactions, ...clearedTransactions];
  const dateRangeDaysMap: Record<string, number> = {
    'Last 24 Hours': 1,
    'Last 3 days': 3,
    'Last 7 days': 7,
    'Last 14 days': 14,
    'Last 30 days': 30,
  };
  const filteredTransactions = allTransactions.filter(t => {
    if (selectedBenefits.length > 0 && !selectedBenefits.includes(t.benefitAccount)) return false;
    if (selectedTypes.length > 0) {
      const matches = selectedTypes.some(s =>
        (s === 'Money In' && t.direction === 'MoneyIn') ||
        (s === 'Money Out' && t.direction === 'MoneyOut')
      );
      if (!matches) return false;
    }
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(t.type)) return false;
    if (selectedDateRange !== null) {
      const days = dateRangeDaysMap[selectedDateRange];
      if (days !== undefined) {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        if (new Date(t.date) < cutoff) return false;
      }
    } else if (customDateRange.startDate || customDateRange.endDate) {
      const txDate = new Date(t.date);
      if (customDateRange.startDate && txDate < customDateRange.startDate) return false;
      if (customDateRange.endDate) {
        const endOfDay = new Date(customDateRange.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (txDate > endOfDay) return false;
      }
    }
    return true;
  });
  const filteredPending = filteredTransactions.filter(t => t.type === 'Pending');
  const filteredCleared = filteredTransactions.filter(t => t.type === 'Cleared');

  const notifTotal = 2;

  const navItems = locale === 'en' ? healthWalletNavItemsEn : healthWalletNavItemsEs;
  const logOutLabel = locale === 'en' ? 'Log Out' : 'Carrar la sesión';

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', backgroundColor: colors.bg }}>

      {/* Sidebar */}
      <SideNav
        logo={<HealthWalletLogo />}
        navItems={navItems}
        activeItem={activeNav}
        locale={locale}
        logOutLabel={logOutLabel}
        onNavItemClick={setActiveNav}
        onLanguageToggle={() => setLocale(l => l === 'en' ? 'es' : 'en')}
      />

      {/* Main content */}
      <main className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: 32, minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: '"Droid Serif", Georgia, serif',
              fontSize: 36,
              fontWeight: 400,
              color: colors.textDark,
              margin: 0,
              letterSpacing: -0.72,
              lineHeight: '52px',
            }}
          >
            Good morning, {userName}.
          </h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="outline" size="medium" startIcon={<IconPlus size={14} />}>
              Deposit
            </Button>
            <Button variant="fill" size="medium">
              $ Reimburse
            </Button>
          </div>
        </div>

        {/* Notification banner */}
        <NotificationBanner
          title="HSA Monthly Account Statement"
          body="Your HSA Monthly Account Statement of Sept. 2025 is ready for review."
          date="06-28-2022 06:07 AM"
        />

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, marginBottom: 24 }}>
          <button
            onClick={() => setNotifPage(p => Math.max(1, p - 1))}
            disabled={notifPage === 1}
            style={{
              background: 'none',
              border: `1px solid ${colors.borderDark}`,
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: notifPage === 1 ? 'default' : 'pointer',
              padding: 0,
              opacity: notifPage === 1 ? 0.4 : 1,
            }}
          >
            <span style={{ transform: 'rotate(180deg)', display: 'flex' }}>
              <IconChevronRight size={14} color={colors.textMuted} />
            </span>
          </button>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, color: colors.textMuted }}>
            {notifPage}/{notifTotal}
          </span>
          <button
            onClick={() => setNotifPage(p => Math.min(notifTotal, p + 1))}
            disabled={notifPage === notifTotal}
            style={{
              background: 'none',
              border: `1px solid ${colors.borderDark}`,
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: notifPage === notifTotal ? 'default' : 'pointer',
              padding: 0,
              opacity: notifPage === notifTotal ? 0.4 : 1,
            }}
          >
            <IconChevronRight size={14} color={colors.textMuted} />
          </button>
        </div>

        {/* Account cards */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <AccountCard
            icon={<BenefitIconDuo icon="HSA_FSA" />}
            name="Health Savings"
            amount="10,564.61"
            subtitle="HSA + Investments"
          />
          <AccountCard
            icon={<BenefitIconDuo icon="LPFSA" />}
            name="Dental & Vision"
            badge="LP-FSA"
            amount="386.33"
            limit="500.00"
            subtitle="Available Balance"
          />
          <AccountCard
            icon={<BenefitIconDuo icon="Rewards" />}
            name="Health Rewards"
            amount="9.90"
            subtitle="Available Balance"
          />
        </div>

        {/* Transactions */}
        <div style={{ backgroundColor: colors.white, padding: 40, borderRadius: 8 }}>

          {/* Transactions header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2
              style={{
                fontFamily: '"Droid Serif", Georgia, serif',
                fontSize: 26,
                fontWeight: 400,
                color: colors.textDark,
                margin: 0,
              }}
            >
              Transactions
            </h2>
            <div ref={filterRef} style={{ position: 'relative' }}>
              {(() => {
                const totalSelected =
                  selectedBenefits.length +
                  selectedTypes.length +
                  selectedStatuses.length +
                  (selectedDateRange ? 1 : 0) +
                  (customDateRange.startDate ? 1 : 0);
                const clearAll = () => {
                  setSelectedBenefits([]);
                  setSelectedTypes([]);
                  setSelectedStatuses([]);
                  setSelectedDateRange(null);
                  setCustomDateRange({ startDate: null, endDate: null });
                };
                return (
                  <button
                    onClick={() => setFilterPanelOpen(o => !o)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: colors.white,
                      border: `1px solid ${colors.borderDark}`,
                      borderRadius: 6,
                      paddingTop: 8,
                      paddingBottom: 8,
                      paddingLeft: 12,
                      paddingRight: totalSelected > 0 ? 8 : 12,
                      cursor: 'pointer',
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: 15,
                      color: colors.textDark,
                      letterSpacing: '-0.15px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      Filters
                      {totalSelected > 0 && (
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 20,
                          height: 20,
                          borderRadius: 12,
                          backgroundColor: colors.primary,
                          color: 'white',
                          fontSize: 15,
                          fontFamily: 'Roboto, sans-serif',
                          lineHeight: '120%',
                          flexShrink: 0,
                        }}>
                          {totalSelected}
                        </span>
                      )}
                    </span>
                    {totalSelected > 0 ? (
                      <span
                        onClick={e => { e.stopPropagation(); clearAll(); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 24,
                          height: 24,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="#60758f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flexShrink: 0 }}>
                        <IconFilter size={16} color={colors.textDark} />
                      </span>
                    )}
                  </button>
                );
              })()}

              {filterPanelOpen && (
                <FilterPanel
                  selectedBenefits={selectedBenefits}
                  setSelectedBenefits={setSelectedBenefits}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  selectedStatuses={selectedStatuses}
                  setSelectedStatuses={setSelectedStatuses}
                  selectedDateRange={selectedDateRange}
                  setSelectedDateRange={setSelectedDateRange}
                  customDateRange={customDateRange}
                  setCustomDateRange={setCustomDateRange}
                />
              )}
            </div>
          </div>

          {/* Pending */}
          {filteredPending.length > 0 && (
            <>
              <SectionLabel label="Pending" />
              <div>
                {filteredPending.map((t, i) => (
                  <WalletTransactionListItemWeb
                    key={`pending-${i}`}
                    merchantName={t.merchantName}
                    benefitAccount={t.benefitAccount}
                    transactionAmount={t.transactionAmount}
                    date={t.date}
                    type="Pending"
                    benefit={toBenefit(t.benefit)}
                    isMoneyOut={t.direction === 'MoneyOut'}
                    hasBottomDivider={i < filteredPending.length - 1}
                  />
                ))}
              </div>
            </>
          )}

          {/* Cleared */}
          {filteredCleared.length > 0 && (
            <>
              <SectionLabel label="Cleared" />
              <div>
                {filteredCleared.map((t, i) => (
                  <WalletTransactionListItemWeb
                    key={`cleared-${i}`}
                    merchantName={t.merchantName}
                    benefitAccount={t.benefitAccount}
                    transactionAmount={t.transactionAmount}
                    date={t.date}
                    type={t.direction}
                    benefit={toBenefit(t.benefit)}
                    isMoneyOut={t.direction === 'MoneyOut'}
                    hasBottomDivider={i < filteredCleared.length - 1}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {filteredTransactions.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 20, fontWeight: 400, color: '#60758f', letterSpacing: -0.4, margin: '0 0 4px 0' }}>
                Nothing... yet.
              </p>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, color: '#b8c0ca', letterSpacing: -0.15, margin: 0, textAlign: 'center' }}>
                No transaction matches your criteria.<br />Update filter and try again.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default HomescreenWebUnified;
