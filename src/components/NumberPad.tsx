'use client';

type NumberPadProps = {
  label: string;
  onInput: (value: number) => void;
};

export default function NumberPad({ label, onInput }: NumberPadProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-1 font-medium text-gray-700">{label}</div>
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <button
            key={`number-${i + 1}`}
            onClick={() => onInput(i + 1)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-400 rounded shadow hover:bg-gray-100 text-2xl font-bold text-[#6096B4]"
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

