import db from './schemas';
import EmailTemplates from './schemas/EmailTemplatesSchema';

const { Op } = db.Sequelize;

export default class Model {
  constructor() {
    throw new Error('Cannot create an instance.');
  }

  static findEmailTemplateByType = async ({ templateType, accountId }: any): Promise<typeof EmailTemplates> =>
    db.EmailTemplates.findOne({
      where: {
        templateType,
        [Op.and]: {
          [Op.or]: [{ accountId }, { accountId: null }],
        },
      },
    });
}
