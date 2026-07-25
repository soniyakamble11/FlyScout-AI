import React, { createContext, useContext, useState } from 'react';
import { PipelineProgressEvent, Company } from '../types';

interface PipelineContextType {
  activeJobId: string | null;
  setActiveJobId: (id: string | null) => void;
  progressEvents: PipelineProgressEvent[];
  addProgressEvent: (event: PipelineProgressEvent) => void;
  discoveredCompanies: Company[];
  setDiscoveredCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  clearPipeline: () => void;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

export const PipelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [progressEvents, setProgressEvents] = useState<PipelineProgressEvent[]>([]);
  const [discoveredCompanies, setDiscoveredCompanies] = useState<Company[]>([]);

  const addProgressEvent = (event: PipelineProgressEvent) => {
    setProgressEvents((prev) => [...prev, event]);
  };

  const clearPipeline = () => {
    setActiveJobId(null);
    setProgressEvents([]);
    setDiscoveredCompanies([]);
  };

  return (
    <PipelineContext.Provider
      value={{
        activeJobId,
        setActiveJobId,
        progressEvents,
        addProgressEvent,
        discoveredCompanies,
        setDiscoveredCompanies,
        clearPipeline,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (!context) throw new Error('usePipeline must be used within PipelineProvider');
  return context;
};
