import CheckboxWithLabel from './components/CheckboxWithLabel';

export type BenefitKey =
  | 'healthSavings'
  | 'hra'
  | 'dcfsa'
  | 'lpfsa'
  | 'remoteWork'
  | 'transit'
  | 'lsa'
  | 'parking'
  | 'rewards';

export interface BenefitSelections {
  healthSavings: boolean;
  hra: boolean;
  dcfsa: boolean;
  lpfsa: boolean;
  remoteWork: boolean;
  transit: boolean;
  lsa: boolean;
  parking: boolean;
  rewards: boolean;
}

export interface BottomSheetBenefitsProps {
  /** Current selections for all benefits */
  selections?: BenefitSelections;
  /** Callback when any benefit checkbox changes */
  onSelectionChange?: (key: BenefitKey, checked: boolean) => void;
  /** Callback when Clear Selection is pressed */
  onClearSelection?: () => void;
  /** Callback when overlay or drag handle is pressed (to close) */
  onOverlayPress?: () => void;
  /** Callback when Save button is pressed */
  onSave?: () => void;
}

const BENEFIT_OPTIONS: { key: BenefitKey; label: string }[] = [
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

const DEFAULT_SELECTIONS: BenefitSelections = {
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

const BottomSheetBenefits = ({
  selections = DEFAULT_SELECTIONS,
  onSelectionChange,
  onClearSelection,
  onOverlayPress,
  onSave,
}: BottomSheetBenefitsProps) => {
  const hasSelection = Object.values(selections).some(Boolean);
  return (
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

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 16px' }}>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, color: '#b8c0ca', letterSpacing: -0.15 }}>Benefit</span>
          <button
            type="button"
            onClick={onClearSelection}
            disabled={!hasSelection}
            style={{ background: 'none', border: 'none', padding: '4px 0', cursor: hasSelection ? 'pointer' : 'default', fontFamily: 'Roboto, sans-serif', fontSize: 13, color: hasSelection ? '#1d7883' : '#b8c0ca' }}
          >
            Clear
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            alignItems: 'flex-start',
            width: '100%',
            padding: '0 16px',
          }}
        >
          {/* Checkbox Options */}
          {BENEFIT_OPTIONS.map(({ key, label }) => (
            <CheckboxWithLabel
              key={key}
              label={label}
              checked={selections[key]}
              onChange={(checked) => onSelectionChange?.(key, checked)}
            />
          ))}
        </div>

        {/* Save button bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            width: '100%',
            backgroundColor: 'white',
          }}
        >
          <div style={{ padding: '16px 16px 6px' }}>
            <button
              type="button"
              onClick={onSave}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#1d7883',
                border: '2px solid #1d7883',
                borderRadius: 6,
                color: 'white',
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

export default BottomSheetBenefits;