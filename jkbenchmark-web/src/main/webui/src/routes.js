import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Benchmark = React.lazy(() => import('./views/Benchmark'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/benchmark', name: 'Benchmark', component: Benchmark },
];

export default routes;
