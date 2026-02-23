import React, { useState, useRef, createContext, useContext } from 'react';
import './styles.css';

// TODO: Implement a Tabs component with proper ARIA attributes and keyboard navigation

const TabsContext = createContext(null);

function Tabs({ children, defaultValue, value, onChange }) {
  // TODO: Implement controlled and uncontrolled state
  // TODO: Provide context for child components
  
  return (
    <div className="tabs" data-testid="tabs-root">
      {/* TODO: Add proper context provider */}
      {children}
    </div>
  );
}

function TabsList({ children }) {
  // TODO: Implement keyboard navigation
  // TODO: Add role="tablist" and proper ARIA
  
  return (
    <div className="tabs-list" role="tablist" aria-label="Content tabs">
      {children}
    </div>
  );
}

function TabsTrigger({ children, value }) {
  // TODO: Implement tab button with proper ARIA
  // TODO: Handle selection state
  // TODO: Handle click and keyboard events
  
  return (
    <button
      className="tabs-trigger"
      role="tab"
      aria-selected="false"
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      tabIndex={-1}
    >
      {children}
    </button>
  );
}

function TabsContent({ children, value }) {
  // TODO: Hide panel when not selected
  // TODO: Add proper ARIA attributes
  
  return (
    <div
      className="tabs-content"
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      id={`panel-${value}`}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="app-container">
      <h1>Tabs Component Challenge</h1>
      <p>Implement accessible tabs with keyboard navigation.</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <h2>Account Settings</h2>
          <p>Manage your account information and preferences here.</p>
          <form>
            <label>
              Name: <input type="text" defaultValue="John Doe" />
            </label>
            <label>
              Email: <input type="email" defaultValue="john@example.com" />
            </label>
          </form>
        </TabsContent>
        
        <TabsContent value="password">
          <h2>Password</h2>
          <p>Change your password here. After saving, you'll be logged out.</p>
          <form>
            <label>
              Current Password: <input type="password" />
            </label>
            <label>
              New Password: <input type="password" />
            </label>
          </form>
        </TabsContent>
        
        <TabsContent value="settings">
          <h2>Settings</h2>
          <p>Configure your application settings.</p>
          <div className="settings-option">
            <label>
              <input type="checkbox" defaultChecked /> Enable notifications
            </label>
          </div>
          <div className="settings-option">
            <label>
              <input type="checkbox" /> Enable dark mode
            </label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
export { Tabs, TabsList, TabsTrigger, TabsContent };