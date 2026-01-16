import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export class Project extends Model {
  public id!: string;
  public departmentId!: string;
  public name!: string;
  public description?: string;
  public status!: ProjectStatus;
  public priority!: ProjectPriority;
  public startDate?: Date;
  public endDate?: Date;
  public managerId?: string;
  public progress!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'department_id',
      references: {
        model: 'departments',
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
    status: {
      type: DataTypes.ENUM(...Object.values(ProjectStatus)),
      allowNull: false,
      defaultValue: ProjectStatus.PLANNING
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(ProjectPriority)),
      allowNull: false,
      defaultValue: ProjectPriority.MEDIUM
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date'
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'manager_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    }
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: true,
    underscored: true
  }
);
