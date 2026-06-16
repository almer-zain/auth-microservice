# Details

Date : 2026-06-15 15:52:22

Directory /home/generalegg/Project-P/blog-be/src

Total : 67 files,  2505 codes, 235 comments, 469 blanks, all 3209 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/app.module.ts](/src/app.module.ts) | TypeScript | 180 | 22 | 19 | 221 |
| [src/common/decorator/permissions.decorator.ts](/src/common/decorator/permissions.decorator.ts) | TypeScript | 4 | 1 | 1 | 6 |
| [src/common/decorator/sanitize.decorator.ts](/src/common/decorator/sanitize.decorator.ts) | TypeScript | 11 | 0 | 1 | 12 |
| [src/common/dto/pagination.dto.ts](/src/common/dto/pagination.dto.ts) | TypeScript | 18 | 0 | 3 | 21 |
| [src/common/entities/base-account.abstract.ts](/src/common/entities/base-account.abstract.ts) | TypeScript | 44 | 4 | 14 | 62 |
| [src/common/types/jwt-types.ts](/src/common/types/jwt-types.ts) | TypeScript | 12 | 0 | 2 | 14 |
| [src/config/namespaces/app.config.ts](/src/config/namespaces/app.config.ts) | TypeScript | 6 | 0 | 2 | 8 |
| [src/config/namespaces/jwt.config.ts](/src/config/namespaces/jwt.config.ts) | TypeScript | 7 | 0 | 2 | 9 |
| [src/config/strategies/jwt-access.strategy.ts](/src/config/strategies/jwt-access.strategy.ts) | TypeScript | 28 | 0 | 3 | 31 |
| [src/config/strategies/jwt-refresh.strategy.ts](/src/config/strategies/jwt-refresh.strategy.ts) | TypeScript | 33 | 2 | 6 | 41 |
| [src/main.ts](/src/main.ts) | TypeScript | 91 | 16 | 20 | 127 |
| [src/modules/admins/admins.controller.spec.ts](/src/modules/admins/admins.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/admins/admins.controller.ts](/src/modules/admins/admins.controller.ts) | TypeScript | 76 | 0 | 7 | 83 |
| [src/modules/admins/admins.module.ts](/src/modules/admins/admins.module.ts) | TypeScript | 12 | 0 | 2 | 14 |
| [src/modules/admins/admins.service.spec.ts](/src/modules/admins/admins.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/admins/admins.service.ts](/src/modules/admins/admins.service.ts) | TypeScript | 99 | 6 | 23 | 128 |
| [src/modules/admins/dto/create-admin.dto.ts](/src/modules/admins/dto/create-admin.dto.ts) | TypeScript | 41 | 0 | 6 | 47 |
| [src/modules/admins/dto/update-admin.dto.ts](/src/modules/admins/dto/update-admin.dto.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/modules/admins/entities/admin.entity.ts](/src/modules/admins/entities/admin.entity.ts) | TypeScript | 5 | 2 | 2 | 9 |
| [src/modules/auth/auth.controller.spec.ts](/src/modules/auth/auth.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/auth/auth.controller.ts](/src/modules/auth/auth.controller.ts) | TypeScript | 70 | 0 | 9 | 79 |
| [src/modules/auth/auth.module.ts](/src/modules/auth/auth.module.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/modules/auth/auth.service.spec.ts](/src/modules/auth/auth.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/auth/auth.service.ts](/src/modules/auth/auth.service.ts) | TypeScript | 214 | 28 | 56 | 298 |
| [src/modules/auth/captcha.service.ts](/src/modules/auth/captcha.service.ts) | TypeScript | 51 | 5 | 11 | 67 |
| [src/modules/auth/device.service.ts](/src/modules/auth/device.service.ts) | TypeScript | 70 | 9 | 9 | 88 |
| [src/modules/auth/dto/login.dto.ts](/src/modules/auth/dto/login.dto.ts) | TypeScript | 26 | 0 | 6 | 32 |
| [src/modules/auth/dto/register.dto.ts](/src/modules/auth/dto/register.dto.ts) | TypeScript | 38 | 0 | 6 | 44 |
| [src/modules/auth/dto/reset-password.dto.ts](/src/modules/auth/dto/reset-password.dto.ts) | TypeScript | 26 | 1 | 5 | 32 |
| [src/modules/auth/dto/verify-2fa.dto.ts](/src/modules/auth/dto/verify-2fa.dto.ts) | TypeScript | 15 | 1 | 4 | 20 |
| [src/modules/auth/entities/account-device.entity.ts](/src/modules/auth/entities/account-device.entity.ts) | TypeScript | 30 | 0 | 11 | 41 |
| [src/modules/auth/entities/auth.entity.ts](/src/modules/auth/entities/auth.entity.ts) | TypeScript | 1 | 0 | 1 | 2 |
| [src/modules/auth/guard/jwt-auth.guard.ts](/src/modules/auth/guard/jwt-auth.guard.ts) | TypeScript | 4 | 14 | 3 | 21 |
| [src/modules/health/health.controller.ts](/src/modules/health/health.controller.ts) | TypeScript | 41 | 6 | 10 | 57 |
| [src/modules/health/health.module.ts](/src/modules/health/health.module.ts) | TypeScript | 15 | 0 | 2 | 17 |
| [src/modules/mail/mail.service.ts](/src/modules/mail/mail.service.ts) | TypeScript | 88 | 5 | 14 | 107 |
| [src/modules/mail/templates/new-device.hbs](/src/modules/mail/templates/new-device.hbs) | Handlebars | 108 | 0 | 9 | 117 |
| [src/modules/mail/templates/reset-password.hbs](/src/modules/mail/templates/reset-password.hbs) | Handlebars | 134 | 0 | 12 | 146 |
| [src/modules/permissions/dto/create-permission.dto.ts](/src/modules/permissions/dto/create-permission.dto.ts) | TypeScript | 31 | 0 | 3 | 34 |
| [src/modules/permissions/dto/update-permission.dto.ts](/src/modules/permissions/dto/update-permission.dto.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [src/modules/permissions/entities/permission.entity.ts](/src/modules/permissions/entities/permission.entity.ts) | TypeScript | 13 | 0 | 5 | 18 |
| [src/modules/permissions/guards/permissions.guard.ts](/src/modules/permissions/guards/permissions.guard.ts) | TypeScript | 32 | 2 | 9 | 43 |
| [src/modules/permissions/permissions.controller.spec.ts](/src/modules/permissions/permissions.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/permissions/permissions.controller.ts](/src/modules/permissions/permissions.controller.ts) | TypeScript | 60 | 0 | 7 | 67 |
| [src/modules/permissions/permissions.module.ts](/src/modules/permissions/permissions.module.ts) | TypeScript | 8 | 0 | 2 | 10 |
| [src/modules/permissions/permissions.service.spec.ts](/src/modules/permissions/permissions.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/permissions/permissions.service.ts](/src/modules/permissions/permissions.service.ts) | TypeScript | 72 | 0 | 15 | 87 |
| [src/modules/roles/dto/create-role.dto.ts](/src/modules/roles/dto/create-role.dto.ts) | TypeScript | 29 | 0 | 3 | 32 |
| [src/modules/roles/dto/update-role.dto.ts](/src/modules/roles/dto/update-role.dto.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [src/modules/roles/entities/role.entity.ts](/src/modules/roles/entities/role.entity.ts) | TypeScript | 23 | 2 | 5 | 30 |
| [src/modules/roles/roles.controller.spec.ts](/src/modules/roles/roles.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/roles/roles.controller.ts](/src/modules/roles/roles.controller.ts) | TypeScript | 57 | 0 | 7 | 64 |
| [src/modules/roles/roles.module.ts](/src/modules/roles/roles.module.ts) | TypeScript | 8 | 0 | 2 | 10 |
| [src/modules/roles/roles.service.spec.ts](/src/modules/roles/roles.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/roles/roles.service.ts](/src/modules/roles/roles.service.ts) | TypeScript | 88 | 0 | 16 | 104 |
| [src/modules/users/dto/create-user.dto.ts](/src/modules/users/dto/create-user.dto.ts) | TypeScript | 15 | 0 | 3 | 18 |
| [src/modules/users/dto/update-user.dto.ts](/src/modules/users/dto/update-user.dto.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [src/modules/users/entities/user.entity.ts](/src/modules/users/entities/user.entity.ts) | TypeScript | 5 | 2 | 2 | 9 |
| [src/modules/users/users.controller.spec.ts](/src/modules/users/users.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/users/users.controller.ts](/src/modules/users/users.controller.ts) | TypeScript | 69 | 1 | 7 | 77 |
| [src/modules/users/users.module.ts](/src/modules/users/users.module.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/modules/users/users.service.spec.ts](/src/modules/users/users.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/users/users.service.ts](/src/modules/users/users.service.ts) | TypeScript | 91 | 47 | 15 | 153 |
| [src/utils/auth-decorator.util.ts](/src/utils/auth-decorator.util.ts) | TypeScript | 50 | 29 | 7 | 86 |
| [src/utils/error.util.ts](/src/utils/error.util.ts) | TypeScript | 18 | 7 | 6 | 31 |
| [src/utils/sanitize.util.ts](/src/utils/sanitize.util.ts) | TypeScript | 52 | 23 | 11 | 86 |
| [src/utils/url-format.util.ts](/src/utils/url-format.util.ts) | TypeScript | 0 | 0 | 1 | 1 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)