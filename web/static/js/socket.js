import "phoenix_html";
import {Socket} from "phoenix";


class Sync {

  constructor(){
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    });

    socket.connect({user_id: "123"});
    this.socket = socket;

    var status    = document.getElementById("status");
    var messages  = document.getElementById("messages");
    var input     = document.getElementById("message-input");
    var username  = document.getElementById("username");

    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    this.chan = socket.channel("mmordie:game", {})
    this.chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    this.chan.onError(e => console.log("something went wrong", e))
    this.chan.onClose(e => console.log("channel closed", e))
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

  sync_player(player){
    chan.push("new:player_position", {})
  }
}
