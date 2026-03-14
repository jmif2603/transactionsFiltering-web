import CheckboxWithLabel from './components/CheckboxWithLabel';
import ButtonBar from './components/ButtonBar';

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
  onClearSelection: _onClearSelection,
  onOverlayPress,
  onSave,
}: BottomSheetBenefitsProps) => {
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

        <ButtonBar
          buttonCount={1}
          primaryLabel="Save"
          onPrimaryClick={onSave}
        />
      </div>
    </div>
  );
};

export default BottomSheetBenefits;