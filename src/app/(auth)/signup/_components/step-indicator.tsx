interface StepIndicatorProps {
  currentStep: number; // 1-indexed
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 mb-6 w-full">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Dot */}
            <div
              className={`w-2.5 h-2.5 m-1.5 border-2 shrink-0 transition-all rotate-45 ${
                isCompleted
                  ? "bg-blue-600 border-blue-600"
                  : isActive
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-gray-300"
              }`}
            />
            {/* Connector line (not after last) */}
            {step < totalSteps && (
              <div
                className={`flex-1 h-0.5 ${
                  isCompleted
                    ? "bg-blue-600"
                    : "border-t-2 border-dashed border-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
