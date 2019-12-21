import io from 'socket.io-client';
import { ioUrl } from './_services/config';

export default (function () {
	let instance = undefined;

	function open(data) {
		instance = undefined;
		if (instance !== undefined) {
			throw new Error("Attempt to open Socket connection fails");
		}
		instance = io.connect(ioUrl);
		emit('CLIENT.SEND_INFO', data)
	}

	function close() {
		if (instance === undefined) {
			throw new Error("Attempt to close null Socket connection fails");
		}

		instance.close();
		instance = undefined;
	}

	function emit(eventType, data) {
		instance.emit(eventType, data);
	}

	function on(eventName, f) {
		setTimeout(() => {
			instance.on(eventName, (data) => { f(data); });
		}, 100)
	}

	return { open, close, emit, on };
})();