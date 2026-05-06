import { FC } from 'react';
import { TemplateGridProps } from '../types';
import '../styles/template.css';

const TemplateGrid: FC<TemplateGridProps> = ({ templates, goal }) => {
  const defaultTemplates = [
    {
      id: '1',
      name: 'Insider Leak',
      description: 'What your industry won\'t say publicly',
      tag: 'HIGH HOOK',
    },
    {
      id: '2',
      name: 'Case Study',
      description: 'Before/after with real numbers',
      tag: 'HIGH TRUST',
    },
    {
      id: '3',
      name: 'Mistake List',
      description: 'X errors your niche makes',
      tag: 'VIRAL',
    },
    {
      id: '4',
      name: 'Contrarian',
      description: 'Challenge conventional wisdom',
      tag: 'AUTHORITY',
    },
  ];

  const displayTemplates = templates.length > 0 ? templates : defaultTemplates;

  return (
    <div className="template-grid">
      {displayTemplates.map((template) => (
        <button
          key={template.id}
          className="template-card"
        >
          <div className="template-title">{template.name}</div>
          <div className="template-description">{template.description}</div>
          <div className="template-tag">{template.tag}</div>
        </button>
      ))}
    </div>
  );
};

export default TemplateGrid;
