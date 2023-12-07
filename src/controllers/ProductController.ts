import { Request, Response} from 'express'
import { validate } from 'class-validator'
import { ProductRepository } from '@/repositories/ProductRepository'
import {CreateProductDto, UpdateProductDto} from '@/dto/ProductDto'

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

  findOne = async(request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id

    const product = await this.productRepository.find(id)

    if(!product){
      return response.status(404).send({
        error: 'Product not found'
      })
    }

    return response.status(200).send({
      date: product
    })
  }

  update = async(request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id
    const { name, weight, description } = request.body

    let product = await this.productRepository.find(id)
    if(!product){
      return response.status(404).send({
        error: 'Product not found' 
      })
    }
  
    const updateDto = new UpdateProductDto
    updateDto.id = id
    updateDto.name = name
    updateDto.description = description
    updateDto.weight = weight

    const errors = await validate(updateDto)
    if (errors.length > 0){
      return response.status(422).send({
        errors
      })
    }
    
    try {
      const productDb = await this.productRepository.update(updateDto)

      if(!productDb){
        return response.status(404).send({
          error: 'Product not found'
        })
      }

      return response.status(200).send({
        data: productDb
      })

    }catch (error) {
      return response.status(500).send({
        error: 'Internal error'
      })
    }
  }

  delete = async(request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id

    try {
      await this.productRepository.delete(id)

      return response.status(204).send({})
    }catch (error) {
      return response.status(400).send({
        error: 'Error deleting'
      })
    }
  }
}

export default new ProductController