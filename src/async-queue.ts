export type AsyncTask = () => Promise<void>;

/**
 * Run the next task task when the previous one ends.
 */
export function createAsyncQueue() {
  const queue: AsyncTask[] = [];
  let isProcessingQueue = false;

  const processQueue = async () => {
    isProcessingQueue = true;
    while (queue.length) {
      const task = queue.shift();
      await task!();
    }
    isProcessingQueue = false;
  };

  return (task: AsyncTask) => {
    queue.push(task);
    if (!isProcessingQueue) {
      processQueue();
    }
  };
}

/**
 * A queue with capacity limited to one ongoing async task and one queued async task.
 * Subsequent tasks requested while there's a queued task are ignored.
 */
export function createReducedAsyncQueue<Args extends any[]>() {
  let onGoingPromise: Promise<void> | null = null;
  let anotherOneQueued = false;

  return async function schedule(func: (...args: Args) => Promise<void>, ...args: Args) {
    if (!onGoingPromise) {
      onGoingPromise = (async () => {
        await func(...args);
        onGoingPromise = null;
      })();
    } else {
      if (anotherOneQueued) return;
      anotherOneQueued = true;
      await onGoingPromise;
      anotherOneQueued = false;
      schedule(func, ...args);
    }
  };
}
