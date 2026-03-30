# Instructions

## Setup Instructions

1. Open the project in your IDE (VSCode recommended)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   tsc --project tsconfig.build.json
   ```

## Configuration

### Environment Variables

Create a `.env` file or set the following environment variables:

```bash
# Server Configuration
PORT=5000
ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_DATABASE=email_service
DB_DRIVER=mysql

# SMTP Configuration (for Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_APIKEY_PUBLIC=your_smtp_username
SMTP_APIKEY_PRIVATE=your_smtp_password

# AWS Configuration (for SES and SQS)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
EMAIL_SERVICE_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/your-account/email-queue

# DataDog Configuration
DD_API_KEY=your_datadog_api_key
DD_APP_KEY=your_datadog_app_key
```

### Configuration File

Edit `config/env.json` for additional configuration:
- Server settings (port, environment)
- SMTP server details
- Database connection settings
- SQS queue URLs
- PCN UI URL for email links

## Database Setup

### Run Migrations

Create the email_templates table:
```bash
npm run dbm:up
```

### Seed Data (Optional)

Populate initial email templates:
```bash
npm run dbs:up
```

### Create New Migration

```bash
npm run dbm:create -- migration-name
```

### Rollback Migration

```bash
npm run dbm:down
```

## Running the Application

### Development Mode

Uses nodemon for auto-restart on file changes:
```bash
npm run dev
```

### Production Mode

Compiles TypeScript and runs compiled JavaScript:
```bash
npm start
```

The service will:
1. Initialize DataDog monitoring
2. Start the SQS consumer
3. Start the Express server on the configured port

## API Endpoints

### Health Check
```bash
GET /api/v1/health
```
Returns: `Ok` with 200 status

### Version
```bash
GET /api/v1/version
```
Returns: Content of `version.txt` file

## Email Templates

### Template Structure

Email templates are stored in the `email_templates` database table with:
- `templateType`: Unique identifier for the template
- `templateName`: Human-readable name
- `templateDescription`: Template description
- `accountId`: Account-specific template (null for global)
- `sender`: JSON string with sender info `{"name": "...", "address": "..."}`
- `templateObj`: JSON string with `subject`, `bodyTxt`, `bodyHtml`

### Template Variables

Templates use Handlebars syntax and support these variables:
- `{{video.name}}` - Video name
- `{{video.slidesCount}}` - Number of slides
- `{{url}}` - Custom URL
- `{{host}}` - PCN UI host
- `{{copyrightYear}}` - Current year

Example template:
```json
{
  "subject": "Welcome {{receiver.firstName}}!",
  "bodyTxt": "Hello {{receiver.firstName}} {{receiver.lastName}}",
  "bodyHtml": "<p>Hello <strong>{{receiver.firstName}}</strong></p>"
}
```

## SQS Message Format

### Message Structure

Messages should have:
- **MessageAttributes**: `type` attribute with template type
- **Body**: JSON string with macros

Example SQS message:
```json
{
  "MessageAttributes": {
    "type": {
      "StringValue": "welcome_email",
      "DataType": "String"
    }
  },
  "Body": "{\"receiver\":{\"id\":1,\"email\":\"user@example.com\",\"firstName\":\"John\",\"lastName\":\"Doe\"},\"accountId\":1,\"email\":\"user@example.com\"}"
}
```

### Body Macros

The message body must include:
- `email`: Recipient email address
- `accountId`: Account ID for template lookup
- `receiver`: User object with details
- Optional: `video`, `publisher`, `url` for template variables

## Development

### Linting

Check for linting errors:
```bash
npm run lint
```

Lint staged files:
```bash
npm run lint-staged
```

### Code Formatting

Check formatting:
```bash
npm run prettier-check
```

Fix formatting issues:
```bash
npm run prettier-fix
```

### Type Checking

Run TypeScript compiler without emitting files:
```bash
npm run tsc-check
```

### Testing

Run all tests:
```bash
npm test
```

Watch mode for development:
```bash
npm run test-watch
```

## Email Transport Options

### AWS SES (Default)

Recommended for production. Requires AWS credentials configured.

```typescript
emailSender.setEmailApi(new NodemailerEmailApi('SES'));
```

### SMTP

For development or when SES is unavailable.

```typescript
emailSender.setEmailApi(new NodemailerEmailApi('SMTP'));
```

## Troubleshooting

### SQS Messages Not Processing

1. Check SQS queue URL in configuration
2. Verify AWS credentials have SQS permissions
3. Check CloudWatch logs for errors
4. Verify message format matches expected structure

### Email Not Sending

1. Check email template exists in database
2. Verify SMTP/SES credentials are correct
3. Check sender email is verified in SES (if using SES)
4. Review Winston logs for detailed error messages

### Database Connection Issues

1. Verify database credentials in environment variables
2. Check database server is running
3. Ensure migrations have been run
4. Test connection with `npx sequelize-cli db:migrate:status`

### TypeScript Compilation Errors

1. Run `npm run tsc-check` to see all errors
2. Check `tsconfig.json` and `tsconfig.build.json` settings
3. Ensure all dependencies have type definitions installed

## Monitoring

### DataDog Integration

The service automatically initializes DataDog monitoring on startup. Configure DataDog API keys in environment variables or `config/env.json`.

### Logging

Winston logger is used throughout the application:
- Info level: Successful operations, SQS message processing
- Error level: Errors, failed email sends

Logs are output to console and can be configured to send to external services.

## Notes

- The EmailSender follows a singleton pattern - use `EmailSender.getInstance()`
- Always activate the EmailSender before use: `emailSender.activate()`
- SQS messages are automatically deleted on successful processing
- Failed messages remain in queue for retry unless marked with `shouldDeleteMessage: true`
- All email templates use Handlebars for variable interpolation

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag
