import React, { createContext, useState } from 'react';

export const NewTaskContext = createContext();

export function NewTaskProvider({ children }) {
  const [visible, setVisible] = useState(false);

  function show() {
    if (!visible) {
      setVisible(true);
    }
  }

  function hide() {
    if (visible) {
      setVisible(false);
    }
  }

  return (
    <NewTaskContext.Provider value={{ visible, show, hide }}>
      {children}
    </NewTaskContext.Provider>
  );
}
