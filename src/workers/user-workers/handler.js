// src/consumer/userConsumer.js
import {User} from '../../model/user.model.js';

export const handleUserCreated = async (data) => {
  // Simulate a slow DB save to see RabbitMQ behavior
  // If you send 100 requests, they will queue up here.
  console.log(`... Saving ${data.name} to DB`);
  
  // Check duplicates
  const exists = await User.findOne({ where: { email: data.email } });
  if (!exists) {
    await User.create(data);
  }
};

export const handleUserUpdated = async (data) => {
  await User.update(data, { where: { id: data.id } });
};

export const userEventHandlers = {
  'UserCreated': handleUserCreated,
  'UserUpdated': handleUserUpdated,
};