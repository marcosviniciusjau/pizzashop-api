"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/http/server.ts
var import_elysia29 = require("elysia");
var import_cors = require("@elysiajs/cors");

// src/db/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  authLinks: () => authLinks,
  categoriesEnum: () => categoriesEnum,
  evaluations: () => evaluations,
  evaluationsRelations: () => evaluationsRelations,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orderStatusEnum: () => orderStatusEnum,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  products: () => products,
  productsRelations: () => productsRelations,
  restaurants: () => restaurants,
  restaurantsRelations: () => restaurantsRelations,
  sizesEnum: () => sizesEnum,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  usersRelations: () => usersRelations
});

// src/db/schema/users.ts
var import_drizzle_orm3 = require("drizzle-orm");
var import_pg_core3 = require("drizzle-orm/pg-core");

// src/db/schema/orders.ts
var import_pg_core2 = require("drizzle-orm/pg-core");
var import_drizzle_orm2 = require("drizzle-orm");

// src/db/schema/order-items.ts
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var import_nanoid = require("nanoid");
var orderItems = (0, import_pg_core.pgTable)("order_items", {
  id: (0, import_pg_core.text)("id").$defaultFn(() => (0, import_nanoid.nanoid)()).primaryKey(),
  orderId: (0, import_pg_core.text)("order_id").notNull().references(() => orders.id, {
    onDelete: "cascade"
  }),
  productId: (0, import_pg_core.text)("product_id").references(() => products.id, {
    onDelete: "set null"
  }),
  quantity: (0, import_pg_core.integer)("quantity").default(1),
  priceInCents: (0, import_pg_core.integer)("price_in_cents").notNull()
});
var orderItemsRelations = (0, import_drizzle_orm.relations)(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));

// src/db/schema/orders.ts
var import_nanoid2 = require("nanoid");
var orderStatusEnum = (0, import_pg_core2.pgEnum)("order_status", [
  "pending",
  "canceled",
  "processing",
  "delivering",
  "delivered"
]);
var orders = (0, import_pg_core2.pgTable)("orders", {
  id: (0, import_pg_core2.text)("id").$defaultFn(() => (0, import_nanoid2.nanoid)()).primaryKey(),
  customerId: (0, import_pg_core2.text)("customer_id").references(() => users.id, {
    onDelete: "set null"
  }).notNull(),
  restaurantId: (0, import_pg_core2.text)("restaurant_id").references(() => restaurants.id, {
    onDelete: "set null"
  }).notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalInCents: (0, import_pg_core2.integer)("total_in_cents").notNull(),
  createdAt: (0, import_pg_core2.timestamp)("created_at").defaultNow()
});
var ordersRelations = (0, import_drizzle_orm2.relations)(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id]
  }),
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id]
  }),
  orderItems: many(orderItems)
}));

// src/db/schema/users.ts
var import_nanoid3 = require("nanoid");
var userRoleEnum = (0, import_pg_core3.pgEnum)("user_role", ["manager", "customer"]);
var users = (0, import_pg_core3.pgTable)("users", {
  id: (0, import_pg_core3.text)("id").$defaultFn(() => (0, import_nanoid3.nanoid)()).primaryKey(),
  name: (0, import_pg_core3.text)("name").notNull(),
  email: (0, import_pg_core3.text)("email").notNull().unique(),
  phone: (0, import_pg_core3.text)("phone"),
  role: userRoleEnum("role").default("customer").notNull(),
  createdAt: (0, import_pg_core3.timestamp)("created_at").defaultNow(),
  updatedAt: (0, import_pg_core3.timestamp)("updated_at").defaultNow()
});
var usersRelations = (0, import_drizzle_orm3.relations)(users, ({ many }) => ({
  orders: many(orders)
}));

// src/db/schema/restaurants.ts
var import_pg_core4 = require("drizzle-orm/pg-core");
var import_drizzle_orm4 = require("drizzle-orm");

// src/env.ts
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  API_BASE_URL: import_zod.z.string().url(),
  AUTH_REDIRECT_URL: import_zod.z.string().url(),
  DB_URL: import_zod.z.string().url().min(1),
  EMAIL: import_zod.z.string(),
  RESTAURANT_EMAIL: import_zod.z.string().email(),
  JWT_SECRET_KEY: import_zod.z.string().min(1),
  RESEND_API_KEY: import_zod.z.string().min(1),
  STRIPE_SECRET_KEY: import_zod.z.string().min(1),
  DEFAULT_RESTAURANT_ID: import_zod.z.string().min(1)
});
var env = envSchema.parse(process.env);

// src/db/schema/restaurants.ts
var restaurants = (0, import_pg_core4.pgTable)("restaurants", {
  id: (0, import_pg_core4.text)("id").$defaultFn(() => env.DEFAULT_RESTAURANT_ID).primaryKey(),
  name: (0, import_pg_core4.text)("name").notNull(),
  description: (0, import_pg_core4.text)("description"),
  managerId: (0, import_pg_core4.text)("manager_id").references(() => users.id, {
    onDelete: "set null"
  }),
  createdAt: (0, import_pg_core4.timestamp)("created_at").defaultNow(),
  updatedAt: (0, import_pg_core4.timestamp)("updated_at").defaultNow()
});
var restaurantsRelations = (0, import_drizzle_orm4.relations)(restaurants, ({ one, many }) => ({
  manager: one(users, {
    fields: [restaurants.managerId],
    references: [users.id],
    relationName: "restaurantManager"
  }),
  orders: many(orders),
  products: many(products)
}));

// src/db/schema/evaluations.ts
var import_drizzle_orm5 = require("drizzle-orm");
var import_pg_core5 = require("drizzle-orm/pg-core");
var import_nanoid4 = require("nanoid");
var evaluations = (0, import_pg_core5.pgTable)("evaluations", {
  id: (0, import_pg_core5.text)("id").$defaultFn(() => (0, import_nanoid4.nanoid)()).primaryKey(),
  customerId: (0, import_pg_core5.text)("customer_id").references(() => users.id),
  restaurantId: (0, import_pg_core5.text)("restaurant_id").references(() => users.id),
  rate: (0, import_pg_core5.integer)("rate").notNull(),
  comment: (0, import_pg_core5.text)("comment"),
  createdAt: (0, import_pg_core5.timestamp)("created_at").defaultNow()
});
var evaluationsRelations = (0, import_drizzle_orm5.relations)(evaluations, ({ one }) => ({
  customer: one(users, {
    fields: [evaluations.customerId],
    references: [users.id]
  }),
  restaurant: one(restaurants, {
    fields: [evaluations.restaurantId],
    references: [restaurants.id]
  })
}));

