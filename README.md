# EN
**GenTLSFlooder** is a high-performance tool designed to stress-test and evaluate the resilience of websites and servers under heavy network load. This tool is intended for security testing purposes and should be used responsibly. Unauthorized use against third-party systems without explicit permission is illegal and unethical.

## Features
- **High Throughput**: Capable of generating a large number of concurrent requests.
- **Proxy Support**: Utilizes proxies to anonymize requests.
- **Customizable Cipher Suites**: Allows specification of TLS cipher suites for testing compatibility and security.
- **Scalability**: Supports multi-threading to maximize resource usage.
- **Detailed Logging**: Comprehensive logging of activities and errors for easy monitoring and analysis.

## Requirements
- **Node.js**: v14.0.0 or later
- **Dependencies**: Listed in `package.json`


## Installation
1. Clone the repository:
```bash
git clone https://github.com/geniuszlyy/GenTLSFlooder.git
cd GenTLSFlooder
```
2. Install dependencies:
```bash
npm install
```
3. Ensure you have a `proxy.txt` file in the root directory with proxies listed line by line.

## Usage
### Basic Usage
```bash
node GenTLSFlooder.js [targetUrl] [duration] [concurrentRequests] [threads]
```
- `targetUrl`: The URL of the target site (e.g., `http://example.com`).
- `duration`: Duration of the attack in seconds.
- `concurrentRequests`: Number of concurrent requests.
- `threads`: Number of threads to use.

![image](https://github.com/user-attachments/assets/63d334ee-48f3-4ae9-b2e2-b79d05b7a296)


## Example
```bash
node GenTLSFlooder.js http://example.com 60 100 4
```
This command will start an attack on `http://example.com` for 60 seconds with 100 concurrent requests using 4 threads.

## Important Note
Use this tool responsibly. It is designed for testing the robustness of your own systems or systems you have explicit permission to test. Misuse may result in legal consequences.
# RU
**GenTLSFlooder** — это инструмент высокой производительности, предназначенный для стресс-тестирования и оценки устойчивости веб-сайтов и серверов при высокой сетевой нагрузке. Этот инструмент предназначен для тестирования безопасности и должен использоваться ответственно. Неавторизованное использование против сторонних систем без явного разрешения является незаконным и неэтичным.

## Возможности
- **Высокая пропускная способность**: Способен генерировать большое количество одновременных запросов.
- **Поддержка прокси**: Использует прокси для анонимизации запросов.
- **Настраиваемые шифры**: Позволяет указывать наборы шифров TLS для тестирования совместимости и безопасности.
- **Масштабируемость**: Поддержка многопоточности для максимального использования ресурсов.
- **Подробное логирование**: Полное логирование активности и ошибок для удобного мониторинга и анализа.

## Требования
- **Node.js**: версия 14.0.0 или новее
- **Зависимости**: указаны в файле `package.json`

## Установка
1. Клонируйте репозиторий:
```bash
git clone https://github.com/geniuszlyy/GenTLSFlooder.git
cd GenTLSFlooder
```
2. Установите зависимости:
```bash
npm install
```
3. Убедитесь, что у вас есть файл `proxy.txt` в корневом каталоге с прокси, указанными построчно.
   
## Использование
### Основное использование
```bash
node GenTLSFlooder.js [targetUrl] [duration] [concurrentRequests] [threads]
```
- `targetUrl`: URL целевого сайта (например, `http://example.com`).
- `duration`: Длительность атаки в секундах.
- `concurrentRequests`: Количество одновременных запросов.
- `threads`: Количество потоков.

![image](https://github.com/user-attachments/assets/4f3b4b23-637d-4de5-b57d-79ecb25320c9)


## Пример
```bash
node GenTLSFlooder.js http://example.com 60 100 4
```

## Важно
Используйте этот инструмент ответственно. Он предназначен для тестирования устойчивости ваших систем или систем, на которые у вас есть явное разрешение. Злоупотребление может привести к юридическим последствиям.
