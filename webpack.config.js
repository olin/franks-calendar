module.exports = {
	mode: 'development',
	watch: 'true',
	module: {
		rules: [
			{
				use: [
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [
								require('tailwindcss'),
								require('autoprefixer'),
							],
						},
					},
				],
			},
		],
	},
}
