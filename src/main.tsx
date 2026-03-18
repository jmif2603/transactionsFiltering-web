import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homescreen from './Homescreen.tsx'
import FilterViewA from './FilterViewA.tsx'
import FilterViewB from './FilterViewB.tsx'
import HomescreenWeb from './HomescreenWeb.tsx'

type View = 'mobile-a' | 'mobile-b' | 'web';

const radioOptions: { value: View; label: string }[] = [
  { value: 'mobile-a', label: 'Home screen mobile + bottom sheet Transactions filtering' },
  { value: 'mobile-b', label: 'Home screen mobile + single-view Transactions filtering' },
  { value: 'web', label: 'Home screen web' },
];

const App = () => {
  const [view, setView] = useState<View>('mobile-a');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Radio group bar */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          gap: 24,
          padding: '14px 24px',
          borderBottom: '1px solid #cfd6de',
          backgroundColor: 'white',
        }}
      >
        {radioOptions.map(opt => (
          <label
            key={opt.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontFamily: 'Roboto, sans-serif',
              fontSize: 14,
              color: '#0f2b4d',
              userSelect: 'none',
            }}
          >
            <input
              type="radio"
              name="view"
              value={opt.value}
              checked={view === opt.value}
              onChange={() => setView(opt.value)}
              style={{ accentColor: '#1d7883', cursor: 'pointer' }}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: view === 'web' ? 'hidden' : 'auto' }}>

        {view === 'mobile-a' && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, fontWeight: 500, color: '#60758f' }}>
                Homescreen A
              </span>
              <div style={{ width: 393, flexShrink: 0 }}>
                <Homescreen FilterView={FilterViewA} />
              </div>
            </div>
          </div>
        )}

        {view === 'mobile-b' && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, fontWeight: 500, color: '#60758f' }}>
                Homescreen B
              </span>
              <div style={{ width: 393, flexShrink: 0 }}>
                <Homescreen FilterView={FilterViewB} filterChipVariant="B" />
              </div>
            </div>
          </div>
        )}

        {view === 'web' && (
          <div style={{ height: '100%' }}>
            <HomescreenWeb />
          </div>
        )}

      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
