import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'

const page = async () => {
    const user = await getCurrentUser()
    if (!user) redirect('/sign-in')

return (
    <>
        <h3>Interview Generation</h3>

        <Agent userName={user.name} userId={user.id} type='generate'/>
    </>
)
}

export default page
