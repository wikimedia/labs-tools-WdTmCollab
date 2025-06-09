export default [
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: '@typescript-eslint/parser',
        },
        plugins: {
            '@typescript-eslint': import('@typescript-eslint/eslint-plugin'),
        },
        rules: {
            semi: ['error', 'always'],
        },
    },
];
