import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { AnalyzeSchema } from '@/lib/schemas';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { data } = body; // The scraper output

        // API KEY OVERRIDE
        const apiKey = req.headers.get("x-groq-api-key");
        const client = new Groq({
            apiKey: apiKey || process.env.GROQ_API_KEY,
        });

        if (!data) {
            return NextResponse.json({ error: 'Data is required' }, { status: 400 });
        }

        const prompt = [
            "You are an expert Website Auditor and Product Designer.",
            "Analyze the following website data and provide a comprehensive audit.",
            "",
            "Website Data:",
            `Title: ${data.title}`,
            `Description: ${data.description}`,
            `Headings: ${JSON.stringify(data.headings)}`,
            `Image Count: ${data.imageCount}`,
            `Content Snippets: ${JSON.stringify(data.content)}`,
            "",
            "Return a strict JSON response with the following structure:",
            "{",
            "  \"ui_ux_audit\": {",
            "    \"score\": number (0-100),",
            "    \"issues\": [\"string\", \"string\"],",
            "    \"positive_findings\": [\"string\"]",
            "  },",
            "  \"seo_audit\": {",
            "    \"score\": number (0-100),",
            "    \"issues\": [\"string\"],",
            "    \"missing_elements\": [\"string\"]",
            "  },",
            "  \"performance_audit\": {",
            "    \"score_estimation\": number (0-100),",
            "    \"notes\": \"string\"",
            "  },",
            "  \"recommendation_engine\": {",
            "    \"priority_actions\": [",
            "        { \"action\": \"string\", \"impact\": \"High\" | \"Medium\" | \"Low\", \"description\": \"string\" }",
            "    ]",
            "  }",
            "}",
            "",
            "Do not include any markdown formatting or explanation outside the JSON."
        ].join("\n");

        const chatCompletion = await client.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 2048,
            response_format: { type: 'json_object' }
        });

        const result = chatCompletion.choices[0]?.message?.content;

        if (!result) {
            throw new Error("No content from AI");
        }

        const json = JSON.parse(result);
        // Validate with Zod
        const validatedData = AnalyzeSchema.parse(json);

        return NextResponse.json(validatedData);

    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
