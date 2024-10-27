"use client"

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValidationAlerts } from "./components/ValidationAlerts";
import { RegulationInfo } from "./components/RegulationInfo";
import { LoanInputs } from "./components/LoanInputs";
import { LoanSummary } from "./components/LoanSummary";
import { LoanSchedule } from "./components/LoanSchedule";
import { LoanChart } from "./components/LoanChart";
import { DEFAULT_VALUES } from "./constants";
import { validateLoanDetails } from "./validation";
import { calculateLoan } from "./utils/calculations";
import { LoanDetails, Calculations, ValidationResult } from "./types";

const LoanCalculator = () => {
    // States
    const [loanDetails, setLoanDetails] = useState<LoanDetails>({
        itemName: "",
        itemType: DEFAULT_VALUES.itemType,
        cashPrice: 0,
        downPayment: 0,
        tenor: 12,
        interestRate: DEFAULT_VALUES.interestRate,
        isIslamic: DEFAULT_VALUES.isIslamic,
        monthlyIncome: undefined,
    });

    const [calculations, setCalculations] = useState<Calculations>({
        monthlyInstallment: 0,
        totalInterest: 0,
        totalPayment: 0,
        scheduleData: [],
        dtiRatio: undefined,
    });

    const [validations, setValidations] = useState<ValidationResult[]>([]);
    const [showRegulationInfo, setShowRegulationInfo] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Effects
    useEffect(() => {
        if (loanDetails.cashPrice > 0 && loanDetails.downPayment > 0) {
            try {
                const newCalculations = calculateLoan(loanDetails);
                setCalculations(newCalculations);

                const newValidations = validateLoanDetails(loanDetails, newCalculations);
                setValidations(newValidations);

                // Update errors based on validations
                const newErrors: Record<string, string> = {};
                newValidations.forEach(validation => {
                    if (validation.severity === 'error') {
                        if (validation.message.toLowerCase().includes('dp')) {
                            newErrors.downPayment = validation.message;
                        } else if (validation.message.toLowerCase().includes('harga')) {
                            newErrors.cashPrice = validation.message;
                        }
                    }
                });
                setErrors(newErrors);
            } catch (error) {
                console.error('Error calculating loan:', error);
            }
        }
    }, [loanDetails]);

    // Handlers
    const handleInputChange = (field: keyof LoanDetails, value: any) => {
        setLoanDetails(prev => ({
            ...prev,
            [field]: value,
            ...(field === "itemType" && {
                downPayment: 0,
                cashPrice: 0
            }),
            ...(field === "isIslamic" && {
                interestRate: value ? DEFAULT_VALUES.interestRate : prev.interestRate,
            }),
        }));
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>
                            Kalkulator Cicilan {loanDetails.isIslamic ? "Syariah" : "Konvensional"}
                        </span>
                        <button
                            onClick={() => setShowRegulationInfo(!showRegulationInfo)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            {showRegulationInfo ? "Sembunyikan Regulasi" : "Lihat Regulasi"}
                        </button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {showRegulationInfo && <RegulationInfo type={loanDetails.itemType} />}
                    {validations.length > 0 && <ValidationAlerts validations={validations} />}

                    <div className="grid gap-6">
                        <LoanInputs
                            loanDetails={loanDetails}
                            onInputChange={handleInputChange}
                            errors={errors}
                        />

                        {loanDetails.cashPrice > 0 && loanDetails.downPayment > 0 && (
                            <Tabs defaultValue="summary" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                                    <TabsTrigger value="schedule">Jadwal Pembayaran</TabsTrigger>
                                    <TabsTrigger value="chart">Grafik</TabsTrigger>
                                </TabsList>

                                <TabsContent value="summary">
                                    <LoanSummary
                                        loanDetails={loanDetails}
                                        calculations={calculations}
                                    />
                                </TabsContent>

                                <TabsContent value="schedule">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <LoanSchedule
                                                scheduleData={calculations.scheduleData}
                                                isIslamic={loanDetails.isIslamic}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="chart">
                                    <LoanChart
                                        data={calculations.scheduleData}
                                        isIslamic={loanDetails.isIslamic}
                                    />
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoanCalculator;