import MainController from "./MainController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    rigidBody: cc.RigidBody = null;

    isTouchGround: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.rigidBody = <cc.RigidBody>this.getComponent(cc.RigidBody);
    }

    // start() {}

    update(dt) {
        if (this.isTouchGround) {
            // 注意：不能在碰撞回调中修改刚体组件，这样和组件回调是冲突的，就破坏了碰撞生命周期
            // 如果碰撞到地面，就取消刚提组件
            this.rigidBody.active = false;
            this.rigidBody.linearVelocity = cc.Vec2.ZERO;

            // 绘制路线
            let pathPos: cc.Vec2[] = [];
            pathPos.push(this.node.position);
            pathPos.push(cc.v2(339, -477));
            pathPos.push(cc.v2(339, 660));
            pathPos.push(cc.v2(0, 534));

            // 第三个参数是张力，值0-1，越大动作越硬
            this.node.runAction(cc.sequence(cc.cardinalSplineTo(2, pathPos, 1),
                cc.callFunc(function () {
                    this.rigidBody.active = true;
                }.bind(this))));

            this.isTouchGround = false;
        }
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        if (otherCollider.node.name == "ground") {
            console.log("要碰到地面了");
            this.isTouchGround = true;
        }
    }

}