import React from 'react';
import { useDrag } from 'react-dnd';

const PlanItem = ({ plan }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'plan',
    item: { plan },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`event ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {Array.isArray(plan.secteurMatinal) &&
        plan.secteurMatinal.map((secteur, idx) => (
          <div key={`matinal-${idx}`} className="secteur-matinal">
            {secteur.name} - 8:00 AM
          </div>
        ))}
      {Array.isArray(plan.secteurApresMidi) &&
        plan.secteurApresMidi.map((secteur, idx) => (
          <div key={`apresMidi-${idx}`} className="secteur-apres-midi">
            {secteur.name} - 12:00 PM
          </div>
        ))}
      {plan.notes && (
        <div className="notes bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mt-2 rounded-md">
          Notes: {plan.notes}
        </div>
      )}
    </div>
  );
};

export default PlanItem;
