import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';

import Drag from './drag_drop/Drag';

export default function DragRouter() {
  return (
    <BrowserRouter>
      <div className="container">
        <div className="main-content">
          <Switch>
            <Route component={Drag} path="/" exact={true} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(<DragRouter />);
