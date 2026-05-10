import { useState } from 'react';
import KPIStrip from './KPIStrip';
import ComposerPanel from './ComposerPanel';
import ResultsPanel from './ResultsPanel';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 800);
  };

  return (
    <>
      <KPIStrip />
      <section className="dashboard-grid">
        <ComposerPanel onSubmit={onSubmit} loading={loading} />
        <ResultsPanel />
      </section>
    </>
  );
}
