import BenefitIcon from './BenefitIconStroke';

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

interface BenefitIconTransactionItemProps {
  benefit: BenefitType;
  type?: TransactionType;
  size?: number;
}

const BenefitTransactionIcon = ({
  benefit,
  type = 'MoneyIn',
  size = 40,
}: BenefitIconTransactionItemProps) => {
  // Background colors from Figma design tokens
  const backgroundColors: Record<TransactionType, string> = {
    MoneyIn: '#e9f6ed',   // Success/light green
    MoneyOut: '#fbebec',  // Critical/light red
    Pending: '#fbebec',   // Critical/light red (same as MoneyOut)
  };

  // Icon colors based on transaction type
  const iconColors: Record<TransactionType, string> = {
    MoneyIn: '#2e7d32',   // Green
    MoneyOut: '#c62828',  // Red
    Pending: '#757575',   // Gray
  };

  const iconSize = size * 0.4; // Icon is 40% of container (16px in 40px)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        backgroundColor: backgroundColors[type],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BenefitIcon
        icon={benefit}
        size={iconSize}
        color={iconColors[type]}
      />
    </div>
  );
};

export default BenefitTransactionIcon;