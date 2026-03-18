import { useState } from 'react';
import healthWalletLogoSvg from './assets/HealthWalletLogo.svg';
import SideNav, { healthWalletNavItemsEn, healthWalletNavItemsEs } from './components/SideNav';
import WalletTransactionListItemWeb from './components/WalletTransactionListItemWeb';
import Button from './components/Button';
import BenefitIconDuo from './components/BenefitIconDuo';
import { IconArrowRight, IconChevronRight, IconPlus, IconHelpCircle } from './components/icons';
import CommsIcon from './components/commsIcon';
import { clearedTransactions, pendingTransactions } from './data/transactions';
import type { Transaction } from './data/transactions';

// ============ Colors ============

const colors = {
  textDark: '#0f2b4d',
  textMuted: '#60758f',
  primary: '#1d7883',
  bg: '#f9f7f6',
  white: '#ffffff',
  border: '#f7f3f2',
  borderDark: '#cfd6de',
};

// ============ Local helpers ============

const ChevronDown = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const HealthWalletLogo = () => (
  <img src={healthWalletLogoSvg} alt="Health Wallet" style={{ height: 35, width: 'auto' }} />
);

// ============ NotificationBanner ============

interface NotificationBannerProps {
  title: string;
  body: string;
  date: string;
  onMarkRead?: () => void;
  onViewStatement?: () => void;
}

const NotificationBanner = ({
  title,
  body,
  date,
  onMarkRead,
  onViewStatement,
}: NotificationBannerProps) => (
  <div
    style={{
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}
  >
    {/* Icon */}
    <div style={{ flexShrink: 0 }}>
      <CommsIcon variant="account" size={48} />
    </div>

    {/* Text */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 500, color: colors.textDark, margin: 0 }}>
        {title}
      </p>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 400, color: colors.textMuted, margin: '2px 0 0' }}>
        {body}
      </p>
      <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 11, fontWeight: 400, color: colors.textMuted, margin: '4px 0 0' }}>
        {date}
      </p>
    </div>

    {/* Actions */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
      <button
        onClick={onMarkRead}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Roboto, sans-serif',
          fontSize: 13,
          color: colors.textMuted,
          padding: 0,
        }}
      >
        Mark as Read
      </button>
      <Button variant="fill" size="small" onClick={onViewStatement}>
        View Statement
      </Button>
    </div>
  </div>
);

// ============ AccountCard ============

interface AccountCardProps {
  icon: React.ReactNode;
  name: string;
  badge?: string;
  amount: string;
  limit?: string;
  subtitle: string;
  onClick?: () => void;
}

const AccountCard = ({ icon, name, badge, amount, limit, subtitle, onClick }: AccountCardProps) => (
  <div
    onClick={onClick}
    style={{
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: 8,
      border: `1px solid ${colors.border}`,
      padding: '20px 24px',
      cursor: 'pointer',
      boxShadow: '0px 3px 4px 0px rgba(99,99,102,0.05)',
    }}
  >
    {/* Title row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      {icon}
      <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, fontWeight: 500, color: colors.textDark, flex: 1 }}>
        {name}
      </span>
      {badge && (
        <span
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 10,
            fontWeight: 500,
            color: colors.primary,
            border: `1px solid ${colors.primary}`,
            borderRadius: 4,
            padding: '1px 5px',
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
      <IconArrowRight size={16} color={colors.primary} />
    </div>

    {/* Amount */}
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 26, fontWeight: 700, color: colors.textDark, letterSpacing: -0.52 }}>
        ${amount}
      </span>
      {limit && (
        <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 15, fontWeight: 400, color: colors.textMuted }}>
          {' '}/ ${limit}
        </span>
      )}
    </div>

    {/* Subtitle */}
    <p style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, fontWeight: 400, color: colors.textMuted, margin: 0 }}>
      {subtitle}
    </p>
  </div>
);

// ============ SectionLabel ============

const SectionLabel = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '20px 0 8px' }}>
    <span
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: 10,
        fontWeight: 500,
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
      }}
    >
      {label}
    </span>
    <IconHelpCircle size={14} />
  </div>
);

// ============ Type helper ============

type WalletBenefitType = 'HSA_FSA' | 'HRA' | 'DCFSA' | 'LPFSA' | 'RemoteWork' | 'Transit' | 'LSA' | 'Parking' | 'Rewards' | 'Funding';

const toBenefit = (b: Transaction['benefit']): WalletBenefitType => b;

// ============ HomescreenWeb ============

interface HomescreenWebProps {
  userName?: string;
}

