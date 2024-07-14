import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config/serives';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  createProduct(@Body() createProductDto:CreateProductDto) {
    return this.client.send({cmd:'create_product'},createProductDto)
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto)
    return "regresa varios productos"
  }
  @Get(':id')
  async finProduct(@Param('id') id: string) {
    // try {
    //   const producto = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id })


    //   )
    //   return producto
    // } catch (error) {
    //   throw new RpcException(error)
    // }

    return this.client.send({ cmd: 'find_one_product' }, { id })
    .pipe(catchError(err=>{throw new RpcException(err)}))


  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.client.send({cmd:'delete_product'},{id}) 
    .pipe(
      catchError(err=>{throw new RpcException(err)})
    )
  }
  @Patch(':id')
  updateProduct(@Param('id',ParseIntPipe) id: number,@Body() updateProductDto: UpdateProductDto) {
    return this.client.send({cmd:'update_product'},{id,...updateProductDto})
    .pipe(
      catchError(err=>{throw new RpcException(err)})
    )
  }

}
