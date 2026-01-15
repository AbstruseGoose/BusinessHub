import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { UserRole } from '@businesshub/shared';

export class User extends Model {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
  public role!: UserRole;
  public isActive!: boolean;
  public mustChangePassword!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: UserRole.ASSISTANT
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'must_change_password'
    }
  },
  {
    sequelize,
    tableName: 'users',
    underscored: true
  }
);