// src/db/schema/auth-links.ts
var import_nanoid5 = require("nanoid");
var import_pg_core6 = require("drizzle-orm/pg-core");
var authLinks = (0, import_pg_core6.pgTable)("auth_links", {
  id: (0, import_pg_core6.text)("id").$defaultFn(() => (0, import_nanoid5.nanoid)()).primaryKey(),
  code: (0, import_pg_core6.text)("code").notNull().unique(),
  userId: (0, import_pg_core6.text)("user_id").references(() => users.id).notNull(),
  createdAt: (0, import_pg_core6.timestamp)("created_at").defaultNow()
});

// src/db/schema/products.ts
var import_pg_core7 = require("drizzle-orm/pg-core");
var import_drizzle_orm6 = require("drizzle-orm");
var import_nanoid6 = require("nanoid");
var categoriesEnum = (0, import_pg_core7.pgEnum)("categories", [
  "pizzas",
  "beverages",
  "savory snacks"
]);
var sizesEnum = (0, import_pg_core7.pgEnum)("sizes", [
  "small",
  "medium",
  "big"
]);
var products = (0, import_pg_core7.pgTable)("products", {
  id: (0, import_pg_core7.text)("id").$defaultFn(() => (0, import_nanoid6.nanoid)()).primaryKey(),
  name: (0, import_pg_core7.text)("name").notNull(),
  description: (0, import_pg_core7.text)("description"),
  size: sizesEnum("size"),
  category: categoriesEnum("category").default("pizzas").notNull(),
  priceInCents: (0, import_pg_core7.integer)("price_in_cents").notNull(),
  restaurantId: (0, import_pg_core7.text)("restaurant_id").references(() => restaurants.id, {
    onDelete: "cascade"
  }).notNull(),
  createdAt: (0, import_pg_core7.timestamp)("created_at").defaultNow(),
  updatedAt: (0, import_pg_core7.timestamp)("updated_at").defaultNow()
});
var productsRelations = (0, import_drizzle_orm6.relations)(products, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [products.restaurantId],
    references: [restaurants.id],
    relationName: "productRestaurant"
  }),
  orderItems: many(orderItems)
}));

// src/db/connection.ts
var import_postgres_js = require("drizzle-orm/postgres-js");
var import_postgres = __toESM(require("postgres"), 1);
var client = (0, import_postgres.default)(env.DB_URL);
var db = (0, import_postgres_js.drizzle)(client, { schema: schema_exports });

// src/http/routes/register-restaurant.ts
var import_elysia = __toESM(require("elysia"), 1);
var registerRestaurant = new import_elysia.default().post(
  "/restaurants",
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } = body;
    const [manager] = await db.insert(users).values({
      name: managerName,
      email,
      phone,
      role: "manager"
    }).returning();
    await db.insert(restaurants).values({
      name: restaurantName,
      managerId: manager.id
    });
    set.status = 204;
  },
  {
    body: import_elysia.t.Object({
      restaurantName: import_elysia.t.String(),
      managerName: import_elysia.t.String(),
      phone: import_elysia.t.String(),
      email: import_elysia.t.String({ format: "email" })
    })
  }
);

// src/http/routes/register-customer.ts
var import_elysia2 = __toESM(require("elysia"), 1);
var import_zod2 = require("zod");
var registerCustomerBodySchema = import_zod2.z.object({
  name: import_zod2.z.string().min(1),
  phone: import_zod2.z.string().optional(),
  email: import_zod2.z.string().email().optional()
});
var registerCustomer = new import_elysia2.default().post(
  "/customers",
  async ({ body, set }) => {
    const { name, phone, email } = registerCustomerBodySchema.parse(body);
    console.log("nao era pra registrar", name, email, phone);
    await db.insert(users).values({
      name,
      email,
      phone
    });
    set.status = 201;
  }
);

// src/http/routes/send-authentication-link.ts
var import_elysia3 = __toESM(require("elysia"), 1);

// src/mail/client.ts
var import_resend = require("resend");
var resend = new import_resend.Resend(env.RESEND_API_KEY);

// src/mail/templates/authentication-magic-link.tsx
var import_components = require("@react-email/components");
var import_jsx_runtime = require("react/jsx-runtime");
function AuthenticationMagicLinkTemplate({
  userEmail,
  authLink
}) {
  const previewText = `Fa\xE7a login na Pizza Shop`;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Html, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Head, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Preview, { children: previewText }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tailwind, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Body, { className: "bg-white my-auto mx-auto font-sans", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Container, { className: "border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Section, { className: "mt-[32px] text-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-2xl", children: "\u{1F355}" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Heading, { className: "text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0", children: "Fa\xE7a login na Pizza Shop" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Text, { className: "text-black text-[14px] leading-[24px]", children: [
        "Voc\xEA solicitou um link para login na Pizza Shop atrav\xE9s do email",
        " ",
        userEmail,
        "."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Section, { className: "text-center mt-[32px] mb-[32px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          className: "bg-sky-500 rounded text-white px-5 py-3 text-[12px] font-semibold no-underline text-center",
          href: authLink,
          children: "Entrar agora"
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Text, { className: "text-black text-[14px] leading-[24px]", children: [
        "ou copie a URL abaixo e cole em seu browser:",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Link, { href: authLink, className: "text-sky-500 no-underline", children: authLink })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Hr, { className: "border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Text, { className: "text-[#666666] text-[12px] leading-[24px]", children: "Se voc\xEA n\xE3o solicitou esse link de autentica\xE7\xE3o, apenas descarte esse e-mail." })
    ] }) }) })
  ] });
}

// src/http/routes/errors/unauthorized-error.ts
var UnauthorizedError = class extends Error {
  constructor() {
    super("Unauthorized.");
  }
};

// src/http/routes/send-authentication-link.ts
var import_nanoid7 = require("nanoid");
var sendAuthenticationLink = new import_elysia3.default().post(
  "/authenticate",
  async ({ body }) => {
    const { email } = body;
    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq: eq18 }) {
        return eq18(fields.email, email);
      }
    });
    if (!userFromEmail) {
      throw new UnauthorizedError();
    }
    const authLinkCode = (0, import_nanoid7.nanoid)();
    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode
    });
    const authLink = new URL("/auth-links/authenticate", env.API_BASE_URL);
    authLink.searchParams.set("code", authLinkCode);
    authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);
    console.log(authLink.toString());
    await resend.emails.send({
      from: `Pizza Shop <naoresponda@${env.EMAIL}>`,
      to: email,
      subject: "[Pizza Shop] Link para login",
      react: AuthenticationMagicLinkTemplate({
        userEmail: email,
        authLink: authLink.toString()
      })
    });
  },
  {
    body: import_elysia3.t.Object({
      email: import_elysia3.t.String({ format: "email" })
    })
  }
);

