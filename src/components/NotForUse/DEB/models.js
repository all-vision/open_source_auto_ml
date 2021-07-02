import DATA from './model_details_data';

const models =  [
  {
    name: 'Original Chart',
    data: DATA,
    clusters: 8,
    silouette: 3,
    classifiesAnamolies: true,
    downsampledAmount: '230 (20%)',
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 1,
  },
  {
    name: 'HDBSCAN',
    data: DATA,
    clusters: 8,
    silouette: 14,
    classifiesAnamolies: false,
    downsampledAmount: '130 (15%)',
    recommendedByUs: true,
    classifiesAnamolies: true,
    newAnamolies: 5,
  },
  {
    name: 'DBSCAN',
    clusters: 7,
    silouette: 4,
    classifiesAnamolies: true,
    downsampledAmount: '430 (35%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 3,
  },
  {
    name: 'Tree Clustering 1',
    clusters: 8,
    silouette: 0.85,
    classifiesAnamolies: false,
    downsampledAmount: '330 (31%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 13,
  },
  {
    name: 'K Means',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Tree Clustering 2',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Isolation Forest',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Autoencoding',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Fuzzy Clustering',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Mean Shift',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Gaussian Mixture Models',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Birch',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Agglomerative',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Affinity Clustering',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Sting',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'Clique',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'SubCLue',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
  {
    name: 'HiCO',
    clusters: 8,
    silouette: 0.55,
    classifiesAnamolies: false,
    downsampledAmount: '130 (11%)',
    data: DATA,
    recommendedByUs: false,
    classifiesAnamolies: false,
    newAnamolies: 23,
  },
];

export default models;