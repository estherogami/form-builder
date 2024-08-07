import Logo from '@/components/Logo/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher'
import React, {ReactNode} from 'react'

function Layout({children}: {children:ReactNode}) {
  return (
    <div className="flex  flex-col min-h-screen min-w-full bg-background max-h-screen h-screen">
      <nav className="flex justify-between border-b items-center border-border h-[60px] px-4 py-2">
        <Logo />
          <ThemeSwitcher />
      </nav>
      <main className="flex w-full flex-grow">
        {children}
      </main>
    </div>
  )
}

export default Layout
