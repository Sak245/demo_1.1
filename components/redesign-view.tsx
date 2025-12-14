"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LivePreview } from "@/components/live-preview";
import { useState } from "react";
import { z } from "zod";
import { RedesignSchema } from "@/lib/schemas";

type RedesignResult = z.infer<typeof RedesignSchema>;

interface RedesignViewProps {
    data: RedesignResult | null;
    scrapeData?: unknown; // Kept but optional/unknown if not used directly
    onRefine: (customPrompt: string) => Promise<RedesignResult>;
    logoUrl?: string | null;
}

export function RedesignView({ data, onRefine, logoUrl }: RedesignViewProps) {
    const [refining, setRefining] = useState(false);

    if (!data?.visual_preview) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-t pt-8">Proposed Redesign</h2>

            {/* VISUAL PREVIEW & REFINEMENT */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        AI-Generated Live Preview
                    </h3>
                </div>

                <LivePreview data={data} logoUrl={logoUrl} />

                {/* Interactive Refinement */}
                <div className="flex gap-2 p-4 bg-muted/50 rounded-lg border items-center">
                    <span className="text-sm font-medium whitespace-nowrap">Customize:</span>
                    <input
                        type="text"
                        placeholder="e.g. 'Make it dark mode', 'Add a chatbot feature', 'Use blue tones'"
                        className="flex-1 text-sm bg-background border rounded px-3 py-2"
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value;
                                if (!val || refining) return;

                                setRefining(true);
                                try {
                                    await onRefine(val);
                                    (e.target as HTMLInputElement).value = "";
                                } finally {
                                    setRefining(false);
                                }
                            }
                        }}
                    />
                    <Button size="sm" variant="secondary" disabled={refining} onClick={() => {
                        const inputProp = document.querySelector('input[placeholder^="e.g."]') as HTMLInputElement;
                        if (inputProp) inputProp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                    }}>
                        {refining ? "Refining..." : "Update"}
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Design System</h3>
                    </div>
                    <div className="p-6 pt-0 space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">Color Palette</h4>
                            <div className="flex gap-2">
                                {Object.entries(data.color_palette || {}).map(([res, color]) => (
                                    <div key={res} title={`${res}: ${color}`} className="w-8 h-8 rounded-full border shadow-sm" style={{ backgroundColor: color as string }}></div>
                                ))}
                            </div>
                            <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                                {JSON.stringify(data.color_palette, null, 2)}
                            </pre>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Concept & Wireframe</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <p className="whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">
                            {data.wireframe_description}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
