import { getCurrentUser } from '@/lib/actions/auth.action'
import { getLatestInterviews } from '@/lib/actions/general.action'
import { redirect } from 'next/navigation'

const page = async () => {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    const latestInterviews = await getLatestInterviews({ userId: user.id })

    if (!latestInterviews || latestInterviews.length === 0) {
        redirect('/')
    }

    // Redirect to the first available interview
    redirect(`/interview/${latestInterviews[0].id}`)
}

export default page
