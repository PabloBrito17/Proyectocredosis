import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, Building2, MapPin, BadgeCheck, Bookmark, BookmarkCheck, CheckCircle2 } from 'lucide-react';
import { DemoModal } from '../components/DemoModal';
import { jobs } from '../data/jobs';
import { loadDemoApplications, loadSavedJobs, saveDemoApplications, saveSavedJobs } from '../lib/storage';
import type { ApplicationFormState } from '../types';

const emptyForm: ApplicationFormState = {
  name: '',
  email: '',
  message: '',
  portfolioUrl: ''
};

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ApplicationFormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = loadSavedJobs();
    setSaved(stored.includes(id ?? ''));
  }, [id]);

  const job = useMemo(() => jobs.find((item) => item.id === id), [id]);

  if (!job) {
    return (
      <div className="section-shell">
        <div className="container">
          <div className="panel p-10 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">Vacante no encontrada</h1>
            <p className="mt-3 text-slate-600">La oportunidad solicitada no existe en esta demo.</p>
            <button
              type="button"
              onClick={() => navigate('/empleos')}
              className="mt-6 rounded-full bg-[#121a2d] px-5 py-3 text-sm font-bold text-white"
            >
              Volver a empleos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const toggleSave = () => {
    const stored = loadSavedJobs();
    const next = saved ? stored.filter((jobId) => jobId !== job.id) : [...stored, job.id];
    setSaved(!saved);
    saveSavedJobs(next);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Ingresa tu nombre.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Ingresa un correo válido.';
    if (!form.message.trim()) nextErrors.message = 'Escribe un mensaje breve.';
    if (form.portfolioUrl && !/^https?:\/\//i.test(form.portfolioUrl)) nextErrors.portfolioUrl = 'La URL debe iniciar con http:// o https://.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const submissions = loadDemoApplications();
    submissions.push({
      jobId: job.id,
      company: job.company,
      name: form.name,
      email: form.email,
      message: form.message,
      portfolioUrl: form.portfolioUrl,
      submittedAt: new Date().toISOString()
    });
    saveDemoApplications(submissions);
    setSuccess('Demo completada: tu postulación no se ha enviado a una empresa real.');
    setForm(emptyForm);
    setErrors({});
  };

  return (
    <div className="section-shell">
      <div className="container max-w-5xl">
        <button
          type="button"
          onClick={() => navigate('/empleos')}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700"
        >
          <ArrowLeft size={16} /> Volver a oportunidades
        </button>

        <article className="panel overflow-hidden">
          <div className="border-b border-slate-200 bg-[#121a2d] px-6 py-6 text-white md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-200">
                  {job.category}
                </span>
                <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">{job.title}</h1>
              </div>
              <button
                type="button"
                onClick={toggleSave}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white"
              >
                {saved ? <BookmarkCheck size={16} className="text-[#d8f96b]" /> : <Bookmark size={16} />}
                {saved ? 'Guardada' : 'Guardar'}
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5"><Building2 size={14} /> {job.company}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5"><MapPin size={14} /> {job.location}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5"><BriefcaseBusiness size={14} /> {job.type}</span>
            </div>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-[1.4fr_0.8fr] md:p-8">
            <div>
              <section className="mb-8">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                  <BadgeCheck size={15} /> Vacante de ejemplo para demostración
                </div>
                <p className="text-base leading-8 text-slate-600">{job.description}</p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-extrabold text-slate-900">Responsabilidades</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3 text-slate-600">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#d8f96b]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-extrabold text-slate-900">Habilidades requeridas</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">{skill}</span>
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-xl font-extrabold text-slate-900">También será valorado</h2>
                <div className="flex flex-wrap gap-2">
                  {job.niceToHave.map((skill) => (
                    <span key={skill} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">{skill}</span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-xl font-extrabold text-slate-900">Si aún no tienes experiencia formal</h2>
                <ul className="space-y-3">
                  {job.whatToShow.map((item) => (
                    <li key={item} className="flex gap-3 text-slate-600">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#4ecdc4]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-lg font-extrabold text-slate-900">Resumen</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between gap-3"><span>Modalidad</span><span className="font-semibold">{job.mode}</span></div>
                  <div className="flex justify-between gap-3"><span>Tipo</span><span className="font-semibold">{job.type}</span></div>
                  <div className="flex justify-between gap-3"><span>Experiencia</span><span className="font-semibold">{job.experience}</span></div>
                  <div className="flex justify-between gap-3"><span>Ubicación</span><span className="font-semibold text-right">{job.location}</span></div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-lg font-extrabold text-slate-900">Guía de aplicación</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  En esta demo, puedes preparar tu postulación con ejemplos claros de proyectos, cursos y experiencia voluntaria para destacar tu perfil real.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-4 w-full rounded-full bg-[#121a2d] px-4 py-3 text-sm font-bold text-white"
                >
                  Preparar mi postulación
                </button>
              </div>
            </aside>
          </div>
        </article>
      </div>

      <DemoModal open={modalOpen} title="Postular a la oportunidad" onClose={() => {
        setModalOpen(false);
        setSuccess('');
      }}>
        {success ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={18} /> {success}
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full bg-[#121a2d] px-5 py-3 text-sm font-bold text-white"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Oportunidad seleccionada</div>
              <div className="mt-2 text-lg font-extrabold text-slate-900">{job.title}</div>
              <div className="text-sm text-slate-600">{job.company}</div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <span className="mt-1 block text-sm text-red-600">{errors.name}</span>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Correo electrónico</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <span className="mt-1 block text-sm text-red-600">{errors.email}</span>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Mensaje corto</label>
              <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {errors.message && <span className="mt-1 block text-sm text-red-600">{errors.message}</span>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Portafolio (opcional)</label>
              <input value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} placeholder="https://portfolio.com" />
              {errors.portfolioUrl && <span className="mt-1 block text-sm text-red-600">{errors.portfolioUrl}</span>}
            </div>

            <button type="submit" className="w-full rounded-full bg-[#121a2d] px-5 py-3 text-sm font-bold text-white">
              Enviar demo de postulación
            </button>
          </form>
        )}
      </DemoModal>
    </div>
  );
}
