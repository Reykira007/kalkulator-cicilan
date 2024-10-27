import { RegulationType, ItemType } from './types';

export const REGULATIONS: Record<ItemType, RegulationType> = {
    'Motor': {
        minDPPercentage: 20,
        maxDTI: 30,
        maxTenor: 48,
        description: 'Regulasi OJK untuk kredit sepeda motor',
        minimumIncome: 3000000,
        maximumLoan: 50000000,
        averageMarketRate: 10.5
    },
    'Mobil': {
        minDPPercentage: 25,
        maxDTI: 35,
        maxTenor: 60,
        description: 'Regulasi OJK untuk kredit mobil',
        minimumIncome: 7000000,
        maximumLoan: 500000000,
        averageMarketRate: 8.5
    },
    'Properti': {
        minDPPercentage: 30,
        maxDTI: 40,
        maxTenor: 240,
        description: 'Regulasi OJK untuk KPR',
        minimumIncome: 10000000,
        averageMarketRate: 9.5
    },
    'Elektronik': {
        minDPPercentage: 15,
        maxDTI: 25,
        maxTenor: 24,
        description: 'Standar umum kredit elektronik',
        minimumIncome: 3000000,
        maximumLoan: 30000000,
        averageMarketRate: 12.5
    },
    'Modal Usaha': {
        minDPPercentage: 20,
        maxDTI: 50,
        maxTenor: 60,
        description: 'Standar kredit modal usaha',
        minimumIncome: 5000000,
        averageMarketRate: 15.5
    },
    'Lainnya': {
        minDPPercentage: 15,
        maxDTI: 30,
        maxTenor: 36,
        description: 'Standar umum kredit konsumtif',
        minimumIncome: 3000000,
        maximumLoan: 20000000,
        averageMarketRate: 11.5
    }
};

export const TENOR_OPTIONS = [
    3, 6, 9, 12, 12, 17, 18, 23, 24, 29, 30, 32, 35, 36, 47, 48, 59, 60
];

export const DEFAULT_VALUES = {
    itemType: 'Motor' as ItemType,
    interestRate: 10,
    isIslamic: false,
};

export const MINIMUM_PRICES = {
    Motor: 5000000,
    Mobil: 50000000,
    Properti: 100000000,
    Elektronik: 1000000,
    'Modal Usaha': 10000000,
    Lainnya: 1000000,
};

export const SPECIAL_RATES = {
    'Motor': {
        belowThreshold: { threshold: 20000000, rate: 8 },
        aboveThreshold: { threshold: 20000000, rate: 9 }
    },
    'Mobil': {
        belowThreshold: { threshold: 200000000, rate: 7 },
        aboveThreshold: { threshold: 200000000, rate: 8 }
    }
};

export const ERROR_MESSAGES = {
    MINIMUM_PRICE: 'Harga terlalu rendah untuk jenis item ini',
    MINIMUM_DP: 'DP tidak memenuhi standar minimal',
    MINIMUM_INCOME: 'Pendapatan tidak memenuhi syarat minimum',
    TENOR_TOO_LONG: 'Tenor melebihi batas maksimum',
    DTI_TOO_HIGH: 'Rasio cicilan terhadap pendapatan terlalu tinggi',
    LOAN_TOO_HIGH: 'Jumlah pinjaman melebihi batas maksimum',
    DP_BELOW_MIN: 'DP dibawah standar minimal regulasi',
    HIGH_INTEREST: 'Suku bunga lebih tinggi dari rata-rata pasar',
};