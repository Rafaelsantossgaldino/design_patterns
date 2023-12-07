import { PostgresDataSource } from "@/data-source";
import {CreateProductDto} from "@/dto/CreateProductDto";
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

  async create(input: CreateProductDto): Promise<Product>{
    const product = new Product
    product.name = input.name
    product.description = input.description
    product.weight = input.weight
    
    return await this.repository.save(product)
  }
}