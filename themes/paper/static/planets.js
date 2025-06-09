class Random {
    /**
    * @param {number} min
    * @param {number} max
    * @returns {number}
    */
    static range(min, max) {
        return min + (max - min) * Math.random();
    }

    /**
    * @returns {number}
    */
    static next() {
        return Math.random();
    }

    /**
    * @returns {number}
    */
    static angleRad() {
        return Math.random() * Math.PI * 2;
    }
}

class Vec2 {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
    * @param {number} rads
    * @returns {Vec2}
    */
    static fromAngle(rads) {
        return new Vec2(Math.cos(rads), Math.sin(rads));
    }

    /**
     * @param {Vec2 | [number,number] | {x:number,y:number}} value
     * @returns {Vec2}
     */
    static from(value) {
        if (value instanceof Vec2) {
            return new Vec2(value.x, value.y);
        }
        if (Array.isArray(value)) {
            return new Vec2(value[0], value[1]);
        }
        if ('x' in value && 'y' in value) {
            return new Vec2(value.x, value.y);
        }
        throw new Error(`Unable to construct Vec2 from given value: ${value}`);
    }

    /**
     * @returns {Vec2}
     */
    static zero = new Vec2(0, 0);

    /**
     * @param {Vec2} rhs
     * @returns {Vec2}
     */
    add(rhs) {
        return new Vec2(this.x + rhs.x, this.y + rhs.y);
    }

    /**
     * @param {Vec2} rhs
     * @returns {Vec2}
     */
    sub(rhs) {
        return new Vec2(this.x - rhs.x, this.y - rhs.y);
    }

    /**
     * @param {number} rhs
     * @returns {Vec2}
     */
    mul(rhs) {
        return new Vec2(this.x * rhs, this.y * rhs);
    }

    /**
     * @param {number} rhs
     * @returns {Vec2}
     */
    div(rhs) {
        return this.mul(this.x / rhs, this.y / rhs);
    }

    /**
     * @param {Vec2} rhs
     * @returns {number}
     */
    dot(rhs) {
        return this.x * rhs.x + this.y * rhs.y;
    }

    /**
     * @returns {number}
     */
    magSqr() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * @returns {number}
     */
    mag() {
        return Math.sqrt(this.magSqr());
    }

    /**
     * @returns {Vec2}
     */
    normalized() {
        const mag = this.mag();
        return new Vec2(this.x / mag, this.y / mag);
    }

    /**
     * @returns {boolean}
     */
    get isZero() {
        return this.x === 0 && this.y === 0;
    }

    /**
     * @returns {boolean}
     */
    get isNaN() {
        return Number.isNaN(this.x) || Number.isNaN(this.y);
    }
}

class GravitySim {
    /** @type {Body[]} */
    bodies = [];

    /** @type {number} */
    fixedUpdateDt = 0;

    constructor() {}

    /**
     * @param {Body} body
     */
    addBody(body) {
        this.bodies.push(body);

        if (this.bodies.length > 2048)
            this.bodies.length = 2048;
    }

    /**
     * @param {number} dt
     */
    fixedUpdate(dt) {
        this.fixedUpdateDt = dt;

        for (const body of this.bodies) {
            if (!body.active)
                continue;
            body.beforeFixedUpdate(this);
        }
        for (const body of this.bodies) {
            if (!body.active)
                continue;
            body.fixedUpdate(this);
        }
    }

    /**
     * @param {number} dt
     */
    update(dt) {
        for (const body of this.bodies) {
            if (!body.active)
                continue;
            body.update(dt);
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (const body of this.bodies) {
            if (!body.active)
                continue;
            if ('draw' in body)
                body.draw(ctx);
        }
    }
}

class Body {
    /**
     * @param {Vec2} pos
     */
    constructor(pos) {
        this.pos = pos;
        this.vel = Vec2.zero;
        this.accel = Vec2.zero;
        this.active = true;
    }

    /**
     * @param {number} dt
     */
    update(dt) {
        if (!this.accel.isZero) {
            this.vel = this.vel.add(this.accel.mul(dt));
        }
        if (!this.vel.isZero) {
            this.pos = this.pos.add(this.vel.mul(dt));
        }
    }

    beforeFixedUpdate() {}
    fixedUpdate() {}
}

class Planet extends Body {
    trail = new Trail(32);

    /**
     * @param {Vec2} pos
     * @param {number} radius
     * @param {number} mass
     */
    constructor(pos, radius, mass) {
        super(pos);
        this.radius = radius;
        this.mass = mass;
        this.density = mass / Math.pow(radius, 3);
    }

    updateMass(newMass) {
        this.mass = newMass;
        this.radius = Math.pow(newMass / this.density, 1/3);
    }

    /**
     * @param {number} _dt
     */
    beforeFixedUpdate() {
        this.accel = Vec2.zero;
    }

    /**
    * @param {GravitySim} sim
    * @param {Planet} onto
    */
    collided(sim, onto) {
        // todo: not implemented
    }

    /**
     * @param {GravitySim} sim
     */
    fixedUpdate(sim) {
        // F = G * m1 * m2 / r^2
        // a = F / m = G * m2 / r^2
        const G = 0.00672;

        for (const body of sim.bodies) {
            if (body === this || !body.active)
                continue;

            const radSum = (body.radius || 0) + this.radius;
            const radSumSqr = radSum * radSum;
            const direction = this.pos.sub(body.pos);

            let distSqr = direction.magSqr();
            if (distSqr < radSumSqr) {
                if (body instanceof Planet) {
                    body.collided(sim, this);
                }

                continue;
            }

            if (distSqr == 0)
                continue;

            const accel = (G * this.mass) / distSqr;

            body.accel = body.accel.add(direction.normalized().mul(accel));
        }
    }


