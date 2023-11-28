import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity('products')
export class Product {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  weight: number

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt: Date

  // criar id automaticamente se o id estiver em branco
  constructor(){
    if(!this.id){
      this.id = uuid()
    }
  }
}