import React from 'react';
import { Contact } from '../types';
import { Badge } from './Badge';
import { Mail, CheckCircle2 } from 'lucide-react';

export const ContactList: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div key={contact.id} className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-100">{contact.name}</h4>
            <p className="text-xs text-indigo-300 font-medium">{contact.title}</p>
            {contact.email && (
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3 text-slate-500" /> {contact.email}
              </p>
            )}
          </div>
          <div>
            {contact.email_verified ? (
              <Badge variant="success">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </Badge>
            ) : (
              <Badge variant="warning">Unverified</Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
