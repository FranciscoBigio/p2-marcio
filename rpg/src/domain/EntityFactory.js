import { Character, ArmorDecorator, RitualDecorator } from './Character.js';

export class EntityFactory {
    static create(type, name) {
        switch (type.toUpperCase()) {
            case 'COMBATENTE': 
                return new ArmorDecorator(new Character(name, 50, 5, 2, 8)); 
            case 'OCULTISTA': 
                return new RitualDecorator(new Character(name, 40, 2, 2, 8)); 
            case 'MONSTRO': 
                return new Character(name, 60, 4, 2, 10); 
            case 'BOSS': 
                const boss = new Character(name, 120, 8, 2, 10); 
                return new ArmorDecorator(new RitualDecorator(boss));
            default:
                return new Character(name, 25, 0, 1, 6);
        }
    }
}