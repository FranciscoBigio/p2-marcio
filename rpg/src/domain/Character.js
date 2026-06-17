export class Character {
    constructor(name, hp, atkBonus, dCount, dSides) {
        this.name = name;
        this.hp = hp;
        this.atkBonus = atkBonus;
        this.dCount = dCount;
        this.dSides = dSides;
        this.baseDefense = 12;
    }

    getDefense() { return this.baseDefense; }
    getAtkBonus() { return this.atkBonus; }
    getModifiers() { return []; }
    
    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
    }
}

// Decorator Base
export class CharacterModifier extends Character {
    constructor(character) {
        super(character.name, character.hp, character.atkBonus, character.dCount, character.dSides);
        this.character = character;
    }
    getDefense() { return this.character.getDefense(); }
    getAtkBonus() { return this.character.getAtkBonus(); }
    getModifiers() { return this.character.getModifiers(); }
    takeDamage(amount) { this.character.takeDamage(amount); }
    get hp() { return this.character.hp; }
    set hp(val) { this.character.hp = val; }
}

// Decorator Concreto A
export class ArmorDecorator extends CharacterModifier {
    getDefense() { return this.character.getDefense() + 4; }
    getModifiers() { 
        return [...this.character.getModifiers(), "🛡️ Armadura Pesada (+4 Defesa)"]; 
    }
}

// Decorator Concreto B
export class RitualDecorator extends CharacterModifier {
    getDefense() { return this.character.getDefense() - 2; }
    getAtkBonus() { return this.character.getAtkBonus() + 5; }
    getModifiers() { 
        return [...this.character.getModifiers(), "🔮 Ritual de Sangue (+5 Atk / -2 Def)"]; 
    }
}