# Operations and Deployment

## Local setup

```bash
pnpm install
pnpm dev
```

Use the URL printed by Vite. Data is stored in the browser profile used to open the application.

## Daily operating procedure

1. Export a JSON backup before a major inventory session.
2. Enter or update measurements by category.
3. Confirm assumptions with a test stack.
4. Build and tag lots before photography.
5. Print a lot card and keep it with the physical group.
6. Complete the eight-photo checklist.
7. Export the lot register after significant sales or status changes.

## Backup and recovery

- JSON is the complete portable backup.
- CSV is a reporting extract and does not preserve nested configuration.
- Browser storage can be cleared by browser settings, so exports are required for reliable recovery.
- Restore/import is planned; the current JSON export already provides the migration format.

## Deployment options

### Current recommendation

Run locally on the designated warehouse laptop or tablet browser. This matches the single-device storage model.

### Shared deployment prerequisites

- SQLite or hosted relational database
- Authentication and roles
- Server-side validation
- Audit log
- Automated backup
- HTTPS
- Media storage strategy
- Tested import and restore

## Version control recommendation

The source should ultimately live in a private GitHub repository with protected main branch, feature branches, pull requests, and automated test/build checks. GitHub publication was not available during this documentation pass because the local environment lacked the required authenticated GitHub CLI.
