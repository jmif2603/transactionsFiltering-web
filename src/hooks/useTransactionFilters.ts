import { useState, useMemo } from 'react';
import { clearedTransactions, pendingTransactions } from '../data/transactions';
import { DEFAULT_BENEFIT_SELECTIONS } from '../FilterViewA';
import type { FilterState } from '../FilterViewA';

const benefitKeyToType: Record<string, string> = {
  healthSavings: 'HSA_FSA', hra: 'HRA', dcfsa: 'DCFSA', lpfsa: 'LPFSA',
  remoteWork: 'RemoteWork', transit: 'Transit', lsa: 'LSA', parking: 'Parking', rewards: 'Rewards',
};

export function useTransactionFilters() {
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);

  const hasActiveFilters = appliedFilters !== null && (
    Object.values(appliedFilters.benefitSelections).some(Boolean) ||
    appliedFilters.moneyInSelected ||
    appliedFilters.moneyOutSelected ||
    appliedFilters.clearedSelected ||
    appliedFilters.pendingSelected ||
    appliedFilters.dateRangeOption !== null
  );

  const selectedBenefitTypes = appliedFilters
    ? Object.entries(appliedFilters.benefitSelections).filter(([, v]) => v).map(([k]) => benefitKeyToType[k])
    : [];
  const anyBenefitFilter = selectedBenefitTypes.length > 0;
  const anyTypeFilter = appliedFilters ? (appliedFilters.moneyInSelected || appliedFilters.moneyOutSelected) : false;
  const anyStatusFilter = appliedFilters ? (appliedFilters.clearedSelected || appliedFilters.pendingSelected) : false;

  const filterTx = useMemo(() => (tx: { benefit?: string; type?: string; direction?: string; date?: string }) => {
    if (anyBenefitFilter && !selectedBenefitTypes.includes(tx.benefit ?? '')) return false;
    if (anyTypeFilter) {
      if (appliedFilters?.moneyInSelected && tx.direction === 'MoneyIn') return true;
      if (appliedFilters?.moneyOutSelected && tx.direction === 'MoneyOut') return true;
      return false;
    }
    if (appliedFilters?.dateRangeOption && tx.date) {
      const txDate = new Date(tx.date);
      const now = new Date();
      if (appliedFilters.dateRangeOption === 'custom') {
        const { startDate, endDate } = appliedFilters.customDateRange ?? {};
        if (startDate && endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (txDate < startDate || txDate > end) return false;
        }
      } else {
        const msAgo: Record<string, number> = {
          last24hours: 24 * 60 * 60 * 1000,
          last3days: 3 * 24 * 60 * 60 * 1000,
          last7days: 7 * 24 * 60 * 60 * 1000,
          last14days: 14 * 24 * 60 * 60 * 1000,
          last30days: 30 * 24 * 60 * 60 * 1000,
        };
        const cutoff = new Date(now.getTime() - msAgo[appliedFilters.dateRangeOption]);
        if (txDate < cutoff) return false;
      }
    }
    return true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  const showClearedSection = !anyStatusFilter || (appliedFilters?.clearedSelected ?? false);
  const showPendingSection = !anyStatusFilter || (appliedFilters?.pendingSelected ?? false);
  const filteredCleared = useMemo(() => clearedTransactions.filter(filterTx), [filterTx]);
  const filteredPending = useMemo(() => pendingTransactions.filter(filterTx), [filterTx]);

  const clearBenefitFilter = () =>
    setAppliedFilters((prev) => prev && { ...prev, benefitSelections: DEFAULT_BENEFIT_SELECTIONS });
  const clearTypeFilter = () =>
    setAppliedFilters((prev) => prev && { ...prev, moneyInSelected: false, moneyOutSelected: false });
  const clearStatusFilter = () =>
    setAppliedFilters((prev) => prev && { ...prev, clearedSelected: false, pendingSelected: false });
  const clearDateFilter = () =>
    setAppliedFilters((prev) => prev && { ...prev, dateRangeOption: null, customDateRange: undefined });

  return {
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
  };
}
