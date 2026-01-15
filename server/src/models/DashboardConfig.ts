import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class DashboardConfig extends Model {
  public id!: string;
  public businessId!: string;
  public userId?: string;
  public config!: any; // JSONB field for flexible configuration
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DashboardConfig.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        widgets: ['stats', 'recent_tasks', 'calendar', 'emails'],
        statsToShow: ['unread_emails', 'todays_meetings', 'pending_tasks', 'missed_calls']
      }
    }
  },
  {
    sequelize,
    tableName: 'dashboard_configs',
    timestamps: true,
    underscored: true
  }
);
