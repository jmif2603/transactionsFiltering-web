import BenefitTransactionIcon from './BenefitIconTransactionItem';
import { IconChevronRight } from './icons';

type BenefitType =
  | 'HSA_FSA'
  | 'HRA'
  | 'DCFSA'
  | 'LPFSA'
  | 'RemoteWork'
  | 'Transit'
  | 'LSA'
  | 'Parking'
  | 'Rewards'
  | 'Funding';

type TransactionType = 'MoneyIn' | 'MoneyOut' | 'Pending';

interface WalletTransactionListItemWebProps {
  merchantName: string;
  benefitAccount: string;
  transactionAmount: string;
  date: string;
  type?: TransactionType;
  benefit?: BenefitType;
  hasBottomDivider?: boolean;
  isMoneyOut?: boolean;
}

const colors = {
  textDark: '#0f2b4d',
  textMuted: '#60758f',
  borderLight: '#f7f3f2',
};

const WalletTransactionListItemWeb = ({
  merchantName,
  benefitAccount,
  transactionAmount,
  date,
  type = 'MoneyOut',
  benefit = 'HSA_FSA',
  hasBottomDivider = true,
  isMoneyOut = true,
}: WalletTransactionListItemWebProps) => {
  const iconType = type === 'Pending' ? ('Pending' as const) : type;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        padding: '20px 0',
        borderBottom: hasBottomDivider ? `1px solid ${colors.borderLight}` : 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* Merchant: icon + name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          width: 288,
          flexShrink: 0,
        }}
      >
        <BenefitTransactionIcon benefit={benefit} type={iconType} />
        <p
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: 15,
            fontWeight: 500,
            lineHeight: '22.5px',
            letterSpacing: -0.3,
            color: colors.textMuted,
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {merchantName}
        </p>
      </div>

      {/* Date */}
      <p
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: 13,
          fontWeight: 400,
          lineHeight: '19.5px',
          color: colors.textMuted,
          margin: 0,
          width: 120,
          flexShrink: 0,
          textAlign: 'center',
        }}
      >
        {date}
      </p>

      {/* Benefit account */}
      <p
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontSize: 13,
          fontWeight: 400,
          lineHeight: '19.5px',
          color: colors.textMuted,
          margin: 0,
          width: 140,
          flexShrink: 0,
        }}
      >
        {benefitAccount}
      </p>

      {/* Amount + Chevron */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 24,
          width: 180,
          flexShrink: 0,
        }}
      >
        {type === 'Pending' ? (
          <p
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 15,
              fontWeight: 500,
              lineHeight: '22.5px',
              letterSpacing: -0.15,
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {isMoneyOut && <span style={{ color: colors.textDark }}>- </span>}
            <span style={{ color: colors.textMuted }}>${transactionAmount}</span>
          </p>
        ) : (
          <p
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 15,
              fontWeight: 500,
              lineHeight: '22.5px',
              letterSpacing: -0.15,
              color: isMoneyOut ? colors.textDark : '#27a74a',
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {isMoneyOut ? '- $' : '$'}{transactionAmount}
          </p>
        )}
        <IconChevronRight size={16} color={colors.textMuted} />
      </div>
    </div>
  );
};

export default WalletTransactionListItemWeb;
