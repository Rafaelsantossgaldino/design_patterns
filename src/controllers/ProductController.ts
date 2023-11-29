import { Request, Response} from 'express'
import { Product } from '../entities/Product'
import { PostgresDataSource } from '../data-source'
import { Repository } from 'typeorm'

class ProductController {
  private productRepository: Repository<Product>
  
  constructor(){
    this.productRepository = PostgresDataSource.getRepository(Product)
  }

  async findall(request: Request, response: Response): Promise<Response>{
    const productRepository = PostgresDataSource.getRepository(Product)

    const products = await productRepository.find()

    return response.status(200).send({
      date: products
    })
  }

  async create(request: Request, response: Response): Promise<Response>{
    const productRepository = PostgresDataSource.getRepository(Product)
    
    const produtc = new Product
    produtc.name = "Prod 1"
    produtc.weight = 90
    produtc.description = "descricao do produto"

    const productDb = await productRepository.save(produtc)


    return response.status(201).send({
      data: productDb
    })
  }
}

export default new ProductController