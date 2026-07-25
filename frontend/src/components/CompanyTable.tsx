import React from 'react';
import { Table } from './Table';
import { Badge } from './Badge';
import { Button } from './Button';
import { Company } from '../types';
import { Search, Mail, UserCheck } from 'lucide-react';

interface CompanyTableProps {
  companies: Company[];
  onInspectResearch?: (company: Company) => void;
  onViewContacts?: (company: Company) => void;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  onInspectResearch,
  onViewContacts,
}) => {
  return (
    <Table headers={['Company & Domain', 'Industry', 'Size', 'ICP Fit Score', 'Actions']}>
      {companies.map((c) => (
        <tr key={c.id} className="hover:bg-slate-900/50 transition">
          <td className="px-4 py-3">
            <div className="font-semibold text-slate-100">{c.name}</div>
            <div className="text-xs text-indigo-400 font-mono">{c.domain}</div>
          </td>
          <td className="px-4 py-3 text-xs text-slate-300">{c.industry || 'Tech'}</td>
          <td className="px-4 py-3 text-xs text-slate-300">{c.employee_count} employees</td>
          <td className="px-4 py-3">
            <Badge variant={c.icp_score >= 90 ? 'success' : 'info'}>{c.icp_score}% Match</Badge>
          </td>
          <td className="px-4 py-3 space-x-2">
            {onInspectResearch && (
              <Button size="sm" variant="secondary" onClick={() => onInspectResearch(c)}>
                <Search className="w-3.5 h-3.5 mr-1" /> Brief
              </Button>
            )}
            {onViewContacts && (
              <Button size="sm" variant="outline" onClick={() => onViewContacts(c)}>
                <UserCheck className="w-3.5 h-3.5 mr-1" /> Prospects
              </Button>
            )}
          </td>
        </tr>
      ))}
    </Table>
  );
};
