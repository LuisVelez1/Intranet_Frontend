import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'out-tsc/**', 'coverage/**', '.angular/**', 'public/**'] },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Constructor injection is supported; its migration belongs to a later phase.
      '@angular-eslint/prefer-inject': 'off',
      // Preserve callback and unfinished service signatures while checking local variables/imports.
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
  },
  {
    // Existing API/platform typing debt: keep diagnostics visible without changing contracts.
    files: [
      'src/app/core/models/user-admin.model.ts',
      'src/app/core/services/academy-api.service.ts',
      'src/app/core/services/area-agents.service.ts',
      'src/app/core/services/auth.service.ts',
      'src/app/core/services/document.service.ts',
      'src/app/core/services/news.service.ts',
      'src/app/core/services/user.service.ts',
      'src/app/pages/admin/create-users/create-user.ts',
      'src/app/pages/admin/requirements/requirements-list/requirements-list.ts',
      'src/app/pages/admin/update-users/update-users.ts',
      'src/app/pages/documents/documents.ts',
      'src/app/pages/home/home.ts',
      'src/app/pages/home-right/home-right.ts',
      'src/app/pages/requirements/pages/agents/agents.ts',
      'src/app/pages/requirements/pages/reports/reports.ts',
    ],
    rules: { '@typescript-eslint/no-explicit-any': 'warn' },
  },
  {
    // Existing API/platform typing debt: keep diagnostics visible without changing contracts.
    files: [
      'src/app/core/services/auth.service.ts',
      'src/app/core/services/birthday.service.ts',
      'src/app/core/services/news-comment.service.ts',
      'src/app/core/services/news.service.ts',
      'src/app/core/services/session.service.ts',
      'src/app/core/services/user.service.ts',
      'src/app/layouts/navbar-layout/navbar.component.ts',
    ],
    rules: { '@typescript-eslint/no-wrapper-object-types': 'warn' },
  },
  {
    // Decoding token data may throw; defer this unused variable with authentication cleanup.
    files: ['src/app/pages/profile/profile.ts'],
    rules: { '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }] },
  },
);
