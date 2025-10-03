import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
	constructor() {}

	@Get()
	getHello(): string {
		return 'Yes, it is running -> Iris Chatbot API'
	}
}
