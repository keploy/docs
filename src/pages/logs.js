import React from 'react';
import LogViewer from '../components/LogViewer';

const sampleLogs = [
  {time:'2025-12-16 10:00:01', level:'info', message:'Server started on http://localhost:3000'},
  {time:'2025-12-16 10:01:10', level:'warn', message:'Cache miss for key user:42'},
  {time:'2025-12-16 10:02:45', level:'error', message:'Unhandled exception in worker', meta:{err:'TypeError', trace:['file.js:42'] }},
  {time:'2025-12-16 10:03:07', level:'debug', message:'Request headers: {"user-agent":"curl/7"}'},
];

export default function LogsPage(){
  return (
    <main className="container">
      <h1>Log Viewer</h1>
      <p className="lead">A responsive log viewer component with filtering and accessible controls.</p>
      <LogViewer logs={sampleLogs} />

      <section>
        <h2>Usage</h2>
        <pre>
{`<LogViewer logs={[{time:'...', level:'info', message:'...'}]} />`}
        </pre>
      </section>
    </main>
  );
}