const HomescreenWeb = ({ userName = 'Frank' }: HomescreenWebProps) => {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  const [activeNav, setActiveNav] = useState('Wallet');
  const [notifPage, setNotifPage] = useState(1);
  const notifTotal = 2;

  const navItems = locale === 'en' ? healthWalletNavItemsEn : healthWalletNavItemsEs;
  const logOutLabel = locale === 'en' ? 'Log Out' : 'Carrar la sesión';

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', backgroundColor: colors.bg }}>

      {/* Sidebar */}
      <SideNav
        logo={<HealthWalletLogo />}
        navItems={navItems}
        activeItem={activeNav}
        locale={locale}
        logOutLabel={logOutLabel}
        onNavItemClick={setActiveNav}
        onLanguageToggle={() => setLocale(l => l === 'en' ? 'es' : 'en')}
      />

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 32, minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: '"Droid Serif", Georgia, serif',
              fontSize: 36,
              fontWeight: 400,
              color: colors.textDark,
              margin: 0,
              letterSpacing: -0.72,
              lineHeight: '52px',
            }}
          >
            Good morning, {userName}.
          </h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="outline" size="medium" startIcon={<IconPlus size={14} />}>
              Deposit
            </Button>
            <Button variant="fill" size="medium">
              $ Reimburse
            </Button>
          </div>
        </div>

        {/* Notification banner */}
        <NotificationBanner
          title="HSA Monthly Account Statement"
          body="Your HSA Monthly Account Statement of Sept. 2025 is ready for review."
          date="06-28-2022 06:07 AM"
        />

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, marginBottom: 24 }}>
          <button
            onClick={() => setNotifPage(p => Math.max(1, p - 1))}
            disabled={notifPage === 1}
            style={{
              background: 'none',
              border: `1px solid ${colors.borderDark}`,
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: notifPage === 1 ? 'default' : 'pointer',
              padding: 0,
              opacity: notifPage === 1 ? 0.4 : 1,
            }}
          >
            <span style={{ transform: 'rotate(180deg)', display: 'flex' }}>
              <IconChevronRight size={14} color={colors.textMuted} />
            </span>
          </button>
          <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, color: colors.textMuted }}>
            {notifPage}/{notifTotal}
          </span>
          <button
            onClick={() => setNotifPage(p => Math.min(notifTotal, p + 1))}
            disabled={notifPage === notifTotal}
            style={{
              background: 'none',
              border: `1px solid ${colors.borderDark}`,
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: notifPage === notifTotal ? 'default' : 'pointer',
              padding: 0,
              opacity: notifPage === notifTotal ? 0.4 : 1,
            }}
          >
            <IconChevronRight size={14} color={colors.textMuted} />
          </button>
        </div>

        {/* Account cards */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <AccountCard
            icon={<BenefitIconDuo icon="HSA_FSA" />}
            name="Health Savings"
            amount="10,564.61"
            subtitle="HSA + Investments"
          />
          <AccountCard
            icon={<BenefitIconDuo icon="LPFSA" />}
            name="Dental & Vision"
            badge="LP-FSA"
            amount="386.33"
            limit="500.00"
            subtitle="Available Balance"
          />
          <AccountCard
            icon={<BenefitIconDuo icon="Rewards" />}
            name="Health Rewards"
            amount="9.90"
            subtitle="Available Balance"
          />
        </div>

        {/* Transactions */}
        <div style={{ backgroundColor: colors.white, padding: 40, borderRadius: 8 }}>

          {/* Transactions header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2
              style={{
                fontFamily: '"Droid Serif", Georgia, serif',
                fontSize: 26,
                fontWeight: 400,
                color: colors.textDark,
                margin: 0,
              }}
            >
              Transactions
            </h2>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: colors.white,
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 6,
                padding: '0 12px',
                height: 40,
                cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif',
                fontSize: 13,
                color: colors.textDark,
              }}
            >
              Account Type
              <ChevronDown />
            </button>
          </div>

          {/* Pending */}
          <SectionLabel label="Pending" />
          <div>
            {pendingTransactions.map((t, i) => (
              <WalletTransactionListItemWeb
                key={`pending-${i}`}
                merchantName={t.merchantName}
                benefitAccount={t.benefitAccount}
                transactionAmount={t.transactionAmount}
                date={t.date}
                type="Pending"
                benefit={toBenefit(t.benefit)}
                isMoneyOut={t.direction === 'MoneyOut'}
                hasBottomDivider={i < pendingTransactions.length - 1}
              />
            ))}
          </div>

          {/* Cleared */}
          <SectionLabel label="Cleared" />
          <div>
            {clearedTransactions.map((t, i) => (
              <WalletTransactionListItemWeb
                key={`cleared-${i}`}
                merchantName={t.merchantName}
                benefitAccount={t.benefitAccount}
                transactionAmount={t.transactionAmount}
                date={t.date}
                type={t.direction}
                benefit={toBenefit(t.benefit)}
                isMoneyOut={t.direction === 'MoneyOut'}
                hasBottomDivider={i < clearedTransactions.length - 1}
              />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default HomescreenWeb;
