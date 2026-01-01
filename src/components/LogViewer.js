import React, {useState, useMemo} from 'react';
import styles from './LogViewer.module.css';

// Minimal responsive log viewer component
export default function LogViewer({logs = []}) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('all');

  const levels = ['all','error','warn','info','debug'];

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    return logs.filter(l=> (level==='all' || l.level===level) && (!q || l.message.toLowerCase().includes(q) || (l.meta && JSON.stringify(l.meta).toLowerCase().includes(q))));
  },[logs, query, level]);

  return (
    <div className={`container ${styles.wrapper}`} aria-live="polite">
      <header className={styles.header}>
        <div className={styles.controls}>
          <label className={styles.searchLabel}>
            <span className={styles.visuallyHidden}>Filter logs</span>
            <input aria-label="Filter logs" className={styles.search} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search logs..." />
          </label>

          <label className={styles.selectLabel}>
            <span className={styles.visuallyHidden}>Log level</span>
            <select aria-label="Log level" value={level} onChange={e=>setLevel(e.target.value)}>
              {levels.map(l=> <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
        </div>
        <div className={styles.count}>{filtered.length} entries</div>
      </header>

      <main className={styles.logPane}>
        {filtered.length===0 ? (
          <div className={styles.empty}>No log entries match your filters.</div>
        ) : (
          <ol className={styles.list}>
            {filtered.map((l,i)=> (
              <li key={i} className={`${styles.line} ${styles[l.level] || ''}`}>
                <time className={styles.time}>{l.time}</time>
                <span className={styles.level}>{l.level.toUpperCase()}</span>
                <span className={styles.msg}>{l.message}</span>
                {l.meta && <pre className={styles.meta}>{JSON.stringify(l.meta,null,2)}</pre>}
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
