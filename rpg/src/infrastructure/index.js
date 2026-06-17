import { BattleUseCase } from '../application/BattleUseCase.js';
import { GameEventEmitter, UIController } from './EventEmitter.js';

(async () => {
    const events = new GameEventEmitter();
    events.subscribe(UIController);

    const engine = new BattleUseCase(events);

    // Encontro 1: Combatente balanceado contra Criatura de Sangue
    await engine.executeBattle('COMBATENTE', 'William', 'MONSTRO', 'Zumbi de Sangue');
    
    console.log("\n----------------------------------------------------------------------\n");

    // Encontro 2: Cenário Letal / Hard Mode
    engine.setMode('hard');
    await engine.executeBattle('OCULTISTA', 'Cifra', 'BOSS', 'O Ente de Sangue');
})();