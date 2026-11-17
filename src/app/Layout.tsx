import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm ${isActive ? 'font-semibold text-teal-700 underline' : 'text-gray-700 hover:text-teal-700'}`

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white px-8 py-3">
        <strong className="text-teal-700">
          Screenwell <span className="text-sm font-normal text-gray-600">by Tilda Research</span>
        </strong>
        <nav aria-label="Main" className="flex gap-4">
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
      <main className="mx-auto max-w-6xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
