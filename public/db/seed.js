/* eslint-disable drizzle/enforce-delete-with-where */
import { authLinks, evaluations, orders, products, restaurants, users, } from './schema';
import { db } from './connection';
import chalk from 'chalk';
import { orderItems } from './schema/order-items';
import { env } from '@/env';
/**
 * Reset database
 */
await db.delete(orderItems);
await db.delete(orders);
await db.delete(evaluations);
await db.delete(products);
await db.delete(restaurants);
await db.delete(authLinks);
await db.delete(users);
console.log(chalk.yellow('✔ Database reset'));
try {
    /**
     * Create restaurant manager
     */
    const [manager] = await db
        .insert(users)
        .values({
        name: 'Pizza Shop',
        email: env.RESTAURANT_EMAIL,
        role: 'manager',
    })
        .returning();
    console.log(chalk.yellow('✔ Created manager'));
    /**
     * Create restaurant
     */
    const [restaurant] = await db
        .insert(restaurants)
        .values({
        name: 'Pizza Pro',
        description: 'Os melhores sabores em um lugar só',
        managerId: manager.id,
    })
        .returning();
    console.log(chalk.yellow('✔ Created restaurant'));
    await db
        .insert(products)
        .values([
        {
            name: 'Frango com Catupiry',
            category: 'pizzas',
            priceInCents: 800,
            restaurantId: restaurant.id,
            description: 'Pizza recheado com frango desfiado e catupiry',
        },
        {
            name: 'Queijo',
            category: 'pizzas',
            priceInCents: 750,
            restaurantId: restaurant.id,
            description: 'Pizza recheado com queijo mussarela',
        },
        {
            name: 'Calabresa',
            category: 'pizzas',
            priceInCents: 850,
            restaurantId: restaurant.id,
            description: 'Pizza recheado com calabresa e cebola',
        },
        {
            name: 'Carne',
            category: 'pizzas',
            priceInCents: 900,
            restaurantId: restaurant.id,
            description: 'Pizza recheado com carne moída temperada',
        },
        {
            name: 'Lombinho',
            category: 'pizzas',
            priceInCents: 950,
            restaurantId: restaurant.id,
            description: 'Pizza recheado com lombinho, calabresa, tomate e orégano',
        },
        {
            name: 'Mexicano',
            category: 'pizzas',
            priceInCents: 1000,
            restaurantId: restaurant.id,
            description: 'Pizza recheado com carne moída, feijão, pimenta e cheddar',
        },
        {
            name: 'Brócolis com Ricota',
            category: 'pizzas',
            priceInCents: 850,
            restaurantId: restaurant.id,
            description: 'Pizza recheado com brócolis e ricota',
        },
        {
            name: 'Doce de Leite',
            category: 'pizzas',
            priceInCents: 800,
            restaurantId: restaurant.id,
            description: 'Pizza recheado com doce de leite',
        },
        {
            name: 'Romeu e Julieta',
            category: 'pizzas',
            priceInCents: 850,
            restaurantId: restaurant.id,
            description: 'Pizza recheado com queijo e goiabada',
        },
        {
            name: 'Coca-cola',
            category: 'beverages',
            priceInCents: 1000,
            restaurantId: restaurant.id,
            description: 'Coca-cola em lata',
        },
        {
            name: 'Fanta',
            category: 'beverages',
            priceInCents: 1000,
            restaurantId: restaurant.id,
            description: 'Fanta lata',
        },
    ])
        .returning();
    console.log(chalk.yellow('✔ Created products'));
    console.log(chalk.greenBright('Database seeded successfully!'));
    process.exit();
}
catch (error) {
    console.error(error);
}
