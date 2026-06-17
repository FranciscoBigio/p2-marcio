import { EntityFactory } from '../domain/EntityFactory.js';
import { DiceStrategy } from '../domain/DiceStrategy.js';
import { ElementChart } from '../domain/Character.js';

export class BattleUseCase {
    constructor(eventEmitter) {
        this.events = eventEmitter;
        this.dice = new DiceStrategy();
        this.atkSides = 20;
    }

    async displayFicha(c, isMonster) {
        const mods = c.getModifiers();
        const modsDisplay = mods.length > 0 ? mods.map(m => `|  ${m}`).join('\n') : "|  Nenhum";
        
        const info = `
+-------------------------------------------------------+
| FICHA TECNICA: ${c.name.toUpperCase()}
+-------------------------------------------------------+
| HP: ${c.hp} | Defesa: ${c.getDefense()} | Elemento Nativo: ${c.getEntityElement()}
| Iniciativa: +${c.getInitiativeBonus()} | Resist. Elemental Fixa: ${c.getElementalResistance()}
| Ataque: D${this.atkSides} + ${c.getAtkBonus()} | Tipo de Arma: [${c.getWeaponElement()}]
| Dano Base: ${c.getDCount()}d${c.getDSides()}
+-------------------------------------------------------+
| MODIFICADORES ATIVOS:
${modsDisplay}
+-------------------------------------------------------+`;

        const eventType = isMonster ? 'FICHA_MONSTER' : 'FICHA_PLAYER';
        await this.events.emit(eventType, info);
    }

    async executeBattle(p1Type, p1Name, p2Type, p2Name) {
        const c1 = EntityFactory.create(p1Type, p1Name);
        const c2 = EntityFactory.create(p2Type, p2Name);

        const isC1Monster = p1Type.toUpperCase().includes('MONSTRO') || p1Type.toUpperCase() === 'BOSS';
        const isC2Monster = p2Type.toUpperCase().includes('MONSTRO') || p2Type.toUpperCase() === 'BOSS';

        await this.displayFicha(c1, isC1Monster);
        await this.displayFicha(c2, isC2Monster);

        const roll1 = this.dice.rollAttack(20);
        const totalInit1 = roll1 + c1.getInitiativeBonus();
        const roll2 = this.dice.rollAttack(20);
        const totalInit2 = roll2 + c2.getInitiativeBonus();

        await this.events.emit('SYSTEM', '\n================ ROLAGEM DE INICIATIVA ================');
        await this.events.emit('SYSTEM', ` -> ${c1.name}: D20(${roll1}) + Bonus(${c1.getInitiativeBonus()}) = Total: ${totalInit1}`);
        await this.events.emit('SYSTEM', ` -> ${c2.name}: D20(${roll2}) + Bonus(${c2.getInitiativeBonus()}) = Total: ${totalInit2}`);
        
        let turnOrder = totalInit1 >= totalInit2 ? [c1, c2] : [c2, c1];

        const startMsg = `
+=======================================================+
| INICIO DO CONFRONTO: ${turnOrder[0].name.toUpperCase()} VS ${turnOrder[1].name.toUpperCase()}
| ${turnOrder[0].name} assumiu a vanguarda do combate.
+=======================================================+`;
        await this.events.emit('SYSTEM', startMsg);
        
        let turn = 1;
        while (turnOrder[0].hp > 0 && turnOrder[1].hp > 0) {
            await this.events.emit('SYSTEM', `\n----------------------- RODADA ${turn} -----------------------`);

            await this.resolveTurn(turnOrder[0], turnOrder[1]);
            console.log(""); 
            if (turnOrder[1].hp <= 0) break;

            await this.resolveTurn(turnOrder[1], turnOrder[0]);
            console.log(""); 
            turn++;
        }

        const winner = turnOrder[0].hp > 0 ? turnOrder[0] : turnOrder[1];
        const loser = turnOrder[0].hp > 0 ? turnOrder[1] : turnOrder[0];

        const victoryMsg = `
+=======================================================+
| COMBATE ENCERRADO NO TURNO ${turn}
| ${winner.name.toUpperCase()} DERROTOU ${loser.name.toUpperCase()}!
+=======================================================+`;
        await this.events.emit('VICTORY', victoryMsg);
        return winner;
    }

    async resolveTurn(attacker, target) {
        const natural = this.dice.rollAttack(this.atkSides);
        const totalAtk = natural + attacker.getAtkBonus();
        
        await this.events.emit('ATK_DECLARATION', `* ${attacker.name} desfere ataque contra ${target.name}...`);
        await this.events.emit('ATK_DECLARATION', `  Precisao: D20(${natural}) + Bonus(${attacker.getAtkBonus()}) = Total: ${totalAtk}`);

        if (totalAtk >= target.getDefense()) {
            let { total: dTotal, log: dLog } = this.dice.rollDice(attacker.getDCount(), attacker.getDSides());
            let damageApplied = dTotal;

            const elementoFracoDoAlvo = ElementChart[attacker.getWeaponElement()]?.vantagem;
            const temVantagemElemental = elementoFracoDoAlvo === target.getEntityElement();
            const elementoForteDoAlvo = ElementChart[target.getEntityElement()]?.vantagem;
            const temResistenciaElemental = elementoForteDoAlvo === attacker.getWeaponElement();
            const mesmoElementoOriginal = attacker.getWeaponElement() === target.getEntityElement();

            if (natural === 20) {
                damageApplied = dTotal * 2;
                await this.events.emit('HIT_CRIT', `  [SUCESSO CRITICO] Impacto severo! (${dLog} = ${dTotal} x2 = ${damageApplied})`);
            } else {
                await this.events.emit('HIT_SUCCESS', `  [SUCESSO] O ataque conecta! (Dados: ${dLog} = ${damageApplied})`);
            }

            if (temVantagemElemental) {
                damageApplied = damageApplied * 2;
                await this.events.emit('HIT_MODIFIER', `  [VULNERABILIDADE] ${attacker.getWeaponElement()} e altamente eficaz contra ${target.getEntityElement()}! Dano dobrado para: ${damageApplied}`);
            } else if (temResistenciaElemental) {
                damageApplied = Math.ceil(damageApplied / 2);
                await this.events.emit('HIT_MODIFIER', `  [RESISTENCIA] ${target.getEntityElement()} bloqueia parcialmente a energia de ${attacker.getWeaponElement()}! Dano reduzido para: ${damageApplied}`);
            } else if (mesmoElementoOriginal && target.getElementalResistance() > 0) {
                const reducao = target.getElementalResistance();
                damageApplied = Math.max(0, damageApplied - reducao);
                await this.events.emit('HIT_MODIFIER', `  [AFINIDADE] Estruturas identicas de ${target.getEntityElement()}! Dano mitigado em -${reducao}. Total: ${damageApplied}`);
            }

            const oldHp = target.hp;
            target.takeDamage(damageApplied);
            await this.events.emit('HP_UPDATE', `  [INTEGRIDADE] ${target.name} HP: ${oldHp} -> ${target.hp}`);
        } else {
            await this.events.emit('HIT_MISS', `  [FALHA] O ataque errou a defesa de ${target.name} (Defesa alvo: ${target.getDefense()})`);
        }
    }
}