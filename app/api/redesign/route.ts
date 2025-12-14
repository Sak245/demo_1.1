
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { RedesignSchema } from '@/lib/schemas';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { data, customPrompt } = body;

        // API KEY OVERRIDE
        const apiKey = req.headers.get("x-groq-api-key");
        const client = new Groq({
            apiKey: apiKey || process.env.GROQ_API_KEY,
        });

        if (!data) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        const prompt = [
            "You are an expert UI / UX Designer.",
            "Based on the following website data, generate a complete redesign plan.",
            "",
            "Website Data:",
            JSON.stringify({
                title: data.title,
                description: data.description,
                headings: data.headings.slice(0, 10),
                imageCount: data.imageCount
            }),
            "",
            customPrompt ? `USER STRICT INSTRUCTION: ${customPrompt}` : "",
            "",
            "CRITICAL: Provide a \"visual_preview\" object with content for a Hero section, 3 key Features, and 2 Testimonials.",
            customPrompt ? "Ensure the visual_preview and color_palette strictly reflect the USER INSTRUCTION above." : "Focus on improving engagement and quality.",
            "",
            "Return the response as a valid JSON object matching this schema:",
            "{",
            "    \"color_palette\": { \"primary\": \"#...\", \"secondary\": \"#...\", \"accent\": \"#...\", \"background\": \"#...\", \"text\": \"#...\" },",
            "    \"typography_recommendation\": { \"headings\": \"...\", \"body\": \"...\" },",
            "    \"layout_suggestions\": { \"hero_section\": \"...\", \"navigation\": \"...\", \"key_sections\": [\"...\"] },",
            "    \"wireframe_description\": \"...\",",
            "        \"visual_preview\": {",
            "        \"hero\": { \"headline\": \"...\", \"subheadline\": \"...\", \"cta_text\": \"...\" },",
            "        \"features\": [{ \"title\": \"...\", \"description\": \"...\", \"icon\": \"...\" }],",
            "            \"testimonials\": [{ \"quote\": \"...\", \"author\": \"...\" }]",
            "    }",
            "}"
        ].join("\n");

        const chatCompletion = await client.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 2048,
            response_format: { type: 'json_object' }
        });

        const result = chatCompletion.choices[0]?.message?.content;
        if (!result) throw new Error("No content from AI");

        const json = JSON.parse(result);

        // Validate with Zod
        const validatedData = RedesignSchema.parse(json);

        return NextResponse.json(validatedData);

    } catch (error) {
        console.error('Redesign error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