// src/http/routes/create-order.ts
var import_elysia5 = __toESM(require("elysia"), 1);

// src/http/authentication.ts
var import_elysia4 = __toESM(require("elysia"), 1);
var import_cookie = __toESM(require("@elysiajs/cookie"), 1);
var import_jwt = __toESM(require("@elysiajs/jwt"), 1);
var import_typebox = require("@sinclair/typebox");

// src/http/routes/errors/not-a-manager-error.ts
var NotAManagerError = class extends Error {
  constructor() {
    super("User is not a restaurant manager.");
  }
};

// src/http/authentication.ts
var jwtPayloadSchema = import_typebox.Type.Object({
  sub: import_typebox.Type.String(),
  restaurantId: import_typebox.Type.Optional(import_typebox.Type.String())
});
var authentication = new import_elysia4.default().error({
  UNAUTHORIZED: UnauthorizedError,
  NOT_A_MANAGER: NotAManagerError
}).onError(({ code, error, set }) => {
  switch (code) {
    case "UNAUTHORIZED":
      set.status = 401;
      return { code, message: error.message };
    case "NOT_A_MANAGER":
      set.status = 401;
      return { code, message: error.message };
  }
}).use(
  (0, import_jwt.default)({
    name: "jwt",
    secret: env.JWT_SECRET_KEY,
    schema: jwtPayloadSchema
  })
).use((0, import_cookie.default)()).derive(({ jwt: jwt2, cookie: cookie2, setCookie, removeCookie }) => {
  return {
    getCurrentUser: async () => {
      const payload = await jwt2.verify(cookie2.auth);
      if (!payload) {
        throw new UnauthorizedError();
      }
      return payload;
    },
    signUser: async (payload) => {
      setCookie("auth", await jwt2.sign(payload), {
        httpOnly: true,
        maxAge: 7 * 86400,
        path: "/"
      });
    },
    signOut: () => {
      removeCookie("auth");
    }
  };
}).derive(({ getCurrentUser }) => {
  return {
    getManagedRestaurantId: async () => {
      const { restaurantId } = await getCurrentUser();
      if (!restaurantId) {
        throw new NotAManagerError();
      }
      return restaurantId;
    }
  };
});

// src/lib/stripe.ts
var import_stripe = __toESM(require("stripe"), 1);
var stripeSecretKey = env.STRIPE_SECRET_KEY;
var stripe = new import_stripe.default(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
  appInfo: {
    name: "Pizza Shop"
  }
});

// src/http/routes/create-order.ts
var import_drizzle_orm7 = require("drizzle-orm");
var createOrder = new import_elysia5.default().use(authentication).post(
  "/restaurants/:restaurantId/orders",
  async ({ params, body, set }) => {
    const { restaurantId } = params;
    let { customerId, customerName, customerEmail, items } = body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      set.status = 400;
      return { error: "Itens do pedido s\xE3o obrigat\xF3rios." };
    }
    if (!customerId) {
      if (!customerName || !customerEmail) {
        set.status = 400;
        return { error: "Nome e e-mail do cliente s\xE3o obrigat\xF3rios quando n\xE3o h\xE1 customerId." };
      }
    }
    const productIds = items.map((item) => item.productId);
    const products2 = await db.query.products.findMany({
      where(fields, { eq: eq18, and: and10, inArray: inArray2 }) {
        return and10(
          eq18(fields.restaurantId, restaurantId),
          inArray2(fields.id, productIds)
        );
      }
    });
    const orderProducts = [];
    for (const item of items) {
      const productOnDb = products2.find((product) => product.id === item.productId);
      console.log("items", item);
      let productOnStripe = null;
      if (!productOnDb) {
        productOnStripe = await stripe.products.retrieve(item.productId);
        console.log("vou achar o erro", productOnStripe);
        if (!productOnStripe) {
          throw new Error("Some products are not available in this restaurant.");
        }
        console.log("vou achar o erro antes de inserir");
        const problema = await db.insert(products).values({
          // @ts-ignore
          id: item.productId,
          // @ts-ignore
          name: item.name,
          category: item.category,
          size: item.size,
          priceInCents: item.price,
          restaurantId
        });
        console.log("problema", problema);
      }
      const finalProduct = productOnDb ?? {
        id: item.productId,
        category: item.category,
        priceInCents: item.price
      };
      orderProducts.push({
        productId: item.productId,
        unitPriceInCents: finalProduct.priceInCents,
        quantity: item.quantity,
        category: finalProduct.category,
        subtotalInCents: item.quantity * finalProduct.priceInCents
      });
    }
    const totalInCents = orderProducts.reduce((total, orderItem) => {
      return total + orderItem.subtotalInCents;
    }, 0);
    const customerExists = await db.query.users.findFirst({
      where: (0, import_drizzle_orm7.eq)(users.email, customerEmail) || (0, import_drizzle_orm7.eq)(users.id, customerId)
    });
    if (!customerExists) {
      const [newCustomer] = await db.insert(users).values({
        // @ts-ignore
        name: customerName,
        email: customerEmail
      }).returning({ id: users.id });
      customerId = newCustomer.id;
    }
    try {
      await db.transaction(async (tx) => {
        try {
          const [order] = await tx.insert(orders).values({
            totalInCents,
            customerId: customerExists ? customerExists.id : customerId,
            restaurantId
          }).returning({
            id: orders.id
          });
          await tx.insert(orderItems).values(
            orderProducts.map((orderProduct) => ({
              orderId: order.id,
              // @ts-ignore
              productId: orderProduct.productId,
              // @ts-ignore
              priceInCents: orderProduct.unitPriceInCents,
              // @ts-ignore
              quantity: orderProduct.quantity
            }))
          );
        } catch (transactionError) {
          console.error("Transaction error:", transactionError);
          throw new Error("Failed to complete transaction.");
        }
      });
      set.status = 201;
      return { message: "Pedido criado com sucesso" };
    } catch (error) {
      console.error("Order creation error:", error);
      set.status = 500;
      return { error: "Erro ao criar pedido" };
    }
  },
  {
    body: import_elysia5.t.Object({
      customerId: import_elysia5.t.Optional(import_elysia5.t.String()),
      customerName: import_elysia5.t.Optional(import_elysia5.t.String()),
      customerEmail: import_elysia5.t.Optional(import_elysia5.t.String()),
      items: import_elysia5.t.Array(
        import_elysia5.t.Object({
          productId: import_elysia5.t.String(),
          price: import_elysia5.t.Number({ minimum: 1 }),
          quantity: import_elysia5.t.Integer(),
          category: import_elysia5.t.String(),
          size: import_elysia5.t.Optional(import_elysia5.t.String())
        })
      )
    }),
    params: import_elysia5.t.Object({
      restaurantId: import_elysia5.t.String()
    })
  }
);

