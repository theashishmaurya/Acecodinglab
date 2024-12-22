import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Kanban Board', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders initial board structure', () => {
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
    expect(screen.getByTestId('board-header')).toBeInTheDocument();
    expect(screen.getByTestId('board-content')).toBeInTheDocument();
  });

  test('adds new task', () => {
    const addButton = screen.getByTestId('add-task-btn');
    fireEvent.click(addButton);
    
    const taskInput = screen.getByTestId('task-input');
    userEvent.type(taskInput, 'New Task');
    fireEvent.click(screen.getByTestId('save-task-btn'));
    
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  test('moves task between columns', () => {
    const task = screen.getByTestId('task-1');
    const targetColumn = screen.getByTestId('column-2');
    
    fireEvent.dragStart(task);
    fireEvent.dragEnter(targetColumn);
    fireEvent.dragOver(targetColumn);
    fireEvent.drop(targetColumn);
    
    expect(targetColumn).toContainElement(task);
  });

  test('edits existing task', () => {
    const task = screen.getByTestId('task-1');
    fireEvent.doubleClick(task);
    
    const editInput = screen.getByTestId('edit-task-input');
    userEvent.clear(editInput);
    userEvent.type(editInput, 'Updated Task');
    fireEvent.blur(editInput);
    
    expect(screen.getByText('Updated Task')).toBeInTheDocument();
  });

  test('deletes task', () => {
    const deleteButton = screen.getByTestId('delete-task-1');
    fireEvent.click(deleteButton);
    
    expect(screen.queryByTestId('task-1')).not.toBeInTheDocument();
  });

  // Add more tests for drag and drop, column management, etc.
});
