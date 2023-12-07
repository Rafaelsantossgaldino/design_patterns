import { PostgresDataSource } from "@/data-source";
import {CreateProductDto, UpdateProductDto} from "@/dto/ProductDto";
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

  async find(id: string): Promise<Product |null>{
    return await this.repository.findOneBy({id}) 
  }

  async delete(id: string){
    await this.repository.delete({id}) 
  }

  async update(input: UpdateProductDto): Promise<Product |null>{
    const product = await this.find(input.id)

    if(!product){
      return null
    }

    product.name = input.name
    product.description = input.description
    product.weight = input.weight
    
    return await this.repository.save(product)
  }
}