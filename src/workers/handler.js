const handlers = {
  create: async (data) => {
    const existingUser = await User.findOne({ where: { email: data.email } });

    if (existingUser) {
      console.log(`⚠️ User already exists: ${data.email}`);
      return;
    }

    const newUser = await User.create(data);
    console.log(`✅ User Created: ${newUser.name}`);
  },

  update: async (data) => {
    await User.update(data, { where: { id: data.id } });
    console.log(`🔄 User Updated: ${data.id}`);
  },

  delete: async (data) => {
    await User.destroy({ where: { id: data.id } });
    console.log(`🗑 User Deleted: ${data.id}`);
  }
};
