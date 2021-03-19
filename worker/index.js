const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

function fib(index, memo = {}) {
  if (index in memo) return memo[index];
  if (index < 2) return 1;
  memo[index] = fib(index - 1, memo) + fib(index - 2, memo);
  return memo[index];
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
