import { useState } from 'react';
import RadioButtonWithLabel from './components/RadioButtonWithLabel';
import Button from './components/Button';
import ButtonBar from './components/ButtonBar';
import DateRangeCustomRange from './DateRangeCustomRange';

export type DateRangeOption =
  | 'last24hours'
  | 'last3days'
  | 'last7days'
  | 'last14days'
  | 'last30days'
  | 'custom'
  | null;

export interface CustomDateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface BottomSheetDateRangeProps {
  /** Currently selected date range option */
  selectedOption?: DateRangeOption;
  /** Custom date range values (when option is 'custom') */
  customRange?: CustomDateRange;
  /** Callback when a date range option is selected */
  onOptionChange?: (option: DateRangeOption) => void;
  /** Callback when custom range is applied */
  onCustomRangeChange?: (range: CustomDateRange) => void;
  /** Callback when Clear Selection is pressed */
  onClearSelection?: () => void;
  /** Callback when overlay or drag handle is pressed (to close) */
  onOverlayPress?: () => void;
  /** Callback when Save button is pressed */
  onSave?: () => void;
}

const DATE_RANGE_OPTIONS: { key: DateRangeOption; label: string }[] = [
  { key: 'last24hours', label: 'Last 24 hours' },
  { key: 'last3days', label: 'Last 3 days' },
  { key: 'last7days', label: 'Last 7 days' },
  { key: 'last14days', label: 'Last 14 days' },
  { key: 'last30days', label: 'Last 30 days' },
];

const BottomSheetDateRange = ({
  selectedOption = null,
  customRange,
  onOptionChange,
  onCustomRangeChange,
  onClearSelection: _onClearSelection,
  onOverlayPress,
  onSave,
}: BottomSheetDateRangeProps) => {
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handleCustomRangeSelect = (startDate: Date | null, endDate: Date | null) => {
    onCustomRangeChange?.({ startDate, endDate });
    // Only set to 'custom' option when both dates are selected
    if (startDate && endDate) {
      onOptionChange?.('custom');
    }
  };

  const handleCustomRangeDismiss = () => {
    // Dismiss both the custom range picker and the parent bottom sheet
    setShowCustomRange(false);
    onOverlayPress?.();
  };

  return (
    <>
      {/* Custom Range Picker */}
      <DateRangeCustomRange
        isVisible={showCustomRange}
        initialStartDate={customRange?.startDate}
        initialEndDate={customRange?.endDate}
        onSelectDates={handleCustomRangeSelect}
        onDismiss={handleCustomRangeDismiss}
        onSave={handleCustomRangeDismiss}
      />

      {/* Main Bottom Sheet - hide when custom range is showing */}
      {!showCustomRange && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {/* Semi-transparent overlay */}
          <div
            onClick={onOverlayPress}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />

          {/* Bottom sheet */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'flex-start',
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              boxShadow: '0px -2px 8px rgba(31, 45, 61, 0.07)',
            }}
          >
            {/* Drag Handle */}
            <div
              onClick={onOverlayPress}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 40,
                backgroundColor: 'white',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 43,
                  height: 5,
                  backgroundColor: '#b8c0ca',
                  borderRadius: 5,
                }}
              />
            </div>

            {/* Content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'flex-start',
                width: '100%',
                padding: 16,
              }}
            >
              {/* Radio Button Options */}
              {DATE_RANGE_OPTIONS.map(({ key, label }) => (
                <RadioButtonWithLabel
                  key={key}
                  label={label}
                  selected={selectedOption === key}
                  onPress={() => onOptionChange?.(key)}
                />
              ))}

              {/* Select Custom Range Button */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  padding: '12px 8px 8px 8px',
                }}
              >
                <Button
                  variant="outline"
                  color="primary"
                  size="medium"
                  onClick={() => setShowCustomRange(true)}
                  className="w-full"
                >
                  Select Custom Range
                </Button>
              </div>
            </div>

            <ButtonBar
              buttonCount={1}
              primaryLabel="Save"
              onPrimaryClick={onSave}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BottomSheetDateRange;