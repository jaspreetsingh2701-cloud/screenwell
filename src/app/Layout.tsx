import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center text-sm ${
    isActive ? 'font-semibold text-teal-800 underline' : 'text-gray-700 hover:text-teal-800'
  }`

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:shadow"
      >
        Skip to main content
      </a>
      <header className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-gray-200 bg-white px-8 py-2">
        <strong className="text-teal-800">
          Screenwell <span className="text-sm font-normal text-gray-600">by Tilda Research</span>
        </strong>
        <nav aria-label="Main" className="flex flex-wrap gap-x-5">
          <NavLink to="/" end className={linkClass}>
            Queue
          </NavLink>
          <NavLink to="/trial" className={linkClass}>
            Trial
          </NavLink>
          <NavLink to="/drug" className={linkClass}>
            Drug and results
          </NavLink>
        </nav>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl p-6 focus:outline-none">
        <Outlet />
      </main>
    </div>
  )
}
