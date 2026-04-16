import Role from "../models/role.js";

const RoleService = {
  async getAll() {
    return await Role.getAll();
  },

  async getById(id) {
    const role = await Role.getById(id);

    if (!role) {
      throw new Error("Role not found");
    }

    return role;
  },

  async getByName(name) {
    const role = await Role.getByName(name);

    if (!role) {
      throw new Error("Role not found");
    }

    return role;
  },

  async create(data) {
    const { name, description } = data;

    if (!name) {
      throw new Error("Role name is required");
    }

    // optional: prevent duplicates
    const existing = await Role.getByName(name);
    if (existing) {
      throw new Error("Role already exists");
    }

    const roleId = await Role.create({
      name,
      description: description || null,
    });

    return {
      id: roleId,
      name,
      description: description || null,
    };
  },

  async delete(id) {
    const role = await Role.getById(id);

    if (!role) {
      throw new Error("Role not found");
    }

    await Role.delete(id);

    return { message: "Role deleted successfully" };
  },

};

export default RoleService;