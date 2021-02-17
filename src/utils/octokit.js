import { Octokit } from '@octokit/core';
import { throttling } from '@octokit/plugin-throttling';

const MyOctokit = Octokit.plugin(throttling);

export const octokit = new MyOctokit({
  throttle: {
    onRateLimit: (retryAfter, options, octokit) => {
      octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

      if (options.request.retryCount === 0) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
      return false;
    },
    onAbuseLimit: (retryAfter, options, octokit) => {
      // does not retry, only logs a warning
      octokit.log.warn(`Abuse detected for request ${options.method} ${options.url}`);
      return true;
    },
  },
});
