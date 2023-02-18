import { Model } from 'sequelize';
import { MESSAGE_FROM, MIGRATION_EMAIL } from '../constants';

interface IEmailTemplateAttributes {
  id: number;
  templateType: string;
  templateName: string;
  templateDescription: string;
  accountId: number | null;
  sender: string;
  templateObj: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export default (sequelize: any, DataTypes: any) => {
  class EmailTemplates extends Model<IEmailTemplateAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models: any) {
      // define association here
    }
  }
  EmailTemplates.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(11),
      },
      templateType: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      templateName: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      templateDescription: {
        type: DataTypes.STRING(256),
      },
      accountId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'account',
          key: 'id',
        },
      },
      sender: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: JSON.stringify(MESSAGE_FROM),
      },
      templateObj: {
        allowNull: false,
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      createdBy: {
        allowNull: false,
        type: DataTypes.STRING(100),
        defaultValue: MIGRATION_EMAIL,
      },
      updatedBy: {
        allowNull: false,
        type: DataTypes.STRING(100),
        defaultValue: MIGRATION_EMAIL,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'EmailTemplates',
      tableName: 'email_templates',
      underscored: true,
    }
  );
  return EmailTemplates;
};