'use client';

import { useEffect, useState } from 'react';
import type { Project, ProjectInput, ProjectStatus } from '@/types/project';
import { PROJECT_STATUS_LABELS } from '@/types/project';

interface ProjectModalProps {
  teamId: string;
  project: Project | null;
  onSubmit: (input: ProjectInput) => void;
  onDelete?: (project: Project) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: ProjectStatus[] = ['IN_DEVELOPMENT', 'IN_OPERATION', 'CLOSED'];

export function ProjectModal({ teamId, project, onSubmit, onDelete, onCancel }: ProjectModalProps) {
  const [name, setName] = useState(project?.name ?? '');
  const [startDate, setStartDate] = useState(project?.startDate ?? '');
  const [memo, setMemo] = useState(project?.memo ?? '');
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? 'IN_DEVELOPMENT');

  useEffect(() => {
    setName(project?.name ?? '');
    setStartDate(project?.startDate ?? '');
    setMemo(project?.memo ?? '');
    setStatus(project?.status ?? 'IN_DEVELOPMENT');
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ teamId, name, startDate: startDate || undefined, memo: memo || undefined, status });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()}>
        {/* From Uiverse.io by uiverse-astronaut */} 
        <form onSubmit={handleSubmit}>
          <div className="cir-note" role="status" aria-live="polite">
            <span></span>
            <div className="cir-note__body margin-top-20">
              <p className="cir-note__t">프로젝트 이름</p>
              <p className="cir-note__d">
                <label className="cir-search margin-bottom-20">
                  {/* <svg
                    className="cir-search__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.34-4.34"></path>
                  </svg> */}
                  <input
                    className="cir-search__field"
                    type="search"
                    placeholder="Please enter a team name."
                    aria-label="Search"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
              </p>

              <p className="cir-note__t">상태</p>
              <div className="cir-note__d">
                <div className="cir-tabs margin-bottom-20" role="tablist" aria-label="Range">
                  <input
                    className="cir-tabs__r"
                    type="radio"
                    name="cir-range"
                    id="cir-r-day"
                    checked={status === 'IN_DEVELOPMENT'}
                    onChange={() => setStatus('IN_DEVELOPMENT')}
                  />
                  <label className="cir-tabs__t" htmlFor="cir-r-day" role="tab">Development</label>

                  <input
                    className="cir-tabs__r"
                    type="radio"
                    name="cir-range"
                    id="cir-r-month"
                    checked={status === 'IN_OPERATION'}
                    onChange={() => setStatus('IN_OPERATION')}
                  />
                  <label className="cir-tabs__t" htmlFor="cir-r-month" role="tab">Live</label>

                  <input
                    className="cir-tabs__r"
                    type="radio"
                    name="cir-range"
                    id="cir-r-year"
                    checked={status === 'CLOSED'}
                    onChange={() => setStatus('CLOSED')}
                  />
                  <label className="cir-tabs__t" htmlFor="cir-r-year" role="tab">Ended</label>
                </div>
              </div>

              <p className="cir-note__t">시작일</p>
              <p className="cir-note__d">
                <label className="cir-search margin-bottom-20">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
              </p>

              <p className="cir-note__t">메모</p>
              <p className="cir-note__d">
                <label className="cir-search margin-bottom-20">
                  <input
                    className="cir-search__field"
                    type="search"
                    placeholder="Please enter a team name."
                    aria-label="Search"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    required
                  />
                </label>
              </p>
            </div>

            <button type="submit" className="cir-search__kbd project-modal-btn">ADD</button>
            <button type="button" onClick={onCancel} className="cir-search__kbd project-modal-btn margin-bottom-20 cancel-btn">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
    // <div className="modal-overlay" onClick={onCancel}>
    //   <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    //     <h2>{project ? '프로젝트 수정' : '프로젝트 추가'}</h2>
    //     <form onSubmit={handleSubmit}>
    //       <label>
    //         프로젝트 이름
    //         <input value={name} onChange={(e) => setName(e.target.value)} required />
    //       </label>
    //       <label>
    //         상태
    //         <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
    //           {STATUS_OPTIONS.map((option) => (
    //             <option key={option} value={option}>
    //               {PROJECT_STATUS_LABELS[option]}
    //             </option>
    //           ))}
    //         </select>
    //       </label>
    //       <label>
    //         시작일
    //         <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
    //       </label>
    //       <label>
    //         메모
    //         <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={4} />
    //       </label>
    //       <div className="modal-actions">
    //         {project && onDelete && (
    //           <button type="button" className="modal-delete" onClick={() => onDelete(project)}>
    //             삭제
    //           </button>
    //         )}
    //         <button type="button" className="modal-cancel" onClick={onCancel}>
    //           취소
    //         </button>
    //         <button type="submit" className="modal-submit">
    //           {project ? '수정' : '추가'}
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
}
