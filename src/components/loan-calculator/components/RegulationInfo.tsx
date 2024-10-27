import { REGULATIONS } from "../constants";
import { ItemType } from "../types";
import { formatCurrency } from "@/lib/utils";

interface RegulationInfoProps {
    type: ItemType;
}

export const RegulationInfo: React.FC<RegulationInfoProps> = ({ type }) => {
    const regulation = REGULATIONS[type];

    return (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-blue-800 mb-2">
                Informasi Regulasi {type}
            </h4>
            <div className="text-sm text-blue-700 space-y-2">
                <div>
                    <p className="font-medium">Syarat Utama:</p>
                    <ul className="list-disc pl-4 mt-1">
                        <li>Minimal DP: {regulation.minDPPercentage}% dari harga</li>
                        <li>Maksimal rasio cicilan: {regulation.maxDTI}% dari pendapatan</li>
                        <li>Maksimal tenor: {regulation.maxTenor} bulan</li>
                        {regulation.minimumIncome && (
                            <li>
                                Minimal pendapatan: {formatCurrency(regulation.minimumIncome)}/bulan
                            </li>
                        )}
                        {regulation.maximumLoan && (
                            <li>
                                Maksimal pinjaman: {formatCurrency(regulation.maximumLoan)}
                            </li>
                        )}
                    </ul>
                </div>
                <div>
                    <p className="font-medium">Ketentuan:</p>
                    <p className="mt-1 text-blue-600">{regulation.description}</p>
                </div>
                <div className="mt-2 text-xs text-blue-500">
                    * Syarat dan ketentuan mengacu pada regulasi OJK dan kebijakan umum industri
                </div>
            </div>
        </div>
    );
};