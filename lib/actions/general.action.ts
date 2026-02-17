"use server"

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";

export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
    if (!userId) {
        console.warn("userId is required for getInterviewByUserId");
        return null;
    }

    const interviews = await db
        .collection('interview')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[]
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    if (!userId) {
        console.warn("userId is required for getLatestInterviews");
        return null;
    }

    const interviews = await db
        .collection('interview')
        .orderBy('createdAt', 'desc')
        .where('finalized', '==', true)
        .where('userId', '!=', userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[]
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interviews = await db
        .collection('interview')
        .doc(id)
        .get();

    return interviews.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, role, transcript } = params;

    console.log(`[createFeedback] ⚡️ Action triggered for interviewId: ${interviewId}, userId: ${userId}`);

    if (!transcript || transcript.length === 0) {
        console.warn("[createFeedback] ⚠️ Empty transcript provided");
        return { success: false, error: "Empty transcript" };
    }

    try {
        // Check for existing feedback
        console.log("[createFeedback] 🔍 Checking for existing feedback...");
        const existingFeedback = await getFeedbackByInterviewId({ interviewId, userId });
        if (existingFeedback) {
            console.log(`[createFeedback] ♻️ Feedback already exists: ${existingFeedback.id}`);
            return {
                success: true,
                feedbackId: existingFeedback.id
            }
        }

        const formattedTranscript = transcript
            .map((sentence: { role: string; content: string; }) => `- ${sentence.role}: ${sentence.content}\n`)
            .join('');

        console.log(`[createFeedback] 📝 Formatted transcript length: ${formattedTranscript.length}`);

        console.log("[createFeedback] 🤖 Requesting AI evaluation...");
        const { object } = await generateObject({
            model: google('gemini-2.0-flash-001'),
            schema: feedbackSchema,
            prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
            Transcript:
            ${formattedTranscript}

            Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
            - **Communication Skills**: Clarity, articulation, structured responses.
            - **Technical Knowledge**: Understanding of key concepts for the role.
            - **Problem Solving**: Ability to analyze problems and propose solutions.
            - **Cultural Fit**: Alignment with company values and job role.
            - **Confidence and Clarity**: Confidence in responses, engagement, and clarity.
            `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        const { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment } = object;
        console.log("[createFeedback] ✅ AI evaluation complete. Score:", totalScore);

        console.log("[createFeedback] 💾 Saving feedback to Firestore...");
        const feedback = await db.collection('feedback').add({
            interviewId,
            userId,
            role,
            totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment,
            createdAt: new Date().toISOString()
        })

        console.log(`[createFeedback] ✨ Feedback document created: ${feedback.id}`);

        // Mark interview as finalized
        console.log("[createFeedback] 🏁 Marking interview as finalized...");
        await db.collection('interview').doc(interviewId).update({ finalized: true });
        console.log("[createFeedback] ✅ Interview marked as finalized.");

        return {
            success: true,
            feedbackId: feedback.id
        }
    } catch (e) {
        console.error('[createFeedback] ❌ Error Generating/Saving Feedback:', e)

        return {
            success: false,
            error: e instanceof Error ? e.message : "Internal Server Error"
        };
    }
}

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
    const { interviewId, userId } = params;

    const querySnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .limit(1)
        .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getFeedbacksByUserId(userId: string): Promise<Feedback[] | null> {
    if (!userId) return null;

    try {
        const querySnapshot = await db
            .collection("feedback")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Feedback[];
    } catch (error) {
        console.error("[getFeedbacksByUserId] ❌ Error:", error);
        return null;
    }
}

export async function createAndStoreInterview(params: {
    role: string;
    level: string;
    type: string;
    techstack: string;
    amount: number;
    userId: string;
}): Promise<{ success: boolean; interviewId?: string; error?: string }> {
    try {
        const { role, level, type, techstack, amount, userId } = params;

        console.log(`[createAndStoreInterview] Generating questions for role: ${role} level: ${level} type: ${type}`);

        // Generate questions using AI
        const { text: generatedQuestions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Generate ${amount} interview questions for a ${level} level ${type} interview for a ${role} position with skills in ${techstack}.

Format the response as a JSON array of strings, like this:
["Question 1?", "Question 2?", "Question 3?"]

Make sure each question is relevant to the role, level, and tech stack provided. Return ONLY the JSON array, no other text.`,
        });

        console.log(`[createAndStoreInterview] Generated questions response: ${generatedQuestions}`);

        // Parse the questions (remove markdown code blocks if present)
        let questions: string[] = [];
        try {
            const cleanedText = generatedQuestions
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            questions = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error(`[createAndStoreInterview] Failed to parse questions: ${generatedQuestions}`, parseError);
            return { success: false, error: 'Failed to parse generated questions' };
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            console.error('[createAndStoreInterview] Generated questions is not a valid array');
            return { success: false, error: 'Failed to generate valid questions' };
        }

        console.log(`[createAndStoreInterview] Successfully parsed ${questions.length} questions`);

        // Get random cover image
        const getRandomInterviewCover = () => {
            const covers = [
                '/covers/adobe.png',
                '/covers/amazon.png',
                '/covers/facebook.png',
                '/covers/hostinger.png',
                '/covers/pinterest.png',
                '/covers/quora.png',
                '/covers/reddit.png',
                '/covers/skype.png',
                '/covers/spotify.png',
                '/covers/telegram.png',
                '/covers/tiktok.png',
                '/covers/yahoo.png',
            ];
            return covers[Math.floor(Math.random() * covers.length)];
        };

        // Create interview document
        const interview = {
            role,
            level,
            type,
            techstack: techstack.split(',').map((t: string) => t.trim()),
            questions,
            userId,
            finalized: false, // Not finalized until user completes the interview
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        // Store in Firebase
        const docRef = await db.collection('interview').add(interview);

        console.log(`[createAndStoreInterview] Interview created with id: ${docRef.id} for user: ${userId}`);

        return {
            success: true,
            interviewId: docRef.id,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[createAndStoreInterview] Error: ${errorMessage}`, error);

        return {
            success: false,
            error: `Failed to create interview: ${errorMessage}`,
        };
    }
}