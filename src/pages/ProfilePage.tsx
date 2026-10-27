import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Link2, Save, UserRound, Briefcase, Sparkles, X } from 'lucide-react';
import { loadProfile, saveProfile } from '../lib/storage';
import type { CandidateProfile, WorkMode } from '../types';

const defaultProfile: CandidateProfile = {
  fullName: '',
  education: '',
  field: '',
  skills: [],
  portfolioUrl: '',
  experience: '',
  intro: '',
  preferredMode: 'Híbrido'
};

export function ProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile>(defaultProfile);
  const [skillsInput, setSkillsInput] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = loadProfile();
    setProfile(saved);
    setSkillsInput(saved.skills.join(', '));
  }, []);

  const completeness = useMemo(() => {
    const fields = [
      profile.fullName,
      profile.education,
      profile.field,
      profile.skills.length,
      profile.portfolioUrl,
      profile.experience,
      profile.intro,
      profile.preferredMode
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / 8) * 100);
  }, [profile]);

  const updateField = (field: keyof CandidateProfile, value: string | WorkMode | string[]) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSkills = (value: string) => {
    setSkillsInput(value);
    setProfile((current) => ({ ...current, skills: value.split(',').map((item) => item.trim()).filter(Boolean) }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!profile.fullName.trim()) nextErrors.fullName = 'Ingresa tu nombre completo.';
    if (!profile.education.trim()) nextErrors.education = 'Elige tu nivel de educación.';
    if (!profile.field.trim()) nextErrors.field = 'Escribe tu área de estudio o interés.';
    if (!profile.skills.length) nextErrors.skills = 'Añade al menos una habilidad.';
    if (profile.portfolioUrl && !/^https?:\/\//i.test(profile.portfolioUrl)) {
      nextErrors.portfolioUrl = 'Ingresa una URL válida.';
    }
    if (!profile.intro.trim()) nextErrors.intro = 'Escribe una breve introducción.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    saveProfile(profile);
    setStatus('Perfil guardado localmente en esta demo.');
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
    setSkillsInput('');
    setErrors({});
    setStatus('Perfil reiniciado.');
  };

  return (
    <div className="section-shell">
      <div className="container max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-label">Mi perfil</span>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-5xl">Destaca tu potencial</h1>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
            Completitud: {completeness}%
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel p-5 md:p-7">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">Nombre completo</span>
                <input
                  value={profile.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <span className="mt-1 block text-sm text-red-600">{errors.fullName}</span>}
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold text-slate-700">Nivel educativo</span>
                <select value={profile.education} onChange={(e) => updateField('education', e.target.value)} aria-invalid={!!errors.education}>
                  <option value="">Selecciona</option>
                  <option value="Bachiller">Bachiller</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Universitario">Universitario</option>
                  <option value="Estudiante">Estudiante</option>
                </select>
                {errors.education && <span className="mt-1 block text-sm text-red-600">{errors.education}</span>}
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold text-slate-700">Área de estudio</span>
                <input
                  value={profile.field}
                  onChange={(e) => updateField('field', e.target.value)}
                  aria-invalid={!!errors.field}
                />
                {errors.field && <span className="mt-1 block text-sm text-red-600">{errors.field}</span>}
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">Habilidades</span>
                <input
                  value={skillsInput}
                  onChange={(e) => handleSkills(e.target.value)}
                  placeholder="Ej. Excel, Canva, HTML, atención al cliente"
                  aria-invalid={!!errors.skills}
                />
                {errors.skills && <span className="mt-1 block text-sm text-red-600">{errors.skills}</span>}
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">Portafolio o enlace relevante</span>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                  <Link2 size={16} className="text-slate-500" />
                  <input
                    value={profile.portfolioUrl}
                    onChange={(e) => updateField('portfolioUrl', e.target.value)}
                    placeholder="https://portfolio.com"
                  />
                </div>
                {errors.portfolioUrl && <span className="mt-1 block text-sm text-red-600">{errors.portfolioUrl}</span>}
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">Experiencia, voluntariado o proyectos</span>
                <textarea
                  value={profile.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                  rows={4}
                  placeholder="Ej. Voluntariado en una feria escolar, proyectos de diseño, apoyo en redes sociales o servicio comunitario."
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">Introducción breve</span>
                <textarea
                  value={profile.intro}
                  onChange={(e) => updateField('intro', e.target.value)}
                  rows={4}
                  placeholder="Cuéntale a la empresa de qué estás aprendiendo y qué te gustaría aportar."
                  aria-invalid={!!errors.intro}
                />
                {errors.intro && <span className="mt-1 block text-sm text-red-600">{errors.intro}</span>}
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold text-slate-700">Modalidad preferida</span>
                <select value={profile.preferredMode} onChange={(e) => updateField('preferredMode', e.target.value as WorkMode)}>
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#121a2d] px-5 py-3 text-sm font-bold text-white"
              >
                <Save size={16} /> Guardar perfil
              </button>
              <button
                type="button"
                onClick={resetProfile}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700"
              >
                Limpiar
              </button>
            </div>

            {status && (
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={16} /> {status}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="panel p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d8f96b] text-slate-900">
                  <UserRound size={20} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900">Vista previa</div>
                  <div className="text-xs uppercase tracking-[0.08em] text-slate-500">Perfil público</div>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-2xl font-extrabold text-slate-900">{profile.fullName || 'Tu nombre aquí'}</h3>
                <p className="mt-1 text-sm text-slate-600">{profile.education || 'Nivel educativo'} · {profile.field || 'Especialidad'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.skills.length ? profile.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{skill}</span>
                  )) : <span className="text-sm text-slate-500">Sin habilidades añadidas</span>}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p>{profile.intro || 'Escribe una introducción breve para mostrar tu motivación y disposición.'}</p>
              </div>
            </div>

            <div className="panel p-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                <Sparkles size={15} /> Aviso de demo
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Este perfil se guarda solo en el navegador de esta demostración. No está conectado a una base de datos ni a un backend real.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
