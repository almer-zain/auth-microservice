# Diff Details

Date : 2026-06-15 15:31:21

Directory /home/generalegg/Project-P/blog-be

Total : 63 files,  18445 codes, 65 comments, 138 blanks, all 18648 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.example.env](/.example.env) | Dotenv | 32 | 24 | 7 | 63 |
| [.prettierrc](/.prettierrc) | JSON | 4 | 0 | 1 | 5 |
| [README.md](/README.md) | Markdown | 4 | 0 | 1 | 5 |
| [eslint.config.mjs](/eslint.config.mjs) | JavaScript | 33 | 1 | 2 | 36 |
| [nest-cli.json](/nest-cli.json) | JSON | 14 | 0 | 1 | 15 |
| [package-lock.json](/package-lock.json) | JSON | 17,209 | 0 | 1 | 17,210 |
| [package.json](/package.json) | JSON | 126 | 0 | 1 | 127 |
| [src/app.module.ts](/src/app.module.ts) | TypeScript | 55 | 6 | 9 | 70 |
| [src/common/dto/pagination.dto.ts](/src/common/dto/pagination.dto.ts) | TypeScript | 18 | 0 | 3 | 21 |
| [src/common/entities/base-account.abstract.ts](/src/common/entities/base-account.abstract.ts) | TypeScript | 8 | 0 | 1 | 9 |
| [src/common/types/jwt-types.ts](/src/common/types/jwt-types.ts) | TypeScript | 12 | 0 | 2 | 14 |
| [src/config/namespaces/app.config.ts](/src/config/namespaces/app.config.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/config/namespaces/jwt.config.ts](/src/config/namespaces/jwt.config.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/config/strategies/jwt-access.strategy.ts](/src/config/strategies/jwt-access.strategy.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/config/strategies/jwt-refresh.strategy.ts](/src/config/strategies/jwt-refresh.strategy.ts) | TypeScript | 7 | -1 | 1 | 7 |
| [src/main.ts](/src/main.ts) | TypeScript | 18 | 3 | 5 | 26 |
| [src/modules/admins/admins.controller.ts](/src/modules/admins/admins.controller.ts) | TypeScript | 46 | 0 | 1 | 47 |
| [src/modules/admins/admins.module.ts](/src/modules/admins/admins.module.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/modules/admins/admins.service.ts](/src/modules/admins/admins.service.ts) | TypeScript | 41 | -1 | 7 | 47 |
| [src/modules/admins/dto/create-admin.dto.ts](/src/modules/admins/dto/create-admin.dto.ts) | TypeScript | 18 | -1 | 1 | 18 |
| [src/modules/admins/dto/update-admin.dto.ts](/src/modules/admins/dto/update-admin.dto.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/modules/admins/entities/admin.entity.ts](/src/modules/admins/entities/admin.entity.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/modules/auth/auth.controller.ts](/src/modules/auth/auth.controller.ts) | TypeScript | 34 | 0 | 1 | 35 |
| [src/modules/auth/auth.service.ts](/src/modules/auth/auth.service.ts) | TypeScript | -30 | -1 | -21 | -52 |
| [src/modules/auth/captcha.service.ts](/src/modules/auth/captcha.service.ts) | TypeScript | 10 | 1 | 3 | 14 |
| [src/modules/auth/device.service.ts](/src/modules/auth/device.service.ts) | TypeScript | 9 | 0 | 0 | 9 |
| [src/modules/auth/dto/login.dto.ts](/src/modules/auth/dto/login.dto.ts) | TypeScript | 24 | 0 | 5 | 29 |
| [src/modules/auth/dto/register.dto.ts](/src/modules/auth/dto/register.dto.ts) | TypeScript | 15 | 0 | 2 | 17 |
| [src/modules/auth/dto/reset-password.dto.ts](/src/modules/auth/dto/reset-password.dto.ts) | TypeScript | 2 | 1 | 1 | 4 |
| [src/modules/auth/dto/verify-2fa.dto.ts](/src/modules/auth/dto/verify-2fa.dto.ts) | TypeScript | 15 | 1 | 4 | 20 |
| [src/modules/auth/entities/account-device.entity.ts](/src/modules/auth/entities/account-device.entity.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [src/modules/auth/guard/jwt-auth.guard.ts](/src/modules/auth/guard/jwt-auth.guard.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/modules/auth/guard/rpc-auth.guard.ts](/src/modules/auth/guard/rpc-auth.guard.ts) | TypeScript | -17 | -12 | -4 | -33 |
| [src/modules/health/health.controller.ts](/src/modules/health/health.controller.ts) | TypeScript | 25 | 6 | 6 | 37 |
| [src/modules/health/health.module.ts](/src/modules/health/health.module.ts) | TypeScript | 6 | 0 | -1 | 5 |
| [src/modules/mail/mail.service.ts](/src/modules/mail/mail.service.ts) | TypeScript | 48 | 4 | 10 | 62 |
| [src/modules/mail/templates/new-device.hbs](/src/modules/mail/templates/new-device.hbs) | Handlebars | 108 | 0 | 9 | 117 |
| [src/modules/mail/templates/reset-password.hbs](/src/modules/mail/templates/reset-password.hbs) | Handlebars | 113 | 0 | 10 | 123 |
| [src/modules/permissions/dto/create-permission.dto.ts](/src/modules/permissions/dto/create-permission.dto.ts) | TypeScript | 30 | 0 | 2 | 32 |
| [src/modules/permissions/entities/permission.entity.ts](/src/modules/permissions/entities/permission.entity.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [src/modules/permissions/guards/permissions.guard.ts](/src/modules/permissions/guards/permissions.guard.ts) | TypeScript | 7 | -1 | 1 | 7 |
| [src/modules/permissions/permissions.controller.ts](/src/modules/permissions/permissions.controller.ts) | TypeScript | 32 | 0 | 0 | 32 |
| [src/modules/permissions/permissions.service.ts](/src/modules/permissions/permissions.service.ts) | TypeScript | 51 | 0 | 9 | 60 |
| [src/modules/roles/dto/create-role.dto.ts](/src/modules/roles/dto/create-role.dto.ts) | TypeScript | 28 | 0 | 2 | 30 |
| [src/modules/roles/entities/role.entity.ts](/src/modules/roles/entities/role.entity.ts) | TypeScript | 17 | 0 | 3 | 20 |
| [src/modules/roles/roles.controller.ts](/src/modules/roles/roles.controller.ts) | TypeScript | 9 | 0 | 0 | 9 |
| [src/modules/roles/roles.service.ts](/src/modules/roles/roles.service.ts) | TypeScript | 39 | 0 | 7 | 46 |
| [src/modules/users/dto/create-user.dto.ts](/src/modules/users/dto/create-user.dto.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/modules/users/dto/update-user.dto.ts](/src/modules/users/dto/update-user.dto.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/modules/users/entities/user.entity.ts](/src/modules/users/entities/user.entity.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/modules/users/users.controller.ts](/src/modules/users/users.controller.ts) | TypeScript | 32 | 1 | 0 | 33 |
| [src/modules/users/users.module.ts](/src/modules/users/users.module.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/modules/users/users.service.ts](/src/modules/users/users.service.ts) | TypeScript | 48 | 1 | 5 | 54 |
| [src/utils/auth-decorator.ts](/src/utils/auth-decorator.ts) | TypeScript | -55 | -26 | -7 | -88 |
| [src/utils/auth-decorator.util.ts](/src/utils/auth-decorator.util.ts) | TypeScript | 50 | 29 | 7 | 86 |
| [src/utils/error.util.ts](/src/utils/error.util.ts) | TypeScript | 18 | 7 | 6 | 31 |
| [src/utils/sanitize.util.ts](/src/utils/sanitize.util.ts) | TypeScript | 52 | 23 | 11 | 86 |
| [src/utils/url-format.ts](/src/utils/url-format.ts) | TypeScript | 0 | 0 | -1 | -1 |
| [src/utils/url-format.util.ts](/src/utils/url-format.util.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [test/app.e2e-spec.ts](/test/app.e2e-spec.ts) | TypeScript | 24 | 0 | 6 | 30 |
| [test/jest-e2e.json](/test/jest-e2e.json) | JSON | 9 | 0 | 1 | 10 |
| [tsconfig.build.json](/tsconfig.build.json) | JSON | 4 | 0 | 1 | 5 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 25 | 0 | 1 | 26 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details