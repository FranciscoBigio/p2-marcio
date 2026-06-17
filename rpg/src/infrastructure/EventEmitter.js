export class GameEventEmitter {
    constructor() { this.observers = []; }
    subscribe(obs) { this.observers.push(obs); }
    async emit(event, data) {
        for (const obs of this.observers) {
            await obs.update(event, data);
        }
    }
}

export const UIController = {
    update: (ev, data) => {
        const colors = { SYSTEM: '\x1b[33m', VICTORY: '\x1b[32m', DEFAULT: '\x1b[0m' };
        if (ev === 'MSG') console.log(`[BATTLE-SERVICE]: ${data}`);
        if (ev === 'SYSTEM') console.log(`${colors.SYSTEM}[SISTEMA]: ${data}${colors.DEFAULT}`);
        if (ev === 'VICTORY') console.log(`${colors.VICTORY}[VITORIA]: ${data}${colors.DEFAULT}`);
    }
};