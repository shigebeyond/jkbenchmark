import React from 'react';

const Benchmark = React.lazy(() => import('./views/Benchmark'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/benchmark', name: 'Benchmark', component: Benchmark },
];

export default routes;
