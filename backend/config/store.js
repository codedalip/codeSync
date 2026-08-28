const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const isMongoConnected = () => mongoose.connection.readyState === 1;

// In-memory storage structures
const memUsers = new Map();
const memWorkspaces = new Map();
const memWorkspaceMembers = new Map();
const memFiles = new Map();
const memMessages = new Map();

const generateId = () => new mongoose.Types.ObjectId().toString();

// User Operations
const userStore = {
  create: async (data) => {
    if (isMongoConnected()) {
      return await require('../models/User').create(data);
    }
    const id = generateId();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = {
      _id: id,
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      avatarColor: data.avatarColor || '#3b82f6',
      createdAt: new Date(),
      updatedAt: new Date(),
      matchPassword: async function(p) { return await bcrypt.compare(p, this.password); }
    };
    memUsers.set(id, user);
    return user;
  },
  findOne: async (query) => {
    if (isMongoConnected()) {
      const q = require('../models/User').findOne(query);
      if (query.email) return await q.select('+password');
      return await q;
    }
    const list = Array.from(memUsers.values());
    if (query.email) {
      const u = list.find(x => x.email === query.email.toLowerCase());
      return u ? { ...u, matchPassword: async (p) => await bcrypt.compare(p, u.password) } : null;
    }
    return null;
  },
  findById: async (id) => {
    if (isMongoConnected()) {
      return await require('../models/User').findById(id).select('-password');
    }
    const u = memUsers.get(id?.toString());
    if (!u) return null;
    const { password, ...rest } = u;
    return rest;
  }
};

