import type { MigrationFn } from 'umzug'
import type { PrismaClient } from '@prisma/client'

export const up: MigrationFn<{ prisma: PrismaClient }> = async ({
	context,
}) => {
	const { prisma } = context

	await prisma.country.createMany({
		data: [
			{
				name: 'Brazil',
				iso2: 'BR',
				iso3: 'BRA',
				phoneCode: '+55',
			},
		],
	})
}
