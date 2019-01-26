class Enemy extends Actor {

    public speed: Vector2D = new Vector2D(0, 0);
    public health: number;

    public type: string;
    public wobble: number = Math.PI/2;
    public direction: number;

    public shootCoolDown: number = 5;
	public lastShoot: number = this.shootCoolDown;

	constructor(pos: Vector2D, size: Vector2D, sprites: string, type: string, direction?: number) {
        super(pos, size, sprites);
        this.type = type;
        this.direction = direction || 1;

        if (this.type === "mobTrash") {
            this.health = 3;
        }
        else if (this.type === "mobZigzag") {
            this.health = 5;
        }
        else if (this.type === "mobTank") {
            this.health = 15;
        }
        else if (this.type === "mobDistance") {
            this.health = 5;
        }
        else if (this.type === "mobBoss") {
            this.health = 200;
        }
    }

    public shoot = (step: number, level: Level): void => {
		if (this.lastShoot < this.shootCoolDown) {
			this.lastShoot++;
		}
		else if (this.lastShoot >= this.shootCoolDown) {
			level.actors.push(new Bullet(new Vector2D((this.pos.x + this.size.x / 2 ) - 0.1 , this.pos.y + this.size.y), new Vector2D(0.25, 0.25), "bullet", "player"));
			this.lastShoot = 0;
		}
	}
    
    public act = (step: number, level: Level, keys:Map<string, boolean>): void => {

        if (this.type === "mobTrash") {
            this.pos.y += 0.06;
            this.pos.x += 0.0125 * this.direction;
            this.shoot(step, level);
        }
        else if (this.type === "mobZigzag") {
            this.pos.y += 0.05;

            let wobbleFreq = 0.04;
            let wobbleAmp = 0.1;
            this.wobble += wobbleFreq;
            let wobblePosX = Math.sin(this.wobble) * wobbleAmp;
            this.pos.x += wobblePosX;
        }
        else if (this.type === "mobTank") {
            this.pos.y += 0.06;
            this.pos.x += 0.0125 * this.direction;
        }
        else if (this.type === "mobDistance") {
            this.pos.y += 0.06;
            this.pos.x += 0.0125 * this.direction;
        }
        else if (this.type === "mobBoss") {

        }

        let obstacle: Actor = level.actorAt(this);
        if (obstacle && obstacle instanceof Bullet && obstacle.target === "enemy") {
            if (obstacle.action === null) {
                this.health--;
                obstacle.action = "touched";
                console.log("health", this.health);
            }
        }

        if (this.health === 0) {
            for(let i = 0; i < level.actors.length; i++){
                if(level.actors[i] instanceof Enemy && this.pos.equals(level.actors[i].pos)) {
                    console.log("died");
                    
                    level.actors.splice(i);
                }
            }
            let p =  level.actors[0];
		    if (p instanceof Player) {
                p.score += 100;
                this.health = null;
		    }
        }
    }


}