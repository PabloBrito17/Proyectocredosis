import { Bookmark, BookmarkCheck, MapPin, BriefcaseBusiness, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
  saved: boolean;
  onToggleSave: (jobId: string) => void;
}

export function JobCard({ job, saved, onToggleSave }: JobCardProps) {
  return (
    <article className="panel flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center rounded-full bg-[#eefaf5] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#155c4a]">
              {job.category}
            </span>
            <h3 className="mt-3 text-xl font-extrabold text-slate-900">{job.title}</h3>
          </div>
          <button
            type="button"
            aria-label={saved ? 'Quitar de guardados' : 'Guardar oportunidad'}
            onClick={() => onToggleSave(job.id)}
            className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            {saved ? <BookmarkCheck className="text-[#0f766e]" size={18} /> : <Bookmark size={18} />}
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
            <BriefcaseBusiness size={12} /> {job.company}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
            <MapPin size={12} /> {job.location}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-700">
          <span className="rounded-full border border-slate-200 px-2.5 py-1">{job.mode}</span>
          <span className="rounded-full border border-slate-200 px-2.5 py-1">{job.type}</span>
          <span className="rounded-full border border-slate-200 px-2.5 py-1">{job.experience}</span>
        </div>

        <p className="text-sm leading-6 text-slate-600">{job.description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <Link
          to={`/empleos/${job.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-[#121a2d] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1a2335]"
        >
          Ver oportunidad <ArrowRight size={15} />
        </Link>
        <span className="text-xs text-slate-500">Demo</span>
      </div>
    </article>
  );
}
