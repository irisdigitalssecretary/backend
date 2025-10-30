import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodObject } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
	constructor(private readonly schema: ZodObject) {}

	transform(value: unknown) {
		try {
			const parsedValue = this.schema.parse(value)

			return parsedValue
		} catch (error) {
			if (error instanceof ZodError) {
				const validationError = fromZodError(error)

				throw new BadRequestException({
					statusCode: 400,
					message: 'Validation failed',
					errors: validationError.details,
				})
			}

			throw new BadRequestException('Validation failed')
		}
	}
}
