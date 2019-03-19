/**
 * @Author zhanghaochen
 * @Date 2018-12-28
 */
import Barrier from "./Barrier";
import Ball from "./Ball";
import callFunc = cc.callFunc;

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainController extends cc.Component {

    @property([cc.Prefab])
    prefabBarriers: cc.Prefab[] = [];

    @property(cc.Prefab)
    prefabBall: cc.Prefab = null;

    // 障碍物们
    barriers: Barrier[] = [];
    // 弹球们
    @property([Ball])
    balls: Ball[] = [];

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    labelStr: String = "得分：";

    totalScore: number = 0;

    /**
     * 记录回到正上方的球的数量
     * @type {number}
     */
    goalBallsCount: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addBarriers();

        this.scoreLabel.string = this.labelStr + this.totalScore.toString();

        // 初始化点击函数
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchListener, this);
    }

    // start() {}

    // update (dt) {}

    touchListener(action: cc.Event.EventTouch) {
        // 将点击转换成世界坐标
        let touchPos = this.node.convertToNodeSpaceAR(action.getLocation());
        console.log(JSON.stringify(touchPos));

        // 方向向量，从点击的点，到初始点之间
        this.shootBalls(touchPos.sub(cc.v2(0, 457)));
        // 移除点击事件，让他不能重复触发
        // this.node.targetOff(this);
    }

    /**
     * 发射小球
     * @param {Ball} ball
     * @param {cc.Vec2} dir
     */
    shootBall(ball: Ball, dir: cc.Vec2) {
        // 关闭刚体组件
        ball.rigidBody.active = false;

        let movePath: cc.Vec2[] = [];
        movePath.push(ball.node.position);
        movePath.push(cc.v2(0, 458));
        ball.node.runAction(cc.sequence(cc.cardinalSplineTo(0.5, movePath, 0.5),
            callFunc(function () {
                ball.rigidBody.active = true;
                // 给小球一个力
                ball.rigidBody.linearVelocity = dir.mul(3);// 缩放向量，变成3倍
            })));
    }

    shootBalls(dir: cc.Vec2) {
        for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            this.scheduleOnce(function () {
                this.shootBall(ball, dir);
            }.bind(this), i * 0.3);
        }
    }

    /**
     * 动态添加小球
     * @param {cc.Vec2} pos
     */
    addBall(pos: cc.Vec2) {
        let ball = cc.instantiate(this.prefabBall).getComponent<Ball>(Ball);
        ball.node.parent = this.node;
        ball.node.position = pos;
        this.balls.push(ball);
    }

    /**
     * 动态添加障碍物
     */
    addBarriers() {
        let startX = -300;
        let endX = 250;

        let currentX = startX + this.getRandomStepX();

        while (currentX < endX) {
            // 实例化障碍物
            let barrier = cc.instantiate(this.prefabBarriers[Math.floor(Math.random() * this.prefabBarriers.length)]).getComponent<Barrier>(Barrier);
            barrier.node.parent = this.node;
            barrier.node.rotation = Math.random() * 360;
            barrier.node.position = cc.v2(currentX, -410);

            // 给障碍的主控函数赋值
            barrier.mainControler = this;

            // 添加间距
            currentX += this.getRandomStepX();
            this.barriers.push(barrier);
        }
    }

    /**
     * 当两个数量相同时，视为小球全部到顶部了
     * @returns {boolean}
     */
    isBallsUpFinished(): boolean {
        return this.goalBallsCount == this.balls.length;
    }

    removeBarrier(barrier: Barrier) {
        let ids = this.barriers.indexOf(barrier);
        if (ids != -1) {//我觉得这边用<0更好
            barrier.node.removeFromParent(false);
            this.barriers.splice(ids, 1);
        }
    }

    /**
     * 生成随机的x方向的间隔，最小值100
     * @returns {number}
     */
    getRandomStepX(): number {
        return 100 + Math.random() * 100;
    }

    addScore() {
        this.totalScore++;
        this.scoreLabel.string = this.labelStr + this.totalScore.toString();
    }
}