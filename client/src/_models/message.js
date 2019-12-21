export class Message {
	constructor(send_user, content, is_new) {
		this.send_user = send_user;
		this.content = content;
		this.send_time = new Date().getTime();
		this.is_new = is_new;
	}
}