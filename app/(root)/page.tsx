import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser, getInterviewByUserId, getLatestInterviews } from '@/lib/actions/auth.action'
const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews ] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({userId: user?.id!})
  ]);

  const hasPastInterview = userInterviews?.length>0;
  const hasUpcomingInterview = latestInterviews?.length>0;

  return (
    <>
      {/* Section for the Robo dude*/}

      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with A.I Powered Practice & Feedback</h2>
          <p className='text-lg'>Practice on real interview questions & get instant Feedback</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href='/interview'>Start an Interview</Link>
          </Button>
        </div>
        <Image src='/robot.png' alt='robo-dude' width={400} height={400} className='max-sm:hidden'/>
      </section>
      
      {/* Section for Interviews */}
      
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interview</h2>
        <div className='interview-section flex flex-wrap gap-4'>
          {hasPastInterview ? (
            userInterviews?.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
            ))):(
            <p>You Haven&apos;t taken Interview Yet</p> 
                )} 
        </div>
      </section>

      {/* Section for take Interviews */}
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className='interview-section flex flex-wrap gap-4'>
        {hasUpcomingInterview ? (
            latestInterviews?.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
            ))):(
            <p>There are no Interviews Available</p> 
                )} 
        </div>
      </section>

    </>
  )
}

export default page
