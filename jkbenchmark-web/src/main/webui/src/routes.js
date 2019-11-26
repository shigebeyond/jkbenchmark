import React from 'react';

const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Benchmark = React.lazy(() => import('./views/Benchmark'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/benchmark', name: 'Benchmark', component: Benchmark },
];

export default routes;
