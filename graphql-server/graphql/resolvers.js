// schema/resolvers.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Team = require("../models/team");
const Project = require("../models/project");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_secret";

function checkAdmin(user) {
  if (!user || user.role !== "Admin") {
    throw new Error("Not authorized as Admin");
  }
}

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return User.findById(user.id);
    },
    users: async (_, __, { user }) => {
      checkAdmin(user); // Only admin can view all users
      return User.find();
    },
    user: async (_, { id }, { user }) => {
      checkAdmin(user);
      return User.findById(id);
    },
    teams: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      // Admin sees all teams; members see only teams they belong to.
      if (user.role === "Admin") {
        return Team.find().populate("members");
      } else {
        return Team.find({ members: user.id }).populate("members");
      }
    },
    team: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const team = await Team.findById(id).populate("members");
      if (!team) throw new Error("Team not found");
      // If not admin, ensure the user is part of the team.
      if (user.role !== "Admin" && !team.members.some((m) => m._id.toString() === user.id)) {
        throw new Error("Not authorized to view this team");
      }
      return team;
    },
    projects: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      // Admin sees all projects
      if (user.role === "Admin") {
        return Project.find().populate({
          path: "team",
          populate: { path: "members" },
        });
      } else {
        // For members, first find teams where the user is a member...
        const teams = await Team.find({ members: user.id });
        const teamIds = teams.map((t) => t._id);
        // ...then find projects assigned to one of those teams.
        return Project.find({ team: { $in: teamIds } }).populate({
          path: "team",
          populate: { path: "members" },
        });
      }
    },
    project: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const project = await Project.findById(id).populate({
        path: "team",
        populate: { path: "members" },
      });
      if (!project) throw new Error("Project not found");
      // If not admin, check that the project's team includes the user.
      if (user.role !== "Admin") {
        if (!project.team || !project.team.members.some((m) => m._id.toString() === user.id)) {
          throw new Error("Not authorized to view this project");
        }
      }
      return project;
    },
  },

  Mutation: {
    // (Leave your Mutation resolvers unchanged unless you wish to add further authorization checks.)
    logout: async (_, __, { res }) => {
      if (res) {
        res.clearCookie("token", { httpOnly: true, secure: false });
      }
      return true;
    },
    register: async (_, { username, email, password, role }, { res }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists with this email");
      }
      const newUser = new User({ username, email, password, role });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: "1d" });
      if (res) {
        res.cookie("token", token, { httpOnly: true });
      }
      return { token, user: newUser };
    },
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const valid = await user.comparePassword(password);
      if (!valid) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
      if (res) {
        res.cookie("token", token, { httpOnly: true });
      }
      return { token, user };
    },
    // Users mutations (createUser, updateUser, deleteUser) and Teams, Projects mutations...
    createUser: async (_, { username, email, password, role }, { user }) => {
      checkAdmin(user);
      const existing = await User.findOne({ email });
      if (existing) {
        throw new Error("Email already in use");
      }
      const newUser = new User({ username, email, password, role });
      await newUser.save();
      return newUser;
    },
    updateUser: async (_, { id, ...update }, { user }) => {
      checkAdmin(user);
      const foundUser = await User.findById(id);
      if (!foundUser) {
        throw new Error("User not found");
      }
      if (update.password) {
        foundUser.password = update.password;
      }
      if (update.username) foundUser.username = update.username;
      if (update.email) foundUser.email = update.email;
      if (update.role) foundUser.role = update.role;
      await foundUser.save();
      return foundUser;
    },
    deleteUser: async (_, { id }, { user }) => {
      checkAdmin(user);
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) throw new Error("User not found");
      return deletedUser;
    },
    createTeam: async (_, { teamName, description, status, slogan, members }, { user }) => {
      checkAdmin(user);
      const team = new Team({ teamName, description, status, slogan, members });
      await team.save();
      return team.populate("members");
    },
    updateTeam: async (_, { id, ...updates }, { user }) => {
      checkAdmin(user);
      const updatedTeam = await Team.findByIdAndUpdate(id, updates, { new: true }).populate("members");
      if (!updatedTeam) throw new Error("Team not found");
      return updatedTeam;
    },
    deleteTeam: async (_, { id }, { user }) => {
      checkAdmin(user);
      const deletedTeam = await Team.findByIdAndDelete(id);
      if (!deletedTeam) throw new Error("Team not found");
      return deletedTeam;
    },
    createProject: async (_, args, { user }) => {
      checkAdmin(user);
      const project = new Project(args);
      await project.save();
      return project.populate("team");
    },
    updateProject: async (_, { id, ...updates }, { user }) => {
      const project = await Project.findById(id).populate("team");
      if (!project) throw new Error("Project not found");

      if (user.role !== "Admin") {
        if (Object.keys(updates).length !== 1 || !("status" in updates)) {
          throw new Error("Team members can only update the project status.");
        }
        if (!project.team) {
          throw new Error("Project is not assigned to any team.");
        }
        const memberIds = project.team.members.map((m) => m.toString());
        if (!memberIds.includes(user.id)) {
          throw new Error("You are not authorized to update this project.");
        }
      }

      const updatedProject = await Project.findByIdAndUpdate(id, updates, { new: true }).populate("team");
      if (!updatedProject) throw new Error("Project not found after update");
      return updatedProject;
    },
    deleteProject: async (_, { id }, { user }) => {
      checkAdmin(user);
      const deletedProject = await Project.findByIdAndDelete(id);
      if (!deletedProject) throw new Error("Project not found");
      return deletedProject;
    },
  },
};

module.exports = resolvers;
