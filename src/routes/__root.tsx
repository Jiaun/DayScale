import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'

import GlobalLayout from '@/components/layout/global-layout'
import { Button } from '@/components/ui/button'
import TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'
import { getLocale } from '@/paraglide/runtime'

import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },

  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Amortize',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        <TanStackQueryProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootErrorComponent(props: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="w-full rounded-xl border border-destructive/20 bg-card p-8 text-card-foreground shadow-sm">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Application error
          </h1>
          <p className="text-sm text-muted-foreground">
            {props.error.message || 'Unknown error'}
          </p>
          <div className="flex gap-3">
            <Button onClick={props.reset}>Retry</Button>
            <Button asChild variant="outline">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

function RootNotFoundComponent() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section className="w-full rounded-xl border bg-card p-8 text-card-foreground shadow-sm">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground">
            The page you requested does not exist.
          </p>
          <Button asChild>
            <Link to="/">Go to home</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
