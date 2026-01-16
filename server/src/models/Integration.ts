import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { IntegrationType } from '@businesshub/shared';

export class Integration extends Model {
  public id!: string;
  public businessId!: string;
  public departmentId?: string;
  public name!: string;
  public type!: IntegrationType;
  public description!: string | null;
  public config!: object;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Integration.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'businesses',
        key: 'id'
      },
      field: 'business_id'
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      },
      field: 'department_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(...Object.values(IntegrationType)),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  },
  {
    sequelize,
    tableName: 'integrations',
    underscored: true
  }
);
