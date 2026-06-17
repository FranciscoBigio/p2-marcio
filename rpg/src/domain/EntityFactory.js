import { 
    Character, Elements,
    VestimentaLeveDecorator, ArmaduraSangueDecorator, MantoMorteDecorator, CouracaEnergiaDecorator, EscudoConhecimentoDecorator,
    FacaCombateDecorator, AcutorEnergiaDecorator, MachadoSangueDecorator, FoiceMorteDecorator, CetroConhecimentoDecorator,
    RitualSangueDecorator, RitualCeleridadeDecorator, RitualDecaimentoDecorator
} from './Character.js';

export class EntityFactory {
    static getRandomElement() {
        const allElements = Object.values(Elements);
        const randomIndex = Math.floor(Math.random() * allElements.length);
        return allElements[randomIndex];
    }

    static create(type, name) {
        const randomWeaponElement = this.getRandomElement();

        switch (type.toUpperCase()) {
            case 'COMBATENTE': {
                const baseCharacter = new Character(name, 50, 5, 1, 6, Elements.FISICO, randomWeaponElement, 0, 3);
                return this.applyRandomLoot(baseCharacter);
            }
            
            case 'OCULTISTA': {
                const baseCharacter = new Character(name, 40, 2, 1, 6, Elements.FISICO, randomWeaponElement, 0, 1);
                return this.applyRandomLoot(baseCharacter);
            }
            
            // --- OS 4 MONSTROS NORMAIS (RESISTENCIA FIXA = 5) ---
            case 'MONSTRO_SANGUE': 
                return new Character(name, 60, 4, 2, 10, Elements.SANGUE, Elements.SANGUE, 5, 2); 
            
            case 'MONSTRO_CONHECIMENTO': 
                return new Character(name, 55, 5, 2, 8, Elements.CONHECIMENTO, Elements.CONHECIMENTO, 5, 2); 
            
            case 'MONSTRO_MORTE':
                return new Character(name, 64, 3, 2, 10, Elements.MORTE, Elements.MORTE, 5, 0);
                
            case 'MONSTRO_ENERGIA':
                return new Character(name, 50, 6, 3, 6, Elements.ENERGIA, Elements.ENERGIA, 5, 6);
            
            // --- OS 4 CHEFES ELEMENTARES (RESISTENCIA FIXA = 10) ---
            case 'BOSS_SANGUE':
                return new Character(name, 120, 8, 2, 12, Elements.SANGUE, Elements.SANGUE, 10, 4);
                
            case 'BOSS_MORTE':
                return new Character(name, 130, 7, 3, 8, Elements.MORTE, Elements.MORTE, 10, 2);
                
            case 'BOSS_CONHECIMENTO':
                return new Character(name, 115, 9, 2, 10, Elements.CONHECIMENTO, Elements.CONHECIMENTO, 10, 5);
                
            case 'BOSS_ENERGIA':
                return new Character(name, 110, 10, 4, 6, Elements.ENERGIA, Elements.ENERGIA, 10, 7);
                
            default:
                return new Character(name, 25, 0, 1, 6, Elements.FISICO, Elements.FISICO, 0, 0);
        }
    }

    static applyRandomLoot(character) {
        let equippedCharacter = character;

        // 1/5 de chance (20%) para Armadura
        if (Math.random() < 0.2) {
            const armaduras = [VestimentaLeveDecorator, ArmaduraSangueDecorator, MantoMorteDecorator, CouracaEnergiaDecorator, EscudoConhecimentoDecorator];
            const RandomArmor = armaduras[Math.floor(Math.random() * armaduras.length)];
            equippedCharacter = new RandomArmor(equippedCharacter);
        }

        // 1/5 de chance (20%) para Arma
        if (Math.random() < 0.2) {
            const armas = [FacaCombateDecorator, AcutorEnergiaDecorator, MachadoSangueDecorator, FoiceMorteDecorator, CetroConhecimentoDecorator];
            const RandomWeapon = armas[Math.floor(Math.random() * armas.length)];
            equippedCharacter = new RandomWeapon(equippedCharacter);
        }

        // 1/5 de chance (20%) para Ritual
        if (Math.random() < 0.2) {
            const rituais = [RitualSangueDecorator, RitualCeleridadeDecorator, RitualDecaimentoDecorator];
            const RandomRitual = rituais[Math.floor(Math.random() * rituais.length)];
            equippedCharacter = new RandomRitual(equippedCharacter);
        }

        return equippedCharacter;
    }
}