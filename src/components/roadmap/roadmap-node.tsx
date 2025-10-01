import { useState } from 'react';
import type { RoadmapStep } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { EditStepDialog } from './edit-step-dialog';

const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
];

interface RoadmapNodeProps {
  step: RoadmapStep;
  path: number[];
  onUpdateStep: (path: number[], newStepData: Partial<RoadmapStep>) => void;
  onDeleteStep: (path: number[]) => void;
  onAddSubStep: (path: number[]) => void;
}

export function RoadmapNode({ step, path, onUpdateStep, onDeleteStep, onAddSubStep }: RoadmapNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 

  const depth = path.length - 1;
  const nodeColor = COLORS[depth % COLORS.length];

  const getNodeNumber = (path: number[]) => {
    if (path.length === 1) return (path[0] + 1).toString();
    return path.map(idx => idx + 1).join('.');
  };

  const nodeNumber = getNodeNumber(path);

  // Delete modal handlers
  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const handleDelete = () => {
    onDeleteStep(path);
    closeDeleteModal();
  };

  return (
    <div className="flex flex-col items-center relative">
      <div className="flex flex-col items-center relative group">
        <div
          onClick={() => setShowDescription(true)}
          className={`rounded-full font-bold text-white w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110 ${nodeColor}`}
        >
          {nodeNumber}
        </div>

        <div
          className={`mt-2 text-center max-w-[140px] break-words ${depth === 0 ? "font-extrabold text-base sm:text-lg" : "font-medium text-xs sm:text-sm"}`}
        >
          {step.title}
        </div>

        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="ghost" onClick={() => onAddSubStep(path)}>
            <Plus className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="hover:text-destructive" onClick={openDeleteModal}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
          <div className="bg-background border shadow-lg rounded-lg p-6 w-full max-w-lg grid gap-4 animate-zoom-in">
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold">Delete step?</h2>
              <p className="text-sm text-muted-foreground">
                This will delete "{step.title}" and all its sub-steps.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button size="default" variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button size="default" className="bg-destructive text-white" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDescription && step.description && (
        <div
          className="fixed z-50 w-56 sm:w-64 max-w-xs bg-card border rounded-lg shadow-lg p-3 text-xs sm:text-sm text-muted-foreground"
          style={{
            top: `${window.innerHeight / 2}px`,
            left: `${window.innerWidth / 2}px`,
            transform: 'translate(-50%, -100%)', 
          }}
        >
          <div className="flex justify-between items-start">
            <p className="pr-2">{step.description}</p>
            <button
              onClick={() => setShowDescription(false)}
              className="ml-2 text-gray-500 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      {isExpanded && step.subSteps && step.subSteps.length > 0 && (
        <div className="relative mt-8 w-full overflow-x-auto">
          <svg
            className="absolute top-0 left-1/2 -translate-x-1/2"
            width="100%"
            height="40"
          >
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="40"
              stroke="gray"
              strokeWidth="1"
            />
          </svg>

          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-10 px-4">
            {step.subSteps.map((subStep, index) => (
              <div key={subStep.id} className="relative min-w-[120px]">
                <svg
                  className="absolute -top-10 left-1/2 -translate-x-1/2"
                  width="2"
                  height="40"
                >
                  <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="40"
                    stroke="gray"
                    strokeWidth="1"
                  />
                </svg>

                <RoadmapNode
                  step={subStep}
                  path={[...path, index]}
                  onUpdateStep={onUpdateStep}
                  onDeleteStep={onDeleteStep}
                  onAddSubStep={onAddSubStep}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <EditStepDialog
        isOpen={isEditing}
        setIsOpen={setIsEditing}
        step={step}
        onSave={(newStepData) => onUpdateStep(path, newStepData)}
      />
    </div>
  );
}
