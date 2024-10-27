module.exports = {
    parser: '@typescript-eslint/parser', // Menentukan parser untuk TypeScript
    extends: [
        'eslint:recommended', // Menggunakan rekomendasi dasar ESLint
        'plugin:@typescript-eslint/recommended', // Menggunakan rekomendasi dari @typescript-eslint
    ],
    parserOptions: {
        ecmaVersion: 2020, // Menggunakan fitur ECMAScript terbaru
        sourceType: 'module', // Menggunakan modul ES
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn', // Mengubah peringatan untuk penggunaan 'any'
        '@typescript-eslint/no-unused-vars': 'warn', // Mengubah peringatan untuk variabel tidak digunakan
        'prefer-const': 'warn', // Mengubah peringatan untuk penggunaan 'const'
        '@typescript-eslint/no-empty-interface': 'off', // Mematikan peringatan untuk antarmuka kosong
    },
};
