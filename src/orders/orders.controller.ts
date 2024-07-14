import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto, OrderPaginatioDto, StatusDto, UpdateOrderDto } from './dto/index';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config/serives';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto)
    // return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(@Query() paginationDto: OrderPaginatioDto) {

    try {
      const orders =
        await firstValueFrom(

          this.client.send('findAllOrders', paginationDto)
        )

      return orders

    } catch (error) {
      throw new RpcException(error)

    }
    // return paginationDto
    // return this.ordersService.findAll();
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id })
      )
      return order

    } catch (error) {
      throw new RpcException(error)
    }

    // return this.ordersService.findOne(+id);
  }
  @Get(':status')
  async findAllbyStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {

      // return {status,paginationDto}
      const order = await firstValueFrom(
        this.client.send('findAllOrders', { ...paginationDto, status: statusDto.status })
      )
      return order

    } catch (error) {
      throw new RpcException(error)
    }

    // return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {

    try {

      return this.client.send('changeOrderStatus', { id, ...statusDto })
    } catch (error) {
      throw new RpcException(error)
    }

  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
