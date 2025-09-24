// Research Queue Service - Manages API requests with rate limiting
class ResearchQueueService {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private concurrentRequests = 2; // Max concurrent requests
  private delayBetweenBatches = 1000; // 1 second delay between batches
  private activeRequests = 0;

  async addToQueue<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      // Process requests in batches
      const batch: Array<() => Promise<any>> = [];
      
      // Take up to concurrentRequests from the queue
      while (batch.length < this.concurrentRequests && this.queue.length > 0) {
        const request = this.queue.shift();
        if (request) {
          batch.push(request);
        }
      }

      // Execute batch concurrently
      if (batch.length > 0) {
        this.activeRequests = batch.length;
        await Promise.all(batch.map(fn => fn()));
        this.activeRequests = 0;

        // Add delay between batches if there are more requests
        if (this.queue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.delayBetweenBatches));
        }
      }
    }

    this.processing = false;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getActiveRequests(): number {
    return this.activeRequests;
  }

  clearQueue(): void {
    this.queue = [];
    this.processing = false;
    this.activeRequests = 0;
  }
}

// Export singleton instance
export const researchQueue = new ResearchQueueService();
