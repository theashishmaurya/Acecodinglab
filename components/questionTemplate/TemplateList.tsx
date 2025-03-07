'use client';

import React, { useState } from 'react';
import {
  useQuestionTemplate,
  QuestionTemplate,
  QuestionFiles,
} from './context/questionTemplate.context';

export default function TemplateList() {
  const {
    templates,
    setSelectedTemplate,
    deleteTemplate,
    changeTemplateStatus,
    loadTemplateFiles,
    createTemplate,
  } = useQuestionTemplate();
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'draft' | 'test' | 'live'
  >('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<QuestionTemplate>>({
    name: '',
    key: '',
    tags: [],
    difficulty: 'easy',
    author: '',
    company: [],
    status: 'draft',
  });

  // Filter templates by status
  const filteredTemplates = templates.filter(
    template => filterStatus === 'all' || template.status === filterStatus,
  );

  // Handle template selection
  const handleSelectTemplate = async (template: QuestionTemplate) => {
    setSelectedTemplate(template);
    await loadTemplateFiles(template.key);
  };

  // Handle template status change
  const handleStatusChange = (
    templateId: string,
    status: 'draft' | 'test' | 'live',
  ) => {
    changeTemplateStatus(templateId, status);
  };

  // Handle new template form change
  const handleNewTemplateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'tags' || name === 'company') {
      setNewTemplate({
        ...newTemplate,
        [name]: value.split(',').map(item => item.trim()),
      });
    } else {
      setNewTemplate({
        ...newTemplate,
        [name]: value,
      });
    }
  };

  // Handle new template creation
  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.key) {
      alert('Name and key are required fields');
      return;
    }

    // Create default files for the new template
    const defaultFiles: QuestionFiles = {
      'question.mdx': `# ${newTemplate.name}\n\n## Overview\n\nDescribe the question here.\n\n## Requirements\n\n1. First requirement\n2. Second requirement\n\n## Expected Result\n\nDescribe the expected result here.\n\n## Hints\n\n- First hint\n- Second hint`,
      'App.js':
        'import React from "react";\n\nexport default function App() {\n  return (\n    <div className="App">\n      <h1>Hello World</h1>\n      {/* Your code here */}\n    </div>\n  );\n}',
      'index.js':
        'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\nimport "./styles.css";\n\nReactDOM.render(<App />, document.getElementById("root"));',
      'styles.css':
        '/* Add your styles here */\n\nbody {\n  font-family: sans-serif;\n}\n\n.App {\n  text-align: center;\n  margin: 1rem;\n}',
    };

    // Create the template
    await createTemplate(newTemplate as QuestionTemplate, defaultFiles);
    setShowCreateModal(false);

    // Reset form
    setNewTemplate({
      name: '',
      key: '',
      tags: [],
      difficulty: 'easy',
      author: '',
      company: [],
      status: 'draft',
    });
  };

  return (
    <div>
      {/* Header with filter and create button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'draft' ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('draft')}
          >
            Draft
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'test' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('test')}
          >
            Test
          </button>
          <button
            className={`px-3 py-1 rounded-md ${filterStatus === 'live' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('live')}
          >
            Live
          </button>
        </div>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Template
        </button>
      </div>

      {/* Templates list */}
      <div className="bg-background rounded-md shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-gray-200">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <tr key={template.id} className="hover:bg-background">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {template.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {template.key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        template.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800'
                          : template.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {template.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={template.status}
                      onChange={e =>
                        handleStatusChange(
                          template.id!,
                          e.target.value as 'draft' | 'test' | 'live',
                        )
                      }
                      className="p-1 text-sm border rounded"
                    >
                      <option value="draft">Draft</option>
                      <option value="test">Test</option>
                      <option value="live">Live</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteTemplate(template.id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No templates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create template modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Template</h2>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTemplate.name}
                onChange={handleNewTemplateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="key"
              >
                Key (URL slug)
              </label>
              <input
                type="text"
                id="key"
                name="key"
                value={newTemplate.key}
                onChange={handleNewTemplateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="tags"
              >
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={newTemplate.tags?.join(', ')}
                onChange={handleNewTemplateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="difficulty"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={newTemplate.difficulty}
                onChange={handleNewTemplateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="author"
              >
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={newTemplate.author}
                onChange={handleNewTemplateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="company"
              >
                Companies (comma separated)
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={newTemplate.company?.join(', ')}
                onChange={handleNewTemplateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCreateTemplate}
              >
                Create & Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
