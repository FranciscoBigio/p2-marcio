export const Elements = {
    MORTE: 'MORTE',
    SANGUE: 'SANGUE',
    CONHECIMENTO: 'CONHECIMENTO',
    ENERGIA: 'ENERGIA',
    FISICO: 'FISICO'
};

export const ElementChart = {
    [Elements.MORTE]: { vantagem: Elements.SANGUE },
    [Elements.SANGUE]: { vantagem: Elements.CONHECIMENTO },
    [Elements.CONHECIMENTO]: { vantagem: Elements.ENERGIA },
    [Elements.ENERGIA]: { vantagem: Elements.MORTE },
    [Elements.FISICO]: { vantagem: null }
};

export class Character {
    constructor(name, hp, atkBonus, dCount, dSides, entityElement = Elements.FISICO, weaponElement = Elements.FISICO, elementalResistance = 0, initiativeBonus = 0) {
        this.name = name;
        this.hp = hp; 
        this.atkBonus = atkBonus;
        this.dCount = dCount;
        this.dSides = dSides;
        this.baseDefense = 12;
        this.entityElement = entityElement; 
        this.weaponElement = weaponElement; 
        this.elementalResistance = elementalResistance;
        this.initiativeBonus = initiativeBonus;
    }

    getDefense() { return this.baseDefense; }
    getAtkBonus() { return this.atkBonus; }
    getDCount() { return this.dCount; }
    getDSides() { return this.dSides; }
    getEntityElement() { return this.entityElement; }
    getWeaponElement() { return this.weaponElement; }
    getElementalResistance() { return this.elementalResistance; }
    getInitiativeBonus() { return this.initiativeBonus; }
    getModifiers() { return []; }
    
    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
    }
}

// Decorator Base - Encaminha chamadas de métodos diretamente ao objeto envelopado
export class CharacterModifier extends Character {
    constructor(character) {
        super(
            character.name, character.hp, character.getAtkBonus(), character.getDCount(), character.getDSides(),
            character.getEntityElement(), character.getWeaponElement(), character.getElementalResistance(), character.getInitiativeBonus()
        );
        this.character = character;
    }
    
    getDefense() { return this.character.getDefense(); }
    getAtkBonus() { return this.character.getAtkBonus(); }
    getDCount() { return this.character.getDCount(); }
    getDSides() { return this.character.getDSides(); }
    getEntityElement() { return this.character.getEntityElement(); }
    getWeaponElement() { return this.character.getWeaponElement(); }
    getElementalResistance() { return this.character.getElementalResistance(); }
    getInitiativeBonus() { return this.character.getInitiativeBonus(); }
    getModifiers() { return this.character.getModifiers(); }
    takeDamage(amount) { this.character.takeDamage(amount); }
    
    // O HP continua como propriedade tratada com guard por ser mutável diretamente em jogo
    get hp() { return this.character ? this.character.hp : this._temporaryHp; }
    set hp(val) { 
        if (this.character) this.character.hp = val; 
        else this._temporaryHp = val;
    }
}

// ==========================================
// SEÇÃO DE ARMADURAS
// ==========================================
export class VestimentaLeveDecorator extends CharacterModifier {
    getDefense() { return this.character.getDefense() + 2; }
    getInitiativeBonus() { return this.character.getInitiativeBonus() + 2; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMADURA] Vestimenta Leve (+2 Defesa, +2 Iniciativa)"]; }
}

export class ArmaduraSangueDecorator extends CharacterModifier {
    getDefense() { return this.character.getDefense() + 3; }
    getEntityElement() { return Elements.SANGUE; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMADURA] Armadura de Sangue (+3 Defesa, Elemento -> SANGUE)"]; }
}

export class MantoMorteDecorator extends CharacterModifier {
    getDefense() { return this.character.getDefense() + 4; }
    getEntityElement() { return Elements.MORTE; }
    getInitiativeBonus() { return this.character.getInitiativeBonus() - 1; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMADURA] Manto da Morte (+4 Defesa, Elemento -> MORTE, -1 Iniciativa)"]; }
}

