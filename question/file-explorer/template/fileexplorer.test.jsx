import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('File Explorer', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders initial file structure', () => {
    expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  test('expands/collapses folders', () => {
    const documentsFolder = screen.getByText('Documents');
    fireEvent.click(documentsFolder);
    
    expect(screen.getByText('document1.txt')).toBeInTheDocument();
    
    fireEvent.click(documentsFolder);
    expect(screen.queryByText('document1.txt')).not.toBeInTheDocument();
  });

  test('creates new folder', () => {
    const newFolderBtn = screen.getByTestId('new-folder-btn');
    fireEvent.click(newFolderBtn);
    
    const input = screen.getByTestId('rename-input');
    userEvent.type(input, 'New Folder{enter}');
    
    expect(screen.getByText('New Folder')).toBeInTheDocument();
  });

  test('renames file/folder', () => {
    const file = screen.getByText('document1.txt');
    fireEvent.contextMenu(file);
    
    const renameOption = screen.getByText('Rename');
    fireEvent.click(renameOption);
    
    const input = screen.getByTestId('rename-input');
    userEvent.type(input, 'renamed.txt{enter}');
    
    expect(screen.getByText('renamed.txt')).toBeInTheDocument();
  });

  test('deletes file/folder', () => {
    const file = screen.getByText('document1.txt');
    fireEvent.contextMenu(file);
    
    const deleteOption = screen.getByText('Delete');
    fireEvent.click(deleteOption);
    
    expect(screen.queryByText('document1.txt')).not.toBeInTheDocument();
  });

  test('shows context menu on right click', () => {
    const file = screen.getByText('document1.txt');
    fireEvent.contextMenu(file);
    
    expect(screen.getByTestId('context-menu')).toBeInTheDocument();
    expect(screen.getByText('Rename')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  // Add more tests...
});
