import { Request, Response} from 'express'
import { Product } from '@/entities/Product'
import { PostgresDataSource } from '@/data-source'
import { CreateDateColumn, Repository } from 'typeorm'
import { validate } from 'class-validator'
import { ProductRepository } from '@/repositories/ProductRepository'
import {CreateProductDto} from '@/dto/CreateProductDto'

class ProductController {
  private productRepository: ProductRepository

  constructor(){
    this.productRepository = new ProductRepository
  }

  findall = async(request: Request, response: Response): Promise<Response> => {
    const products = await this.productRepository.getAll()

    return response.status(200).send({
      date: products
    })
  }

  create = async(request: Request, response: Response): Promise<Response> => {
    const { name, weight, description } = request.body

    const createProductDto = new CreateProductDto
    createProductDto.name = name
    createProductDto.description = description
    createProductDto.weight = weight

    const errors = await validate(createProductDto)
    if(errors.length > 0){
      return response.status(422).send({
        error: errors
      })
    }

    const productDb = await this.productRepository.create(createProductDto)


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