export class Mutex {
    private queue: (() => void)[] = [];
    private locked = false;

    async acquire(): Promise<() => void> {
        return new Promise((resolve) => {
            const attempt = () => {
                if (!this.locked) {
                    this.locked = true;
                    resolve(() => {
                        this.locked = false;
                        this.queue.shift()?.();
                    });
                } else {
                    this.queue.push(attempt);
                }
            };
            attempt();
        });
    }

    async run<T>(fn: () => Promise<T>): Promise<T> {
        const release = await this.acquire();
        try {
            return await fn();
        } finally {
            release();
        }
    }
}
