import { User } from './User';
import { Business } from './Business';
import { Permission } from './Permission';
import { Integration } from './Integration';

// Define associations
User.belongsToMany(Business, {
  through: Permission,
  foreignKey: 'userId',
  as: 'businesses'
});

Business.belongsToMany(User, {
  through: Permission,
  foreignKey: 'businessId',
  as: 'users'
});

User.hasMany(Permission, { foreignKey: 'userId' });
Permission.belongsTo(User, { foreignKey: 'userId' });

Business.hasMany(Permission, { foreignKey: 'businessId' });
Permission.belongsTo(Business, { foreignKey: 'businessId' });

Business.hasMany(Integration, { foreignKey: 'businessId' });
Integration.belongsTo(Business, { foreignKey: 'businessId' });

export { User, Business, Permission, Integration };

