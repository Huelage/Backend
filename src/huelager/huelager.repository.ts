import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { Huelager } from './entities/huelager.entity';
import { Wallet } from './entities/huenit_wallet.entity';

@Injectable()
export class HuelagerRepository {
  constructor(
    @InjectRepository(Huelager)
    private readonly repository: Repository<Huelager>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async checkEmailAndPhone(params: {
    where: [{ email: string }, { phone: string }];
  }) {
    const { where } = params;
    const [{ email }, { phone }] = where;
    const existingHuelager = await this.repository.findOneBy(where);
    if (existingHuelager) {
      return {
        emailExists: existingHuelager.email === email ? true : false,
        phoneExists: existingHuelager.phone === phone ? true : false,
      };
    }
    return null;
  }

  async checkPhone(params: { where: { phone: string } }): Promise<boolean> {
    const { where } = params;
    const existingHuelager = await this.repository.findOneBy(where);

    if (existingHuelager) {
      return true;
    }
    return false;
  }

  async findHuelagerById(entityId) {
    return this.repository.findOneBy({ entityId });
  }

  async findHuelager(params: { where: FindOptionsWhere<Huelager> }) {
    const { where } = params;
    return this.repository.findOneBy(where);
  }

  async findHuelagers(params: { where: FindOptionsWhere<Huelager>[] }) {
    const { where } = params;
    return this.repository.find({ where });
  }

  async createHuelager(createHuelagerInfo: DeepPartial<Huelager>) {
    const wallet = new Wallet();
    // console.log(await this.walletRepository.save(wallet));
    const huelager = await this.repository.create(createHuelagerInfo);
    huelager.wallet = wallet;

    await this.repository.save(huelager);

    return huelager;
  }

  async save(entity: Huelager) {
    this.repository.save(entity);
  }
}
