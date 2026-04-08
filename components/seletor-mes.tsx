import React from "react";

interface SeletorMesProps {
  meses: Array<{ mes: number; ano: number }>;
}

const SeletorMes: React.FC<SeletorMesProps> = ({ meses }) => {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-md ring-1 ring-zinc-200 rounded-lg">
      <div className="flex flex-wrap gap-2 items-center">
        {meses.map(({ mes, ano }) => (
          <button
            key={`${ano}-${mes}`}
            className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            {mes}/{ano}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeletorMes;