// Workspace Operations
const workspaceStore = {
  create: async (data) => {
    if (isMongoConnected()) {
      return await require('../models/Workspace').create(data);
    }
    const id = generateId();
    const ws = {
      _id: id,
      name: data.name,
      code: data.code,
      description: data.description || '',
      owner: data.owner,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memWorkspaces.set(id, ws);
    return ws;
  },
  findOne: async (query) => {
    if (isMongoConnected()) {
      return await require('../models/Workspace').findOne(query);
    }
    const list = Array.from(memWorkspaces.values());
    if (query.code) {
      return list.find(x => x.code === query.code) || null;
    }
    return null;
  },
  findById: async (id) => {
    if (isMongoConnected()) {
      return await require('../models/Workspace').findById(id).populate('owner', 'name email avatarColor');
    }
    const ws = memWorkspaces.get(id?.toString());
    if (!ws) return null;
    const ownerObj = await userStore.findById(ws.owner);
    return { ...ws, owner: ownerObj, toObject: () => ({ ...ws, owner: ownerObj }) };
  },
  delete: async (id) => {
    const wsIdStr = id?.toString();
    if (isMongoConnected()) {
      await require('../models/Workspace').findByIdAndDelete(id);
      await require('../models/WorkspaceMember').deleteMany({ workspace: id });
      await require('../models/File').deleteMany({ workspace: id });
      await require('../models/Message').deleteMany({ workspace: id });
      return true;
    }
    memWorkspaces.delete(wsIdStr);
    for (const [k, m] of memWorkspaceMembers.entries()) {
      if (m.workspace === wsIdStr) memWorkspaceMembers.delete(k);
    }
    for (const [k, f] of memFiles.entries()) {
      if (f.workspace === wsIdStr) memFiles.delete(k);
    }
    for (const [k, msg] of memMessages.entries()) {
      if (msg.workspace === wsIdStr) memMessages.delete(k);
    }
    return true;
  }
};

// WorkspaceMember Operations
const memberStore = {
  create: async (data) => {
    if (isMongoConnected()) {
      return await require('../models/WorkspaceMember').create(data);
    }
    const id = generateId();
    const member = {
      _id: id,
      workspace: data.workspace.toString(),
      user: data.user.toString(),
      role: data.role || 'member',
      createdAt: new Date()
    };
    memWorkspaceMembers.set(id, member);
    return member;
  },
  findOne: async (query) => {
    if (isMongoConnected()) {
      return await require('../models/WorkspaceMember').findOne(query);
    }
    const list = Array.from(memWorkspaceMembers.values());
    return list.find(m => m.workspace === query.workspace?.toString() && m.user === query.user?.toString()) || null;
  },
  findUserWorkspaces: async (userId) => {
    if (isMongoConnected()) {
      const memberships = await require('../models/WorkspaceMember').find({ user: userId }).populate({
        path: 'workspace',
        populate: { path: 'owner', select: 'name email avatarColor' }
      });
      return memberships.filter(m => m.workspace).map(m => ({ ...m.workspace.toObject(), role: m.role }));
    }
    const list = Array.from(memWorkspaceMembers.values()).filter(m => m.user === userId.toString());
    const result = [];
    for (const m of list) {
      const ws = await workspaceStore.findById(m.workspace);
      if (ws) {
        result.push({ ...ws, role: m.role });
      }
    }
    return result;
  },
  findWorkspaceMembers: async (workspaceId) => {
    if (isMongoConnected()) {
      return await require('../models/WorkspaceMember').find({ workspace: workspaceId }).populate('user', 'name email avatarColor');
    }
    const list = Array.from(memWorkspaceMembers.values()).filter(m => m.workspace === workspaceId.toString());
    const members = [];
    for (const m of list) {
      const u = await userStore.findById(m.user);
      if (u) members.push({ user: u, role: m.role });
    }
    return members;
  }
};

// File Operations
const fileStore = {
  create: async (data) => {
    if (isMongoConnected()) {
      return await require('../models/File').create(data);
    }
    const id = generateId();
    const file = {
      _id: id,
      workspace: data.workspace.toString(),
      name: data.name,
      language: data.language || 'javascript',
      content: data.content || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memFiles.set(id, file);
    return file;
  },
  findWorkspaceFiles: async (workspaceId) => {
    if (isMongoConnected()) {
      return await require('../models/File').find({ workspace: workspaceId }).sort({ createdAt: 1 });
    }
    return Array.from(memFiles.values()).filter(f => f.workspace === workspaceId.toString());
  },
  findById: async (id) => {
    if (isMongoConnected()) {
      return await require('../models/File').findById(id);
    }
    return memFiles.get(id?.toString()) || null;
  },
  findOne: async (query) => {
    if (isMongoConnected()) {
      return await require('../models/File').findOne(query);
    }
    const list = Array.from(memFiles.values());
    return list.find(f => f.workspace === query.workspace?.toString() && f.name === query.name) || null;
  },
  update: async (id, updateData) => {
    if (isMongoConnected()) {
      return await require('../models/File').findByIdAndUpdate(id, updateData, { new: true });
    }
    const file = memFiles.get(id?.toString());
    if (!file) return null;
    if (updateData.name) file.name = updateData.name;
    if (updateData.language) file.language = updateData.language;
    if (updateData.content !== undefined) file.content = updateData.content;
    file.updatedAt = new Date();
    memFiles.set(id?.toString(), file);
    return file;
  },
  delete: async (id) => {
    if (isMongoConnected()) {
      return await require('../models/File').findByIdAndDelete(id);
    }
    memFiles.delete(id?.toString());
    return true;
  },
  count: async (workspaceId) => {
    if (isMongoConnected()) {
      return await require('../models/File').countDocuments({ workspace: workspaceId });
    }
    return Array.from(memFiles.values()).filter(f => f.workspace === workspaceId.toString()).length;
  }
};

// Message Operations
const messageStore = {
  create: async (data) => {
    if (isMongoConnected()) {
      return await require('../models/Message').create(data);
    }
    const id = generateId();
    const msg = {
      _id: id,
      workspace: data.workspace.toString(),
      sender: data.sender.toString(),
      content: data.content,
      createdAt: new Date()
    };
    memMessages.set(id, msg);
    return msg;
  },
  findWorkspaceMessages: async (workspaceId) => {
    if (isMongoConnected()) {
      return await require('../models/Message').find({ workspace: workspaceId }).populate('sender', 'name email avatarColor').sort({ createdAt: 1 }).limit(100);
    }
    const list = Array.from(memMessages.values()).filter(m => m.workspace === workspaceId.toString());
    const populated = [];
    for (const m of list) {
      const senderObj = await userStore.findById(m.sender);
      populated.push({ ...m, sender: senderObj });
    }
    return populated;
  }
};

module.exports = {
  userStore,
  workspaceStore,
  memberStore,
  fileStore,
  messageStore
};
