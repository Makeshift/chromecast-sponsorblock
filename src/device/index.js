'use strict';

const config = require('../config')();
const debug = require('debug')('cast-sponsorblock:device');

const msToNanoBigInt = require('../utils/ms-to-nano-bigint');

const getReceiverStatusAndLatency = require('./get-receiver-status-and-latency');
const getPlayerStatus = require('./get-player-status');
//const getSegments = require('./get-segments');
//const getYoutubeData = require('./get-youtube-data');
//const generateTimers = require('./device/generate-seek-timers');

module.exports = class Device {
	constructor(_device) {
		this._device = _device;
		this.host = _device.host;
		this.blocked = this.isBlocked();
		this.started = false;
		this.interval = null;
		this.minimumIntervalNano = msToNanoBigInt(
			config.intervals.minimumPingDevice
		);
		this.pingDeviceEveryXTimesLatency = BigInt(
			config.multipliers.pingDeviceEveryXTimesLatency
		);
		this.floatingAverageLatencyBucket = [];
		this.latency = 0n;
		this.receiverStatus = null;
	}
	isBlocked() {
		if (
			Array.isArray(config.chromecastFriendlyNames) &&
			config.chromecastFriendlyNames.length > 0 &&
			config.chromecastFriendlyNames.indexOf(device.friendlyName) === -1
		) {
			return true;
		}
		return false;
	}
	start() {
		if (this.started) {
			throw new Error('Device already started');
		}
		let i = 0
		const loopBody = async () => {
			try {
				await this.getReceiverStatusAndLatency();
				await this.getPlayerStatus();
				//console.log(this);
			} catch (err) {
				if (config.flags.debug) {
					console.error(err);
				}
			} finally {
				setTimeout(() => {
					loopBody();
				}, this.loopInterval());
			}
		};

		this.interval = setTimeout(loopBody, 0);
		this.started = false;
	}

	loopInterval() {
		const pingInterval = this.latency * this.pingDeviceEveryXTimesLatency;
		return Math.ceil(
			Number(
				(this.minimumIntervalNano < pingInterval
					? pingInterval
					: this.minimumIntervalNano) / 1000000n
			)
		);
	}

	async getReceiverStatusAndLatency() {
		const {
			receiverStatus,
			latency,
			floatingAverageLatencyBucket
		} = await getReceiverStatusAndLatency(
			this._device,
			this.floatingAverageLatencyBucket.slice()
		);
		this.playerStatus && console.log(this.playerStatus.currentTime)
		this.receiverStatus = receiverStatus;
		this.latency = latency;
		this.floatingAverageLatencyBucket = floatingAverageLatencyBucket;
	}

	async getPlayerStatus() {
		this.playerStatus = await getPlayerStatus(
			this._device,
			this.receiverStatus
		);
	}

	updateInfo() {
		return;
		// init on new device
		// if (typeof idDb.get(device.host) === 'undefined') {
		// 	idDb.set(device.host, ++idInc + 0);
		// }
		// if (typeof statusDb.get(device.host) === 'undefined') {
		// 	statusDb.set(device.host, defaultStatus);
		// }
		// if (!latencyDb.has(device.host)) {
		// 	latencyDb.set(device.host, 5n * 1000000n);
		// }
		// if (!currentTimeDb.has(device.host)) {
		// 	currentTimeDb.set(device.host, 0);
		// }

		// let blocked = false;
		// try {
		// 	if (
		// 		Array.isArray(config.chromecastFriendlyNames) &&
		// 		config.chromecastFriendlyNames.length > 0 &&
		// 		config.chromecastFriendlyNames.indexOf(device.friendlyName) ===
		// 			-1
		// 	) {
		// 		blocked = true;
		// 		statusDb.set(device.host, blockedStatus);
		// 		if (config.flags.interactive) {
		// 			generateLogData();
		// 		} else {
		// 			throw new Error('Chromecast blocked');
		// 		}
		// 		// if blocked, process next device
		// 		continue;
		// 	}

		// 	setUniqueInterval(
		// 		'PING_DEVICE_' + device.host,
		// 		async () => {
		// 			try {
		// 				const status = await getStatusAndLatency(
		// 					device,
		// 					latencyDb
		// 				);

		// 				if (cli.flags.interactive && logNow) {
		// 					logNow = false;
		// 					generateLogData();
		// 				}
		// 				if (status.idleReason) {
		// 					status.playerState = status.idleReason;
		// 					statusDb.set(device.host, status);
		// 					currentTimeDb.set(device.host, 9999999999);
		// 					return;
		// 					//("Idle, no need to poll: " + device.host);
		// 				} else if (status.playerState === 'NOT_YOUTUBE') {
		// 					statusDb.set(device.host, status);
		// 					currentTimeDb.set(device.host, 9999999999);
		// 					return;
		// 					// new Error("Not Youtube Player, no need to poll: " + device.host);
		// 				} else {
		// 					statusDb.set(device.host, status);
		// 					currentTimeDb.set(device.host, status.currentTime);
		// 				}

		// 				const [ytData, segments] = await Promise.all([
		// 					getYoutubeData(status.media.contentId),
		// 					getSegments(status.media.contentId)
		// 				]);

		// 				youtubeDataDb.set(device.host, ytData);
		// 				segmentsDb.set(device.host, segments);

		// 				generateTimers(
		// 					status.media.contentId,
		// 					segments,
		// 					currentTimeDb,
		// 					device,
		// 					latencyDb
		// 				);
		// 			} catch (err) {
		// 				if (config.flags.debug) {
		// 					console.error(err);
		// 				}
		// 			}
		// 		},
		// 		PING_DEVICE_TIMING_FUNCTION
		// 	);
		// 	if (cli.flags.interactive) {
		// 		logNow = true;
		// 	}
		// } catch (err) {
		// 	if (config.flags.debug) {
		// 		console.error(err);
		// 	}
		// }
	}
};
