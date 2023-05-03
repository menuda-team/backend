import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './admins.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private adminsModel: Model<AdminDocument>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const admin = await this.adminsModel.create(createAdminDto);

    return admin.save();
  }

  findAll() {
    return this.adminsModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
