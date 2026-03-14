import { useState } from 'react';
import StatusBarIphone from './components/StatusBarIphone';
import TextField from './components/TextField';
import ButtonBar from './components/ButtonBar';
import BottomSheetStatus from './BottomSheetStatus';
import BottomSheetTypes from './BottomSheetTypes';
import BottomSheetBenefits from './BottomSheetBenefits';
import BottomSheetDateRange from './BottomSheetDateRange';
import type { BenefitSelections } from './BottomSheetBenefits';
import type { DateRangeOption, CustomDateRange } from './BottomSheetDateRange';

// Chevron Down Icon for select fields
const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#60758f"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6L8 10L12 6" />
  </svg>
);

export interface FilterViewProps {
  /** Callback when back button is pressed */
  onBack?: () => void;
  /** Callback when Apply Filter button is pressed */
  onApplyFilter?: (filters: FilterState) => void;
  /** Initial filter values */
  initialFilters?: Partial<FilterState>;
}

export const DEFAULT_BENEFIT_SELECTIONS: BenefitSelections = {
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

export default function FilterView({
  onBack,
  onApplyFilter,
  initialFilters,
}: FilterViewProps) {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    benefitSelections: initialFilters?.benefitSelections ?? DEFAULT_BENEFIT_SELECTIONS,
    moneyInSelected: initialFilters?.moneyInSelected ?? false,
    moneyOutSelected: initialFilters?.moneyOutSelected ?? false,
    clearedSelected: initialFilters?.clearedSelected ?? false,
    pendingSelected: initialFilters?.pendingSelected ?? false,
    dateRangeOption: initialFilters?.dateRangeOption ?? null,
    customDateRange: initialFilters?.customDateRange,
  });

  // Bottom sheet visibility
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [showTypeSheet, setShowTypeSheet] = useState(false);
  const [showBenefitSheet, setShowBenefitSheet] = useState(false);
  const [showDateRangeSheet, setShowDateRangeSheet] = useState(false);

  // Derive benefit display value
  const getBenefitDisplayValue = () => {
    const selected = Object.entries(filters.benefitSelections)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => {
        const labels: Record<string, string> = {
          healthSavings: 'Health Savings',
          hra: 'HRA',
          dcfsa: 'DCFSA',
          lpfsa: 'LPFSA',
          remoteWork: 'Remote Work',
          transit: 'Transit',
          lsa: 'LSA',
          parking: 'Parking',
          rewards: 'Rewards',
        };
        return labels[key];
      });

    if (selected.length === 0) {
      return 'All Benefits';
    }
    if (selected.length <= 2) {
      return selected.join(', ');
    }
    return `${selected.slice(0, 2).join(', ')}, +${selected.length - 2}`;
  };

  // Derive date range display value
  const getDateRangeDisplayValue = () => {
    if (!filters.dateRangeOption) {
      return 'Select Range';
    }
    
    const labels: Record<string, string> = {
      last24hours: 'Last 24 hours',
      last3days: 'Last 3 days',
      last7days: 'Last 7 days',
      last14days: 'Last 14 days',
      last30days: 'Last 30 days',
    };
    
    if (filters.dateRangeOption === 'custom' && filters.customDateRange) {
      const { startDate, endDate } = filters.customDateRange;
      if (startDate && endDate) {
        const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
      }
      return 'Custom Range';
    }
    
    return labels[filters.dateRangeOption] || 'Select Range';
  };

  // Derive type display value
  const getTypeDisplayValue = () => {
    const selected = [
      filters.moneyInSelected && 'Money In',
      filters.moneyOutSelected && 'Money Out',
    ].filter(Boolean) as string[];
    if (selected.length === 0) return 'All Types';
    if (selected.length <= 2) return selected.join(', ');
    return `${selected.slice(0, 2).join(', ')}, +${selected.length - 2}`;
  };

  // Derive status display value
  const getStatusDisplayValue = () => {
    const selected = [
      filters.clearedSelected && 'Cleared',
      filters.pendingSelected && 'Pending',
    ].filter(Boolean) as string[];
    if (selected.length === 0) return 'All Status';
    if (selected.length <= 2) return selected.join(', ');
    return `${selected.slice(0, 2).join(', ')}, +${selected.length - 2}`;
  };

  const handleApplyFilter = () => {
    onApplyFilter?.(filters);
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
      {/* Status Bar with Navigation */}
      <StatusBarIphone
        variant="withNavigation"
        pageTitle="Filter Transactions"
        onBackClick={onBack}
        showBackButton
        showCloseButton={false}
      />

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid #f7f3f2',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            padding: '24px 18px',
          }}
        >
          {/* Benefit Filter */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowBenefitSheet(true)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <TextField
                variant="underlined"
                label="Benefit"
                labelVisible
                placeholder={getBenefitDisplayValue()}
                endIcon={<ChevronDownIcon />}
                readOnly
              />
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, benefitSelections: DEFAULT_BENEFIT_SELECTIONS }))}
              disabled={!Object.values(filters.benefitSelections).some(Boolean)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'none',
                border: 'none',
                padding: '4px 12px',
                borderRadius: 6,
                cursor: Object.values(filters.benefitSelections).some(Boolean) ? 'pointer' : 'default',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: 13,
                lineHeight: '19.5px',
                color: Object.values(filters.benefitSelections).some(Boolean) ? '#1d7883' : '#b8c0ca',
                zIndex: 1,
              }}
            >
              Clear
            </button>
          </div>

          {/* Type Filter */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowTypeSheet(true)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <TextField
                variant="underlined"
                label="Type"
                labelVisible
                placeholder={getTypeDisplayValue()}
                endIcon={<ChevronDownIcon />}
                readOnly
              />
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, moneyInSelected: false, moneyOutSelected: false }))}
              disabled={!filters.moneyInSelected && !filters.moneyOutSelected}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'none',
                border: 'none',
                padding: '4px 12px',
                borderRadius: 6,
                cursor: (filters.moneyInSelected || filters.moneyOutSelected) ? 'pointer' : 'default',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: 13,
                lineHeight: '19.5px',
                color: (filters.moneyInSelected || filters.moneyOutSelected) ? '#1d7883' : '#b8c0ca',
                zIndex: 1,
              }}
            >
              Clear
            </button>
          </div>

          {/* Status Filter */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowStatusSheet(true)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <TextField
                variant="underlined"
                label="Status"
                labelVisible
                placeholder={getStatusDisplayValue()}
                endIcon={<ChevronDownIcon />}
                readOnly
              />
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, clearedSelected: false, pendingSelected: false }))}
              disabled={!filters.clearedSelected && !filters.pendingSelected}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'none',
                border: 'none',
                padding: '4px 12px',
                borderRadius: 6,
                cursor: (filters.clearedSelected || filters.pendingSelected) ? 'pointer' : 'default',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: 13,
                lineHeight: '19.5px',
                color: (filters.clearedSelected || filters.pendingSelected) ? '#1d7883' : '#b8c0ca',
                zIndex: 1,
              }}
            >
              Clear
            </button>
          </div>

          {/* Transaction Date Filter */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowDateRangeSheet(true)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <TextField
                variant="underlined"
                label="Transaction Date"
                labelVisible
                placeholder={getDateRangeDisplayValue()}
                endIcon={<ChevronDownIcon />}
                readOnly
              />
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, dateRangeOption: null, customDateRange: undefined }))}
              disabled={!filters.dateRangeOption && !filters.customDateRange}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'none',
                border: 'none',
                padding: '4px 12px',
                borderRadius: 6,
                cursor: (filters.dateRangeOption || filters.customDateRange) ? 'pointer' : 'default',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: 13,
                lineHeight: '19.5px',
                color: (filters.dateRangeOption || filters.customDateRange) ? '#1d7883' : '#b8c0ca',
                zIndex: 1,
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Button Bar */}
      <ButtonBar
        buttonCount={1}
        primaryLabel="Apply Filter"
        onPrimaryClick={handleApplyFilter}
      />

      {/* Status Bottom Sheet */}
      {showStatusSheet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <BottomSheetStatus
          clearedSelected={filters.clearedSelected}
          pendingSelected={filters.pendingSelected}
          onClearedChange={(checked) =>
            setFilters((prev) => ({ ...prev, clearedSelected: checked }))
          }
          onPendingChange={(checked) =>
            setFilters((prev) => ({ ...prev, pendingSelected: checked }))
          }
          onClearSelection={() =>
            setFilters((prev) => ({
              ...prev,
              clearedSelected: false,
              pendingSelected: false,
            }))
          }
          onOverlayPress={() => setShowStatusSheet(false)}
          onSave={() => setShowStatusSheet(false)}
        />
        </div>
      )}

      {/* Type Bottom Sheet */}
      {showTypeSheet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <BottomSheetTypes
          moneyInSelected={filters.moneyInSelected}
          moneyOutSelected={filters.moneyOutSelected}
          onMoneyInChange={(checked) =>
            setFilters((prev) => ({ ...prev, moneyInSelected: checked }))
          }
          onMoneyOutChange={(checked) =>
            setFilters((prev) => ({ ...prev, moneyOutSelected: checked }))
          }
          onClearSelection={() =>
            setFilters((prev) => ({
              ...prev,
              moneyInSelected: false,
              moneyOutSelected: false,
            }))
          }
          onOverlayPress={() => setShowTypeSheet(false)}
          onSave={() => setShowTypeSheet(false)}
        />
        </div>
      )}

      {/* Benefits Bottom Sheet */}
      {showBenefitSheet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <BottomSheetBenefits
          selections={filters.benefitSelections}
          onSelectionChange={(key, checked) =>
            setFilters((prev) => ({
              ...prev,
              benefitSelections: {
                ...prev.benefitSelections,
                [key]: checked,
              },
            }))
          }
          onClearSelection={() =>
            setFilters((prev) => ({
              ...prev,
              benefitSelections: DEFAULT_BENEFIT_SELECTIONS,
            }))
          }
          onOverlayPress={() => setShowBenefitSheet(false)}
          onSave={() => setShowBenefitSheet(false)}
        />
        </div>
      )}

      {/* Date Range Bottom Sheet */}
      {showDateRangeSheet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <BottomSheetDateRange
          selectedOption={filters.dateRangeOption}
          customRange={filters.customDateRange}
          onOptionChange={(option) =>
            setFilters((prev) => ({ ...prev, dateRangeOption: option }))
          }
          onCustomRangeChange={(range) =>
            setFilters((prev) => ({ ...prev, customDateRange: range }))
          }
          onClearSelection={() =>
            setFilters((prev) => ({
              ...prev,
              dateRangeOption: null,
              customDateRange: undefined,
            }))
          }
          onOverlayPress={() => setShowDateRangeSheet(false)}
          onSave={() => setShowDateRangeSheet(false)}
        />
        </div>
      )}
    </div>
  );
}