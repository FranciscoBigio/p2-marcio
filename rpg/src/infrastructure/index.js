import { BattleUseCase } from '../application/BattleUseCase.js';
import { GameEventEmitter, UIController } from './EventEmitter.js';

(async () => {
    const events = new GameEventEmitter();
    events.subscribe(UIController);

    const engine = new BattleUseCase(events);

    await events.emit('SYSTEM', '[SISTEMA] Inicializando gerador tatico de encontros com tabelas de 1/4 de chance...');

    // ==========================================
    // PRIMEIRO COMBATE: TABELA DE MONSTROS NORMAIS (1/4 de chance para cada)
    // ==========================================
    const normalPool = ['MONSTRO_SANGUE', 'MONSTRO_CONHECIMENTO', 'MONSTRO_MORTE', 'MONSTRO_ENERGIA'];
    const normalRolled = normalPool[Math.floor(Math.random() * 4)];

    const nomesNormais = { 
        'MONSTRO_SANGUE': 'Zumbi de Sangue', 
        'MONSTRO_CONHECIMENTO': 'Scriba do Conhecimento',
        'MONSTRO_MORTE': 'Existencia de Morte',
        'MONSTRO_ENERGIA': 'Anomalia de Energia'
    };

    await events.emit('SYSTEM', '\n[SISTEMA] Efetuando rolagem de ameaca para o Primeiro Encontro (Chances: 1/4)...');
    await engine.executeBattle('COMBATENTE', 'William', normalRolled, nomesNormais[normalRolled]);
    
    console.log("\n" + "=".repeat(70) + "\n");

    // ==========================================
    // SEGUNDO COMBATE: TABELA DE BOSSES (1/4 de chance para cada)
    // ==========================================
    const bossPool = ['BOSS_SANGUE', 'BOSS_MORTE', 'BOSS_CONHECIMENTO', 'BOSS_ENERGIA'];
    const bossRolled = bossPool[Math.floor(Math.random() * 4)];

    const nomesBosses = {
        'BOSS_SANGUE': 'O Ente de Sangue',
        'BOSS_MORTE': 'O Ceifador de Morte',
        'BOSS_CONHECIMENTO': 'O Magistrado de Conhecimento',
        'BOSS_ENERGIA': 'O Estrangeiro de Energia'
    };

    await events.emit('SYSTEM', '[SISTEMA] Efetuando rolagem de ameaca para o Segundo Encontro (Chances: 1/4)...');
    await engine.executeBattle('OCULTISTA', 'Cifra', bossRolled, nomesBosses[bossRolled]);
})();