// src/http/routes/approve-order.ts
var import_elysia6 = __toESM(require("elysia"), 1);
var import_drizzle_orm8 = require("drizzle-orm");
var approveOrder = new import_elysia6.default().use(authentication).patch(
  "/orders/:id/approve",
  async ({ getManagedRestaurantId: getManagedRestaurantId2, set, params }) => {
    const { id: orderId } = params;
    const restaurantId = await getManagedRestaurantId2();
    const order = await db.query.orders.findFirst({
      where(fields, { eq: eq18, and: and10 }) {
        return and10(
          eq18(fields.id, orderId),
          eq18(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      throw new UnauthorizedError();
    }
    if (order.status !== "pending") {
      set.status = 400;
      return { message: "Order was already approved before." };
    }
    await db.update(orders).set({
      status: "processing"
    }).where((0, import_drizzle_orm8.eq)(orders.id, orderId));
    set.status = 204;
  },
  {
    params: import_elysia6.t.Object({
      id: import_elysia6.t.String()
    })
  }
);

// src/http/routes/cancel-order.ts
var import_elysia7 = __toESM(require("elysia"), 1);
var import_drizzle_orm9 = require("drizzle-orm");
var cancelOrder = new import_elysia7.default().use(authentication).patch(
  "/orders/:id/cancel",
  async ({ getCurrentUser, set, params }) => {
    const { id: orderId } = params;
    const { restaurantId } = await getCurrentUser();
    if (!restaurantId) {
      set.status = 401;
      throw new Error("User is not a restaurant manager.");
    }
    const order = await db.query.orders.findFirst({
      where(fields, { eq: eq18, and: and10 }) {
        return and10(
          eq18(fields.id, orderId),
          eq18(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      set.status = 401;
      throw new Error("Order not found under the user managed restaurant.");
    }
    if (!["pending", "processing"].includes(order.status)) {
      set.status = 400;
      return {
        code: "STATUS_NOT_VALID",
        message: "O pedido n\xE3o pode ser cancelado depois de ser enviado."
      };
    }
    await db.update(orders).set({
      status: "canceled"
    }).where((0, import_drizzle_orm9.eq)(orders.id, orderId));
    set.status = 204;
  },
  {
    params: import_elysia7.t.Object({
      id: import_elysia7.t.String()
    })
  }
);

// src/http/routes/get-orders.ts
var import_elysia8 = __toESM(require("elysia"), 1);
var import_drizzle_orm10 = require("drizzle-orm");
var getOrders = new import_elysia8.default().use(authentication).get(
  "/orders",
  async ({ query, getCurrentUser, set }) => {
    const { pageIndex, orderId, customerName, status } = query;
    const { restaurantId } = await getCurrentUser();
    if (!restaurantId) {
      set.status = 401;
      throw new Error("User is not a restaurant manager.");
    }
    const baseQuery = db.select({
      orderId: orders.id,
      createdAt: orders.createdAt,
      status: orders.status,
      customerName: users.name,
      total: orders.totalInCents
    }).from(orders).innerJoin(users, (0, import_drizzle_orm10.eq)(users.id, orders.customerId)).innerJoin(orderItems, (0, import_drizzle_orm10.eq)(orderItems.orderId, orders.id)).innerJoin(products, (0, import_drizzle_orm10.eq)(products.id, orderItems.productId)).where(
      (0, import_drizzle_orm10.and)(
        (0, import_drizzle_orm10.eq)(orders.restaurantId, restaurantId),
        orderId ? (0, import_drizzle_orm10.ilike)(orders.id, `%${orderId}%`) : void 0,
        status ? (0, import_drizzle_orm10.eq)(orders.status, status) : void 0,
        customerName ? (0, import_drizzle_orm10.ilike)(users.name, `%${customerName}%`) : void 0
      )
    );
    const [ordersCount] = await db.select({ count: (0, import_drizzle_orm10.count)() }).from(baseQuery.as("baseQuery"));
    const allOrders = await baseQuery.offset(pageIndex * 10).limit(10).orderBy((fields) => {
      return [
        import_drizzle_orm10.sql`CASE ${fields.status} 
            WHEN 'pending' THEN 1
            WHEN 'processing' THEN 2
            WHEN 'delivering' THEN 3
            WHEN 'delivered' THEN 4
            WHEN 'canceled' THEN 99
          END`,
        (0, import_drizzle_orm10.desc)(fields.createdAt)
      ];
    });
    const result = {
      orders: allOrders,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: ordersCount.count
      }
    };
    return result;
  },
  {
    query: import_elysia8.t.Object({
      customerName: import_elysia8.t.Optional(import_elysia8.t.String()),
      orderId: import_elysia8.t.Optional(import_elysia8.t.String()),
      status: import_elysia8.t.Optional(
        import_elysia8.t.Union([
          import_elysia8.t.Literal("pending"),
          import_elysia8.t.Literal("canceled"),
          import_elysia8.t.Literal("processing"),
          import_elysia8.t.Literal("delivering"),
          import_elysia8.t.Literal("delivered")
        ])
      ),
      pageIndex: import_elysia8.t.Numeric({ minimum: 0 })
    })
  }
);

// src/http/routes/create-evaluation.ts
var import_elysia9 = __toESM(require("elysia"), 1);
var createEvaluation = new import_elysia9.default().use(authentication).post(
  "/evaluations",
  async ({ body, getCurrentUser, set }) => {
    const { sub: userId } = await getCurrentUser();
    const { restaurantId, rate, comment } = body;
    await db.insert(evaluations).values({
      restaurantId,
      customerName: userId,
      rate,
      comment
    });
    set.status = 201;
  },
  {
    body: import_elysia9.t.Object({
      restaurantId: import_elysia9.t.String(),
      rate: import_elysia9.t.Integer({ minimum: 1, maximum: 5 }),
      comment: import_elysia9.t.Optional(import_elysia9.t.String())
    })
  }
);

// src/http/routes/get-evaluations.ts
var import_elysia10 = __toESM(require("elysia"), 1);
var import_zod3 = require("zod");
var getEvaluations = new import_elysia10.default().use(authentication).get(
  "/evaluations",
  // @ts-ignore
  async ({ query, set, getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();
    if (!restaurantId) {
      set.status = 401;
      throw new Error("User is not a restaurant manager.");
    }
    const { pageIndex } = import_zod3.z.object({
      pageIndex: import_zod3.z.coerce.number().default(0)
    }).parse(query);
    const evaluations2 = await db.query.evaluations.findMany({
      offset: pageIndex * 10,
      limit: 10,
      orderBy: (evaluations3, { desc: desc2 }) => desc2(evaluations3.createdAt)
    });
    return evaluations2;
  },
  {
    query: import_elysia10.t.Object({
      pageIndex: import_elysia10.t.Numeric({ minimum: 0 })
    })
  }
);

// src/http/routes/update-menu.ts
var import_elysia11 = __toESM(require("elysia"), 1);
var import_drizzle_orm11 = require("drizzle-orm");
var productSchema = import_elysia11.t.Object({
  id: import_elysia11.t.Optional(import_elysia11.t.String()),
  name: import_elysia11.t.String(),
  description: import_elysia11.t.Optional(import_elysia11.t.String()),
  price: import_elysia11.t.Number({ minimum: 0 })
});
var updateMenu = new import_elysia11.default().use(authentication).put(
  "/menu",
  // @ts-ignore
  async ({ getManagedRestaurantId: getManagedRestaurantId2, set, body }) => {
    const restaurantId = await getManagedRestaurantId2();
    const {
      // @ts-ignore
      products: { deletedProductIds, newOrUpdatedProducts }
    } = body;
    if (deletedProductIds.length > 0) {
      await db.delete(products).where(
        (0, import_drizzle_orm11.and)(
          (0, import_drizzle_orm11.inArray)(products.id, deletedProductIds),
          (0, import_drizzle_orm11.eq)(products.restaurantId, restaurantId)
        )
      );
    }
    const updatedProducts = newOrUpdatedProducts.filter(
      (product) => {
        return !!product.id;
      }
    );
    if (updatedProducts.length > 0) {
      await Promise.all(
        updatedProducts.map((product) => {
          return db.update(products).set({
            name: product.name,
            description: product.description,
            priceInCents: product.price * 100
          }).where(
            (0, import_drizzle_orm11.and)(
              (0, import_drizzle_orm11.eq)(products.id, product.id),
              (0, import_drizzle_orm11.eq)(products.restaurantId, restaurantId)
            )
          );
        })
      );
    }
    const newProducts = newOrUpdatedProducts.filter(
      (product) => {
        return !product.id;
      }
    );
    if (newProducts.length) {
      await db.insert(products).values(
        newProducts.map((product) => {
          return {
            name: product.name,
            description: product.description,
            priceInCents: product.price * 100,
            restaurantId
          };
        })
      );
    }
    set.status = 204;
  },
  {
    body: import_elysia11.t.Object({
      products: import_elysia11.t.Object({
        newOrUpdatedProducts: import_elysia11.t.Array(productSchema),
        deletedProductIds: import_elysia11.t.Array(import_elysia11.t.String())
      })
    })
  }
);

// src/http/routes/update-profile.ts
var import_elysia12 = __toESM(require("elysia"), 1);
var import_drizzle_orm12 = require("drizzle-orm");
var updateProfile = new import_elysia12.default().use(authentication).put(
  "/profile",
  // @ts-ignore
  async ({ getManagedRestaurantId: getManagedRestaurantId2, set, body }) => {
    const restaurantId = await getManagedRestaurantId2();
    const { name, description } = body;
    await db.update(restaurants).set({
      name,
      description
    }).where((0, import_drizzle_orm12.eq)(restaurants.id, restaurantId));
    set.status = 204;
  },
  {
    body: import_elysia12.t.Object({
      name: import_elysia12.t.String(),
      description: import_elysia12.t.Optional(import_elysia12.t.String())
    })
  }
);

// src/http/routes/get-profile.ts
var import_elysia13 = __toESM(require("elysia"), 1);
var getProfile = new import_elysia13.default().use(authentication).get("/me", async ({ getCurrentUser }) => {
  const { sub: userId } = await getCurrentUser();
  const user = await db.query.users.findFirst({
    where(fields, { eq: eq18 }) {
      return eq18(fields.id, userId);
    }
  });
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
});

// src/http/routes/authenticate-from-link.ts
var import_elysia14 = __toESM(require("elysia"), 1);
var import_dayjs = __toESM(require("dayjs"), 1);
var import_drizzle_orm13 = require("drizzle-orm");
var authenticateFromLink = new import_elysia14.default().use(authentication).get(
  "/auth-links/authenticate",
  async ({ signUser, query, set }) => {
    const { code, redirect } = query;
    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq: eq18 }) {
        return eq18(fields.code, code);
      }
    });
    if (!authLinkFromCode) {
      throw new UnauthorizedError();
    }
    if ((0, import_dayjs.default)().diff(authLinkFromCode.createdAt, "days") > 7) {
      throw new UnauthorizedError();
    }
    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq: eq18 }) {
        return eq18(fields.managerId, authLinkFromCode.userId);
      }
    });
    await signUser({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id
    });
    await db.delete(authLinks).where((0, import_drizzle_orm13.eq)(authLinks.code, code));
    set.redirect = redirect;
  },
  {
    query: import_elysia14.t.Object({
      code: import_elysia14.t.String(),
      redirect: import_elysia14.t.String()
    })
  }
);

