// {"n_clusters":"int","init":["rand","k-means++"],"tol":"float","max_iter":'int'}

const kmeans_types = {
  n_clusters: 'Int',
  max_iter: 'Int',
  n_init: 'Int',
  _n_init: 'Int',
  init: ['rand','k-means++'],
  tol: 'float',
  _tol: 'float',
  inertia_: 'float',
  _algorithm: ['Elkan']
};

export default kmeans_types;