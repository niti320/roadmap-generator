export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  subSteps: RoadmapStep[];
}
