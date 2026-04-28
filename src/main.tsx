import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomescreenWeb from './HomescreenWeb.tsx'
import HomescreenWebUnified from './HomescreenWebUnified.tsx'

type View = 'web-separated' | 'web-unified';

const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  fontFamily: 'Roboto, sans-serif',
  fontSize: 14,
  color: '#0f2b4d',
  userSelect: 'none',
};

const App = () => {
  const [view, setView] = useState<View>('web-separated');

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>

      {/* Left sidebar */}
      <div
        style={{
          flexShrink: 0,
          width: 180,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '24px 16px',
          borderRight: '1px solid #cfd6de',
          backgroundColor: 'white',
        }}
      >
        <label style={labelStyle}>
          <input
            type="radio"
            name="view"
            value="web-separated"
            checked={view === 'web-separated'}
            onChange={() => setView('web-separated')}
            style={{ accentColor: '#1d7883', cursor: 'pointer' }}
          />
          All filter fields separated
        </label>
        <label style={labelStyle}>
          <input
            type="radio"
            name="view"
            value="web-unified"
            checked={view === 'web-unified'}
            onChange={() => setView('web-unified')}
            style={{ accentColor: '#1d7883', cursor: 'pointer' }}
          />
          Unified filter panel
        </label>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden' }}>

        {view === 'web-separated' && (
          <div style={{ height: '100%' }}>
            <HomescreenWeb />
          </div>
        )}

        {view === 'web-unified' && (
          <div style={{ height: '100%' }}>
            <HomescreenWebUnified />
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
