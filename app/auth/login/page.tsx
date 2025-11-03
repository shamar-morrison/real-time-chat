import { LoginForm } from '@/components/login-form'
import { AnimatedPage } from '@/components/animated-page'

export default function Page() {
  return (
    <AnimatedPage>
      <div className="flex min-h-screen-with-header w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </AnimatedPage>
  )
}
