import React, { useState } from 'react';
import '../styles/dashboard-screen.css';

interface MetricCardProps {
  value: string | number;
  label: string;
  change?: { value: number; direction: 'up' | 'down' };
  icon?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  change,
  icon,
}) => {
  return (
    <div className="metric-card">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {change && (
        <div className={`metric-change ${change.direction}`}>
          <span>{change.direction === 'up' ? '↑' : '↓'}</span>
          {Math.abs(change.value)}%
        </div>
      )}
    </div>
  );
};

interface PostItemProps {
  title: string;
  date: string;
  score: number;
  engagement: number;
}

const PostItem: React.FC<PostItemProps> = ({
  title,
  date,
  score,
  engagement,
}) => {
  return (
    <div className="post-item">
      <div className="post-item-row">
        <div className="post-num">📌</div>
        <div className="post-title">{title}</div>
        <div className="post-flag">
          {engagement >= 80 ? '🔥' : engagement >= 50 ? '⭐' : '📍'}
        </div>
      </div>
      <div className="post-date">{date}</div>
      <div className="post-stats">
        <div className="stat-bar">
          <div className="stat-fill" style={{ width: `${score}%` }}></div>
        </div>
        <div className="stat-value">{score}%</div>
      </div>
    </div>
  );
};

export const DashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <div className="dashboard-navbar">
        <div className="navbar-left">
          <div className="logo-small">
            <div className="logo-mark">P</div>
            PostRoast
          </div>
          <nav className="nav-tabs">
            <div className="nav-tab active">Dashboard</div>
            <div className="nav-tab">Analytics</div>
            <div className="nav-tab">Settings</div>
          </nav>
        </div>
        <div className="navbar-right">
          <div className="flame-badge">
            <span>🔥</span>
            <span>7d streak</span>
          </div>
          <button className="upgrade-btn">Upgrade</button>
          <div className="user-avatar">AK</div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-group">📊 WORKSPACE</div>
          <div className="sidebar-item active">
            <span>📈</span> Dashboard
          </div>
          <div className="sidebar-item">
            <span>✍️</span> Composer
          </div>
          <div className="sidebar-item">
            <span>🚀</span> Post Queue
            <span className="badge-num">3</span>
          </div>

          <div className="sidebar-group">🎨 TOOLS</div>
          <div className="sidebar-item">
            <span>🎯</span> Roast Engine
          </div>
          <div className="sidebar-item">
            <span>🪝</span> Hook Builder
          </div>
          <div className="sidebar-item">
            <span>📋</span> Templates
          </div>

          <div className="sidebar-group">📚 LEARN</div>
          <div className="sidebar-item">
            <span>👥</span> Creators
          </div>
          <div className="sidebar-item">
            <span>📖</span> Formats
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar-large">AK</div>
            <div>
              <div className="user-name">Alex King</div>
              <div className="user-plan">Pro Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-header">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Your posting performance & insights</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-small">📅 This Month</button>
            <button className="btn btn-small primary">✍️ New Post</button>
          </div>
        </div>

        <div className="metrics-row">
          <MetricCard
            value="2,847"
            label="Total Impressions"
            change={{ value: 12, direction: 'up' }}
          />
          <MetricCard
            value="384"
            label="Engagements"
            change={{ value: 8, direction: 'up' }}
          />
          <MetricCard
            value="68%"
            label="Avg. Score"
            change={{ value: 3, direction: 'down' }}
          />
          <MetricCard
            value="127"
            label="New Followers"
            change={{ value: 15, direction: 'up' }}
          />
        </div>

        <div className="content-grid">
          {/* Left Column */}
          <div className="content-main">
            <div className="card">
              <div className="card-header">
                <span>📊 Recent Posts</span>
                <div className="card-actions">
                  <button className="card-action">View All</button>
                </div>
              </div>
              <div className="card-body">
                <PostItem
                  title="Why most LinkedIn strategies fail..."
                  date="Today at 2:30 PM"
                  score={78}
                  engagement={92}
                />
                <PostItem
                  title="The one thing nobody talks about..."
                  date="Yesterday at 10:15 AM"
                  score={64}
                  engagement={71}
                />
                <PostItem
                  title="Here's what I learned from 100k followers"
                  date="2 days ago"
                  score={71}
                  engagement={85}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span>💡 Quick Tips</span>
              </div>
              <div className="card-body">
                <div className="tip-item">
                  <div className="tip-icon">✓</div>
                  <div className="tip-content">
                    <div className="tip-title">Post at peak times</div>
                    <div className="tip-desc">
                      Your audience is most active 9-11 AM
                    </div>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">✓</div>
                  <div className="tip-content">
                    <div className="tip-title">Use storytelling</div>
                    <div className="tip-desc">
                      Personal stories get 3.2x more engagement
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="content-sidebar">
            <div className="card">
              <div className="card-header">
                <span>🎯 Your Goal: Get Clients</span>
              </div>
              <div className="card-body goal-info">
                <p className="goal-desc">
                  Posts optimized for client acquisition. Focus on proving value
                  and making CTAs easy to click.
                </p>
                <div className="goal-metrics">
                  <div className="goal-metric">
                    <span>Authority Score</span>
                    <span className="goal-metric-val">78%</span>
                  </div>
                  <div className="goal-metric">
                    <span>CTA Clarity</span>
                    <span className="goal-metric-val">92%</span>
                  </div>
                  <div className="goal-metric">
                    <span>Pain Clarity</span>
                    <span className="goal-metric-val">71%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span>🏆 Leaderboard</span>
              </div>
              <div className="card-body leaderboard">
                <div className="leaderboard-item">
                  <span className="rank">1</span>
                  <span className="creator">Justin Welsh</span>
                  <span className="score">94</span>
                </div>
                <div className="leaderboard-item">
                  <span className="rank">2</span>
                  <span className="creator">Alex Hormozi</span>
                  <span className="score">89</span>
                </div>
                <div className="leaderboard-item">
                  <span className="rank">3</span>
                  <span className="creator">Chris Orlob</span>
                  <span className="score">86</span>
                </div>
                <div className="leaderboard-item me">
                  <span className="rank">12</span>
                  <span className="creator">You</span>
                  <span className="score">71</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
