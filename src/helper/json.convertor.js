export function toJson(data) {
  return JSON.stringify(data);
}
// src/utils/parseMessage.js
export function parseMessage(msg) {
  if (!msg || !msg.content) {
    throw new Error("Invalid RabbitMQ message");
  }

  try {
    return JSON.parse(msg.content.toString("utf-8"));
  } catch (err) {
    throw new Error("Failed to parse message JSON");
  }
}
