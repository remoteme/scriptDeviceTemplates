function RemoteMeData(bufferOrArrayOrLength) {

	this.dataView = getDataView(bufferOrArrayOrLength);
	this.pos = 0;

}

RemoteMeData.prototype.popFloat32 = function () {
	var ret = this.dataView.getFloat32(this.pos);
	this.pos += 4;
	return ret;
};


RemoteMeData.prototype.popFloat64 = function () {
	var ret = this.dataView.getFloat64(this.pos);
	this.pos += 8;
	return ret;

};

RemoteMeData.prototype.popInt8 = function () {
	var ret = this.dataView.getInt8(this.pos);
	this.pos += 1;
	return ret;
};
RemoteMeData.prototype.popByte = function () {
	return this.popInt8();
};

RemoteMeData.prototype.popInt16 = function () {
	var ret = this.dataView.getInt16(this.pos);
	this.pos += 2;
	return ret;

};



RemoteMeData.prototype.popInt32 = function () {
	var ret = this.dataView.getInt32(this.pos);
	this.pos += 4;
	return ret;
};


RemoteMeData.prototype.popInt64 = function () {
	var ret = 0;
	for (i = 0; i < 8; i++) {
		ret = (ret << 8) + this.popInt8();
	}
	;

	return ret;
};

RemoteMeData.prototype.popInt = function () {
	return this.popInt32();
};

RemoteMeData.prototype.popUint8 = function () {
	var ret = this.dataView.getUint8(this.pos);
	this.pos += 1;
	return ret;
};

RemoteMeData.prototype.popUint16 = function () {
	var ret = this.dataView.getUint16(this.pos);
	this.pos += 2;
	return ret;
};

RemoteMeData.prototype.popUint32 = function () {
	var ret = this.dataView.getUint32(this.pos);
	this.pos += 4;
	return ret;
};


RemoteMeData.prototype.popRestArray = function () {
	var data = new Uint8Array(this.dataView.buffer, this.pos);
	this.pos = this.size();
	return getDataView(data).buffer;
};

RemoteMeData.prototype.putFloat32 = function (number) {
	this.dataView.setFloat32(this.pos, number);
	this.pos += 4

};

RemoteMeData.prototype.putFloat64 = function (number) {
	this.dataView.setFloat64(this.pos, number);
	this.pos += 8;
};

RemoteMeData.prototype.putDouble = function (number) {
	this.putFloat64(number);
};

RemoteMeData.prototype.putInt8 = function (number) {
	this.dataView.setInt8(this.pos, number);
	this.pos += 1;

};

RemoteMeData.prototype.putByte = function (number) {
	this.putInt8(number);

};

RemoteMeData.prototype.putInt16 = function (number) {
	this.dataView.setInt16(this.pos, number);
	this.pos += 2;

};

RemoteMeData.prototype.putShort = function (number) {
	this.putInt16(number);
};

RemoteMeData.prototype.putInt32 = function (number) {
	this.dataView.setInt32(this.pos, number);
	this.pos += 4;

};

RemoteMeData.prototype.putUint8 = function (number) {
	this.dataView.setUint8(this.pos, number);
	this.pos += 1;

};

RemoteMeData.prototype.putUint16 = function (number) {
	this.dataView.setUint16(this.pos, number);
	this.pos += 2;

};

RemoteMeData.prototype.putUint32 = function (number) {
	this.dataView.setUint32(this.pos, number);
	this.pos += 4
};

RemoteMeData.prototype.putLong = function (number) {
	for (var index = 0; index < 8; index++) {
		var byte = number & 0xff;
		this.putInt8(byte);
		number = (number - byte) / 256;
	}
};

RemoteMeData.prototype.putArray = function (data) {
	getArray(data).forEach(element => this.dataView.setInt8(this.pos++, element));

};

RemoteMeData.prototype.putString = function (data) {
	putArray(getArray(data));
	this.putInt8(0);
};
RemoteMeData.prototype.getBufferArray = function () {
	return this.dataView.buffer;
};

RemoteMeData.prototype.getArray = function () {
	return getArray(this);
};

RemoteMeData.prototype.print = function () {
	print(toHexString(new Uint8Array(this.getBufferArray())));
};

RemoteMeData.prototype.size = function () {
	return this.dataView.byteLength;
};

RemoteMeData.prototype.rewind = function () {
	this.pos = 0;
};


MessageType = {
	USER_MESSAGE: 100,
	USER_MESSAGE_DELIVER_STATUS: 101,
	USER_SYNC_MESSAGE: 102,
	SYNC_MESSAGE: 120,
	SYNC_MESSAGE_RESPONSE: 121,
	REGISTER_DEVICE: 200,
	REGISTER_CHILD_DEVICE: 201,
	ADD_DATA: 300,
	LOG: 20000,
	SYSTEM_MESSAGE: 20001
};

WSUserMessageSettings = {NO_RENEWAL: 0, RENEWAL_IF_FAILED: 1};
AddDataMessageSetting = {NO_ROUND: 0, _1S: 1, _2S: 2, _5S: 3, _10S: 4, _15S: 5, _20S: 6, _30S: 7};
DeviceType = {NETWORK: 1, SMARTPHONE: 2, WEBPAGE: 3, JSSCRIPT: 4};
LogLevel = {INFO: 1, WARN: 2, ERROR: 3};
LeafDeviceType = {LD_OTHER: 1, LD_EXTERNAL_SCRIPT: 2, LD_SERIAL: 3, LD_NRF24: 4, LD_WEB_SOCKET: 5};

