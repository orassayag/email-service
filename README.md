# Email Service

A Node.js microservice for sending templated emails via AWS SQS, built with TypeScript. The service consumes messages from SQS queues, fetches email templates from a database, renders them with Handlebars, and sends emails via AWS SES or SMTP.

Built in February 2023. This production-ready service handles transactional emails with template management, queue-based processing, and comprehensive monitoring.

## Features

- 📬 **AWS SQS Integration** - Consumes messages from SQS queues for reliable email delivery
- 📧 **Multiple Transport Options** - Supports AWS SES and SMTP (Nodemailer)
- 🎨 **Template Management** - Database-driven email templates with Handlebars rendering
- 🏢 **Multi-tenant Support** - Account-specific email templates
- 🔄 **Automatic Retry** - Failed messages remain in queue for retry
- 📊 **DataDog Monitoring** - Built-in DataDog integration for observability
- 🛡️ **Type-Safe** - Written in TypeScript with strict type checking
- 🗄️ **Database Migrations** - Sequelize ORM with migration support
- 🏥 **Health Checks** - Health and version endpoints for monitoring
- ✅ **Tested** - Comprehensive unit tests with Jest

## Architecture

```mermaid
graph TB
    SQS[AWS SQS Queue] -->|Message| Consumer[SQS Consumer]
    Consumer -->|Parse| Handler[Message Handler]
    Handler -->|Fetch Template| DB[(Database<br/>email_templates)]
    Handler -->|Render| Handlebars[Handlebars Engine]
    Handlebars -->|Compile| Email[Email Content]
    Email -->|Send| Sender{Email Sender}
    Sender -->|Option 1| SES[AWS SES]
    Sender -->|Option 2| SMTP[SMTP Server]
    Handler -->|Log| Logger[Winston Logger]
    Logger -->|Ship| DataDog[DataDog]
    
    API[Express API] -->|Health Check| Health[/health]
    API -->|Version| Version[/version]
    
    style SQS fill:#FF9900
    style DB fill:#4479A1
    style SES fill:#FF9900
    style DataDog fill:#632CA6
```

## Getting Started

### Prerequisites

