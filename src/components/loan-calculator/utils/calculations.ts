import { LoanDetails, Calculations } from "../types";
import { REGULATIONS } from "../constants"; // Tambah import REGULATIONS

interface PaymentScheduleItem {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}

export const calculateEffectiveRate = (
    cashPrice: number,
    downPayment: number,
    monthlyPayment: number,
    tenor: number
): number => {
    const principal = cashPrice - downPayment;
    let bestRate = 0;
    let minDiff = Number.MAX_VALUE;

    // Iterative calculation untuk menemukan suku bunga yang tepat
    for (let rate = 0; rate <= 50; rate += 0.1) {
        const monthlyRate = rate / 12 / 100;
        const calculatedPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenor)) /
            (Math.pow(1 + monthlyRate, tenor) - 1);

        const diff = Math.abs(calculatedPayment - monthlyPayment);
        if (diff < minDiff) {
            minDiff = diff;
            bestRate = rate;
        }
    }

    return bestRate;
};

export const calculateLoan = (loanDetails: LoanDetails): Calculations => {
    const principal = loanDetails.cashPrice - loanDetails.downPayment;
    let monthlyInstallment: number;
    let effectiveRate: number;
    const scheduleData: PaymentScheduleItem[] = [];

    // Jika cicilan bulanan diinput
    if (loanDetails.monthlyPayment) {
        monthlyInstallment = loanDetails.monthlyPayment;
        effectiveRate = calculateEffectiveRate(
            loanDetails.cashPrice,
            loanDetails.downPayment,
            monthlyInstallment,
            loanDetails.tenor
        );
    } else {
        // Perhitungan normal dengan suku bunga
        const interestRate = loanDetails.interestRate || DEFAULT_INTEREST_RATE; // Tambahkan default
        const monthlyRate = interestRate / 12 / 100;

        if (loanDetails.isIslamic) {
            // Perhitungan flat untuk syariah
            monthlyInstallment = (principal * (1 + interestRate * loanDetails.tenor / 1200)) / loanDetails.tenor;
        } else {
            // Perhitungan bunga efektif
            monthlyInstallment = (principal * monthlyRate * Math.pow(1 + monthlyRate, loanDetails.tenor)) /
                (Math.pow(1 + monthlyRate, loanDetails.tenor) - 1);
        }
        effectiveRate = interestRate;
    }

    // Generate payment schedule
    let remainingBalance = principal;
    const monthlyRate = effectiveRate / 12 / 100;

    for (let month = 1; month <= loanDetails.tenor; month++) {
        const interest = loanDetails.isIslamic ?
            (principal * (effectiveRate / 100) * (loanDetails.tenor / 12)) / loanDetails.tenor :
            remainingBalance * monthlyRate;

        const principalPayment = monthlyInstallment - interest;
        remainingBalance = Math.max(0, remainingBalance - principalPayment);

        scheduleData.push({
            month,
            payment: monthlyInstallment,
            principal: principalPayment,
            interest,
            balance: remainingBalance
        });
    }

    const totalPayment = monthlyInstallment * loanDetails.tenor + loanDetails.downPayment;
    const totalInterest = totalPayment - loanDetails.cashPrice;

    // Market comparison
    const marketRate = REGULATIONS[loanDetails.itemType].averageMarketRate;
    const marketMonthlyRate = marketRate / 12 / 100;
    const marketPayment = (principal * marketMonthlyRate * Math.pow(1 + marketMonthlyRate, loanDetails.tenor)) /
        (Math.pow(1 + marketMonthlyRate, loanDetails.tenor) - 1);
    const marketTotalPayment = marketPayment * loanDetails.tenor + loanDetails.downPayment;
    const marketTotalInterest = marketTotalPayment - loanDetails.cashPrice;

    return {
        monthlyInstallment,
        totalInterest,
        totalPayment,
        effectiveRate,
        flatRate: (totalInterest / principal) * (12 / loanDetails.tenor) * 100,
        scheduleData,
        marketComparison: {
            payment: marketPayment,
            totalInterest: marketTotalInterest,
            difference: totalPayment - marketTotalPayment
        }
    };
};

// Constants
const DEFAULT_INTEREST_RATE = 10; // Default interest rate if not provided