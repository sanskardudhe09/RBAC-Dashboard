import React from "react";
import "./Card.css";

const Card = ({ title, items, role, onEdit, onDelete, cardId, isExpanded, onToggle }) => {
  const handleToggle = (e) => {
    e.stopPropagation();
    console.log(`Card ${title} (${cardId}) clicked. isExpanded: ${isExpanded}`);
    onToggle();
  };

  // Debug logging for props
  console.log(`Card ${cardId} render - isExpanded: ${isExpanded}, title: ${title}`);

  const handleEdit = (item) => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDelete = (item) => {
    if (onDelete && window.confirm(`Are you sure you want to delete this ${title.slice(0, -1)}?`)) {
      onDelete(item);
    }
  };

  const canEdit = role === "admin" || role === "editor";
  const canDelete = role === "admin";

  const renderItem = (item, index) => {
    if (typeof item === 'object') {
      return (
        <div key={index} className="card-item">
          <div className="item-content">
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="item-field">
                <span className="field-label">{key}:</span>
                <span className="field-value">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </span>
              </div>
            ))}
          </div>
          <div className="item-actions">
            {canEdit && (
              <button 
                className="btn-edit"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button 
                className="btn-delete"
                onClick={() => handleDelete(item)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      );
    }
    return (
      <div key={index} className="card-item">
        <span>{item}</span>
      </div>
    );
  };

  const getItemCount = () => {
    if (Array.isArray(items)) {
      return items.length;
    }
    return items ? 1 : 0;
  };

  return (
    <div className={`dashboard-card ${isExpanded ? 'expanded' : 'collapsed'}`} data-card-id={cardId} data-expanded={isExpanded}>
      <div className="card-header" onClick={handleToggle}>
        <h3>{title}</h3>
        <span className="card-count">{getItemCount()}</span>
        <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
      </div>
      
      <div 
        className="card-content"
        style={{ display: isExpanded ? 'block' : 'none' }}
      >
        {Array.isArray(items) ? (
          items.length > 0 ? (
            items.map((item, index) => renderItem(item, index))
          ) : (
            <div className="no-data">No {title.toLowerCase()} found</div>
          )
        ) : (
          items ? renderItem(items, 0) : <div className="no-data">No {title.toLowerCase()} found</div>
        )}
      </div>
      
      <div 
        className="card-footer"
       
      >
        <div className="role-info">
          <span className="role-badge">{role}</span>
          <span className="permissions">
            {canEdit ? 'Edit' : 'View'} {canDelete ? '| Delete' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card; 