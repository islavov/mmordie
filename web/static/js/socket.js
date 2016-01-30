import {Socket} from "phoenix";

class Sync {


  constructor(user_id) {
    this.UPDATE = 'new:update';

    this.userId = user_id;
    this.log_enabled = false;
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => {
        this.log(`${kind}: ${msg}`, data)
      }),
      params: {user_id: user_id}
    });

    socket.connect();
    this.socket = socket;

    socket.onOpen(ev => this.log("OPEN", ev));
    socket.onError(ev => this.log("ERROR", ev));
    socket.onClose(e => this.log("CLOSE", e));

    this.chan = socket.channel("mmordie:game", {});
    this.chan.join()
      .receive("ignore", () => this.log("auth error"))
      .receive("ok", () => this.log("join ok"));
    this.chan.onError(e => this.log("something went wrong", e));
    this.chan.onClose(e => this.log("channel closed", e));
    //
    //input.off("keypress").on("keypress", e => {
    //  if (e.keyCode == 13) {
    //    chan.push("new:msg", {user: username.val(), body: input.val()})
    //    input.val("")
    //  }
    //});
    //
    //chan.on("new:msg", msg => {
    //  messages.append(this.messageTemplate(msg))
    //  scrollTo(0, document.body.scrollHeight)
    //});
    //
    //chan.on("user:entered", msg => {
    //  var username = this.sanitize(msg.user || "anonymous")
    //  messages.append(`<br/><i>[${username} entered]</i>`)
    //});
  }

  log(...args) {
    if (this.log_enabled) {
      console.log(...args);
    }
  }

  syncPlayer(player) {
    this.chan.push(this.UPDATE, {
        'id': this.userId,
        'position': player.world,
        'velocity': player.body.velocity
      }
    )
  }
}

export default Sync;
