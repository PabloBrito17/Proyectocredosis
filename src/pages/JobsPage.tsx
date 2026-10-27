import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, BookmarkCheck, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { JobCard } from '../components/JobCard';
import { jobs } from '../data/jobs';
import { loadSavedJobs, saveSavedJobs } from '../lib/storage';
import type { Job, OpportunityType, WorkMode } from '../types';

const categories = ['Todas', ...new Set(jobs.map((job) => job.category))];
const workModes: Array<'Todas' | WorkMode> = ['Todas', 'Remoto', 'Híbrido', 'Presencial'];
const opportunityTypes: Array<'Todas' | OpportunityType> = ['Todas', 'Pasantía', 'Tiempo completo', 'Medio tiempo'];
const experienceLevels = ['Todas', 'Sin experiencia', 'Junior', 'Intermedio'];

export function JobsPage() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [workMode, setWorkMode] = useState<'Todas' | WorkMode>('Todas');
  const [opportunityType, setOpportunityType] = useState<'Todas' | OpportunityType>('Todas');
  const [experience, setExperience] = useState('Todas');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest'>('relevance');

  useEffect(() => {
    setSavedJobs(loadSavedJobs());
  }, []);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result: Job[] = jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.requiredSkills.join(' ').toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query);

      const matchesCategory = category === 'Todas' || job.category === category;
      const matchesMode = workMode === 'Todas' || job.mode === workMode;
      const matchesType = opportunityType === 'Todas' || job.type === opportunityType;
      const matchesExperience = experience === 'Todas' || job.experience === experience;

      return matchesSearch && matchesCategory && matchesMode && matchesType && matchesExperience;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      const scoreA = [a.title, a.company, a.category, ...a.requiredSkills].join(' ').toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
      const scoreB = [b.title, b.company, b.category, ...b.requiredSkills].join(' ').toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
      return scoreB - scoreA;
    });

    return result;
  }, [search, category, workMode, opportunityType, experience, sortBy]);

  const activeFilters = [
    category !== 'Todas' ? category : null,
    workMode !== 'Todas' ? workMode : null,
    opportunityType !== 'Todas' ? opportunityType : null,
    experience !== 'Todas' ? experience : null,
  ].filter(Boolean) as string[];

  const toggleSave = (jobId: string) => {
    const next = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(next);
    saveSavedJobs(next);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('Todas');
    setWorkMode('Todas');
    setOpportunityType('Todas');
    setExperience('Todas');
  };

  return (
    <div className="section-shell">
      <div className="container">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-label">Explorar empleos</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">Busca tu primera oportunidad</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/perfil')}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700"
          >
            Ver mi perfil
          </button>
        </div>

        <div className="panel p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <Search size={18} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rol, habilidad o empresa"
                aria-label="Buscar por rol, habilidad o empresa"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <Filter size={18} className="text-slate-500" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filtrar por categoría">
                {categories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <SlidersHorizontal size={18} className="text-slate-500" />
              <select value={workMode} onChange={(e) => setWorkMode(e.target.value as 'Todas' | WorkMode)} aria-label="Filtrar por modalidad">
                {workModes.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <ArrowUpDown size={18} className="text-slate-500" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'relevance' | 'newest')} aria-label="Ordenar resultados">
                <option value="relevance">Relevancia</option>
                <option value="newest">Más recientes</option>
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
            <label className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Tipo</span>
              <select value={opportunityType} onChange={(e) => setOpportunityType(e.target.value as 'Todas' | OpportunityType)} aria-label="Filtrar por tipo de oportunidad">
                {opportunityTypes.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Experiencia</span>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} aria-label="Filtrar por nivel de experiencia">
                {experienceLevels.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-slate-700">{filteredJobs.length} resultados</span>
            {activeFilters.map((filter) => (
              <span key={filter} className="rounded-full bg-[#d8f96b] px-2.5 py-1 text-xs font-bold text-slate-900">
                {filter}
              </span>
            ))}
          </div>
          <Link to="/empleos" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Ver todas</Link>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="panel mt-8 p-8 text-center">
            <h3 className="text-2xl font-extrabold text-slate-900">No encontramos oportunidades con esos filtros</h3>
            <p className="mt-3 text-slate-600">Prueba otra combinación o limpia los filtros para ver más opciones.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-full bg-[#121a2d] px-5 py-2.5 text-sm font-bold text-white"
            >
              Reiniciar búsqueda
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} onToggleSave={toggleSave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
