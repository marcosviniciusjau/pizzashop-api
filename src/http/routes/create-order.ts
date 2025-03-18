import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import Elysia, { t } from 'elysia'
import { authentication } from '../authentication'
import { orderItems } from '@/db/schema/order-items'
import { users } from '@/db/schema/users'
import { products as productsSchema } from '@/db/schema';
import { stripe } from "@/lib/stripe";
export const createOrder = new Elysia().use(authentication).post(
  '/restaurants/:restaurantId/orders',
  async ({ params, body, set }) => {
    const { restaurantId } = params
    // @ts-ignore
    let { customerId, customerName, customerEmail, items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      set.status = 400
      return { error: 'Itens do pedido são obrigatórios.' }
    }
    if (!customerId) {
      if (!customerName || !customerEmail) {
        set.status = 400
        return { error: 'Nome e e-mail do cliente são obrigatórios quando não há customerId.' }
      }
    }
    const productIds = items.map((item) => item.productId)

    // Fetch products belonging to the specified restaurant
    const products = await db.query.products.findMany({
      where(fields, { eq, and, inArray }) {
        return and(
          eq(fields.restaurantId, restaurantId),
          inArray(fields.id, productIds),
        )
      },
    })

    // Map order items to include details such as price and subtotal
    const orderProducts = []

    for (const item of items) {
      const productOnDb = products.find((product) => product.id === item.productId)

      console.log("items", item)

      let productOnStripe = null

      if (!productOnDb) {
        // @ts-ignore
        productOnStripe = await stripe.products.retrieve(item.productId)

        if (!productOnStripe) {
          throw new Error('Some products are not available in this restaurant.')
        }

        await db.insert(productsSchema).values({
          // @ts-ignore
          id: item.productId,
          name: item.name,
          category: item.category,
          size: item.size,
          priceInCents: item.price,
          restaurantId
        })
      }

      const finalProduct = productOnDb ?? {
        id: item.productId,
        category: item.category,
        priceInCents: item.price
      }
      // @ts-ignore
      orderProducts.push({
        productId: item.productId,
        unitPriceInCents: finalProduct.priceInCents,
        quantity: item.quantity,
        category: finalProduct.category,
        subtotalInCents: item.quantity * finalProduct.priceInCents,
      })
    }


    const totalInCents = orderProducts.reduce((total, orderItem) => {
      // @ts-ignore
      return total + orderItem.subtotalInCents
    }, 0)

    const customerExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, customerId),
    })
    if (!customerExists) {
      const [newCustomer] = await db
        .insert(users)
        .values({
          name: customerName,
          email: customerEmail
        })
        .returning({ id: users.id })

      customerId = newCustomer.id!
    }
    try {
      await db.transaction(async (tx) => {
        try {
          const [order] = await tx
            .insert(orders)
            .values({
              totalInCents,
              customerId,
              restaurantId,
            })
            .returning({
              id: orders.id,
            })

          await tx.insert(orderItems).values(

            orderProducts.map((orderProduct) => ({
              orderId: order.id,
              // @ts-ignore
              productId: orderProduct.productId,
              // @ts-ignore
              priceInCents: orderProduct.unitPriceInCents,
              // @ts-ignore
              quantity: orderProduct.quantity,
            })),
          )
        } catch (transactionError) {
          console.error('Transaction error:', transactionError)
          throw new Error('Failed to complete transaction.')
        }
      })

      set.status = 201
      return { message: 'Pedido criado com sucesso' }
    } catch (error) {
      console.error('Order creation error:', error)
      set.status = 500
      return { error: 'Erro ao criar pedido' }
    }
  },
  {
    body: t.Object({
      customerId: t.Optional(t.String()),
      customerName:  t.Optional(t.String()),
      customerEmail: t.Optional(t.String()),
      items: t.Array(
        t.Object({
          productId: t.String(),
          price: t.Number({ minimum: 1 }),
          quantity: t.Integer(),
          category: t.String(),
          size:  t.Optional(t.String()),
        }),
      ),
    }),
    params: t.Object({
      restaurantId: t.String(),
    }),
  },
)