// src/http/routes/get-managed-restaurant.ts
var import_elysia15 = __toESM(require("elysia"), 1);
var getManagedRestaurant = new import_elysia15.default().use(authentication).get("/managed-restaurant", async ({ getManagedRestaurantId: getManagedRestaurantId2 }) => {
  const restaurantId = await getManagedRestaurantId2();
  const restaurant = await db.query.restaurants.findFirst({
    where(fields, { eq: eq18 }) {
      return eq18(fields.id, restaurantId);
    }
  });
  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }
  return restaurant;
});

// src/http/routes/sign-out.ts
var import_elysia16 = __toESM(require("elysia"), 1);
var signOut = new import_elysia16.default().use(authentication).post("/sign-out", async ({ signOut: signOut2 }) => {
  signOut2();
});

// src/http/routes/get-order-details.ts
var import_elysia17 = __toESM(require("elysia"), 1);
var getOrderDetails = new import_elysia17.default().use(authentication).get(
  "/orders/:id",
  // @ts-ignore
  async ({ getCurrentUser, params }) => {
    const { id: orderId } = params;
    const restaurantId = await getManagedRestaurantId();
    if (!restaurantId) {
      throw new NotAManagerError();
    }
    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        createdAt: true,
        status: true,
        totalInCents: true
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true
          }
        },
        orderItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true
          },
          with: {
            product: {
              columns: {
                name: true
              }
            }
          }
        }
      },
      where(fields, { eq: eq18, and: and10 }) {
        return and10(
          eq18(fields.id, orderId),
          eq18(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      throw new UnauthorizedError();
    }
    return order;
  },
  {
    params: import_elysia17.t.Object({
      id: import_elysia17.t.String()
    })
  }
);

