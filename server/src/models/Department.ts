import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class Department extends Model {
  public id!: string;
  public businessId!: string;
  public name!: string;
  public description?: string;
  public phone?: string;
  public email?: string;
  public managerId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Department.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'business_id',
      references: {
        model: 'businesses',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'manager_id',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'departments',
    timestamps: true,
    underscored: true
  }
);
