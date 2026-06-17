import { EntityFactory } from '../domain/EntityFactory.js';
import { DiceStrategy } from '../domain/DiceStrategy.js';

export class BattleUseCase {
    constructor(eventEmitter) {
        this.events = eventEmitter;
        this.dice = new DiceStrategy();
        this.atkSides = 20;
    }

    setMode(mode) {
        this.atkSides = mode === 'hard' ? 10 : 20;
        this.events.emit('SYSTEM', `Modo alterado para ${mode.toUpperCase()} (D${this.atkSides})`);
    }

    async executeBattle(p1Type, p1Name, p2Type, p2Name) {
        const attacker = EntityFactory.create(p1Type, p1Name);
        const target = EntityFactory.create(p2Type, p2Name);

        await this.events.emit('MSG', `⚔️ INÍCIO DA SIMULAÇÃO: ${attacker.name} VS ${target.name}\n`);
        
        let turn = 1;
        while (attacker.hp > 0 && target.hp > 0) {
            await this.resolveTurn(attacker, target, turn);
            if (target.hp <= 0) break;

            await this.resolveTurn(target, attacker, turn);
            turn++;
        }

        const winner = attacker.hp > 0 ? attacker : target;
        await this.events.emit('VICTORY', `🏆 ${winner.name} VENCEU O COMBATE NO TURNO ${turn}!`);
        return winner;
    }

    async resolveTurn(attacker, target, turnNumber) {
        const natural = this.dice.rollAttack(this.atkSides);
        const totalAtk = natural + attacker.getAtkBonus();
        let log = `[Turno ${turnNumber}] ${attacker.name} ataca (D${this.atkSides}: ${natural} + Bônus: ${attacker.getAtkBonus()} = ${totalAtk})`;

        if (totalAtk >= target.getDefense()) {
            let { total: dTotal, log: dLog } = this.dice.rollDice(attacker.dCount, attacker.dSides);
            let damageApplied = (natural === 20 && this.atkSides === 20) ? dTotal * 2 : dTotal;
            
            const oldHp = target.hp;
            target.takeDamage(damageApplied);

            log += ` | ACERTOU! Dano: ${dLog} (Total: ${damageApplied}) | ${target.name} HP: ${oldHp} -> ${target.hp}`;
        } else {
            log += ` | ERROU! (Defesa de ${target.name}: ${target.getDefense()})`;
        }

        await this.events.emit('MSG', log);
    }
}