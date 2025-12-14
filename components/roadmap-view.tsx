"use client";

import { Card } from "@/components/ui/card";
import { z } from "zod";
import { RoadmapSchema } from "@/lib/schemas";

type RoadmapResult = z.infer<typeof RoadmapSchema>;

interface RoadmapViewProps {
    roadmap: RoadmapResult | null;
}

export function RoadmapView({ roadmap }: RoadmapViewProps) {
    if (!roadmap) return null;

    return (
        <Card>
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight">Technical Roadmap</h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
                <div>
                    <h4 className="font-medium mb-2">Migration Steps</h4>
                    <ol className="list-decimal pl-4 space-y-1">
                        {roadmap.migration_steps?.map((step: string, i: number) => (
                            <li key={i} className="text-sm">{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <h4 className="font-medium mb-2">New Tech Stack</h4>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(roadmap.tech_stack_recommendation, null, 2)}
                    </pre>
                </div>
            </div>
        </Card>
    );
}
