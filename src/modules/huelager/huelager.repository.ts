import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Huelager } from './entities/huelager.entity';
import { Wallet } from './entities/huenit_wallet.entity';
import { Biometric } from './entities/biometric.entity';
import { User } from './user/user.entity';
import { Vendor } from './vendor/vendor.entity';

@Injectable()
export class HuelagerRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,

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

  async findHuelager(params: { where: FindOptionsWhere<Huelager> }) {
    const { where } = params;
    return this.repository.findOne({
      where,
      relations: { user: true, vendor: true, wallet: true },
    });
  }

  async findHuelagers(params: { where: FindOptionsWhere<Huelager>[] }) {
    const { where } = params;
    return this.repository.find({
      where,
      relations: { user: true, vendor: true, wallet: true },
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

  async saveHuelager(entity: Huelager) {
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
    this.repository.delete({ entityId });
  }

  async editHuelagerInfo(params: {
    where: FindOptionsWhere<Huelager>;
    update: QueryDeepPartialEntity<Huelager>;
  }) {
    const { where, update } = params;
    return this.repository.update(where, update);
  }

  async createUser(createUserInfo: DeepPartial<User>) {
    const user = this.userRepository.create({ ...createUserInfo });
    return user;
  }

  async findUser(params: { where: FindOptionsWhere<User> }) {
    const { where } = params;
    return this.userRepository.findOne({
      where,
      relations: { entity: { wallet: true } },
    });
  }

  async saveUser(user: User) {
    this.userRepository.save(user);
  }

  async createVendor(createVendorInfo: DeepPartial<Vendor>) {
    const vendor = this.vendorRepository.create({ ...createVendorInfo });
    return vendor;
  }

  async findVendor(params: { where: FindOptionsWhere<Vendor> }) {
    const { where } = params;
    return this.vendorRepository.findOne({
      where,
      relations: {
        entity: { wallet: true },
        reviews: true,
        products: { food: true },
      },
    });
  }

  async findAllVendors() {
    return this.vendorRepository.find({
      relations: { entity: true },
    });
  }

  async findVendors(params: { where: FindOptionsWhere<Vendor>[] }) {
    const { where } = params;
    return this.vendorRepository.find({
      where,
      relations: {
        entity: true,
        reviews: true,
        products: { food: true },
      },
    });
  }

  async saveVendor(vendor: Vendor) {
    this.vendorRepository.save(vendor);
  }
}
