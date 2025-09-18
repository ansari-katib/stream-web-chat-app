import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import "stream-chat-react/dist/css/v2/index.css";
import './index.css';


import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
      <QueryClientProvider client={queryClient} >
        <App />
      </QueryClientProvider>
  </React.StrictMode>
);