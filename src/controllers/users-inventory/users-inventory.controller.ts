import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Res,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

// Guards.
import { AuthGuard } from '@nestjs/passport';

// Services.
import { UsersInventoryService } from './users-inventory.service';

// Entities.
import { UsersInventoryDto } from './dto/users-inventory.dto';

@Controller('users-inventory')
export class UsersInventoryController {
  constructor(private readonly userInventoryService: UsersInventoryService) {}

  /* UserInventory CRUD */

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUserInventories(@Res() res) {
    const userInventory = await this.userInventoryService.getUsersInventories();
    return res.status(HttpStatus.OK).json(userInventory);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserInventory(@Param('id') userInventoryId, @Res() res) {
    const userInventory = await this.userInventoryService.getUsersInventoryById(
      userInventoryId,
    );
    return res.status(HttpStatus.OK).json(userInventory);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createUserInventory(
    @Body() createUserInventoryDTO: UsersInventoryDto,
    @Res() res,
  ) {
    const {
      userId,
      refrigerator,
      freezer,
      pantry,
      others,
    } = createUserInventoryDTO;
    const newUserInventory = await this.userInventoryService.insertUsersInventory(
      userId,
      refrigerator,
      freezer,
      pantry,
      others,
    );
    return res.status(HttpStatus.OK).json(newUserInventory);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @Patch(':id')
  async updateUserInventory(
    @Param('id') userInventoryId,
    @Body() createUserInventoryDTO: UsersInventoryDto,
    @Res() res,
  ) {
    const {
      userId,
      refrigerator,
      freezer,
      pantry,
      others,
    } = createUserInventoryDTO;
    const updatedUserInventory = await this.userInventoryService.updateUsersInventory(
      userInventoryId,
      userId,
      refrigerator,
      freezer,
      pantry,
      others,
    );
    return res.status(HttpStatus.OK).json(updatedUserInventory);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUserInventory(@Param('id') userInventoryId, @Res() res) {
    await this.userInventoryService.deleteUsersInventory(userInventoryId);
    return res.status(HttpStatus.OK).json(null);
  }

  @Put(':userId/user-inventory/move-product/:productId/to/:locationId')
  async moveProduct(@Param('userId') userId, @Param('productId') productId, @Param('locationId') locationId, @Res() res) {
    await this.userInventoryService.moveProduct(userId, productId, locationId);
    return res.status(HttpStatus.OK).json(null);
  }

  /* Outsider getters */

  @Get(':id/user-inventory')
  async getUserInventoryByUserId(@Param('id') userId, @Res() res) {
    const userInventory = await this.userInventoryService.getUserInventoryByUserId(
      userId,
    );
    return res.status(HttpStatus.OK).json(userInventory);
  }
}
