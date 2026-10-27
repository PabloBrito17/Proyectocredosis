import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, BriefcaseBusiness, Sparkles, CheckCircle2 } from 'lucide-react';
import { DemoModal } from './DemoModal';

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navItems = [
    { label: 'Explorar empleos', to: '/empleos' },
    { label: 'Cómo funciona', to: '/#como-funciona' },
    { label: 'Para empresas', to: '/#para-empresas' }
  ];

  const handleNavClick = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-[var(--cream)] text-slate-900">
      <header className={isHome
        ? 'absolute inset-x-0 top-0 z-40 border-b border-white/15 bg-slate-950/35 text-white backdrop-blur-sm'
        : 'sticky top-0 z-40 border-b border-slate-200/80 bg-[rgba(247,243,238,0.92)] text-slate-900 backdrop-blur-xl'}>
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3" aria-label="Inicio de FirstStep SV">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-[0_10px_24px_rgba(18,26,45,0.18)] ${isHome ? 'bg-white text-[#121a2d]' : 'bg-[#121a2d] text-white'}`}>
              <BriefcaseBusiness size={18} />
            </div>
            <div>
              <div className={`text-lg font-extrabold tracking-[-0.04em] ${isHome ? 'text-white' : 'text-slate-900'}`}>FirstStep SV</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-[0.02em] transition-colors ${
                    isHome
                      ? 'text-white/90 hover:text-[#d8f96b]'
                      : isActive
                        ? 'text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/perfil" className={`text-sm font-semibold transition ${isHome ? 'text-white/85 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
              Mi perfil
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isHome ? 'border-white/45 bg-white/10 text-white hover:bg-white/20' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'}`}
            >
              Iniciar sesión
            </button>
            <Link
              to="/empleos"
              className={`rounded-full px-4 py-2 text-sm font-bold shadow-[0_12px_25px_rgba(18,26,45,0.18)] transition ${isHome ? 'bg-[#d8f96b] text-[#121a2d] hover:bg-[#e3ff8a]' : 'bg-[#121a2d] text-white hover:bg-[#1d2941]'}`}
            >
              Encontrar mi primera oportunidad
            </Link>
          </div>

          <button
            type="button"
            className={`inline-flex rounded-xl border p-2 md:hidden ${isHome ? 'border-white/40 text-white' : 'border-slate-300 text-slate-700'}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className={`border-t md:hidden ${isHome ? 'border-white/15 bg-[#111a2b]' : 'border-slate-200 bg-white'}`}>
            <div className="container flex flex-col gap-3 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${isHome ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/perfil" onClick={handleNavClick} className={`rounded-xl px-3 py-2 text-sm font-semibold ${isHome ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}>
                Mi perfil
              </Link>
              <button
                type="button"
                onClick={() => {
                  setLoginOpen(true);
                  setMenuOpen(false);
                }}
                className={`mt-2 rounded-xl border px-3 py-2 text-sm font-semibold ${isHome ? 'border-white/40 text-white' : 'border-slate-300 text-slate-700'}`}
              >
                Iniciar sesión
              </button>
              <Link
                to="/empleos"
                onClick={handleNavClick}
                className={`rounded-xl px-3 py-2 text-center text-sm font-bold ${isHome ? 'bg-[#d8f96b] text-[#121a2d]' : 'bg-[#121a2d] text-white'}`}
              >
                Encontrar mi primera oportunidad
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-[#121a2d] text-slate-200">
        <div className="container grid gap-8 py-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Sparkles size={18} />
              </div>
              <span className="text-lg font-extrabold text-white">FirstStep SV</span>
            </div>
            <p className="max-w-sm text-sm text-slate-300">
              Plataforma demo para ayudar a jóvenes en El Salvador a descubrir oportunidades de primer empleo, pasantías y experiencia práctica.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-300">Navegación</h3>
            <ul className="space-y-2 text-sm text-slate-200">
              <li><Link to="/empleos">Explorar empleos</Link></li>
              <li><Link to="/perfil">Mi perfil</Link></li>
              <li><a href="/#como-funciona">Cómo funciona</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-300">Demo</h3>
            <p className="text-sm text-slate-300">
              Prototipo de producto. Las vacantes y formularios son ejemplos locales para demostración.
            </p>
          </div>
        </div>
      </footer>

      <DemoModal open={loginOpen} title="Demo de acceso" onClose={() => setLoginOpen(false)}>
        <div className="space-y-4">
          <p className="text-slate-600">
            Esta acción es solo una demostración. No hay autenticación real ni backend conectados.
          </p>
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />
            Sesión demo activada para mostrar el flujo del producto.
          </div>
          <button
            type="button"
            onClick={() => setLoginOpen(false)}
            className="rounded-full bg-[#121a2d] px-5 py-3 text-sm font-bold text-white"
          >
            Continuar en demo
          </button>
        </div>
      </DemoModal>
    </div>
  );
}
