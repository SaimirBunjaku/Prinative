const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Reduce parallel workers to avoid OOM on lower-RAM machines (Windows).
config.maxWorkers = 1;

module.exports = config;
