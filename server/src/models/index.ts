import { User } from './User';
import { Business } from './Business';
import { Permission } from './Permission';
import { Integration } from './Integration';
import { Department } from './Department';
import { DashboardConfig } from './DashboardConfig';

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

Business.hasMany(Department, { foreignKey: 'businessId' });
Department.belongsTo(Business, { foreignKey: 'businessId' });

Department.hasMany(Permission, { foreignKey: 'departmentId' });
Permission.belongsTo(Department, { foreignKey: 'departmentId' });

Business.hasMany(DashboardConfig, { foreignKey: 'businessId' });
DashboardConfig.belongsTo(Business, { foreignKey: 'businessId' });

User.hasMany(DashboardConfig, { foreignKey: 'userId' });
DashboardConfig.belongsTo(User, { foreignKey: 'userId' });

export { User, Business, Permission, Integration, Department, DashboardConfig };

