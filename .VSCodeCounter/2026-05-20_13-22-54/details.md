# Details

Date : 2026-05-20 13:22:54

Directory /home/generalegg/Project-P/blog-be/src

Total : 62 files,  1497 codes, 182 comments, 353 blanks, all 2032 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/app.module.ts](/src/app.module.ts) | TypeScript | 125 | 16 | 10 | 151 |
| [src/common/decorator/permissions.decorator.ts](/src/common/decorator/permissions.decorator.ts) | TypeScript | 4 | 1 | 1 | 6 |
| [src/common/decorator/sanitize.decorator.ts](/src/common/decorator/sanitize.decorator.ts) | TypeScript | 11 | 0 | 1 | 12 |
| [src/common/entities/base-account.abstract.ts](/src/common/entities/base-account.abstract.ts) | TypeScript | 36 | 4 | 13 | 53 |
| [src/config/namespaces/app.config.ts](/src/config/namespaces/app.config.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [src/config/namespaces/jwt.config.ts](/src/config/namespaces/jwt.config.ts) | TypeScript | 7 | 0 | 1 | 8 |
| [src/config/strategies/jwt-access.strategy.ts](/src/config/strategies/jwt-access.strategy.ts) | TypeScript | 23 | 0 | 2 | 25 |
| [src/config/strategies/jwt-refresh.strategy.ts](/src/config/strategies/jwt-refresh.strategy.ts) | TypeScript | 26 | 3 | 5 | 34 |
| [src/main.ts](/src/main.ts) | TypeScript | 73 | 13 | 15 | 101 |
| [src/modules/admins/admins.controller.spec.ts](/src/modules/admins/admins.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/admins/admins.controller.ts](/src/modules/admins/admins.controller.ts) | TypeScript | 30 | 0 | 6 | 36 |
| [src/modules/admins/admins.module.ts](/src/modules/admins/admins.module.ts) | TypeScript | 12 | 0 | 1 | 13 |
| [src/modules/admins/admins.service.spec.ts](/src/modules/admins/admins.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/admins/admins.service.ts](/src/modules/admins/admins.service.ts) | TypeScript | 58 | 7 | 16 | 81 |
| [src/modules/admins/dto/create-admin.dto.ts](/src/modules/admins/dto/create-admin.dto.ts) | TypeScript | 23 | 1 | 5 | 29 |
| [src/modules/admins/dto/update-admin.dto.ts](/src/modules/admins/dto/update-admin.dto.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/modules/admins/entities/admin.entity.ts](/src/modules/admins/entities/admin.entity.ts) | TypeScript | 5 | 2 | 1 | 8 |
| [src/modules/auth/auth.controller.spec.ts](/src/modules/auth/auth.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/auth/auth.controller.ts](/src/modules/auth/auth.controller.ts) | TypeScript | 36 | 0 | 8 | 44 |
| [src/modules/auth/auth.module.ts](/src/modules/auth/auth.module.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/modules/auth/auth.service.spec.ts](/src/modules/auth/auth.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/auth/auth.service.ts](/src/modules/auth/auth.service.ts) | TypeScript | 244 | 29 | 77 | 350 |
| [src/modules/auth/captcha.service.ts](/src/modules/auth/captcha.service.ts) | TypeScript | 41 | 4 | 8 | 53 |
| [src/modules/auth/device.service.ts](/src/modules/auth/device.service.ts) | TypeScript | 61 | 9 | 9 | 79 |
| [src/modules/auth/dto/login.dto.ts](/src/modules/auth/dto/login.dto.ts) | TypeScript | 2 | 0 | 1 | 3 |
| [src/modules/auth/dto/register.dto.ts](/src/modules/auth/dto/register.dto.ts) | TypeScript | 23 | 0 | 4 | 27 |
| [src/modules/auth/dto/reset-password.dto.ts](/src/modules/auth/dto/reset-password.dto.ts) | TypeScript | 24 | 0 | 4 | 28 |
| [src/modules/auth/entities/account-device.entity.ts](/src/modules/auth/entities/account-device.entity.ts) | TypeScript | 24 | 0 | 10 | 34 |
| [src/modules/auth/entities/auth.entity.ts](/src/modules/auth/entities/auth.entity.ts) | TypeScript | 1 | 0 | 1 | 2 |
| [src/modules/auth/guard/jwt-auth.guard.ts](/src/modules/auth/guard/jwt-auth.guard.ts) | TypeScript | 4 | 14 | 2 | 20 |
| [src/modules/auth/guard/rpc-auth.guard.ts](/src/modules/auth/guard/rpc-auth.guard.ts) | TypeScript | 17 | 12 | 4 | 33 |
| [src/modules/health/health.controller.ts](/src/modules/health/health.controller.ts) | TypeScript | 16 | 0 | 4 | 20 |
| [src/modules/health/health.module.ts](/src/modules/health/health.module.ts) | TypeScript | 9 | 0 | 3 | 12 |
| [src/modules/mail/mail.service.ts](/src/modules/mail/mail.service.ts) | TypeScript | 40 | 1 | 4 | 45 |
| [src/modules/mail/templates/reset-password.hbs](/src/modules/mail/templates/reset-password.hbs) | Handlebars | 21 | 0 | 2 | 23 |
| [src/modules/permissions/dto/create-permission.dto.ts](/src/modules/permissions/dto/create-permission.dto.ts) | TypeScript | 1 | 0 | 1 | 2 |
| [src/modules/permissions/dto/update-permission.dto.ts](/src/modules/permissions/dto/update-permission.dto.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [src/modules/permissions/entities/permission.entity.ts](/src/modules/permissions/entities/permission.entity.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [src/modules/permissions/guards/permissions.guard.ts](/src/modules/permissions/guards/permissions.guard.ts) | TypeScript | 25 | 23 | 9 | 57 |
| [src/modules/permissions/permissions.controller.spec.ts](/src/modules/permissions/permissions.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/permissions/permissions.controller.ts](/src/modules/permissions/permissions.controller.ts) | TypeScript | 28 | 0 | 7 | 35 |
| [src/modules/permissions/permissions.module.ts](/src/modules/permissions/permissions.module.ts) | TypeScript | 8 | 0 | 2 | 10 |
| [src/modules/permissions/permissions.service.spec.ts](/src/modules/permissions/permissions.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/permissions/permissions.service.ts](/src/modules/permissions/permissions.service.ts) | TypeScript | 21 | 0 | 6 | 27 |
| [src/modules/roles/dto/create-role.dto.ts](/src/modules/roles/dto/create-role.dto.ts) | TypeScript | 1 | 0 | 1 | 2 |
| [src/modules/roles/dto/update-role.dto.ts](/src/modules/roles/dto/update-role.dto.ts) | TypeScript | 3 | 0 | 2 | 5 |
| [src/modules/roles/entities/role.entity.ts](/src/modules/roles/entities/role.entity.ts) | TypeScript | 12 | 0 | 3 | 15 |
| [src/modules/roles/roles.controller.spec.ts](/src/modules/roles/roles.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/roles/roles.controller.ts](/src/modules/roles/roles.controller.ts) | TypeScript | 28 | 0 | 7 | 35 |
| [src/modules/roles/roles.module.ts](/src/modules/roles/roles.module.ts) | TypeScript | 8 | 0 | 2 | 10 |
| [src/modules/roles/roles.service.spec.ts](/src/modules/roles/roles.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/roles/roles.service.ts](/src/modules/roles/roles.service.ts) | TypeScript | 21 | 0 | 6 | 27 |
| [src/modules/users/dto/create-user.dto.ts](/src/modules/users/dto/create-user.dto.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/modules/users/dto/update-user.dto.ts](/src/modules/users/dto/update-user.dto.ts) | TypeScript | 3 | 0 | 1 | 4 |
| [src/modules/users/entities/user.entity.ts](/src/modules/users/entities/user.entity.ts) | TypeScript | 5 | 2 | 1 | 8 |
| [src/modules/users/users.controller.spec.ts](/src/modules/users/users.controller.spec.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/modules/users/users.controller.ts](/src/modules/users/users.controller.ts) | TypeScript | 37 | 0 | 7 | 44 |
| [src/modules/users/users.module.ts](/src/modules/users/users.module.ts) | TypeScript | 11 | 0 | 1 | 12 |
| [src/modules/users/users.service.spec.ts](/src/modules/users/users.service.spec.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/modules/users/users.service.ts](/src/modules/users/users.service.ts) | TypeScript | 38 | 15 | 10 | 63 |
| [src/utils/auth-decorator.ts](/src/utils/auth-decorator.ts) | TypeScript | 55 | 26 | 7 | 88 |
| [src/utils/url-format.ts](/src/utils/url-format.ts) | TypeScript | 0 | 0 | 1 | 1 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)