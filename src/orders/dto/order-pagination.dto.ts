import { IsEnum, IsOptional } from "class-validator"
import { PaginationDto } from "src/common"
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class OrderPaginatioDto extends PaginationDto{
@IsOptional()
@IsEnum(OrderStatusList,{
    message:`Valid status are ${OrderStatusList}`
})
status:OrderStatus;
}