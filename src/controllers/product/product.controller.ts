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
  UseGuards
} from '@nestjs/common';

// Guards.
import { AuthGuard } from '@nestjs/passport';

// Services.
import { ProductService } from './product.service';

// Entities.
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllProducts(@Res() res) {
    const products = await this.productsService.getProducts();
    return res.status(HttpStatus.OK).json(products);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getProduct(@Param('id') productId, @Res() res) {
    const product = await this.productsService.getProductById(productId);
    return res.status(HttpStatus.OK).json(product);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createProduct(@Body() createProductDTO: ProductDto, @Res() res) {
    const {
      name,
      ingredient,
      quantity,
      unit,
      expirationDate
    } = createProductDTO;
    const newProduct = await this.productsService.insertProduct(
      name,
      ingredient,
      quantity,
      unit,
      expirationDate
    );
    return res.status(HttpStatus.OK).json(newProduct);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @Patch(':id')
  async updateProduct(
    @Param('id') productId,
    @Body() updateProductDTO: ProductDto,
    @Res() res
  ) {
    const {
      name,
      ingredient,
      quantity,
      unit,
      expirationDate
    } = updateProductDTO;
    const updatedProduct = await this.productsService.updateProduct(
      productId,
      name,
      ingredient,
      quantity,
      unit,
      expirationDate
    );
    return res.status(HttpStatus.OK).json(updatedProduct);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteProduct(@Param('id') productId, @Res() res) {
    await this.productsService.deleteProduct(productId);
    return res.status(HttpStatus.OK).json(null);
  }

  /* UserProducts */

  @Post('user-products/:id/location/:place')
  async createUserProduct(
    @Param('id') userId,
    @Param('place') place,
    @Body() createProductDTO: ProductDto,
    @Res() res
  ) {
    const {
      name,
      ingredient,
      quantity,
      unit,
      expirationDate
    } = createProductDTO;
    const newProduct = await this.productsService.insertUserProduct(
      userId,
      name,
      ingredient,
      quantity,
      unit,
      expirationDate,
      +place
    );
    return res.status(HttpStatus.OK).json(newProduct);
  }

  @Post('scanned-user-products/:id/location/:place')
  async createUserScannedProducts(
    @Param('id') userId,
    @Param('place') place,
    @Body() products: ProductDto[],
    @Res() res
  ) {
    await this.productsService.insertUserScannedProducts(
      userId,
      products,
      +place
    );
    return res.status(HttpStatus.OK).json(true);
  }

  @Delete('user-products/:userId/:productId')
  async deleteUserProduct(
    @Param('userId') userId,
    @Param('productId') productId,
    @Res() res
  ) {
    await this.productsService.deleteUserProduct(userId, productId);
    return res.status(HttpStatus.OK).json(null);
  }
}
