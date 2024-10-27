export type ItemType = 'Motor' | 'Mobil' | 'Properti' | 'Elektronik' | 'Modal Usaha' | 'Lainnya';

export interface LoanDetails {
    itemName: string;
    itemType: ItemType;
    cashPrice: number;
    downPayment: number;
    tenor: number;
    monthlyPayment?: number;
    interestRate?: number;
    isIslamic: boolean;
    monthlyIncome?: number;
}

export interface ValidationResult {
    isValid: boolean;
    message: string;
    severity: 'warning' | 'error' | 'info';
    details?: string[];
}

export interface Calculations {
    monthlyInstallment: number;
    totalInterest: number;
    totalPayment: number;
    effectiveRate?: number;
    flatRate?: number;
    scheduleData: Array<{
        month: number;
        payment: number;
        principal: number;
        interest: number;
        balance: number;
    }>;
    marketComparison?: {
        payment: number;
        totalInterest: number;
        difference: number;
    };
    dtiRatio?: number;
}

export interface RegulationType {
    minDPPercentage: number;
    maxDTI: number;
    maxTenor: number;
    description: string;
    minimumIncome: number;
    maximumLoan?: number;
    averageMarketRate: number;
}

export interface ChartData {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}
