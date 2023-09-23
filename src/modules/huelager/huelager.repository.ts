import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Huelager } from './entities/huelager.entity';
import { Wallet } from './entities/huenit_wallet.entity';
import { Biometric } from './entities/biometric.entity';

@Injectable()
export class HuelagerRepository {
  constructor(
    @InjectRepository(Huelager)
    private readonly repository: Repository<Huelager>,
    @InjectRepository(Biometric)
    private readonly biometricRepository: Repository<Biometric>,
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
    return this.repository.findOne({
      where,
      relations: { transactions: true, user: true, vendor: true },
    });
  }

  async findHuelagers(params: { where: FindOptionsWhere<Huelager>[] }) {
    const { where } = params;
    return this.repository.find({
      where,
      relations: { transactions: true, user: true, vendor: true },
    });
  }

  async createHuelager(createHuelagerInfo: DeepPartial<Huelager>) {
    const wallet = new Wallet();
    await this.walletRepository.save(wallet);

    const huelager = await this.repository.create({
      ...createHuelagerInfo,
      wallet,
    });

    await this.repository.save(huelager);
    return huelager;
  }

  async save(entity: Huelager) {
    this.repository.save(entity);
  }

  async addBiometrics(params: { huelager: Huelager; key: string }) {
    const { huelager, key } = params;

    const biometric = new Biometric();
    biometric.key = key;
    biometric.entity = huelager;
    await this.biometricRepository.save(biometric);
  }

  async removeHuelager(entityId) {
    await this.repository.delete({ entityId });
  }

  async editHuelagerInfo(params: {
    where: FindOptionsWhere<Huelager>;
    update: QueryDeepPartialEntity<Huelager>;
  }) {
    const { where, update } = params;
    return await this.repository.update(where, update);
  }
}
