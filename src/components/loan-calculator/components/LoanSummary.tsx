import { Card, CardContent } from "@/components/ui/card";
import { LoanDetails, Calculations } from "../types";
import { formatCurrency } from "@/lib/utils";

interface LoanSummaryProps {
    loanDetails: LoanDetails;
    calculations: Calculations;
}

export const LoanSummary: React.FC<LoanSummaryProps> = ({
    loanDetails,
    calculations,
}) => {
    const calculatePercentage = (amount: number, total: number): string => {
        return ((amount / total) * 100).toFixed(1);
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Rincian Pembiayaan</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Harga {loanDetails.itemType}:</span>
                                    <span>{formatCurrency(loanDetails.cashPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Uang Muka ({calculatePercentage(loanDetails.downPayment, loanDetails.cashPrice)}%):</span>
                                    <span>{formatCurrency(loanDetails.downPayment)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Pokok Pembiayaan:</span>
                                    <span>{formatCurrency(loanDetails.cashPrice - loanDetails.downPayment)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Cicilan per Bulan:</span>
                                    <span className="text-primary">{formatCurrency(calculations.monthlyInstallment)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Tenor:</span>
                                    <span>{loanDetails.tenor} bulan</span>
                                </div>
                                {loanDetails.monthlyIncome && (
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Rasio Cicilan-Pendapatan:</span>
                                        <span className={calculations.dtiRatio && calculations.dtiRatio > 30 ? "text-red-500" : "text-green-500"}>
                                            {calculations.dtiRatio?.toFixed(1)}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Total Biaya</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>{loanDetails.isIslamic ? "Total Margin" : "Total Bunga"}:</span>
                                    <span className="text-red-600">{formatCurrency(calculations.totalInterest)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Persentase terhadap pokok:</span>
                                    <span>
                                        {calculatePercentage(
                                            calculations.totalInterest,
                                            loanDetails.cashPrice - loanDetails.downPayment
                                        )}%
                                    </span>
                                </div>
                                <div className="flex justify-between font-medium pt-2 border-t">
                                    <span>Total Pembayaran:</span>
                                    <span className="text-green-600">
                                        {formatCurrency(calculations.totalPayment)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-red-500">
                                    <span>Selisih dengan Harga Cash:</span>
                                    <span>
                                        {formatCurrency(calculations.totalPayment - loanDetails.cashPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-blue-50">
                <CardContent className="pt-6">
                    <div className="text-sm text-blue-700 space-y-2">
                        <h4 className="font-medium text-blue-800">Informasi Penting:</h4>
                        <p>• Perhitungan menggunakan metode {loanDetails.isIslamic ? "Murabahah" : "bunga efektif"}</p>
                        <p>• {loanDetails.isIslamic ? "Margin" : "Bunga"} per tahun: {loanDetails.interestRate}%</p>
                        {loanDetails.monthlyIncome && (
                            <p>
                                • Rasio cicilan terhadap pendapatan:{" "}
                                <span className={calculations.dtiRatio && calculations.dtiRatio > 30 ? "text-red-600" : "text-green-600"}>
                                    {calculations.dtiRatio?.toFixed(1)}%
                                </span>
                            </p>
                        )}
                        <p className="text-blue-600">
                            * Simulasi ini bersifat estimasi, nilai final dapat berbeda sesuai kebijakan pemberi pembiayaan
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};