export class CouracaEnergiaDecorator extends CharacterModifier {
    getDefense() { return this.character.getDefense() + 5; }
    getEntityElement() { return Elements.ENERGIA; }
    getAtkBonus() { return this.character.getAtkBonus() - 2; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMADURA] Couraca de Energia (+5 Defesa, Elemento -> ENERGIA, -2 Ataque)"]; }
}

export class EscudoConhecimentoDecorator extends CharacterModifier {
    getDefense() { return this.character.getDefense() + 4; }
    getEntityElement() { return Elements.CONHECIMENTO; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMADURA] Escudo de Conhecimento (+4 Defesa, Elemento -> CONHECIMENTO)"]; }
}

// ==========================================
// SEÇÃO DE ARMAS
// ==========================================
export class FacaCombateDecorator extends CharacterModifier {
    getWeaponElement() { return Elements.FISICO; }
    getDCount() { return 1; }
    getDSides() { return 6; }
    getInitiativeBonus() { return this.character.getInitiativeBonus() + 2; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMA] Faca de Combate (Dano: 1d6 FISICO, +2 Iniciativa)"]; }
}

export class AcutorEnergiaDecorator extends CharacterModifier {
    getWeaponElement() { return Elements.ENERGIA; }
    getDCount() { return 2; }
    getDSides() { return 6; }
    getAtkBonus() { return this.character.getAtkBonus() + 2; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMA] Acutor de Energia (Dano: 2d6 ENERGIA, +2 Ataque)"]; }
}

export class MachadoSangueDecorator extends CharacterModifier {
    getWeaponElement() { return Elements.SANGUE; }
    getDCount() { return 2; }
    getDSides() { return 12; }
    getDefense() { return this.character.getDefense() - 2; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMA] Machado de Sangue (Dano: 2d12 SANGUE, -2 Defesa)"]; }
}

export class FoiceMorteDecorator extends CharacterModifier {
    getWeaponElement() { return Elements.MORTE; }
    getDCount() { return 3; }
    getDSides() { return 6; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMA] Foice da Morte (Dano: 3d6 MORTE)"]; }
}

export class CetroConhecimentoDecorator extends CharacterModifier {
    getWeaponElement() { return Elements.CONHECIMENTO; }
    getDCount() { return 1; }
    getDSides() { return 8; }
    getAtkBonus() { return this.character.getAtkBonus() + 3; }
    getModifiers() { return [...this.character.getModifiers(), "[ARMA] Cetro de Conhecimento (Dano: 1d8 CONHECIMENTO, +3 Ataque)"]; }
}

// ==========================================
// SEÇÃO DE RITUAIS
// ==========================================
export class RitualSangueDecorator extends CharacterModifier {
    getDefense() { return this.character.getDefense() - 2; }
    getAtkBonus() { return this.character.getAtkBonus() + 5; }
    getModifiers() { return [...this.character.getModifiers(), "[RITUAL] Ritual de Sangue (+5 Atk / -2 Def)"]; }
}

export class RitualCeleridadeDecorator extends CharacterModifier {
    getInitiativeBonus() { return this.character.getInitiativeBonus() + 5; }
    getAtkBonus() { return this.character.getAtkBonus() + 2; }
    getModifiers() { return [...this.character.getModifiers(), "[RITUAL] Ritual de Celeridade (+5 Iniciativa / +2 Atk)"]; }
}

export class RitualDecaimentoDecorator extends CharacterModifier {
    getDCount() { return this.character.getDCount() + 1; }
    getDefense() { return this.character.getDefense() - 1; }
    getModifiers() { return [...this.character.getModifiers(), "[RITUAL] Ritual de Decaimento (+1 Dado de Dano / -1 Def)"]; }
}