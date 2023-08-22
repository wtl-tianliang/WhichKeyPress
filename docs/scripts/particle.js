// 获取dom
const container = document.querySelector('.top-level');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colors = ['#ccc', "#f0f0f0", "#873ff2", "#ddeeff", "#4da1d3"];
let w, h;
// 设置canvas宽高
setCanvasSize();
function setCanvasSize() {
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    w = width;
    h = height;
}
window.addEventListener('resize', setCanvasSize);
/**
 * 获取min（包含） - max（不包含）之间的随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns 
 */
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
/**
 * 获取两点距离
 * @param {object} a 第一个点的位置
 * @param {object} b 第二个点的位置
 * @returns
 */
function getDistance(a, b) {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return Math.hypot(x, y); // Math.sqrt(x * x + y * y);
}
// 构造函数
function Particle() { }
// 创建粒子函数
Particle.prototype.create = function () {
    // 粒子半径
    this.radius = getRandom(2.2, 4);
    // 粒子位置
    this.x = getRandom(0 + this.radius, w - this.radius);
    this.y = getRandom(0 + this.radius, h - this.radius);
    // 粒子运动速度
    this.speedX = getRandom(-1, 1);
    this.speedY = getRandom(-1, 1);
    // 粒子颜色
    this.color = colors[Math.floor(getRandom(0, colors.length))];
}
// 绘制粒子函数
Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
}
// 连线粒子函数
Particle.prototype.link = function () {
    for (const particle of particles) {
        const distance = getDistance(this, particle);
        if (distance < 150) {
            ctx.beginPath();
            ctx.lineWidth = 0.1;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
        }
    }
}
// 移动粒子函数
Particle.prototype.move = function () {
    // 碰撞边界后反弹
    if (this.x <= this.radius || this.x + this.radius >= w) {
        this.speedX *= -1;
    }
    if (this.y <= this.radius || this.y + this.radius >= h) {
        this.speedY *= -1;
    }
    this.x += this.speedX;
    this.y += this.speedY;
}
// 粒子数组
const particles = [];
for (let i = 0; i < 88; i++) {
    const particle = new Particle();
    particle.create();
    particles.push(particle);
}
// 动画
function raf() {
    function step() {
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        // 更新粒子
        for (const particle of particles) {
            particle.move();
            particle.draw();
            particle.link();
        }
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}
raf();