SyncMessageType = {USER: 0, GET_WEBRTC_CONENCTED_DEVICE_ID: 1};

AndroidMessageIcon = {DEFAULT_ICON: 1, PERSON_ICON: 2, THIEF_ICON: 3, WINDOW_OPEN_ICON: 4, BUNNY_ICON: 5};
AndroidMessageSound = {DEFAULT_SOUND: 1};


function getArray(data) {
	if (typeof data === 'string' || data instanceof String) {
		data = stringToByteArray(data);
	}


	return data;
}

function getDataView(data) {

	var dataView;
	if (data instanceof Uint8Array || data instanceof Array) {
		print("ARRAY");
		dataView = new DataView(new ArrayBuffer(data.length));

		for(i=0;i<data.length;i++){
			dataView.setUint8(i, data[i]);
		}


	} else if (isNaN(data)) {
		print("NON");
		dataView = new DataView(data);
	} else {
		print("XXXXX");
		dataView = new DataView(new ArrayBuffer(data));
	}
	return dataView;
}

function getUserMessage(userMessageSettings, receiverDeviceId, senderDeviceId, messageId, data) {

	data = getArray(data);


	size = 1 + 2 + 2 + 2 + data.length;
	var ret = new RemoteMeData(4 + size);


	ret.putShort(MessageType.USER_MESSAGE);
	ret.putShort(size);
	ret.putByte(userMessageSettings);
	ret.putShort(receiverDeviceId);
	ret.putShort(senderDeviceId);
	ret.putShort(messageId);
	ret.putArray(data);

	return ret.getBufferArray();

}


//getUserMessage(1234,12,[1,2,3,4,5,6]);
//getUserMessage(1234,12,"remotemMe some text");
function getUserSyncMessage(receiverDeviceId, senderDeviceId, data) {

	data = getArray(data);


	size = 2 + 2 + 8 + data.length;
	var ret = new RemoteMeData(4 + size);


	ret.putShort(MessageType.USER_SYNC_MESSAGE);
	ret.putShort(size);
	ret.putShort(receiverDeviceId);
	ret.putShort(senderDeviceId);
	ret.putLong(Math.floor(Math.random() * 1000000000));
	ret.putArray(data);

	return ret.getBufferArray();
}


function getUserSyncResponseMessage(messageId, data) {

	data = getArray(data);

	size = 8 + data.length;
	var ret = new RemoteMeData(4 + size);

	ret.putShort(MessageType.SYNC_MESSAGE_RESPONSE);
	ret.putShort(size);

	ret.putLong(messageId);
	ret.putArray(data);

	return ret.getBufferArray();
}

//getLogMessage(LogLevel.INFO,[1,2,3,4,5,6]);
//getLogMessage(LogLevel.DEBUG,"remotemMe some text");
function getLogMessage(level, data) {

	data = getArray(data);


	size = 2 + data.length;
	pos = 0;
	var ret = new RemoteMeData(4 + size);


	ret.putShort(pos, MessageType.LOG);
	ret.putShort(pos, size);
	ret.putByte(pos, level);
	ret.putString(pos, data);


	return ret;
}

//getAndroidMessage(128,"some title","body something","#009900",AndroidMessageSound.DEFAULT_SOUND,AndroidMessageIcon.BUNNY_ICON);
function getAndroidMessage(receivedeviceId, title, body, color, sound, icon) {
	size = stringToByteArray(title).length + 1;
	size += stringToByteArray(body).length + 1;
	size += 3;//color
	size += 2;//icon sound


	var ret = new RemoteMeData(size);

	ret.putString(title);
	ret.putString(body);
	ret.putArray(parseHexString(color.substring(1)));
	ret.putByte(sound);
	ret.putByte(icon);

	return getUserMessage(WSUserMessageSettings.NO_RENEWAL, receivedeviceId, 0, ret);


}

//getAddDataMessage(new Date().getTime(),AddDataMessageSetting._5S,[[1,123],[2,0.5]]);
function getAddDataMessage(time, settings, dataSeries) {

	size = 9 + dataSeries.size() * 10;
	var ret = new RemoteMeData(size + 4);


	ret.putShort(MessageType.ADD_DATA);
	ret.putShort(size);
	ret.putLong(time);
	ret.putByte(settings);

	for (i = 0; i < dataSeries.length; i++) {
		var ds = dataSeries[i];
		ret.putShort(ds[0]);
		ret.putDouble(ds[1]);
	}

	return ret.getBufferArray();
}


function stringToByteArray(text) {
	return Array.from(new TextEncoder("utf-8").encode(text));
}

function byteArrayToString(byteArray) {
	return new TextDecoder("utf-8").decode(byteArray);
}

function toHexString(byteArray) {
	return Array.from(byteArray, function (byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join(' ')
}

function parseHexString(str) {
	var result = [];
	for (i = 0; i < str.length; i += 2) {
		result.push(parseInt(str.substring(i, i + 2), 16));
	}
	return result;
}


