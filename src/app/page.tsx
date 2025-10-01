"use client";

import { use, useState } from 'react';
import { FileJson, LoaderCircle, AlertCircle, Wand2 } from 'lucide-react';
import { RoadmapForm } from '@/components/roadmap/roadmap-form';
import { RoadmapView } from '@/components/roadmap/roadmap-view';
import { generateRoadmapAction } from '@/app/actions';
import type { RoadmapStep } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRoadmap = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setRoadmap(null);

    const result = await generateRoadmapAction(prompt);

    if ('error' in result) {
      setError(result.error);
    } else {
      setRoadmap(result.roadmap);
    }

    setIsLoading(false);
  };

  const handleExportJson = () => {
    if (!roadmap) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(roadmap, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "roadmap.json";
    link.click();
  };

  // const downloadpdf = () => {
  //   window.print();
  // };

  const handleClear = () => {
    setRoadmap(null);
    triggerShowRoadmapSection();
  };
  console.log("roadmap:", roadmap);

  const [showroadmapSection, setShowRoadmapSection] = useState("hidden");

  const triggerShowRoadmapSection = () => {
    if (roadmap) {
      setShowRoadmapSection((prev) => (prev === "hidden" ? "" : "hidden"));
    }
    else { setShowRoadmapSection("hidden"); }
  };
  return (
    <main className="flex flex-col items-center p-4 md:p-8 justify-center w-full">
      <div className="w-full max-w-4xl justify-center items-center flex flex-row">
        <section className="text-center py-12 md:py-20">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-12">
            Get the roadmap for what you wish to learn
          </h1>

          <section className="mb-12 justify-center flex flex-col items-center gap-4">
            {roadmap ? (
              <Button
                // variant={showroadmapSection === "hidden" ? "default" : "outline"}
                onClick={triggerShowRoadmapSection}
                className={`flex items-center gap-2`}
              >
                <Wand2 className="w-4 h-4" />
                {showroadmapSection === "hidden" ? "Show Generated Roadmap" : "Hide Roadmap"}
              </Button>
            ) : null}
            <RoadmapForm onGenerate={handleGenerateRoadmap} isLoading={isLoading} />
          </section>
          {/* <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe your goal, and let our AI generate a comprehensive, step-by-step roadmap to guide you to success.
          </p> */}
        </section>


        <section className={`min-h-[400px] w-full max-w-[1200px] top-20 absolute bg-background ${showroadmapSection}`}>
          <div className="flex gap-4 mb-6 justify-center">
            <Button
              variant={showroadmapSection === "hidden" ? "default" : "outline"}
              onClick={triggerShowRoadmapSection}
              className={`flex items-center gap-2 ${roadmap ? "" : "hidden"}`}
            >
              <Wand2 className="w-4 h-4" />
              {showroadmapSection === "hidden" ? "Show Roadmap" : "Hide Roadmap"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleClear}
              className="flex items-center gap-2"
              disabled={!roadmap}
            >
              Clear
            </Button>
          </div>
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-muted-foreground ">
              <LoaderCircle className="w-12 h-12 animate-spin mb-4 text-primary" />
              <p className="font-headline text-lg">Generating your roadmap...</p>
              <p>This may take a moment.</p>
            </div>
          )}

          {error && (
            <div className="relative max-w-2xl mx-auto w-full rounded-lg border border-red-600 bg-red-900 text-white p-4 flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0" />
              <div className="flex flex-col">
                <h5 className="mb-1 font-medium leading-none">Generation Failed</h5>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {roadmap && (
            <div>
              <div className="flex justify-center items-center mb-6 ">
                <h2 className="font-headline text-3xl font-bold">Your Generated Roadmap</h2>

              </div>
              <RoadmapView roadmap={roadmap} setRoadmap={setRoadmap} />
            </div>
          )}

          {!isLoading && !error && !roadmap && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg p-12 min-h-[400px]">

            </div>
          )}
        </section>
      </div>
    </main>
  );
}
