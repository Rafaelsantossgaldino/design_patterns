import { Request, Response} from 'express'
import { Product } from '@/entities/Product'
import { PostgresDataSource } from '@/data-source'
import { Repository } from 'typeorm'
import { validate } from 'class-validator'

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
    const { name, weight, description } = request.body

    const productRepository = PostgresDataSource.getRepository(Product)
    
    const product = new Product
    product.name = name
    product.weight = weight
    product.description = description

    const errors = await validate(product)
    if (errors.length > 0){
      return response.status(422).send({
        errors
      })
    }

    const productDb = await productRepository.save(product)


    return response.status(201).send({
      data: productDb
    })
  }

  async findOne(request: Request, response: Response): Promise<Response>{
    const id: string = request.params.id
    const productRepository = PostgresDataSource.getRepository(Product)
    const product = await productRepository.findOneBy({id})

    if(!product){
      return response.status(404).send({
        error: 'Product not found'
      })
    }

    return response.status(200).send({
      date: product
    })
  }

  async update(request: Request, response: Response): Promise<Response>{
    const productRepository = PostgresDataSource.getRepository(Product)
    const id: string = request.params.id
    const { name, weight, description } = request.body

    let product

    try{
      product = await productRepository.findOneByOrFail({id}) 
    }catch(error){
      return response.status(404).send({
        error: 'Product not found' 
      })
    }

    product.name = name
    product.weight = weight
    product.description = description

    const errors = await validate(product)
    if (errors.length > 0){
      return response.status(422).send({
        errors
      })
    }
    
    try {
      const productDb = await productRepository.save(product)
      return response.status(200).send({
        data: productDb
      })
    }catch (error) {
      return response.status(500).send({
        error: 'Internal error'
      })
    }
  }

  async delete(request: Request, response: Response): Promise<Response>{
    const id: string = request.params.id

    const productRepository = PostgresDataSource.getRepository(Product)
    try {
      await productRepository.delete(id)
      return response.status(204).send({})
    }catch (error) {
      return response.status(400).send({
        error: 'Error deleting'
      })
    }
  }
}

export default new ProductController