- Node.js v14 or higher
- MySQL or MariaDB
- AWS account (for SQS and SES)
- SMTP server (alternative to SES)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/orassayag/email-service.git
cd email-service
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (see [Configuration](#configuration))

4. Run database migrations:
```bash
npm run dbm:up
```

5. Build the project:
```bash
npm start
```

### Configuration

Create environment variables or configure `config/env.json`:

```bash
# Server
PORT=5000
ENV=production

# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_DATABASE=email_service

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
EMAIL_SERVICE_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/account/queue

# SMTP (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_APIKEY_PUBLIC=your_username
SMTP_APIKEY_PRIVATE=your_password

# DataDog (optional)
DD_API_KEY=your_datadog_key
DD_APP_KEY=your_datadog_app_key
```

See [INSTRUCTIONS.md](INSTRUCTIONS.md) for detailed configuration options.

## Usage

### Starting the Service

**Development mode with auto-reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### Sending Emails via SQS

Send a message to your SQS queue:

```json
{
  "MessageAttributes": {
    "type": {
      "StringValue": "welcome_email",
      "DataType": "String"
    }
  },
  "Body": "{\"receiver\":{\"id\":1,\"email\":\"user@example.com\",\"firstName\":\"John\",\"lastName\":\"Doe\"},\"accountId\":1,\"email\":\"user@example.com\",\"url\":\"https://example.com/verify\"}"
}
```

### Creating Email Templates

Email templates are stored in the `email_templates` table:

```sql
INSERT INTO email_templates (
  template_type,
  template_name,
  account_id,
  sender,
  template_obj
) VALUES (
  'welcome_email',
  'Welcome Email',
  1,
  '{"name":"Support Team","address":"support@example.com"}',
  '{"subject":"Welcome {{receiver.firstName}}!","bodyTxt":"Hello {{receiver.firstName}}","bodyHtml":"<p>Hello <strong>{{receiver.firstName}}</strong></p>"}'
);
```

### API Endpoints

**Health Check:**
```bash
curl http://localhost:5000/api/v1/health
# Returns: Ok
```

**Version:**
```bash
curl http://localhost:5000/api/v1/version
# Returns: version from version.txt
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **start** | `npm start` | Build and run in production mode |
| **dev** | `npm run dev` | Run in development mode with auto-reload |
| **test** | `npm test` | Run all tests |
| **test-watch** | `npm run test-watch` | Run tests in watch mode |
| **lint** | `npm run lint` | Check for linting errors |
| **prettier-check** | `npm run prettier-check` | Check code formatting |
| **prettier-fix** | `npm run prettier-fix` | Fix code formatting |
| **tsc-check** | `npm run tsc-check` | Type-check without emitting files |
| **dbm:create** | `npm run dbm:create -- name` | Create a new migration |
| **dbm:up** | `npm run dbm:up` | Run all pending migrations |
| **dbm:down** | `npm run dbm:down` | Rollback last migration |
| **dbs:up** | `npm run dbs:up` | Run database seeds |

## Project Structure

```
email-service/
├── config/
│   ├── env.js              # Environment configuration
│   └── env.json            # Configuration file
├── migrations/             # Database migrations
├── src/
│   ├── logging/           # Winston & DataDog logging
│   ├── schemas/           # Sequelize models
│   ├── sqs/               # SQS consumer & handlers
│   │   ├── index.ts       # SQS consumer setup
│   │   ├── handleMessage.ts  # Message processing
│   │   ├── handleError.ts    # Error handling
│   │   └── SQSError.ts       # Custom error class
│   ├── testUtils/         # Test utilities
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   │   ├── emailSender/   # Email sender singleton
│   │   ├── NodemailerEmailApi.ts  # Nodemailer implementation
│   │   ├── getTransporter.ts      # Transport factory
│   │   └── prepareEmail.ts        # Email preparation
│   ├── app.ts             # Express application
│   ├── constants.ts       # Application constants
│   ├── index.ts           # Application entry point
│   └── Model.ts           # Database model interface
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── CONTRIBUTING.md        # Contribution guidelines
├── INSTRUCTIONS.md        # Detailed setup instructions
└── README.md             # This file
```

## Error Handling

The service uses a custom `SQSError` class for controlled error handling:

- **shouldDeleteMessage: true** - Removes message from queue (invalid format, missing template)
- **shouldDeleteMessage: false** - Keeps message in queue for retry (temporary failures)

Error logs include message details for debugging while avoiding sensitive data exposure.

## Testing

Run the test suite:
```bash
npm test
```

Tests include:
- Unit tests for email preparation
- Email sender singleton tests
- Mock implementations for AWS services
- Test utilities in `src/testUtils/`

## Technology Stack

- **Runtime**: Node.js v14+
- **Language**: TypeScript 4.1
- **Framework**: Express 4.18
- **Queue**: AWS SQS (sqs-consumer)
- **Email**: AWS SES, Nodemailer
- **Database**: MariaDB/MySQL (Sequelize ORM)
- **Templates**: Handlebars 4.7
- **Logging**: Winston, DataDog
- **Testing**: Jest, ts-jest
- **Linting**: ESLint (Airbnb TypeScript)
- **Formatting**: Prettier

## Monitoring & Logging

### DataDog Integration
Automatic DataDog monitoring initialization on startup. Configure API keys in environment variables.

### Winston Logging
Structured logging throughout the application:
- Info: Successful operations, message processing
- Error: Failures, invalid messages

### Health Checks
Built-in endpoints for monitoring:
- `/api/v1/health` - Service health status
- `/api/v1/version` - Application version

## Security

- Never hardcodes credentials (uses environment variables)
- Validates all SQS message inputs
- Uses Sequelize parameterized queries
- Sanitizes email content before sending
- No sensitive data in error logs
- See [CONTRIBUTING.md](CONTRIBUTING.md) for security guidelines

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code of conduct
- Development workflow
- Coding standards
- Security guidelines
- Testing requirements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag

## Acknowledgments

- Built with best practices for production microservices
- Follows AWS Well-Architected Framework principles
- Implements singleton pattern for email sender
- Uses queue-based architecture for reliability
