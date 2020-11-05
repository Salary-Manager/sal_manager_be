import { EntityRepository, Repository } from 'typeorm';
import { Admin } from './entity/Admin.entity';

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {}
