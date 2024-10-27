import LoanCalculator from "@/components/loan-calculator";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Kalkulator Cicilan
                    </h1>
                    <p className="text-lg text-gray-600">
                        Simulasi perhitungan cicilan untuk kredit kendaraan, properti, dan kebutuhan lainnya
                    </p>
                </div>

                <div className="animate-fade-in">
                    <LoanCalculator />
                </div>

                <footer className="mt-16 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Kalkulator Cicilan. Dibuat dengan teknologi modern.</p>
                    <p className="mt-2">
                        Perhitungan bersifat simulasi. Hasil akhir dapat berbeda sesuai kebijakan pemberi kredit.
                    </p>
                </footer>
            </div>
        </main>
    );
}