import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class Business extends Model {
  public id!: string;
  public name!: string;
  public description?: string;
  public logoUrl?: string;
  public color!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Business.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'logo_url'
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#61AFEF'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  },
  {
    sequelize,
    tableName: 'businesses',
    underscored: true
  }
);
