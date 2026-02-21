export default function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full h-12 border-b-2">
      <div className="flex items-center justify-between gap-x-4">
        <div className="w-48 uppercase tracking-wide text-xs font-bold text-gray-500 mb-4 leading-tight">
          <span>Step {step} of 4</span>
          <div className="text-lg font-bold text-gray-700 leading-tight">
            {step === 1
              ? "Personal Details"
              : step === 2
              ? "Store Details"
              : step === 3
              ? "Shipping Details"
              : "Completed"}
          </div>
        </div>
        <div className="w-full flex-1 bg-white rounded-full mr-2">
          <div
            className="rounded-full bg-green-500 h-2 text-center text-white"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-600">
          {Math.floor((step / 4) * 100)}%
        </div>
      </div>
    </div>
  );
}
