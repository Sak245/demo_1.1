"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyzeSchema, ScrapeDataSchema } from "@/lib/schemas";
import { z } from "zod";

type AnalysisResult = z.infer<typeof AnalyzeSchema>;
type ScrapeData = z.infer<typeof ScrapeDataSchema>;

interface AuditResultsProps {
    analysis: AnalysisResult | null;
    data: ScrapeData | null;
}

export function AuditResults({ analysis, data }: AuditResultsProps) {
    return (
        <div className="space-y-8">
            {/* 1. Overview / Audit */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <div className="p-6">
                        <div className="text-sm font-medium">UI/UX Score</div>
                        <div className="text-2xl font-bold">
                            {analysis ? analysis.ui_ux_audit?.score : <Skeleton className="h-8 w-10" />}
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6">
                        <div className="text-sm font-medium">SEO Score</div>
                        <div className="text-2xl font-bold">
                            {analysis ? analysis.seo_audit?.score : <Skeleton className="h-8 w-10" />}
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6">
                        <div className="text-sm font-medium">Performance Est.</div>
                        <div className="text-2xl font-bold">
                            {analysis ? analysis.performance_audit?.score_estimation : <Skeleton className="h-8 w-10" />}
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6">
                        <div className="text-sm font-medium">Images Found</div>
                        <div className="text-2xl font-bold">
                            {data ? data.imageCount : <Skeleton className="h-8 w-10" />}
                        </div>
                    </div>
                </Card>
            </div>

            {/* 2. Key Issues */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="h-full">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Top Recommendations</h3>
                    </div>
                    <div className="p-6 pt-0">
                        {analysis ? (
                            <ul className="list-disc pl-4 space-y-2">
                                {analysis.recommendation_engine?.priority_actions?.map((act, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{act.action}</span> - <span className="text-muted-foreground">{act.impact} Impact</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <Skeleton className="h-32 w-full" />}
                    </div>
                </Card>
                <Card className="h-full">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">SEO Issues</h3>
                    </div>
                    <div className="p-6 pt-0">
                        {analysis ? (
                            <ul className="list-disc pl-4 space-y-2">
                                {analysis.seo_audit?.issues?.map((issue, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">{issue}</li>
                                ))}
                            </ul>
                        ) : <Skeleton className="h-32 w-full" />}
                    </div>
                </Card>
            </div>
        </div>
    );
}
