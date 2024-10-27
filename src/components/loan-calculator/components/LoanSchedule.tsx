"use client"

import { ChartData } from "../types";
import { formatCurrency } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface LoanScheduleProps {
    scheduleData: ChartData[];
    isIslamic: boolean;
}

export const LoanSchedule: React.FC<LoanScheduleProps> = ({
    scheduleData,
    isIslamic,
}) => {
    const totalInstallment = scheduleData.reduce(
        (sum, item) => sum + item.installment,
        0
    );
    const totalPrincipal = scheduleData.reduce(
        (sum, item) => sum + item.principal,
        0
    );
    const totalInterest = scheduleData.reduce(
        (sum, item) => sum + item.interest,
        0
    );

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Bulan</TableHead>
                            <TableHead className="text-right">Angsuran</TableHead>
                            <TableHead className="text-right">Pokok</TableHead>
                            <TableHead className="text-right">
                                {isIslamic ? "Margin" : "Bunga"}
                            </TableHead>
                            <TableHead className="text-right">Sisa Pinjaman</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scheduleData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-center">{item.month}</TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(item.installment)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(item.principal)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(item.interest)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(item.balance)}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="font-semibold bg-gray-50">
                            <TableCell>TOTAL</TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(totalInstallment)}
                            </TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(totalPrincipal)}
                            </TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(totalInterest)}
                            </TableCell>
                            <TableCell className="text-right">-</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div className="text-sm text-gray-500 mt-2">
                <p>
                    * {isIslamic ? "Margin" : "Bunga"} total:{" "}
                    <span className="font-medium text-red-600">
                        {formatCurrency(totalInterest)}
                    </span>
                </p>
                <p>
                    * Total yang harus dibayar:{" "}
                    <span className="font-medium text-green-600">
                        {formatCurrency(totalInstallment)}
                    </span>
                </p>
            </div>
        </div>
    );
};