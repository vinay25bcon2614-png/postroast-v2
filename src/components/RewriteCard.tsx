import { FC, useCallback } from 'react';
import { RewriteCardProps } from '../types';
import '../styles/rewrite.css';

const RewriteCard: FC<RewriteCardProps> = ({
  rewrite,
  onCopy,
  onRegenerate,
  isLoading,
}) => {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(rewrite.text);
    onCopy();
  }, [rewrite.text, onCopy]);

  return (
    <div className="rewrite-card">
      <div className="rewrite-header">
        <span className="rewrite-label">AI rewrite</span>
        <div className="rewrite-badges">
          <span className="badge badge-improvement">+{rewrite.improvement} pts</span>
          {rewrite.hooks.length > 0 && (
            <span className="badge badge-hook">
              {rewrite.hooks[0]}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="rewrite-loading">
          <div className="spinner" />
          <span>Generating rewrite...</span>
        </div>
      ) : (
        <>
          <div className="rewrite-body">
            {rewrite.text}
          </div>

          <div className="rewrite-footer">
            <button
              className="rewrite-btn regenerate-btn"
              onClick={onRegenerate}
            >
              🔄 Regenerate
            </button>
            <button
              className="rewrite-btn copy-btn"
              onClick={handleCopy}
            >
              ✓ Copy
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RewriteCard;
