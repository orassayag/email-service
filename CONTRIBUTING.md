# Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute to this project. Contributing doesn't just mean submitting pull requests—there are many different ways for you to get involved, including answering questions, reporting issues, improving documentation, or suggesting new features.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists in the [GitHub Issues](https://github.com/orassayag/email-service/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Error logs (if applicable)
   - Your environment details (OS, Node version, database version)

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the code style guidelines below
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### Code Style Guidelines

This project uses:
- **TypeScript** with strict type checking
- **ESLint** with Airbnb TypeScript config
- **Prettier** for code formatting

Before submitting:
```bash
# Format your code
npm run prettier-fix

# Check for linting errors
npm run lint

# Check TypeScript compilation
npm run tsc-check

# Run tests
npm test
```

### Coding Standards

1. **Type safety**: Avoid using `any` - define proper types in `src/types/`
2. **Error handling**: Use custom `SQSError` class for SQS-related errors
3. **Logging**: Use Winston logger, avoid logging sensitive data (PHI, credentials)
4. **Singleton pattern**: Follow the existing EmailSender singleton implementation
5. **Database operations**: Use Sequelize ORM, avoid raw SQL queries
6. **Environment variables**: Never hardcode credentials, use environment variables
7. **Naming**: Use clear, descriptive names for variables and functions

### Adding New Features

When adding new features:
1. Create appropriate types in `src/types/`
2. Add service logic with proper error handling
3. Update database migrations if needed (in `migrations/`)
4. Add unit tests in `__tests__/` folders
5. Update documentation (README, INSTRUCTIONS)
6. Test thoroughly with both SMTP and SES transports

### Security Guidelines

1. **Never commit secrets**: Use environment variables for all credentials
2. **Input validation**: Validate all external inputs (SQS messages, API requests)
3. **SQL injection**: Always use Sequelize parameterized queries
4. **Email injection**: Validate email addresses and sanitize content
5. **Error messages**: Don't expose internal details in error responses

### Database Changes

When modifying the database schema:
1. Create a new migration using:
   ```bash
   npm run dbm:create -- migration-name
   ```
2. Write both `up` and `down` migration methods
3. Test migration locally before committing
4. Document breaking changes in the pull request

### Testing Guidelines

1. Write unit tests for new functionality
2. Use Jest with ts-jest preset
3. Mock external dependencies (AWS, database, SMTP)
4. Test both success and error scenarios
5. Ensure tests pass before submitting PR

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test-watch
```

## Questions or Need Help?

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag

Thank you for contributing! 🙏
