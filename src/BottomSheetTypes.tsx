import CheckboxWithLabel from './components/CheckboxWithLabel';
import ButtonBar from './components/ButtonBar';

export interface BottomSheetTypesProps {
  /** Whether "Money In" is selected */
  moneyInSelected?: boolean;
  /** Whether "Money Out" is selected */
  moneyOutSelected?: boolean;
  /** Callback when Money In checkbox changes */
  onMoneyInChange?: (checked: boolean) => void;
  /** Callback when Money Out checkbox changes */
  onMoneyOutChange?: (checked: boolean) => void;
  /** Callback when Clear Selection is pressed */
  onClearSelection?: () => void;
  /** Callback when overlay is pressed (to close) */
  onOverlayPress?: () => void;
  /** Callback when Save button is pressed */
  onSave?: () => void;
}

const BottomSheetTypes = ({
  moneyInSelected = false,
  moneyOutSelected = false,
  onMoneyInChange,
  onMoneyOutChange,
  onClearSelection,
  onOverlayPress,
  onSave,
}: BottomSheetTypesProps) => {
  const hasSelection = moneyInSelected || moneyOutSelected;
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
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, color: '#b8c0ca', letterSpacing: -0.15 }}>Type</span>
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
          <CheckboxWithLabel
            label="Money In"
            checked={moneyInSelected}
            onChange={onMoneyInChange}
          />
          <CheckboxWithLabel
            label="Money Out"
            checked={moneyOutSelected}
            onChange={onMoneyOutChange}
          />
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

export default BottomSheetTypes;
