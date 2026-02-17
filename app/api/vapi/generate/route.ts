import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
    return Response.json({ success: true, data: 'Thank you!' }, { status: 200 });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { type, role, level, techstack, amount, userid } = body;

    // Diagnostic logging to help debug generation calls
    console.log('[api/vapi/generate] POST received with body:', JSON.stringify(body));

    // Validate required fields
    if (!type || !role || !level || !techstack || !amount || !userid) {
        console.error('[api/vapi/generate] Missing required fields:', { type, role, level, techstack, amount, userid });
        return Response.json(
            { success: false, error: 'Missing required fields: type, role, level, techstack, amount, userid' },
            { status: 400 }
        );
    }

    try {
        console.log('[api/vapi/generate] Generating questions for role:', role, 'level:', level, 'type:', type);
        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstack}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]
            
            Thank you! <3
        `
        });

        console.log('[api/vapi/generate] Generated questions:', questions);

        const interview = {
            role, type, level,
            techstack: techstack.split(',').map((t: string) => t.trim()),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }

        const docRef = await db.collection('interview').add(interview);
        console.log('[api/vapi/generate] Interview created with id:', docRef.id, 'for user:', userid);

        return Response.json({ success: true, interviewId: docRef.id }, { status: 200 })

    } catch (error) {
        console.error('[api/vapi/generate] Error:', error);
        return Response.json({ success: false, error: String(error) }, { status: 500 });
    }
}