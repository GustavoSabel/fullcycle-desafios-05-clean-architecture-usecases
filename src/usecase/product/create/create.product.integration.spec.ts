import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";

describe("Test find customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      name: "Product 1",
      price: 100,
    };

    const createdProduct = await usecase.execute(input);

    expect(createdProduct).toEqual({
      id: expect.any(String),
      ...input,
    });

    const dbProduct = await productRepository.find(createdProduct.id);
    expect(dbProduct.name).toEqual(input.name);
    expect(dbProduct.price).toEqual(input.price);
  });
});
