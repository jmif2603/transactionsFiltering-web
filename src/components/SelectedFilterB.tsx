interface SelectedFilterBProps {
  groupLabel?: string;
  count: number;
  onClear?: () => void;
}

const SelectedFilterB = ({
  groupLabel = 'Benefit',
  count,
  onClear,
}: SelectedFilterBProps) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'white',
        border: '1px solid #cfd6de',
        borderRadius: 6,
      }}
    >
      {/* Label + count badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingLeft: 8,
          height: '100%',
        }}
      >
        <span
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 15,
            fontWeight: 400,
            color: '#60758f',
            letterSpacing: -0.15,
            whiteSpace: 'nowrap',
          }}
        >
          {groupLabel}
        </span>

        {/* Teal count badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: 12,
            backgroundColor: '#1d7883',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 15,
              fontWeight: 400,
              color: 'white',
              letterSpacing: -0.15,
              lineHeight: 1,
            }}
          >
            {count}
          </span>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={onClear}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          flexShrink: 0,
          padding: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L4 12M4 4L12 12" stroke="#60758f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default SelectedFilterB;
