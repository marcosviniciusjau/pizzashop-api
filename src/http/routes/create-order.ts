import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import Elysia, { t } from 'elysia'
import { authentication } from '../authentication'
import { orderItems } from '@/db/schema/order-items'
import { users } from '@/db/schema/users'

export const createOrder = new Elysia().use(authentication).post(
  '/restaurants/:restaurantId/orders',
  async ({ params, body, set }) => {
    const { restaurantId } = params
    let { customerName, customerEmail, items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      set.status = 400
      return { error: 'Itens do pedido são obrigatórios.' }
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
    const orderProducts = items.map((item) => {
      const product = products.find((product) => product.id === item.productId)

      if (!product) {
        throw new Error('Some products are not available in this restaurant.')
      }

      return {
        productId: item.productId,
        unitPriceInCents: product.priceInCents,
        quantity: item.quantity,
        category: product.category,
        subtotalInCents: item.quantity * product.priceInCents,
      }
    })

    const totalInCents = orderProducts.reduce((total, orderItem) => {
      return total + orderItem.subtotalInCents
    }, 0)

    const customerExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, customerEmail),
    })

    if (!customerExists) {
      const [newCustomer] = await db
        .insert(users)
        .values({
          name: customerName,
          email: customerEmail
        })
        .returning({ email: users.email })

      customerEmail = newCustomer.email!
    }

    try {
      await db.transaction(async (tx) => {
        try {
          const [order] = await tx
            .insert(orders)
            .values({
              totalInCents,
              customerEmail,
              restaurantId,
            })
            .returning({
              id: orders.id,
            })

          await tx.insert(orderItems).values(
            orderProducts.map((orderProduct) => ({
              orderId: order.id,
              productId: orderProduct.productId,
              priceInCents: orderProduct.unitPriceInCents,
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
      customerName: t.String(),
      customerEmail: t.String(),
      items: t.Array(
        t.Object({
          productId: t.String(),
          quantity: t.Integer(),
          category: t.String(),
          size: t.String()
        }),
      ),
    }),
    params: t.Object({
      restaurantId: t.String(),
    }),
  },
)
