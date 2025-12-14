import { z } from "zod";

export const ScrapeDataSchema = z.object({
    url: z.string().url(),
    title: z.string(),
    description: z.string(),
    headings: z.array(z.object({ level: z.string(), text: z.string() })),
    imageCount: z.number(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })),
    content: z.array(z.string()),
    rawHtml: z.number().optional()
});

export const RedesignSchema = z.object({
    color_palette: z.object({
        primary: z.string().describe("Hex code"),
        secondary: z.string().describe("Hex code"),
        accent: z.string().describe("Hex code"),
        background: z.string().describe("Hex code"),
        text: z.string().describe("Hex code")
    }),
    typography_recommendation: z.object({
        headings: z.string(),
        body: z.string()
    }),
    layout_suggestions: z.object({
        hero_section: z.string(),
        navigation: z.string(),
        key_sections: z.array(z.string())
    }),
    wireframe_description: z.string(),
    visual_preview: z.object({
        hero: z.object({
            headline: z.string(),
            subheadline: z.string(),
            cta_text: z.string()
        }),
        features: z.array(z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string().describe("lucide-react icon name approx")
        })),
        testimonials: z.array(z.object({
            quote: z.string(),
            author: z.string()
        }))
    })
});

export const AnalyzeSchema = z.object({
    ui_ux_audit: z.object({
        score: z.number(),
        issues: z.array(z.string()),
        positive_findings: z.array(z.string())
    }),
    seo_audit: z.object({
        score: z.number(),
        issues: z.array(z.string()),
        missing_elements: z.array(z.string())
    }),
    performance_audit: z.object({
        score_estimation: z.number(),
        notes: z.string()
    }),
    mobile_responsiveness_audit: z.object({
        score: z.number(),
        issues: z.array(z.string())
    }),
    accessibility_audit: z.object({
        score: z.number(),
        issues: z.array(z.string())
    }),
    innovation_suggestions: z.array(z.object({
        name: z.string(),
        description: z.string(),
        category: z.enum(["Personalization", "Gamification", "AI/Chatbot", "Interactive", "Micro-interaction", "Other"])
    })),
    recommendation_engine: z.object({
        priority_actions: z.array(z.object({
            action: z.string(),
            impact: z.enum(["High", "Medium", "Low"]),
            difficulty: z.enum(["High", "Medium", "Low"]),
            why_it_matters: z.string().describe("Explanation of importance"),
            description: z.string()
        }))
    })
});

export const RoadmapSchema = z.object({
    tech_stack_recommendation: z.object({
        frontend: z.string(),
        backend: z.string(),
        tools: z.array(z.string())
    }),
    migration_steps: z.array(z.string()),
    component_list: z.array(z.string()),
    estimated_timeline: z.string()
});
