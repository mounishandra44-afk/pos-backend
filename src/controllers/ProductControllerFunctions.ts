import { Request, Response } from "express";
import { Product } from "../types/ProductData";
import { findProductInShop, getAllTheProductDetailsForParticularShop, saveDataFromTheFile, saveProductToShop, updateProductData } from "../services/Product";
import { INTERNAL_SERVER_ERROR } from "../constData/ErrorMessages";

import fs from "fs";
import { parse } from "fast-csv";

const mapProductForFrontend = (product: any) => {
  if (!product) return product;

  const gstEnabled = Boolean(product.gst_enabled);
  const gstRate = Number(product.gst_percentage ?? 0);

  return {
    ...product,
    productShortCut: product.shortCut_key ?? "",
    price: Number(product.product_Price ?? 0),
    gstApplicable: gstEnabled,
    gstRate,
    gst: gstEnabled ? gstRate : 0
  };
};

const mapProductsForFrontend = (products: any[]) =>
  products.map((product) => mapProductForFrontend(product));
export const saveProduct = async (req: Request<{}, {}, Product>, res: Response) => {
    try {
        const { name, category } = req.body;

        const existingProduct = await findProductInShop(req.shop_Details, name, category);

        if (existingProduct) {
            return res.status(409).json({
                isError: true,
                message: "Product already exists",
                data: `Product with name "${name}" in category "${category}" already exists.`
            });
        }

       const data = await saveProductToShop(req.body, req.shop_Details);

if (!data) {
  return res.status(500).json({
    isError: true,
    message: "Failed to save product",
  });
}

return res.status(201).json({
  isError: false,
  message: "Product saved successfully",
  data: mapProductForFrontend(data),
});


    } catch (error) {
        res.status(500).json({
            isError: true,
            message: INTERNAL_SERVER_ERROR,
            data: error
        });
    }
};


export const csvData = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ isError: true, message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const productData: any[] = [];
  const errors: string[] = [];

  let responseSent = false;

  const stream = fs
    .createReadStream(filePath, { encoding: "utf8" })
    .pipe(parse({ headers: true, trim: true }));

  stream.on("error", async (error) => {
    console.error("CSV Error:", error.message);

    if (!responseSent) {
      responseSent = true;

      await fs.promises.unlink(filePath).catch(() => {});

      return res.status(400).json({
        isError: true,
        message:
          "Invalid CSV file. Please ensure file is UTF-8 encoded and properly formatted.",
      });
    }
  });

  stream.on("data", (row: any) => {
    const name = row.product_Name?.trim();
    const category = row.category?.trim();
    const shortCut = row.shortCut_key?.trim();
    const price = Number(row.product_Price);
    const quantity = row.quantity !== undefined && row.quantity !== "" ? Number(row.quantity) : 0;
    const gstRate = row.gst_percentage !== undefined && row.gst_percentage !== "" ? Number(row.gst_percentage) : 0;
    const gstApplicableRaw = row.gst_enabled;
    const gstApplicable =
      typeof gstApplicableRaw === "string"
        ? gstApplicableRaw.trim().toLowerCase() === "true"
        : Boolean(gstApplicableRaw);

    let rowHasError = false;

    if (!name) {
      errors.push(`product_Name is required`);
      rowHasError = true;
    }

    if (!category) {
      errors.push(`category is required`);
      rowHasError = true;
    }

    if (!row.product_Price || isNaN(price) || price <= 0) {
      errors.push(`product_Price must be a number greater than 0`);
      rowHasError = true;
    }

    if (isNaN(quantity) || quantity < 0) {
      errors.push(`quantity must be a number greater than or equal to 0`);
      rowHasError = true;
    }

    if (isNaN(gstRate) || gstRate < 0 || gstRate > 50) {
      errors.push(`gst_percentage must be between 0 and 50`);
      rowHasError = true;
    }

    if (!rowHasError) {
      productData.push({
        productName: name,
        productCategory: category,
        productShortCut: shortCut || "",
        price,
        quantity,
        gstApplicable,
        gstRate,
      });
    }
  });

  stream.on("end", async () => {
    if (responseSent) return;

    await fs.promises.unlink(filePath).catch(() => {});

    if (errors.length > 0) {
      responseSent = true;
      return res.status(400).json({
        isError: true,
        message: "CSV validation errors",
        data: errors,
      });
    }

    if (productData.length === 0) {
      responseSent = true;
      return res.status(400).json({
        isError: true,
        message: "CSV file is empty or all rows invalid",
      });
    }

   
    const uniqueProducts = [];

    for (const product of productData) {
      const exists = await findProductInShop(
        req.shop_Details,
        product.productName,
        product.productCategory
      );

      if (!exists) uniqueProducts.push(product);
    }

    if (uniqueProducts.length === 0) {
      responseSent = true;
      return res.status(409).json({
        isError: true,
        message: "All products already exist in system",
      });
    }

    const result = await saveDataFromTheFile(
      uniqueProducts,
      req.shop_Details
    );

    responseSent = true;

    return res.status(result.statusCode).json({
  isError: result.isErr,
  message: result.messages,
      data: result.data ? mapProductsForFrontend(result.data) : null,
});

  });
};



export const getAllTheProductDetails=async (req:Request,res:Response) => {
    try {
      // console.log(req.shop_Details)
       const products= await getAllTheProductDetailsForParticularShop(req.shop_Details);
      //  console.log(products.messages)
        return  res.status(products.statusCode).json({
    isError: false,
    message: products.messages,
      data: mapProductsForFrontend(products.messages as any[])
  })
    } catch (error) {
        return res.status(500).json({
    isError: true,
    message: "Server error"
  });
    }
}


export const updateProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const result = await updateProductData(
      req.body,
      req.shop_Details
    );

    return res.status(result.statusCode).json({
      isError: result.isError,
      message: result.message,
      data: mapProductForFrontend(result.data),
    });
  } catch (error) {
    return res.status(500).json({
      isError: true,
      message: "Internal Server Error",
      data: null,
    });
  }
};
