import { Link } from 'react-router-dom';
import { ArrowRight, Search, BriefcaseBusiness, FileText, Sparkles, BadgeCheck, CheckCircle2 } from 'lucide-react';
import { jobs } from '../data/jobs';
import { JobCard } from '../components/JobCard';
import { useEffect, useMemo, useState } from 'react';
import { loadEmployerInterest, loadSavedJobs, saveEmployerInterest, saveSavedJobs } from '../lib/storage';
import type { EmployerFormState, OpportunityType } from '../types';

const featureCards = [
  {
    title: 'Encuentra oportunidades para empezar',
    description: 'Descubre vacantes de pasantía, junior y primer empleo sin necesidad de años de experiencia.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Presenta proyectos y habilidades',
    description: 'Muestra trabajos, voluntariado y coursework para destacar tu potencial.',
    icon: FileText,
  },
  {
    title: 'Explora requisitos con claridad',
    description: 'Revisa responsabilidades, competencias y recomendaciones para una postulación más segura.',
    icon: Search,
  }
];

const steps = [
  'Explora oportunidades',
  'Destaca tus habilidades',
  'Prepárate para postularte'
];

export function LandingPage() {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [interest, setInterest] = useState<EmployerFormState>({
    organization: '',
    contactName: '',
    workEmail: '',
    opportunityType: 'Pasantía'
  });
  const [interestErrors, setInterestErrors] = useState<Record<string, string>>({});
  const [interestSuccess, setInterestSuccess] = useState('');

  useEffect(() => {
    setSavedJobs(loadSavedJobs());
  }, []);

  const featuredJobs = useMemo(() => jobs.slice(0, 3), []);

  const toggleSave = (jobId: string) => {
    const next = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(next);
    saveSavedJobs(next);
  };

  const handleInterestSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!interest.organization.trim()) nextErrors.organization = 'Ingresa el nombre de la organización.';
    if (!interest.contactName.trim()) nextErrors.contactName = 'Ingresa el nombre de contacto.';
    if (!interest.workEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(interest.workEmail)) nextErrors.workEmail = 'Ingresa un correo válido.';
    setInterestErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const submissions = loadEmployerInterest();
    submissions.push({ ...interest, submittedAt: new Date().toISOString() });
    saveEmployerInterest(submissions);
    setInterestSuccess('Demo confirmada: este formulario no está conectado a una base de datos real de empleadores.');
    setInterest({ organization: '', contactName: '', workEmail: '', opportunityType: 'Pasantía' });
  };

  return (
    <>
      <section className="hero-cover relative isolate flex min-h-[760px] items-center overflow-hidden md:min-h-[850px]">
        <video
          className="hero-cover__video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=85"
          aria-hidden="true"
        >
          <source src="https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-cover__shade" />
        <div className="hero-cover__grain" />

        <div className="container relative z-10 pb-16 pt-36 md:pb-24 md:pt-40">
          <div className="max-w-4xl animate-rise">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow__dot" />
              Una plataforma para dar el primer paso
            </span>
            <h1 className="mt-7 max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-[-0.065em] text-white md:text-7xl xl:text-8xl">
              Tu futuro no necesita esperar a tener experiencia.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">
              Explora pasantías y empleos junior que valoran lo que sabes hacer, lo que estás aprendiendo y lo que puedes aportar.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/empleos" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d8f96b] px-7 py-4 text-base font-extrabold text-[#121a2d] shadow-[0_18px_45px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e4ff91]">
                Explorar oportunidades <ArrowRight size={18} />
              </Link>
              <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/55 bg-[#101827]/65 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#101827]/85">
                Cómo funciona
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/85">
              <div className="inline-flex items-center gap-2">
                <BadgeCheck className="text-[#d8f96b]" size={17} />
                <span>Vacantes de ejemplo</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Search className="text-[#d8f96b]" size={17} />
                <span>Filtros por modalidad y experiencia</span>
              </div>
            </div>
          </div>

          <div className="hero-cover__caption">
            <span>FIRSTSTEP SV</span>
            <span>Oportunidades para empezar</span>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container">
          <div className="mb-10 text-center">
            <span className="section-label">Valor para jóvenes</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Encuentra una forma de empezar con claridad.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <div key={title} className="panel p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d8f96b] text-slate-900">
                  <Icon size={20} />
                </div>
                <h3 className="mb-3 text-xl font-extrabold text-slate-900">{title}</h3>
                <p className="text-base leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="section-shell bg-white/60">
        <div className="container">
          <div className="mb-10 text-center">
            <span className="section-label">Cómo funciona</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Tres pasos sencillos para dar el siguiente paso.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="panel p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#121a2d] text-sm font-extrabold text-white">
                  0{index + 1}
                </div>
                <h3 className="mb-3 text-xl font-extrabold text-slate-900">{step}</h3>
                <p className="text-base text-slate-600">
                  {index === 0 && 'Revisa vacantes y filtros para localizar oportunidades que encajen con tu perfil.'}
                  {index === 1 && 'Usa tu perfil para destacar educación, proyectos, habilidades y experiencia práctica.'}
                  {index === 2 && 'Prepara una postulación clara y segura antes de enviar tu demo de aplicación.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="section-label">Oportunidades destacadas</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Vacantes demo para explorar</h2>
            </div>
            <Link to="/empleos" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} onToggleSave={toggleSave} />
            ))}
          </div>
        </div>
      </section>

      <section id="para-empresas" className="section-shell bg-[#121a2d] text-white">
        <div className="container grid gap-8 md:grid-cols-[1fr_0.9fr] md:items-center">
          <div>
            <span className="section-label border-white/20 bg-white/5 text-white">Para empresas</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Publica roles para empezar con requisitos claros.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
              Esta idea ayuda a organizaciones a describir oportunidades de primer empleo con lenguaje más claro, requisitos realistas y una experiencia más cercana para candidatos jóvenes.
            </p>
            <Link to="/empleos" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d8f96b] px-5 py-3 text-sm font-extrabold text-slate-900">
              Explorar propuesta <ArrowRight size={16} />
            </Link>
          </div>

          <div className="panel border-white/10 bg-white/5 p-5 text-slate-200 shadow-none">
            <h3 className="text-xl font-extrabold text-white">Formulario demo</h3>
            <p className="mt-2 text-sm text-slate-300">Se trata de un modelo conceptual para mostrar interés en participar como empresa.</p>
            <form onSubmit={handleInterestSubmit} className="mt-5 space-y-3 text-sm">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-slate-300">Organización</label>
                <input value={interest.organization} onChange={(e) => setInterest({ ...interest, organization: e.target.value })} />
                {interestErrors.organization && <span className="mt-1 block text-xs text-red-300">{interestErrors.organization}</span>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-slate-300">Nombre de contacto</label>
                <input value={interest.contactName} onChange={(e) => setInterest({ ...interest, contactName: e.target.value })} />
                {interestErrors.contactName && <span className="mt-1 block text-xs text-red-300">{interestErrors.contactName}</span>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-slate-300">Correo laboral</label>
                <input value={interest.workEmail} onChange={(e) => setInterest({ ...interest, workEmail: e.target.value })} />
                {interestErrors.workEmail && <span className="mt-1 block text-xs text-red-300">{interestErrors.workEmail}</span>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-slate-300">Tipo de oportunidad</label>
                <select value={interest.opportunityType} onChange={(e) => setInterest({ ...interest, opportunityType: e.target.value as OpportunityType })}>
                  <option value="Pasantía">Pasantía</option>
                  <option value="Tiempo completo">Tiempo completo</option>
                  <option value="Medio tiempo">Medio tiempo</option>
                </select>
              </div>
              <button type="submit" className="w-full rounded-full bg-[#d8f96b] px-5 py-3 text-sm font-extrabold text-slate-900">
                Enviar interés demo
              </button>
              {interestSuccess && <div className="rounded-xl border border-emerald-300 bg-emerald-500/10 p-3 text-xs text-emerald-200">{interestSuccess}</div>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
