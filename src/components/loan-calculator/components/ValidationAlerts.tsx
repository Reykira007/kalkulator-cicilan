import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ValidationResult } from "../types";

interface ValidationAlertsProps {
    validations: ValidationResult[];
}

export const ValidationAlerts: React.FC<ValidationAlertsProps> = ({ validations }) => {
    return (
        <div className="space-y-4 mb-4">
            {validations.map((validation, index) => (
                <Alert
                    key={index}
                    variant={validation.severity === "error" ? "destructive" : "default"}
                    className={
                        validation.severity === "warning"
                            ? "border-yellow-500 text-yellow-800 bg-yellow-50"
                            : validation.severity === "info"
                                ? "border-blue-500 text-blue-800 bg-blue-50"
                                : ""
                    }
                >
                    <AlertTitle className="font-semibold">
                        {validation.severity === "error"
                            ? "Peringatan Penting!"
                            : validation.severity === "warning"
                                ? "Perhatian"
                                : "Informasi"}
                    </AlertTitle>
                    <AlertDescription>
                        <p className="mb-2">{validation.message}</p>
                        {validation.details && (
                            <ul className="list-disc pl-4 space-y-1 text-sm">
                                {validation.details.map((detail, idx) => (
                                    <li key={idx}>{detail}</li>
                                ))}
                            </ul>
                        )}
                    </AlertDescription>
                </Alert>
            ))}
        </div>
    );
};