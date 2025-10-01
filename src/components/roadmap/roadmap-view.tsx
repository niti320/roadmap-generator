"use client";

import type { RoadmapStep } from '@/lib/types';
import { RoadmapNode } from './roadmap-node';
import { produce } from 'immer';
import { FileJson } from 'lucide-react';
import { Button } from '../ui/button';

interface RoadmapViewProps {
  roadmap: RoadmapStep[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapStep[] | null>>;
}

export function RoadmapView({ roadmap, setRoadmap }: RoadmapViewProps) {

  const handleUpdateStep = (path: number[], newStepData: Partial<RoadmapStep>) => {
    setRoadmap(produce(draft => {
      if (!draft) return;
      let currentLevel: RoadmapStep[] = draft;
      path.slice(0, -1).forEach(index => {
        currentLevel = currentLevel[index].subSteps;
      });
      const finalIndex = path[path.length - 1];
      currentLevel[finalIndex] = { ...currentLevel[finalIndex], ...newStepData };
    }));
  };

  const handleDeleteStep = (path: number[]) => {
    setRoadmap(produce(draft => {
      if (!draft) return;
      let currentLevel: RoadmapStep[] = draft;
      if (path.length === 1) {
        draft.splice(path[0], 1);
        return;
      }
      path.slice(0, -1).forEach(index => {
        currentLevel = currentLevel[index].subSteps;
      });
      const finalIndex = path[path.length - 1];
      currentLevel.splice(finalIndex, 1);
    }));
  };
  const downloadpdf = () => {
    window.print();
  };

  const renderRoadmapList = (steps: RoadmapStep[]) => (
    <ul>
      {steps.map(step => (
        <li key={step.id}>
          <strong>{step.title}</strong>: {step.description}
          {step.subSteps.length > 0 && renderRoadmapList(step.subSteps)}
        </li>
      ))}
    </ul>
  );
  const renderPrintStep = (steps: RoadmapStep[]) => {
  return steps.map(step => (
    <div key={step.id} className="print-step">
      <div className="step-title">{step.title}</div>
      <div className="step-description">{step.description}</div>
      {step.subSteps.length > 0 && (
        <div className="print-substeps">
          {renderPrintStep(step.subSteps)}
        </div>
      )}
    </div>
  ));
};

  const handleAddSubStep = (path: number[]) => {
    setRoadmap(produce(draft => {
      if (!draft) return;
      let currentLevel: RoadmapStep[] = draft;
      path.forEach(index => {
        currentLevel = currentLevel[index].subSteps;
      });
      const newStep: RoadmapStep = {
        id: `step_${Math.random().toString(36).substring(2, 11)}`,
        title: 'New Step',
        description: 'Add a description.',
        subSteps: [],
      };
      currentLevel.push(newStep);
    }));
  };

  return (
     <div className="space-y-4">
      <Button variant="outline" onClick={downloadpdf}>
        <FileJson />
        Export as PDF
      </Button>

      <div id="printable-roadmap">
        {renderPrintStep(roadmap)}
      </div>

      {roadmap.map((step, index) => (
        <RoadmapNode
          key={step.id}
          step={step}
          path={[index]}
          onUpdateStep={handleUpdateStep}
          onDeleteStep={handleDeleteStep}
          onAddSubStep={handleAddSubStep}
        />
      ))}
    </div>
  );
}
