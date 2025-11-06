import { updateDisplayName } from '@/actions/user'
import { AnimatedPage } from '@/components/animated-page'
import { getUserProfile } from '@/lib/supabase/get-user-profile'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const profile = await getUserProfile()

  if (!profile) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 py-8">
          <p className="text-destructive">Failed to load profile</p>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl">Profile Settings</h2>
        <ProfileForm
          initialDisplayName={profile.name}
          updateAction={updateDisplayName}
        />
      </div>
    </AnimatedPage>
  )
}
