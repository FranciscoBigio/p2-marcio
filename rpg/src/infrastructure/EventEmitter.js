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
        const colors = { 
            SYSTEM: '\x1b[33m',         // Amarelo (Iniciativa e Rodadas)
            VICTORY: '\x1b[32m',        // Verde (Fim do combate)
            FICHA_PLAYER: '\x1b[36m',   // Ciano (Heróis)
            FICHA_MONSTER: '\x1b[35m',  // Magenta/Roxo (Monstros)
            ATK_DECLARATION: '\x1b[37m',// Branco (Anúncio do ataque)
            HIT_SUCCESS: '\x1b[92m',    // Verde Claro (Acerto normal)
            HIT_CRIT: '\x1b[1;31m',     // Vermelho Negrito (Crítico)
            HIT_MISS: '\x1b[91m',       // Vermelho Claro (Erro)
            HIT_MODIFIER: '\x1b[93m',   // Amarelo Claro (Vulnerabilidade/Resistência)
            HP_UPDATE: '\x1b[90m',      // Cinza Escuro (Barra de vida)
            DEFAULT: '\x1b[0m' 
        };

        if (colors[ev]) {
            console.log(`${colors[ev]}${data}${colors.DEFAULT}`);
        } else {
            console.log(data);
        }
    }
};