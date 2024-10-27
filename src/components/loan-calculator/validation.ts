import { LoanDetails, ValidationResult, Calculations } from './types';
import { REGULATIONS, MINIMUM_PRICES, ERROR_MESSAGES } from './constants';
import { formatCurrency } from '@/lib/utils';

export const validateLoanDetails = (
    loanDetails: LoanDetails,
    calculations: Calculations
): ValidationResult[] => {
    const results: ValidationResult[] = [];
    const regulation = REGULATIONS[loanDetails.itemType];

    // Validasi Harga Minimum
    const minPrice = MINIMUM_PRICES[loanDetails.itemType];
    if (loanDetails.cashPrice < minPrice) {
        results.push({
            isValid: false,
            severity: 'error',
            message: ERROR_MESSAGES.MINIMUM_PRICE,
            details: [
                `Minimum harga untuk ${loanDetails.itemType}: ${formatCurrency(minPrice)}`,
                `Harga saat ini: ${formatCurrency(loanDetails.cashPrice)}`
            ]
        });
    }

    // Validasi DP
    const minDP = loanDetails.cashPrice * (regulation.minDPPercentage / 100);
    const actualDPPercentage = (loanDetails.downPayment / loanDetails.cashPrice) * 100;

    if (loanDetails.downPayment < minDP) {
        results.push({
            isValid: false,
            severity: 'error',
            message: ERROR_MESSAGES.MINIMUM_DP,
            details: [
                `Minimal DP ${regulation.minDPPercentage}%: ${formatCurrency(minDP)}`,
                `DP saat ini ${actualDPPercentage.toFixed(1)}%: ${formatCurrency(loanDetails.downPayment)}`,
                `Kekurangan DP: ${formatCurrency(minDP - loanDetails.downPayment)}`
            ]
        });
    }

    // Validasi Pendapatan Minimum
    if (loanDetails.monthlyIncome && regulation.minimumIncome) {
        if (loanDetails.monthlyIncome < regulation.minimumIncome) {
            results.push({
                isValid: false,
                severity: 'error',
                message: ERROR_MESSAGES.MINIMUM_INCOME,
                details: [
                    `Minimum pendapatan: ${formatCurrency(regulation.minimumIncome)}`,
                    `Pendapatan saat ini: ${formatCurrency(loanDetails.monthlyIncome)}`
                ]
            });
        }
    }

    // Validasi Maksimum Pinjaman
    const loanAmount = loanDetails.cashPrice - loanDetails.downPayment;
    if (regulation.maximumLoan && loanAmount > regulation.maximumLoan) {
        results.push({
            isValid: false,
            severity: 'error',
            message: ERROR_MESSAGES.LOAN_TOO_HIGH,
            details: [
                `Maksimum pinjaman: ${formatCurrency(regulation.maximumLoan)}`,
                `Pinjaman yang diminta: ${formatCurrency(loanAmount)}`
            ]
        });
    }

    // Validasi DTI
    if (loanDetails.monthlyIncome) {
        const dtiRatio = (calculations.monthlyInstallment / loanDetails.monthlyIncome) * 100;
        if (dtiRatio > regulation.maxDTI) {
            results.push({
                isValid: false,
                severity: 'warning',
                message: ERROR_MESSAGES.DTI_TOO_HIGH,
                details: [
                    `Maksimal rasio cicilan: ${regulation.maxDTI}%`,
                    `Rasio saat ini: ${dtiRatio.toFixed(1)}%`,
                    `Maksimal cicilan yang disarankan: ${formatCurrency(loanDetails.monthlyIncome * regulation.maxDTI / 100)}`,
                    'Saran: Tambah DP atau perpanjang tenor'
                ]
            });
        }
    }

    return results;
};

export const validateInputValue = (
    field: keyof LoanDetails,
    value: number,
    loanDetails: LoanDetails
): ValidationResult | null => {
    switch (field) {
        case 'cashPrice':
            if (value < MINIMUM_PRICES[loanDetails.itemType]) {
                return {
                    isValid: false,
                    severity: 'error',
                    message: `Minimum harga untuk ${loanDetails.itemType}: ${formatCurrency(MINIMUM_PRICES[loanDetails.itemType])}`
                };
            }
            break;

        case 'downPayment':
            const minDP = loanDetails.cashPrice * (REGULATIONS[loanDetails.itemType].minDPPercentage / 100);
            if (value < minDP) {
                return {
                    isValid: false,
                    severity: 'warning',
                    message: `DP minimum yang disarankan: ${formatCurrency(minDP)} (${REGULATIONS[loanDetails.itemType].minDPPercentage}%)`
                };
            }
            break;

        case 'monthlyIncome':
            const minIncome = REGULATIONS[loanDetails.itemType].minimumIncome || 0;
            if (value < minIncome) {
                return {
                    isValid: false,
                    severity: 'warning',
                    message: `Pendapatan minimum yang disarankan: ${formatCurrency(minIncome)}`
                };
            }
            break;
    }

    return null;
};