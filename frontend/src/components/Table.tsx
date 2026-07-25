import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => (
  <div className="w-full overflow-x-auto rounded-lg border border-slate-800">
    <table className="w-full text-left text-sm text-slate-300">
      <thead className="bg-slate-900/90 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-3">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">{children}</tbody>
    </table>
  </div>
);
