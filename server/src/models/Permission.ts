import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class Permission extends Model {
  public id!: string;
  public userId!: string;
  public businessId!: string;
  public departmentId?: string;
  public canAccessEmails!: boolean;
  public canAccessCalendar!: boolean;
  public canAccessDocuments!: boolean;
  public canAccessPhone!: boolean;
  public canManageTasks!: boolean;
  public canAccessIntegrations!: boolean;
  public canManageDepartments!: boolean;
  public readonly grantedAt!: Date;
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
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
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'department_id',
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    canAccessEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_access_emails'
    },
    canAccessCalendar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_access_calendar'
    },
    canAccessDocuments: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_access_documents'
    },
    canAccessPhone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_access_phone'
    },
    canManageTasks: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_manage_tasks'
    },
    canAccessIntegrations: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_access_integrations'
    },
    canManageDepartments: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'can_manage_departments'
    },
    grantedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'granted_at'
    }
  },
  {
    sequelize,
    tableName: 'permissions',
    underscored: true,
    timestamps: false
  }
);
