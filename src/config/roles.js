const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['credResources']);
roleRights.set(roles[2], ['credResources', 'getUsers', 'manageUsers']);

module.exports = {
  roles,
  roleRights,
};
