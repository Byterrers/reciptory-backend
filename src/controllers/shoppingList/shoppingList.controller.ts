import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Req,
  Res,
  Headers,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

// Guards.
import { AuthGuard } from '@nestjs/passport';

// Services.
import { ShoppingListService } from './shoppingList.service';

// Entities.
import { ShoppingListDto } from './dto/shoppingList.dto';

@Controller('shoppingList')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllShoppingLists(@Res() res) {
    const shoppingLists = await this.shoppingListService.getShoppingLists();
    return res.status(HttpStatus.OK).json(shoppingLists);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getShoppingList(@Param('id') shoppingListId, @Res() res) {
    const shoppingList = await this.shoppingListService.getShoppingListById(
      shoppingListId,
    );
    return res.status(HttpStatus.OK).json(shoppingList);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createShoppingList(
    @Body() createShoppingListDTO: ShoppingListDto,
    @Res() res,
  ) {
    const { name, userId, products } = createShoppingListDTO;
    const newShoppingList = await this.shoppingListService.insertShoppingList(
      userId,
      name,
      products,
    );
    return res.status(HttpStatus.OK).json(newShoppingList);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @Patch(':id')
  async updateShoppingList(
    @Param('id') shoppingListId: string,
    @Body() createShoppingListDTO: ShoppingListDto,
    @Res() res,
  ) {
    const { userId, name, products } = createShoppingListDTO;
    const updatedShoppingList = await this.shoppingListService.updateShoppingList(
      userId,
      name,
      shoppingListId,
      products
    );
    return res.status(HttpStatus.OK).json(updatedShoppingList);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteShoppingList(@Param('id') shoppingListId, @Res() res) {
    await this.shoppingListService.deleteShoppingList(shoppingListId);
    return res.status(HttpStatus.OK).json(null);
  }
}
