import { Injectable } from '@nestjs/common';
import { Registration } from 'src/core/models';
import { RegistrationRepository } from 'src/core/repositories';

@Injectable()
export class RegistrationService {
    constructor(private readonly registrationRepository: RegistrationRepository) {}
    async saveRegistration(registration: Registration): Promise<Registration> {
        return await this.registrationRepository.save(registration);
    }
}
