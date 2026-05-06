import { FC } from 'react';
import { RightPanelProps } from '../types';
import RewriteCard from './RewriteCard';
import TemplateGrid from './TemplateGrid';
import StreakBox from './StreakBox';
import '../styles/rightpanel.css';

const RightPanel: FC<RightPanelProps> = ({
  activeTab,
  onTabChange,
  rewrite,
  templates,
  styleDNA,
}) => {
  return (
    <aside className="right-panel">
      <div className="right-panel-tabs">
        {(['rewrite', 'templates', 'style-dna'] as const).map((tab) => (
          <button
            key={tab}
            className={`right-panel-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab === 'rewrite' && 'Rewrite'}
            {tab === 'templates' && 'Templates'}
            {tab === 'style-dna' && 'Style DNA'}
          </button>
        ))}
      </div>

      <div className="right-panel-body">
        {activeTab === 'rewrite' && rewrite && (
          <RewriteCard
            rewrite={rewrite}
            onCopy={() => {}}
            onRegenerate={() => {}}
          />
        )}

        {activeTab === 'templates' && templates && (
          <TemplateGrid templates={templates} goal="Get Clients" />
        )}

        {activeTab === 'style-dna' && styleDNA && (
          <div className="style-dna-content">
            <div className="style-dna-status">
              Status: <strong>{styleDNA.status}</strong>
            </div>
            <div className="style-dna-voice">
              Voice: <strong>{styleDNA.voice}</strong>
            </div>
            <div className="style-dna-patterns">
              <strong>Patterns:</strong>
              <ul>
                {styleDNA.patterns.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'rewrite' && !rewrite && (
          <div className="placeholder">Roast a post to see rewrites</div>
        )}
        {activeTab === 'templates' && !templates && (
          <StreakBox days={[]} totalDays={7} percentile={12} />
        )}
        {activeTab === 'style-dna' && !styleDNA && (
          <div className="placeholder">Style DNA will be available soon</div>
        )}
      </div>
    </aside>
  );
};

export default RightPanel;
