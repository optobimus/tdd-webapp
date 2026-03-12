import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { HttpTodoApiClient } from './api/todo-api-client';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App apiClient={new HttpTodoApiClient('/api')} />
  </StrictMode>
);
