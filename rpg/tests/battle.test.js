import { EntityFactory } from '../src/domain/EntityFactory.js';
import { DiceStrategy } from '../src/domain/DiceStrategy.js';

describe('Suíte de Testes de Unidade das Mecânicas de RPG (TDD)', () => {

    test('Deve validar a criação do Combatente com o Decorator de Armadura (+4 Defesa)', () => {
        const combatente = EntityFactory.create('COMBATENTE', 'William');
        // Base 12 + 4 da Armadura = 16
        expect(combatente.getDefense()).toBe(16);
        expect(combatente.getModifiers()).toContain("🛡️ Armadura Pesada (+4 Defesa)");
    });

    test('Deve validar a criação do Ocultista com penalidades e bônus do Ritual de Sangue', () => {
        const ocultista = EntityFactory.create('OCULTISTA', 'Cifra');
        // Base 2 + 5 do ritual = 7
        expect(ocultista.getAtkBonus()).toBe(7);
        // Base 12 - 2 do ritual = 10
        expect(ocultista.getDefense()).toBe(10);
    });

    test('A estratégia de dados deve respeitar os limites operacionais estocásticos', () => {
        const dice = new DiceStrategy();
        const { total } = dice.rollDice(2, 8); // 2d8
        
        expect(total).toBeGreaterThanOrEqual(2);
        expect(total).toBeLessThanOrEqual(16);
    });

    test('Danos sofridos devem diminuir o HP de forma controlada sem estourar limites abaixo de zero', () => {
        const monstro = EntityFactory.create('MONSTRO', 'Zumbi de Sangue');
        monstro.takeDamage(40);
        expect(monstro.hp).toBe(20);

        monstro.takeDamage(50); // Dano massivo acima do restante
        expect(monstro.hp).toBe(0); // Tratamento de borda implementado
    });
});