import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbacksByUserId } from "@/lib/actions/general.action";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const FeedbackHistoryPage = async () => {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const feedbacks = await getFeedbacksByUserId(user.id);

    return (
        <section className="flex flex-col gap-8 p-6 md:p-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Your Feedback History</h1>
                <p className="text-gray-400">Review all your past interview performances and improve your skills.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbacks && feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                        <div key={feedback.id} className="card-border flex flex-col p-6 gap-4 min-h-[220px]">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-semibold capitalize">
                                    {feedback.role} Interview
                                </h3>
                                <div className="bg-dark-200 px-3 py-1 rounded-full text-sm font-medium text-primary-200">
                                    {feedback.totalScore}/100
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Image src="/calendar.svg" alt="calendar" width={18} height={18} />
                                <span>{dayjs(feedback.createdAt).format("MMM D, YYYY")}</span>
                            </div>

                            <p className="text-sm line-clamp-3 text-gray-300 flex-1">
                                {feedback.finalAssessment}
                            </p>

                            <Link
                                href={`/interview/${feedback.interviewId}/feedback`}
                                className="btn-primary w-full py-2 text-center rounded-lg font-semibold text-black transition-all hover:opacity-90 mt-2"
                            >
                                View Details
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 opacity-60">
                        <Image src="/robot.png" alt="No feedback" width={150} height={150} />
                        <p className="text-lg">You don't have any feedback yet. Take an interview to get started!</p>
                        <Link href="/" className="text-primary-200 underline">Back to Dashboard</Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeedbackHistoryPage;
