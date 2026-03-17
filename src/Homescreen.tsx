import React, { useState, useRef } from 'react';
import StatusBarIphone from './components/StatusBarIphone';
import MobileBottomNav from './components/MobileBottomNav';
import WalletTransactionListItem from './components/WalletTransactionListItem';
import IconArrowRight from './components/Icons/IconArrowRight';
import IconPlus from './components/Icons/IconPlus';
import IconDollarSign from './components/Icons/IconDollarSign';
import IconBarChart from './components/Icons/IconBarChart';
import IconFilter from './components/Icons/IconFilter';
import IconSearch from './components/Icons/IconSearch';
import SelectedFilterA from './components/SelectedFilterA';
import SelectedFilterB from './components/SelectedFilterB';
import BenefitIconDuo from './components/BenefitIconDuo';
import IconReceipt from './components/Icons/IconReceipt';
import DefaultFilterView from './FilterViewA';
import type { FilterViewProps } from './FilterViewA';
import { useTransactionFilters } from './hooks/useTransactionFilters';

// ============ Sub-components ============

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const QuickActionButton = ({ icon, label, onClick }: QuickActionButtonProps) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '13px 23px',
      backgroundColor: 'white',
      border: '1px solid #cfd6de',
      borderRadius: 6,
      cursor: 'pointer',
      fontFamily: 'Roboto, sans-serif',
      fontSize: 15,
      color: '#0f2b4d',
      whiteSpace: 'nowrap',
    }}
  >
    {icon}
    {label}
  </button>
);

interface AccountCardProps {
  icon: React.ReactNode;
  title: string;
  balance: string;
  subtitle: string;
  secondaryBalance?: string;
  onClick?: () => void;
}

const AccountCard = ({
  icon,
  title,
  balance,
  subtitle,
  secondaryBalance,
  onClick,
}: AccountCardProps) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: 'white',
      border: '1px solid #f7f3f2',
      borderRadius: 8,
      padding: 24,
      boxShadow: '0px 3px 4px rgba(99, 99, 102, 0.05)',
      cursor: onClick ? 'pointer' : 'default',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: balance || subtitle ? 16 : 0 }}>
      {icon}
      <span
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: 20,
          color: '#0f2b4d',
          letterSpacing: -0.4,
        }}
      >
        {title}
      </span>
      <span style={{ marginLeft: 'auto' }}>
        <IconArrowRight size={24} color="#0f2b4d" />
      </span>
    </div>
    {(balance || subtitle) && (
      <div>
        <p
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 20,
            fontWeight: 700,
            color: '#0f2b4d',
            margin: 0,
            letterSpacing: -0.2,
          }}
        >
          {balance}
          {secondaryBalance && <span style={{ fontWeight: 400 }}> / {secondaryBalance}</span>}
        </p>
        {subtitle && (
          <p
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 10,
              color: '#60758f',
              margin: '4px 0 0 0',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    )}
  </div>
);

// ============ Main Screen ============

interface HomescreenProps {
  FilterView?: React.ComponentType<FilterViewProps>;
  filterChipVariant?: 'A' | 'B';
}

const Homescreen = ({ FilterView = DefaultFilterView, filterChipVariant = 'A' }: HomescreenProps) => {
  const [activeTab, setActiveTab] = useState<
    'wallet' | 'cards' | 'invest' | 'account' | 'claims' | 'resources'
  >('wallet');
  const [showFilterView, setShowFilterView] = useState(false);

  const {
    appliedFilters,
    setAppliedFilters,
    hasActiveFilters,
    filteredCleared,
    filteredPending,
    showClearedSection,
    showPendingSection,
    clearBenefitFilter,
    clearTypeFilter,
    clearStatusFilter,
    clearDateFilter,
  } = useTransactionFilters();

  // Drag to scroll functionality
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Show FilterView when state is true
  if (showFilterView) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: 393,
          height: 852,
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <FilterView
          initialFilters={appliedFilters ?? undefined}
          onBack={() => setShowFilterView(false)}
          onApplyFilter={(filters) => {
            setAppliedFilters(filters);
            setShowFilterView(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 393,
        height: 852,
        margin: '0 auto',
        backgroundColor: '#f9f7f6',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Status Bar */}
      <StatusBarIphone variant="default" />

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="hide-scrollbar"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 146,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Header & Quick Actions */}
        <div style={{ padding: '24px 17px 20px' }}>
          <h1
            style={{
              fontFamily: 'Stack Sans Text, sans-serif',
              fontSize: 26,
              fontWeight: 400,
              color: '#0f2b4d',
              margin: '0 0 16px 0',
              letterSpacing: -0.52,
            }}
          >
            Good Morning, Jeff
          </h1>

          <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            <QuickActionButton
              icon={<IconPlus size={16} color="#0f2b4d" />}
              label="Deposit"
            />
            <QuickActionButton
              icon={<IconDollarSign size={16} color="#0f2b4d" />}
              label="Reimburse"
            />
            <QuickActionButton
              icon={<IconBarChart size={16} color="#0f2b4d" />}
              label="Invest"
            />
          </div>
        </div>

        {/* Account Cards */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AccountCard
            icon={<BenefitIconDuo icon="HSA_FSA" />}
            title="Health Savings Account"
            balance="$10,576.81"
            subtitle="Cash + Investments"
          />
          <AccountCard
            icon={<BenefitIconDuo icon="Remote Work" />}
            title="Remote Work"
            balance="$440.90"
            secondaryBalance="$500.00"
            subtitle="Available balance"
          />
          <AccountCard
            icon={
              <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconReceipt size={24} />
              </div>
            }
            title="My Claims"
            balance=""
            subtitle=""
          />
        </div>

        {/* Transactions */}
        <div style={{ backgroundColor: 'white', marginTop: 20, padding: '24px 18px' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: 20,
                fontWeight: 400,
                color: '#0f2b4d',
                margin: 0,
                letterSpacing: -0.4,
              }}
            >
              Transactions
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconSearch size={24} color="#0f2b4d" />
              </button>
              <button
                onClick={() => setShowFilterView(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  width: 40,
                  height: 40,
                }}
              >
                <IconFilter size={24} color="#0f2b4d" selected={hasActiveFilters} />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && appliedFilters && (() => {
            const benefitLabels: Record<string, string> = {
              healthSavings: 'Health Savings', hra: 'HRA', dcfsa: 'DCFSA',
              lpfsa: 'LPFSA', remoteWork: 'Remote Work', transit: 'Transit',
              lsa: 'LSA', parking: 'Parking', rewards: 'Rewards',
            };
            const selectedBenefits = Object.entries(appliedFilters.benefitSelections)
              .filter(([, v]) => v).map(([k]) => benefitLabels[k]);
            const selectedTypes = [
              appliedFilters.moneyInSelected && 'Money In',
              appliedFilters.moneyOutSelected && 'Money Out',
            ].filter(Boolean) as string[];
            const selectedStatuses = [
              appliedFilters.clearedSelected && 'Cleared',
              appliedFilters.pendingSelected && 'Pending',
            ].filter(Boolean) as string[];
            const dateLabels: Record<string, string> = {
              last24hours: 'Last 24 hours', last3days: 'Last 3 days',
              last7days: 'Last 7 days', last14days: 'Last 14 days', last30days: 'Last 30 days',
            };
            const dateLabel = appliedFilters.dateRangeOption
              ? (appliedFilters.dateRangeOption === 'custom' && appliedFilters.customDateRange?.startDate && appliedFilters.customDateRange?.endDate
                ? `${appliedFilters.customDateRange.startDate.toLocaleDateString()} - ${appliedFilters.customDateRange.endDate.toLocaleDateString()}`
                : dateLabels[appliedFilters.dateRangeOption] ?? null)
              : null;

            return (
              <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedBenefits.length > 0 && (
                  filterChipVariant === 'B' ? (
                    <SelectedFilterB
                      groupLabel="Benefit"
                      count={selectedBenefits.length}
                      onClear={clearBenefitFilter}
                    />
                  ) : (
                    <SelectedFilterA
                      groupLabel="Benefit"
                      selectedValues={selectedBenefits}
                      onClear={clearBenefitFilter}
                    />
                  )
                )}
                {selectedTypes.length > 0 && (
                  filterChipVariant === 'B' ? (
                    <SelectedFilterB
                      groupLabel="Type"
                      count={selectedTypes.length}
                      onClear={clearTypeFilter}
                    />
                  ) : (
                    <SelectedFilterA
                      groupLabel="Type"
                      selectedValues={selectedTypes}
                      onClear={clearTypeFilter}
                    />
                  )
                )}
                {selectedStatuses.length > 0 && (
                  filterChipVariant === 'B' ? (
                    <SelectedFilterB
                      groupLabel="Status"
                      count={selectedStatuses.length}
                      onClear={clearStatusFilter}
                    />
                  ) : (
                    <SelectedFilterA
                      groupLabel="Status"
                      selectedValues={selectedStatuses}
                      onClear={clearStatusFilter}
                    />
                  )
                )}
                {dateLabel && (
                  <SelectedFilterA
                    groupLabel="Date"
                    selectedValues={[dateLabel]}
                    onClear={clearDateFilter}
                    backgroundColor={filterChipVariant === 'B' ? 'white' : undefined}
                  />
                )}
              </div>
            );
          })()}

          {/* Empty state */}
          {filteredCleared.length === 0 && filteredPending.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 20, fontWeight: 400, color: '#60758f', letterSpacing: -0.4, margin: '0 0 4px 0' }}>
                Nothing... yet.
              </p>
              <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, color: '#b8c0ca', letterSpacing: -0.15, margin: 0, textAlign: 'center' }}>
                No transaction matches your criteria.<br />Update filter and try again.
              </p>
            </div>
          )}

          {/* Pending */}
          {showPendingSection && filteredPending.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 10,
                  fontWeight: 500,
                  color: '#60758f',
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  margin: '0 0 8px 0',
                }}
              >
                Pending
              </p>
              {filteredPending.map((tx, i) => (
                <WalletTransactionListItem
                  key={i}
                  {...tx}
                  hasBottomDivider={i < filteredPending.length - 1}
                />
              ))}
            </div>
          )}

          {/* Cleared */}
          {showClearedSection && filteredCleared.length > 0 && (
            <div>
              <p
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 10,
                  fontWeight: 500,
                  color: '#60758f',
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  margin: '0 0 8px 0',
                }}
              >
                Cleared
              </p>
              {filteredCleared.map((tx, i) => (
                <WalletTransactionListItem
                  key={i}
                  {...tx}
                  hasBottomDivider={i < filteredCleared.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
        }}
      >
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="5-tabs"
        />
      </div>
    </div>
  );
};

export default Homescreen;