    update(dt) {
        super.update(dt);

        this.trail.pos = this.pos.add(this.vel.normalized().mul(-this.radius));
        this.trail.update(dt);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        this.trail.draw(ctx);

        ctx.save();

        ctx.strokeStyle = '#8f839c';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;

        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.radius, this.radius, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }
}

class BlackHole extends Planet {
    animationTime = 0;

    update(dt) {
        super.update(dt);
        this.animationTime += dt;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        this.trail.draw(ctx);

        ctx.save();

        const skew1 = Math.sin(this.animationTime * 0.7);
        const skew2 = Math.cos(this.animationTime * 0.9);
        const rot = this.animationTime / 4;

        ctx.fillStyle = 'rgb(240, 197, 150)';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.radius + 4 + skew1, this.radius + 4 - skew1, rot, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.radius + 2 + skew2/2, this.radius + 2 + skew2/2, -rot, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.radius, this.radius, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /**
    * @param {GravitySim} sim
    * @param {Planet} onto
    */
    collided(sim, onto) {
        const rate = 2000;
        const massConsumed = sim.fixedUpdateDt * rate;

        onto.updateMass(onto.mass - massConsumed);
        this.updateMass(this.mass + massConsumed);

        if (onto.mass <= 0 || onto.radius <= 0)
            onto.active = false;
    }
}

class Trail {
    constructor(capacity) {
        this.capacity = capacity;
        this.length = 0;
        this.first = 0;
        this.points = new Array(capacity * 2);
        this.pos = Vec2.zero;
        this.spawnSleep = 0;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.save();

        ctx.strokeStyle = '#8f839c';
        ctx.globalAlpha = 0.1;

        ctx.beginPath();

        ctx.moveTo(this.pos.x, this.pos.y);

        for (let i = this.length-1; i >= 0; i--) {
            const j = ((i + this.first) * 2) % this.points.length;

            ctx.lineTo(this.points[j], this.points[j + 1]);
        }

        ctx.stroke();


        ctx.restore();
    }

    /**
     * @param {number} dt
     */
    update(dt) {
        this.spawnSleep -= dt;

        if (this.spawnSleep < 0) {
            this.push(this.pos);
            this.spawnSleep = 1/20;
        }
    }

    push(point) {
        const xIndex = ((this.first + this.length) * 2) % this.points.length;

        if (this.length < this.capacity) {
            this.length++;
        } else {
            this.first = (this.first + 1) % this.capacity;
        }

        this.points[xIndex] = point.x;
        this.points[xIndex + 1] = point.y;
    }

    popFirst(n) {
        this.first = (this.first + n) % this.capacity;
        this.length = Math.max(0, this.length - n);
    }

    popLast(n) {
        this.length = Math.max(0, this.length - n);
    }
}


/////////////////


function initSim() {
    const sim = new GravitySim();
    const planetCount = Random.range(16, 64);

    // https://www.desmos.com/calculator/q1fhmrghsa
    const dist = (x) => 3 + Math.pow(x / 32, 2);

    const newVecWithinScreen = () => new Vec2(Random.range(50, document.body.scrollWidth - 50), Random.range(50, document.body.scrollHeight - 50));

    for (let i = 0; i < planetCount; i++) {
        const radius = dist(Random.range(0, 250));
        const mass = Math.pow(radius, 3) * 15;
        const pos = newVecWithinScreen();
        const planet = new Planet(pos, radius, mass);
        planet.vel = Vec2.fromAngle(Random.angleRad()).mul(Random.range(0, 10));
        sim.addBody(planet);
    }

    const spawnBlackHole = location.hostname === 'localhost' || Random.next() > 0.7;
    if (spawnBlackHole) {
        sim.addBody(new BlackHole(newVecWithinScreen(), Random.range(15, 30), 99900000));
    }

    return sim;
}

function initSurface() {
    const canvas = document.body.appendChild(document.createElement('canvas'));
    canvas.setAttribute('style', `position: absolute; left: 0; top: 0; z-index: -1`);
    canvas.width = document.body.scrollWidth;
    canvas.height = document.body.scrollHeight;
    window.addEventListener('resize', () => {
        canvas.width = document.body.scrollWidth;
        canvas.height = document.body.scrollHeight;
    });

    const ctx = canvas.getContext('2d');
    return ctx;
}

function startPlanetSim() {
    const ctx = initSurface();
    if (!ctx) {
        throw new Error('NULL canvas surface');
    }

    const sim = initSim();

    const fixedDelta = 1 / 15;
    const fixedTimer = setInterval(() => {
        sim.fixedUpdate(fixedDelta);
    }, fixedDelta);

    let stopped = false;
    let lastRender = 0;
    function renderLoop(time) {
        if (stopped) return;
        if (lastRender) {
            const dt = (time - lastRender) / 1000;
            sim.update(dt);
            sim.draw(ctx);
        }
        lastRender = time;
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);

    function stop() {
        stopped = true;
        clearInterval(fixedTimer);
        ctx.canvas.remove();
    }

    return { stop, sim };
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.PlanetSimControls = startPlanetSim();
}
