import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            TrueDogAge
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your dog&apos;s real age in human years using science
          </p>
        </header>

        <Calculator />

        <footer className="text-center mt-12 text-sm text-gray-600">
          <p>
            Based on epigenetic clock research by UC San Diego (2020)
          </p>
          <p className="mt-2">
            Formula: 16 × ln(dog age) + 31
          </p>
        </footer>
      </div>
    </main>
  );
}
