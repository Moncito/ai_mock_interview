'use client';

import { interviewer } from '@/constants';
import { createFeedback, getInterviewByUserId } from '@/lib/actions/general.action';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant',
    content: string;
}

const Agent = ({ userName, userId, role, type, interviewId, questions, interviewSetup }: AgentProps & { interviewSetup?: any }) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [generatingFeedback, setGeneratingFeedback] = useState(false);
    const messagesRef = useRef<SavedMessage[]>([]);

    useEffect(() => {
        const onCallStart = () => {
            console.log('[Agent] 📞 vapi event: call-start');
            setCallStatus(CallStatus.ACTIVE);
        };
        const onCallEnd = () => {
            console.log('[Agent] 🏁 vapi event: call-end');
            setCallStatus(CallStatus.FINISHED);
        };


        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                console.log(`[Agent] 📝 New transcript from ${message.role}: ${message.transcript.substring(0, 30)}...`);
                const newMessage: SavedMessage = { role: message.role as any, content: message.transcript }

                setMessages((prev) => {
                    const updated = [...prev, newMessage];
                    console.log(`[Agent] 📊 Messages count: ${updated.length}`);
                    return updated;
                })
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.error('[Agent] ❌ vapi error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        }
    }, [])

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        setGeneratingFeedback(true);
        console.log('[Agent] 🚀 Starting feedback generation. Message count:', messages.length);
        if (messages.length === 0) {
            console.warn('[Agent] ⚠️ No messages captured yet! Check if transcripts are firing.');
        }

        try {
            const result = await createFeedback({
                interviewId: interviewId!,
                userId: userId!,
                role: role || interviewSetup?.role || 'Interview',
                transcript: messages
            });

            console.log('[Agent] 📬 createFeedback response:', result);

            if (result.success && result.feedbackId) {
                console.log('[Agent] ✅ Success! Redirecting to feedback page.');
                router.push(`/interview/${interviewId}/feedback`);
            } else {
                console.error('[Agent] ❌ Error saving Feedback:', result.error || 'Unknown error');
                setGeneratingFeedback(false);
                router.push('/');
            }
        } catch (error) {
            console.error('[Agent] 🧨 Exception during feedback generation:', error);
            setGeneratingFeedback(false);
            router.push('/');
        }
    }

    useEffect(() => {
        const handleCallFinished = async () => {
            if (callStatus === CallStatus.FINISHED) {
                if (type === 'generate') {
                    try {
                        let attempts = 0;
                        while (attempts < 3) {
                            // Fetch the latest interview created (presumably the one just generated)
                            const interviews = await getInterviewByUserId(userId!);
                            console.log(`Attempt ${attempts + 1}: Found ${interviews?.length} interviews`);

                            if (interviews && interviews.length > 0) {
                                // Since the query orders by createdAt desc, the first one is the latest
                                const latestInterview = interviews[0];
                                console.log("Redirecting to:", latestInterview.id);
                                router.push(`/interview/${latestInterview.id}`);
                                return; // Stop processing once found
                            }

                            attempts++;
                            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                        }

                        console.warn("No interviews found after generation retries.");
                        router.push('/');
                    } catch (error) {
                        console.error("Failed to fetch interview after generation:", error);
                        router.push('/');
                    }
                } else {
                    // For 'interview' type, generate feedback
                    handleGenerateFeedback(messagesRef.current);
                }
            }
        };

        handleCallFinished();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callStatus, type, userId, interviewId]);
    // Removed 'messages' from dependency to avoid loop if messages update after finish (unlikely but safer)

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)


        if (type === 'generate') {
            console.log('[Agent] starting VAPI generate workflow', process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, { username: userName, userid: userId, ...interviewSetup });
            const startResult = await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    username: userName,
                    userid: userId,
                    role: interviewSetup?.role || '',
                    level: interviewSetup?.level || '',
                    type: interviewSetup?.type || '',
                    techstack: interviewSetup?.techstack || '',
                    amount: interviewSetup?.amount || 5,
                }
            });
            console.log('[Agent] vapi.start returned', startResult);
        } else {
            let formattedQuestions = '';

            if (questions) {
                formattedQuestions = questions
                    .map((questions) => `-${questions}`)
                    .join('\n');
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions
                }
            });
        }

    }
    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);

        vapi.stop();
    }

    const latestMessages = messages[messages.length - 1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    return (
        <>
            {generatingFeedback && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-200 mb-4"></div>
                    <h2 className="text-2xl font-semibold text-white">Analyzing your interview...</h2>
                    <p className="text-gray-400 mt-2">Gemini is generating your personalized feedback.</p>
                </div>
            )}
            <div className="call-view">
                {/* AI Interviewer Card */}
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="profile-image"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                {/* User Profile Card */}
                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src="/user-avatar.png"
                            alt="profile-image"
                            width={539}
                            height={539}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p key={latestMessages} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {latestMessages}
                        </p>
                    </div>
                </div>
            )}

            <div className='w-full flex justify-center'>
                {callStatus !== 'ACTIVE' ? (
                    <button className='relative btn-call' onClick={handleCall}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')} />


                        <span>
                            {isCallInactiveOrFinished ? 'Call' : '...'}
                        </span>
                    </button>
                ) : (
                    <button className='btn-disconnect' onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent
