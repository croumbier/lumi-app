
'use client'

import { LumiProvider, useLumi } from '@/lib/lumi/store'
import { HomeView } from './home/home-view'
import { MobileHeader, MobileNav } from './mobile-nav'
import { PhotoEditor } from './photo/photo-editor'
import { ProjectsView } from './projects/projects-view'
import { Sidebar } from './sidebar'
import { VideoEditor } from './video/video-editor'
import { RewardsView } from './rewards/rewards-view'
import { PremiumView } from './premium/premium-view'
import { TutorialView } from './tutorial/tutorial-view'

function CurrentView() {
  const { view } = useLumi()

  switch (view) {
    case 'projects':
      return <ProjectsView mode="all" />
    case 'favorites':
      return <ProjectsView mode="favorites" />
    case 'photo':
      return <PhotoEditor />
    case 'video':
      return <VideoEditor />
    case 'rewards':
      return <RewardsView />
    case 'premium':
      return <PremiumView />
    case 'tutorial':
      return <TutorialView />
    default:
      return <HomeView />
  }
}

export function AppShell() {
  return (
    <LumiProvider>
      <div className="flex min-h-dvh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileHeader />
          <main className="flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10 lg:px-10">
            <CurrentView />
          </main>
        </div>
        <MobileNav />
      </div>
    </LumiProvider>
  )
}
