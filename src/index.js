"use strict";

const Engine = require('./engine');

console.log(11)
require('./init');
console.log(22)
const engine = new Engine();
console.log(engine)
/*
const {
  idDb,
  latencyDb,
  receiverStatusDb,
  playerStatusDb,
  youtubeDataDb,
  segmentsDb
} = require('./storage');

const setUniqueInterval = require("./utils/unique-interval");
const wait = require("./utils/wait");


const PING_DEVICE_TIMING_MULTIPLIFIER = 20;
const LOOK_FOR_DEVICES_TIMING_FUNCTION = () => 2500;
const defaultStatus = {
  playerState: "LOADING_CHROMECAST_DATA",
  currentTime: "Loading current time",
  media: {
    contentId: "Loading content ID",
    metadata: {
      title: "Loading title",
    },
    duration: "Loading duration",
  },
};

const blockedStatus = {
  playerState: "CHROMECAST_BLOCKED_BY_CONFIG",
  currentTime: "Current time unavailable",
  media: {
    contentId: "Content ID unavailable",
    metadata: {
      title: "Title unavailable",
    },
    duration: "Duration unavailable",
  },
};

*/


// init client