// src/http/routes/get-month-receipt.ts
var import_elysia18 = __toESM(require("elysia"), 1);
var import_drizzle_orm14 = require("drizzle-orm");
var import_dayjs2 = __toESM(require("dayjs"), 1);
var getMonthReceipt = new import_elysia18.default().use(authentication).get("/metrics/month-receipt", async ({ getManagedRestaurantId: getManagedRestaurantId2 }) => {
  const restaurantId = await getManagedRestaurantId2();
  const today = (0, import_dayjs2.default)();
  const lastMonth = today.subtract(1, "month");
  const startOfLastMonth = lastMonth.startOf("month");
  const lastMonthWithYear = lastMonth.format("YYYY-MM");
  const currentMonthWithYear = today.format("YYYY-MM");
  const monthsReceipts = await db.select({
    monthWithYear: import_drizzle_orm14.sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
    receipt: (0, import_drizzle_orm14.sum)(orders.totalInCents).mapWith(Number)
  }).from(orders).where(
    (0, import_drizzle_orm14.and)(
      (0, import_drizzle_orm14.eq)(orders.restaurantId, restaurantId),
      (0, import_drizzle_orm14.gte)(orders.createdAt, startOfLastMonth.toDate())
    )
  ).groupBy(import_drizzle_orm14.sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`).having(({ receipt }) => (0, import_drizzle_orm14.gte)(receipt, 1));
  const currentMonthReceipt = monthsReceipts.find((monthReceipt) => {
    return monthReceipt.monthWithYear === currentMonthWithYear;
  });
  const lastMonthReceipt = monthsReceipts.find((monthReceipt) => {
    return monthReceipt.monthWithYear === lastMonthWithYear;
  });
  const diffFromLastMonth = lastMonthReceipt && currentMonthReceipt ? currentMonthReceipt.receipt * 100 / lastMonthReceipt.receipt : null;
  return {
    receipt: currentMonthReceipt?.receipt ?? 0,
    diffFromLastMonth: diffFromLastMonth ? Number((diffFromLastMonth - 100).toFixed(2)) : 0
  };
});

// src/http/routes/get-month-orders-amount.ts
var import_elysia19 = __toESM(require("elysia"), 1);
var import_drizzle_orm15 = require("drizzle-orm");
var import_dayjs3 = __toESM(require("dayjs"), 1);
var getMonthOrdersAmount = new import_elysia19.default().use(authentication).get("/metrics/month-orders-amount", async ({ getManagedRestaurantId: getManagedRestaurantId2 }) => {
  const restaurantId = await getManagedRestaurantId2();
  const today = (0, import_dayjs3.default)();
  const lastMonth = today.subtract(1, "month");
  const startOfLastMonth = lastMonth.startOf("month");
  const lastMonthWithYear = lastMonth.format("YYYY-MM");
  const currentMonthWithYear = today.format("YYYY-MM");
  const ordersPerMonth = await db.select({
    monthWithYear: import_drizzle_orm15.sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
    amount: (0, import_drizzle_orm15.count)(orders.id)
  }).from(orders).where(
    (0, import_drizzle_orm15.and)(
      (0, import_drizzle_orm15.eq)(orders.restaurantId, restaurantId),
      (0, import_drizzle_orm15.gte)(orders.createdAt, startOfLastMonth.toDate())
    )
  ).groupBy(import_drizzle_orm15.sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`).having(({ amount }) => (0, import_drizzle_orm15.gte)(amount, 1));
  const currentMonthOrdersAmount = ordersPerMonth.find((ordersInMonth) => {
    return ordersInMonth.monthWithYear === currentMonthWithYear;
  });
  const lastMonthOrdersAmount = ordersPerMonth.find((ordersInMonth) => {
    return ordersInMonth.monthWithYear === lastMonthWithYear;
  });
  const diffFromLastMonth = lastMonthOrdersAmount && currentMonthOrdersAmount ? currentMonthOrdersAmount.amount * 100 / lastMonthOrdersAmount.amount : null;
  return {
    amount: currentMonthOrdersAmount?.amount ?? 0,
    diffFromLastMonth: diffFromLastMonth ? Number((diffFromLastMonth - 100).toFixed(2)) : 0
  };
});

