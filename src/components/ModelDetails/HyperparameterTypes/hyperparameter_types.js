const hyperparameter_types = {
  kmeans: {
    n_clusters: 'Int',
    max_iter: 'Int',
    n_init: 'Int',
    init: ['rand','k-means++'],
    tol: 'float',
    _algorithm: ['Elkan', 'auto', 'full']
  },
  agglomerative: {
    n_clusters: 'Int',
    test: 'agglomerative',
  },
  single: {
    n_clusters: 'Int',
    test: 'single'
  },
  complete: {
    n_clusters: 'Int',
    test: 'complete'
  },
  average: {
    n_clusters: 'Int',
    test: 'average'
  },
  weighted: {
    n_clusters: 'Int',
  },
  median: {
    n_clusters: 'Int',
    test: 'median'
  },
  birch: {
    n_clusters: 'Int',
    branching_factor: 'Int',
    threshold: 'float',
    test: 'birch'
  },
  optics: {
    algorithm: ['auto', 'ball_tree', 'kd_tree', 'brute'],
    leaf_size: 'Int',
    max_eps: 'float',
    min_samples: 'Int', 
    p: 'Int',
    predecessor_correction: ['true', 'false'],
    xi: 'float', 
    test: 'optics'
  },
  dbscan: {
    algorithm: ['auto', 'ball_tree', 'kd_tree', 'brute'],
    eps: 'float',
    leaf_size: 'Int',
    min_samples: 'Int',
    p: 'float',
    test: 'dbscan'
  },
  hdbscan: {
    n_clusters: 'Int',
    min_cluster_size: 'Int',
    min_samples: 'Int',
    alpha: 'float',
    cluster_selection_epsilon: 'float',
    leaf_size: 'Int',
    gen_min_span_tree: ['true', 'false'],
    test: 'hdbscan'
  }
};

export default hyperparameter_types;