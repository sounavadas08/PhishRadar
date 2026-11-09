import { fetchThreatFeed } from './src/utils/intel.js';

(async () => {
  const feed = await fetchThreatFeed();
  console.log('Feed size:', feed.size);
})();

