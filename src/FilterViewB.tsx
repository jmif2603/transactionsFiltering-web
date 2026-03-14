import React, { useState, useRef } from 'react';
import StatusBarIphone from './components/StatusBarIphone';
import ButtonBar from './components/ButtonBar';
import DateRangeCustomRange from './DateRangeCustomRange';
import BottomSheetBenefits from './BottomSheetBenefits';
import type { BenefitKey, BenefitSelections } from './BottomSheetBenefits';
import type { DateRangeOption, CustomDateRange } from './BottomSheetDateRange';

// ── Icons ────────────────────────────────────────────────────────────────────

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 10L8 6L12 10" stroke="#60758f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#60758f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckboxUnchecked = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="#60758f" />
  </svg>
);

const CheckboxChecked = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#1d7883" />
    <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RadioUnselected = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.5" stroke="#60758f" />
  </svg>
);

const RadioSelected = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.5" stroke="#1d7883" />
    <circle cx="12" cy="12" r="5" fill="#1d7883" />
  </svg>
);

// ── Shared sub-components ────────────────────────────────────────────────────

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'none',
        border: 'none',
        padding: '0',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <span style={{ padding: 8, display: 'flex', flexShrink: 0 }}>
        {checked ? <CheckboxChecked /> : <CheckboxUnchecked />}
      </span>
      <span
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: 15,
          lineHeight: '22.5px',
          color: '#0f2b4d',
          letterSpacing: '-0.15px',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function RadioItem({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <span style={{ padding: 8, display: 'flex', flexShrink: 0 }}>
        {selected ? <RadioSelected /> : <RadioUnselected />}
      </span>
      <span
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: 15,
          lineHeight: '22.5px',
          color: '#0f2b4d',
          letterSpacing: '-0.15px',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function SectionHeader({
  label,
  expanded,
  onToggle,
  onClear,
  clearDisabled,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  onClear: () => void;
  clearDisabled?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: 10,
            lineHeight: '15px',
            color: '#60758f',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={clearDisabled}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 12px',
            borderRadius: 6,
            cursor: clearDisabled ? 'default' : 'pointer',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: 13,
            lineHeight: '19.5px',
            color: clearDisabled ? '#b8c0ca' : '#1d7883',
          }}
        >
          Clear
        </button>
      </div>
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: 32,
          height: 32,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
    </div>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface FilterViewProps {
  onBack?: () => void;
  onApplyFilter?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

const DEFAULT_BENEFIT_SELECTIONS: BenefitSelections = {
  healthSavings: false,
  hra: false,
  dcfsa: false,
  lpfsa: false,
  remoteWork: false,
  transit: false,
  lsa: false,
  parking: false,
  rewards: false,
};

export interface FilterState {
  benefitSelections: BenefitSelections;
  moneyInSelected: boolean;
  moneyOutSelected: boolean;
  clearedSelected: boolean;
  pendingSelected: boolean;
  dateRangeOption: DateRangeOption;
  customDateRange?: CustomDateRange;
}

const DATE_OPTIONS: { key: Exclude<DateRangeOption, 'custom' | null>; label: string }[] = [
  { key: 'last24hours', label: 'Last 24 hours' },
  { key: 'last3days', label: 'Last 3 days' },
  { key: 'last7days', label: 'Last 7 days' },
  { key: 'last14days', label: 'Last 14 days' },
  { key: 'last30days', label: 'Last 30 days' },
];

const BENEFIT_ITEMS: { key: BenefitKey; label: string }[] = [
  { key: 'healthSavings', label: 'Health Savings' },
  { key: 'hra', label: 'HRA' },
  { key: 'dcfsa', label: 'DCFSA' },
  { key: 'lpfsa', label: 'LPFSA' },
  { key: 'remoteWork', label: 'Remote Work' },
  { key: 'transit', label: 'Transit' },
  { key: 'lsa', label: 'LSA' },
  { key: 'parking', label: 'Parking' },
  { key: 'rewards', label: 'Rewards' },
];

// ── Main component ───────────────────────────────────────────────────────────

export default function FilterView({
  onBack,
  onApplyFilter,
  initialFilters,
}: FilterViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    benefitSelections: initialFilters?.benefitSelections ?? DEFAULT_BENEFIT_SELECTIONS,
    moneyInSelected: initialFilters?.moneyInSelected ?? false,
    moneyOutSelected: initialFilters?.moneyOutSelected ?? false,
    clearedSelected: initialFilters?.clearedSelected ?? false,
    pendingSelected: initialFilters?.pendingSelected ?? false,
    dateRangeOption: initialFilters?.dateRangeOption ?? null,
    customDateRange: initialFilters?.customDateRange,
  });

  const [expanded, setExpanded] = useState({
    benefit: true,
    type: true,
    status: true,
    date: true,
  });

  const [showCustomRangeSheet, setShowCustomRangeSheet] = useState(false);
  const [showBenefitSheet, setShowBenefitSheet] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

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

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const formatCustomRange = (range: CustomDateRange) => {
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (range.startDate && range.endDate) return `${fmt(range.startDate)} - ${fmt(range.endDate)}`;
    if (range.startDate) return fmt(range.startDate);
    return 'Custom Range';
  };

  return (
    <div
      style={{
        backgroundColor: '#f9f7f6',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <StatusBarIphone
        variant="withNavigation"
        pageTitle="Filter Transactions"
        onBackClick={onBack}
        showBackButton
        showCloseButton={false}
      />

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="hide-scrollbar"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          flex: 1,
          borderTop: '1px solid #f7f3f2',
          overflowY: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            padding: '24px 18px',
          }}
        >
          {/* Benefit */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <SectionHeader
              label="Benefit"
              expanded={expanded.benefit}
              onToggle={() => setShowBenefitSheet(true)}
              onClear={() =>
                setFilters((prev) => ({ ...prev, benefitSelections: DEFAULT_BENEFIT_SELECTIONS }))
              }
              clearDisabled={!Object.values(filters.benefitSelections).some(Boolean)}
            />
            {expanded.benefit && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {BENEFIT_ITEMS.map(({ key, label }) => (
                  <CheckboxItem
                    key={key}
                    label={label}
                    checked={filters.benefitSelections[key]}
                    onChange={(val) =>
                      setFilters((prev) => ({
                        ...prev,
                        benefitSelections: { ...prev.benefitSelections, [key]: val },
                      }))
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Type */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <SectionHeader
              label="Type"
              expanded={expanded.type}
              onToggle={() => toggleSection('type')}
              onClear={() =>
                setFilters((prev) => ({ ...prev, moneyInSelected: false, moneyOutSelected: false }))
              }
              clearDisabled={!filters.moneyInSelected && !filters.moneyOutSelected}
            />
            {expanded.type && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <CheckboxItem
                  label="Money In"
                  checked={filters.moneyInSelected}
                  onChange={(val) => setFilters((prev) => ({ ...prev, moneyInSelected: val }))}
                />
                <CheckboxItem
                  label="Money Out"
                  checked={filters.moneyOutSelected}
                  onChange={(val) => setFilters((prev) => ({ ...prev, moneyOutSelected: val }))}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <SectionHeader
              label="Status"
              expanded={expanded.status}
              onToggle={() => toggleSection('status')}
              onClear={() =>
                setFilters((prev) => ({ ...prev, clearedSelected: false, pendingSelected: false }))
              }
              clearDisabled={!filters.clearedSelected && !filters.pendingSelected}
            />
            {expanded.status && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <CheckboxItem
                  label="Cleared"
                  checked={filters.clearedSelected}
                  onChange={(val) => setFilters((prev) => ({ ...prev, clearedSelected: val }))}
                />
                <CheckboxItem
                  label="Pending"
                  checked={filters.pendingSelected}
                  onChange={(val) => setFilters((prev) => ({ ...prev, pendingSelected: val }))}
                />
              </div>
            )}
          </div>

          {/* Date */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <SectionHeader
              label="Date"
              expanded={expanded.date}
              onToggle={() => toggleSection('date')}
              onClear={() =>
                setFilters((prev) => ({ ...prev, dateRangeOption: null, customDateRange: undefined }))
              }
              clearDisabled={!filters.dateRangeOption && !filters.customDateRange}
            />
            {expanded.date && (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {DATE_OPTIONS.map(({ key, label }) => (
                  <RadioItem
                    key={key}
                    label={label}
                    selected={filters.dateRangeOption === key}
                    onSelect={() =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRangeOption: prev.dateRangeOption === key ? null : key,
                        customDateRange: undefined,
                      }))
                    }
                  />
                ))}
                {filters.dateRangeOption === 'custom' && filters.customDateRange ? (
                  <RadioItem
                    label={formatCustomRange(filters.customDateRange)}
                    selected
                    onSelect={() => setShowCustomRangeSheet(true)}
                  />
                ) : (
                  <div style={{ paddingTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => setShowCustomRangeSheet(true)}
                      style={{
                        background: 'white',
                        border: '1px solid #1d7883',
                        borderRadius: 6,
                        padding: '8px 28px',
                        cursor: 'pointer',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 400,
                        fontSize: 15,
                        lineHeight: '21.09px',
                        color: '#1d7883',
                        letterSpacing: '-0.15px',
                      }}
                    >
                      Select Custom Range
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ButtonBar
        buttonCount={1}
        primaryLabel="Apply Filter"
        onPrimaryClick={() => onApplyFilter?.(filters)}
      />

      {showBenefitSheet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <BottomSheetBenefits
            selections={filters.benefitSelections}
            onSelectionChange={(key, checked) =>
              setFilters((prev) => ({
                ...prev,
                benefitSelections: { ...prev.benefitSelections, [key]: checked },
              }))
            }
            onOverlayPress={() => setShowBenefitSheet(false)}
            onSave={() => setShowBenefitSheet(false)}
          />
        </div>
      )}

      <DateRangeCustomRange
        isVisible={showCustomRangeSheet}
        initialStartDate={filters.customDateRange?.startDate ?? null}
        initialEndDate={filters.customDateRange?.endDate ?? null}
        onSelectDates={(startDate, endDate) =>
          setFilters((prev) => ({
            ...prev,
            dateRangeOption: 'custom',
            customDateRange: { startDate: startDate ?? null, endDate: endDate ?? null },
          }))
        }
        onDismiss={() => setShowCustomRangeSheet(false)}
      />
    </div>
  );
}
