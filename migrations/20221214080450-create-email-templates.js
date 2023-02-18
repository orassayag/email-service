const subject = `
  {{#if video.slides.count}}
  Slides for the video - {{{video.name}}} are now available.
  {{else if video.slides.isAnalysisSuccess}}
  Slide Analysis of the video - {{{video.name}}} is Completed.
  {{else}}
  Slide Analysis for the video {{{video.name}}} was unsuccessful.
  {{/if}}
`;
const bodyTxt = `
Hello {{{receiver.firstName}}} {{{receiver.lastName}}},

{{#if video.slides.isAnalysisSuccess}}
Slide analysis for the video - {{{video.name}}} has been completed successfully.
{{#if video.slides.count}}

{{video.slides.count}} slides have been created!
{{else}}

No slides were detected in this video.
{{/if}}
{{else}}

There was an error in the slide analysis of this video.
{{/if}}
{{#unless video.slides.isAnalysisSuccess}}

No slides could be detected or created.
Click here {{host}}/editorial?videoId={{video.id}}&acid={{receiver.accountId}} to rerun the analysis.
{{/unless}}
{{#unless video.slides.count}}
{{else if video.slides.isAnalysisSuccess}}

Click here {{host}}/editorial?videoId={{video.id}}&acid={{receiver.accountId}} to review, publish and share the slides.
{{/unless}}

Or Assayag
`;
const bodyHtml = `
  <div style="font-family: Arial,Helvetica,SansSerif;">
    <b>Hello {{receiver.firstName}} {{receiver.lastName}},</b>
    {{#if video.slides.isAnalysisSuccess}}
    <p style="white-space: pre-line">
      Slide analysis for the video - {{{video.name}}} has been completed{{#if video.slides.count}} successfully{{/if}}.
    </p>
    <p>
      {{#if video.slides.count}}
      {{video.slides.count}} slides have been created!
      {{else}}
      No slides were detected in this video.
      {{/if}}
    </p>
    {{else}}
    <p style="white-space: pre-line">
      There was an error in the slide analysis of this video.
    </p>
    {{/if}}
    {{#unless video.slides.isAnalysisSuccess}}
    <p>
      No slides could be detected or created.<br>
      Click <a href="{{host}}/editorial?videoId={{video.id}}&acid={{receiver.accountId}}">here</a> to rerun the analysis.
    </p>
    {{/unless}}
    {{#unless video.slides.count}}
    {{else if video.slides.isAnalysisSuccess}}
    <p>
      Click <a href="{{host}}/editorial?videoId={{video.id}}&acid={{receiver.accountId}}">here</a> to review, publish and share the slides.
    </p>
    {{/unless}}
    <p style="margin-top:30px;">
    Or Assayag
    </p>
  </div>
  `;
const templateObj = {
  subject,
  bodyTxt,
  bodyHtml,
};

const addProcedure = (actionString) => `
          CREATE TRIGGER validate_email_template_type_unique_${actionString}
          BEFORE ${actionString}
          ON email_templates
          FOR EACH ROW
          BEGIN
              DECLARE count INT;
              SELECT COUNT(*)
              INTO count
              FROM email_templates
              WHERE template_type = NEW.template_type
                AND NEW.account_id IS NULL
                AND id != NEW.id;
              IF count > 0 THEN
                  SIGNAL SQLSTATE '45000'
                      SET MESSAGE_TEXT = 'Name must be unique';
              END IF;
          END;
        `;

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction;
    try {
      transaction = await queryInterface.sequelize.transaction();
      await queryInterface.createTable(
        'email_templates',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER(11),
          },
          templateType: {
            allowNull: false,
            type: Sequelize.STRING(100),
            field: 'template_type',
          },
          templateName: {
            allowNull: false,
            type: Sequelize.STRING(100),
            field: 'template_name',
          },
          templateDescription: {
            type: Sequelize.STRING(256),
            field: 'template_description',
          },
          accountId: {
            type: Sequelize.INTEGER(11),
            allowNull: true,
            defaultValue: null,
            references: {
              model: 'accounts',
              key: 'id',
            },
            field: 'account_id',
          },
          sender: {
            type: Sequelize.STRING(100),
            allowNull: false,
            defaultValue: JSON.stringify({
              name: 'Or Assayag',
              address: 'no-reply@orassayag.com',
            }),
          },
          templateObj: {
            allowNull: false,
            type: Sequelize.TEXT,
            defaultValue: '{}',
            field: 'template_obj',
          },
          createdBy: {
            allowNull: false,
            type: Sequelize.STRING(100),
            defaultValue: 'migration@orassayag.com',
            field: 'created_by',
          },
          updatedBy: {
            allowNull: false,
            type: Sequelize.STRING(100),
            defaultValue: 'migration@orassayag.com',
            field: 'updated_by',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
            field: 'created_at',
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
            field: 'updated_at',
          },
        },
        { transaction }
      );
      await queryInterface.addConstraint(
        'email_templates',
        {
          fields: ['template_type', 'account_id'],
          type: 'unique',
          name: 'unique_template_type_account_id',
          underscore: true,
        },
        { transaction }
      );
      await queryInterface.sequelize.query(addProcedure('UPDATE'), {
        transaction,
      });
      await queryInterface.sequelize.query(addProcedure('INSERT'), {
        transaction,
      });
      await queryInterface.bulkInsert(
        'email_templates',
        [
          {
            template_type: 'SLIDE_ANALYSIS_COMPLETED',
            template_name: 'Slide Analysis Completed',
            template_description:
              'After a slide analysis triggered for a video the analysis can take some time (depending on the video length). Once the processing is completed the video owner will get a mail with a link to the slides curation page.',
            template_obj: JSON.stringify(templateObj),
          },
        ],
        { transaction }
      );
    } catch (err) {
      // Transaction is not really needed here, as crateTable cannot be transactioned in mySql.
      // Leaving it here for future reference.
      transaction.rollback();
      await queryInterface.dropTable('email_templates');
      throw err;
    }
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('email_templates');
  },
};
