export class DiceStrategy {
    rollDice(count, sides) {
        let rolls = [];
        let total = 0;
        for (let i = 0; i < count; i++) {
            const die = Math.floor(Math.random() * sides) + 1;
            rolls.push(die);
            total += die;
        }
        return { total, log: `[${rolls.join('+')}]` };
    }

    rollAttack(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }
}