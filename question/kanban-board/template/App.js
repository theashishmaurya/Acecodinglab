import React from 'react';
import './styles.css';

const INITIAL_DATA = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show' },
    'task-3': { id: 'task-3', content: 'Charge my phone' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const App = () => {
  // TODO: Implement state management for tasks and columns
  // TODO: Implement drag and drop functionality
  // TODO: Implement add/edit/delete tasks

  return (
    <div className="kanban-board" data-testid="kanban-board">
      <div className="board-header" data-testid="board-header">
        <h1>Kanban Board</h1>
        <button data-testid="add-task-btn">Add Task</button>
      </div>

      <div className="board-content" data-testid="board-content">
        {/* TODO: Implement columns */}
      </div>
    </div>
  );
};

export default App;