// src/http/routes/get-day-orders-amount.ts
var import_elysia20 = __toESM(require("elysia"), 1);
var import_drizzle_orm16 = require("drizzle-orm");
var import_dayjs4 = __toESM(require("dayjs"), 1);
var getDayOrdersAmount = new import_elysia20.default().use(authentication).get("/metrics/day-orders-amount", async ({ getManagedRestaurantId: getManagedRestaurantId2 }) => {
  const restaurantId = await getManagedRestaurantId2();
  const today = (0, import_dayjs4.default)();
  const yesterday = today.subtract(1, "day");
  const startOfYesterday = yesterday.startOf("day");
  const yesterdayWithMonthAndYear = yesterday.format("YYYY-MM-DD");
  const todayWithMonthAndYear = today.format("YYYY-MM-DD");
  const ordersPerDay = await db.select({
    dayWithMonthAndYear: import_drizzle_orm16.sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
    amount: (0, import_drizzle_orm16.count)(orders.id)
  }).from(orders).where(
    (0, import_drizzle_orm16.and)(
      (0, import_drizzle_orm16.eq)(orders.restaurantId, restaurantId),
      (0, import_drizzle_orm16.gte)(orders.createdAt, startOfYesterday.toDate())
    )
  ).groupBy(import_drizzle_orm16.sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`).having(({ amount }) => (0, import_drizzle_orm16.gte)(amount, 1));
  const todayOrdersAmount = ordersPerDay.find((orderInDay) => {
    return orderInDay.dayWithMonthAndYear === todayWithMonthAndYear;
  });
  const yesterdayOrdersAmount = ordersPerDay.find((orderInDay) => {
    return orderInDay.dayWithMonthAndYear === yesterdayWithMonthAndYear;
  });
  const diffFromYesterday = yesterdayOrdersAmount && todayOrdersAmount ? todayOrdersAmount.amount * 100 / yesterdayOrdersAmount.amount : null;
  return {
    amount: todayOrdersAmount?.amount ?? 0,
    diffFromYesterday: diffFromYesterday ? Number((diffFromYesterday - 100).toFixed(2)) : 0
  };
});

// src/http/routes/get-month-canceled-orders-amount.ts
var import_elysia21 = __toESM(require("elysia"), 1);
var import_drizzle_orm17 = require("drizzle-orm");
var import_dayjs5 = __toESM(require("dayjs"), 1);
var getMonthCanceledOrdersAmount = new import_elysia21.default().use(authentication).get(
  "/metrics/month-canceled-orders-amount",
  // @ts-ignore
  async ({ getManagedRestaurantId: getManagedRestaurantId2 }) => {
    const restaurantId = await getManagedRestaurantId2();
    const today = (0, import_dayjs5.default)();
    const lastMonth = today.subtract(1, "month");
    const startOfLastMonth = lastMonth.startOf("month");
    const lastMonthWithYear = lastMonth.format("YYYY-MM");
    const currentMonthWithYear = today.format("YYYY-MM");
    const ordersPerMonth = await db.select({
      monthWithYear: import_drizzle_orm17.sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
      amount: (0, import_drizzle_orm17.count)(orders.id)
    }).from(orders).where(
      (0, import_drizzle_orm17.and)(
        (0, import_drizzle_orm17.eq)(orders.restaurantId, restaurantId),
        (0, import_drizzle_orm17.eq)(orders.status, "canceled"),
        (0, import_drizzle_orm17.gte)(orders.createdAt, startOfLastMonth.toDate())
      )
    ).groupBy(import_drizzle_orm17.sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`).having(({ amount }) => (0, import_drizzle_orm17.gte)(amount, 1));
    const currentMonthOrdersAmount = ordersPerMonth.find((ordersInMonth) => {
      return ordersInMonth.monthWithYear === currentMonthWithYear;
    });
    const lastMonthOrdersAmount = ordersPerMonth.find((ordersInMonth) => {
      return ordersInMonth.monthWithYear === lastMonthWithYear;
    });
    const diffFromLastMonth = lastMonthOrdersAmount && currentMonthOrdersAmount ? currentMonthOrdersAmount.amount * 100 / lastMonthOrdersAmount.amount : null;
    return {
      amount: currentMonthOrdersAmount?.amount ?? 0,
      diffFromLastMonth: diffFromLastMonth ? Number((diffFromLastMonth - 100).toFixed(2)) : 0
    };
  }
);

// src/http/routes/get-daily-receipt-in-period.ts
var import_elysia22 = __toESM(require("elysia"), 1);
var import_drizzle_orm18 = require("drizzle-orm");
var import_dayjs6 = __toESM(require("dayjs"), 1);
var getDailyReceiptInPeriod = new import_elysia22.default().use(authentication).get(
  "/metrics/daily-receipt-in-period",
  // @ts-ignore
  async ({ getManagedRestaurantId: getManagedRestaurantId2, query, set }) => {
    const restaurantId = await getManagedRestaurantId2();
    const { from, to } = query;
    const startDate = from ? (0, import_dayjs6.default)(from) : (0, import_dayjs6.default)().subtract(7, "d");
    const endDate = to ? (0, import_dayjs6.default)(to) : from ? startDate.add(7, "days") : (0, import_dayjs6.default)();
    if (endDate.diff(startDate, "days") > 7) {
      set.status = 400;
      return {
        code: "INVALID_PERIOD",
        message: "O intervalo das datas n\xE3o pode ser superior a 7 dias."
      };
    }
    const receiptPerDay = await db.select({
      date: import_drizzle_orm18.sql`TO_CHAR(${orders.createdAt}, 'DD/MM')`,
      receipt: (0, import_drizzle_orm18.sum)(orders.totalInCents).mapWith(Number)
    }).from(orders).where(
      (0, import_drizzle_orm18.and)(
        (0, import_drizzle_orm18.eq)(orders.restaurantId, restaurantId),
        (0, import_drizzle_orm18.gte)(
          orders.createdAt,
          startDate.startOf("day").add(startDate.utcOffset(), "minutes").toDate()
        ),
        (0, import_drizzle_orm18.lte)(
          orders.createdAt,
          endDate.endOf("day").add(endDate.utcOffset(), "minutes").toDate()
        )
      )
    ).groupBy(import_drizzle_orm18.sql`TO_CHAR(${orders.createdAt}, 'DD/MM')`).having(({ receipt }) => (0, import_drizzle_orm18.gte)(receipt, 1));
    const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
      const [dayA, monthA] = a.date.split("/").map(Number);
      const [dayB, monthB] = b.date.split("/").map(Number);
      if (monthA === monthB) {
        return dayA - dayB;
      } else {
        const dateA = new Date(2023, monthA - 1);
        const dateB = new Date(2023, monthB - 1);
        return dateA.getTime() - dateB.getTime();
      }
    });
    return orderedReceiptPerDay;
  },
  {
    query: import_elysia22.t.Object({
      from: import_elysia22.t.Optional(import_elysia22.t.String()),
      to: import_elysia22.t.Optional(import_elysia22.t.String())
    })
  }
);

// src/http/routes/get-popular-products.ts
var import_elysia23 = __toESM(require("elysia"), 1);
var import_drizzle_orm19 = require("drizzle-orm");
var getPopularProducts = new import_elysia23.default().use(authentication).get("/metrics/popular-products", async ({ getManagedRestaurantId: getManagedRestaurantId2 }) => {
  const restaurantId = await getManagedRestaurantId2();
  try {
    const popularProducts = await db.select({
      product: products.name,
      amount: (0, import_drizzle_orm19.count)(orderItems.id)
    }).from(orderItems).leftJoin(orders, (0, import_drizzle_orm19.eq)(orders.id, orderItems.orderId)).leftJoin(products, (0, import_drizzle_orm19.eq)(products.id, orderItems.productId)).where((0, import_drizzle_orm19.and)((0, import_drizzle_orm19.eq)(orders.restaurantId, restaurantId))).groupBy(products.name).limit(5);
    return popularProducts;
  } catch (err) {
    console.log(err);
  }
});

