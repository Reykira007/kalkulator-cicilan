"use client"

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { REGULATIONS } from "../constants";
import { LoanDetails, ItemType } from "../types";
import { formatCurrency } from "@/lib/utils";

interface LoanInputsProps {
    loanDetails: LoanDetails;
    onInputChange: (field: keyof LoanDetails, value: unknown) => void;
    errors: Record<string, string>;
}

export const LoanInputs: React.FC<LoanInputsProps> = ({
    loanDetails,
    onInputChange,
    errors,
}) => {
    const getMinDP = () => {
        const regulation = REGULATIONS[loanDetails.itemType];
        return loanDetails.cashPrice * (regulation.minDPPercentage / 100);
    };

    // State untuk menentukan metode input
    const [inputMethod, setInputMethod] = useState<'monthly' | 'interest'>('monthly');

    // Handler untuk perubahan metode input
    const handleInputMethodChange = (value: 'monthly' | 'interest') => {
        setInputMethod(value);
        // Reset nilai yang tidak relevan
        if (value === 'monthly') {
            onInputChange('interestRate', undefined);
        } else {
            onInputChange('monthlyPayment', undefined);
        }
    };

    return (
        <div className="space-y-6">
            {/* Input Dasar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Input untuk Nama Item */}
                <div className="space-y-2">
                    <Label htmlFor="itemName">Nama {loanDetails.itemType}</Label>
                    <Input
                        id="itemName"
                        value={loanDetails.itemName}
                        onChange={(e) => onInputChange("itemName", e.target.value)}
                        placeholder={`Masukkan nama ${loanDetails.itemType}`}
                        className={errors.itemName ? "border-red-500" : ""}
                    />
                    {errors.itemName && (
                        <p className="text-red-500 text-sm">{errors.itemName}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Jenis Item</Label>
                    <Select
                        value={loanDetails.itemType}
                        onValueChange={(value: ItemType) => onInputChange("itemType", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis item" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(REGULATIONS).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Input untuk Harga Cash */}
                <div className="space-y-2">
                    <Label htmlFor="cashPrice">Harga Cash</Label>
                    <Input
                        id="cashPrice"
                        type="number"
                        value={loanDetails.cashPrice > 0 ? loanDetails.cashPrice : ""}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            onInputChange("cashPrice", isNaN(value) ? 0 : value);
                        }}
                        placeholder="Masukkan harga cash"
                        className={errors.cashPrice ? "border-red-500" : ""}
                    />
                    {errors.cashPrice && (
                        <p className="text-red-500 text-sm">{errors.cashPrice}</p>
                    )}
                </div>

                {/* Input untuk Uang Muka (DP) */}
                <div className="space-y-2">
                    <Label htmlFor="downPayment">Uang Muka (DP)</Label>
                    <Input
                        id="downPayment"
                        type="number"
                        min={getMinDP()}
                        value={loanDetails.downPayment > 0 ? loanDetails.downPayment : ""}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            onInputChange("downPayment", isNaN(value) ? 0 : value);
                        }}
                        placeholder={`Minimal ${formatCurrency(getMinDP())}`}
                        className={errors.downPayment ? "border-red-500" : ""}
                    />
                    {errors.downPayment && (
                        <p className="text-red-500 text-sm">{errors.downPayment}</p>
                    )}
                </div>

                {/* Tenor dengan Input Manual */}
                <div className="space-y-2">
                    <Label htmlFor="tenor">Tenor (Bulan)</Label>
                    <Input
                        id="tenor"
                        type="number"
                        value={loanDetails.tenor || ""}
                        onChange={(e) => onInputChange("tenor", Number(e.target.value))}
                        placeholder="Masukkan tenor dalam bulan"
                        className={errors.tenor ? "border-red-500" : ""}
                    />
                    {errors.tenor && (
                        <p className="text-red-500 text-sm">{errors.tenor}</p>
                    )}
                </div>

                {/* Pilihan Metode Input */}
                <div className="col-span-full">
                    <RadioGroup
                        value={inputMethod}
                        onValueChange={handleInputMethodChange}
                        className="space-y-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly">Input Cicilan per Bulan (dari brosur)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="interest" id="interest" />
                            <Label htmlFor="interest">Input Suku Bunga (jika diketahui)</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Input Kondisional berdasarkan metode */}
                {inputMethod === 'monthly' ? (
                    <div className="space-y-2">
                        <Label htmlFor="monthlyPayment">Cicilan per Bulan</Label>
                        <Input
                            id="monthlyPayment"
                            type="number"
                            value={loanDetails.monthlyPayment || ""}
                            onChange={(e) => onInputChange("monthlyPayment", Number(e.target.value))}
                            placeholder="Masukkan cicilan per bulan"
                            className={errors.monthlyPayment ? "border-red-500" : ""}
                        />
                        {errors.monthlyPayment && (
                            <p className="text-red-500 text-sm">{errors.monthlyPayment}</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="interestRate">
                            {loanDetails.isIslamic ? "Margin" : "Suku Bunga"} per Tahun (%)
                        </Label>
                        <Input
                            id="interestRate"
                            type="number"
                            value={loanDetails.interestRate || ""}
                            onChange={(e) => onInputChange("interestRate", Number(e.target.value))}
                            step="0.1"
                            className={errors.interestRate ? "border-red-500" : ""}
                        />
                        {errors.interestRate && (
                            <p className="text-red-500 text-sm">{errors.interestRate}</p>
                        )}
                    </div>
                )}

                {/* Pendapatan Bulanan - Opsional */}
                <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Pendapatan Bulanan (Opsional)</Label>
                    <Input
                        id="monthlyIncome"
                        type="number"
                        value={loanDetails.monthlyIncome || ""}
                        onChange={(e) => onInputChange("monthlyIncome", Number(e.target.value))}
                        placeholder="Masukkan pendapatan bulanan"
                        className={errors.monthlyIncome ? "border-red-500" : ""}
                    />
                    {errors.monthlyIncome && (
                        <p className="text-red-500 text-sm">{errors.monthlyIncome}</p>
                    )}
                </div>
            </div>
        </div>
    );
};