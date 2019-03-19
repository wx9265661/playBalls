// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import MainController from "./MainController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Barrier extends cc.Component {

    @property({type: cc.Label})
    label: cc.Label = null;

    score: number = 5;

    @property({type: Boolean, tooltip: "是否是会添加小球的buff"})
    isAddBallBuff: boolean = false;

    // 给个mainControl
    mainControler: MainController;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 调用顺序
        // onBeginContact
        // onPreSolve
        // onPostSolve
        // onEndContact

        this.getScore(this.score);
    }

    start() {
        if (!this.isAddBallBuff) {
            // 把label转正
            this.label.node.rotation = -this.node.rotation;
        }
    }

    /**
     * 给label赋值
     * @param {number} score
     */
    getScore(score: number) {
        if (!this.isAddBallBuff) {
            this.label.string = score.toString();
        }
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        // 碰撞开始
        console.log("onBeginContact");
        if (!this.isAddBallBuff) {
            this.score--;
            this.getScore(this.score);
            this.mainControler.addScore();

            if (this.score <= 0) {
                this.node.removeFromParent();
                this.mainControler.removeBarrier(this);
            }
        } else {
            this.mainControler.addBall(this.node.position);
            this.node.removeFromParent();
            this.mainControler.removeBarrier(this);
        }
    }

    onEndContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        console.log("onEndContact");
    }

    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        console.log("onPreSolve");
    }

    onPostSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        console.log("onPostSolve");
    }


    // update (dt) {}
}
