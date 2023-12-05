import { PostgresDataSource } from "@/data-source";
import { Product } from "@/entities/Product";
import { Repository } from "typeorm";

export class ProductRepository {
  private repository: Repository<Product>
  

  constructor(){
    this.repository = PostgresDataSource.getRepository(Product)
  }

  async getAll(): Promise<Product[]>{
    return await this.repository.find()
  }
}