// src/http/routes/dispatch-order.ts
var import_elysia24 = __toESM(require("elysia"), 1);
var import_drizzle_orm20 = require("drizzle-orm");
var dispatchOrder = new import_elysia24.default().use(authentication).patch(
  "/orders/:id/dispatch",
  // @ts-ignore
  async ({ getManagedRestaurantId: getManagedRestaurantId2, set, params }) => {
    const { id: orderId } = params;
    const restaurantId = await getManagedRestaurantId2();
    const order = await db.query.orders.findFirst({
      where(fields, { eq: eq18, and: and10 }) {
        return and10(
          eq18(fields.id, orderId),
          eq18(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      throw new UnauthorizedError();
    }
    if (order.status !== "processing") {
      set.status = 400;
      return { message: "O pedido j\xE1 foi enviado ao cliente." };
    }
    await db.update(orders).set({
      status: "delivering"
    }).where((0, import_drizzle_orm20.eq)(orders.id, orderId));
    set.status = 204;
  },
  {
    params: import_elysia24.t.Object({
      id: import_elysia24.t.String()
    })
  }
);

// src/http/routes/deliver-order.ts
var import_elysia25 = __toESM(require("elysia"), 1);
var import_drizzle_orm21 = require("drizzle-orm");
var deliverOrder = new import_elysia25.default().use(authentication).patch(
  "/orders/:id/deliver",
  // @ts-ignore
  async ({ getManagedRestaurantId: getManagedRestaurantId2, set, params }) => {
    const { id: orderId } = params;
    const restaurantId = await getManagedRestaurantId2();
    const order = await db.query.orders.findFirst({
      where(fields, { eq: eq18, and: and10 }) {
        return and10(
          eq18(fields.id, orderId),
          eq18(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      throw new UnauthorizedError();
    }
    if (order.status !== "delivering") {
      set.status = 400;
      return { message: "O pedido j\xE1 foi entregue." };
    }
    await db.update(orders).set({
      status: "delivered"
    }).where((0, import_drizzle_orm21.eq)(orders.id, orderId));
    set.status = 204;
  },
  {
    params: import_elysia25.t.Object({
      id: import_elysia25.t.String()
    })
  }
);

// src/http/routes/get-products.ts
var import_elysia26 = __toESM(require("elysia"), 1);
var import_drizzle_orm22 = require("drizzle-orm");
var getProducts = new import_elysia26.default().use(authentication).get("/get-products", async ({ getManagedRestaurantId: getManagedRestaurantId2 }) => {
  const restaurantId = await getManagedRestaurantId2();
  try {
    const product = await db.select({
      id: products.id,
      name: products.name,
      category: products.category,
      price: products.priceInCents
    }).from(products).where((0, import_drizzle_orm22.eq)(products.restaurantId, restaurantId)).groupBy(products.name, products.id);
    return product;
  } catch (err) {
    console.log(err);
  }
});

// src/http/routes/get-customers.ts
var import_elysia27 = __toESM(require("elysia"), 1);
var import_drizzle_orm23 = require("drizzle-orm");
var getCustomers = new import_elysia27.default().use(authentication).get("/get-customers", async ({ getManagedRestaurantId: getManagedRestaurantId2 }) => {
  const restaurantId = await getManagedRestaurantId2();
  const role = "customer";
  try {
    const customer = await db.select({
      id: users.id,
      name: users.name,
      phone: users.phone,
      email: users.email
    }).from(users).where((0, import_drizzle_orm23.and)((0, import_drizzle_orm23.eq)(users.role, role)));
    return customer;
  } catch (err) {
    console.log(err);
  }
});

// src/http/server.ts
var import_pino = __toESM(require("pino"), 1);

// src/http/routes/get-order-quantity.ts
var import_elysia28 = __toESM(require("elysia"), 1);
var getOrderQuantity = new import_elysia28.default().use(authentication).get(
  "/orders/quantity/:id",
  async ({ getCurrentUser, params }) => {
    const { id: orderId } = params;
    const { restaurantId } = await getCurrentUser();
    if (!restaurantId) {
      throw new NotAManagerError();
    }
    const order = await db.query.orders.findFirst({
      columns: {
        id: true
      },
      with: {
        orderItems: {
          columns: {
            quantity: true
          },
          with: {
            product: {
              columns: {
                name: true
              }
            }
          }
        }
      },
      where(fields, { eq: eq18, and: and10 }) {
        return and10(
          eq18(fields.id, orderId),
          eq18(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      throw new UnauthorizedError();
    }
    return order;
  },
  {
    params: import_elysia28.t.Object({
      id: import_elysia28.t.String()
    })
  }
);

// src/http/server.ts
var logger = (0, import_pino.default)();
var app = new import_elysia29.Elysia().use(
  (0, import_cors.cors)({
    credentials: true,
    allowedHeaders: ["content-type"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    origin: (request) => {
      const origin = request.headers.get("origin");
      if (!origin) {
        return false;
      }
      return true;
    }
  })
).use(authentication).use(signOut).use(getProfile).use(getManagedRestaurant).use(registerRestaurant).use(registerCustomer).use(getOrderQuantity).use(sendAuthenticationLink).use(authenticateFromLink).use(createOrder).use(approveOrder).use(cancelOrder).use(dispatchOrder).use(deliverOrder).use(getOrders).use(getOrderDetails).use(createEvaluation).use(getEvaluations).use(updateMenu).use(updateProfile).use(getMonthReceipt).use(getMonthOrdersAmount).use(getDayOrdersAmount).use(getMonthCanceledOrdersAmount).use(getDailyReceiptInPeriod).use(getPopularProducts).use(getProducts).use(getCustomers).onError(({ code, error, set }) => {
  switch (code) {
    case "VALIDATION": {
      set.status = error.status;
      return error.toResponse();
    }
    case "NOT_FOUND": {
      return new Response(null, { status: 404 });
    }
    default: {
      console.error(error);
      return new Response(null, { status: 500 });
    }
  }
});
app.listen(3333);
console.log(
  `\u{1F525} HTTP server running at ${app.server?.hostname}:${app.server?.port}`
);
//# sourceMappingURL=server.cjs.map