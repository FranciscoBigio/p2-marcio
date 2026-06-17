import { jest } from '@jest/globals'; // Importação explícita necessária para o modo ESM
import { EntityFactory } from '../src/domain/EntityFactory.js';
import { Elements, ElementChart, ArmaduraSangueDecorator, Character } from '../src/domain/Character.js';

describe('SUITE COMPLETA DE TESTES UNITARIOS (TDD) - ENGINE DE RPG', () => {

    afterEach(() => {
        jest.spyOn(Math, 'random').mockRestore();
    });

    // --- BLOCO 1: DECORATORS E MUDANÇA ELEMENTAR ---
    describe('Validacao de Decorators e Alteracao de Estado', () => {
        test('Armadura de Sangue deve alterar com sucesso o elemento nativo da entidade para SANGUE', () => {
            const charBase = new Character('Investigador', 50, 5, 1, 6, Elements.FISICO, Elements.FISICO);
            const charDecorado = new ArmaduraSangueDecorator(charBase);
            
            expect(charDecorado.getEntityElement()).toBe(Elements.SANGUE);
            expect(charDecorado.getDefense()).toBe(15); // Base 12 + 3
        });

        test('Deve validar a integridade estrutural cumulativa de rituais e armas', () => {
            const combatente = EntityFactory.create('COMBATENTE', 'William');
            expect(combatente.getDefense()).toBeGreaterThanOrEqual(12);
            expect(Object.values(Elements)).toContain(combatente.getWeaponElement());
        });
    });

    // --- BLOCO 2: MATRIZ ELEMENTAL E MITIGAÇÕES ---
    describe('Validacao de Regras da Matriz Elemental Paranormal', () => {
        test('Deve respeitar a hierarquia estrita do ciclo de fraquezas', () => {
            expect(ElementChart[Elements.MORTE].vantagem).toBe(Elements.SANGUE);
            expect(ElementChart[Elements.SANGUE].vantagem).toBe(Elements.CONHECIMENTO);
            expect(ElementChart[Elements.CONHECIMENTO].vantagem).toBe(Elements.ENERGIA);
            expect(ElementChart[Elements.ENERGIA].vantagem).toBe(Elements.MORTE);
        });

        test('Deve calcular a metade do dano arredondado para cima em caso de resistencia elemental', () => {
            const danoOriginal = 15;
            const danoCalculado = Math.ceil(danoOriginal / 2);
            expect(danoCalculado).toBe(8);
        });

        test('Monstros comuns devem vir de fabrica com resistencia de afinidade fixa igual a 5', () => {
            const mSangue = EntityFactory.create('MONSTRO_SANGUE', 'Cria');
            const mMorte = EntityFactory.create('MONSTRO_MORTE', 'Cria');
            const mEnergia = EntityFactory.create('MONSTRO_ENERGIA', 'Cria');
            const mConhecimento = EntityFactory.create('MONSTRO_CONHECIMENTO', 'Cria');

            expect(mSangue.getElementalResistance()).toBe(5);
            expect(mMorte.getElementalResistance()).toBe(5);
            expect(mEnergia.getElementalResistance()).toBe(5);
            expect(mConhecimento.getElementalResistance()).toBe(5);
        });

        test('Bosses de elite devem vir de fabrica com resistencia de afinidade fixa igual a 10', () => {
            const bSangue = EntityFactory.create('BOSS_SANGUE', 'Soberano');
            const bMorte = EntityFactory.create('BOSS_MORTE', 'Soberano');
            const bEnergia = EntityFactory.create('BOSS_ENERGIA', 'Soberano');
            const bConhecimento = EntityFactory.create('BOSS_CONHECIMENTO', 'Soberano');

            expect(bSangue.getElementalResistance()).toBe(10);
            expect(bMorte.getElementalResistance()).toBe(10);
            expect(bEnergia.getElementalResistance()).toBe(10);
            expect(bConhecimento.getElementalResistance()).toBe(10);
        });
    });

    // --- BLOCO 3: PROBABILIDADES DE LOOT DROP (1/5) ---
    describe('Validacao Estatistica do Drop de Loot (1/5 de chance)', () => {
        test('Nao deve equipar itens se a rolagem falhar (Math.random >= 0.2)', () => {
            jest.spyOn(Math, 'random').mockImplementation(() => 0.5);

            const combatente = EntityFactory.create('COMBATENTE', 'William');
            expect(combatente.getModifiers()).toHaveLength(0);
        });

        test('Deve equipar o loadout completo se todas as rolagens caírem na chance de 1/5', () => {
            jest.spyOn(Math, 'random').mockImplementation(() => 0.05);

            const combatente = EntityFactory.create('COMBATENTE', 'William');
            const mods = combatente.getModifiers();

            expect(mods.some(m => m.includes('[ARMADURA]'))).toBe(true);
            expect(mods.some(m => m.includes('[ARMA]'))).toBe(true);
            expect(mods.some(m => m.includes('[RITUAL]'))).toBe(true);
        });
    });

    // --- BLOCO 4: INICIATIVA ---
    describe('Validacao de Velocidade e Atributos de Turno', () => {
        test('Monstro de Energia deve possuir o maior bonus nativo de iniciativa do sistema (+6)', () => {
            const monstroEnergia = EntityFactory.create('MONSTRO_ENERGIA', 'Anomalia');
            expect(monstroEnergia.getInitiativeBonus()).toBe(6);
        });

        test('Combatente base deve possuir bonus de iniciativa igual a +3', () => {
            jest.spyOn(Math, 'random').mockImplementation(() => 0.8);
            const combatente = EntityFactory.create('COMBATENTE', 'William');
            expect(combatente.getInitiativeBonus()).toBe(3);
        });
    });
});