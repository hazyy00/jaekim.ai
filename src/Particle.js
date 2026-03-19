export const CURSOR_RADIUS = 12;
export const PARTICLE_DENSITY = 0.04;

export class Particle {
  constructor(x, y) {
    this.homeX = x;
    this.homeY = y;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = Math.random() + 1;
    this.opacity = Math.random() * 0.18 + 0.12;
  }

  update(mousePoints, radius) {
    const radiusSq = radius * radius;
    for (let j = 0; j < mousePoints.length; j++) {
      const dx = this.x - mousePoints[j].x;
      const dy = this.y - mousePoints[j].y;
      const distSq = dx * dx + dy * dy;

      if (distSq < radiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (radius - dist) / radius;
        this.vx += (dx / dist) * force * 3;
        this.vy += (dy / dist) * force * 3;
      }
    }

    this.vx *= 0.92;
    this.vy *= 0.92;

    this.vx += (this.homeX - this.x) * 0.01;
    this.vy += (this.homeY - this.y) * 0.01;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
